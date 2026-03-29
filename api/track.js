const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event, event_name, metadata, source, medium, campaign, referrer } = req.body;

  const name = event || event_name || 'unknown';
  const meta = metadata || { source, medium, campaign, referrer };

  try {
    await supabase.from('user_logs').insert([{
      event_name: name,
      metadata: meta
    }]);
  } catch(e) {
    // 트래킹 실패해도 무시
  }

  res.json({ ok: true });
};