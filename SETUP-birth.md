# 출산택일 백엔드 — 셋업 & 배포 가이드

## 새로 추가된 파일
lib/birth-engine.js        날짜 선별 (오행균형·중화·부모궁합) — calcSaju 재활용
lib/birth-facts.js         날짜별 팩트시트 (사주·오행·신강약·용신·돈복신살·부모궁합)
lib/birth-report-prompt.js GPT 프롬프트 (따뜻한 본문, 부정서사 금지 원칙)
lib/birth-render.js        payload → 브랜드 리포트 HTML
api/birth-create.js        POST: 결제검증→선별→GPT→저장→텔레그램 검수요청
api/birth-review.js        텔레그램 콜백(승인→이메일 발송 / 반려→환불플래그)
api/birth-report.js        GET ?id= : 저장 리포트 HTML 렌더

## 1) Supabase 테이블
```sql
create table birth_reports (
  id text primary key,
  status text default 'pending_review',   -- pending_review | sent | pending_refund | send_failed
  email text,
  payload jsonb,
  sent_at timestamptz,
  created_at timestamptz default now()
);
-- anon 키로 서버 쓰기 → RLS 정책 필요(또는 SERVICE_ROLE 키 사용 권장)
alter table birth_reports enable row level security;
create policy birth_all on birth_reports for all using (true) with check (true);
```

## 2) vercel.json 리라이트 추가 (기존 rewrites 배열에)
```json
{ "source": "/b/:id",  "destination": "/api/birth-report?id=:id" },
{ "source": "/apply",  "destination": "/birth/apply.html" }
```
(기존 /r/:id 는 궁합상품 → 건드리지 않음)

## 3) 환경변수 (대부분 이미 있음)
PORTONE_API_SECRET, OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY,
RESEND_API_KEY, RESEND_FROM, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEXT_PUBLIC_BASE_URL

## 4) 텔레그램 검수 버튼 웹훅 (한 번만)
버튼 클릭(callback_query)이 /api/birth-review 로 오게 설정:
```
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://fatelab.co/api/birth-review"
```
* 주의: 다른 봇 기능이 이미 웹훅을 쓰면 하나의 웹훅 URL에서 라우팅해야 함. 없으면 위대로.

## 5) 가격
api/birth-create.js 의 PRICE = 49000. 포트원 결제금액과 일치해야 검증 통과.

## 남은 작업 (프론트 라스트마일)
- birth/apply.html 마지막 '결제하기' 버튼 → 포트원 결제창(PortOne.requestPayment) →
  성공 시 { mom, dad, baby, contact, paymentId } 를 POST /api/birth-create → 완료화면.
  (포트원 storeId / channelKey(KG이니시스) 넣어서 다음 단계에 붙이면 됨)

## 플로우
apply → 포트원결제 → /api/birth-create (검증·선별·GPT·저장·텔레그램)
→ 텔레그램에서 [리포트 열기][승인][반려] → 승인 시 고객 이메일(/b/:id) 발송.
