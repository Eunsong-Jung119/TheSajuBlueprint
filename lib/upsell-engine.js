// ─────────────────────────────────────────────────────────────
// RATE YOUR EX (KR) — UPSELL PROMPT ENGINE
// 공략집(conquest) / 재회운(reunion) × 여자카드 3 + 남자카드 3
// saju-engine.js의 calcRelationalStructure / calcLoveTiming 재활용.
// GPT는 구조 데이터를 "근거"로만 받고, 한국어 카드를 작성한다.
// 배치: /rate/upsell-engine.js (saju-engine.js, prompt-engine.js와 동일 폴더)
// ─────────────────────────────────────────────────────────────

const E = require('./saju-engine');

// 일간 인덱스 → 오행 (saju-engine은 TG_ELEM을 export하지 않으므로 로컬 정의)
const TG_ELEM_LOCAL = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
const TG_YY_LOCAL   = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
const ELEM_KO = { Wood:'목(木)', Fire:'화(火)', Earth:'토(土)', Metal:'금(金)', Water:'수(水)' };

function dayElemKo(dayTG) {
  return `${TG_YY_LOCAL[dayTG] === 'Yang' ? '양' : '음'} ${ELEM_KO[TG_ELEM_LOCAL[dayTG]]}`;
}

// ── 한 사람의 전체 구조 분석 ──────────────────────────────────
function buildPerson(birth) {
  const y = parseInt(birth.year);
  const m = parseInt(birth.month);
  const d = parseInt(birth.day);
  const hourKnown = !(birth.hour === null || birth.hour === undefined || birth.hour === '');
  const hr = hourKnown ? parseInt(birth.hour) : 12; // 시 모르면 정오 디폴트(일지 기반 분석엔 영향 없음)

  const saju     = E.calcSaju(y, m, d, hr, 0, false, null);
  const strength = E.calcStrengthScore(saju.pillars, saju.dayTG);
  const sipseong = E.calcSipseongV3(saju.pillars, saju.dayTG);
  const hapchung = E.calcHapChungV2(saju.pillars);
  const sinsal   = E.calcSinsal(saju.pillars);
  const rel      = E.calcRelationalStructure(saju.pillars, saju.dayTG, strength, sipseong, hapchung);
  const yong     = E.calcYongshin(saju);

  return { birth, saju, strength, sipseong, hapchung, sinsal, rel, yong, hourKnown };
}

// ── 두 사람 사이의 오행 역학 (왜 끌리는지 / 도움 되는지) ──────
function crossSignal(me, target) {
  const meE = TG_ELEM_LOCAL[me.saju.dayTG];
  const tgE = TG_ELEM_LOCAL[target.saju.dayTG];
  const gen  = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
  const ctrl = { Wood:'Earth', Fire:'Metal', Earth:'Water', Metal:'Wood', Water:'Fire' };

  let dynamic;
  if (meE === tgE)            dynamic = `같은 오행(${ELEM_KO[meE]}) — 거울 같은 동질감. 닮아서 편하지만 같은 약점/사각지대를 공유함.`;
  else if (gen[tgE] === meE)  dynamic = `그의 ${ELEM_KO[tgE]}가 너의 ${ELEM_KO[meE]}를 생함(印) — 그가 너를 보살피고 안정시키는 에너지. 기대고 싶어지는 구도.`;
  else if (gen[meE] === tgE)  dynamic = `너의 ${ELEM_KO[meE]}가 그의 ${ELEM_KO[tgE]}를 생함(食傷) — 네가 먼저 쏟고 챙기는 구도. 헌신적이지만 소진 주의.`;
  else if (ctrl[meE] === tgE) dynamic = `너의 ${ELEM_KO[meE]}가 그의 ${ELEM_KO[tgE]}를 극함(財) — 네가 주도권을 쥐고 관리하는 구도. 네가 그를 "다룰 수 있다"고 느낌.`;
  else if (ctrl[tgE] === meE) dynamic = `그의 ${ELEM_KO[tgE]}가 너의 ${ELEM_KO[meE]}를 극함(官) — 강하게 끌리지만 압박/긴장이 동반되는 구도. 무너지기 쉬운 끌림.`;
  else                        dynamic = `중립적 오행 관계.`;

  let yongLine = '';
  if (tgE === me.yong.yongshin) yongLine = `★ 그의 오행(${ELEM_KO[tgE]})은 너에게 부족한 안정 오행(용신). 장기적으로 너를 균형 잡아주는 타입.`;
  else if (tgE === me.yong.gishin) yongLine = `⚠ 그의 오행(${ELEM_KO[tgE]})은 너의 균형을 흔드는 오행(기신). 끌리지만 불안정이 가중되는 타입.`;

  return [`[두 사람 오행 역학] ${dynamic}`, yongLine].filter(Boolean).join('\n');
}

