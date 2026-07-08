// api/generate-upsell.js  (ESM)
// phase별 분기:
//   manTeaser   → 템플릿 기반 남자카드 2장 (GPT X, calcSaju만). { cards:[{id,lines[],basis}] }
//   womanTeaser → (구버전 호환) 템플릿 여자카드. { cards:[...] }
//   full        → 결제 후 GPT 심층 리포트 5섹션. { report:{ target_name, cards:[5] }, reportId }
//                 (+ 결제검증 / 메타CAPI / Supabase 저장 / 이메일)
//
// 필요 env: full phase에서만 OPENAI_API_KEY
//          결제검증/CAPI용: PORTONE_API_SECRET, META_PIXEL_ID, META_CAPI_TOKEN
// 선택 env: SUPABASE_URL, SUPABASE_ANON_KEY, RESEND_API_KEY, RESEND_FROM
// 배치: /api/generate-upsell.js
//   의존: lib/deep-report-engine.js (full), lib/saju-engine.js + lib/upsell-templates.js (teaser),
//         lib/payment.js (결제검증 + 메타CAPI)

import deepEngine from '../lib/deep-report-engine.js';
import sajuEngine from '../lib/saju-engine.js';
import templates from '../lib/upsell-templates.js';
import paymentLib from '../lib/payment.js';

const { buildDeepPromptMessages } = deepEngine;
const { calcSaju } = sajuEngine;
const { buildWomanCards, buildManCards } = templates;
const { verifyPortone, sendMetaPurchase } = paymentLib;

