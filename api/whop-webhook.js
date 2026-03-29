const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Whop webhook 서명 검증
function verifyWhopSignature(rawBody, signature, secret) {
  if (!secret || !signature) return true; // dev 모드
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// shortresult 접근용 이메일 발송 (Resend)
async function sendReportEmail(email, token) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sajublueprint.com';
  const link = `${baseUrl}/shortresult?token=${token}`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The Saju Blueprint <hello@sajublueprint.com>',
      to: email,
      subject: 'Your Saju reading is ready ✦',
      html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0f1e;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f1e;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr><td align="center" style="padding-bottom:24px;">
          <p style="margin:0;font-size:11px;letter-spacing:5px;color:#c9a84c;text-transform:uppercase;">✦ The Saju Blueprint ✦</p>
        </td></tr>
        <tr><td style="background:#131929;border:1px solid rgba(201,168,76,0.3);padding:40px;">
          <h1 style="margin:0 0 12px;font-size:26px;font-weight:400;color:#e8dfc8;text-align:center;">
            Your full reading is unlocked ✦
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:rgba(232,223,200,0.55);text-align:center;line-height:1.7;">
            Your Saju Blueprint is ready. Click below to access your complete reading anytime.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td align="center">
              <a href="${link}" style="display:inline-block;background:#c9a84c;color:#0b0f1e;font-family:'Georgia',serif;font-size:14px;letter-spacing:3px;font-weight:700;text-transform:uppercase;padding:16px 40px;text-decoration:none;">
                Open My Reading ✦
              </a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:12px;color:rgba(232,223,200,0.3);text-align:center;word-break:break-all;">
            ${link}
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:rgba(232,223,200,0.25);text-align:center;">
            Bookmark this link to return to your reading anytime.
          </p>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:12px;color:rgba(232,223,200,0.25);letter-spacing:1px;">
            The Saju Blueprint · thesajublueprint@gmail.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Resend error: ' + err);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const signature = req.headers['whop-signature'] || req.headers['x-whop-signature'];
  const secret = process.env.WHOP_WEBHOOK_SECRET;

  let rawBody;
  try {
    rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  } catch {
    return res.status(400).send('Invalid body');
  }

  if (secret && !verifyWhopSignature(rawBody, signature, secret)) {
    console.error('Whop webhook signature mismatch');
    return res.status(401).send('Invalid signature');
  }

  const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // ── 실제 Whop webhook payload 기준으로 수정
  // type: "payment.succeeded", data.status: "paid"
  const eventType = event?.type || event?.action || event?.event || '';
  console.log('Whop webhook type:', eventType);
  console.log('Whop webhook data.status:', event?.data?.status);

  const isPaid =
    eventType === 'payment.succeeded' ||
    eventType === 'payment.completed' ||
    eventType === 'membership.went_valid' ||
    event?.data?.status === 'paid';

  if (!isPaid) {
    console.log('Skipping non-payment event:', eventType);
    return res.json({ received: true, skipped: true });
  }

  // ── 이메일 추출
  const email =
    event?.data?.user?.email ||
    event?.data?.email ||
    event?.user?.email ||
    null;

  console.log('email extracted:', email);

  if (!email) {
    console.error('No email in webhook payload');
    return res.json({ received: true, error: 'no_email' });
  }

  // ── session_id 추출 (있으면 Supabase 업데이트)
  const sessionId =
    event?.data?.membership?.metadata?.session_id ||
    event?.data?.payment?.metadata?.session_id ||
    event?.data?.metadata?.session_id ||
    event?.data?.checkout?.metadata?.session_id ||
    event?.metadata?.session_id ||
    null;

  console.log('session_id extracted:', sessionId);

  // ── 토큰 생성
  const token = crypto.randomBytes(20).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30일

  // ── Supabase: session_id 있으면 업데이트, 없으면 email로 새 row 삽입
  if (sessionId) {
    const { error } = await supabase
      .from('payment_sessions')
      .update({ paid: true, token, expires_at: expiresAt, email })
      .eq('session_id', sessionId);

    if (error) console.error('Supabase update error:', error.message);
    else console.log('Payment session updated:', sessionId);
  } else {
    // session_id 없는 경우 — email + token만 저장 (이메일 복구용)
    const newSessionId = crypto.randomBytes(16).toString('hex');
    const { error } = await supabase
      .from('payment_sessions')
      .insert({
        session_id: newSessionId,
        email,
        paid: true,
        token,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      });

    if (error) console.error('Supabase insert error:', error.message);
    else console.log('New payment session created for email:', email);
  }

  // ── 이메일 발송
  try {
    await sendReportEmail(email, token);
    console.log('Report email sent to:', email);
  } catch(e) {
    console.error('Email send error:', e.message);
  }

  res.json({ received: true, success: true });
};