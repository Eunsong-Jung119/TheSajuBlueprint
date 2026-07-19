// api/alert-admin.js  (CommonJS)
// 결제 후 사고가 나면 운영자에게 즉시 푸시한다.
//
// 환경변수 (설정된 채널로만 발송 — 하나만 넣어도 동작)
//   TELEGRAM_BOT_TOKEN , TELEGRAM_CHAT_ID   ← 권장. 폰 푸시가 즉시 옴
//   SLACK_WEBHOOK_URL
//   RESEND_API_KEY , ALERT_EMAIL_TO , ALERT_EMAIL_FROM
//
// 텔레그램 세팅 (3분):
//   1) 텔레그램에서 @BotFather 검색 → /newbot → 봇 이름 정하면 토큰 발급
//   2) 만든 봇과 대화 시작 후 아무 메시지나 전송
//   3) https://api.telegram.org/bot<토큰>/getUpdates 접속 → result[0].message.chat.id 확인
//   4) Vercel 환경변수에 TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID 등록

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!r.ok) console.error('[alert] telegram 실패', r.status, await r.text().catch(() => ''));
  return r.ok;
}

async function sendSlack(text) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return false;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return r.ok;
}

async function sendEmail(subject, text) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM;
  if (!key || !to || !from) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!r.ok) console.error('[alert] resend 실패', r.status, await r.text().catch(() => ''));
  return r.ok;
}

// 다른 서버 파일에서 직접 부를 수 있도록 export
async function sendAlert(title, lines) {
  const body = [title, '', ...lines].join('\n');
  const results = await Promise.allSettled([
    sendTelegram(body),
    sendSlack(body),
    sendEmail(title, body),
  ]);
  const sent = results.filter(r => r.status === 'fulfilled' && r.value).length;
  if (!sent) console.warn('[alert] 발송 채널 없음 — 환경변수를 확인하세요');
  return sent;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { title, lines } = body;
  if (!title) return res.status(400).json({ error: 'title 없음' });
  const sent = await sendAlert(title, Array.isArray(lines) ? lines : []);
  return res.status(200).json({ ok: true, sent });
};

module.exports.sendAlert = sendAlert;
