// POST /api/birth-review — 텔레그램 콜백 웹훅 (승인/반려 버튼).
// 승인 → 고객에게 Resend로 리포트 링크 발송 · status=sent
// 반려 → status=pending_refund (수동 환불). 기존 send-rating-report / alert-admin 패턴.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SITE = 'https://fatelab.co';   // 리포트 링크는 항상 fatelab.co (공유 env가 다른 상품용이라 무시)
const TG = process.env.TELEGRAM_BOT_TOKEN;
const { selectBirthDates } = require('../lib/birth-engine.js');
const { buildFacts } = require('../lib/birth-facts.js');
const { buildDateMessages, buildOverviewContext } = require('../lib/birth-report-prompt.js');

export const config = { maxDuration: 300 };   // 재생성(GPT 3건)에 시간이 걸려 300초

async function sbGet(id) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/birth_reports?id=eq.${id}&select=id,email,payload,status`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
  const rows = await r.json(); return rows && rows[0];
}
async function sbUpdate(id, patch) {
  await fetch(`${SUPABASE_URL}/rest/v1/birth_reports?id=eq.${id}`, {
    method: 'PATCH', headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(patch) });
}
async function tgAnswer(cbId, text) {
  await fetch(`https://api.telegram.org/bot${TG}/answerCallbackQuery`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: cbId, text }) });
}
async function tgEdit(chatId, msgId, text) {
  await fetch(`https://api.telegram.org/bot${TG}/editMessageText`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: msgId, text, parse_mode: 'HTML', disable_web_page_preview: true }) });
}
async function sendEmail(to, id, baby) {
  const link = `${SITE}/b/${id}`;
  const html = `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#40323b">
    <h2>우리 아기 스케치가 완성됐어요 🤍</h2>
    <p>보내주신 출산 가능일로 아기의 타고난 결을 하나하나 그려두었어요.</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:linear-gradient(135deg,#ffb69c,#c9bff0);color:#fff;text-decoration:none;font-weight:800;padding:15px 30px;border-radius:16px;display:inline-block">우리 아기 리포트 보기 →</a></p>
    <p style="font-size:12px;color:#8a7a72">본 리포트는 사주명리 해석에 근거한 참고 자료이며, 정해진 미래나 의학적 판단을 제공하지 않아요. 출산 시기·방법은 반드시 주치의와 상의해 주세요.</p></div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: '페이트랩 <noreply@fatelab.co>', reply_to: 'fatelab@naver.com', to, subject: '우리 아기 스케치 리포트가 나왔어요 🍼', html }) });
  return r.ok;
}

// ── 재생성용: 원본 입력으로 날짜선별→팩트→GPT 재생성 (birth-create와 동일 파이프라인) ──
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
async function generateReport(input) {
  const { mom, dad, baby } = input;
  const toYMD = (s) => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
  const toHM = (t) => t && t !== '모름' ? { hh: +String(t).slice(0, 2) || 12 } : {};
  const sel = selectBirthDates({
    mom: { ...toYMD(mom.birth), ...toHM(mom.time) },
    dad: { ...toYMD(dad.birth), ...toHM(dad.time) },
    dueFrom: toYMD(baby.due_from), dueTo: toYMD(baby.due_to),
  });
  const facts = buildFacts(sel, baby.sex);
  const contents = await Promise.all(facts.map(f => gptDate(buildDateMessages(f, sel.parents))));
  const dates = facts.map((f, i) => ({ ...f, content: contents[i] }));
  return { parents: sel.parents, range: sel.all, overview: buildOverviewContext(facts, sel.parents), dates };
}
async function tgReview(id, payload) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!TG || !chatId) return;
  const d = payload.dates.map(x => `${x.date} ${x.saju3.join('')}(${x.dayEl})`).join(' · ');
  const text = `🔄 <b>재검수 요청 (재생성됨)</b>\n주문 <code>${id}</code>\n이메일 ${payload.contact.email}\n아기 ${payload.baby.sex}${payload.baby.name ? ' · ' + payload.baby.name : ''}\n출산범위 ${payload.baby.due_from}~${payload.baby.due_to}\n선별 3일: ${d}\n\n검수: ${SITE}/b/${id}`;
  await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, {
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
  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const cb = body && body.callback_query;
    if (!cb) return res.status(200).json({ ok: true }); // 다른 업데이트 무시
    // 검수자 본인만
    if (String(cb.message.chat.id) !== String(process.env.TELEGRAM_CHAT_ID)) { await tgAnswer(cb.id, '권한 없음'); return res.status(200).json({ ok: true }); }
    const [action, id] = String(cb.data || '').split(':');
    const row = await sbGet(id);
    if (!row) { await tgAnswer(cb.id, '주문을 찾을 수 없어요'); return res.status(200).json({ ok: true }); }

    if (action === 'approve') {
      const ok = await sendEmail(row.email, id, row.payload.baby);
      await sbUpdate(id, { status: ok ? 'sent' : 'send_failed', sent_at: new Date().toISOString() });
      await tgAnswer(cb.id, ok ? '✅ 발송 완료' : '⚠️ 이메일 실패');
      await tgEdit(cb.message.chat.id, cb.message.message_id, `✅ <b>승인·발송됨</b> — 주문 <code>${id}</code> → ${row.email}`);
    } else if (action === 'reject') {
      await sbUpdate(id, { status: 'pending_refund' });
      await tgAnswer(cb.id, '❌ 반려 — 수동 환불 필요');
      await tgEdit(cb.message.chat.id, cb.message.message_id, `❌ <b>반려됨</b> — 주문 <code>${id}</code> · 포트원 관리자에서 <b>수동 환불</b> 필요 (${row.email})`);
    } else if (action === 'regen') {
      const inp = row.payload && row.payload.input;
      if (!inp) { await tgAnswer(cb.id, '원본 입력이 없어 재생성 불가 (이 기능 배포 이후 신규 주문부터 가능)'); return res.status(200).json({ ok: true }); }
      if (row.status === 'regenerating') { await tgAnswer(cb.id, '이미 재생성 중이에요'); return res.status(200).json({ ok: true }); }
      await sbUpdate(id, { status: 'regenerating' });
      await tgAnswer(cb.id, '🔄 재생성 시작 (1~2분 걸려요)');
      await tgEdit(cb.message.chat.id, cb.message.message_id, `🔄 <b>재생성 중…</b> — 주문 <code>${id}</code> · 완료되면 새 검수 메시지가 와요.`);
      try {
        const gen = await generateReport(inp);
        const np = { ...row.payload, parents: gen.parents, range: gen.range, overview: gen.overview, dates: gen.dates, ts: new Date().toISOString() };
        await sbUpdate(id, { status: 'pending_review', payload: np });
        await tgReview(id, np);   // 새 검수 메시지(승인·반려·재생성 버튼 포함)
      } catch (e) {
        console.error('[birth-review regen]', e);
        await sbUpdate(id, { status: 'pending_review' });
        await tgEdit(cb.message.chat.id, cb.message.message_id, `⚠️ <b>재생성 실패</b> — 주문 <code>${id}</code> · 다시 시도해 주세요.`);
      }
    }
    return res.status(200).json({ ok: true });
  } catch (e) { console.error('[birth-review]', e); return res.status(200).json({ ok: true }); }
}
