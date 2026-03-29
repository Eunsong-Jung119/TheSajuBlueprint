const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reportId, feedback } = req.body || {};

  if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
    return res.status(400).json({ error: 'feedback is required' });
  }

  const { error } = await supabase
    .from('feedback')
    .insert({
      report_id:  reportId || null,
      feedback:   feedback.trim().slice(0, 2000),
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Feedback insert error:', error);
    return res.status(500).json({ error: 'Failed to save feedback' });
  }

  return res.status(200).json({ success: true });
}