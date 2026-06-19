const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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

  const {
    session_id,
    whop_receipt_id,
    email,
    my_year, my_month, my_day, my_hour, my_gender,
    partners,
    result,
  } = req.body;

  if (!result) return res.status(400).json({ error: 'No result data' });

  const shareId = crypto.randomBytes(4).toString('hex').slice(0, 6);
  const baseUrl = 'https://sajublueprint.com';
  const shareUrl = `https://sajublueprint.com?report=${shareId}`;

  const { error } = await supabase
    .from('rate_analyses')
    .insert({
      id: shareId,
      session_id: session_id || null,
      whop_receipt_id: whop_receipt_id || null,
      email: email || null,
      my_year, my_month, my_day,
      my_hour: my_hour || null,
      my_gender,
      partners: partners || [],
      result,
    });

  if (error) {
    console.error('[save-rating-report] supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log('[save-rating-report] saved:', shareId, '| email:', email || 'none', '| receipt:', whop_receipt_id || 'none');

  return res.status(200).json({ shareId, shareUrl });
};
