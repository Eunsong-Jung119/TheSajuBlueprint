// 출산택일 리포트 GPT 프롬프트 — 팩트시트(엔진 계산) → 따뜻한 날짜별 본문 JSON.
// 원칙: 부정·공포 서사 0, 유형은 뾰족하게 단정하되 '예언' 아님, 몽글몽글 존댓말, 의학적 판단 금지.

const SYSTEM = `당신은 예비 부모를 위한 따뜻한 '출산택일 · 아기 기질 스케치' 명리 해설가입니다.
아래 원칙을 반드시 지키세요:
1. 공포·불운·부정 서사 절대 금지. 약점·주의점은 '다정히 채워주면 좋은 결'로 부드럽게 리프레임.
2. 유형·기질·적성은 '두루뭉술'하지 않게 뾰족하게 단정하되, '정해진 미래'가 아니라 '타고난 결/경향'으로 표현.
3. 사고·질병·수명·이혼·가난 등 불안 유발 언급 금지. 의학적 판단·출산 시기 권고 금지(참고용).
4. 문체: 몽글몽글하고 다정한 존댓말, 아기를 소개받는 느낌. 이모지는 절제해서(항목당 0~1개).
5. 제공된 '팩트'(사주·오행·신강약·용신·신살·부모궁합)에 근거해서만 작성. 팩트에 없는 신살/운명 지어내기 금지.
반드시 지정된 JSON 스키마로만 응답하세요.`;

// 팩트 한 날짜 → GPT 메시지 배열 (날짜별 1콜)
function buildDateMessages(fact, parents) {
  const bondStr = fact.bonds.map(b => `${b.who}(일간 ${b.parentDay[0]}, 일지 ${b.parentDay[1]}): 아기 기준 십성=${b.sipseong}, 일지관계=${b.branchRel}`).join(' / ');
  const sinsal = fact.wealthSinsal.map(s => `${s.key}(${s.label}: ${s.desc})`).join(', ') || '두드러진 재물 신살 없음(성실 자수성가형으로 서술)';
  const facts = `[아기 팩트 · ${fact.date}]
- 사주(년월일, 시주 미정): ${fact.saju3.join(' ')}
- 일간(일간 오행): ${fact.dayMaster}(${fact.dayEl}) · 물상: ${fact.mulsang}
- 오행 분포(%): ${JSON.stringify(fact.ohaeng)} / 결측: ${fact.missing.join(',')||'없음'} / 우세: ${fact.dominant}
- 신강약: ${fact.strengthLevel} (지표 ${fact.strengthPct})
- 용신 ${fact.yongshin} · 희신 ${fact.heeshin} · 기신 ${fact.gishin}
- 재물/귀인 신살: ${sinsal}${fact.guiin.length?' · 귀인: '+fact.guiin.join(','):''}
- 부모와의 궁합: ${bondStr}`;

  const schema = `아래 JSON 스키마로만 응답:
{
 "type":"한 문장 유형 단정(예: 섬세하고 야무진 '똑부러지는 모범생')",
 "emoji":"유형 상징 이모지 1개",
 "gist":"타고난 결 3~4문장(일간 물상+오행+신강약 근거)",
 "child":"유년기 한 문장","teen":"소년기 한 문장","adult":"성인기 한 문장",
 "manual_body":"사용설명서 2~3문장(이런 아이예요+살짝 주의결)",
 "manual_watch":"다정히 살펴주면 좋은 점 2문장(부드럽게)",
 "manual_tip":"부모 팁 한 문장",
 "career_head":"적성 한마디","career_picks":[["분야","⭕ 근거"],["분야","⭕ 근거"],["덜 맞는 결","△ 이유"]],
 "career_desc":"적성 2문장",
 "wealth_head":"돈복 한마디","wealth_money":"타고난 돈복 2문장","wealth_tip":"부모 팁 한 문장",
 "bonds":[{"who":"엄마","tag":"십성·일지관계 태그","text":"엄마와의 관계 2문장"},{"who":"아빠","tag":"...","text":"..."}],
 "gem":"특별한 인연 한 줄(천간합/삼합/등라계갑 등 팩트 근거, 없으면 가장 좋은 궁합 요소)",
 "bloom_good":"크게 피어나는 결 1문장","bloom_care":"마음 써주면 좋은 결 1문장"
}`;

  return [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: facts + '\n\n' + schema },
  ];
}

// 표지/교차 섹션(부모·왜 이 3일·작명)용 요약 컨텍스트
function buildOverviewContext(facts, parents) {
  return {
    parents: parents.map((p,i)=>({ who:i===0?'엄마':'아빠', day:p.dayPillar, el:p.dayEl })),
    dates: facts.map(f=>({ date:f.date, day:f.saju3[2], type_el:f.dayEl, yong:f.yongshin, level:f.strengthLevel, balance:f.ohaeng })),
    commonYong: facts.map(f=>f.yongshin),
  };
}

module.exports = { SYSTEM, buildDateMessages, buildOverviewContext };
