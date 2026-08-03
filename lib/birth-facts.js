// 날짜별 팩트시트 (카드덱 수준) — 사주·오행·신강약·용신·돈복신살·부모궁합·만세력·연운·작명.
// 아기는 시각 미정 → 3주(년월일). 부모는 4주. 기존 calcSaju/calcYongshin 재활용.
const E = require('./saju-engine.js');
const { branchRel, babyToParent } = require('./birth-engine.js');

const TG = '갑을병정무기경신임계';
const DZ = '자축인묘진사오미신유술해';
const GAN_WX = ['목','목','화','화','토','토','금','금','수','수'];
const GAN_YIN = [1,0,1,0,1,0,1,0,1,0];
const ZHI_WX = ['수','토','목','목','토','화','화','토','금','금','토','수'];
const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
const KE = { 목:'토', 토:'수', 수:'화', 화:'금', 금:'목' };
const HZ = { 목:'木', 화:'火', 토:'土', 금:'金', 수:'水' };
const HANZA_G = { 갑:'甲',을:'乙',병:'丙',정:'丁',무:'戊',기:'己',경:'庚',신:'辛',임:'壬',계:'癸' };
const HANZA_Z = { 자:'子',축:'丑',인:'寅',묘:'卯',진:'辰',사:'巳',오:'午',미:'未',신:'申',유:'酉',술:'戌',해:'亥' };
const MULSANG = { 갑:'큰 나무',을:'화초·넝쿨',병:'태양',정:'촛불·별',무:'큰 산·대지',기:'논밭·정원',경:'무쇠·바위',신:'보석·칼',임:'큰 강·바다',계:'이슬·시냇물' };
// 지장간 (지지 index → [한글천간, 십성근거용 index])
const HGAN='갑을병정무기경신임계';
const CANGGAN = [ // 자축인묘진사오미신유술해 순
 ['임','계'],['계','신','기'],['무','병','갑'],['갑','을'],['을','계','무'],['무','경','병'],
 ['병','기','정'],['정','을','기'],['무','임','경'],['경','신'],['신','정','무'],['무','갑','임'] ];
// 십이운성
const CHANGSHENG=[11,6,2,9,2,9,5,0,8,3]; // 일간idx → 장생 지지idx
const STAGES=['장생','목욕','관대','건록','제왕','쇠','병','사','묘','절','태','양'];
function twelveStage(dg,dz){ const st=CHANGSHENG[dg]; const i=(GAN_YIN[dg]===1)?((dz-st+12)%12):((st-dz+12)%12); return STAGES[i]; }

function tenGod(dayTG, otherTG){
  const de=GAN_WX[dayTG], oe=GAN_WX[otherTG], same=GAN_YIN[dayTG]===GAN_YIN[otherTG];
  if(de===oe) return same?'비견':'겁재';
  if(SHENG[de]===oe) return same?'식신':'상관';
  if(KE[de]===oe) return same?'편재':'정재';
  if(KE[oe]===de) return same?'편관':'정관';
  return same?'편인':'정인';
}
// 돈복 신살 (일간idx → 목표 지지 한글)
const T_CHEONJU=['사','오','사','오','신','유','해','자','인','묘'];
const T_GEUMYEO=['진','사','미','신','미','신','술','해','축','인'];
const T_AMROK  =['해','술','신','미','신','미','사','진','인','축'];
const T_MUNCHANG=['사','오','신','유','신','유','해','자','인','묘'];
const CHEONEUL={갑:'축미',무:'축미',경:'축미',을:'자신',기:'자신',병:'해유',정:'해유',신:'인오',임:'사묘',계:'사묘'};
const GO={수:'진',목:'미',화:'술',금:'축',토:'진'};
function wealthSinsal(dayTG, branches){
  const set=new Set(branches), dg=TG[dayTG], out=[];
  const has=z=>set.has(z);
  if(has(T_CHEONJU[dayTG])) out.push({key:'천주귀인',label:'식복',desc:'평생 먹을 복이 넉넉한 기운'});
  if(has(T_GEUMYEO[dayTG])) out.push({key:'금여',label:'부귀·안락',desc:'귀하게 대접받는 편안한 풍요'});
  if(has(T_AMROK[dayTG]))   out.push({key:'암록',label:'숨은 재복',desc:'보이지 않는 곳에서 돕는 재물·귀인'});
  if((CHEONEUL[dg]||'').split('').some(has)) out.push({key:'천을귀인',label:'최고 길신',desc:'어려울 때 귀인이 돕는 복'});
  if(has(GO[KE[GAN_WX[dayTG]]])) out.push({key:'재고',label:'재물창고',desc:'재물을 곳간에 쌓아두는 기운'});
  return out;
}
function guiin(dayTG, branches){ const set=new Set(branches),out=[]; if(set.has(T_MUNCHANG[dayTG]))out.push('문창귀인'); return out; }

