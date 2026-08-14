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
// ── 섹션1: 십성(가장 발달한 기운) 중심 양육 프로필 ──
// 규칙: 일간 물상을 본문 첫문장으로 쓰지 않음. 40% 발달십성→양육행동, 20% 신강약→과잉형태,
//       20% 일지십성→정서반응, 일간은 헤더 칩에만. 동일 일간 부모라도 결과가 충분히 달라짐.
const SS_PROFILE={
 비겁:{head:'나란히 함께 크는 동지형 부모', lang:'같이 해보기 · 곁에서 함께하기 · 대등하게 존중하기',
   body:'가르치려 앞서기보다 아이와 나란히 서서 함께 부딪히고 배우는 부모예요. 눈높이를 맞춰 친구처럼 어울리며, 아이를 하나의 대등한 사람으로 존중하는 데서 사랑을 보여줘요.',
   over:'친구처럼 편해, 기준과 훈육이 필요한 순간에도 선을 긋기 어려울 때', mission:'가끔은 한발 앞서 중심을 잡아주는 어른의 자리도 지켜주세요.'},
 식상:{head:'같이 놀며 표현을 이끄는 놀이형 부모', lang:'함께 놀기 · 표현 이끌기 · 웃게 해주기',
   body:'재잘거리고 웃기고 함께 노는 것으로 사랑을 보여주는 부모예요. 아이의 표현과 놀이를 즐겁게 받아주고 감정을 밖으로 꺼내도록 이끌어, 집안에 웃음이 끊이지 않아요.',
   over:'신나게 놀아주다, 아이가 혼자 몰입할 조용한 시간을 놓칠 때', mission:'실컷 놀아준 뒤엔 아이가 스스로 집중할 고요한 틈도 남겨주세요.'},
 재성:{head:'필요한 걸 먼저 챙기는 실전형 부모', lang:'챙겨주기 · 해결해주기 · 좋은 환경 만들어주기',
   body:'말로 오래 달래기보다, 아이에게 지금 뭐가 필요한지 먼저 살피고 바로 움직이는 부모예요. 준비물·식사·일정처럼 현실적인 부분을 놓치지 않고 챙기며, ‘잘 키워내고 싶다’는 마음이 곧장 행동으로 옮겨지는 실전형이에요.',
   over:'아이 몫까지 대신 해결해버릴 때', mission:'완성된 답을 주기보다 ‘어디까지 네가 해볼래?’ 하고 늘 한 칸을 남겨주세요.'},
 관성:{head:'리듬과 기준을 잡아주는 원칙형 부모', lang:'규칙 잡아주기 · 약속 지키기 · 든든한 울타리 되기',
   body:'일정한 리듬과 분명한 기준으로 사랑을 보여주는 부모예요. 목욕·낮잠·식사 시간이 규칙적이라 아이가 안정감 속에서 자라고, 지켜야 할 선을 분명히 세워 믿음직한 울타리가 돼요.',
   over:'규칙이 앞서, 아이의 사정을 듣기 전에 선부터 그을 때', mission:'규칙엔 늘 ‘왜’를 함께 설명해, 아이가 납득하고 따르게 해주세요.'},
 인성:{head:'마음을 읽고 기다려주는 정서적 안전기지', lang:'들어주기 · 설명해주기 · 정서적으로 품어주기',
   body:'뭔가를 대신 해결해주기보다, 아이가 왜 그러는지 먼저 이해하려는 부모예요. 관찰하고 충분히 들어준 뒤 아이가 스스로 답을 찾을 때까지 기다려주고, 배움·이해·보호의 방식으로 아이를 깊이 품어요.',
   over:'이해하고 품어주는 시간이 길어져, 아이가 스스로 부딪히고 넘어져 볼 기회까지 미뤄질 때', mission:'공감한 다음엔 한 발 물러서서 아이가 직접 부딪혀 해결하게 해주세요.'},
};
// 헤드라인 25종 = 발달십성(양육 행동) × 일지십성(정서 결) — 같은 top이어도 앉은 자리로 갈림
const HEAD_COMBO={
 비겁:{비겁:'끝까지 나란히 함께 가는 동지형 부모', 식상:'친구처럼 어울리며 함께 웃는 부모',
       재성:'나란히 서되 필요한 건 야무지게 챙기는 부모', 관성:'친구 같으면서도 중심은 분명한 부모',
       인성:'동지처럼 곁에 서서 깊이 품어주는 부모'},
 식상:{비겁:'같이 놀며 대등하게 어울리는 부모', 식상:'웃음이 끊이지 않는 놀이 짝꿍 부모',
       재성:'신나게 놀아주면서 실속도 챙기는 부모', 관성:'즐겁게 놀되 약속은 지키게 하는 부모',
       인성:'함께 놀며 마음까지 읽어주는 부모'},
 재성:{비겁:'필요한 걸 챙기며 나란히 함께 뛰는 부모', 식상:'야무지게 챙기면서 신나게 놀아주는 부모',
       재성:'필요한 걸 먼저 알아채는 살림 실전형 부모', 관성:'챙길 건 챙기고 지킬 선은 지키는 부모',
       인성:'현실을 챙기면서 마음까지 살피는 부모'},
 관성:{비겁:'기준을 세우되 눈높이를 맞추는 부모', 식상:'규칙 안에서 마음껏 놀게 해주는 부모',
       재성:'울타리를 세우고 살뜰히 챙기는 부모', 관성:'한결같은 리듬으로 지켜주는 원칙형 부모',
       인성:'기준은 분명하되 속마음을 품어주는 부모'},
 인성:{비겁:'마음을 읽어주며 나란히 걷는 부모', 식상:'품어주면서 표현을 이끌어내는 부모',
       재성:'마음을 품으며 필요한 걸 챙겨주는 부모', 관성:'깊이 이해하되 지킬 선은 분명한 부모',
       인성:'끝까지 기다려주는 정서적 안전기지'},
};
// 사랑의 언어 3번째 항목 — 일지 십성에서 옴 (앞 2개는 발달십성) → 25조합이 모두 달라짐
const LANG_BR={비겁:'눈높이 맞추기',식상:'함께 웃어주기',재성:'좋은 환경 만들어주기',관성:'든든한 울타리 되어주기',인성:'마음 먼저 헤아리기'};
// 본문 2번째 문장 25종 = 발달십성(행동) × 일지십성(가정 안 분위기·정서)
// ※ 1번째 문장은 발달십성의 정체성이라 같은 유형이면 같은 게 맞고, 2번째로 부모를 가름
const COMBO_BODY={
 비겁:{비겁:'집에서도 위아래 없이 티격태격하다 금세 풀어지는, 친구 같은 공기가 흘러요.',
       식상:'함께 몸으로 놀고 장난치며, 웃음으로 아이 마음을 여는 편이에요.',
       재성:'나란히 서면서도 아이에게 필요한 건 놓치지 않고 손이 먼저 나가요.',
       관성:'친구처럼 지내다가도 지켜야 할 선 앞에서는 분명하게 중심을 잡아줘요.',
       인성:'함께 부딪히면서도 아이 속마음을 먼저 읽고 조용히 품어줘요.'},
 식상:{비겁:'아이와 대등하게 어울리며, 눈치 볼 것 없이 마음껏 떠들 수 있는 집을 만들어요.',
       식상:'하루 종일 웃음소리가 끊이지 않고, 아이의 표현이 거침없이 터져 나와요.',
       재성:'신나게 놀아주면서도 준비물과 일정은 야무지게 챙겨두는 편이에요.',
       관성:'실컷 놀게 해주되, 약속한 시간과 규칙만큼은 분명히 지키게 해요.',
       인성:'함께 웃고 놀면서도 아이 표정 뒤의 마음을 먼저 살펴요.'},
 재성:{비겁:'챙겨주면서도 아이를 아랫사람이 아니라 한 사람으로 대해요.',
       식상:'필요한 걸 척척 챙기면서 함께 웃고 놀아주는 것도 놓치지 않아요.',
       재성:'말하기도 전에 필요한 게 눈에 들어와, 챙기는 손이 남보다 훨씬 빨라요.',
       관성:'챙길 건 챙기되, 아이가 지켜야 할 선도 분명히 그어줘요.',
       인성:'몸으로 챙기면서도 아이 마음이 어떤지 먼저 물어봐 줘요.'},
 관성:{비겁:'기준을 세우되 아이 눈높이에서 함께 이야기하며 정하는 편이에요.',
       식상:'규칙 안에서는 마음껏 놀게 해줘서, 집안 분위기가 밝고 자유로워요.',
       재성:'규칙과 함께 아이에게 필요한 현실적인 것들도 빠짐없이 챙겨줘요.',
       관성:'한번 세운 기준이 흔들리지 않아, 아이가 예측 가능한 안정 속에서 자라요.',
       인성:'선은 분명히 긋되, 왜 그런지 충분히 설명하고 마음을 달래줘요.'},
 인성:{비겁:'깊이 이해해주면서도 아이를 대등한 사람으로 존중하며 곁을 지켜요.',
       식상:'마음을 읽어주는 동시에 표현을 이끌어내, 아이가 속을 편하게 꺼내놔요.',
       재성:'마음을 살피면서 아이에게 필요한 것도 조용히 챙겨두는 편이에요.',
       관성:'충분히 들어준 뒤에도 지켜야 할 선만큼은 분명하게 알려줘요.',
       인성:'품는 마음이 유난히 깊어, 아이에게 집이 늘 안심되는 자리가 돼요.'},
};
// [축3] 부(2위) 십성 → 본문 3번째 문장. 주된 결 뒤에 은근히 받쳐주는 두 번째 색깔
const SUB_TONE={
 비겁:'여기에 아이를 한 사람으로 존중하는 태도가 은근히 배어 있어, 지시보다 의논이 먼저 나와요.',
 식상:'여기에 잘 웃기고 잘 놀아주는 결이 받쳐줘, 무거운 순간도 가볍게 풀어내는 재주가 있어요.',
 재성:'여기에 현실을 야무지게 챙기는 감각이 받쳐줘, 말뿐 아니라 실제로 손이 나가는 부모예요.',
 관성:'여기에 지킬 선을 아는 단단함이 받쳐줘, 다정하면서도 무르지 않은 균형을 지켜요.',
 인성:'여기에 아이 마음을 먼저 헤아리는 따뜻함이 받쳐줘, 다그치기 전에 한 번 더 들어줘요.',
};
// [과해져요·미션] 25조합 = 발달십성 × 일지십성. [과해지는 지점, 부모 미션]
// ※ top만으로 쓰면 '중심은 분명한 부모'인데 '선을 긋기 어려울 때'처럼 헤드라인과 모순되는 사고가 남
const COMBO_OVER={
 비겁:{
  비겁:['친구처럼 지내다, 기준이 필요한 순간에도 선을 긋기 어려울 때','가끔은 한발 앞서 중심을 잡아주는 어른의 자리도 지켜주세요.'],
  식상:['재미와 분위기에 휩쓸려, 짚어야 할 순간을 웃음으로 넘겨버릴 때','즐겁게 지내되, 중요한 이야기만큼은 웃음기를 걷고 한 번은 진지하게 해주세요.'],
  재성:['같이 하자고 해놓고 결국 손이 먼저 나가, 아이 몫까지 해치워버릴 때','같이 하기로 했으면 느려도 아이 몫은 끝까지 남겨두세요.'],
  관성:['평소엔 대등하다가 원칙이 발동하면 갑자기 단호해져, 아이가 기준을 종잡기 어려울 때','평소의 편안함과 훈육의 온도차를 줄여, 언제 선이 그어지는지 예측 가능하게 해주세요.'],
  인성:['친구처럼 지내면서도 속으로 다 품어주다, 아이가 감당할 몫까지 대신 짊어질 때','공감은 충분히 하되, 결과는 아이가 안아보게 두세요.'],
 },
 식상:{
  비겁:['신나게 어울리다 부모와 아이의 자리가 흐려져, 지켜야 할 선까지 놀이가 될 때','실컷 놀되, 안 되는 것 하나만큼은 분명히 지켜주세요.'],
  식상:['웃음과 자극이 계속 이어져, 아이가 혼자 조용히 몰입할 틈을 놓칠 때','실컷 놀아준 뒤엔 아무것도 하지 않는 고요한 시간도 남겨주세요.'],
  재성:['놀아주면서 준비까지 다 해줘, 아이가 스스로 챙길 기회를 잃을 때','놀이 준비물 정도는 아이가 직접 챙기게 맡겨보세요.'],
  관성:['즐겁게 놀다가 시간·규칙 앞에서 갑자기 태도가 바뀌어, 아이가 당황할 때','놀이를 끝낼 시간을 미리 예고해, 전환이 갑작스럽지 않게 해주세요.'],
  인성:['아이 기분을 살피느라 계속 맞춰주다, 정작 부모가 먼저 지칠 때','다 맞춰주지 않아도 괜찮아요. 부모도 쉬고 싶다고 말해주세요.'],
 },
 재성:{
  비겁:['함께 하자고 해놓고 결국 부모가 다 해버릴 때','속도가 답답해도 아이 손으로 끝맺게 두세요.'],
  식상:['챙기고 놀아주느라 쉴 틈 없이 움직이다, 부모가 먼저 소진될 때','다 챙기지 않아도 괜찮아요. 하루 한 가지는 비워두세요.'],
  재성:['아이가 말하기도 전에 다 해결해, 스스로 필요를 표현할 기회조차 없을 때','먼저 해주기 전에 무엇이 필요한지 아이 입으로 말할 때까지 기다려주세요.'],
  관성:['챙김과 규칙이 겹쳐, 아이 하루가 부모 계획대로만 흘러갈 때','하루에 한 칸은 아이가 스스로 정하는 시간으로 비워두세요.'],
  인성:['필요한 것도 마음도 다 살피다, 아이가 혼자 해볼 여지가 사라질 때','도와주기 전에 “도와줄까?” 하고 한 번 물어봐 주세요.'],
 },
 관성:{
  비겁:['기준을 함께 정하자면서도 결국 부모 쪽으로 결론이 기울 때','정한 규칙 중 하나는 아이 의견 그대로 남겨두세요.'],
  식상:['규칙 안에서 놀게 해주다, 선을 넘는 순간 분위기가 급격히 굳어질 때','제지할 때도 놀아줄 때의 온도를 너무 확 바꾸지 마세요.'],
  재성:['규칙도 준비도 모두 부모가 관리해, 아이는 따라오기만 할 때','규칙 하나쯤은 아이가 직접 만들고 지키게 해보세요.'],
  관성:['세운 기준이 너무 확고해, 아이의 사정을 듣기 전에 선부터 그을 때','규칙엔 늘 “왜”를 함께 설명해, 아이가 납득하고 따르게 해주세요.'],
  인성:['마음은 다 이해하면서도 결론은 늘 원칙대로라, 아이가 말해도 소용없다고 느낄 때','들어준 만큼 가끔은 예외도 만들어주세요.'],
 },
 인성:{
  비겁:['이해하며 나란히 있어주다, 방향이 필요한 순간에도 결정을 미룰 때','충분히 들었다면 한 번은 부모가 먼저 방향을 정해주세요.'],
  식상:['마음을 읽고 표현까지 이끌어주다, 아이가 스스로 정리할 시간을 뺏을 때','말로 다 꺼내게 하기보다 혼자 생각할 여백도 남겨주세요.'],
  재성:['마음도 살피고 필요한 것도 챙기다, 아이가 아쉬움을 느낄 새조차 없을 때','가끔은 조금 부족한 채로 두어, 스스로 방법을 찾게 해보세요.'],
  관성:['충분히 들어준 뒤에도 결국 정해진 답으로 데려갈 때','아이가 낸 답이 서툴러도 한 번은 그대로 해보게 해주세요.'],
  인성:['이해하고 품어주는 시간이 길어져, 아이가 스스로 부딪히고 넘어져 볼 기회까지 미뤄질 때','공감한 다음엔 한 발 물러서서 아이가 직접 부딪혀 해결하게 해주세요.'],
 },
};
// 충전 문구 뒷부분 — 신강약(에너지 총량)에 따라 쉬는 방식이 달라짐 → 용신×신강약 25조합
const RECHARGE_LV={
 신강:'에너지가 넘치는 편이라, 그 힘을 쏟을 곳이 없으면 오히려 답답해져요.',
 중화신강:'무리하지 않는 선에서 자기 시간을 확보하면 오래 버틸 수 있어요.',
 중화신약:'균형이 잘 잡힌 편이라, 지금의 리듬만 지켜도 충분해요.',
 신약:'체력보다 마음이 먼저 지치니, 길게 몰아 쉬기보다 짧게 자주 쉬는 편이 맞아요.',
 태약:'아이보다 부모가 먼저 방전되기 쉬우니, 주변에 도움을 청하는 걸 미루지 마세요.',
};
// [축4] 부모의 용신 오행 → '부모님도 이럴 때 충전돼요' (부모 자신을 위한 한 줄 · 새 정보)
const RECHARGE={
 목:'새로운 걸 배우거나 계획을 세울 때 마음이 트이는 분이에요. 육아에도 작은 성장 목표가 하나 있으면 훨씬 힘이 나요.',
 화:'사람들과 어울려 웃고 표현할 때 기운이 돌아와요. 혼자 삭이기보다 말로 풀어내는 통로를 꼭 만들어두세요.',
 토:'규칙적인 리듬과 익숙한 일상이 있을 때 가장 편안해져요. 무리한 변화보다 지킬 수 있는 루틴이 힘이 됩니다.',
 금:'정리하고 매듭짓는 시간에 마음이 개운해져요. 하루 한 가지라도 끝맺는 감각이 지치지 않게 지켜줘요.',
 수:'혼자 조용히 쉬는 시간이 있어야 다시 채워지는 분이에요. 잠깐이라도 아무것도 하지 않는 틈을 만들어주세요.',
};
// 신강약 → 과잉 패턴의 강도 수식 (양육방식이 과해지는 형태 조정)
// 일지 십성 → 가족 안에서의 정서 반응 한 줄 (top과 다를 때만 덧붙임)
const BR_EMOTION={
 비겁:'집에서는 아이와 티격태격도 하지만 금세 풀어지는, 친구 같은 편안함이 흘러요.',
 식상:'집안 분위기를 밝게 이끌어, 아이가 감정을 눈치 보지 않고 표현하게 해줘요.',
 재성:'아이의 필요를 빠르게 알아채, 말하기도 전에 손이 먼저 나가는 다정함이 있어요.',
 관성:'앉은 자리에 질서·책임의 뿌리가 있어, 다정하면서도 지킬 선은 분명한 안정감을 줘요.',
 인성:'아이의 속마음을 먼저 읽고 조용히 품어, 집이 늘 안심되는 자리가 돼요.',
};
function analyzeParent(pc){
  const s=pc._s, dayTG=s.dayTG;
  const st=E.calcStrengthScore(s.pillars, dayTG);          // 부모는 실제 시주 있음 → 4주
  const pr=st.total/(st.total+st.drainTotal)*100;
  const yo=E.calcYongshin({ ...s, isStrong: pr>=50 });
  const yong=EN2KO[yo.yongshin]||yo.yongshin, hee=EN2KO[yo.kibun]||yo.kibun;
  // ── 십성 분포: 자리별 가중치 ──
  // ※ 예전엔 7자리를 전부 1점씩 세서 40%가 동점이 됐고, 동점이면 객체 키 순서(비겁>식상>재성…)로
  //   1위가 임의 결정돼 '재성 엄마'가 과다 발생했음. 명리 왕쇠 기준(월지≫일지>월간>나머지)으로 가중.
  const dist={비겁:0,식상:0,재성:0,관성:0,인성:0};
  const add=(cat,w)=>{ if(cat) dist[cat]+=w; };
  const stemW=[[s.yrTG,2],[s.monthTG,3],[s.hourTG,2]];
  const brW  =[[s.yrDZ,2],[s.monthDZ,6],[s.dayDZ,4],[s.hourDZ,2]];
  for(const [t,w] of stemW) if(t!==undefined) add(SS_CAT[tenGodEl(dayTG,t)], w);
  for(const [z,w] of brW)   if(z!==undefined) add(SS_CAT[tenGodEl(dayTG,CG_MAIN[z])], w);
  const level=ratioLv(pr);
  // 일지 십성(앉은 자리) — 정서 반응의 근거이자 동점 tie-break 기준
  const dzIdx=DZ.indexOf(pc.dayBranch);
  const brSS=dzIdx>=0 ? SS_CAT[tenGodEl(dayTG, CG_MAIN[dzIdx])] : '비겁';
  // 1위: 최고점 → 동점이면 '일지 십성' 우선(그 사람의 본질 자리) → 그래도 동점이면 고정 순서
  const _maxV=Math.max(...Object.values(dist));
  const _tied=Object.keys(dist).filter(k=>dist[k]===_maxV);
  const top = _tied.length===1 ? _tied[0] : (_tied.includes(brSS) ? brSS : _tied[0]);
  // ── 십성 중심 프로필 (일간 물상 첫문장 제거, 동일 일간이어도 top·일지로 갈림) ──
  const prof=SS_PROFILE[top]||SS_PROFILE['인성'];
  const arche=(HEAD_COMBO[top]&&HEAD_COMBO[top][brSS])||prof.head;   // 헤드라인 = 발달십성 × 일지십성 (25종)
  // 사랑의 언어 = 발달십성 2개 + 일지십성 1개 → 같은 top이어도 일지가 다르면 갈림
  const _l2=String(prof.lang||'').split(' · ').slice(0,2).join(' · ');
  const trait=`사랑의 언어 — ${_l2}${LANG_BR[brSS]?' · '+LANG_BR[brSS]:''}`;
  // 본문 = [발달십성 정체성 1문장(유형 공통)] + [발달십성×일지 조합 1문장(25종·부모마다 갈림)]
  const _b1=String(prof.body||'').split('. ')[0];
  const _b2=(COMBO_BODY[top]&&COMBO_BODY[top][brSS]) || BR_EMOTION[brSS] || '';
  // [축3] 부(2위) 십성 — top 다음으로 점수가 높은 기운. top·일지와 겹치면 생략해 중복 방지
  const _sub=Object.keys(dist).filter(k=>k!==top).sort((a,b)=>dist[b]-dist[a])[0];
  const _b3=(_sub && dist[_sub]>0 && _sub!==brSS) ? ' '+(SUB_TONE[_sub]||'') : '';
  const love=`${_b1}${_b1&&!/[.!?]$/.test(_b1)?'.':''} ${_b2}${_b3}`.trim();
  // [축4] 용신 → 부모 자신의 충전법 (조합이 아니라 새로 더해지는 정보)
  const recharge=`${RECHARGE[yong]||''}${RECHARGE_LV[level]?' '+RECHARGE_LV[level]:''}`.trim();
  // ※ 신강약 문구는 양육유형 5종 어디에 붙여도 맥락이 어긋나는 경우가 많아 아예 넣지 않음
  const _om=(COMBO_OVER[top]&&COMBO_OVER[top][brSS]) || [prof.over, prof.mission];
  const watch=`이럴 때 과해져요 — ${_om[0]}. ▷부모 미션 — ${_om[1]}`;
  return { dayPillar:TG[dayTG]+pc.dayBranch, dayEl:pc.dayEl, level, yong, hee, sipseongTop:top, sipseongSub:_sub, branchSipseong:brSS, dist, arche, trait, love, watch, recharge };
}
// ── 아기 → 부모 인연 (아기가 부모에게 채워주는 기운) ──
// 아기 오행별 '주는 방식' 이미지 (날짜마다 일간이 달라 문장이 달라짐)
const GIVE_FLAVOR={목:'새싹처럼 곁을 파릇하게 틔워',화:'등불처럼 곁을 환하게 데워',토:'단단한 땅처럼 곁을 든든히 받쳐',금:'맑은 쇳소리처럼 마음을 또렷하게 다듬어',수:'물길처럼 마음을 촉촉이 적셔'};
function babyToParent(baby, parentAn){
  const gen={목:'화',화:'토',토:'금',금:'수',수:'목'};        // A생B
  const ke ={목:'토',토:'수',수:'화',화:'금',금:'목'};         // A극B
  const babyDayEl=(baby&&baby.dayEl)||'', babyPct=(baby&&baby.pct)||{};
  const ms=(baby&&baby.mulsang)||'', dm=(baby&&baby.dayMaster)||'';
  const hz=HZ_[babyDayEl]||'', flavor=GIVE_FLAVOR[babyDayEl]||'곁을 채워';
  const meTag = ms ? `${ms} 같은 <b>${dm}(${babyDayEl}${hz})</b>` : `<b>${babyDayEl}(${hz})</b>`;
  const py=parentAn.yong, pEl=parentAn.dayEl, pHz=HZ_[pEl]||'';
  const hasYong = babyDayEl===py || (babyPct[py]||0) >= 20;
  // ※ 오행 상생·상극 방향을 정확히: 아기日干오행(babyDayEl)과 부모日干오행(pEl)의 실제 관계로만 분기.
  //    (지장간 비율로 '생조'를 잡으면 土생金을 "금생토"로 뒤집는 방향 오류가 남 → 일간오행 관계로 고정)
  let kind, text;
  if(hasYong){ kind='용신보충';
    text=`저는 ${meTag} 아이예요. 제 ${babyDayEl}(${hz}) 기운이 마침 {부모}에게 꼭 필요한 용신이라, ${flavor}주며 {부모}의 부족한 자리를 채우는, 서로에게 힘이 되는 인연이에요.`; }
  else if(gen[babyDayEl]===pEl){ kind='생조';                 // 아기 生 부모 — 아이가 부모를 북돋움
    text=`${meTag}인 제가 {부모}(${pEl}${pHz})를 ${flavor}주는 결이에요(${babyDayEl}生${pEl}). {부모}를 키우는 건 아니지만, 지친 자리를 은근히 북돋아 드리는 든든한 존재가 될 거예요.`; }
  else if(gen[pEl]===babyDayEl){ kind='결실';                 // 부모 生 아기 — 아이는 부모가 길러내는 결실 (土生金 등)
    text=`{부모}(${pEl}${pHz})가 저 ${meTag}를 길러주시는 방향이에요(${pEl}生${babyDayEl}). 저는 {부모}의 사랑을 흠뻑 받고 피어나는 결실이라, ‘잘 키우고 있다’는 보람과 살아가는 기쁨을 안겨드리는 존재가 될 거예요.`; }
  else if(babyDayEl===pEl){ kind='비화조화';                  // 같은 오행 — 동지
    text=`${meTag}인 저와 {부모}는 같은 결이라, 나란히 어깨를 맞대는 든든한 동지 같은 사이예요. 애쓰지 않아도 말 안 해도 통하고, {부모}의 지친 자리를 곁에서 은근히 받쳐드려요.`; }
  else if(ke[babyDayEl]===pEl){ kind='자극';                  // 아기 克 부모 — 부드럽게: 새 바람
    text=`${meTag}인 제가 {부모}에게는 새로운 바람 같은 존재예요. 익숙한 틀에 신선한 자극을 더해, {부모}가 저를 키우며 오히려 더 넓어지고 유연해지는 사이가 돼요.`; }
  else { kind='돌봄';                                         // 부모 克 아기 — 부모가 이끌어 지킴
    text=`${meTag}인 저를 {부모}가 든든히 이끌고 지켜주는 사이예요. {부모}의 단단한 울타리 안에서 저는 마음 놓고 자라고, {부모}는 저를 보살피며 삶의 중심을 새로 얻어요.`; }
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