// ── 관계 구조를 GPT용 데이터 블록으로 포맷 ─────────────────────
function fmtRel(p, who) {
  const r = p.rel;
  return [
    `${who} 일간: ${dayElemKo(p.saju.dayTG)} / 신강신약: ${p.strength.label} (${p.strength.total})`,
    `Love Nature: ${r.loveNatureKey} -- ${r.loveNatureBody}`,
    `Relationship Behavior: ${r.relationshipBehavior}`,
    `Attraction Archetype: ${r.attractionArchetypeLabel} (${r.attractionArchetypeDesc}) -- ${r.attractionArchetypeBehavior}`,
    `Stability Source: ${r.stabilityArchetypeLabel} -- ${r.stabilityArchetypeDesc}`,
    `Intimacy Style: ${r.intimacyStyle}`,
    `Red Flag: ${r.redFlagKey} -- ${r.redFlagBody}`,
    `Radical Honesty: ${r.radicalHonesty}`,
    `Heartbreak Pattern (이 사람을 무너뜨리는 상대 유형): ${r.heartbreakKey} -- ${r.heartbreakBody}`,
    `Loves-You-Right (이 사람을 진짜 안정시키는 상대): ${r.lovesYouRightKey} -- ${r.lovesYouRightBody}`,
    `Relationship Risk: ${r.relationshipRisk}`,
    `Scores: 친밀축안정 ${r.intimateAxisStability} / 끌림강도 ${r.attractionIntensity} / 애착안정 ${r.attachmentStability} / 감정깊이 ${r.emotionalDepth} / 헌신준비 ${r.commitmentReadiness} / 변동성 ${r.volatilityLabel}`,
    `일지(배우자궁) flags: 충=${r.hasClash} 합=${r.hasCombine} 파=${r.hasPo} 형=${r.hasXing}`,
    `십성 top: ${p.sipseong.summary.top3Str}`,
    `배우자궁: ${p.sipseong.summary.dayPalaceStr}`,
  ].join('\n');
}

// ── 재회운용 타이밍 블록 ──────────────────────────────────────
function fmtTiming(p, who) {
  const t = E.calcLoveTiming(p.saju.pillars, p.saju.dayTG, p.sipseong, p.sinsal, 2026);
  return `${who} 연애/관계 타이밍: ${t.summary}`;
}

// ════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ════════════════════════════════════════════════════════════
const STYLE_BLOCK = `
[톤 & 스타일]
- 한국어. 독자(여자)는 "너"로 부르고, 상대 남자는 "그" 또는 "이 남자"로 지칭한다.
- 팩폭하지만 따뜻하게. 친한 언니가 사주 봐주듯, 직설적이되 응원이 깔려 있게.
- 사주 용어는 가볍게만 노출 (오행/일지/겁재/관성 정도는 OK, 한자 영어 라벨 그대로 노출 금지).
- 아래 제공된 영어 구조 데이터는 "근거"일 뿐. 절대 영어 라벨이나 점수를 그대로 베껴 쓰지 말고, 자연스러운 한국어 인사이트로 녹여라.
- 각 카드 body는 3~4문장, 100~150자. hook은 한 줄(20~35자) 펀치라인.
- 두루뭉술 금지. 구체적인 행동/상황 묘사로 "내 얘기다" 싶게.

[출력 규칙 — 매우 중요]
- 오직 raw JSON만 반환. 마크다운/백틱/설명 금지.
- 모든 string은 큰따옴표. string 값 안에 줄바꿈 금지(한 줄). 큰따옴표 이스케이프 주의.
- trailing comma 금지.`;

const SYSTEM_CONQUEST = `너는 한국 사주 연애 전문가야. 입력된 두 사람의 사주 구조 데이터를 바탕으로, "이 남자 공략집"을 작성한다.
목표: 여자가 (1) 자기 연애 패턴을 정확히 자각하게 만들고, (2) 이 남자의 작동 방식을 파악해서, (3) 어떻게 다가가야 그가 마음을 여는지까지 알려주는 것.

여자 카드 3장 → 남자 카드 3장 순서. (먼저 본인 얘기로 몰입시키고, 그 다음 남자로 긴장을 넘긴다)

여자 카드:
  1. "너의 애착 패턴" — 사랑을 표현하고 받는 방식. Love Nature + Relationship Behavior + 애착안정 점수 활용.
  2. "너의 불안 트리거" — 무엇 때문에 집착/흔들리는지. Red Flag + Radical Honesty 활용.
  3. "이 남자한테 반복했을 행동" — 이 유형 앞에서 너가 무의식적으로 하는 행동. Heartbreak Pattern + Relationship Risk + 두 사람 오행 역학 활용.
남자 카드:
  1. "그의 진짜 애착 유형" — 그가 가까워질 때/멀어질 때 어떻게 움직이는지. 그의 Attraction Archetype + Intimacy Style + 애착안정 활용.
  2. "그가 식는 정확한 트리거" — 그를 멀어지게 만드는 것. 그의 Red Flag + Relationship Risk + 변동성 활용.
  3. "그의 마음을 여는 키" — 구체적으로 어떻게 다가가야 하는지(행동 지침 포함). 그의 Stability Source + Loves-You-Right + 두 사람 오행 역학(네가 그에게 줄 수 있는 것) 활용.
${STYLE_BLOCK}

JSON 스키마:
{
  "upsellType": "conquest",
  "womanCards": [
    {"icon":"<이모지>","title":"<카드 제목>","body":"<3~4문장>","hook":"<한 줄 펀치라인>"},
    {"icon":"...","title":"...","body":"...","hook":"..."},
    {"icon":"...","title":"...","body":"...","hook":"..."}
  ],
  "manCards": [
    {"icon":"...","title":"...","body":"...","hook":"..."},
    {"icon":"...","title":"...","body":"...","hook":"..."},
    {"icon":"...","title":"...","body":"...","hook":"..."}
  ]
}`;

