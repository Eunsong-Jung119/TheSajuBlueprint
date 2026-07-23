// api/validate-coupon.js  (CommonJS · 진단용 에러 노출 포함)
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // env 확인 (없으면 여기서 원인 노출)
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(200).json({ valid: false, reason: 'no_env' });
    }
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    // body 파싱 (문자열로 올 수도 있어 방어)
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};

    const CODE = String(body.code || '').trim().toUpperCase();
    const type = (body.type === 'rate' || body.type === 'upsell') ? body.type : 'both';
    if (!CODE) return res.status(200).json({ valid: false, reason: 'empty' });

    const { data, error } = await supabase.rpc('peek_coupon', { p_code: CODE, p_type: type });
    if (error) {
      // 함수 없음/권한 문제 등 → 진단 메시지 그대로 노출
      return res.status(200).json({ valid: false, reason: 'rpc_error', detail: error.message, code: error.code });
    }
    const r = Array.isArray(data) ? data[0] : data;
    if (!r) return res.status(200).json({ valid: false, reason: 'not_found' });
    return res.status(200).json({ valid: !!r.valid, kind: r.kind, reason: r.reason });
  } catch (e) {
    // 절대 500 안 나게, 예외 내용을 응답으로 노출
    return res.status(200).json({ valid: false, reason: 'exception', detail: String(e && e.message || e) });
  }
};