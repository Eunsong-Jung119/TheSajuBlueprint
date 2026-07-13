// lib/payment.js  (CommonJS)
// 결제검증 + 메타 전환API(CAPI) 공용 헬퍼.
// ⚠️ api/ 폴더 "밖"이라 Vercel 서버리스 함수 12개 카운트에 안 잡힘 (번들에만 포함됨).
//
// 필요 env:
//   PORTONE_API_SECRET  (포트원 콘솔 > 결제연동 탭 > V2 API Secret)
//   META_PIXEL_ID       (= 1513677227103970)
//   META_CAPI_TOKEN     (메타 이벤트매니저 > 데이터소스 > 설정 > 전환 API 액세스 토큰)

const crypto = require('crypto');

// PortOne V2 결제 단건조회 → status / amount 검증
// 반환: { ok:true, amount } | { ok:false, reason }
async function verifyPortone(paymentId, expectedAmount) {
  if (!paymentId) return { ok: false, reason: 'no_payment_id' };
  if (!process.env.PORTONE_API_SECRET) return { ok: false, reason: 'no_secret' };
  try {
    const r = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      { headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` } }
    );
    if (!r.ok) return { ok: false, reason: 'lookup_' + r.status };
    const p = await r.json();
    if (p.status !== 'PAID') return { ok: false, reason: 'status_' + p.status };
    const paid = p.amount && p.amount.total;
    if (expectedAmount != null && Number(paid) !== Number(expectedAmount)) {
      return { ok: false, reason: 'amount_' + paid };
    }
    return { ok: true, amount: Number(paid) };
  } catch (e) {
    return { ok: false, reason: 'error_' + (e.message || '') };
  }
}

// 메타 전환API(CAPI) Purchase 전송.
// event_id를 프론트 픽셀의 eventID와 동일하게 줘서 "중복 제거(dedup)" 처리됨.
async function sendMetaPurchase({ paymentId, value, contentName, contentId, email, ip, ua, fbp, fbc }) {
  const PIXEL = process.env.META_PIXEL_ID;
  const TOKEN = process.env.META_CAPI_TOKEN;
  if (!PIXEL || !TOKEN) { console.warn('[meta-capi] env 누락 — 전송 건너뜀'); return; }
  const sha = (s) => crypto.createHash('sha256').update(String(s).trim().toLowerCase()).digest('hex');
  const user_data = {};
  if (email) user_data.em = [sha(email)];   // 이메일 해시 (매칭률↑)
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;
  if (fbp) user_data.fbp = fbp;             // 브라우저 쿠키 (매칭률↑↑)
  if (fbc) user_data.fbc = fbc;             // 광고 클릭 ID (매칭률↑↑)
  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${PIXEL}/events?access_token=${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: paymentId,                       // ← 픽셀과 동일 → dedup
          action_source: 'website',
          event_source_url: 'https://sajublueprint.com/rate',
          user_data,
          custom_data: {
            value, currency: 'KRW',
            content_name: contentName,
            content_type: 'product',
            content_ids: [contentId || 'rank'],   // 프론트 픽셀과 동일하게 랭킹/업셀 구분
          },
        }],
      }),
    });
    if (!r.ok) console.error('[meta-capi]', r.status, await r.text().catch(() => ''));
  } catch (e) { console.error('[meta-capi] fail', e); }
}

module.exports = { verifyPortone, sendMetaPurchase };