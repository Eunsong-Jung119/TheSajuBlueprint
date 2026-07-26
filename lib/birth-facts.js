// 선별된 날짜별 '팩트시트' 생성 — GPT 프롬프트/렌더러가 소비.
// 아기는 시각 미정 → 3주(년월일). 부모는 4주. 기존 calcSaju/calcYongshin 재활용 + 돈복 신살·부모궁합 계산.
const E = require('./saju-engine.js');
const { branchRel } = require('./birth-engine.js');

const TG = '갑을병정무기경신임계';
const DZ = '자축인묘진사오미신유술해';
const GAN_WX = ['목','목','화','화','토','토','금','금','수','수'];
const GAN_YIN = [1,0,1,0,1,0,1,0,1,0];                 // 1=양
const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
const KE = { 목:'토', 토:'수', 수:'화', 화:'금', 금:'목' };
const HZ = { 목:'木', 화:'火', 토:'土', 금:'金', 수:'水' };
const MULSANG = { 갑:'큰 나무', 을:'화초·넝쿨', 병:'태양', 정:'촛불·별', 무:'큰 산·대지',
  기:'논밭·정원', 경:'무쇠·바위', 신:'보석·칼', 임:'큰 강·바다', 계:'이슬·시냇물' };

// 십성: 일간(dayTG) 기준 상대 천간의 관계
function tenGod(dayTG, otherTG) {
  const de = GAN_WX[dayTG], oe = GAN_WX[otherTG], same = GAN_YIN[dayTG] === GAN_YIN[otherTG];
  if (de === oe) return same ? '비견' : '겁재';
  if (SHENG[de] === oe) return same ? '식신' : '상관';
  if (KE[de] === oe) return same ? '편재' : '정재';
  if (KE[oe] === de) return same ? '편관' : '정관';
  return same ? '편인' : '정인';
}
// 돈복 신살 (일간 index → 목표 지지 한글)
const T_CHEONJU = ['사','오','사','오','신','유','해','자','인','묘'];   // 천주귀인(식복)
const T_GEUMYEO = ['진','사','미','신','미','신','술','해','축','인'];   // 금여(부귀)
const T_AMROK   = ['해','술','신','미','신','미','사','진','인','축'];   // 암록(숨은재복)
const T_MUNCHANG= ['사','오','신','유','신','유','해','자','인','묘'];   // 문창(학문)
const CHEONEUL  = { 갑:'축미',무:'축미',경:'축미',을:'자신',기:'자신',병:'해유',정:'해유',신:'인오',임:'사묘',계:'사묘' };
const GO = { 수:'진', 목:'미', 화:'술', 금:'축', 토:'진' };            // 오행 고(재고용)

function wealthSinsal(dayTG, branches) {
  const set = new Set(branches), dg = TG[dayTG], out = [];
  const has = z => set.has(z);
  if (has(T_CHEONJU[dayTG])) out.push({ key:'천주귀인', label:'식복', desc:'평생 먹을 복이 넉넉한 기운' });
  if (has(T_GEUMYEO[dayTG])) out.push({ key:'금여', label:'부귀·안락', desc:'귀하게 대접받는 편안한 풍요' });
  if (has(T_AMROK[dayTG]))   out.push({ key:'암록', label:'숨은 재복', desc:'보이지 않는 곳에서 돕는 재물·귀인' });
  if ((CHEONEUL[dg]||'').split('').some(has)) out.push({ key:'천을귀인', label:'최고 길신', desc:'어려울 때 귀인이 돕는 복' });
  const jae = KE[GAN_WX[dayTG]];
  if (has(GO[jae])) out.push({ key:'재고', label:'재물창고', desc:'재물을 곳간에 쌓아두는 기운' });
  return out;
}
function guiin(dayTG, branches) {
  const set = new Set(branches), out = [];
  if (set.has(T_MUNCHANG[dayTG])) out.push('문창귀인');
  return out;
}

// 아기 3주 차트 + 팩트
function babyFacts(y, m, d) {
  const s = E.calcSaju(y, m, d, 12, 0, false, 127);
  const pillars3 = [[s.yrTG,s.yrDZ],[s.monthTG,s.monthDZ],[s.dayTG,s.dayDZ]];
  const branches = pillars3.map(([,z]) => DZ[z]);
  const dayEl = GAN_WX[s.dayTG];
  // 오행 3주 분포
  const ZHI_WX = ['수','토','목','목','토','화','화','토','금','금','토','수'];
  const sc = { 목:0,화:0,토:0,금:0,수:0 };
  pillars3.forEach(([t,z]) => { sc[GAN_WX[t]]++; sc[ZHI_WX[z]]++; });
  const pct = {}; ['목','화','토','금','수'].forEach(e => pct[e]=+(sc[e]/6*100).toFixed(1));
  const strong = +(pct[dayEl] + pct[Object.keys(SHENG).find(k=>SHENG[k]===dayEl)]).toFixed(1);
  const level = strong>=62?'신강': strong>=50?'중화신강': strong>=38?'중화신약': strong>=25?'신약':'태약';
  const yong = E.calcYongshin(s);
  const wxKo = w => ({ Wood:'목',Fire:'화',Earth:'토',Metal:'금',Water:'수' }[w] || w);
  return {
    saju3: pillars3.map(([t,z]) => TG[t]+DZ[z]),        // [년,월,일]
    dayMaster: TG[s.dayTG], dayEl, mulsang: MULSANG[TG[s.dayTG]],
    dayBranch: DZ[s.dayDZ], branches,
    ohaeng: pct, missing: Object.keys(pct).filter(e=>pct[e]<5), dominant: Object.keys(pct).sort((a,b)=>pct[b]-pct[a])[0],
    strengthPct: strong, strengthLevel: level,
    yongshin: wxKo(yong.yongshin), heeshin: wxKo(yong.kibun), gishin: wxKo(yong.gishin),
    wealthSinsal: wealthSinsal(s.dayTG, branches),
    guiin: guiin(s.dayTG, branches),
    _dayTG: s.dayTG,
  };
}

// 부모-자식 궁합 (부모 일간→아기 십성, 일지 관계)
function parentBond(babyFact, parent) {
  const pTG = TG.indexOf(parent.dayPillar[0]);
  const sipseong = tenGod(babyFact._dayTG, pTG);        // 부모가 아기에게 어떤 십성인가
  const rel = branchRel(babyFact.dayBranch, parent.dayPillar[1]);
  return { parentDay: parent.dayPillar, sipseong, branchRel: rel };
}

function buildFacts(selection) {
  return selection.top3.map(c => {
    const f = babyFacts(c.y, c.m, c.d);
    const bonds = selection.parents.map((p, i) => ({ who: i===0?'엄마':'아빠', ...parentBond(f, p) }));
    return { date: c.date, score: c.score, ...f, bonds };
  });
}

module.exports = { buildFacts, babyFacts, tenGod };
