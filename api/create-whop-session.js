const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_PLAN_ID = 'plan_VegawRTWadrLi';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sessionId = crypto.randomBytes(16).toString('hex');

  // v5 checkout_configurations API 시도 (SDK의 sessionId prop과 호환)
  // 기존 plan_id를 inline plan으로 넘기는 방식
  let whopCheckoutId;

  const attempts = [
    // 시도 1: plan_id 직접
    {
      url: 'https://api.whop.com/api/v5/checkout_configurations',
      body: { plan_id: WHOP_PLAN_ID, metadata: { session_id: sessionId } }
    },
    // 시도 2: v2 checkout_sessions (이미 작동 확인됨)
    {
      url: 'https://api.whop.com/api/v2/checkout_sessions',
      body: { plan_id: WHOP_PLAN_ID, metadata: { session_id: sessionId } }
    },
  ];

  let lastError = '';
  for (const attempt of attempts) {
    const whopRes = await fetch(attempt.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attempt.body),
    });

    const rawText = await whopRes.text();
    const label = attempt.url.includes('v5') ? 'v5' : 'v2';
    console.log(`[${label}] status:${whopRes.status} body:${rawText.slice(0, 200)}`);

    if (whopRes.ok && rawText) {
      try {
        const data = JSON.parse(rawText);
        whopCheckoutId = data.id;
        console.log(`[${label}] SUCCESS id:${whopCheckoutId}`);
        break;
      } catch(e) {
        lastError = `parse error: ${e.message}`;
      }
    } else {
      lastError = `${label} ${whopRes.status}: ${rawText}`;
    }
  }

  if (!whopCheckoutId) {
    return res.status(500).json({ error: lastError });
  }

  // Supabase 저장
  const { error } = await supabase
    .from('payment_sessions')
    .insert({
      session_id: sessionId,
      email: null,
      paid: false,
      token: null,
      expires_at: null,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Supabase error:', error.message);
  }

  res.json({ sessionId, whopCheckoutId });
};