// ── 신살(역마·도화·화개·백호) → 육아 번역 ──
const SAMHAP_G=[[8,0,4],[5,9,1],[2,6,10],[11,3,7]];        // 신자진·사유축·인오술·해묘미
const YM_T=[2,11,8,5], DH_T=[9,6,3,0], HG_T=[4,1,10,7];     // 그룹별 역마·도화·화개 지지 index
const BAEKHO=[[0,4],[1,7],[2,10],[3,1],[4,4],[8,10],[9,1]]; // 갑진 을미 병술 정축 무진 임술 계축
const SINSAL_CHILD={
 역마:{name:'역마살',def:'이동·새 환경의 별. 몸을 움직일수록 기운이 도는 결이에요.',child:'호기심이 많고 활동적이에요. 집에서도 서랍을 열어 탐험하고, 놀이터에선 앉아 있기보다 뛰어다니는 아이가 될 가능성이 커요.',tip:'답답한 실내보다 자주 바깥 바람을 쐬어주면 기운이 좋게 풀려요.'},
 도화:{name:'도화살',def:'사람을 끌어당기는 매력의 별. 눈길을 모으는 힘이에요.',child:'표정이 사랑스럽고 사람을 웃게 하는 재주가 있어요. 평소엔 조용하다가 좋아하는 자리에선 애교가 톡 터지는 결이에요.',tip:'끼를 “너무 나댄다”고 누르기보다 함께 즐거워해 주면 자존감이 예쁘게 자라요.'},
 화개:{name:'화개살',def:'예술·몰입·자기 세계의 별. 혼자 파고드는 재능이에요.',child:'혼자 그리고 만들고 상상하는 놀이에 깊이 빠지는 아이예요. 좋아하는 것에 유독 오래 집중하는 몰입력이 강점이에요.',tip:'혼자만의 몰입 시간을 존중해주면 그 안에서 자기만의 재능이 자라요.'},
 백호:{name:'백호살',def:'강한 기운이 몸에 실리는 별. 안전 습관과 만나면 씩씩한 추진력이 돼요.',child:'에너지가 넘치고 몸으로 부딪히며 배우는 아이예요. 위험을 먼저 감지하는 초감각도 있어, 조심성과 씩씩함을 함께 지녔어요.',tip:'다칠까 무서워 가두기보다, 안전한 울타리 안에서 마음껏 움직이게 해주면 그 힘이 장점이 돼요.'},
};
function extraSinsal(p3, dayDZ){
  const branches=p3.map(([,z])=>z), out=[];
  const gi=SAMHAP_G.findIndex(g=>g.includes(dayDZ));
  if(gi>=0){
    if(branches.includes(YM_T[gi])) out.push('역마');
    if(branches.includes(DH_T[gi])) out.push('도화');
    if(branches.includes(HG_T[gi])) out.push('화개');
  }
  if(p3.some(([t,z])=>BAEKHO.some(b=>b[0]===t&&b[1]===z))) out.push('백호');
  return out.map(k=>({key:k,...SINSAL_CHILD[k]}));
}

