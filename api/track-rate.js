const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  const { event_name, session_id, metadata = {} } = req.body;
  if (!event_name) return res.status(400).json({ error: 'Missing event_name' });

  const { error } = await supabase
    .from('rate_logs')
    .insert({
      event_name,
      session_id: session_id || null,
      metadata: {
        ...metadata,
        user_agent: req.headers['user-agent'] || null,
        referrer: req.headers['referer'] || null,
      },
    });

  if (error) {
    console.error('[track-rate] supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ ok: true });
};
