// ═══════════════════════════════════════════════════════════
// saju-score.js — 궁합 점수 결정론적 계산 엔진
//
// GPT는 더 이상 점수를 만들지 않는다. 이 파일이 유일한 점수 출처(single source of truth).
// prompt-engine.js 보다 먼저 로드할 것.
//
// 설계 원칙
//  1) 컴포넌트 테이블에 "중간값"을 두지 않는다. 평균을 두 번 내면 무조건 중앙으로 수렴하므로,
//     각 컴포넌트가 극단값을 가져야 최종 점수가 벌어진다.
//  2) 마지막에 게인(gain)으로 분산을 강제 확장한다. spreadTotals 같은 사후 순위 보정을 대체한다.
//  3) 같은 생년월일이면 언제나 같은 점수가 나온다. (재현 가능 = 신뢰의 근거)
// ═══════════════════════════════════════════════════════════

(function (root) {
  'use strict';

  // ── 오행 인덱스 ────────────────────────────────────────
  // 천간 인덱스(0~9) → 오행
  var TG_E = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  // 천간 인덱스 → 음양 (0=양, 1=음)
  var TG_Y = [0,1,0,1,0,1,0,1,0,1];
  // 지지 인덱스(0~11) → 오행
  var DZ_E = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];

  var SHENG = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' }; // 생
  var KE    = { Wood:'Earth', Earth:'Water', Water:'Fire', Fire:'Metal', Metal:'Wood' }; // 극

  // 두 오행의 관계 반환
  //  'same' | 'i_sheng'(내가 생함) | 'he_sheng'(그가 나를 생함) | 'i_ke'(내가 극함) | 'he_ke'(그가 나를 극함)
  function elemRel(mine, his) {
    if (mine === his) return 'same';
    if (SHENG[mine] === his) return 'i_sheng';
    if (SHENG[his] === mine) return 'he_sheng';
    if (KE[mine] === his)    return 'i_ke';
    if (KE[his] === mine)    return 'he_ke';
    return 'same';
  }

  // ── 지지 관계 (prompt-engine의 getBranchRelation과 동일 로직) ──
  function branchRel(a, b) {
    var LIUHE  = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
    var SANXING= [[2,5,8],[1,4,10],[0,3],[6],[9]];
    var LIUPO  = [[0,9],[1,10],[2,11],[3,6],[4,7],[5,8]];
    var LIUHAI = [[0,7],[1,6],[2,9],[3,8],[4,11],[5,10]];
    function has(list){ for(var i=0;i<list.length;i++){ var p=list[i];
      if((p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a)) return true; } return false; }
    if (a === b) return 'self';
    if (Math.abs(a-b) === 6) return 'chung';
    if (has(LIUHE)) return 'hap';
    for (var i=0;i<SANXING.length;i++){ var g=SANXING[i];
      if (g.indexOf(a)>=0 && g.indexOf(b)>=0) return 'hyeong'; }
    if (has(LIUPO))  return 'pa';
    if (has(LIUHAI)) return 'hae';
    return 'none';
  }

  // ── 12운성 ─────────────────────────────────────────────
  var TWELVE = ['장생','목욕','관대','건록','제왕','쇠','병','사','묘','절','태','양'];
  var TW_START = {0:11,1:6,2:2,3:9,4:2,5:9,6:5,7:0,8:8,9:3};
  var TW_DIR   = {0:1,1:-1,2:1,3:-1,4:1,5:-1,6:1,7:-1,8:1,9:-1};
  function twelveStar(dayTG, dz) {
    var s = TW_START[dayTG], d = TW_DIR[dayTG];
    return TWELVE[(((dz - s) * d % 12) + 12) % 12];
  }
  // 12운성 → 관계 지속력 점수
  var TW_STABLE = {
    '건록':90,'제왕':86,'관대':82,'장생':80,'양':72,'쇠':60,
    '목욕':52,'병':46,'태':42,'사':34,'묘':30,'절':22
  };

  // ── 오행 분포(%) ───────────────────────────────────────
  function elemPct(r, hasHour) {
    var W = {Wood:0,Fire:0,Earth:0,Metal:0,Water:0};
    W[TG_E[r.yrTG]]    += 1.0;
    W[TG_E[r.monthTG]] += 1.5;
    W[TG_E[r.dayTG]]   += 1.0;
    if (hasHour) W[TG_E[r.hourTG]] += 1.0;
    W[DZ_E[r.yrDZ]]    += 1.0;
    W[DZ_E[r.monthDZ]] += 2.0;
    W[DZ_E[r.dayDZ]]   += 1.5;
    if (hasHour) W[DZ_E[r.hourDZ]] += 1.0;
    var t = 0, k;
    for (k in W) t += W[k];
    var out = {};
    for (k in W) out[k] = W[k] / t * 100;
    return out;
  }

  // ── 십성 (내 일간 기준, 상대 일간이 나에게 무엇인가) ──────
  function tenGod(myTG, hisTG) {
    var me = TG_E[myTG], his = TG_E[hisTG];
    var sameYY = TG_Y[myTG] === TG_Y[hisTG];
    var rel = elemRel(me, his);
    if (rel === 'same')     return sameYY ? '비견' : '겁재';
    if (rel === 'i_sheng')  return sameYY ? '식신' : '상관';
    if (rel === 'i_ke')     return sameYY ? '편재' : '정재';
    if (rel === 'he_ke')    return sameYY ? '편관' : '정관';
    /* he_sheng */          return sameYY ? '편인' : '정인';
  }

  // ── 컴포넌트 테이블 ────────────────────────────────────
  // 배우자궁 관계 → 감정 끌림 (충/형이 높다: 상극은 도파민)
  var SP_HEART  = { chung:94, hyeong:88, hap:82, self:74, hae:66, pa:62, none:34 };
  // 배우자궁 관계 → 안정성 (감정과 정반대 방향)
  var SP_STABLE = { hap:92, self:60, none:64, hae:44, pa:40, hyeong:28, chung:22 };
  // 배우자궁 관계 → 성장 자극
  var SP_GROWTH = { chung:84, hyeong:76, hap:74, self:52, hae:62, pa:60, none:46 };
  // 배우자궁 관계 → 타이밍(사건 밀도)
  var SP_TIMING = { hap:84, chung:78, hyeong:70, self:52, hae:58, pa:56, none:44 };

  // 일간 오행관계 → 각 축
  var DM_HEART  = { he_ke:92, i_ke:88, he_sheng:64, i_sheng:56, same:48 };
  var DM_GROWTH = { he_sheng:90, he_ke:84, i_sheng:72, i_ke:66, same:52 };
  var DM_STABLE = { he_sheng:86, i_sheng:78, same:70, i_ke:38, he_ke:32 };
  var DM_PERSP  = { same:90, he_sheng:76, i_sheng:74, i_ke:44, he_ke:40 };
  var DM_TIMING = { he_sheng:78, same:66, i_sheng:70, i_ke:56, he_ke:52 };

  // 대표 십성 → 감정 / 성장
  var TG_HEART  = { 편관:94,정관:84,상관:82,편재:78,정재:70,편인:62,식신:60,정인:54,겁재:52,비견:42 };
  var TG_GROWTH = { 편관:90,편인:84,상관:80,정관:76,정인:74,식신:70,편재:68,정재:60,겁재:56,비견:48 };

  // 지지 성질 → 안정성 (土=고정, 사왕지=도화, 사생지=역마)
  var DZ_STABLE = { 0:62,1:86,2:52,3:62,4:86,5:52,6:62,7:86,8:52,9:62,10:86,11:52 };

  function pick(tbl, key, dflt) {
    return (tbl[key] === undefined) ? (dflt === undefined ? 60 : dflt) : tbl[key];
  }

  // ── 게인: 분산 강제 확장 ────────────────────────────────
  // 컴포넌트 가중평균은 중앙으로 수렴하므로 중심(CENTER) 기준으로 벌린다.
  // 총점 게인 스위치.
  //  true  = 총점을 한 번 더 벌린다. 랭킹 드라마가 커지지만
  //          총점이 서브점수 가중합과 정확히 일치하지는 않는다.
  //  false = 총점 = 서브점수 가중합 (정확히 일치). 대신 순위 차이가 좁아진다.
  var TOTAL_GAIN = true;

  function gain(x, center, k, lo, hi) {
    var v = center + (x - center) * k;
    return Math.max(lo, Math.min(hi, Math.round(v)));
  }

  // ═══════════════════════════════════════════════════════
  // 메인: 한 명의 상대에 대한 점수
  //   me  = { r, dayDZ }  ← buildPersonText의 반환값 사용
  //   him = { r, dayDZ, hasHour }
  // ═══════════════════════════════════════════════════════
  function scorePartner(me, him, annualBranches) {
    var myR = me.r, hisR = him.r;
    var myTG = myR.dayTG, hisTG = hisR.dayTG;
    var spouse = branchRel(myR.dayDZ, hisR.dayDZ);
    var month  = branchRel(myR.monthDZ, hisR.monthDZ);
    var dm     = elemRel(TG_E[myTG], TG_E[hisTG]);
    var yy     = (TG_Y[myTG] !== TG_Y[hisTG]);            // 음양 상보
    var tg     = tenGod(myTG, hisTG);

    var myPct  = elemPct(myR, me.hasHour !== false);
    var hisPct = elemPct(hisR, him.hasHour !== false);

    // 오행 보완도: 내가 부족한 오행(20% 미만)을 상대가 얼마나 채우는가
    var need = 0, cover = 0;
    for (var e in myPct) {
      var d = Math.max(0, 20 - myPct[e]);
      need  += d;
      cover += Math.min(d, hisPct[e]);
    }
    var complement = need > 0 ? 30 + 65 * (cover / need) : 60;

    // 오행 분포 유사도 (총변동거리 기반)
    var tvd = 0;
    for (var e2 in myPct) tvd += Math.abs(myPct[e2] - hisPct[e2]);
    var similarity = Math.max(0, 100 - tvd);              // 0~100

    // 12운성: 두 사람의 일지 12운성 평균
    var twMe  = pick(TW_STABLE, twelveStar(myTG,  myR.dayDZ));
    var twHim = pick(TW_STABLE, twelveStar(hisTG, hisR.dayDZ));
    var tw    = (twMe + twHim) / 2;

    // 연운: 향후 10년 중 두 사람 일지와 합/충이 걸리는 해의 밀도
    var events = 0;
    for (var i = 0; i < annualBranches.length; i++) {
      var b = annualBranches[i];
      var ra = branchRel(b, myR.dayDZ), rb = branchRel(b, hisR.dayDZ);
      [ra, rb].forEach(function (rr) {
        if (rr === 'hap' || rr === 'chung') events += 1;
        else if (rr === 'hyeong' || rr === 'pa' || rr === 'hae') events += 0.5;
      });
    }
    var flow = Math.max(25, Math.min(95, 25 + events * 8));

    // ── 5축 ────────────────────────────────────────────
    var heart =
      pick(SP_HEART, spouse) * 0.35 +
      pick(DM_HEART, dm)     * 0.30 +
      pick({chung:88,hap:80,hyeong:74,self:56,pa:66,hae:66,none:42}, month) * 0.15 +
      pick(TG_HEART, tg)     * 0.15 +
      (yy ? 80 : 46)         * 0.05;

    var growth =
      pick(DM_GROWTH, dm)    * 0.30 +
      pick({chung:88,hyeong:78,hap:70,self:44,pa:72,hae:72,none:56}, month) * 0.30 +
      pick(SP_GROWTH, spouse)* 0.20 +
      pick(TG_GROWTH, tg)    * 0.10 +
      complement             * 0.10;

    var stability =
      ((pick(DZ_STABLE, myR.dayDZ) + pick(DZ_STABLE, hisR.dayDZ)) / 2) * 0.30 +
      pick(SP_STABLE, spouse) * 0.25 +
      tw                      * 0.20 +
      pick(DM_STABLE, dm)     * 0.15 +
      (yy ? 74 : 58)          * 0.10;

    var perspective =
      (month === 'self' ? 94 : (DZ_E[myR.monthDZ] === DZ_E[hisR.monthDZ] ? 84
        : (elemRel(DZ_E[myR.monthDZ], DZ_E[hisR.monthDZ]) === 'i_ke'
          || elemRel(DZ_E[myR.monthDZ], DZ_E[hisR.monthDZ]) === 'he_ke' ? 40 : 68))) * 0.30 +
      pick(DM_PERSP, dm)      * 0.30 +
      (yy ? 58 : 82)          * 0.20 +
      (25 + similarity * 0.7) * 0.20;

    var timing =
      flow                    * 0.40 +
      pick(SP_TIMING, spouse) * 0.30 +
      pick(DM_TIMING, dm)     * 0.20 +
      pick({hap:80,chung:52,hyeong:60,self:58,pa:62,hae:62,none:62}, month) * 0.10;

    // ── 게인 적용 ──────────────────────────────────────
    // 각 축은 원점수 중심이 대략 65 부근이라 65를 기준으로 벌린다.
    var H = gain(heart,       65, 1.30, 24, 97);
    var G = gain(growth,      65, 1.30, 24, 97);
    var S = gain(stability,   63, 1.50, 20, 96);
    var P = gain(perspective, 63, 1.35, 26, 96);
    var T = gain(timing,      61, 1.55, 28, 94);

    // 총점: 5축의 가중합 (프롬프트에 있던 가중치 그대로) → 다시 한 번 게인
    var raw = H * 0.25 + G * 0.20 + S * 0.30 + P * 0.15 + T * 0.10;
    var total = TOTAL_GAIN ? gain(raw, 62, 2.10, 32, 97) : Math.round(raw);

    return {
      heart: H, growth: G, stability: S, perspective: P, timing: T, total: total,
      // 프롬프트에 근거로 같이 넘길 메타 (텍스트-점수 정합성용)
      _meta: {
        spouse: spouse, month: month, dayMaster: dm, tenGod: tg,
        yinyang: yy ? '상보' : '동일',
        twelveMe: twelveStar(myTG, myR.dayDZ),
        twelveHim: twelveStar(hisTG, hisR.dayDZ)
      }
    };
  }

  // ═══════════════════════════════════════════════════════
  // 여러 명 한 번에. 동점 방지(타이브레이크)까지 처리.
  // ═══════════════════════════════════════════════════════
  function scoreAll(me, partners, annualBranches) {
    var out = partners.map(function (p) {
      return scorePartner(me, p, annualBranches);
    });

    // 총점 동점이면 감정 → 안정 → 성장 순으로 1점씩 미세 조정 (순위 확정용)
    var seen = {};
    out.forEach(function (s) {
      while (seen[s.total]) {
        s.total = s.total - 1 <= 22 ? s.total + 1 : s.total - 1;
      }
      seen[s.total] = true;
    });
    return out;
  }

  var API = {
    scorePartner: scorePartner,
    scoreAll: scoreAll,
    branchRel: branchRel,
    twelveStar: twelveStar,
    elemPct: elemPct,
    tenGod: tenGod
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.SajuScore = API;
})(typeof window !== 'undefined' ? window : null);