// 만세력 3컬럼 (년/월/일)
function manseryeok(p3, dayTG){
  const pos=['연주','월주','일주'];
  return p3.map(([tg,dz],i)=>{
    const cg=CANGGAN[dz].map(g=>({gan:g, god:tenGod(dayTG, HGAN.indexOf(g))}));
    return { pos:pos[i], gan:TG[tg], ganHz:HANZA_G[TG[tg]], zhi:DZ[dz], zhiHz:HANZA_Z[DZ[dz]],
      ganWx:GAN_WX[tg], zhiWx:ZHI_WX[dz],
      godGan: i===2?'일간':tenGod(dayTG,tg),
      godZhi: tenGod(dayTG, HGAN.indexOf(CANGGAN[dz][CANGGAN[dz].length-1])), // 정기 십성
      canggan: cg, stage: twelveStage(dayTG, dz) };
  });
}
// 연운 10년 (2027~2036) 점수 + 피크/케어 해
const YR_GAN='병정무기경신임계갑을'.split('');  // 2026=병, 2027=정...
function yeonun(y0, dayTG, yong, hee, gi){
  const pts=[];
  for(let yy=2027; yy<=2036; yy++){
    const gi_=(yy-4)%10, zi=(yy-4)%12;
    const gwx=GAN_WX[gi_], zwx=ZHI_WX[zi];
    let sc=0;
    for(const [w,wt] of [[gwx,1],[zwx,0.6]]){ if(w===yong)sc+=2*wt; else if(w===hee)sc+=1*wt; else if(w===gi)sc-=2*wt; }
    pts.push({ year:yy, gz:TG[gi_]+DZ[zi], score:+sc.toFixed(2) });
  }
  const peak=pts.reduce((a,b)=>b.score>a.score?b:a);
  const care=pts.reduce((a,b)=>b.score<a.score?b:a);
  return { pts, peak, care };
}
// 작명 (용신·희신 소리오행 담은 이름 우선)
const CHO='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const CHO_WX={ 'ㄱ':'목','ㄲ':'목','ㅋ':'목','ㄴ':'화','ㄷ':'화','ㄸ':'화','ㄹ':'화','ㅌ':'화','ㅇ':'토','ㅎ':'토','ㅅ':'금','ㅆ':'금','ㅈ':'금','ㅉ':'금','ㅊ':'금','ㅁ':'수','ㅂ':'수','ㅃ':'수','ㅍ':'수' };
function choWx(ch){ const c=ch.charCodeAt(0)-0xAC00; if(c<0||c>11171)return null; return CHO_WX[CHO[Math.floor(c/588)]]; }
function nameTag(nm){ return nm.split('').map(ch=>ch+HZ[choWx(ch)]).join('·'); }
// 소리오행별 인기 이름 풀 (각 글자 초성 = 한 오행). 두 글자가 서로 다른 오행을 담을 수 있어,
// 용신·희신을 '둘 다' 담은 이름이 가장 좋은 답이 됨. 원소별로 고르게 채워 날짜별 차별화 확보.
const NAME_POOL={
  여아:[['가은','인기'],['가율',''],['규리',''],['고은',''],['가온',''],['가린',''],   // 목 계열
       ['나은',''],['다은','인기'],['다인',''],['라온',''],['도아',''],['리아',''],['하린','인기'],  // 화 계열
       ['하윤','인기'],['하은','인기'],['유나',''],['예린',''],['아윤',''],              // 토 계열
       ['서아','인기'],['서연','인기'],['서윤','인기'],['지우','인기'],['지안','인기'],['소율','인기'],['채원',''],['지민','인기'],  // 금 계열
       ['민서','인기'],['하민','인기'],['유민',''],['보민','']],                          // 수 계열
  남아:[['건우','인기'],['규현','인기'],['규민',''],['가온',''],['강민',''],['건희',''],   // 목 계열
       ['도현','인기'],['도윤','인기'],['다온',''],['로운',''],['태오',''],['태윤',''],    // 화 계열
       ['하준','인기'],['현우','인기'],['은우',''],['유준',''],['하율',''],               // 토 계열
       ['서준','인기'],['시우','인기'],['준우','인기'],['지호','인기'],['지훈',''],['준호',''],  // 금 계열
       ['민준','인기'],['민재',''],['범준',''],['보윤','']] };                            // 수 계열
