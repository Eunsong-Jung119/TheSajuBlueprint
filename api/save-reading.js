const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id, p1, persons, messages, context, situation } = req.body;
  if (!p1 || !messages) return res.status(400).json({ error: 'Missing data' });

  const readingId = id || crypto.randomBytes(6).toString('hex');

  const { error } = await supabase
    .from('readings')
    .upsert({
      id: readingId,
      p1: p1,
      persons: persons || [],
      messages: messages,
      context: context || '',
      situation: situation || '',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error('save-reading error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ readingId });
};