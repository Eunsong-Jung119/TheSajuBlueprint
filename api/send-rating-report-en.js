// api/send-rating-report-en.js
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { email, shareUrl, result } = req.body;
    if (!email || !result) return res.status(400).json({ error: 'Missing fields' });

    const sorted = [...(result.results || [])].sort((a, b) => b.scores.total - a.scores.total);
    const winner = sorted[0];

    const rankEmoji = ['🥇','🥈','🥉','#4','#5'];
    const sectionLabels = {
      heart:'❤️ Emotional Depth', growth:'🚀 Growth',
      stability:'🏠 Stability', worldview:'🪞 Worldview', timing:'⏳ Timing',
    };

    const winnerSections = Object.entries(sectionLabels).map(([key, label]) => {
      const sec = winner.sections?.[key];
      if (!sec) return '';
      return `<div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:#e3c08a;margin-bottom:4px;">${label} · ${Math.round(winner.scores[key])}</div>
        <div style="font-size:13px;color:#cdb8e8;line-height:1.7;">${sec.text}</div>
        <div style="font-size:12px;color:#e3c08a;font-style:italic;margin-top:6px;padding:8px 12px;background:rgba(227,192,138,0.08);border-radius:6px;">→ ${sec.summary}</div>
      </div>`;
    }).join('');

    const rankRows = sorted.map((r, i) => `
      <tr><td style="padding:10px 0;border-bottom:1px solid #3a2659;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">${rankEmoji[i]}</span>
          <div style="flex:1;">
            <div style="font-family:'Georgia',serif;font-size:16px;color:#f3ecff;">${r.name}</div>
            <div style="font-size:12px;color:#b89fd9;font-style:italic;">${r.archetype}</div>
          </div>
          <div style="font-family:'Georgia',serif;font-size:22px;color:#e3c08a;">${Math.round(r.scores.total)}<span style="font-size:12px;color:#7a6a9a;">/100</span></div>
        </div>
        <div style="font-size:13px;color:#cdb8e8;line-height:1.6;margin-top:8px;padding-left:30px;">${r.overall}</div>
      </td></tr>`).join('');

    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#160e26;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(168deg,#241640,#46305f);min-height:100vh;">
<tr><td align="center" style="padding:32px 16px;">
<table width="100%" style="max-width:540px;" cellpadding="0" cellspacing="0">
  <tr><td style="text-align:center;padding-bottom:24px;">
    <div style="font-size:11px;letter-spacing:4px;color:rgba(227,192,138,0.5);text-transform:uppercase;">✦ The Saju Blueprint ✦</div>
    <div style="font-family:'Georgia',serif;font-size:24px;color:#f3ecff;margin-top:10px;">Your reading is ready</div>
  </td></tr>
  <tr><td style="background:linear-gradient(135deg,rgba(184,159,217,0.18),rgba(227,192,138,0.08));border:1px solid rgba(227,192,138,0.3);border-radius:16px;padding:24px;text-align:center;margin-bottom:16px;">
    <div style="font-size:36px;margin-bottom:8px;">👑</div>
    <div style="font-family:'Georgia',serif;font-size:22px;color:#e3c08a;">${winner.name}</div>
    <div style="font-size:13px;color:#d99fb0;font-style:italic;margin:4px 0 10px;">${winner.archetype}</div>
    <div style="font-family:'Georgia',serif;font-size:42px;color:#e3c08a;">${Math.round(winner.scores.total)}<span style="font-size:16px;color:#7a6a9a;">/100</span></div>
  </td></tr>
  <tr><td style="padding:12px 0;"></td></tr>
  <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(184,159,217,0.16);border-radius:16px;padding:22px;">
    <div style="font-size:11px;letter-spacing:3px;color:rgba(227,192,138,0.5);text-transform:uppercase;margin-bottom:16px;">Full Analysis · ${winner.name}</div>
    ${winnerSections}
  </td></tr>
  ${sorted.length > 1 ? `
  <tr><td style="padding:12px 0;"></td></tr>
  <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(184,159,217,0.16);border-radius:16px;padding:22px;">
    <div style="font-size:11px;letter-spacing:3px;color:rgba(227,192,138,0.5);text-transform:uppercase;margin-bottom:16px;">Full Ranking</div>
    <table width="100%" cellpadding="0" cellspacing="0">${rankRows}</table>
    ${result.ranking_comment ? `<div style="font-size:13px;color:#cdb8e8;line-height:1.7;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);">📊 ${result.ranking_comment}</div>` : ''}
  </td></tr>` : ''}
  <tr><td style="text-align:center;padding:20px 0;">
    <a href="${shareUrl}" style="display:inline-block;background:#e3c08a;color:#160e26;font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;border-radius:12px;text-decoration:none;">View Full Reading</a>
  </td></tr>
  <tr><td style="text-align:center;padding:16px 0;border-top:1px solid rgba(255,255,255,0.06);">
    <div style="font-size:11px;color:#5a4a7a;">sajublueprint.com · For entertainment purposes only</div>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Saju Blueprint <hello@sajublueprint.com>',
        to: email,
        subject: `👑 ${winner.name} is your chart pick — full reading inside`,
        html,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('[send-rating-report-en] Resend error:', err);
      return res.status(500).json({ error: 'Email send failed', detail: err });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[send-rating-report-en] Exception:', e.message);
    return res.status(500).json({ error: e.message });
  }
};