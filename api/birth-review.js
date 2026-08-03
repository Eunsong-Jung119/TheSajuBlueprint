// POST /api/birth-review — 텔레그램 콜백 웹훅 (승인/반려 버튼).
// 승인 → 고객에게 Resend로 리포트 링크 발송 · status=sent
// 반려 → status=pending_refund (수동 환불). 기존 send-rating-report / alert-admin 패턴.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SITE = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatelab.co';
const TG = process.env.TELEGRAM_BOT_TOKEN;

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
    body: JSON.stringify({ from: '페이트랩 <noreply@sajublueprint.com>', to, subject: '우리 아기 스케치 리포트가 나왔어요 🍼', html }) });
  return r.ok;
}

export default async function handler(req, res) {
  try {
    const cb = req.body && req.body.callback_query;
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
    }
    return res.status(200).json({ ok: true });
  } catch (e) { console.error('[birth-review]', e); return res.status(200).json({ ok: true }); }
}
