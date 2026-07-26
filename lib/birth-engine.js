// 출산택일 엔진 — 기존 lib/saju-engine.js(calcSaju) 위에 날짜 선별 로직을 얹음.
// 부모 사주(4주) + 출산 가능일 range → 오행균형·신강약중화·부모궁합 기준 top3 선별.
const E = require('./saju-engine.js');

const TG = '갑을병정무기경신임계';
const DZ = '자축인묘진사오미신유술해';
const GAN_WX = ['목','목','화','화','토','토','금','금','수','수'];              // 천간 오행
const ZHI_WX = ['수','토','목','목','토','화','화','토','금','금','토','수'];      // 지지 오행
const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };                    // A생B
const gen_of = w => Object.keys(SHENG).find(k => SHENG[k] === w);                // 나를 생(인성)
const ELS = ['목','화','토','금','수'];

// 지지 관계 (부모-자식 궁합)
const LIUHE = [['자','축'],['인','해'],['묘','술'],['진','유'],['사','신'],['오','미']];
const SANHAP = [['신','자','진'],['해','묘','미'],['인','오','술'],['사','유','축']];
const CHUNG = [['자','오'],['축','미'],['인','신'],['묘','유'],['진','술'],['사','해']];
function branchRel(a, b) {
  if (a === b) return '비화';
  if (LIUHE.some(p => p.includes(a) && p.includes(b))) return '육합';
  if (SANHAP.some(p => p.includes(a) && p.includes(b))) return '반합';
  if (CHUNG.some(p => p.includes(a) && p.includes(b))) return '충';
  return '무';
}
const relScore = r => ({ '육합':2, '반합':1.5, '비화':0.5, '무':0, '충':-2 }[r] ?? 0);

// 3주(년월일) 오행 분포 — 아기는 시주(태어난 시각) 미정이므로 시주 제외
function elem3(y, m, d) {
  const s = E.calcSaju(y, m, d, 12, 0, false, 127);      // 시각은 균형 위해 정오 고정(스코어에는 시주 미반영)
  const gz = [[s.yrTG, s.yrDZ], [s.monthTG, s.monthDZ], [s.dayTG, s.dayDZ]];
  const sc = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  for (const [t, z] of gz) { sc[GAN_WX[t]] += 1; sc[ZHI_WX[z]] += 1; }
  const tot = 6;
  const pct = {}; ELS.forEach(e => pct[e] = +(sc[e] / tot * 100).toFixed(1));
  return { s, pct, dayTG: s.dayTG, dayBranch: DZ[s.dayDZ], dayEl: GAN_WX[s.dayTG] };
}

function balanceScore(pct) {                              // 오행이 고를수록 높음
  const vals = ELS.map(e => pct[e]);
  const mean = vals.reduce((a, b) => a + b, 0) / 5;
  const std = Math.sqrt(vals.reduce((a, v) => a + (v - mean) ** 2, 0) / 5);
  return Math.max(0, 100 - std * 3);
}
function strengthPct(pct, dayEl) {                        // 비겁+인성 = 신강 지표
  return +(pct[dayEl] + pct[gen_of(dayEl)]).toFixed(1);
}
function harmonyPct(strong) {                             // 50(중화)에 가까울수록 높음
  return +(100 - Math.abs(strong - 50) * 2).toFixed(1);
}
function missingCount(pct) { return ELS.filter(e => pct[e] < 5).length; }

// 부모 사주(4주) 계산
function parentChart(y, m, d, hh, mm) {
  const s = E.calcSaju(y, m, d, hh ?? 12, mm ?? 0, false, 127);
  return {
    saju: [[s.yrTG, s.yrDZ], [s.monthTG, s.monthDZ], [s.dayTG, s.dayDZ], [s.hourTG, s.hourDZ]]
      .map(([t, z]) => TG[t] + DZ[z]),
    dayTG: s.dayTG, dayBranch: DZ[s.dayDZ], dayEl: GAN_WX[s.dayTG], _s: s,
  };
}

// 후보일 점수: 균형 + 신강약중화 + 부모궁합 - 결측
function scoreCandidate(c, parents) {
  const bal = balanceScore(c.pct);
  const strong = strengthPct(c.pct, c.dayEl);
  const harmony = harmonyPct(strong);
  const miss = missingCount(c.pct);
  const gung = parents.reduce((a, p) => a + relScore(branchRel(c.dayBranch, p.dayBranch)), 0);
  const score = +(bal * 0.5 + harmony * 0.35 + gung * 4 - miss * 4).toFixed(1);
  return { bal: +bal.toFixed(1), strong, harmony, miss, gung: +gung.toFixed(1), score };
}

// 메인: 출산 가능일 범위에서 top3 선별
function selectBirthDates({ mom, dad, dueFrom, dueTo }) {
  const parents = [];
  if (mom) parents.push(parentChart(mom.y, mom.m, mom.d, mom.hh, mom.mm));
  if (dad) parents.push(parentChart(dad.y, dad.m, dad.d, dad.hh, dad.mm));
  const start = new Date(Date.UTC(dueFrom.y, dueFrom.m - 1, dueFrom.d));
  const end = new Date(Date.UTC(dueTo.y, dueTo.m - 1, dueTo.d));
  const cands = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const dt = new Date(t), y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate();
    const c = elem3(y, m, d);
    const sc = scoreCandidate(c, parents);
    cands.push({ date: `${m}/${String(d).padStart(2,'0')}`, y, m, d,
      dayPillar: TG[c.dayTG] + c.dayBranch, dayEl: c.dayEl, pct: c.pct, ...sc });
  }
  cands.sort((a, b) => b.score - a.score);
  return { parents: parents.map(p => ({ saju: p.saju, dayPillar: TG[p.dayTG] + p.dayBranch, dayEl: p.dayEl })),
    top3: cands.slice(0, 3), all: cands };
}

module.exports = { selectBirthDates, parentChart, elem3, branchRel, scoreCandidate };
