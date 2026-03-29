// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL, // 프로젝트 마다 다를 수 있으니 env 명칭 확인!
  process.env.SUPABASE_ANON_KEY
);