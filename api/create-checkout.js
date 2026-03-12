// api/create-checkout.js
// Paddle.js 방식 — transaction ID만 생성해서 반환
// 실제 결제창은 프론트엔드 Paddle.js가 열어줌

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, date, time, timezone, gender } = req.body;

  if (!email || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isProduction = process.env.PADDLE_ENV !== 'sandbox';
  const apiBase = isProduction
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';

  console.log('ENV:', process.env.PADDLE_ENV, '| apiBase:', apiBase);

  try {
    const response = await fetch(`${apiBase}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          price_id: process.env.PADDLE_PRICE_ID,
          quantity: 1,
        }],
        customer: { email },
        custom_data: {
          name,
          email,
          date,
          time,
          timezone: timezone || 'America/New_York',
          gender: gender || 'Female',
        },
      }),
    });

    const data = await response.json();
    console.log('Paddle response status:', response.status);

    if (!response.ok) {
      console.error('Paddle API error:', JSON.stringify(data));
      return res.status(500).json({ error: data?.error?.detail || 'Paddle error' });
    }

    const transactionId = data.data?.id;
    console.log('Transaction ID:', transactionId);

    if (!transactionId) {
      return res.status(500).json({ error: 'No transaction ID returned' });
    }

    res.json({ transactionId });
  } catch (err) {
    console.error('Create checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
};