function naming(gender, yong, hee, gi){
  const want=new Set([yong,hee]);
  const pool=NAME_POOL[gender==='남아'?'남아':'여아'];
  const scored=pool.map(([n,p])=>{
    const els=n.split('').map(choWx);
    const covers=new Set(els.filter(e=>want.has(e)));      // 이름이 담은 '필요 원소' 종류
    return { n, p, cov:covers.size, yo:covers.has(yong)?1:0, bad:els.filter(e=>e===gi).length };
  });
  // 용신+희신 둘 다 담은 이름 우선 → 용신 담은 것 → 기신 적은 순 → 인기 순
  const fit=scored.filter(s=>s.cov>0)
    .sort((a,b)=> (b.cov-a.cov) || (b.yo-a.yo) || (a.bad-b.bad) || ((b.p?1:0)-(a.p?1:0)));
  let list=fit.slice(0,6).map(s=>({name:s.n, tag:nameTag(s.n), pop:!!s.p}));
  // 매칭이 3개 미만인 희귀 케이스에만, 기신 적은 인기 이름으로 최소 3개 채움
  if(list.length<3){
    const have=new Set(list.map(x=>x.name));
    const extra=scored.filter(s=>s.cov===0 && !have.has(s.n))
      .sort((a,b)=> (a.bad-b.bad) || ((b.p?1:0)-(a.p?1:0)))
      .slice(0,3-list.length).map(s=>({name:s.n, tag:nameTag(s.n), pop:!!s.p}));
    list=[...list,...extra];
  }
  return { elems:[yong,hee], list };
}

const wxKo=w=>({Wood:'목',Fire:'화',Earth:'토',Metal:'금',Water:'수'}[w]||w);
const LV5=['태약','신약','중화신약','중화신강','신강'];
// 지지율(support/(support+drain)) → 5단계 신강약
function ratioLevel(r){ return r>=62?'신강':r>=53?'중화신강':r>=47?'중화신약':r>=33?'신약':'태약'; }
function supportRatio(pillars,dayTG){ const st=E.calcStrengthScore(pillars,dayTG); return st.total/(st.total+st.drainTotal)*100; }

