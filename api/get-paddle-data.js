// api/get-paddle-data.js
// generating.html에서 호출 — Paddle API key 서버사이드 보호
// GET /api/get-paddle-data?txn_id=xxx

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const { txn_id } = req.query;
  if (!txn_id) return res.status(400).json({ error: 'Missing txn_id' });

  const isProduction = process.env.PADDLE_ENV !== 'sandbox';
  const apiBase = isProduction
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';

  try {
    const response = await fetch(`${apiBase}/transactions/${txn_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Paddle fetch error:', err);
      return res.status(response.status).json({ error: 'Paddle API error' });
    }

    const data = await response.json();
    const customData = data.data?.custom_data || {};
    const email = data.data?.customer?.email || customData.email;

    // birth 데이터만 반환 (민감정보 최소화)
    res.json({
      birth: {
        name:     customData.name,
        email:    email,
        date:     customData.date,
        time:     customData.time,
        timezone: customData.timezone || 'America/New_York',
        gender:   customData.gender   || 'Female',
      }
    });
  } catch (err) {
    console.error('get-paddle-data error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
