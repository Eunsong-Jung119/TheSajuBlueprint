// GET /api/birth-report?id=xxx — 저장된 리포트를 HTML로 렌더 (검수/고객 뷰). /r/:id 리라이트 대상.
const { renderReport } = require('../lib/birth-render.js');
export default async function handler(req, res) {
  const id = String(req.query.id || '').replace(/[^a-f0-9]/gi, '').slice(0, 6);
  if (!id) return res.status(400).send('bad id');
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/birth_reports?id=eq.${id}&select=payload,status`, {
    headers: { 'apikey': process.env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}` } });
  const rows = await r.json();
  if (!rows || !rows[0]) return res.status(404).send('not found');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(renderReport(rows[0].payload));
}
