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
const SITE = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatelab.co';

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
      reply_markup: { inline_keyboard: [[
        { text: '📄 리포트 열기', url: `${SITE}/b/${id}` }],
        [{ text: '✅ 승인·발송', callback_data: `approve:${id}` }, { text: '❌ 반려', callback_data: `reject:${id}` }]] },
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    const { mom, dad, baby, contact, paymentId } = req.body || {};
    if (!mom?.birth || !dad?.birth || !baby?.due_from || !contact?.email) return res.status(400).json({ error: 'missing_fields' });

    // 1) 결제 검증 (포트원 · KG이니시스 채널)
    if (paymentId) {
      const v = await verifyPortone(paymentId, PRICE);
      if (!v.ok && String(v.reason).startsWith('status_')) return res.status(402).json({ error: 'payment_' + v.reason });
    }
    // 2) 날짜 선별
    const toYMD = (s) => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
    const toHM = (t) => t && t !== '모름' ? { hh: +String(t).slice(0, 2) || 12 } : {};
    const sel = selectBirthDates({
      mom: { ...toYMD(mom.birth), ...toHM(mom.time) },
      dad: { ...toYMD(dad.birth), ...toHM(dad.time) },
      dueFrom: toYMD(baby.due_from), dueTo: toYMD(baby.due_to),
    });
    // 3) 팩트 + 4) GPT 본문 (날짜별 병렬)
    const facts = buildFacts(sel);
    const contents = await Promise.all(facts.map(f => gptDate(buildDateMessages(f, sel.parents))));
    const dates = facts.map((f, i) => ({ ...f, content: contents[i] }));

    // 5) 저장
    const id = crypto.randomBytes(4).toString('hex').slice(0, 6);
    const payload = { orderId: id, contact, baby, parents: sel.parents, overview: buildOverviewContext(facts, sel.parents), dates, price: PRICE, ts: new Date().toISOString() };
    await saveReport(id, payload);
    // 6) 텔레그램 검수 요청
    await tgReview(id, payload);

    return res.status(200).json({ ok: true, orderId: id });
  } catch (e) {
    console.error('[birth-create]', e);
    return res.status(500).json({ error: 'server', detail: String(e.message || e) });
  }
}
