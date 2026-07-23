// api/generate-upsell.js  (ESM)
// phase별 분기:
//   manTeaser   → 템플릿 기반 남자카드 2장 (GPT X, calcSaju만). { cards:[{id,lines[],basis}] }
//   womanTeaser → (구버전 호환) 템플릿 여자카드. { cards:[...] }
//   full        → 결제 후 GPT 심층 리포트 4섹션. { report:{ target_name, sections:[4] }, reportId }
//                 (+ 결제검증 / 메타CAPI / Supabase 저장 / 이메일)
//
// ★변경(full phase): 한 방 생성 → 섹션 4개 병렬 생성 + 섹션별 재시도★
//   - 모델을 gpt-4o-mini → gpt-4o 로 상향 (프롬프트/퓨샷이 이미 rate 수준이라 모델만 올리면 품질↑)
//   - 4섹션을 각각 별도 콜로 동시에 생성. 각 콜은 동일한 [사용자][상대] 사주 팩트 + few-shot을
//     공유하고, 마지막 user 턴에만 "이 섹션 하나만" 지시를 덧붙여 출력만 좁힘 → 인물 일관성 유지.
//   - 섹션당 max_tokens 3000 → 각 콜이 짧아서 타임아웃/잘림 회피. 4개 동시라 wall-clock은 최장 1개 수준.
//   - 섹션별 3회 백오프 재시도. 한 섹션이라도 최종 실패하면 엉성한 리포트 대신 502(에러 모달 경로).
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
// ★ 섹션 병렬 + 재시도로 각 콜은 짧지만, 재시도 누적 여유를 위해 300s (Vercel Pro 기준).
//   Pro가 아니면 180으로 낮춰. 정상 경로 wall-clock은 30~50s 수준이라 실제로는 더 빨라짐.
export const config = { maxDuration: 300 };

const { buildDeepPromptMessages } = deepEngine;
const { calcSaju } = sajuEngine;
const { buildWomanCards, buildManCards } = templates;
const { verifyPortone, sendMetaPurchase } = paymentLib;

// 심층 리포트 4섹션 스펙 (제목은 DEEP_SYSTEM_PROMPT의 섹션 제목과 정확히 일치해야 함)
const SECTION_SPECS = [
  { id: 1, title: '그는 어떤 여자에게 무너질까', count: 3 },
  { id: 2, title: "그의 '진짜' 연애 스타일", count: 5 },
  { id: 3, title: '우리가 이별한다면 그 이유는', count: 5 },
  { id: 4, title: '그는 바람끼가 있을까', count: 3 },
];

// fetch에 타임아웃 (하나가 멈춰도 함수 전체가 매달리지 않게)
async function fetchT(url, ms, opts) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ac.signal }); }
  finally { clearTimeout(t); }
}

function pillarsFrom(p) {
  const h = (p.hour !== '' && p.hour != null) ? +p.hour : 12;
  const s = calcSaju(+p.year, +p.month, +p.day, h, 0, false, null);
  return { dayTG: s.dayTG, dayDZ: s.dayDZ, monthDZ: s.monthDZ };
}

