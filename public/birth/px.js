/* ────────────────────────────────────────────────────────────
   Meta 픽셀 — 출산택일(fatelab.co) 전용 데이터세트
   rate 상품(1513677227103970)과 분리해서 리포팅·최적화가 안 섞이게 한다.

   ⚠️ 설정:
      1) 이벤트 매니저 → 데이터 소스 → 데이터 세트 연결 → 웹
      2) 발급된 픽셀 ID를 아래 PIXEL_ID 에 붙여넣기
      → 비워두면 아무 요청도 보내지 않는다(안전 no-op). 배포해도 깨지지 않음.

   쏘는 이벤트
      PageView          birth 전 페이지 (자동)
      ViewContent       랜딩 도착
      InitiateCheckout  결제창 열기 직전
      Purchase          결제 승인 — eventID=paymentId 로 서버 CAPI와 중복 제거
   ──────────────────────────────────────────────────────────── */
(function (w, d) {
  var PIXEL_ID = '';          // ← 여기에 새 픽셀 ID (숫자 15~16자리)

  // 상품 파라미터 — 프론트 픽셀과 서버 CAPI가 같은 값을 써야 매칭된다
  w.BPX_PRODUCT = {
    content_type: 'product',
    content_ids: ['birth_report'],
    content_name: '우리 아기 스케치 리포트',
  };

  // _fbp / _fbc 쿠키 — 서버 전환API 매칭률용. 픽셀 미설정이어도 동작한다.
  function ck(n) {
    var m = d.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)');
    return m ? m.pop() : null;
  }
  w.birthFbIds = function () {
    var fbc = ck('_fbc');
    if (!fbc) {
      try {
        var id = new URLSearchParams(w.location.search).get('fbclid');
        if (id) fbc = 'fb.1.' + Date.now() + '.' + id;
      } catch (e) {}
    }
    return { fbp: ck('_fbp'), fbc: fbc };
  };

  if (!PIXEL_ID) { w.bpx = function () {}; return; }

  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (w,d,'script','https://connect.facebook.net/en_US/fbevents.js');
  w.fbq('init', PIXEL_ID);
  w.fbq('track', 'PageView');

  w.bpx = function (name, params, opts) {
    try { w.fbq('track', name, params || {}, opts || undefined); }
    catch (e) { console.error('[bpx]', name, e); }
  };
})(window, document);
