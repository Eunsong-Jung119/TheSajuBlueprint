const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const { data, error } = await supabase
    .from('rate_analyses')
    .select('result')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('[get-rating-report] error:', error?.message);
    return res.status(404).json({ error: 'Report not found' });
  }

  return res.status(200).json({ result: data.result });
};
