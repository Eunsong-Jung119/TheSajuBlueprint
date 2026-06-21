// api/track-rate.js  (CommonJS) — 통합 로깅 엔드포인트
// 한국어(rate_logs) + 영어(user_logs) 둘 다 처리. lang으로 테이블 분기.
//   body.lang === 'en'  → user_logs (구 /api/track 동작 호환: event/event_name, country 저장)
//   그 외(기본 한국어)   → rate_logs
// 배치: /api/track-rate.js  (기존 /api/track.js 는 삭제 후, 영어 호출처를 이 URL로 변경)

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  const {
    lang,
    event, event_name, session_id,
    metadata, source, medium, campaign, referrer,
  } = req.body || {};

  const name = event_name || event || 'unknown';
  if (!name || name === 'unknown') {
    // 영어 구버전은 unknown도 받았지만, 최소한의 방어
    if (!event && !event_name) return res.status(400).json({ error: 'Missing event_name' });
  }

  const serverReferrer = req.headers['referer'] || req.headers['referrer'] || null;
  const userAgent = req.headers['user-agent'] || null;

  // ── 영어판: user_logs (기존 track.js 동작 보존) ──
  if (lang === 'en') {
    const country = req.headers['x-vercel-ip-country'] || 'unknown';
    const clientReferrer = referrer || (metadata && metadata.referrer) || null;
    const meta = {
      ...(metadata || { source, medium, campaign }),
      country,
      referrer: clientReferrer || serverReferrer || null,
      server_referrer: serverReferrer || null,
      user_agent: userAgent,
    };
    try {
      await supabase.from('user_logs').insert([{
        event_name: name,
        session_id: session_id || null,
        metadata: meta,
      }]);
    } catch (e) { /* 기존 동작: 에러 삼킴 */ }
    return res.status(200).json({ ok: true });
  }

  // ── 한국어판: rate_logs (기본) ──
  const { error } = await supabase
    .from('rate_logs')
    .insert({
      event_name: name,
      session_id: session_id || null,
      metadata: {
        ...(metadata || {}),
        user_agent: userAgent,
        referrer: serverReferrer,
      },
    });

  if (error) {
    console.error('[track-rate] supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ ok: true });
};