// ── 섹션 1개 생성 (공유 컨텍스트 + "이 섹션만" 지시) ──
async function generateOneSection(baseMessages, spec) {
  // baseMessages = [system, fewshot_user, fewshot_assistant, userMessage]
  // 마지막 user 턴에 "이 섹션 하나만" 지시를 덧붙여 출력만 좁힘 (앞의 모든 규칙은 그대로 적용)
  const dir =
    '\n\n━━━━━━━━━━━━━━━━━━━━\n' +
    '★이번 요청 출력 형식 (위의 모든 지시보다 우선)★\n' +
    `이번엔 **섹션 ${spec.id} "${spec.title}" 하나만** 작성해. 이 섹션의 subsection ${spec.count}개를 전부, ` +
    '앞의 규칙(각 body 정확히 4문장·공백 제외 130~170자·근거 다양화·checkpoint 필수)을 그대로 지켜서 써.\n' +
    `섹션 ${spec.id} 외의 다른 섹션(1~4 중 나머지)은 **절대 출력하지 마.**\n` +
    '아래 JSON 스키마 그대로만 응답(다른 텍스트 없이):\n' +
    `{"sections":[{"id":${spec.id},"title":"${spec.title}","subsections":[{"subtitle":"...","body":"...","checkpoint":"→ ..."}],"evidence":"..."}]}`;

  const msgs = baseMessages.map((m) => ({ role: m.role, content: m.content }));
  msgs[msgs.length - 1] = { role: 'user', content: msgs[msgs.length - 1].content + dir };

  const gptRes = await fetchT('https://api.openai.com/v1/chat/completions', 70000, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.85,
      max_tokens: 4000, // 섹션 1개(≤5 subsection, body 210~290자)에 여유. 병렬이라 4개 동시.
      response_format: { type: 'json_object' },
      messages: msgs,
    }),
  });
  if (!gptRes.ok) {
    const t = await gptRes.text().catch(() => '');
    throw new Error(`OpenAI ${gptRes.status} ${t.slice(0, 140)}`);
  }
  const gptJson = await gptRes.json();
  const raw = (gptJson?.choices?.[0]?.message?.content || '').replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(raw); // 파싱 실패 시 throw → 재시도

  // 모델이 {sections:[...]} 로 감싸거나, 바로 섹션 객체를 주는 경우 모두 흡수
  let sec = Array.isArray(parsed.sections)
    ? (parsed.sections.find((s) => Number(s.id) === spec.id) || parsed.sections[0])
    : (parsed && Array.isArray(parsed.subsections) ? parsed : null);

  if (!sec || !Array.isArray(sec.subsections) || sec.subsections.length < spec.count) {
    throw new Error(`섹션 ${spec.id} 형식 미달 (subsection ${sec && sec.subsections ? sec.subsections.length : 0}/${spec.count})`);
  }
  return {
    id: spec.id,
    title: sec.title || spec.title,
    subsections: sec.subsections.slice(0, spec.count), // 초과 생성 시 정규화
    evidence: sec.evidence || '',
  };
}

