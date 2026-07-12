// lib/day-pillar.js
// 일주(日柱) + 배우자궁(일지) 관계 계산.
// 순수 날짜 연산이라 GPT/서버 왕복 없이 결정적으로 나옴.
// 계산식은 실제 rate_analyses 37건과 교차검증 완료 (불일치 0).

const TG = '갑을병정무기경신임계';
const DZ = '자축인묘진사오미신유술해';

function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
    + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/** 일주 반환: { stem:'병', branch:'술', pillar:'병술' } */
export function dayPillar(y, m, d) {
  const j = jdn(+y, +m, +d);
  const stem = TG[((j + 9) % 10 + 10) % 10];
  const branch = DZ[((j + 1) % 12 + 12) % 12];
  return { stem, branch, pillar: stem + branch };
}

const LIUHE = [['자','축'],['인','해'],['묘','술'],['진','유'],['사','신'],['오','미']];
const CHONG = [['자','오'],['축','미'],['인','신'],['묘','유'],['진','술'],['사','해']];
const SAMHAP = [['신','자','진'],['해','묘','미'],['인','오','술'],['사','유','축']];

/** 두 일지(배우자궁)의 관계: 육합/삼합/충/비화/무 */
export function branchRelation(a, b) {
  if (!a || !b) return '무';
  if (a === b) return '비화';
  for (const p of LIUHE) if ((p[0] === a && p[1] === b) || (p[0] === b && p[1] === a)) return '육합';
  for (const p of CHONG) if ((p[0] === a && p[1] === b) || (p[0] === b && p[1] === a)) return '충';
  for (const g of SAMHAP) if (g.includes(a) && g.includes(b)) return '삼합';
  return '무';
}

/** 관계가 긍정(강조 표시)인지 */
export function isPositiveRelation(rel) {
  return rel === '육합' || rel === '삼합';
}

export default { dayPillar, branchRelation, isPositiveRelation };
