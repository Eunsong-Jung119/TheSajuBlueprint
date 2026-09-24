// POST /api/birth-create — 결제검증 → 날짜선별 → 팩트 → GPT본문 → 저장 → 텔레그램 검수요청
// 기존 generate-upsell.js / alert-admin.js / save-rating-report.js 패턴 재활용.
const crypto = require('crypto');
const { verifyPortone, sendMetaPurchase } = require('../lib/payment.js');
const { selectBirthDates } = require('../lib/birth-engine.js');
const { buildFacts } = require('../lib/birth-facts.js');
const { buildDateMessages, buildOverviewContext, buildParentMessages } = require('../lib/birth-report-prompt.js');

const PRICE = 49000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SITE = 'https://fatelab.co';   // 리포트 링크는 항상 fatelab.co (공유 env가 다른 상품용이라 무시)

export const config = { maxDuration: 300 };

// GPT 결과 품질 검사 — 규칙을 어긴 카드는 쓰지 않고 엔진 테이블로 되돌린다.
// ※ 십성 용어는 일상어와 겹치는 게 많아 오탐이 잦았음(상관없이/관성적으로/식상하다) → 부정 전방탐색으로 제외.
const _SS_WORDS = /(비겁|재성|인성|비견|겁재|식신|편재|정재|편관|정관|편인|정인|식상(?!하|해|한)|관성(?!적)|상관(?!없|있|하|도))/;
const _FLAT_WORDS = /(에너지|존재입니다|존재예요|역할을 (하|합)|분위기 메이커|활력을 불어넣|긍정적인)/;
// GPT가 {"부모":{"엄마":…}} 처럼 한 겹 감싸 보내는 경우가 있어 한 단계 안쪽까지 찾아준다.
function pickParent(txt, who) {
  if (!txt || typeof txt !== 'object') return null;
  if (txt[who] && typeof txt[who] === 'object') return txt[who];
  for (const k of Object.keys(txt)) {
    const v = txt[k];
    if (v && typeof v === 'object' && v[who] && typeof v[who] === 'object') return v[who];
  }
  return null;
}
// ~입니다체를 ~예요/~어요로 안전 변환. 한 군데 때문에 카드 전체를 버리는 게 아까워서,
// 확실한 패턴만 바꾸고 그래도 격식체가 남으면 그때 폴백한다. (불확실한 활용은 건드리지 않음)
function toPolite(t) {
  if (!t) return t;
  let s = String(t);
  s = s.replace(/것입니다/g, '거예요').replace(/것이었습니다/g, '거였어요');
  s = s.replace(/있습니다/g, '있어요').replace(/없습니다/g, '없어요');
  s = s.replace(/하십니다/g, '하세요').replace(/이십니다/g, '이세요');
  s = s.replace(/됩니다/g, '돼요').replace(/합니다/g, '해요');
  s = s.replace(/드립니다/g, '드려요').replace(/십니다/g, '세요');
  // 받침 유무로 예요/이에요 결정
  s = s.replace(/([가-힣])입니다/g, (m, ch) => {
    const c = ch.charCodeAt(0) - 0xAC00;
    const batchim = c >= 0 && c <= 11171 && (c % 28) !== 0;
    return ch + (batchim ? '이에요' : '예요');
  });
  return s;
}
// 통과하면 '', 막히면 사유 문자열을 돌려준다(로그·payload에 남겨 원인 추적).
function parentTextWhy(g) {
  if (!g) return 'no_object';
  if (!g.head) return 'no_head';
  if (!g.body) return 'no_body';
  const all = [g.head, g.body, g.over, g.mission].filter(Boolean).join(' ');
  let m;
  if ((m = all.match(/(입니다|합니다|됩니다|습니다)/))) return 'formal:' + m[1];
  if ((m = all.match(_SS_WORDS))) return 'sipseong:' + m[1];
  if ((m = all.match(_FLAT_WORDS))) return 'flat:' + m[1];
  if (String(g.body).length < 70) return 'too_short:' + String(g.body).length;
  return '';
}
// GPT가 쓴 부모 문장을 parentAn에 얹는다. 실패/누락 시 엔진 테이블 문장이 그대로 남음(폴백).
function applyParentText(parentAn, txt) {
  if (!parentAn || !txt) return;
  for (const a of parentAn) {
    const g = pickParent(txt, a.who);
    if (g) ['head','body','over','mission'].forEach(k => { if (g[k]) g[k] = toPolite(g[k]); });
    const why = parentTextWhy(g);
    a.gptWhy = why || 'ok';   // 폴백 사유를 payload에 남겨 원인 추적(로그 못 볼 때 대비)
    if (why) { console.warn('[parent-gpt] 폴백:', a.who, why); continue; }
    if (g.head) a.arche = String(g.head).trim();
    if (Array.isArray(g.lang) && g.lang.length) a.trait = '사랑의 언어 — ' + g.lang.map(x => String(x).trim()).filter(Boolean).join(' · ');
    if (g.body) a.love = String(g.body).trim();
    if (g.over || g.mission) {
      const ov = String(g.over || '').trim(), ms = String(g.mission || '').trim();
      a.watch = `이럴 때 과해져요 — ${ov}${ms ? ' ▷부모 미션 — ' + ms : ''}`;
    }
    a.byGpt = true;
  }
  // 안전망: GPT가 그래도 같은 문장을 냈으면 엔진 폴백으로 되돌림(엔진은 최소한 축이 다름)
  if (parentAn.length === 2 && parentAn[0].arche === parentAn[1].arche) {
    parentAn.forEach(a => { a.byGpt = false; a.gptWhy = 'same_head'; });
  }
}

