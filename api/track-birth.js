// api/track-birth.js — 출산택일 퍼널 이벤트 로깅 (birth_logs 테이블)
// rate의 track-rate.js와 동일 패턴. 클라이언트가 event_name/session_id/metadata 를 POST → birth_logs insert.
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const ALLOW = ['https://sajublueprint.com','https://www.sajublueprint.com','https://fatelab.co','https://www.fatelab.co'];
const MAX = 500;
const clip = (v, n = MAX) => (typeof v === 'string' && v.length > n) ? v.slice(0, n) + '…' : v;

module.exports = async function handler(req, res) {
  const origin = ALLOW.includes(req.headers.origin) ? req.headers.origin : 'https://fatelab.co';
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (req.method !== 'POST') return res.status(405).end();

  // navigator.sendBeacon 은 text/plain 이라 body가 문자열로 옴 → 파싱 방어
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  const name = body.event_name || body.event || 'unknown';
  if (!name || name === 'unknown') return res.status(400).json({ error: 'Missing event_name' });

  const serverReferrer = req.headers['referer'] || req.headers['referrer'] || null;
  const userAgent = req.headers['user-agent'] || null;
  const md = body.metadata || {};
  const meta = {
    ...md,
    referrer: md.referrer || serverReferrer || null,
    server_referrer: serverReferrer || null,
    user_agent: userAgent,
  };
  // 문자열 필드 길이 제한 (로우 비대화 방지)
  ['message', 'stack', 'page', 'code'].forEach(k => { if (meta[k]) meta[k] = clip(meta[k], k === 'stack' ? 1000 : MAX); });

  try {
    const { error } = await supabase.from('birth_logs').insert({
      event_name: String(name).slice(0, 60),
      session_id: body.session_id || null,
      metadata: meta,
    });
    if (error) {
      console.error('[track-birth]', error.message, '| event:', name);
      return res.status(200).json({ ok: false });   // 로깅 실패가 앱을 막지 않게 200
    }
  } catch (e) {
    console.error('[track-birth] exception', e && e.message);
    return res.status(200).json({ ok: false });
  }
  return res.status(200).json({ ok: true });
};
