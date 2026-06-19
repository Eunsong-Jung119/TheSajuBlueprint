// api/save-rating-report-en.js
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const {
      session_id, email,
      my_year, my_month, my_day, my_hour, my_gender,
      partners, result,
    } = req.body;

    const shareId  = crypto.randomBytes(3).toString('hex');
    const shareUrl = `https://sajublueprint.com?report=${shareId}`;

    const { error } = await supabase.from('rate_analyses').insert({
      id:         shareId,
      session_id: session_id || null,
      email:      email || null,
      my_year:    parseInt(my_year),
      my_month:   parseInt(my_month),
      my_day:     parseInt(my_day),
      my_hour:    my_hour ? parseInt(my_hour) : null,
      my_gender:  my_gender || 'female',
      partners:   partners || [],
      result:     result,
      lang:       'en',
    });

    if (error) {
      console.error('[save-rating-report-en] Supabase error:', JSON.stringify(error));
      return res.status(500).json({
        error: 'DB insert failed',
        detail: error.message,
        code: error.code,
        hint: error.hint,
      });
    }

    console.log('[save-rating-report-en] saved:', shareId, '| email:', email || 'none');
    return res.status(200).json({ shareId, shareUrl });

  } catch (e) {
    console.error('[save-rating-report-en] Exception:', e.message);
    return res.status(500).json({ error: e.message });
  }
};