function pillarsFrom(p) {
  const h = (p.hour !== '' && p.hour != null) ? +p.hour : 12;
  const s = calcSaju(+p.year, +p.month, +p.day, h, 0, false, null);
  return { dayTG: s.dayTG, dayDZ: s.dayDZ, monthDZ: s.monthDZ };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  try {
    const { upsellType, phase, me, target, session_id, email, payment_id } = req.body || {};
    const ph = (phase === 'womanTeaser' || phase === 'manTeaser' || phase === 'full') ? phase : 'full';
    if (!me) return res.status(400).json({ error: 'Missing me' });

    // ── 여자 티저 (템플릿, GPT X) — 구버전 호환용 ──
    if (ph === 'womanTeaser') {
      const { dayTG, dayDZ, monthDZ } = pillarsFrom(me);
      const cards = buildWomanCards(dayTG, dayDZ, monthDZ);
      return res.status(200).json({ phase: ph, cards });
    }

    // ── 남자 티저 (템플릿, GPT X) ──
    if (ph === 'manTeaser') {
      if (!target) return res.status(400).json({ error: 'target required for manTeaser' });
      const { dayTG, dayDZ, monthDZ } = pillarsFrom(target);
      const cards = buildManCards(dayTG, dayDZ, monthDZ);
      return res.status(200).json({ phase: ph, cards });
    }

    // ── full: 결제 후 심층 리포트 (GPT 5섹션) ──
    if (!target) return res.status(400).json({ error: 'target required for full' });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

    // ── 결제 검증 (업셀 4,900원) ──
    // 정책은 save-rating-report.js와 동일: 명시적 미결제(status_*)만 차단.
    let _verified = null;
    if (payment_id) {
      const v = await verifyPortone(payment_id, 5900);
      if (!v.ok) {
        console.error('[generate-upsell] verify fail:', payment_id, v.reason);
        if (v.reason && v.reason.indexOf('status_') === 0) {
          return res.status(402).json({ error: 'payment_not_verified', reason: v.reason });
        }
      } else {
        _verified = v;
      }
    }

    // me: { year, month, day, hour, gender } / target: { name, year, month, day, hour }
    const messages = buildDeepPromptMessages(me, target, new Date());

    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 4000, // 5섹션 + 6개월 타임라인이라 넉넉히
        response_format: { type: 'json_object' },
        messages,
      }),
    });
    if (!gptRes.ok) {
      const t = await gptRes.text().catch(() => '');
      console.error('[generate-upsell] OpenAI error', gptRes.status, t);
      return res.status(502).json({ error: 'GPT request failed', status: gptRes.status });
    }

    const gptJson = await gptRes.json();
    let raw = (gptJson?.choices?.[0]?.message?.content || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch (e) { console.error('[generate-upsell] parse fail', raw.slice(0, 400)); return res.status(502).json({ error: 'Malformed GPT output' }); }

    const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
    if (cards.length < 5) {
      console.error('[generate-upsell] expected 5 cards, got', cards.length);
      return res.status(502).json({ error: 'Incomplete report' });
    }

    const report = {
      target_name: parsed.target_name || (target && target.name) || '그',
      cards,
    };

    const reportId = 'ups_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const payload = { phase: 'full', upsellType: upsellType || 'conquest', report, reportId };

    // ── Supabase 저장 (재접속/공유용) ──
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/rate_upsell_reports`, {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            id: reportId,
            session_id: session_id || null,
            upsell_type: upsellType || 'conquest',
            target_name: report.target_name,
            me, target,
            report,             // 5카드 전체 JSON
          }),
        });
      } catch (e) { console.error('[generate-upsell] supabase fail', e); }
    }

    // ── 이메일 발송 (5카드 구조) ──
    if (email && process.env.RESEND_API_KEY) {
      try {
        const tName = report.target_name;
        const esc = (s) => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const cardHtml = cards.map((c) => {
          let extra = '';
          if (c.timeline && Array.isArray(c.timeline)) {
            const rows = c.timeline.map(t =>
              `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0e8da;font-size:13px;"><span style="color:#8a5a2b;font-weight:600;">${esc(t.month)} ${esc(t.emoji || '')}</span><span style="color:#3a322a;">${esc(t.verdict || '')}</span></div>`
            ).join('');
            extra = `<div style="margin-top:10px;">${rows}</div>`;
            if (c.best_time) extra += `<div style="margin-top:10px;font-size:13px;color:#1a1410;">🔥 <b>가장 좋은 시기</b> · ${esc(c.best_time.month)} — ${esc(c.best_time.reason)}</div>`;
            if (c.caution_time) extra += `<div style="margin-top:6px;font-size:13px;color:#1a1410;">⚠️ <b>주의 시기</b> · ${esc(c.caution_time.month)} — ${esc(c.caution_time.reason)}</div>`;
            if (c.tip) extra += `<div style="margin-top:8px;font-size:13px;font-weight:600;color:#C23A60;">${esc(c.tip)}</div>`;
          }
          return `<div style="border:1px solid #ece3d3;border-radius:12px;padding:16px;margin-bottom:10px;background:#fff;">
            <div style="font-weight:700;color:#1a1410;font-size:15px;margin-bottom:4px;">${esc(c.title)}</div>
            <div style="font-size:12px;color:#b09a78;margin-bottom:8px;">${esc(c.subtitle || '')}</div>
            <div style="font-size:14px;color:#3a322a;line-height:1.75;">${esc(c.body || c.approach || '')}</div>
            ${extra}
          </div>`;
        }).join('');

        const webUrl = `https://sajublueprint.com/rate?upsell=${reportId}`;
        const html = `<div style="max-width:560px;margin:0 auto;font-family:sans-serif;padding:20px;background:#faf6ef;">
          <div style="font-family:serif;font-size:21px;font-weight:800;color:#1a1410;margin-bottom:4px;">🔮 ${esc(tName)} 심층 분석 리포트</div>
          <div style="font-size:13px;color:#8a8a94;margin-bottom:16px;">사주명리 기반 · The Saju Blueprint</div>
          <a href="${webUrl}" style="display:block;text-align:center;background:#1a1410;color:#f0e6d4;text-decoration:none;font-size:14px;font-weight:700;padding:14px;border-radius:12px;margin-bottom:18px;">🔮 웹에서 전체 리포트 보기</a>
          ${cardHtml}
          <a href="${webUrl}" style="display:block;text-align:center;background:#c9a96a;color:#fff;text-decoration:none;font-size:13px;font-weight:700;padding:12px;border-radius:10px;margin-top:16px;">전체 리포트 다시 보기 →</a>
          <div style="font-size:11px;color:#aaa;margin-top:20px;text-align:center;">재미로 보는 사주 분석이에요 🙏 · sajublueprint.com</div>
        </div>`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Saju Blueprint <noreply@sajublueprint.com>',
            to: email,
            subject: `🔮 ${tName} 심층 분석 결과`,
            html,
          }),
        });
      } catch (e) { console.error('[generate-upsell] resend fail', e); }
    }

    // ── 검증 통과 시에만 메타 CAPI Purchase 전송 (업셀 4,900원) ──
    if (_verified) {
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      await sendMetaPurchase({
        paymentId: payment_id,
        value: _verified.amount,
        contentName: '남자 심층 분석',
        email,
        ip,
        ua: req.headers['user-agent'],
      });
    }

    return res.status(200).json(payload);
  } catch (e) {
    console.error('[generate-upsell] fatal', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}