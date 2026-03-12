// api/webhook.js
// Paddle webhook → 이메일 발송만 담당
// generate는 generating.html에서 직접 호출
// vercel.json에서 bodyParser: false 설정 필요

const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function verifyPaddleSignature(rawBody, signature, secret) {
  const parts = {};
  signature.split(';').forEach(part => {
    const [k, v] = part.split('=');
    parts[k] = v;
  });
  const ts = parts['ts'];
  const h1 = parts['h1'];
  if (!ts || !h1) return false;
  const signed = `${ts}:${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expected));
}

async function sendConfirmationEmail(email, name, reportUrl) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The Saju Blueprint <hello@saju-blueprint.com>',
      to: email,
      subject: 'Your Saju Blueprint is ready ✦',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0b0f1e;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f1e;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td align="center" style="padding-bottom:32px;">
          <p style="margin:0;font-size:12px;letter-spacing:4px;color:#c9a84c;text-transform:uppercase;">
            ✦ The Saju Blueprint ✦
          </p>
        </td></tr>

        <tr><td style="background:#131929;border:1px solid rgba(201,168,76,0.45);padding:40px 36px;">
          <h1 style="margin:0 0 8px;font-size:26px;font-weight:500;color:#e8dfc8;text-align:center;">
            Your Blueprint is ready
          </h1>
          <p style="margin:0 0 32px;font-size:16px;color:rgba(232,223,200,0.65);text-align:center;line-height:1.5;">
            Hello ${name} — your personalized Saju reading has been generated.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:8px 0 32px;">
              <a href="${reportUrl}"
                style="display:inline-block;background:#c9a84c;color:#0b0f1e;font-family:'Georgia',serif;
                font-size:15px;letter-spacing:2px;font-weight:600;text-transform:uppercase;
                padding:16px 48px;text-decoration:none;">
                ✦ View My Blueprint
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 8px;font-size:13px;color:rgba(232,223,200,0.38);text-align:center;line-height:1.6;">
            Or copy this link into your browser:
          </p>
          <p style="margin:0 0 32px;font-size:12px;color:#c9a84c;text-align:center;word-break:break-all;">
            ${reportUrl}
          </p>

          <hr style="border:none;border-top:1px solid rgba(201,168,76,0.1);margin:0 0 24px;">

          <p style="margin:0;font-size:13px;color:rgba(232,223,200,0.38);text-align:center;line-height:1.6;">
            Save this link — it's your permanent access to your Blueprint.<br>
            Questions? Reply to this email.
          </p>
        </td></tr>

        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:12px;color:rgba(232,223,200,0.25);letter-spacing:1px;">
            The Saju Blueprint · Korean Four Pillars Destiny Report
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Resend error: ' + err);
  }
  return res.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const signature = req.headers['paddle-signature'];
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  let rawBody;
  try {
    rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  } catch {
    return res.status(400).send('Invalid body');
  }

  if (secret && signature) {
    if (!verifyPaddleSignature(rawBody, signature, secret)) {
      console.error('Paddle webhook signature mismatch');
      return res.status(401).send('Invalid signature');
    }
  }

  let event;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).send('Invalid JSON');
  }

  if (event.event_type === 'transaction.completed') {
    const txn = event.data;
    const transactionId = txn.id;
    const customData = txn.custom_data || {};
    const email = txn.customer?.email || customData.email;
    const name = customData.name || 'there';

    // reportId를 Supabase에서 조회 (generating.html이 이미 저장했을 것)
    // 최대 3분 대기 (generate 완료까지)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://saju-blueprint.vercel.app';
    let reportId = null;
    let attempts = 0;

    while (!reportId && attempts < 18) {
      await new Promise(r => setTimeout(r, 10000)); // 10초 대기
      attempts++;
      try {
        const { data } = await supabase
          .from('reports')
          .select('id')
          .eq('payment_id', `paddle_${transactionId}`)
          .single();
        if (data?.id) reportId = data.id;
      } catch {}
    }

    const reportUrl = reportId
      ? `${baseUrl}/result?id=${reportId}`
      : `${baseUrl}/result`;

    try {
      await sendConfirmationEmail(email, name, reportUrl);
      console.log('Email sent:', email, '→', reportUrl);
    } catch (err) {
      console.error('Email error:', err.message);
      // 이메일 실패해도 200 반환 (Paddle 재시도 방지)
    }
  }

  res.json({ received: true });
};