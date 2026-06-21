// ══════════════════════════════════════════════════════════
// upsell-templates.js  —  여자카드 템플릿 엔진 (GPT 미사용)
// /lib/upsell-templates.js 로 배포. CommonJS.
//
// 카드1 근거: 일간(오행) + 배우자궁(일지 십성그룹)
// 카드2 근거: 배우자궁(일지 십성그룹) + 월지(월지 십성그룹)
//
// 사용:
//   const { buildWomanCards } = require('./upsell-templates');
//   const cards = buildWomanCards(saju.dayTG, saju.dayDZ, saju.monthDZ);
//   // → [{ id, body, basis }, { id, body, basis }]
// ══════════════════════════════════════════════════════════

const TG      = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const TG_EN   = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
const TG_ELEM = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
const TG_YY   = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
const ELEM_KO = { Wood:'목', Fire:'화', Earth:'토', Metal:'금', Water:'수' };
const YY_KO   = { Yang:'Yang', Yin:'Yin' };

// 지지 지장간 본기 천간 인덱스
const MAIN = {0:9,1:5,2:0,3:1,4:4,5:2,6:3,7:5,8:6,9:7,10:4,11:8};

// 깨끗한 십성 (한글 라벨만)
function tenGod(dayTG, targetTG){
  if(dayTG===targetTG) return '비견';
  const dE=TG_ELEM[dayTG],dY=TG_YY[dayTG],tE=TG_ELEM[targetTG],tY=TG_YY[targetTG];
  const gen   ={Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood'};
  const ctrl  ={Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire'};
  const genBy ={Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water'};
  const ctrlBy={Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water'};
  if(tE===dE)         return tY===dY?'비견':'겁재';
  if(gen[dE]===tE)    return tY===dY?'식신':'상관';
  if(ctrl[dE]===tE)   return tY!==dY?'정재':'편재';
  if(ctrlBy[dE]===tE) return tY!==dY?'정관':'편관';
  if(genBy[dE]===tE)  return tY!==dY?'정인':'편인';
  return '비견';
}

// 십성 → 5그룹
function godGroup(god){
  if(god==='비견'||god==='겁재') return '비겁';
  if(god==='식신'||god==='상관') return '식상';
  if(god==='정재'||god==='편재') return '재성';
  if(god==='정관'||god==='편관') return '관성';
  return '인성'; // 정인/편인
}

// ── 카드1: 일간 오행 → 오프닝 (좋아하는 방식/속도) ──────────
const OPEN_BY_ELEM = {
  Wood:  '너는 사람한테 따뜻하게 먼저 다가가는 편이야. 정이 많아서 한번 마음 주면 그 사람을 자꾸 챙기게 돼.',
  Fire:  '너는 한번 끌리면 빠르게 타오르는 타입이야. 좋으면 좋다고 티가 나고, 감정을 숨기는 게 잘 안 돼.',
  Earth: '너는 사람을 천천히, 신중하게 들이는 편이야. 쉽게 흔들리진 않지만 한번 정하면 진득하게 오래 봐.',
  Metal: '너는 원래 사람을 쉽게 좋아하는 타입이 아니야. 기준이 까다로워서 아무한테나 마음을 열진 않아.',
  Water: '너는 속을 잘 안 보이는 편이야. 관심이 있어도 한발 물러서서 한참 지켜보고 나서야 다가가.',
};

// ── 카드1: 일지 십성그룹 → 본문 (마음 연 뒤 태도) ──────────
const CARD1_BODY_BY_GROUP = {
  비겁: '근데 막상 사귀면 너만의 공간이 꼭 필요한 사람이야. 사랑해도 독립성을 놓고 싶어 하지 않아서, 너무 들러붙는 관계는 오히려 답답하게 느껴졌을 거야.',
  식상: '근데 한번 마음 열면 표현이 아낌없는 사람이야. 좋으면 다 주는 스타일이라, 준 만큼 돌아오지 않으면 금방 서운해졌을 거야.',
  재성: '근데 연애할 땐 의외로 현실적인 사람이야. 감정만으로 안 움직이고, 이 사람이랑 같이 그릴 그림이 있는지를 먼저 따졌을 거야.',
  관성: '근데 한 번 마음 열면 생각보다 오래 보는 편이지. 그래서 짧게 스쳐가는 인연보다 "이 사람과 미래가 가능할까"를 먼저 생각했을 거야.',
  인성: '근데 막상 사귀면 깊게 빠지는 사람이야. 상대 감정을 너무 잘 읽어서, 때론 네 마음보다 상대를 먼저 챙기다 지치곤 했을 거야.',
};

// ── 카드2: 월지 십성그룹 → 끌리는 유형 (설레는 사람) ──────
const CARD2_ATTRACT_BY_GROUP = {
  비겁: '너를 설레게 하는 건 자기 세계가 뚜렷하고 만만치 않은 사람이야.',
  식상: '너를 설레게 하는 건 표현이 화려하고 너를 재밌게 흔드는 사람이야.',
  재성: '너를 설레게 하는 건 능력 있고 자기 일에 빠져 있는 사람이야.',
  관성: '너를 설레게 하는 건 듬직하고 책임감 있어 보이는 사람이야.',
  인성: '너를 설레게 하는 건 어딘가 비밀스럽고 깊어 보이는 사람이야.',
};

// ── 카드2: 일지 십성그룹 → 오래 갈 유형 (편한 사람) ───────
const CARD2_STABLE_BY_GROUP = {
  비겁: '근데 막상 편한 건 너를 통제 안 하고 거리를 존중해주는 사람이고.',
  식상: '근데 막상 편한 건 네 표현을 따뜻하게 받아주는 사람이고.',
  재성: '근데 막상 편한 건 현실 감각이 맞고 같이 쌓아갈 수 있는 사람이고.',
  관성: '근데 막상 편한 건 한결같이 곁을 지켜주는 안정적인 사람이고.',
  인성: '근데 막상 편한 건 네 감정을 알아주고 묵묵히 받쳐주는 사람이고.',
};

// ── 카드2: 클로징 (일지그룹 vs 월지그룹 일치 여부) ────────
const CARD2_CLOSE = {
  gap:     '문제는 이 둘이 같은 사람이 아니라는 거야. 그래서 연애할 때마다 마음과 현실 사이에서 자주 흔들렸을 가능성이 커.',
  aligned: '다행히 너는 이 둘이 거의 겹치는 편이야. 설레는 사람이 곧 편한 사람이라, 한번 빠지면 흔들림 없이 깊게 가는 타입이지.',
};

// ── 메인 ─────────────────────────────────────────────────
function buildWomanCards(dayTG, dayDZ, monthDZ){
  const dayElem   = TG_ELEM[dayTG];
  const iljiGod   = tenGod(dayTG, MAIN[dayDZ]);    // 배우자궁 십성
  const woljiGod  = tenGod(dayTG, MAIN[monthDZ]);  // 월지 십성
  const iljiGroup  = godGroup(iljiGod);
  const woljiGroup = godGroup(woljiGod);

  const card1Lines = [ OPEN_BY_ELEM[dayElem], CARD1_BODY_BY_GROUP[iljiGroup] ];
  const card1Body = card1Lines.join(' ');

  const aligned = (iljiGroup === woljiGroup);
  const card2Lines = [
    CARD2_ATTRACT_BY_GROUP[woljiGroup],
    CARD2_STABLE_BY_GROUP[iljiGroup],
    (aligned ? CARD2_CLOSE.aligned : CARD2_CLOSE.gap),
  ];
  const card2Body = card2Lines.join(' ');

  // 명리 근거 태그 (subtle)
  const dmLabel = `${TG[dayTG]} ${YY_KO[TG_YY[dayTG]]} ${ELEM_KO[dayElem]}`; // 예: 庚 Yang 금
  const basis1 = `일간 ${dmLabel} · 배우자궁 ${iljiGod}`;
  const basis2 = `배우자궁 ${iljiGod} · 월지 ${woljiGod}`;

  return [
    { id:'w1', body: card1Body, lines: card1Lines, basis: basis1 },
    { id:'w2', body: card2Body, lines: card2Lines, basis: basis2 },
  ];
}

// ══════════════════════════════════════════════════════════
// 남자카드 (심층분석 티저) — 개인화, GPT 미사용
// 카드1 근거: 일간(인상) + 월지 십성(가치·행동)
// 카드2 근거: 일지 십성(배우자궁) = 겉과 다른 속마음
// ══════════════════════════════════════════════════════════

// 카드1 line1 = 일간 오행 → 인상
const MAN_IMPRESSION_BY_ELEM = {
  Wood:  '그는 정이 많고 사람을 잘 챙기는 사람이야.',
  Fire:  '그는 감정 표현이 솔직한 사람이야.',
  Earth: '그는 진중하고 듬직한 사람이야.',
  Metal: '그는 쉽게 속을 내보이지 않는 사람이야.',
  Water: '그는 속이 깊고 생각보다 복잡한 사람이야.',
};

// 카드1 line2·3 = 월지 십성 → 핵심 가치 + 연애 행동
const MAN_VALUE_BY_GOD = {
  비견: { value:'누구에게 맞춰지기보다 스스로 선택하는 게',          act:'호감이 있어도 누가 밀어붙인다고 움직이는 타입은 아니야.' },
  겁재: { value:'관계에서도 밀리지 않고 주도권을 쥐는 게',           act:'좋아해도 끌려가기보다 자기 페이스로 끌고 가려는 편이야.' },
  식신: { value:'함께 있을 때 즐겁고 편안한 분위기가',              act:'감정이 무거워지면 의외로 먼저 거리를 두기도 해.' },
  상관: { value:'틀에 매이지 않고 자기 색을 지키는 게',             act:'좋아해도 본심을 한 번에 다 보여주진 않아.' },
  정재: { value:'안정적이고 예측 가능한 관계가',                   act:'마음이 있어도 현실적인 조건을 먼저 따지는 편이야.' },
  편재: { value:'재미있고 새로운 자극이 있는 관계가',              act:'한곳에 매이기보다 여러 가능성을 열어두려는 편이야.' },
  정관: { value:'책임지고 제대로 된 관계를 만드는 게',             act:'확실해지기 전엔 쉽게 마음을 정하지 않으려 해.' },
  편관: { value:'관계에서 주도하고 강함을 잃지 않는 게',           act:'좋아해도 약한 모습은 잘 안 보이려는 편이야.' },
  정인: { value:'마음이 편안하고 안전하다고 느끼는 게',            act:'확신이 설 때까지 천천히 다가가려는 편이야.' },
  편인: { value:'정답을 정하기보다 가능성을 남겨두는 게',          act:'가까워진 것 같다가도 갑자기 거리를 두는 모습이 보일 수 있어.' },
};

// 카드2 = 일지 십성 → 숨은 욕구
const MAN_HIDDEN_BY_GOD = {
  비견: '곁에 진짜 내 편이 있길 바라는 마음',
  겁재: '누군가에게만큼은 지지 않아도 되는 사이이고 싶은 마음',
  식신: '마음 놓고 기댈 수 있는 편안함을 바라는 마음',
  상관: '자기를 있는 그대로 알아봐 주길 바라는 마음',
  정재: '흔들리지 않는 안정을 누구보다 바라는 마음',
  편재: '한 사람에게 진짜로 정착하고 싶은 마음',
  정관: '의무가 아니라 진심으로 선택받고 싶은 마음',
  편관: '강한 척 안에 누구보다 인정받고 싶은 마음',
  정인: '자기가 먼저 누군가를 깊이 아끼고 싶은 마음',
  편인: '마음 깊이 이해받고 싶은 외로움',
};

function buildManCards(dayTG, dayDZ, monthDZ){
  const dayElem  = TG_ELEM[dayTG];
  const iljiGod  = tenGod(dayTG, MAIN[dayDZ]);    // 배우자궁
  const woljiGod = tenGod(dayTG, MAIN[monthDZ]);  // 월지

  const v = MAN_VALUE_BY_GOD[woljiGod];
  const card1Lines = [
    MAN_IMPRESSION_BY_ELEM[dayElem],
    `느꼈을지 모르겠지만, 그에게는 ${v.value} 꽤 중요한 편이지.`,
    `그래서 ${v.act}`,
  ];

  const hidden = MAN_HIDDEN_BY_GOD[iljiGod];
  const card2Lines = [
    '근데 이게 전부는 아니야.',
    `겉으로 보이는 모습 안에, 사실은 ${hidden}이 있거든.`,
    '너에게 보여주는 모습이 다가 아닌, 꽤나 복잡한 사람이야. 그에 대해 더 알아볼래?',
  ];

  const dmElem = ELEM_KO[dayElem];
  return [
    { id:'m1', lines: card1Lines, body: card1Lines.join(' '), basis:`일간 ${TG[dayTG]} ${dmElem} · 월지 ${woljiGod}` },
    { id:'m2', lines: card2Lines, body: card2Lines.join(' '), basis:`배우자궁 ${iljiGod}` },
  ];
}

module.exports = { buildWomanCards, buildManCards, tenGod, godGroup, MAIN };
