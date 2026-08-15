// POST /api/birth-create — 결제검증 → 날짜선별 → 팩트 → GPT본문 → 저장 → 텔레그램 검수요청
// 기존 generate-upsell.js / alert-admin.js / save-rating-report.js 패턴 재활용.
const crypto = require('crypto');
const { verifyPortone } = require('../lib/payment.js');
const { selectBirthDates } = require('../lib/birth-engine.js');
const { buildFacts } = require('../lib/birth-facts.js');
const { buildDateMessages, buildOverviewContext } = require('../lib/birth-report-prompt.js');

const PRICE = 49000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SITE = 'https://fatelab.co';   // 리포트 링크는 항상 fatelab.co (공유 env가 다른 상품용이라 무시)

export const config = { maxDuration: 300 };

async function gptDate(messages) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: 'gpt-4o', messages, response_format: { type: 'json_object' }, temperature: 0.85, max_tokens: 3000 }),
      });
      if (!r.ok) throw new Error('openai_' + r.status);
      const j = await r.json();
      return JSON.parse(j.choices[0].message.content);
    } catch (e) { if (i === 2) throw e; await new Promise(s => setTimeout(s, 800 * (i + 1))); }
  }
}

// 무료 쿠폰 원자적 차감 (rate의 redeem_coupon RPC 재사용) — 성공 시 {ok:true}
async function redeemCoupon(code, email, session) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/redeem_coupon`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_code: String(code).toUpperCase(), p_type: 'both', p_session: session || null, p_email: email || null }),
  });
  if (!r.ok) return { ok: false, reason: 'rpc_' + r.status };
  const data = await r.json().catch(() => null);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { ok: false, reason: 'not_found' };
  return { ok: !!row.ok, reason: row.reason };
}

// 퍼널 로그(birth_logs)에 서버 이벤트 기록 — 실패해도 무시
async function logEvent(name, session, meta) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/birth_logs`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ event_name: name, session_id: session || null, metadata: meta || {} }),
    });
  } catch (e) { /* ignore */ }
}

async function saveReport(id, payload) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/birth_reports`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ id, status: 'pending_review', email: payload.contact.email, payload }),
  });
  if (!r.ok) throw new Error('supabase_save_' + r.status + ' ' + await r.text().catch(() => ''));
}

async function tgReview(id, payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const d = payload.dates.map(x => `${x.date} ${x.saju3.join('')}(${x.dayEl})`).join(' · ');
  const text = `🍼 <b>새 출산택일 신청</b>\n주문 <code>${id}</code>\n이메일 ${payload.contact.email}\n아기 ${payload.baby.sex}${payload.baby.name ? ' · ' + payload.baby.name : ''}\n출산범위 ${payload.baby.due_from}~${payload.baby.due_to}\n선별 3일: ${d}\n\n검수: ${SITE}/b/${id}`;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [
        [{ text: '📄 리포트 열기', url: `${SITE}/b/${id}` }],
        [{ text: '✅ 승인·발송', callback_data: `approve:${id}` }, { text: '❌ 반려', callback_data: `reject:${id}` }],
        [{ text: '🔄 재생성', callback_data: `regen:${id}` }]] },
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    const { mom, dad, baby, contact, paymentId, coupon_code, session_id, utm } = req.body || {};
    if (!mom?.birth || !dad?.birth || !baby?.due_from || !contact?.email) return res.status(400).json({ error: 'missing_fields' });

    // 1) 결제 검증 — 무료 쿠폰이 있으면 서버에서 원자적 1회 차감, 없으면 포트원 결제 검증
    let couponOk = false;
    if (coupon_code) {
      const rc = await redeemCoupon(coupon_code, contact.email, session_id);
      if (!rc.ok) return res.status(403).json({ error: 'coupon_' + (rc.reason || 'invalid') });
      couponOk = true;
    }
    if (paymentId) {
      const v = await verifyPortone(paymentId, PRICE);
      if (!v.ok && String(v.reason).startsWith('status_')) return res.status(402).json({ error: 'payment_' + v.reason });
    }
    // 쿠폰도 결제도 없으면 무료 발급 차단
    if (!couponOk && !paymentId) return res.status(402).json({ error: 'payment_required' });
    // 2) 날짜 선별
    const toYMD = (s) => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
    // 입력값이 '인시 (03:00~05:00)' 형태라 slice(0,2)는 '인시'→NaN→12가 되어 시주가 전부 무시됐음.
    const toHM = (t) => {
      if (!t || t === '모름') return {};
      const m = String(t).match(/(\d{1,2})\s*:/);
      if (!m) return {};
      return { hh: (Number(m[1]) + 1) % 24 };   // 시진 시작+1h = 시진 한가운데
    };
    const sel = selectBirthDates({
      mom: { ...toYMD(mom.birth), ...toHM(mom.time) },
      dad: { ...toYMD(dad.birth), ...toHM(dad.time) },
      dueFrom: toYMD(baby.due_from), dueTo: toYMD(baby.due_to),
    });
    // 3) 팩트 + 4) GPT 본문 (날짜별 병렬)
    const facts = buildFacts(sel, baby.sex);
    const contents = await Promise.all(facts.map(f => gptDate(buildDateMessages(f, sel.parents))));
    const dates = facts.map((f, i) => ({ ...f, content: contents[i] }));

    // 5) 저장
    const id = crypto.randomBytes(4).toString('hex').slice(0, 6);
    const utmClean = (utm && typeof utm === 'object' && !Array.isArray(utm))
      ? Object.fromEntries(Object.entries(utm).slice(0, 10).map(([k, v]) => [String(k).slice(0, 20), String(v).slice(0, 200)]))
      : null;
    const payload = { orderId: id, contact, baby, parents: sel.parents, range: sel.all, overview: buildOverviewContext(facts, sel.parents), dates, price: couponOk ? 0 : PRICE, coupon_code: couponOk ? String(coupon_code).toUpperCase() : null, utm: utmClean, input: { mom, dad, baby }, ts: new Date().toISOString() };
    await saveReport(id, payload);
    // 6) 텔레그램 검수 요청
    await tgReview(id, payload);
    // 7) 퍼널 로그 — 실제 리포트 생성 완료(전환)
    await logEvent('report_created', session_id, { order_id: id, free: !!couponOk, price: couponOk ? 0 : PRICE, utm: utmClean || null });

    return res.status(200).json({ ok: true, orderId: id });
  } catch (e) {
    console.error('[birth-create]', e);
    return res.status(500).json({ error: 'server', detail: String(e.message || e) });
  }
}