function babyFacts(y,m,d,gender){
  const s=E.calcSaju(y,m,d,12,0,false,127);
  const p3=[[s.yrTG,s.yrDZ],[s.monthTG,s.monthDZ],[s.dayTG,s.dayDZ]];
  const branches=p3.map(([,z])=>DZ[z]);
  const dayEl=GAN_WX[s.dayTG];
  const sc={목:0,화:0,토:0,금:0,수:0};
  p3.forEach(([t,z])=>{sc[GAN_WX[t]]++;sc[ZHI_WX[z]]++;});
  const pct={};['목','화','토','금','수'].forEach(e=>pct[e]=+(sc[e]/6*100).toFixed(1));

  // ── 신강약: 엔진 월령·통근 기반 (3주 실사용) + 시주 미정 변동 밴드 ──
  const baseR=supportRatio(p3,s.dayTG);                    // 시주 제외 기준값
  const hourRs=[];                                         // 12시진 각각 (시주 넣었을 때)
  for(let hh=0;hh<24;hh+=2){ const sh=E.calcSaju(y,m,d,hh,0,false,127); hourRs.push(supportRatio(sh.pillars,sh.dayTG)); }
  const minR=Math.min(baseR,...hourRs), maxR=Math.max(baseR,...hourRs);
  const level=ratioLevel(baseR);
  const strengthBand={ min:ratioLevel(minR), max:ratioLevel(maxR), minPct:+minR.toFixed(1), maxPct:+maxR.toFixed(1),
    span: LV5.indexOf(ratioLevel(maxR))-LV5.indexOf(ratioLevel(minR)) };   // span>0 이면 시주에 따라 이동
  const stability=+Math.max(0,100-Math.abs(baseR-50)*2).toFixed(1);       // 중화(50)에 가까울수록 안정

  // ── 용신: 3주 기반 강약 + 조후(계절) ──
  const yo=E.calcYongshin({ ...s, isStrong: baseR>=50 });
  let yong=wxKo(yo.yongshin), hee=wxKo(yo.kibun), gi=wxKo(yo.gishin);
  const need=(s.johu?.need||[]).map(wxKo);
  if(hee===gi){ hee = need.find(e=>e!==yong && e!==gi) || yong; }          // 희신=기신 충돌 시 조후 보조로 대체
  const yongWhy=`${MULSANG[TG[s.dayTG]]} 같은 ${TG[s.dayTG]}(${HZ[dayEl]}) 일간이 ${DZ[s.monthDZ]}월(${ZHI_WX[s.monthDZ]}) 태생이라, `+
    (baseR>=50 ? `기운이 넉넉해 <b>${yong}(${HZ[yong]})</b>로 힘을 덜어주면 좋아요.` : `계절이 도와주지 않아, <b>${yong}(${HZ[yong]})</b> 기운으로 채워주면 좋아요.`);

  return {
    saju3:p3.map(([t,z])=>TG[t]+DZ[z]),
    dayMaster:TG[s.dayTG], dayEl, mulsang:MULSANG[TG[s.dayTG]], dayBranch:DZ[s.dayDZ], branches,
    monthBranch:DZ[s.monthDZ], monthEl:ZHI_WX[s.monthDZ],
    ohaeng:pct, missing:Object.keys(pct).filter(e=>pct[e]<5), dominant:Object.keys(pct).sort((a,b)=>pct[b]-pct[a])[0],
    strengthPct:+baseR.toFixed(1), strengthLevel:level, strengthBand, stability,
    yongshin:yong, heeshin:hee, gishin:gi, yongWhy,
    wealthSinsal:wealthSinsal(s.dayTG,branches), guiin:guiin(s.dayTG,branches),
    sinsalChild:extraSinsal(p3, s.dayDZ),
    manseryeok:manseryeok(p3,s.dayTG),
    yeonun:yeonun(y,s.dayTG,yong,hee,gi),
    naming:naming(gender,yong,hee,gi),
    birthYear:y,
    _dayTG:s.dayTG,
  };
}
function parentBond(bf,parent){
  const pTG=TG.indexOf(parent.dayPillar[0]);
  return { parentDay:parent.dayPillar, sipseong:tenGod(bf._dayTG,pTG), branchRel:branchRel(bf.dayBranch,parent.dayPillar[1]) };
}
function buildFacts(selection, gender){
  const pAn=selection.parentAn||[];
  return selection.top3.map(c=>{
    const f=babyFacts(c.y,c.m,c.d,gender);
    const bonds=selection.parents.map((p,i)=>({who:i===0?'엄마':'아빠',...parentBond(f,p)}));
    // 아기 → 부모 인연 (아기가 부모에게 채워주는 기운)
    const inyeon=pAn.map(pa=>({ who:pa.who, ...babyToParent(f.dayEl, f.ohaeng, pa) }));
    return { date:c.date, score:c.score, eval:c.eval, ...f, bonds, parentAn:pAn, inyeon, hourCurve:c.hourCurve };
  });
}
module.exports = { buildFacts, babyFacts, tenGod, HZ };
