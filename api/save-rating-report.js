// api/save-rating-report.js
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const { verifyPortone, sendMetaPurchase } = require('../lib/payment.js');

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
    payment_id,                 // ← 프론트에서 새로 넘겨받음 (PortOne paymentId)
    my_year, my_month, my_day, my_hour, my_gender,
    partners,
    result,
  } = req.body;

  if (!result) return res.status(400).json({ error: 'No result data' });

  // ── 결제 검증 (payment_id가 넘어온 신규 결제 건만 검사) ──
  // 정책: 명시적 미결제(status_*)만 차단해서 가짜결제 결과노출을 막고,
  //       조회 자체 실패(네트워크/포트원 장애 등)는 통과시켜 "진짜 결제한 사람"이 막히는 사고 방지.
  //       더 엄격하게 가려면 아래 if 조건을 `if (!v.ok)` 로 바꾸면 됨(권장X, 환불민원 위험).
  let verified = null;
  if (payment_id) {
    const v = await verifyPortone(payment_id, 5900);
    if (!v.ok) {
      console.error('[save-rating-report] verify fail:', payment_id, v.reason);
      if (v.reason && v.reason.indexOf('status_') === 0) {
        return res.status(402).json({ error: 'payment_not_verified', reason: v.reason });
      }
    } else {
      verified = v;
    }
  }

  const shareId = crypto.randomBytes(4).toString('hex').slice(0, 6);
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

  // ── 검증 통과 시에만 메타 CAPI Purchase 전송 (랭킹 4,900원) ──
  if (verified) {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    await sendMetaPurchase({
      paymentId: payment_id,
      value: verified.amount,
      contentName: 'Rate Your Ex 사주 궁합 분석',
      email,
      ip,
      ua: req.headers['user-agent'],
    });
  }

  console.log('[save-rating-report] saved:', shareId, '| email:', email || 'none', '| paid:', verified ? verified.amount : 'unverified');

  return res.status(200).json({ shareId, shareUrl });
};