// api/generate-upsell.js  (ESM — 기존 api 라우트 스타일에 맞춤)
// 흐름: buildUpsellMessages(lib/upsell-engine) → GPT-4o(JSON) → { womanCards, manCards, meta }
//      Supabase 저장 / Resend 이메일은 best-effort (실패해도 카드 응답은 정상 반환)
//
// 필요 env: OPENAI_API_KEY
// 선택 env: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, RESEND_FROM
//
// 배치: /api/generate-upsell.js   (lib/upsell-engine.js, lib/saju-engine.js 와 함께)

// lib/upsell-engine.js 는 CommonJS(module.exports) → ESM에서는 default로 받아 구조분해
import upsellEngine from '../lib/upsell-engine.js';
const { buildUpsellMessages } = upsellEngine;

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  try {
    const { upsellType, me, target, session_id, email } = req.body || {};
    if (!upsellType || !me || !target) {
      return res.status(400).json({ error: 'Missing fields (upsellType, me, target)' });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    // 1) 프롬프트 페이로드 조립
    const { messages, meta } = buildUpsellMessages(upsellType, me, target);

    // 2) GPT-4o 호출 (JSON 모드)
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.6,
        max_tokens: 2200,
        response_format: { type: 'json_object' },
        messages,
      }),
    });

    if (!gptRes.ok) {
      const errText = await gptRes.text().catch(() => '');
      console.error('[generate-upsell] OpenAI error', gptRes.status, errText);
      return res.status(502).json({ error: 'GPT request failed', status: gptRes.status });
    }

    const gptJson = await gptRes.json();
    let raw = gptJson?.choices?.[0]?.message?.content || '';
    raw = raw.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('[generate-upsell] JSON parse fail', raw.slice(0, 500));
      return res.status(502).json({ error: 'Malformed GPT output' });
    }

    const womanCards = Array.isArray(parsed.womanCards) ? parsed.womanCards : [];
    const manCards   = Array.isArray(parsed.manCards)   ? parsed.manCards   : [];
    if (womanCards.length === 0 || manCards.length === 0) {
      console.error('[generate-upsell] empty cards', parsed);
      return res.status(502).json({ error: 'Empty cards from GPT' });
    }

    const payload = { upsellType, womanCards, manCards, meta };

    // 3) Supabase 저장 (best-effort) ─────────────────────────────
    //    rate_upsell_reports 권장 컬럼:
    //    id(text PK) | session_id(text) | upsell_type(text) | target_name(text)
    //    | me(jsonb) | target(jsonb) | woman_cards(jsonb) | man_cards(jsonb) | created_at(timestamptz default now())
    const reportId = 'ups_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
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
            upsell_type: upsellType,
            target_name: (target && target.name) || null,
            me, target,
            woman_cards: womanCards,
            man_cards: manCards,
          }),
        });
        payload.reportId = reportId;
      } catch (e) {
        console.error('[generate-upsell] supabase save fail', e);
      }
    }

    // 4) Resend 이메일 (best-effort, email 있을 때만) ─────────────
    if (email && process.env.RESEND_API_KEY) {
      try {
        const tName = (target && target.name) || '그';
        const label = upsellType === 'reunion' ? '재회운 분석' : '이 남자 공략집';
        const cardBlock = (cards, heading) =>
          `<h3 style="font-family:serif;color:#1A0A12;margin:18px 0 8px;">${heading}</h3>` +
          cards.map(c =>
            `<div style="border:1px solid #eee;border-radius:10px;padding:14px;margin-bottom:8px;">
              <div style="font-weight:700;color:#1A0A12;margin-bottom:6px;">${c.icon || '🔮'} ${c.title || ''}</div>
              <div style="font-size:14px;color:#555;line-height:1.7;">${c.body || ''}</div>
              ${c.hook ? `<div style="margin-top:8px;font-size:13px;font-weight:600;color:#C23A60;">💡 ${c.hook}</div>` : ''}
            </div>`).join('');
        const html =
          `<div style="max-width:520px;margin:0 auto;font-family:sans-serif;padding:20px;">
            <div style="font-family:serif;font-size:20px;font-weight:800;color:#1A0A12;">🔮 ${tName} — ${label}</div>
            ${cardBlock(womanCards, '먼저, 너에 대해')}
            ${cardBlock(manCards, `그리고, ${tName}에 대해`)}
            <div style="font-size:11px;color:#aaa;margin-top:20px;">재미로 보는 사주 분석이에요 🙏 · sajublueprint.com</div>
          </div>`;
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Saju Blueprint <noreply@sajublueprint.com>',
            to: email,
            subject: `🔮 ${tName} ${label} 결과`,
            html,
          }),
        });
      } catch (e) {
        console.error('[generate-upsell] resend fail', e);
      }
    }

    return res.status(200).json(payload);
  } catch (e) {
    console.error('[generate-upsell] fatal', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}