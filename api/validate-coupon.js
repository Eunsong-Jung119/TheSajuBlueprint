// /app/api/validate-coupon/route.js   (Next.js App Router)
// 미리보기 검증 전용 — 절대 여기서 쿠폰을 '차감(소모)'하지 않는다.
// 실제 무료 허가/차감은 save-rating-report, generate-upsell 에서 redeem_coupon() 으로 함.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY   // 서버 전용 키
);

const j = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export async function POST(req) {
  let code = '', type = '';
  try { const b = await req.json(); code = b.code || ''; type = b.type || ''; } catch {}
  const CODE = String(code).trim().toUpperCase();
  if (!CODE) return j({ valid: false, reason: 'empty' });

  const { data: c, error } = await supabase
    .from('rate_coupons')
    .select('active, expires_at, applies_to, max_uses, used_count, kind')
    .eq('code', CODE)
    .maybeSingle();

  if (error) return j({ valid: false, reason: 'server' });
  if (!c) return j({ valid: false, reason: 'not_found' });
  if (!c.active) return j({ valid: false, reason: 'inactive' });
  if (c.expires_at && new Date(c.expires_at) < new Date()) return j({ valid: false, reason: 'expired' });
  if (c.applies_to !== 'both' && c.applies_to !== type) return j({ valid: false, reason: 'wrong_type' });
  if (c.max_uses > 0 && c.used_count >= c.max_uses) return j({ valid: false, reason: 'used_up' });

  return j({ valid: true, kind: c.kind });
}

/* ── Pages Router( /pages/api/validate-coupon.js )라면 이렇게 ──
export default async function handler(req, res){
  if(req.method!=='POST') return res.status(405).end();
  const CODE = String(req.body?.code||'').trim().toUpperCase();
  const type = req.body?.type;
  if(!CODE) return res.json({valid:false,reason:'empty'});
  const { data:c, error } = await supabase.from('rate_coupons')
    .select('active,expires_at,applies_to,max_uses,used_count,kind').eq('code',CODE).maybeSingle();
  if(error) return res.json({valid:false,reason:'server'});
  if(!c) return res.json({valid:false,reason:'not_found'});
  if(!c.active) return res.json({valid:false,reason:'inactive'});
  if(c.expires_at && new Date(c.expires_at)<new Date()) return res.json({valid:false,reason:'expired'});
  if(c.applies_to!=='both' && c.applies_to!==type) return res.json({valid:false,reason:'wrong_type'});
  if(c.max_uses>0 && c.used_count>=c.max_uses) return res.json({valid:false,reason:'used_up'});
  return res.json({valid:true,kind:c.kind});
}
*/
