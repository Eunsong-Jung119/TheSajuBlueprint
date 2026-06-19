// pages/api/get-free-reading.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const { data, error } = await supabase
    .from('free_readings')
    .select('day_tg, is_strong, score, birth_date')
    .eq('share_id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json({
    dayTg: data.day_tg,
    isStrong: data.is_strong,
    score: data.score,
    birthDate: data.birth_date,
  });
}
