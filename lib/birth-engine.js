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
// 엔진 월령·통근 기반 지지율(3주, 시주 제외) — 신강약의 실제 근거
function supportRatio3(s) {
  const p3 = [[s.yrTG, s.yrDZ], [s.monthTG, s.monthDZ], [s.dayTG, s.dayDZ]];
  const st = E.calcStrengthScore(p3, s.dayTG);
  return st.total / (st.total + st.drainTotal) * 100;
}
function stabilityOf(ratio) {                             // 중화(50)에 가까울수록 안정
  return +Math.max(0, 100 - Math.abs(ratio - 50) * 2).toFixed(1);
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

// ══════════════ 7단계 택일 심사 엔진 ══════════════
const EN2KO = { Wood:'목', Fire:'화', Earth:'토', Metal:'금', Water:'수' };
const KE = { 목:'토', 토:'수', 수:'화', 화:'금', 금:'목' };
const GAN_YIN = [1,0,1,0,1,0,1,0,1,0];                       // 갑=양 … 계=음
const CG_MAIN = [9,5,0,1,4,2,3,5,6,7,4,8];                   // 지지(자..해) → 정기 천간 index
function tenGodEl(dayTG, otherTG){
  const de=GAN_WX[dayTG], oe=GAN_WX[otherTG], same=GAN_YIN[dayTG]===GAN_YIN[otherTG];
  if(de===oe) return same?'비견':'겁재';
  if(SHENG[de]===oe) return same?'식신':'상관';
  if(KE[de]===oe) return same?'편재':'정재';
  if(KE[oe]===de) return same?'편관':'정관';
  return same?'편인':'정인';
}
// 지지 관계 테이블 (자=0 … 해=11)
const YUKHAP=[[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
const SAMHAP=[[8,0,4],[11,3,7],[2,6,10],[5,9,1]];
const CHUNG_Z=[[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
const HYEONG3=[[2,5,8],[1,10,7]];                            // 인사신 · 축술미
const HYEONG2=[[0,3]];                                       // 자묘 상형
const JAHYEONG=[4,6,9,11];                                   // 진오유해 자형
const PA_Z=[[0,9],[6,3],[8,5],[2,11],[4,1],[10,7]];
const HAE_Z=[[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
const GAN_HAP=[[0,5],[1,6],[2,7],[3,8],[4,9]];               // 갑기 을경 병신 정임 무계
const GAN_CHUNG_=[[0,6],[1,7],[2,8],[3,9]];                  // 갑경 을신 병임 정계

// ④ 합충형파해 — 아기 원국(년월일) 내부 구조 안정성
function analyzeStructure(stems, branches){
  const rel=[]; let score=100; const core=[branches[1],branches[2]];   // 월지·일지 핵심축
  const has=(a,b)=>branches.includes(a)&&branches.includes(b);
  for(const [a,b] of GAN_HAP)   if(stems.includes(a)&&stems.includes(b)){ rel.push('천간합('+TG[a]+TG[b]+')'); score+=4; }
  for(const [a,b] of GAN_CHUNG_)if(stems.includes(a)&&stems.includes(b)){ rel.push('천간충('+TG[a]+TG[b]+')'); score-=8; }
  for(const [a,b] of YUKHAP)    if(has(a,b)){ rel.push('육합('+DZ[a]+DZ[b]+')'); score+=6; }
  for(const tri of SAMHAP){ const n=tri.filter(x=>branches.includes(x)).length;
    if(n===3){ rel.push('삼합'); score+=10; } else if(n===2){ rel.push('반합'); score+=4; } }
  for(const [a,b] of CHUNG_Z)   if(has(a,b)){ const hit=core.includes(a)||core.includes(b); rel.push('충('+DZ[a]+DZ[b]+')'+(hit?'·핵심축':'')); score-=hit?16:8; }
  for(const tri of HYEONG3)      if(tri.every(x=>branches.includes(x))){ rel.push('삼형'); score-=14; }
  for(const [a,b] of HYEONG2)   if(has(a,b)){ rel.push('상형('+DZ[a]+DZ[b]+')'); score-=8; }
  for(const z of JAHYEONG)       if(branches.filter(x=>x===z).length>=2){ rel.push('자형('+DZ[z]+')'); score-=6; }
  for(const [a,b] of PA_Z)      if(has(a,b)){ rel.push('파('+DZ[a]+DZ[b]+')'); score-=4; }
  for(const [a,b] of HAE_Z)     if(has(a,b)){ rel.push('해('+DZ[a]+DZ[b]+')'); score-=4; }
  return { list:rel, score:Math.max(0,Math.min(100,score)) };
}
// 격국 — 월령용사(월지 정기 십성) 기준 1차 격
function gyeokOf(dayTG, monthDZ){
  const ss=tenGodEl(dayTG, CG_MAIN[monthDZ]);
  const map={비견:'건록격',겁재:'양인격',식신:'식신격',상관:'상관격',편재:'편재격',정재:'정재격',편관:'편관격',정관:'정관격',편인:'편인격',정인:'정인격'};
  return { name:map[ss]||ss+'격', star:ss };
}
// ── 부모 사주 분석 (실제 4주 · 시주 앎) → 양육 유형 + 신강약·용신 ──
function ratioLv(r){ return r>=62?'신강':r>=53?'중화신강':r>=47?'중화신약':r>=33?'신약':'태약'; }
const SS_CAT={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
const PARENT_ARCHE={
 비겁:{arche:'친구 같은형',love:'나란히 서서 사랑을 줘요 — 위에서 가르치기보다 함께 부딪히고 배우는 동지 같은 부모예요.',watch:'친구처럼 편한 만큼, 기준이 필요한 순간엔 중심을 잡아주면 좋아요.'},
 식상:{arche:'표현·놀이형',love:'함께 놀고 표현하며 사랑을 줘요 — 눈높이에서 재잘거리고 웃겨주는, 놀이가 곧 사랑인 부모예요.',watch:'신나게 놀아주되, 아이가 스스로 몰입할 조용한 시간도 남겨주면 좋아요.'},
 재성:{arche:'야무진 살림형',love:'말보다 손이 먼저 — 미역국 한 그릇, 미리 챙겨둔 준비물처럼 실질적인 돌봄으로 사랑을 표현해요.',watch:'다 해주려다 지칠 수 있으니, 아이가 스스로 할 틈도 남겨주면 좋아요.'},
 관성:{arche:'원칙·루틴형',love:'일정한 리듬으로 사랑을 줘요 — 목욕·낮잠·식사 시간이 규칙적이라 아이가 안정감 속에서 자라요.',watch:'규칙이 강해질 땐 “왜”를 함께 설명해주면 아이가 훨씬 잘 따라요.'},
 인성:{arche:'헌신·품어주는형',love:'깊이 품어 사랑을 줘요 — 아이 마음을 먼저 읽고 든든하게 감싸주는 헌신형 부모예요.',watch:'다 감싸주기보다 작은 실패를 겪어볼 여지를 주면 아이가 더 단단해져요.'},
};
// 일간(천간) 물상 — index: 갑0..계9
const P_MULSANG=['큰 나무','화초·넝쿨','한낮의 태양','따뜻한 촛불','든든한 큰 산','기름진 밭','단단한 무쇠','빛나는 보석','넘실대는 강물','맑은 시냇물'];
// 일간 오행 기질
const OHAENG_TRAIT={목:'곧게 자라려는 성장 지향이 뚜렷하고 정이 많은 결',화:'밝고 표현이 따뜻하며 감정이 살아 있는 결',토:'듬직하고 포용력이 있어 곁에 있으면 안심되는 결',금:'원칙과 결단이 분명하고 의리가 깊은 결',수:'유연하고 속이 깊어 지혜로 품는 결'};
// 신강약 → 성향 수식
const STR_MOD={신강:'주관이 또렷하고 추진력 있는',중화신강:'중심이 단단하면서 균형 잡힌',중화신약:'섬세하고 아이 마음을 잘 살피는',신약:'다정하고 아이 곁을 세심히 챙기는',태약:'한없이 부드럽고 헌신적인'};
// 일지(앉은 자리) 십성 → 부모별 차별화되는 '뿌리' 뉘앙스 + 소제목
const BR_NUANCE={
 비겁:'앉은 자리에 자기 주관의 뿌리가 받쳐줘, 아이 앞에서 쉽게 흔들리지 않고 소신 있게 중심을 잡아줘요.',
 식상:'앉은 자리에 표현·재능의 뿌리가 있어, 아이와 눈높이로 잘 놀아주고 웃음이 끊이지 않는 집을 만들어요.',
 재성:'앉은 자리에 현실감각의 뿌리가 있어, 아이에게 필요한 걸 미리 야무지게 챙기는 손이 빨라요.',
 관성:'앉은 자리에 책임·질서의 뿌리가 있어, 아이에게 안정된 틀과 규칙 속 편안함을 선물해요.',
 인성:'앉은 자리에 배움·품음의 뿌리가 있어, 아이의 속마음을 먼저 읽고 깊이 감싸 안아요.',
};
const BR_SUB={비겁:'주관 뿌리',식상:'놀이·표현 뿌리',재성:'살림 뿌리',관성:'질서 뿌리',인성:'헌신 뿌리'};
// 사랑 표현·주의점 — 일간 오행별 (같은 십성이어도 부모마다 오행이 달라 문장이 갈림)
const ELEM_LOVE={
 목:'곧게 자란 나무처럼, 아이가 스스로 뻗어 나가도록 방향을 잡아주고 배움과 성장을 함께 응원하는 사랑을 줘요.',
 화:'환한 볕처럼 아이 곁을 밝게 데우며, 감정을 숨김없이 표현하고 함께 웃어주는 따뜻한 사랑을 줘요.',
 토:'든든한 땅처럼 아이가 어떤 모습이든 넉넉히 품어주는, 변함없는 안정감으로 사랑을 줘요.',
 금:'잘 벼린 칼처럼 옳고 그름을 분명히 짚어주면서도, 약속을 지키는 믿음으로 사랑을 줘요.',
 수:'흐르는 물처럼 아이 마음을 유연하게 읽고 맞춰주며, 잔잔히 스며드는 사랑을 줘요.',
};
const WATCH_BY_EL={
 목:'곧게 이끌려는 마음이 앞설 땐, 아이의 속도를 한 박자 기다려주면 더 잘 자라요.',
 화:'감정이 빠르게 타오를 수 있으니, 욱하기 전에 한 템포 쉬어가면 관계가 더 편안해져요.',
 토:'다 받아주려다 지칠 수 있으니, 부모 자신을 돌보는 시간도 꼭 챙겨주세요.',
 금:'원칙이 강해질 땐 “왜”를 함께 설명해주면 아이가 훨씬 잘 따라요.',
 수:'아이 기분에 너무 같이 흔들리기보다, 담담한 중심을 지켜주면 아이가 안정돼요.',
};
// 사랑 표현 = 오행 리드(오행별) + 양육유형(top 십성별) 조합 → 일간이 같아도 top이 다르면 갈림
const ELEM_LEAD={목:'곧게 자란 나무처럼 방향을 잡아주며',화:'환한 볕처럼 곁을 밝게 데우며',토:'든든한 땅처럼 곁을 받쳐주며',금:'잘 벼린 칼처럼 옳고 그름을 분명히 하며',수:'흐르는 물처럼 유연하게 맞춰주며'};
const SS_STYLE={
 비겁:'아이와 나란히 서서 함께 부딪히고 배우는 동지 같은 사랑을 줘요.',
 식상:'함께 놀고 표현하며 눈높이에서 웃겨주는, 놀이가 곧 사랑인 사랑을 줘요.',
 재성:'필요한 걸 미리 야무지게 챙기는, 손이 먼저 나가는 실질적인 사랑을 줘요.',
 관성:'규칙적인 리듬과 안정된 틀 속에서 아이가 자라도록 돕는 사랑을 줘요.',
 인성:'아이 마음을 먼저 읽고 깊이 품어 안는, 헌신적인 사랑을 줘요.',
};
function analyzeParent(pc){
  const s=pc._s, dayTG=s.dayTG;
  const st=E.calcStrengthScore(s.pillars, dayTG);          // 부모는 실제 시주 있음 → 4주
  const pr=st.total/(st.total+st.drainTotal)*100;
  const yo=E.calcYongshin({ ...s, isStrong: pr>=50 });
  const yong=EN2KO[yo.yongshin]||yo.yongshin, hee=EN2KO[yo.kibun]||yo.kibun;
  const stems=[s.yrTG,s.monthTG,s.hourTG], branches=[s.yrDZ,s.monthDZ,s.dayDZ,s.hourDZ];
  const dist={비겁:0,식상:0,재성:0,관성:0,인성:0};
  for(const t of stems) if(t!==undefined) dist[SS_CAT[tenGodEl(dayTG,t)]]++;
  for(const z of branches) dist[SS_CAT[tenGodEl(dayTG,CG_MAIN[z])]]++;
  const top=Object.entries(dist).sort((a,b)=>b[1]-a[1])[0][0];
  const level=ratioLv(pr);
  // 일지 십성(앉은 자리) — 같은 top이어도 엄마/아빠를 갈라주는 핵심 차별점
  const dzIdx=DZ.indexOf(pc.dayBranch);
  const brSS=dzIdx>=0 ? SS_CAT[tenGodEl(dayTG, CG_MAIN[dzIdx])] : top;
  const A=PARENT_ARCHE[top];
  const mulsang=P_MULSANG[dayTG]||'';
  const trait=`${mulsang} 같은 ${TG[dayTG]}(${pc.dayEl}${HZ_[pc.dayEl]}) 일간이에요. ${STR_MOD[level]||''} 부모로, ${OHAENG_TRAIT[pc.dayEl]||''}이 돋보여요.`;
  // love: 오행 리드 + 양육유형(top) + (일지뿌리가 top과 다를 때만 덧붙임 — 중복 방지)
  const brTail = (brSS && brSS !== top) ? ' ' + (BR_NUANCE[brSS] || '') : '';
  const love = `${ELEM_LEAD[pc.dayEl] || ''}, ${SS_STYLE[top] || A.love}${brTail}`.trim();
  const arche = `${A.arche} · ${BR_SUB[brSS] || ''}`;
  const watch = A.watch;   // 양육유형(top 십성) 기반 → 부모 top이 다르면 watch도 달라짐
  return { dayPillar:TG[dayTG]+pc.dayBranch, dayEl:pc.dayEl, level, yong, hee, sipseongTop:top, branchSipseong:brSS, dist, arche, trait, love, watch };
}
// ── 아기 → 부모 인연 (아기가 부모에게 채워주는 기운) ──
// 아기 오행별 '주는 방식' 이미지 (날짜마다 일간이 달라 문장이 달라짐)
const GIVE_FLAVOR={목:'새싹처럼 곁을 파릇하게 틔워',화:'등불처럼 곁을 환하게 데워',토:'단단한 땅처럼 곁을 든든히 받쳐',금:'맑은 쇳소리처럼 마음을 또렷하게 다듬어',수:'물길처럼 마음을 촉촉이 적셔'};
function babyToParent(baby, parentAn){
  const gen={목:'화',화:'토',토:'금',금:'수',수:'목'};        // A생B
  const babyDayEl=(baby&&baby.dayEl)||'', babyPct=(baby&&baby.pct)||{};
  const ms=(baby&&baby.mulsang)||'', dm=(baby&&baby.dayMaster)||'';
  const hz=HZ_[babyDayEl]||'', flavor=GIVE_FLAVOR[babyDayEl]||'곁을 채워';
  const meTag = ms ? `${ms} 같은 <b>${dm}(${babyDayEl}${hz})</b>` : `<b>${babyDayEl}(${hz})</b>`;
  const py=parentAn.yong;
  const hasYong = babyDayEl===py || (babyPct[py]||0) >= 20;
  const genEl = Object.keys(gen).find(k=>gen[k]===parentAn.dayEl);  // 부모를 생하는 오행(부모의 인성)
  const babyFeedsParent = babyDayEl===genEl || (babyPct[genEl]||0)>=20;
  let kind, text;
  if(hasYong){ kind='용신보충';
    text=`저는 ${meTag} 아이예요. 제 ${babyDayEl}(${hz}) 기운이 마침 {부모}에게 꼭 필요한 용신이라, ${flavor}주며 {부모}의 부족한 자리를 채우는, 서로에게 힘이 되는 인연이에요.`; }
  else if(babyFeedsParent){ kind='생조';
    text=`${meTag}인 제가 {부모}를 ${flavor}주는 결이에요(${babyDayEl}생${parentAn.dayEl}). {부모}를 키우는 건 아니지만, 지친 자리를 은근히 북돋아 드리는 든든한 존재가 될 거예요.`; }
  else { kind='비화조화';
    text=`${meTag}인 저와 {부모}는 결이 닮았어요. 비슷한 기운끼리 ${flavor}주듯 자연스럽게 스며들어, 애쓰지 않아도 마음이 편안하고 말 안 해도 통하는 사이가 돼요.`; }
  return { kind, text };
}
const HZ_={목:'木',화:'火',토:'土',금:'金',수:'水'};

// ⑤ 십신 분포 → 성장 잠재력(다양성·편중)
function sinsinDist(dayTG, stems, branches){
  const list=[];
  for(const t of stems) if(t!==dayTG) list.push(tenGodEl(dayTG,t));
  for(const z of branches) list.push(tenGodEl(dayTG, CG_MAIN[z]));
  const dist={}; list.forEach(x=>dist[x]=(dist[x]||0)+1);
  const distinct=Object.keys(dist).length, maxc=Math.max(...Object.values(dist));
  let score=Math.min(100, distinct/6*100); if(maxc>=4) score-=15; else if(maxc>=3) score-=5;
  return { dist, score:Math.max(0,Math.round(score)) };
}
// ⑦ 미래 흐름 — 향후 10년 용신 흐름
function futureFlow(birthY, yong, hee, gi){
  let sum=0;
  for(let yy=birthY+1; yy<=birthY+10; yy++){
    const g=(yy-4)%10, z=(yy-4)%12; let sc=0;
    for(const [w,wt] of [[GAN_WX[g],1],[ZHI_WX[z],0.6]]){ if(w===yong)sc+=2*wt; else if(w===hee)sc+=1*wt; else if(w===gi)sc-=2*wt; }
    sum+=sc;
  }
  return Math.max(0,Math.min(100,Math.round(50+sum/10*16)));
}
// ① 계절 적합성 — 월령 관계 + 조후(need/avoid)
function seasonalFit(dayEl, monthDZ, pct, need, avoid){
  const mEl=ZHI_WX[monthDZ];
  let base = mEl===dayEl?88 : SHENG[mEl]===dayEl?85 : SHENG[dayEl]===mEl?55 : KE[dayEl]===mEl?52 : 42;
  const haveNeed = need.length? need.filter(e=>pct[e]>0).length/need.length : 1;
  base = base*0.6 + haveNeed*100*0.4;
  if(avoid.length && pct[avoid[0]]>=33) base-=10;
  return Math.max(0,Math.min(100,Math.round(base)));
}
// 종합 심사: 7단계 점수 + 가중 종합 + 격국 + 합충
const STAGE_META=[
  { key:'seasonal', label:'계절 적합성',  short:'계절',   w:0.20, inner:'월령·조후' },
  { key:'core',     label:'중심기운 안정', short:'중심기운', w:0.20, inner:'왕쇠·신강약·통근' },
  { key:'balance',  label:'균형·용신',    short:'균형',   w:0.15, inner:'용신·오행 편중' },
  { key:'structure',label:'구조 안정',    short:'구조',   w:0.15, inner:'합충형파해·지장간' },
  { key:'growth',   label:'성장 잠재력',  short:'성장',   w:0.10, inner:'십신 분포·격국' },
  { key:'parent',   label:'부모 조화',    short:'부모',   w:0.10, inner:'부모 사주 보완' },
  { key:'future',   label:'미래 흐름',    short:'미래',   w:0.10, inner:'향후 10년 연운' },
];
function evaluateChart(s, parents, birthY){
  const dayTG=s.dayTG, dayEl=GAN_WX[dayTG];
  const stems=[s.yrTG,s.monthTG,s.dayTG], branches=[s.yrDZ,s.monthDZ,s.dayDZ];
  const scnt={목:0,화:0,토:0,금:0,수:0};
  [[s.yrTG,s.yrDZ],[s.monthTG,s.monthDZ],[s.dayTG,s.dayDZ]].forEach(([t,z])=>{scnt[GAN_WX[t]]++;scnt[ZHI_WX[z]]++;});
  const pct={}; ELS.forEach(e=>pct[e]=+(scnt[e]/6*100).toFixed(1));
  const ratio=supportRatio3(s), stability=stabilityOf(ratio);
  const yo=E.calcYongshin({ ...s, isStrong: ratio>=50 });
  const yong=EN2KO[yo.yongshin]||yo.yongshin, gi=EN2KO[yo.gishin]||yo.gishin;
  const need=(s.johu?.need||[]).map(e=>EN2KO[e]||e), avoid=(s.johu?.avoid||[]).map(e=>EN2KO[e]||e);
  let hee=EN2KO[yo.kibun]||yo.kibun; if(hee===gi) hee=need.find(e=>e!==yong&&e!==gi)||yong;
  const bal=balanceScore(pct), struct=analyzeStructure(stems,branches), grow=sinsinDist(dayTG,stems,branches);
  const gung=(parents||[]).reduce((a,p)=>a+relScore(branchRel(DZ[s.dayDZ], p.dayBranch)),0);
  // 부모 조화 = 지지 관계(궁합) + 용신 보완(부모 일주 천간·지지가 아기 용신·희신을 채우나)
  const yongSupport=(parents||[]).reduce((a,p)=>{
    const els=[p.dayEl, ZHI_WX[DZ.indexOf(p.dayBranch)]];
    return a + els.reduce((b,e)=>b+(e===yong?1:e===hee?0.5:0),0);
  },0);
  const sc={
    seasonal:  seasonalFit(dayEl,s.monthDZ,pct,need,avoid),
    core:      Math.round(stability),
    balance:   Math.round(bal*0.6 + (pct[yong]>0?100:55)*0.4),
    structure: Math.round(struct.score),
    growth:    grow.score,
    parent:    Math.round(Math.max(0,Math.min(100, 35 + gung*8 + yongSupport*18))),
    future:    futureFlow(birthY,yong,hee,gi),
  };
  const composite=+STAGE_META.reduce((a,m)=>a+sc[m.key]*m.w,0).toFixed(1);
  const ranked=STAGE_META.map(m=>({key:m.key,label:m.label,inner:m.inner,val:sc[m.key]})).sort((a,b)=>b.val-a.val);
  return { pct, ratio:+ratio.toFixed(1), stability, yong, hee, gi,
    stages:sc, stageMeta:STAGE_META, composite, gyeok:gyeokOf(dayTG,s.monthDZ), hapchung:struct.list,
    strong:ranked[0], weak:ranked[ranked.length-1] };
}

// 후보일 종합: 7단계 심사 종합점수
function scoreCandidate(c, parents, y) {
  const ev = evaluateChart(c.s, parents, y);
  return { score: ev.composite, strengthPct: ev.ratio, stability: ev.stability,
    balScore: ev.stages.balance, stabScore: ev.stages.core, gungScore: ev.stages.parent,
    eval: ev };
}

// 시주 곡선: 한 날짜의 12시진별 점수 (시주 포함 4주 → 신강약 중화 + 오행 균형)
const SIJI=['자시','축시','인시','묘시','진시','사시','오시','미시','신시','유시','술시','해시'];
const SIJI_HH=['23~01','01~03','03~05','05~07','07~09','09~11','11~13','13~15','15~17','17~19','19~21','21~23'];
function hourCurve(y, m, d){
  const out=[];
  for(let i=0;i<12;i++){
    const s=E.calcSaju(y,m,d, i*2, 0, false, 127);              // 자시=0,축시=2,…해시=22
    const st=E.calcStrengthScore(s.pillars, s.dayTG);
    const ratio=st.total/(st.total+st.drainTotal)*100;
    const stability=Math.max(0,100-Math.abs(ratio-50)*2);
    const scnt={목:0,화:0,토:0,금:0,수:0};
    s.pillars.forEach(([t,z])=>{scnt[GAN_WX[t]]++;scnt[ZHI_WX[z]]++;});
    const vals=ELS.map(e=>scnt[e]), mean=vals.reduce((a,b)=>a+b,0)/5;
    const sd=Math.sqrt(vals.reduce((a,v)=>a+(v-mean)**2,0)/5);
    const bal=Math.max(0,100-sd*22);
    out.push({ siji:SIJI[i], span:SIJI_HH[i], score:Math.round(stability*0.6+bal*0.4) });
  }
  const best=out.reduce((a,b)=>b.score>a.score?b:a);
  return { curve:out, best };
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
    const sc = scoreCandidate(c, parents, y);
    cands.push({ date: `${m}/${String(d).padStart(2,'0')}`, y, m, d,
      dayPillar: TG[c.dayTG] + c.dayBranch, dayEl: c.dayEl, pct: c.pct, ...sc });
  }
  cands.sort((a, b) => b.score - a.score);
  const parentAn = parents.map((p,i)=>({ who:i===0?'엄마':'아빠', ...analyzeParent(p) }));
  const top3 = cands.slice(0, 3).map(c=>({ ...c, hourCurve:hourCurve(c.y,c.m,c.d) }));
  return { parents: parents.map(p => ({ saju: p.saju, dayPillar: TG[p.dayTG] + p.dayBranch, dayEl: p.dayEl })),
    parentAn, top3, all: cands };
}

module.exports = { selectBirthDates, parentChart, elem3, branchRel, scoreCandidate, evaluateChart, analyzeParent, babyToParent };
