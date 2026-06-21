const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    event, event_name, session_id,
    metadata, source, medium, campaign, referrer
  } = req.body;

  const name = event || event_name || 'unknown';
  const country = req.headers['x-vercel-ip-country'] || 'unknown';
  const serverReferrer = req.headers['referer'] || req.headers['referrer'] || null;
  const clientReferrer = referrer || metadata?.referrer || null;
  const userAgent = req.headers['user-agent'] || null;

  const meta = {
    ...(metadata || { source, medium, campaign }),
    country,
    referrer: clientReferrer || serverReferrer || null,
    server_referrer: serverReferrer || null,
    user_agent: userAgent,
  };

  try {
    await supabase.from('user_logs').insert([{
      event_name: name,
      session_id: session_id || null,
      metadata: meta,
    }]);
  } catch(e) {}

  res.json({ ok: true });
};