const SYSTEM_REUNION = `너는 한국 사주 연애 전문가야. 입력된 두 사람의 사주 구조 데이터를 바탕으로, "재회운" 리포트를 작성한다.
목표: 여자가 (1) 자기 미련의 정체를 직면하고, (2) 이 남자가 지금 어떤 상태인지 파악하고, (3) 연락한다면 언제가 최적인지까지 판단할 수 있게 하는 것.

여자 카드 3장 → 남자 카드 3장 순서.

여자 카드:
  1. "너의 미련 패턴" — 왜 못 잊는지. Heartbreak Pattern + 감정깊이 + Radical Honesty 활용.
  2. "이게 진짜 감정일까, 외로움일까" — 재회 욕구의 정체. Radical Honesty + 애착안정 + 너의 타이밍(지금이 어떤 시기인지) 활용.
  3. "연락하면 네가 먼저 무너질 포인트" — 너의 취약점. Red Flag + Relationship Risk 활용.
남자 카드:
  1. "그가 미련 있을 신호" — 그의 애착 구조상 너를 놓지 못할 가능성. 그의 Intimacy Style + 일지(배우자궁) flags + 애착안정으로 추론(단정 아닌 추론으로).
  2. "지금 연락하면 그의 반응 패턴" — 그가 어떻게 반응할지. 그의 Attraction Archetype + Intimacy Style + 그의 현재 타이밍 활용.
  3. "재회 최적 타이밍" — 언제 연락이 통할지. 두 사람의 연애 타이밍(특정 연도/시기)을 구체적으로. 막연한 말 금지, 데이터의 연도/구간을 근거로.
${STYLE_BLOCK}

JSON 스키마:
{
  "upsellType": "reunion",
  "womanCards": [
    {"icon":"...","title":"...","body":"...","hook":"..."},
    {"icon":"...","title":"...","body":"...","hook":"..."},
    {"icon":"...","title":"...","body":"...","hook":"..."}
  ],
  "manCards": [
    {"icon":"...","title":"...","body":"...","hook":"..."},
    {"icon":"...","title":"...","body":"...","hook":"..."},
    {"icon":"...","title":"...","body":"...","hook":"..."}
  ]
}`;

// ════════════════════════════════════════════════════════════
// USER PROMPTS
// ════════════════════════════════════════════════════════════
function userConquest(me, target, cross) {
  return `[여자(너) 사주 구조]
${fmtRel(me, '여자(너)')}

[남자(그) 사주 구조]
${fmtRel(target, '남자(그)')}

${cross}

위 데이터로 공략집 6장(여자 3 + 남자 3)을 작성해. JSON만 반환.`;
}

function userReunion(me, target, cross) {
  return `[여자(너) 사주 구조]
${fmtRel(me, '여자(너)')}
${fmtTiming(me, '여자(너)')}

[남자(그) 사주 구조]
${fmtRel(target, '남자(그)')}
${fmtTiming(target, '남자(그)')}

${cross}

위 데이터로 재회운 6장(여자 3 + 남자 3)을 작성해. JSON만 반환.`;
}

// ════════════════════════════════════════════════════════════
// 메인: GPT 메시지 빌더
// ════════════════════════════════════════════════════════════
// upsellType: 'conquest' | 'reunion'
// meBirth   : { year, month, day, hour, gender }
// targetBirth: { year, month, day, hour, name }
function buildUpsellMessages(upsellType, meBirth, targetBirth) {
  const me = buildPerson(meBirth);
  const target = buildPerson(targetBirth);
  const cross = crossSignal(me, target);

  const type = upsellType === 'reunion' ? 'reunion' : 'conquest';
  const system = type === 'reunion' ? SYSTEM_REUNION : SYSTEM_CONQUEST;
  const user   = type === 'reunion' ? userReunion(me, target, cross) : userConquest(me, target, cross);

  return {
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user },
    ],
    meta: {
      upsellType: type,
      targetName: targetBirth.name || '상대',
      meDayMaster: dayElemKo(me.saju.dayTG),
      targetDayMaster: dayElemKo(target.saju.dayTG),
    },
  };
}

module.exports = { buildUpsellMessages, buildPerson, crossSignal };
