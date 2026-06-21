// api/get-upsell-report.js  (ESM)
// 심층 리포트 재접속/공유 복원용. GET ?id=ups_xxx → Supabase 조회
// 응답: { id, target_name, report:{target_name,cards[5]}, me, target, upsell_type }
// 배치: /api/get-upsell-report.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'missing id' });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const url = `${process.env.SUPABASE_URL}/rest/v1/rate_upsell_reports`
      + `?id=eq.${encodeURIComponent(id)}`
      + `&select=id,target_name,report,me,target,upsell_type`;
    const r = await fetch(url, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      console.error('[get-upsell-report] supabase', r.status, t);
      return res.status(502).json({ error: 'fetch failed' });
    }
    const rows = await r.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'not found' });
    }
    return res.status(200).json(rows[0]);
  } catch (e) {
    console.error('[get-upsell-report] fatal', e);
    return res.status(500).json({ error: e.message || 'internal error' });
  }
}
