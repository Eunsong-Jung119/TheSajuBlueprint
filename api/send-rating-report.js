module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  const { email, shareUrl, result } = req.body;

  if (!email || !shareUrl || !result) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1위 남자 정보
  const sorted = [...result.results].sort((a, b) => b.scores.total - a.scores.total);
  const winner = sorted[0];

  // 상대별 점수 요약 HTML
  const rankRows = sorted.map((r, i) => {
    const medals = ['🥇', '🥈', '🥉', '4위', '5위'];
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(232,84,122,0.1);">
          <span style="font-size:14px;">${medals[i]}</span>
          <span style="font-size:14px;font-weight:600;color:#2D1420;margin-left:8px;">${r.name}</span>
          <span style="float:right;font-size:13px;color:#E8547A;font-weight:700;">${Math.round(r.scores.total)}점</span>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 10px 28px;border-bottom:1px solid rgba(232,84,122,0.1);">
          <span style="font-size:11px;color:#E8547A;">${r.archetype}</span>
          <p style="margin:4px 0 0;font-size:12px;color:#7A5060;line-height:1.6;">${r.sections.heart.summary}</p>
        </td>
      </tr>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDF5F7;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF5F7;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

        <!-- 헤더 -->
        <tr><td align="center" style="padding-bottom:20px;">
          <p style="margin:0;font-size:11px;letter-spacing:4px;color:#E8547A;text-transform:uppercase;font-weight:600;">🔮 사주 궁합 분석</p>
        </td></tr>

        <!-- 메인 카드 -->
        <tr><td style="background:#FFFFFF;border:1px solid rgba(232,84,122,0.2);border-radius:16px;padding:36px 32px;">

          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1A0A12;text-align:center;line-height:1.4;">
            분석 결과가 나왔어요 👀
          </h1>
          <p style="margin:0 0 28px;font-size:14px;color:#7A5060;text-align:center;line-height:1.7;">
            사주가 말해주는 진짜 궁합
          </p>

          <!-- 1위 -->
          <div style="background:linear-gradient(135deg,#FFF5F8,#FDE8EE);border:1px solid rgba(232,84,122,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
            <div style="font-size:28px;margin-bottom:6px;">👑</div>
            <div style="font-size:18px;font-weight:700;color:#C23A60;margin-bottom:4px;">${winner.name}</div>
            <div style="font-size:12px;color:#E8547A;font-weight:600;margin-bottom:10px;">${winner.archetype}</div>
            <p style="margin:0;font-size:13px;color:#7A5060;line-height:1.7;">${winner.overall}</p>
          </div>

          <!-- 랭킹 -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${rankRows}
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${shareUrl}"
                style="display:inline-block;background:#E8547A;color:#ffffff;font-size:15px;font-weight:600;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">
                전체 상세 분석 보기 →
              </a>
            </td></tr>
          </table>

          <p style="margin:16px 0 0;font-size:11px;color:#B08090;text-align:center;">
            링크를 북마크해두면 언제든 다시 볼 수 있어요
          </p>
        </td></tr>

        <!-- 푸터 -->
        <tr><td align="center" style="padding-top:20px;">
          <p style="margin:0;font-size:11px;color:#B08090;">
            재미로 보는 사주 분석이에요. 참고만 하세요 🙏
          </p>
          <p style="margin:6px 0 0;font-size:11px;color:#B08090;">
            Saju Blueprint · hello@sajublueprint.com
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Saju Blueprint <hello@sajublueprint.com>',
        to: email,
        subject: '사주 궁합 결과가 나왔어요 🔮',
        html,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('[send-rating-report] resend error:', err);
      return res.status(500).json({ error: 'Email send failed' });
    }

    console.log('[send-rating-report] email sent to:', email);
    return res.status(200).json({ ok: true });
  } catch(e) {
    console.error('[send-rating-report] error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};
