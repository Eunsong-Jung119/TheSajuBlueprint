// api/track-rate.js  (CommonJS) — 통합 로깅 엔드포인트
// 한국어(rate_logs) + 영어(user_logs) 둘 다 처리. lang으로 테이블 분기.
//   body.lang === 'en'  → user_logs (구 /api/track 동작 호환: event/event_name, country 저장)
//   그 외(기본 한국어)   → rate_logs
//
// [변경 이력]
//  - fix: 한국어 경로에서 클라이언트 referrer를 serverReferrer로 덮어쓰던 버그 수정.
//         (오가닉 유입 판별이 전부 direct로 잘못 잡히던 원인)
//  - add: js_error 이벤트 정규화 + 페이로드 길이 제한
//  - add: navigator.sendBeacon (text/plain) 요청 파싱 지원
//  - add: js_error 는 실패해도 200 반환 (에러 로깅이 에러를 부르는 루프 차단)

const { createClient } = require('@supabase/supabase-js');
const { sendAlert } = require('./alert-admin');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ── 운영자 즉시 알림이 필요한 이벤트 ────────────────────
//  결제 후 사고는 유저가 알려주기 전에 내가 먼저 알아야 한다.
const ALERT_EVENTS = {
  payment_unverified:    '🔴 유령 결제 (포트원에 거래 없음)',
  report_recovery_shown: '🟠 미완료 결제 발견 (결제됐는데 리포트 없음)',
};

// 같은 종류가 10분 내 5건 넘게 오면 알림을 멈춘다 (장애 시 폭주 방지)
async function _tooMany(eventName) {
  try {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('rate_logs')
      .select('id', { count: 'exact', head: true })
      .eq('event_name', eventName)
      .gte('created_at', since);
    return (count || 0) > 5;
  } catch (e) { return false; }
}

async function maybeAlert(name, meta, sessionId) {
  const isPaidError = name === 'js_error' && (meta.paid === true || meta.paid === 'true');
  const title = ALERT_EVENTS[name] || (isPaidError ? '🔴 결제 후 오류 발생' : null);
  if (!title) return;
  if (await _tooMany(name)) {
    console.warn('[alert] 최근 10분 내 다발 — 알림 생략:', name);
    return;
  }
  const kst = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const lines = [
    `시각: ${kst}`,
    `세션: ${sessionId || '(없음)'}`,
    meta.payment_id ? `결제ID: ${meta.payment_id}` : null,
    meta.where ? `위치: ${meta.where}` : null,
    meta.message ? `메시지: ${String(meta.message).slice(0, 300)}` : null,
    meta.status ? `포트원 상태: ${meta.status}` : null,
    meta.reason ? `사유: ${meta.reason}` : null,
    meta.guy_count ? `상대 수: ${meta.guy_count}` : null,
    '',
    '대시보드: https://sajublueprint.com/rate-dashboard.html',
  ].filter(Boolean);
  // 로깅 응답을 막지 않도록 await 하지 않는다
  sendAlert(title, lines).catch(e => console.error('[alert] 발송 실패', e && e.message));
}

const MAX_STR = 500;      // 개별 문자열 필드 상한
const clip = (v, n = MAX_STR) =>
  (typeof v === 'string' && v.length > n) ? v.slice(0, n) + '…' : v;

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Access-Control-Allow-Origin', 'https://sajublueprint.com');

  // navigator.sendBeacon 은 Content-Type 이 text/plain 이라 body가 문자열로 들어온다.
  // 페이지를 떠나는 순간(에러 후 이탈)에도 전송되므로 반드시 파싱해줘야 함.
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const {
    lang,
    event, event_name, session_id,
    metadata, source, medium, campaign, referrer,
  } = body;

  const name = event_name || event || 'unknown';
  if (!name || name === 'unknown') {
    if (!event && !event_name) return res.status(400).json({ error: 'Missing event_name' });
  }

  const serverReferrer = req.headers['referer'] || req.headers['referrer'] || null;
  const userAgent = req.headers['user-agent'] || null;
  const isErrorEvent = name === 'js_error';

  // ── 영어판: user_logs (기존 동작 보존) ──
  if (lang === 'en') {
    const country = req.headers['x-vercel-ip-country'] || 'unknown';
    const clientReferrer = referrer || (metadata && metadata.referrer) || null;
    const meta = {
      ...(metadata || { source, medium, campaign }),
      country,
      referrer: clientReferrer || serverReferrer || null,
      server_referrer: serverReferrer || null,
      user_agent: userAgent,
    };
    try {
      await supabase.from('user_logs').insert([{
        event_name: name,
        session_id: session_id || null,
        metadata: meta,
      }]);
    } catch (e) { /* 기존 동작: 에러 삼킴 */ }
    return res.status(200).json({ ok: true });
  }

  // ── 한국어판: rate_logs (기본) ──
  // ⚠️ 클라이언트가 보낸 referrer(진짜 외부 유입 출처)를 우선한다.
  //    serverReferrer 는 fetch를 호출한 자기 사이트 URL이라, 이걸로 덮으면
  //    인스타/페북 오가닉 유입이 전부 direct 로 잘못 분류된다.
  const clientReferrer = referrer || (metadata && metadata.referrer) || null;

  const meta = {
    ...(metadata || {}),
    referrer: clientReferrer || serverReferrer || null,
    server_referrer: serverReferrer || null,
    user_agent: userAgent,
  };

  // js_error: 필드 정규화 + 길이 제한 (스택이 통째로 들어와 로우가 비대해지는 것 방지)
  if (isErrorEvent) {
    meta.message = clip(meta.message || '');
    meta.source  = clip(meta.source || '', 120);
    meta.stack   = clip(meta.stack || '', 1000);
    meta.page    = clip(meta.page || '', 200);
  }

  const { error } = await supabase
    .from('rate_logs')
    .insert({
      event_name: name,
      session_id: session_id || null,
      metadata: meta,
    });

  // 결제 후 사고면 운영자에게 즉시 푸시 (응답을 지연시키지 않음)
  maybeAlert(name, meta, session_id).catch(() => {});

  if (error) {
    console.error('[track-rate] supabase error:', error.message, '| event:', name);
    // 에러 로깅이 실패해서 다시 에러를 유발하는 루프를 막기 위해 js_error 는 200 반환
    if (isErrorEvent) return res.status(200).json({ ok: false });
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ ok: true });
};