async function gptDate(messages) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: 'gpt-4o', messages, response_format: { type: 'json_object' }, temperature: 0.85, max_tokens: 4600 }),
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
    const { mom, dad, baby, contact, paymentId, coupon_code, session_id, utm, fb } = req.body || {};
    if (!mom?.birth || !dad?.birth || !baby?.due_from || !contact?.email) return res.status(400).json({ error: 'missing_fields' });

    // 1) 결제 검증 — 무료 쿠폰이 있으면 서버에서 원자적 1회 차감, 없으면 포트원 결제 검증
    let couponOk = false;
    if (coupon_code) {
      const rc = await redeemCoupon(coupon_code, contact.email, session_id);
      if (!rc.ok) return res.status(403).json({ error: 'coupon_' + (rc.reason || 'invalid') });
      couponOk = true;
    }
    let paid = null;
    if (paymentId) {
      const v = await verifyPortone(paymentId, PRICE);
      if (!v.ok && String(v.reason).startsWith('status_')) return res.status(402).json({ error: 'payment_' + v.reason });
      if (v.ok) paid = v;
    }
    // 쿠폰도 결제도 없으면 무료 발급 차단
    if (!couponOk && !paymentId) return res.status(402).json({ error: 'payment_required' });

    // 1-b) 메타 전환API Purchase — 리포트 생성(1~2분)보다 먼저 쏜다.
    //      생성이 실패해도 결제는 일어났으므로 전환은 남아야 하고, 지연되면 유실 위험이 커진다.
    //      event_id = paymentId → 프론트 픽셀 eventID와 같아 중복 제거된다.
    // 전용 데이터세트가 설정돼 있을 때만 — 없으면 rate 픽셀로 잘못 흘러간다.
    if (paid && process.env.META_PIXEL_ID_BIRTH) {
      await sendMetaPurchase({
        paymentId,
        value: paid.amount,
        contentName: '우리 아기 스케치 리포트',
        contentId: 'birth_report',          // 프론트 BPX_PRODUCT.content_ids와 동일
        email: contact.email,
        ip: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
        ua: req.headers['user-agent'],
        fbp: fb && fb.fbp,
        fbc: fb && fb.fbc,
        pixelId: process.env.META_PIXEL_ID_BIRTH,
        capiToken: process.env.META_CAPI_TOKEN_BIRTH,
        sourceUrl: SITE + '/birth/apply',
      }).catch(e => console.error('[birth-capi]', e && e.message));
    }
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
    // 부모 카드는 날짜와 무관 → 날짜 3건과 함께 병렬로 1회만 호출 (체감 지연 없음)
    const [contents, pTxt] = await Promise.all([
      Promise.all(facts.map(f => gptDate(buildDateMessages(f, sel.parents, facts.filter(x => x !== f))))),
      gptDate(buildParentMessages(sel.parentAn)).catch(e => { console.error('[parent-gpt]', e && e.message); return null; }),
    ]);
    applyParentText(sel.parentAn, pTxt);
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