// ── 섹션 1개 생성 + 3회 백오프 재시도 ──
async function generateSectionWithRetry(baseMessages, spec) {
  const _sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await _sleep(attempt === 1 ? 500 : 1500);
      return await generateOneSection(baseMessages, spec);
    } catch (e) {
      lastErr = e;
      console.warn(`[generate-upsell] 섹션 ${spec.id} ${attempt + 1}차 실패`, e && e.message);
    }
  }
  throw lastErr || new Error(`섹션 ${spec.id} 실패`);
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
    const { upsellType, phase, me, target, session_id, email, payment_id, coupon_code, fbp, fbc } = req.body || {};
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

    // ── full: 결제 후 심층 리포트 (GPT 4섹션 병렬) ──
    if (!target) return res.status(400).json({ error: 'target required for full' });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

    // ── 무료 쿠폰 (있으면 결제 대신 서버가 원자적으로 1회 차감) — GPT 호출 전에 검사 ──
    if (coupon_code) {
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        return res.status(500).json({ error: 'coupon_backend_unavailable' });
      }
      try {
        const _cr = await fetchT(`${process.env.SUPABASE_URL}/rest/v1/rpc/redeem_coupon`, 8000, {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ p_code: String(coupon_code).toUpperCase(), p_type: 'upsell', p_session: session_id || null, p_email: email || null }),
        });
        const _arr = await _cr.json().catch(() => null);
        const _r = Array.isArray(_arr) ? _arr[0] : _arr;
        if (!_cr.ok || !_r || !_r.ok) {
          console.error('[generate-upsell] coupon reject:', coupon_code, (_r && _r.reason));
          return res.status(403).json({ error: 'coupon_' + ((_r && _r.reason) || 'invalid') });
        }
        console.log('[generate-upsell] coupon ok:', String(coupon_code).toUpperCase());
      } catch (e) {
        console.error('[generate-upsell] coupon error', e);
        return res.status(403).json({ error: 'coupon_error' });
      }
    }

    // ── 결제 검증 (업셀 5,900원) ──
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
    // 공유 컨텍스트(사주 팩트 + few-shot)를 1번 만들어, 4섹션 콜이 전부 이걸 공유 → 인물 일관성 고정
    const baseMessages = buildDeepPromptMessages(me, target, new Date());

    // ── 4섹션 병렬 생성 (섹션별 3회 재시도) ──
    const settled = await Promise.allSettled(SECTION_SPECS.map((spec) => generateSectionWithRetry(baseMessages, spec)));
    const failedTitles = settled.map((r, i) => (r.status === 'rejected' ? SECTION_SPECS[i].title : null)).filter(Boolean);
    if (failedTitles.length) {
      // 한 섹션이라도 최종 실패하면 엉성한 리포트 대신 통째로 실패 (프론트 에러 모달 → 문의/환불)
      const why = settled.map((r) => (r.status === 'rejected' && r.reason && r.reason.message)).filter(Boolean)[0] || '';
      console.error('[generate-upsell] 섹션 최종 실패:', failedTitles, '::', why);
      return res.status(502).json({ error: 'section_generation_failed', failed: failedTitles });
    }
    const sections = settled.map((r) => r.value).sort((a, b) => a.id - b.id);

    const report = {
      target_name: (target && target.name) || '그',
      sections,
    };

    const reportId = 'ups_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const payload = { phase: 'full', upsellType: upsellType || 'conquest', report, reportId };

    // ── Supabase 저장 (재접속/공유용) ──
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        await fetchT(`${process.env.SUPABASE_URL}/rest/v1/rate_upsell_reports`, 8000, {
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
            report,             // 4섹션 전체 JSON
          }),
        });
      } catch (e) { console.error('[generate-upsell] supabase fail', e); }
    }

    // ── 이메일 발송 (섹션 구조) ──
    if (email && process.env.RESEND_API_KEY) {
      try {
        const tName = report.target_name;
        const esc = (s) => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const cardHtml = sections.map((sec) => {
          let innerHtml = '';
          // 섹션 1~4: subsections 구조
          if (Array.isArray(sec.subsections) && sec.subsections.length) {
            innerHtml = sec.subsections.map(ss =>
              `<div style="margin-bottom:10px;">
                <div style="font-size:12px;font-weight:600;color:#8a5a2b;margin-bottom:4px;">${esc(ss.subtitle || '')}</div>
                <div style="font-size:13px;color:#3a322a;line-height:1.7;">${esc(ss.body || '')}</div>
                ${ss.checkpoint ? `<div style="margin-top:6px;font-size:12px;color:#8a5a2b;background:#f6ede0;border-radius:7px;padding:6px 10px;">${esc(ss.checkpoint)}</div>` : ''}
              </div>`
            ).join('<hr style="border:none;border-top:1px solid #ece3d3;margin:8px 0;">');
          }
          // 섹션 5: timeline 구조 (현재 미사용, 구조 호환 유지)
          if (Array.isArray(sec.timeline)) {
            if (sec.approach) innerHtml += `<div style="font-size:13px;color:#3a322a;margin-bottom:10px;">${esc(sec.approach)}</div>`;
            const rows = sec.timeline.map(t =>
              `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0e8da;font-size:13px;"><span style="color:#8a5a2b;font-weight:600;">${esc(t.month)} ${esc(t.emoji || '')}</span><span style="color:#3a322a;">${esc(t.verdict || '')}</span></div>`
            ).join('');
            innerHtml += `<div style="margin-top:6px;">${rows}</div>`;
            if (sec.best_time) innerHtml += `<div style="margin-top:10px;font-size:13px;color:#1a1410;">🔥 <b>가장 좋은 시기</b> · ${esc(sec.best_time.month)} — ${esc(sec.best_time.reason)}</div>`;
            if (sec.caution_time) innerHtml += `<div style="margin-top:6px;font-size:13px;color:#1a1410;">⚠️ <b>주의 시기</b> · ${esc(sec.caution_time.month)} — ${esc(sec.caution_time.reason)}</div>`;
            if (sec.tip) innerHtml += `<div style="margin-top:8px;font-size:13px;font-weight:600;color:#C23A60;">${esc(sec.tip)}</div>`;
          }
          return `<div style="border:1px solid #ece3d3;border-radius:12px;padding:16px;margin-bottom:10px;background:#fff;">
            <div style="font-weight:700;color:#1a1410;font-size:15px;margin-bottom:4px;">${esc(sec.title || '')}</div>
            ${innerHtml}
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

        await fetchT('https://api.resend.com/emails', 8000, {
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

    // ── 검증 통과 시에만 메타 CAPI Purchase 전송 (업셀 5,900원) ──
    if (_verified) {
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      await sendMetaPurchase({
        paymentId: payment_id,
        value: _verified.amount,
        contentName: '남자 심층 분석',
        contentId: 'upsell',           // 프론트 픽셀 content_ids와 동일
        email,
        ip,
        ua: req.headers['user-agent'],
        fbp,                           // 매칭률↑
        fbc,
      });
    }

    return res.status(200).json(payload);
  } catch (e) {
    console.error('[generate-upsell] fatal', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}