const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function sendReportEmail(email, shareUrl) {
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
              <a href="${shareUrl}" style="display:inline-block;background:#c9a84c;color:#0b0f1e;font-family:'Georgia',serif;font-size:14px;letter-spacing:3px;font-weight:700;text-transform:uppercase;padding:16px 40px;text-decoration:none;">
                Open My Reading ✦
              </a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:12px;color:rgba(232,223,200,0.3);text-align:center;word-break:break-all;">
            ${shareUrl}
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

  const { reportData, birth, email } = req.body;
  if (!reportData) return res.status(400).json({ error: 'No report data' });

  // 6자리 shareId 생성
  const shareId = crypto.randomBytes(4).toString('hex').slice(0, 6);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sajublueprint.com';
  const shareUrl = `${baseUrl}/shortresult?id=${shareId}`;

  // Supabase 저장
  const { error } = await supabase
    .from('short_reports')
    .insert({
      id: shareId,
      report_data: reportData,
      birth: birth || null,
      email: email || null,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('save-short-report error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log('short report saved:', shareId, '| email:', email);

  // 이메일 발송 (email 있을 때만)
  if (email) {
    try {
      await sendReportEmail(email, shareUrl);
      console.log('report email sent to:', email);
    } catch(e) {
      console.error('email send error:', e.message);
      // 이메일 실패해도 shareId는 반환
    }
  }

  res.json({ shareId, shareUrl });
};