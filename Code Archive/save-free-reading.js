// pages/api/save-free-reading.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateShareId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { dayTg, isStrong, score, birthDate } = req.body;

  // dayTg, isStrong, birthDate 모두 필수 — 빈 문자열은 허용
  if (dayTg === undefined || isStrong === undefined || birthDate === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let shareId, inserted = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    shareId = generateShareId();
    const { error } = await supabase
      .from('free_readings')
      .insert({
        share_id: shareId,
        day_tg: dayTg,
        is_strong: isStrong,
        score: score || null,
        birth_date: birthDate || null,
      });

    if (!error) { inserted = true; break; }
    if (!error?.message?.includes('unique')) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (!inserted) return res.status(500).json({ error: 'Failed to generate unique share ID' });

  return res.status(200).json({ shareId });
}