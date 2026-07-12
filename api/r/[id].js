// api/r/[id].js — 공유 전용 라우트
// 카톡/페북 봇 → 개인화 OG 태그(썸네일)를 읽고 끝
// 사람        → /rate?report={id} 로 즉시 리다이렉트
//
// UA 스니핑 대신 "봇은 JS를 실행하지 않는다"를 이용 → 더 안전하고 봇 목록 관리 불필요.

export default async function handler(req, res) {
  const id = String(req.query.id || '').replace(/[^A-Za-z0-9_-]/g, '');
  const site = 'https://sajublueprint.com';

  if (!id) {
    res.writeHead(302, { Location: `${site}/rate` });
    return res.end();
  }

  const target = `${site}/rate?report=${id}`;
  const ogImage = `${site}/api/og?id=${id}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // 봇 캐시는 허용하되 너무 길지 않게 (리포트는 불변이라 길어도 무방)
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');

  res.status(200).send(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>사주로 분석하는 썸남 랭킹🔮</title>

<meta property="og:type" content="website">
<meta property="og:site_name" content="The Saju Blueprint">
<meta property="og:title" content="사주로 매긴 내 남자 랭킹🔮">
<meta property="og:description" content="누가 진짜 내 인연일까? 사주로 분석한 결과를 확인해보세요.">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${target}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">

<link rel="canonical" href="${target}">
<script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
<p>결과 페이지로 이동 중… <a href="${target}">바로가기</a></p>
</body>
</html>`);
}
