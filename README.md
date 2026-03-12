# The Saju Blueprint — Deployment Guide

## 파일 구조
```
saju-blueprint/
├── public/
│   ├── index.html      ← 랜딩페이지 (/)
│   ├── order.html      ← 정보입력 (/order)
│   ├── checkout.html   ← 결제 (/checkout)
│   ├── generating.html ← 로딩 (/generating)
│   └── result.html     ← 결과 (/result?id=xxx)
├── api/
│   ├── create-payment-intent.js  ← Stripe 결제 생성
│   ├── generate.js               ← GPT 블루프린트 생성
│   └── get-result.js             ← 결과 조회
├── lib/
│   └── saju-engine.js            ← 사주 계산 엔진
├── vercel.json
└── package.json
```

## 배포 순서

### 1. Vercel 설정
```bash
npm i -g vercel
cd saju-blueprint
vercel
```

### 2. 환경변수 설정 (Vercel 대시보드 또는 CLI)
```bash
vercel env add STRIPE_SECRET_KEY
# → Stripe 대시보드 > Developers > API keys > Secret key

vercel env add OPENAI_API_KEY
# → platform.openai.com/api-keys
```

### 3. Stripe 설정
1. stripe.com 가입
2. Products > Add product: "The Saju Blueprint" $9.99
3. Developers > API keys에서 Publishable key 복사
4. `public/checkout.html` 에서 `STRIPE_PUBLISHABLE_KEY_PLACEHOLDER` 를 실제 키로 교체

### 4. 할인코드 변경
`public/checkout.html`과 `api/create-payment-intent.js` 두 곳의 DISCOUNT_CODES 동일하게 유지:
```js
const DISCOUNT_CODES = {
  'LAUNCH50': 50,   // 50% off
  'FRIEND30': 30,   // 30% off
  'COSMIC20': 20,   // 20% off
};
```

### 5. 배포
```bash
vercel --prod
```

## 주의사항

### 결과 데이터 영속성
현재 api/generate.js는 **in-memory** 저장이라 서버리스 재시작시 결과가 사라짐.
프로덕션에서는 **Vercel KV** 추가 권장:

```bash
vercel kv create saju-results
```
그 다음 generate.js / get-result.js에서 kv.set / kv.get 사용.

### 비용 예상 (월 100건 기준)
- GPT-4o: ~$0.03/건 × 100 = $3
- Vercel: 무료
- Stripe: 2.9%+30¢ × $9.99 × 100 = ~$59 수수료
- **순수익: ~$940/월 (100건 기준)**

## 플로우
```
/ (랜딩) → /order (정보입력) → /checkout (결제 $9.99)
→ /generating (로딩 + GPT 호출) → /result?id=xxx (결과)
```
