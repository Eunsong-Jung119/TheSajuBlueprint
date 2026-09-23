// POST /api/birth-review — 텔레그램 콜백 웹훅 (승인/반려 버튼).
// 승인 → 고객에게 Resend로 리포트 링크 발송 · status=sent
// 반려 → status=pending_refund (수동 환불). 기존 send-rating-report / alert-admin 패턴.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SITE = 'https://fatelab.co';   // 리포트 링크는 항상 fatelab.co (공유 env가 다른 상품용이라 무시)
const TG = process.env.TELEGRAM_BOT_TOKEN;
const { selectBirthDates } = require('../lib/birth-engine.js');
const { buildFacts } = require('../lib/birth-facts.js');
const { buildDateMessages, buildOverviewContext, buildParentMessages } = require('../lib/birth-report-prompt.js');

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
// ── 발송 메일 (49,000원짜리 리포트의 '첫인상'이라 표지처럼 공들여서) ──
// 메일 클라이언트(지메일·네이버·아웃룩) 호환을 위해 table 레이아웃 + 인라인 스타일만 사용.
const _esc = s => String(s ?? '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const TOC = [
  '우리는 어떤 부모가 될까?', '왜 이 3일일까 · 선택 가이드', '이 아이의 첫인상', '우리 아이 사용설명서',
  '꽃피울 분야 · 적성', '돈복 · 곁을 지키는 귀인', '우리 가족 시트콤', '균형을 돕는 이름 · 작명 가이드',
  '크게 피어나는 때 · 향후 10년', '아기가 보내는 편지',
];
function emailHtml(id, payload) {
  const link = `${SITE}/b/${id}`;
  const baby = (payload && payload.baby) || {};
  const dates = (payload && payload.dates) || [];
  const range = (baby.due_from && baby.due_to) ? `${_esc(baby.due_from)} ~ ${_esc(baby.due_to)}` : '';

  // 세 날짜 미리보기 — 캐릭터 한 줄을 살짝 보여줘서 열어보고 싶게
  const cards = dates.map(d => {
    const c = d.content || {};
    const line = c.char_line || c.type || '';
    return `<tr><td style="padding:0 0 8px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #f0e2d4;border-radius:12px">
        <tr>
          <td width="62" style="padding:13px 0 13px 14px;vertical-align:middle;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:17px;font-weight:bold;color:#40323b;white-space:nowrap">${_esc(d.date)}</td>
          <td style="padding:13px 14px 13px 10px;vertical-align:middle;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:13.5px;line-height:1.5;color:#5a4a44">${_esc(line)}</td>
        </tr>
      </table></td></tr>`;
  }).join('');
  const preview = cards ? `
    <tr><td style="padding:4px 0 6px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:13px;font-weight:bold;color:#c8992f">골라드린 세 날짜, 이런 아이예요</td></tr>
    ${cards}
    <tr><td style="padding:2px 0 0;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:11.5px;line-height:1.6;color:#8a7a72">세 날짜는 점수 순위가 아니라 <b style="color:#40323b">서로 다른 이야기</b>예요. 리포트 안에 “어떤 아이를 바라시나요”로 고르는 선택 가이드를 담아두었어요.</td></tr>` : '';

  const toc = TOC.map((t, i) => `<tr>
    <td width="20" style="padding:3px 0;vertical-align:top;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:12px;color:#e79a86;font-weight:bold">${i + 1}</td>
    <td style="padding:3px 0;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:13px;line-height:1.6;color:#5a4a44">${t}</td></tr>`).join('');

  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>우리 아기 사주 스케치북</title></head>
<body style="margin:0;padding:0;background:#fff8f1">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">곧 만날 아기의 타고난 결을 담은 스케치북이 완성됐어요. 세 날짜, 세 가지 이야기를 확인해 보세요.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff8f1">
<tr><td align="center" style="padding:28px 16px 36px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%">

  <tr><td align="center" style="padding-bottom:6px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:11.5px;font-weight:bold;color:#e79a86;letter-spacing:2px">FATELAB${range ? ' · ' + range : ''}</td></tr>
  <tr><td align="center" style="padding-bottom:6px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:26px;font-weight:bold;color:#40323b;line-height:1.35">우리 아기<br>사주 스케치북</td></tr>
  <tr><td align="center" style="padding-bottom:22px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:13.5px;color:#8a7a72">— 곧 만날 아기의 타고난 결 —</td></tr>

  <tr><td style="background:#ffffff;border-radius:18px;padding:22px 20px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:15px;line-height:1.85;color:#5a4a44;padding-bottom:16px">
        보내주신 출산 가능일 안에서 <b style="color:#40323b">세 날짜</b>를 골라, 아기의 타고난 결을 하나하나 그려두었어요.<br>
        정답을 정해드리려는 게 아니라, <b style="color:#40323b">‘이런 아이일 수 있겠구나’</b> 하고 미리 마음의 준비를 함께하는 작은 책이에요.
      </td></tr>
      ${preview}
    </table>
  </td></tr>

  <tr><td align="center" style="padding:24px 0 8px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td align="center" bgcolor="#e79a86" style="background:#e79a86;background-image:linear-gradient(135deg,#f0a98f,#c9bff0);border-radius:14px">
        <a href="${link}" style="display:inline-block;padding:16px 34px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none">우리 아기 스케치북 열어보기 →</a>
      </td></tr></table>
  </td></tr>
  <tr><td align="center" style="padding-bottom:24px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:11.5px;color:#8a7a72">링크는 저장해두시면 언제든 다시 열어보실 수 있어요</td></tr>

  <tr><td style="background:#ffffff;border-radius:18px;padding:20px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding-bottom:8px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:14px;font-weight:bold;color:#40323b">이 스케치북에 담긴 이야기</td></tr>
      <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${toc}</table></td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:14px 0 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf3ea;border:1px dashed #e2c4a5;border-radius:14px">
      <tr><td style="padding:15px 18px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:13px;line-height:1.75;color:#5a4a44">
        <b style="color:#40323b">함께 보고 싶은 분이 있다면</b><br>
        리포트 맨 아래 <b style="color:#40323b">공유하기</b> 버튼으로 남편분·부모님께 그대로 보내실 수 있어요. 부모님 생년월일이 담겨 있으니 가까운 분들과만 나눠주세요.
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:20px 4px 0;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:13px;line-height:1.8;color:#5a4a44">
    읽으시다 궁금한 점이 있으면 이 메일에 그대로 답장 주세요. 제가 직접 읽고 답해드려요.<br>
    <span style="color:#8a7a72">아이 이름을 고민 중이시라면, 리포트 8장의 작명 가이드도 함께 봐주세요.</span>
  </td></tr>

  <tr><td style="padding:22px 4px 0;border-top:1px solid #f0e6da"></td></tr>
  <tr><td style="padding:12px 4px 0;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:11.5px;line-height:1.7;color:#a99a8b">
    본 리포트는 사주명리 해석에 근거한 참고 자료이며, 정해진 미래나 의학적 판단을 제공하지 않아요. 출산 시기·방법은 반드시 주치의와 상의해 주세요.<br><br>
    페이트랩 · fatelab.co · 문의 fatelab@naver.com
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}
async function sendEmail(to, id, payload) {
  const html = emailHtml(id, payload);
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: '페이트랩 <noreply@fatelab.co>', reply_to: 'fatelab@naver.com', to, subject: '우리 아기 사주 스케치북이 완성됐어요 🍼', html }) });
  return r.ok;
}

// ── 재생성용: 원본 입력으로 날짜선별→팩트→GPT 재생성 (birth-create와 동일 파이프라인) ──
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
async function generateReport(input) {
  const { mom, dad, baby } = input;
  const toYMD = (s) => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
  // 입력값이 '인시 (03:00~05:00)' 형태라 slice(0,2)는 '인시'→NaN→12가 되어 시주가 전부 무시됐음.
  // 괄호 안 시작 시각을 뽑아 실제 시주를 반영. (범위 중간값으로 잡아 경계 오차 방지)
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
  const facts = buildFacts(sel, baby.sex);
  const [contents, pTxt] = await Promise.all([
    Promise.all(facts.map(f => gptDate(buildDateMessages(f, sel.parents, facts.filter(x => x !== f))))),
    gptDate(buildParentMessages(sel.parentAn)).catch(e => { console.error('[parent-gpt]', e && e.message); return null; }),
  ]);
  applyParentText(sel.parentAn, pTxt);
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
      const ok = await sendEmail(row.email, id, row.payload);
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
