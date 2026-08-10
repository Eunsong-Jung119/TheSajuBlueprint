// 저장 payload → 섹션형(01~10) 브랜드 리포트 HTML (/b/:id · 검수/고객용).
// 구조: 표지 → 편지 → 목차 → 01 부모 → 02 왜3일 → 03 첫인상 → 04 사용설명서
//       → 05 직업 → 06 돈복 → 07 부모관계 → 08 작명 → 09 연운 → 10 닫는편지
const WXCOL={목:'#5bb3a3',화:'#e08a72',토:'#d6ab52',금:'#a9b0ba',수:'#5b7c93'};
const HZ={목:'木',화:'火',토:'土',금:'金',수:'水'};
const GWX={갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'};
const YY_G={갑:'陽木',을:'陰木',병:'陽火',정:'陰火',무:'陽土',기:'陰土',경:'陽金',신:'陰金',임:'陽水',계:'陰水'};
const YY_Z={자:'陽水',축:'陰土',인:'陽木',묘:'陰木',진:'陽土',사:'陰火',오:'陽火',미:'陰土',신:'陽金',유:'陰金',술:'陽土',해:'陰水'};
const ZWX={자:'수',축:'토',인:'목',묘:'목',진:'토',사:'화',오:'화',미:'토',신:'금',유:'금',술:'토',해:'수'};
const esc=s=>String(s??'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
const TGH={갑:'甲',을:'乙',병:'丙',정:'丁',무:'戊',기:'己',경:'庚',신:'辛',임:'壬',계:'癸'};
const DZH={자:'子',축:'丑',인:'寅',묘:'卯',진:'辰',사:'巳',오:'午',미:'未',신:'申',유:'酉',술:'戌',해:'亥'};
const pillarHz=p=>(TGH[(p||'')[0]]||(p||'')[0]||'')+(DZH[(p||'')[1]]||(p||'')[1]||'');
const IL='/birth/assets';

// ── 라인 아이콘 세트 (이모지 대체) ──
const IC={
 audit:'<svg class="ic ic-audit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4.2" width="14" height="16.6" rx="2.2"/><path d="M9.2 4.2h5.6v2.8H9.2z"/><path d="M8.6 12.4l2 2 3.8-4"/></svg>',
 chev:'<svg class="ic ic-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>',
 search:'<svg class="ic ic-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M19.5 19.5l-3.8-3.8"/></svg>',
 check:'<svg class="ic ic-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.6l4 3.9 10-9.8"/></svg>',
 scales:'<svg class="ic ic-scales" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16"/><path d="M7 20h10"/><path d="M4.5 7.5l15-2.6"/><path d="M4.5 7.5l-2 5.2h8z"/><path d="M19.5 4.9l2 5.2h-8z"/></svg>',
 link:'<svg class="ic ic-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 14.8l5.6-5.6"/><path d="M10.6 7.6l1.2-1.2a3.4 3.4 0 0 1 4.8 4.8l-1.2 1.2"/><path d="M13.4 16.4l-1.2 1.2a3.4 3.4 0 0 1-4.8-4.8l1.2-1.2"/></svg>',
 clock:'<svg class="ic ic-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.2l2.6 1.6"/></svg>',
 compass:'<svg class="ic ic-compass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M15.4 8.6l-2 5-5 2 2-5z"/></svg>',
 eye:'<svg class="ic ic-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/></svg>',
 tip:'<svg class="ic ic-tip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M10.4 8.6l3.4 3.4-3.4 3.4"/></svg>',
 coin:'<svg class="ic ic-coin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.2"/><path d="M8.2 9l1.7 6L12 10l2.1 5 1.7-6"/><path d="M7.6 12.2h8.8"/></svg>',
 spark:'<svg class="ic ic-spark" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 3l1.9 5.4L19.4 10l-5.5 1.6L12 17l-1.9-5.4L4.6 10l5.5-1.6z"/></svg>',
 heart:'<svg class="ic ic-heart" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 20.4s-7.2-4.5-9.6-9.2C1 7.9 2.6 4.4 6.1 4.4c2 0 3.2 1.2 3.9 2.3.7-1.1 1.9-2.3 3.9-2.3 3.5 0 5.1 3.5 3.7 6.8C19.2 15.9 12 20.4 12 20.4z"/></svg>',
 pen:'<svg class="ic ic-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l3.8-1L17.4 9.4a1.9 1.9 0 0 0-2.8-2.8L5 16.2z"/><path d="M13.4 6.6l2.9 2.9"/></svg>',
 bulb:'<svg class="ic ic-bulb" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 18h5.6"/><path d="M10 21h4"/><path d="M12 3.2A5.8 5.8 0 0 0 8.2 13.2c.7.7 1 1.4 1 2.6h5.6c0-1.2.3-1.9 1-2.6A5.8 5.8 0 0 0 12 3.2z"/></svg>',
 star:'<svg class="ic ic-star" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 3.4l2.6 5.4 5.9.9-4.3 4.2 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.2 5.9-.9z"/></svg>',
 case:'<svg class="ic ic-case" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7.6" width="18" height="11.8" rx="2"/><path d="M8 7.6V6.2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.4"/><path d="M3 12.6h18"/></svg>',
};
const ic=(n,cls='')=> (IC[n]||'').replace('class="ic', cls?('class="ic '+cls):'class="ic');

// ── 오행 펜타곤 SVG ──
const ORDER=['목','화','토','금','수'], ANG={목:-90,화:-18,토:54,금:126,수:198};
function penta(f, S){
  S=S||320; const cx=S/2,cy=S/2+6,R=S*0.33, pos={};
  ORDER.forEach(k=>{const a=ANG[k]*Math.PI/180; pos[k]=[cx+R*Math.cos(a),cy+R*Math.sin(a)];});
  let s=`<svg viewBox="0 0 ${S} ${S+8}" class="penta">`;
  const sq=['목','화','토','금','수','목'];
  for(let i=0;i<5;i++){const [x1,y1]=pos[sq[i]],[x2,y2]=pos[sq[i+1]];const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
    s+=`<line x1="${(x1+ux*40).toFixed(1)}" y1="${(y1+uy*40).toFixed(1)}" x2="${(x2-ux*44).toFixed(1)}" y2="${(y2-uy*44).toFixed(1)}" stroke="#e7ddcd" stroke-width="2"/>`;}
  for(const k of ORDER){const [x,y]=pos[k];const pct=f.ohaeng[k],col=WXCOL[k],rr=28+pct*0.4;
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${col}" opacity="0.15"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="38" fill="none" stroke="${col}" stroke-width="3"/>`;
    s+=`<text x="${x.toFixed(1)}" y="${(y-3).toFixed(1)}" text-anchor="middle" font-size="25" font-weight="800" fill="${col}">${HZ[k]}</text><text x="${x.toFixed(1)}" y="${(y+17).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="${col}">${pct}%</text>`;}
  return s+'</svg>';
}
function pentaSm(f, size){
  size=size||118; const cx=size/2,cy=size/2+4,R=size*0.32, pos={};
  ORDER.forEach(k=>{const a=ANG[k]*Math.PI/180; pos[k]=[cx+R*Math.cos(a),cy+R*Math.sin(a)];});
  let s=`<svg viewBox="0 0 ${size} ${size+6}" class="psm">`;
  for(const k of ORDER){const [x,y]=pos[k];const pct=f.ohaeng[k],col=WXCOL[k],rr=12+pct*0.18;
    s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(0)}" fill="${col}" opacity="0.16"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="15" fill="none" stroke="${col}" stroke-width="1.8"/>`;
    s+=`<text x="${x.toFixed(0)}" y="${(y+5).toFixed(0)}" text-anchor="middle" font-size="13" font-weight="800" fill="${col}">${HZ[k]}</text>`;}
  return s+'</svg>';
}
// ── 오행 막대 + 신강약 스펙트럼 ──
function ohaeng(f){
  const rows=[...ORDER].sort((a,b)=>f.ohaeng[b]-f.ohaeng[a]);
  const role=e=>[[e===f.dayEl,'일간','ilgan'],[e===f.yongshin,'용신','yong'],[e===f.heeshin,'희신','hee'],
    [e===f.gishin && e!==f.yongshin && e!==f.heeshin,'기신','gi']]
    .filter(x=>x[0]).map(x=>`<span class="bg ${x[2]}">${x[1]}</span>`).join('');
  const bars=rows.map(e=>{const p=f.ohaeng[e],col=WXCOL[e];
    return `<div class="brow"><div class="blab"><b style="color:${col}">${HZ[e]}</b> ${e} ${role(e)}</div><div class="btrack"><div class="bfill" style="width:${Math.max(p,3)}%;background:${col}"></div></div><div class="bpct">${p}%</div></div>`;}).join('');
  const lv=['태약','신약','중화신약','중화신강','신강'];const idx=lv.indexOf(f.strengthLevel);
  const ml=idx/(lv.length-1)*100;
  const ticks=lv.map((n,i)=>`<div class="tick ${i===idx?'on':''}" style="left:${i/(lv.length-1)*100}%"><i></i><span class="tk">${n}</span></div>`).join('');
  const band=f.strengthBand||{};
  // 시주 밴드 음영 (min~max)
  let shade='';
  if(band.span>0){ const a=lv.indexOf(band.min),b=lv.indexOf(band.max); const L=a/(lv.length-1)*100,W=(b-a)/(lv.length-1)*100;
    shade=`<div class="bandshade" style="left:${L}%;width:${W}%"></div>`; }
  const caveat = band.span>0
    ? `${ic('clock')}태어난 <b>시각(시주)</b>에 따라 <b>${band.min}~${band.max}</b> 사이에서 움직여요. 시주가 정해지면 더 또렷해져요.`
    : `${ic('clock')}시주(태어난 시각)를 넣어도 대체로 <b>${f.strengthLevel}</b> 흐름을 유지해요.`;
  const why = f.yongWhy ? `<div class="yongwhy">${ic('compass')}<b>${f.yongshin}(${HZ[f.yongshin]})</b>이 필요한 이유 — ${f.yongWhy}</div>` : '';
  const surfaceNote = `<div style="font-size:12px;color:var(--ink2);line-height:1.65;background:#fbf5ee;border-radius:10px;padding:10px 12px;margin:8px 0 4px">${ic('bulb')}위 %는 <b>겉으로 드러난 사주 6글자</b>의 단순 분포예요. 실제 기운의 강약은 <b>월령·지장간·통근</b>까지 함께 봐서 정하므로, <b>0%라도 그 기운이 아예 없다는 뜻은 아니에요.</b> 이 아이의 실제 세력은 아래 <b>신강약(${f.strengthLevel})</b>으로 판단해요.</div>`;
  return `${penta(f)}<div style="font-size:12px;font-weight:700;color:var(--ink2);margin-bottom:6px">겉으로 드러난 6글자의 오행 분포</div><div class="balance">${bars}</div>${surfaceNote}
  <div class="spec"><div class="speclabel"><span class="lv">${f.strengthLevel}</span> <span class="lvpct">지지율 ${f.strengthPct}%</span></div>
  <div class="track">${shade}<div class="me" style="left:${ml}%">나</div>${ticks}</div></div>
  <div class="bandnote">${caveat}</div>${why}`;
}
// ── 만세력 3컬럼 (연·월·일) ──
function manse(f){
  const cols=f.manseryeok; // [연,월,일]
  const head=['연주 年','월주 月','일주 日'];
  const gcell=c=>`<div class="tile" style="background:${WXCOL[c.ganWx]}"><b>${c.ganHz}</b><span>${YY_G[c.gan]}</span></div>`;
  const zcell=c=>`<div class="tile" style="background:${WXCOL[c.zhiWx]}"><b>${c.zhiHz}</b><span>${YY_Z[c.zhi]}</span></div>`;
  const rc=(v,cl='')=>v.map(x=>`<td class="${cl}">${x}</td>`).join('');
  return `<table class="manse"><tr><th></th>${head.map(h=>`<th>${h}</th>`).join('')}</tr>
  <tr><th>십성</th>${rc(cols.map(c=>c.godGan),'chip')}</tr>
  <tr><th>천간</th>${rc(cols.map(gcell))}</tr>
  <tr><th>지지</th>${rc(cols.map(zcell))}</tr>
  <tr><th>십성</th>${rc(cols.map(c=>c.godZhi),'chip')}</tr>
  <tr><th>지장간</th>${rc(cols.map(c=>c.canggan.map(g=>g.gan+'·'+g.god).join('<br>')),'tiny')}</tr>
  <tr><th>십이운성</th>${rc(cols.map(c=>c.stage),'tiny')}</tr></table>`;
}
// ── 연운 10년 SVG ──
function yeonGraph(f){
  const p=f.yeonun.pts;const W=360,H=150,pL=14,pR=14,pT=20,pB=28;
  const sc=p.map(x=>x.score);const mx=Math.max(3.4,...sc),mn=Math.min(-2.6,...sc);
  const X=i=>pL+i*(W-pL-pR)/9, Y=v=>pT+(mx-v)/(mx-mn)*(H-pT-pB);
  const pk=p.findIndex(x=>x.year===f.yeonun.peak.year), cr=p.findIndex(x=>x.year===f.yeonun.care.year);
  let g=`<svg viewBox="0 0 ${W} ${H}" class="yeon"><line x1="${pL}" y1="${Y(0).toFixed(0)}" x2="${W-pR}" y2="${Y(0).toFixed(0)}" stroke="#efe4d5"/>`;
  g+=`<polyline points="${p.map((x,i)=>X(i).toFixed(0)+','+Y(x.score).toFixed(0)).join(' ')}" fill="none" stroke="#cdbfe8" stroke-width="2.5"/>`;
  p.forEach((x,i)=>{g+=`<circle cx="${X(i).toFixed(0)}" cy="${Y(x.score).toFixed(0)}" r="3" fill="#b9addf"/><text x="${X(i).toFixed(0)}" y="${H-8}" text-anchor="middle" font-size="9" fill="#a99a8b">${String(x.year).slice(2)}</text>`;});
  g+=`<circle cx="${X(pk).toFixed(0)}" cy="${Y(sc[pk]).toFixed(0)}" r="5" fill="#e0a83a"/><text x="${X(pk).toFixed(0)}" y="${(Y(sc[pk])-8).toFixed(0)}" text-anchor="middle" font-size="16" fill="#e0a83a">★</text>`;
  g+=`<circle cx="${X(cr).toFixed(0)}" cy="${Y(sc[cr]).toFixed(0)}" r="5.5" fill="#e79a86"/><text x="${X(cr).toFixed(0)}" y="${(Y(sc[cr])-9).toFixed(0)}" text-anchor="middle" font-size="12" fill="#d07a63">♥</text>`;
  return g+'</svg>';
}

// ── 껌딱지 계산 (아기 용신/희신을 더 많이 지닌 부모: 일주 천간+지지 기준) ──
function clingy(f, parents){
  const yong=f.yongshin, hee=f.heeshin;
  const wOf=p=>{ // 부모 일주(천간+지지) 오행이 아기 용신·희신을 얼마나 채우나
    const stemEl=GWX[(p.dayPillar||'')[0]], brEl=ZWX[(p.dayPillar||'')[1]];
    let s=0;
    for(const e of [stemEl,brEl]){ if(e===yong)s+=2; else if(e===hee)s+=1; }
    return s;
  };
  const mom=parents[0]||{}, dad=parents[1]||{};
  const ms=wOf(mom), ds=wOf(dad);
  if(Math.abs(ms-ds)<0.01) return { who:'both', yong }; // 동점 → 둘 다
  return { who: ms>ds?'엄마':'아빠', yong };
}

// ── 날짜 헤더 ──
function dHead(f){
  const hz=f.saju3[2].split('').map(ch=>({갑:'甲',을:'乙',병:'丙',정:'丁',무:'戊',기:'己',경:'庚',신:'辛',임:'壬',계:'癸',자:'子',축:'丑',인:'寅',묘:'卯',진:'辰',사:'巳',오:'午',미:'未',신:'申',유:'酉',술:'戌',해:'亥'}[ch]||ch)).join('');
  return `<div class="dtitle"><span class="dd">${f.date}</span><span class="dj">${hz} · ${f.dayMaster}${HZ[f.dayEl]} 일주</span></div>`;
}
function secBlock(f, inner){
  return `<div class="card"><div class="bhead">${dHead(f).replace('dtitle','dtitle bh')}</div>${inner}</div>`;
}

// ── 부모 스타일(일간 오행 기반) ──
const PARENT_STYLE={
 목:{icon:'🌳',arche:'곧게 이끄는 나무 같은 부모',desc:'배움과 성장을 소중히 여겨, 아이가 스스로 뻗어 나가도록 방향을 잡아주는 든든한 나무 같은 부모예요.'},
 화:{icon:'🔆',arche:'밝고 다정한 태양 같은 부모',desc:'표현이 풍부하고 따뜻해, 아이의 감정을 환히 비춰주고 함께 즐거워하는 밝은 부모예요.'},
 토:{icon:'⛰️',arche:'넉넉하고 안정적인 대지 같은 부모',desc:'묵묵하고 품이 넓어, 아이가 어떤 모습이어도 편안히 기댈 수 있는 안정된 울타리가 되어주는 부모예요.'},
 금:{icon:'⚖️',arche:'반듯하고 원칙 있는 부모',desc:'옳고 그름이 분명하고 절도가 있어, 아이에게 바른 기준과 단단한 중심을 심어주는 부모예요.'},
 수:{icon:'🌊',arche:'지혜롭고 유연한 물 같은 부모',desc:'생각이 깊고 융통성이 있어, 아이의 마음을 헤아리며 상황에 맞게 부드럽게 이끌어주는 부모예요.'},
};

// ── 섹션 렌더 ──
function section(no,title,inner,note){
  const n=note?`<small class="note">${note}</small>`:'';
  return `<section><div class="wrap"><div class="secno">${no}</div><h2>${esc(title)}</h2>${n}${inner}</div></section>`;
}

// 01 부모 — 실제 십성 기반 양육 유형 + 사랑 언어
function s01(p){
  const pan=(p.dates&&p.dates[0]&&p.dates[0].parentAn)||[];
  const src=pan.length?pan:(p.parents||[]).map((x,i)=>({who:i===0?'엄마':'아빠',dayPillar:x.dayPillar,dayEl:x.dayEl,sipseongTop:'',arche:'',love:'',watch:''}));
  const ps=src.map((a,i)=>`<div class="pcard ${i===1?'dad':''}"><div class="who">${a.who} <span class="pj">(${pillarHz(a.dayPillar)} 일주 · ${a.dayEl}${HZ[a.dayEl]}${a.sipseongTop?' · '+a.sipseongTop+' 발달':''})</span></div>
    <div class="ju">${esc(a.arche)}</div>${a.trait?`<p class="ptrait">${esc(a.trait)}</p>`:''}<p>${esc(a.love)}</p>${a.watch?`<div class="watch">${ic('eye')}${esc(a.watch)}</div>`:''}</div>`).join('');
  // 두 분 공통점 — 같은 일간이어도 사랑법이 어떻게 갈리는지 1문장으로 묶음
  const SS_LOVE_LABEL={비겁:'나란히 함께하는 사랑',식상:'놀이로 표현하는 사랑',재성:'현실을 챙기는 사랑',관성:'울타리로 지켜주는 사랑',인성:'마음을 품는 사랑'};
  let common='';
  if(src.length===2 && src[0].dayEl && src[0].dayEl===src[1].dayEl && src[0].sipseongTop && src[1].sipseongTop && src[0].sipseongTop!==src[1].sipseongTop){
    const lm=SS_LOVE_LABEL[src[0].sipseongTop]||'', ld=SS_LOVE_LABEL[src[1].sipseongTop]||'';
    if(lm&&ld) common=`<div class="pcommon">${ic('heart')}<b>두 분의 공통점</b> — 뿌리는 같은 ${src[0].dayEl}(${HZ[src[0].dayEl]}) 부모지만, 엄마는 ‘${lm}’, 아빠는 ‘${ld}’으로 사랑을 표현하는 방식이 이렇게 갈려요.</div>`;
  }
  const img=`<div class="illust"><img src="${IL}/il-parents.png" alt="부모"></div>`;
  return section('01','우리는 어떤 부모가 될까?', img+ps+common,
    '엄마·아빠 사주에서 <b>가장 발달한 기운(십성)</b>으로 두 분의 양육 스타일과 사랑을 표현하는 방식을 읽었어요.');
}
// 7단계 레이더 (heptagon)
function radar(ev){
  const meta=ev.stageMeta||[], vals=meta.map(m=>ev.stages[m.key]);
  const N=meta.length, S=300, cx=S/2, cy=S/2+6, R=S*0.32;
  const pt=(i,r)=>{const a=(-90+i*360/N)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)];};
  let g=`<svg viewBox="-46 0 ${S+92} ${S+8}" class="radar">`;
  // 그리드
  for(const gr of [0.25,0.5,0.75,1]){ const pts=meta.map((_,i)=>pt(i,R*gr).map(n=>n.toFixed(1)).join(',')).join(' '); g+=`<polygon points="${pts}" fill="none" stroke="#ece2d4" stroke-width="1"/>`; }
  meta.forEach((_,i)=>{const[x,y]=pt(i,R); g+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#ece2d4" stroke-width="1"/>`;});
  // 값 폴리곤
  const vpts=vals.map((v,i)=>pt(i,R*Math.max(0.05,v/100)).map(n=>n.toFixed(1)).join(',')).join(' ');
  g+=`<polygon points="${vpts}" fill="rgba(224,168,58,.18)" stroke="#e0a83a" stroke-width="2.5"/>`;
  vals.forEach((v,i)=>{const[x,y]=pt(i,R*Math.max(0.05,v/100)); g+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#e0a83a"/>`;});
  // 라벨
  meta.forEach((m,i)=>{const[x,y]=pt(i,R+22); const anc=Math.abs(x-cx)<20?'middle':(x>cx?'start':'end');
    g+=`<text x="${x.toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="${anc}" font-size="13" font-weight="700" fill="#8a7a72">${m.short||m.label}</text><text x="${x.toFixed(1)}" y="${(y+19).toFixed(1)}" text-anchor="${anc}" font-size="12.5" font-weight="800" fill="#40323b">${ev.stages[m.key]}</text>`;});
  return g+'</svg>';
}
// 7단계 항목별 '왜 좋은지' 육아 관점 설명 (부정 표현 없이 강점만 풀어씀)
const STAGE_BENEFIT={
  seasonal:'태어난 계절과 타고난 기운이 잘 맞아, 무리 없이 자기 리듬대로 편안하게 자라는 결이에요.',
  core:'중심이 단단해서, 상황이 흔들려도 쉽게 휩쓸리지 않고 자기 색을 지키는 아이예요.',
  balance:'오행이 고루 섞여 있어, 한쪽으로 치우치지 않고 여러 방면을 두루 잘 해내는 균형감이 있어요.',
  structure:'사주 짜임이 반듯해서, 한번 마음먹은 일은 끝까지 파고드는 집중력이 있어요.',
  growth:'배우고 뻗어나가는 기운이 좋아, 새로운 걸 스펀지처럼 빨아들이며 부쩍부쩍 크는 아이예요.',
  parent:'부모와 결이 잘 맞아, 크면서 티격태격보다 친구처럼 편하게 지내는 사이가 돼요.',
  future:'뒤로 갈수록 운의 흐름이 열려 있어, 서두르지 않아도 꾸준히 무르익는 대기만성형이에요.',
};
// 시주 곡선 — 출산 시간 선택 가능 시 12시진 점수
function hourBars(f){
  const hc=f.hourCurve; if(!hc||!hc.curve) return '';
  const sc=hc.curve.map(x=>x.score), mx=Math.max(...sc), mn=Math.min(...sc);
  const bars=hc.curve.map(x=>{const on=x.siji===hc.best.siji; const h=14+(x.score-mn)/((mx-mn)||1)*46;
    return `<div class="hb ${on?'on':''}"><span class="hbs">${x.score}</span><div class="hbar" style="height:${h}px"></div><span class="hbl">${x.siji.replace('시','')}</span></div>`;}).join('');
  return `<div class="hourbox"><div class="hbh">${ic('clock')}<b>출산 시간을 고를 수 있다면</b></div>
    <div class="hbars">${bars}</div>
    <div class="hbnote">제왕절개 등으로 시간을 정할 수 있다면, 이 날 중 <b>${hc.best.siji}(${hc.best.span}시)</b>에 태어날 때 오행·신강약이 가장 고르게 짜여요. 시간을 모르면 참고만 하세요.</div></div>`;
}
// 02 왜 이 세 날짜 — 7단계 택일 심사
function s02(p){
  const sel=new Set((p.dates||[]).map(d=>d.date));
  const range=[...(p.range||[])].sort((a,b)=>b.score-a.score);
  const mx=Math.max(...range.map(x=>x.score),1);
  const meta=(p.dates&&p.dates[0]&&p.dates[0].eval&&p.dates[0].eval.stageMeta)||[];
  // 심사 항목 설명
  const frame=`<div class="frame"><div class="frameh">${ic('audit')}이렇게 <b>7단계</b>로 심사했어요</div>
    <div class="framelist">${meta.map((m,i)=>`<div class="fi"><span class="fn">${i+1}</span><div><b>${m.label}</b><em>${m.inner}</em></div></div>`).join('')}</div>
    <div class="framenote">전문가가 원국에서 실제로 보는 항목이에요. 각 단계 점수를 합쳐 <b>종합 안정도</b>를 냈어요.</div></div>`;
  // 종합 랭킹
  const rrows=range.map(x=>{
    const on=sel.has(x.date);const w=Math.max(6,Math.round(x.score/mx*100));
    return `<div class="rgrow ${on?'on':''}"><span class="rgd">${x.date}</span><span class="rgj">${x.dayPillar}</span><div class="rgtrack"><div class="rgfill" style="width:${w}%"></div></div><span class="rgs">${on?ic('star','mute')+' ':''}${Math.round(x.score)}</span></div>`;
  }).join('');
  const rangebox=`<div class="rangebox">${rrows}<div class="rgnote">막대는 <b>종합 안정도</b>(7단계 가중 합)예요. 후보끼리 비교하기 위한 참고값이라, 높다고 삶 전체가 더 좋다는 뜻은 아니에요.</div></div>`;
  // 후보 비교: 이 날짜가 셋 중 '유일하게' 가장 높은/낮은 항목
  const dates=(p.dates||[]);
  const uniqTop=f=>dates.length<2?[]:meta.filter(m=>{const v=f.eval.stages[m.key]; return dates.every(o=>o===f||o.eval.stages[m.key]<v);});
  const rankOf=d=>range.findIndex(x=>x.date===d.date)+1;
  const cmp=dates.map(f=>{
    const ev=f.eval; if(!ev) return '';
    const band=f.strengthBand||{};
    const bandTxt = band.span>0 ? `시주에 따라 <b>${band.min}~${band.max}</b> 이동` : `시주 넣어도 ${f.strengthLevel} 유지`;
    // 이 날짜가 셋 중 유일하게 가장 높은 항목만 골라, '왜 좋은지'를 풀어서 (부정 표현 없음)
    const leadStages=uniqTop(f).sort((a,b)=>f.eval.stages[b.key]-f.eval.stages[a.key]).slice(0,2);
    const cmpItems = leadStages.length
      ? leadStages.map(m=>`<div class="vsit"><b>${m.label}</b> — ${STAGE_BENEFIT[m.key]||'이 아이가 특히 잘 타고난 부분이에요.'}</div>`).join('')
      : `<div class="vsit">특정 항목이 도드라지기보다 <b>전반적으로 고르게 안정적</b>이에요. 모난 데 없이 두루 잘 자라는, 안심되는 결이에요.</div>`;
    return `<div class="cmp col">
      <div class="cmph"><b>${f.date}</b> <span class="cmpj">${f.saju3[2]} · ${ev.gyeok.name}</span> <span class="crown">종합 ${rankOf(f)}위 · ${Math.round(f.score)}점</span></div>
      <div class="cmplab">${esc(f.content?.type||'')}</div>
      ${radar(ev)}
      <div class="vs">${ic('spark')}<b>이 날이 특히 잘 타고난 점</b>${cmpItems}</div>
      ${ev.hapchung.length?`<div class="hap">${ic('link')}합충 구조 — ${ev.hapchung.map(esc).join(' · ')}</div>`:''}
      <div class="sgband">${ic('clock')}<b>신강약</b> ${f.strengthLevel} · ${bandTxt}</div>
      ${hourBars(f)}</div>`;
  }).join('');
  return section('02','왜 이 세 날짜가 남았을까요?', frame+rangebox+cmp, '');
}
// 신살 → 육아 반짝임 (1인칭) · 강점 → 그림자 → 발현(이렇게 키워요) 3단
function sparkBlock(f){
  const ss=f.sinsalChild||[]; if(!ss.length) return '';
  const items=ss.map(s=>`<div class="sparkit"><div class="sph">${ic('spark')}<b>${s.name}</b> — ${esc(s.def)}</div>
    <div class="s3 good"><b>잘 쓰면 재능</b> ${esc(s.child)}</div>
    ${s.shadow?`<div class="s3 shadow"><b>과하면 이런 그림자</b> ${esc(s.shadow)}</div>`:''}
    <div class="s3 grow">${ic('tip')}<b>이렇게 키워요</b> ${esc(s.tip)}</div></div>`).join('');
  return `<div class="card sparkcard"><div class="bh2">${ic('star')}제 안의 특별한 반짝임</div><div class="sparknote">타고난 별은 <b>잘 쓰면 재능, 과하면 살짝 주의</b>가 함께 있어요. 눌러 없애기보다 좋은 쪽으로 키워주세요.</div>${items}</div>`;
}
// 핵심 구조 3줄 — 상태 → 흔드는 것 → 살림 (결정론적, 팩트 기반)
const _GEN={목:'화',화:'토',토:'금',금:'수',수:'목'}, _KE={목:'토',토:'수',수:'화',화:'금',금:'목'};
function _ssCat(dayEl,other){ if(dayEl===other)return'비겁'; if(_GEN[dayEl]===other)return'식상'; if(_GEN[other]===dayEl)return'인성'; if(_KE[dayEl]===other)return'재성'; if(_KE[other]===dayEl)return'관성'; return''; }
const _DRAIN={관성:'옳고 그름·규율로 끊임없이 조여, 겉보다 속이 긴장하게 만들어요',식상:'타고난 재능을 자꾸 밖으로 꺼내 쓰게 해, 은근히 지치게 해요',재성:'현실·바깥일 쪽으로 마음을 여러 갈래로 분산시켜 힘을 빼가요'};
const _YROLE={비겁:'같은 편이 되어 힘을 보태는',식상:'막힌 기운을 흘려보내는',재성:'현실을 야무지게 다잡는',관성:'중심을 잡아주는',인성:'북돋아 감싸 안는'};
function coreStructure(f){
  const dayEl=f.dayEl, oh=f.ohaeng||{};
  const drains=['관성','식상','재성'].map(cat=>{
    let el=''; if(cat==='관성')el=Object.keys(_KE).find(k=>_KE[k]===dayEl); if(cat==='식상')el=_GEN[dayEl]; if(cat==='재성')el=_KE[dayEl];
    return {cat,el,pct:el?(oh[el]||0):0};
  }).sort((a,b)=>b.pct-a.pct);
  const lead=drains[0];
  const l1=`<b>${esc(f.mulsang)} 같은 ${esc(f.dayMaster)}(${dayEl}${HZ[dayEl]})</b> · ${esc(f.strengthLevel)}`;
  const l2=(lead&&lead.el&&lead.pct>=25)
    ? `가장 센 기운은 <b>${lead.el}(${HZ[lead.el]}) ${lead.pct}%</b> — ${lead.cat}의 자리라, ${_DRAIN[lead.cat]}`
    : `오행이 비교적 고르게 섞여, 어느 한쪽이 크게 흔들지 않아요`;
  const yc=_ssCat(dayEl,f.yongshin);
  const l3=`그래서 <b>${f.yongshin}(${HZ[f.yongshin]})</b> 기운—${_YROLE[yc]||'중심을 받쳐주는'} 힘—으로 채워줄 때 가장 단단하고 편안해져요`;
  return `<div class="core3"><div class="core3h">${ic('compass')}<b>한눈에 보는 핵심 구조</b></div>
    <div class="c3row"><span class="c3n">1</span><div><em>지금 상태</em>${l1}</div></div>
    <div class="c3row"><span class="c3n">2</span><div><em>기운을 흔드는 것</em>${l2}</div></div>
    <div class="c3row"><span class="c3n">3</span><div><em>이렇게 살려줘요</em>${l3}</div></div></div>`;
}
// 03 첫인상 (성별 아이 1명 일러스트 + 날짜별 만세력·오행·유형)
function s03(p){
  const g=p.baby?.sex;
  const kid=(g==='여아')?'il-girl.png':'il-boy.png';
  const img=`<div class="illust kid"><img src="${IL}/${kid}" alt="아이"></div>`;
  const body=(p.dates||[]).map(f=>{const c=f.content||{};
    return `<div class="dwrap">${dHead(f)}
      <div class="page"><div class="pgno">사주 원국 · 만세력</div>${manse(f)}</div>
      <div class="page"><div class="pgno">오행 균형 &amp; 신강·신약</div>${ohaeng(f)}</div>
      <div class="card"><div class="dtype">${esc(c.type||'')}</div>${coreStructure(f)}<p class="gist">${esc(c.gist||'')}</p>
        <div class="stage"><b>유년기</b> ${esc(c.child)}</div><div class="stage"><b>소년기</b> ${esc(c.teen)}</div><div class="stage"><b>성인기</b> ${esc(c.adult)}</div></div>
      ${sparkBlock(f)}</div>`;
  }).join('');
  return section('03','이 아이의 첫인상', img+body);
}
// 04 사용설명서
function s04(p){
  const body=(p.dates||[]).map(f=>{const c=f.content||{};
    return secBlock(f, `<div class="dtype2">${esc(c.type||'')}</div><p>${esc(c.manual_body)}</p>
      <div class="watch">${ic('eye')}<b>이런 점은 살펴주세요</b> — ${esc(c.manual_watch)}</div>
      <div class="tip">${ic('tip')}<b>부모님께</b> — ${esc(c.manual_tip)}</div>`);
  }).join('');
  return section('04','우리 아이 사용설명서', body);
}
// 05 직업
function s05(p){
  const body=(p.dates||[]).map(f=>{const c=f.content||{};
    const picks=(c.career_picks||[]).map(([a,b])=>`<tr><td>${esc(a)}</td><td class="v">${esc(b)}</td></tr>`).join('');
    return secBlock(f, `<div class="ch">${esc(c.career_head||'')}</div><table class="pick">${picks}</table><p>${esc(c.career_desc)}</p>`);
  }).join('');
  return section('05','우리 아이가 꽃피울 분야는', body);
}
// 06 돈복·귀인
function s06(p){
  const body=(p.dates||[]).map(f=>{const c=f.content||{};
    let inner=`<div class="ch">${ic('coin')}${esc(c.wealth_head||'')}</div><p>${esc(c.wealth_money)}</p>`;
    const ss=f.wealthSinsal||[];
    if(ss.length) inner+='<div class="sinsals">'+ss.map(s=>`<div class="ssl"><span class="sse">${ic('spark')}</span><div><b>${esc(s.key)}(${esc(s.label)})</b> — ${esc(s.desc)}</div></div>`).join('')+'</div>';
    else inner+='<div class="sinsals"><div class="ssl"><span class="sse">'+ic('spark')+'</span><div><b>스스로 일구는 복</b> — 화려한 재물 신살에 기대기보다, 성실함과 꾸준함이 그대로 재물이 되는 결이에요. 착실히 쌓아 스스로 곳간을 채우는, 가장 단단한 부자의 결이에요.</div></div></div>';
    inner+=`<div class="tip">${ic('tip')}<b>부모님께</b> — ${esc(c.wealth_tip)}</div>`;
    return secBlock(f, inner);
  }).join('');
  return section('06','우리 아이의 돈복 · 곁을 지키는 귀인', body,
    '아이의 돈복은 ‘어떻게 관리하나’가 아니라 <b>타고난 풍요의 그릇</b>으로 봐요. 재물에 좋게 작용하는 신살로 살폈어요.');
}
// 07 부모관계 (껌딱지)
function s07(p){
  const img=`<div class="illust"><img src="${IL}/il-family.png" alt="부모와 아기"></div>`;
  const body=(p.dates||[]).map(f=>{const c=f.content||{};const cl=clingy(f,p.parents||[]);
    const rels=(f.bonds||[]).map(b=>`<div class="rel"><div class="relh">${b.who}와 <span class="reltg">${esc(b.tag)}</span></div><p>${esc(b.text)}</p></div>`).join('');
    const head = cl.who==='both'
      ? `<div class="cling">${ic('heart')}<b>엄마·아빠 둘 다 껌딱지</b></div>
         <p>이 아이에게 힘이 되는 <b>${cl.yong}(${HZ[cl.yong]}) 기운</b>을 엄마·아빠가 나란히 지녀, 두 분 모두에게 골고루 기대며 안정을 느끼는 궁합이에요.</p>`
      : `<div class="cling">${ic('heart')}<b>${cl.who} 껌딱지</b></div>
         <p>이 아이에게 힘이 되는 <b>${cl.yong}(${HZ[cl.yong]}) 기운</b>을 ${cl.who}가 일주에 더 든든히 지녀, ${cl.who} 품에서 유독 안정을 느끼고 잘 따르는 궁합이에요.</p>`;
    // 아기 → 부모 인연 (1인칭) — 두 부모 결과가 같으면 하나로 합침
    const inyL=f.inyeon||[];
    const kLab=k=>({용신보충:'꼭 필요한 기운',생조:'북돋는 별',결실:'애틋한 결실',비화조화:'닮은 결',자극:'새로운 바람',돌봄:'품 안의 아이'}[k]||'닮은 결');
    let iny='';
    if(inyL.length===2 && inyL[0].kind===inyL[1].kind){
      const x=inyL[0];
      iny=`<div class="rel iny"><div class="relh">엄마·아빠 두 분께 나는 <span class="reltg">${kLab(x.kind)}</span></div><p>${x.text.replace(/\{부모\}/g,'엄마·아빠')}</p></div>`;
    } else {
      iny=inyL.map(x=>`<div class="rel iny"><div class="relh">${x.who}에게 나는 <span class="reltg">${kLab(x.kind)}</span></div><p>${x.text.replace(/\{부모\}/g,x.who)}</p></div>`).join('');
    }
    const inyBlock=iny?`<div class="inywrap"><div class="inyh">${ic('heart')}<b>그리고 — 내가 엄마·아빠에게 주는 것</b></div>${iny}</div>`:'';
    return secBlock(f, `${head}<div class="dyn">${rels}<div class="gem">${ic('spark')}<b>특별한 인연</b> — ${esc(c.gem)}</div></div>${inyBlock}`);
  }).join('');
  return section('07','부모와 아이, 서로에게 주는 것', img+body,
    '부모가 아이를 어떻게 대하는지(껌딱지)뿐 아니라, <b>아이가 부모에게 어떤 기운을 채워주는 존재</b>인지까지 양방향으로 봤어요.');
}
// 08 작명 (날짜별 — 용신·희신이 달라 이름도 다름)
function s08(p){
  const intro=`<p style="font-size:14px;color:var(--ink2)">날짜마다 아이에게 <b>필요한 기운(용신·희신)이 달라</b>, 날짜별로 그 기운을 담은 이름을 골랐어요. 요즘 인기 있는 이름을 우선으로 담았어요.</p>`;
  const body=(p.dates||[]).map(f=>{
    const nm=f.naming||{list:[],elems:[]};
    const chips=nm.list.map(n=>`<span class="nm">${n.name} <em>${n.tag}</em>${n.pop?'<b class="pop">인기</b>':''}</span>`).join('');
    const els=nm.elems.map(e=>e+'('+HZ[e]+')').join('·');
    return secBlock(f, `<div class="ch">${ic('pen')}필요한 기운 · ${els}</div><div class="names">${chips}</div>`);
  }).join('');
  const foot=`<div class="upsell">${ic('bulb')}이름 옆 태그는 각 글자의 <b>소리 오행</b>이에요. 다른 인기 이름을 쓰고 싶다면 <b>한자(자원오행)로 기운을 보완</b>할 수도 있어요.<br>${ic('pen')}정식 작명은 <b>사주 정밀 대조 + 소리·한자 자원오행 + 획수 길흉</b>까지 종합해, 인기 이름과 우리 아이 기운을 모두 만족하는 이름을 지어드려요.</div>`;
  return section('08','아이의 균형을 돕는 기운을 담은 이름 · 작명 가이드', intro+body+foot,
    '날짜마다 필요한 기운이 달라, 날짜별로 이름을 나눠 담았어요.');
}
// 09 연운
function s09(p){
  const by=(p.dates&&p.dates[0]&&p.dates[0].birthYear)||2026;
  const ageTxt=y=>{const lo=Math.max(0,y-by-1),hi=y-by; return lo===hi?`만 ${hi}세`:`만 ${lo}~${hi}세`;};
  const body=(p.dates||[]).map(f=>{const c=f.content||{};
    const inner=`<div class="ygwrap">${yeonGraph(f)}<div class="yglg"><span>${ic('star')}크게 피어나는 해</span><span>${ic('heart')}살펴줄 해</span></div></div>
      <div class="ev bloom"><div class="evh">${ic('star')}크게 피어나는 때 — <span class="evy">${f.yeonun.peak.year}년 · ${ageTxt(f.yeonun.peak.year)} 무렵</span></div>${esc(c.bloom_good)}</div>
      <div class="ev care"><div class="evh">${ic('heart')}마음 써주면 좋은 때 — <span class="evy2">${f.yeonun.care.year}년 · ${ageTxt(f.yeonun.care.year)} 무렵</span></div>${esc(c.bloom_care)}</div>`;
    return secBlock(f, inner);
  }).join('');
  return section('09','크게 피어나는 때 · 향후 10년 연운', body,
    '앞으로 10년(2027~2036)의 기운 흐름을 그래프로 담았어요. 아이가 아직 어린 시기라, 그 나이에 맞는 결과 곁에서 도와줄 점을 함께 짚었어요.');
}
// 10 닫는 편지 · 3줄 요약
function s10(p){
  const body=(p.dates||[]).map(f=>{const c=f.content||{};const cl=clingy(f,p.parents||[]);
    const clLine = cl.who==='both'
      ? `${ic('heart')}<b>엄마·아빠 둘 다 껌딱지</b> — 두 분의 ${cl.yong}(${HZ[cl.yong]}) 기운이 함께 힘이 돼요`
      : `${ic('heart')}<b>${cl.who} 껌딱지</b> — ${cl.who}의 ${cl.yong}(${HZ[cl.yong]}) 기운이 힘이 돼요`;
    const lines=[
      `${esc(c.type||'')}`,
      `${ic('case')}${esc(c.career_head||'')}`,
      clLine,
    ].map(x=>`<div class="sumline">${x}</div>`).join('');
    return secBlock(f, lines);
  }).join('');
  const close=`<div class="card" style="text-align:center;background:linear-gradient(180deg,#fff6ec,#fff8f1)"><div class="closeheart">${ic('heart')}</div>
    <p style="font-weight:800;color:var(--deep)">어떤 날, 어떤 결로 만나든 —<br>가장 큰 기운은 부모님의 사랑이에요.</p></div>`;
  return section('10','닫는 편지 · 3줄 요약', body+close);
}

function renderReport(p){
  const cover=`<div class="coverwrap"><img class="cover" src="${IL}/il-cover.png" alt="우리 아기"><div class="ctag">${esc(p.baby?.due_from||'')} ~ ${esc(p.baby?.due_to||'')}</div><h1>우리 아기<br>사주 스케치북</h1><div class="csub">— 곧 만날 아기의 타고난 결 —</div></div>`;
  const letter=`<div class="letter"><div class="wrap"><div class="q">“아직 이름도 없는 제가,<br>어떤 결을 안고 태어날까요.”</div>
    <p>이 스케치북은 곧 만날 아기의 타고난 결을 부모님과 함께 그려보는 작은 책이에요. 정답을 정해두려는 게 아니라, ‘이런 아이일 수 있겠구나’ 하고 마음의 준비를 함께하는 시간이면 좋겠어요.</p></div></div>`;
  const toc=`<section><div class="wrap"><div class="secno">목차</div><h2>이 책에 담긴 이야기</h2><ul class="toc">
    <li>우리는 어떤 부모가 될까?</li><li>왜 이 3일일까 · 세 날짜 비교</li><li>이 아이의 첫인상</li><li>우리 아이 사용설명서</li>
    <li>우리 아이가 꽃피울 분야는</li><li>돈복 · 곁을 지키는 귀인</li><li>부모와의 관계 · 껌딱지</li><li>균형을 돕는 기운을 담은 이름</li>
    <li>크게 피어나는 때 · 향후 10년</li><li>닫는 편지 · 3줄 요약</li></ul></div></section>`;
  const disc=`<section style="border:none"><div class="wrap"><small class="note" style="text-align:center;display:block">본 리포트는 사주명리 해석에 근거한 참고 자료이며, 정해진 미래나 의학적 판단을 제공하지 않아요. 출산 시기·방법은 반드시 주치의와 상의해 주세요.</small></div></section>`;
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>우리 아기 사주 스케치북</title><style>
:root{--cream:#fff8f1;--ink:#5a4a44;--ink2:#8a7a72;--deep:#40323b;--peach:#e79a86;--lav:#b9addf;--blue:#8fb8d6;--mint:#8fd3b0;--gold:#c8992f}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;background:var(--cream);color:var(--ink);line-height:1.75}
.ic{width:1.02em;height:1.02em;display:inline-block;vertical-align:-.15em;margin-right:.4em;flex:0 0 auto;color:var(--peach)}
.ic.mute{color:var(--ink2)}
.closeheart{color:var(--peach)}.closeheart .ic{width:30px;height:30px;margin:0}
.wrap{max-width:520px;margin:0 auto;padding:0 20px}
section{padding:30px 0;border-bottom:1px solid #f0e6da}
.secno{color:var(--peach);font-weight:800;font-size:13px;letter-spacing:.05em}
h2{font-size:22px;font-weight:800;color:var(--deep);margin:4px 0 12px}
p{font-size:15px;margin:8px 0}
small.note{color:var(--ink2);font-size:12.5px;display:block;margin-bottom:10px}
.card{background:#fff;border-radius:20px;padding:18px;margin:12px 0;box-shadow:0 6px 18px rgba(160,140,120,.09)}
/* 투명 일러스트 — 배경에 자연스럽게 */
.illust{max-width:460px;margin:0 auto;padding:6px 20px 0;text-align:center}.illust img{width:82%;max-width:360px;display:block;margin:0 auto}
.illust.kid img{width:56%;max-width:230px}
.coverwrap{max-width:520px;margin:0 auto;padding:30px 20px 4px;text-align:center}
.cover{width:70%;max-width:300px;display:block;margin:0 auto 6px}
.ctag{color:var(--peach);font-weight:800;letter-spacing:2px;font-size:13px}
.coverwrap h1{font-size:31px;font-weight:900;color:var(--deep);margin:6px 0;line-height:1.3}.csub{color:var(--ink2);font-size:14px}
.letter{text-align:center;background:linear-gradient(180deg,#fdf4ef,#fff8f1);padding:40px 0 36px}
.letter .emo{font-size:40px}.letter .q{font-size:19px;color:var(--deep);font-weight:800;margin:12px 0;line-height:1.5}.letter p{color:var(--ink2)}
.toc{list-style:none;counter-reset:t}.toc li{background:#fff;border-radius:14px;padding:12px 16px;margin:8px 0;box-shadow:0 4px 12px rgba(160,140,120,.07);font-weight:700;color:var(--deep);display:flex;gap:12px;align-items:center}
.toc li:before{counter-increment:t;content:counter(t);background:var(--peach);color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex:0 0 26px}
.pcard{background:#fff;border-radius:20px;padding:18px;margin:12px 0;box-shadow:0 6px 18px rgba(160,140,120,.09);border-left:6px solid var(--lav)}.pcard.dad{border-left-color:var(--blue)}
.pcard .who{font-weight:800;color:var(--deep);font-size:16px}.pcard .pj{font-weight:600;color:var(--ink2);font-size:12px}.pcard .ju{font-size:12.5px;color:var(--gold);font-weight:700;margin:2px 0 8px}
.dwrap{margin:18px 0}.dtitle{display:flex;align-items:baseline;gap:10px;margin:6px 2px 4px}
.dtitle.bh{border-bottom:1px dashed #eee;padding-bottom:8px;margin-bottom:10px}
.dd{font-size:19px;font-weight:900;color:var(--deep)}.dj{font-size:12.5px;color:var(--gold);font-weight:700}
.page{background:linear-gradient(180deg,#fff6ec,#fff8f1);border-radius:22px;padding:20px 16px;margin:10px 0;box-shadow:0 8px 24px rgba(160,140,120,.1)}
.pgno{color:var(--peach);font-weight:800;font-size:13px;margin-bottom:10px}
.manse{width:100%;border-collapse:separate;border-spacing:6px 5px}.manse th{color:var(--ink2);font-weight:700;font-size:11.5px}
.manse td{text-align:center;background:#fff;border-radius:11px;padding:5px 1px;vertical-align:middle}
.manse td.chip{font-size:12.5px;font-weight:700;color:var(--deep);background:#f4ece2;border-radius:999px;padding:5px 1px}.manse td.tiny{font-size:11px;color:var(--ink2);line-height:1.5}
.tile{border-radius:12px;padding:10px 0 6px;color:#fff}.tile b{font-size:34px;font-weight:800;display:block;line-height:1}.tile span{font-size:10px;opacity:.9}
.penta{width:100%;max-width:330px;display:block;margin:4px auto}
.balance{margin-top:6px}.brow{display:flex;align-items:center;gap:9px;margin:10px 0}.blab{flex:0 0 140px;font-size:14px}.blab b{font-size:18px;font-weight:800}
.bg{display:inline-block;font-size:10.5px;font-weight:800;color:#fff;border-radius:999px;padding:2px 7px;margin-left:2px}
.bg.ilgan{background:var(--lav)}.bg.yong{background:var(--mint);color:#1e6a47}.bg.hee{background:var(--blue)}.bg.gi{background:var(--peach)}
.btrack{flex:1;height:11px;background:#f0e7da;border-radius:999px;overflow:hidden}.bfill{height:100%;border-radius:999px}.bpct{flex:0 0 42px;text-align:right;font-weight:800;font-size:13px;color:var(--deep)}
.spec{margin:20px 0 4px}.speclabel{margin-bottom:30px}.speclabel .lv{background:#ffe6dc;color:#c2604a;font-weight:800;border-radius:999px;padding:5px 14px;font-size:15px}
.track{position:relative;height:5px;background:#efe4d5;border-radius:999px;margin:38px 6px 6px}
.tick{position:absolute;top:-2px;transform:translateX(-50%)}.tick i{display:block;width:9px;height:9px;border-radius:50%;background:#e0d5c4;margin:0 auto}
.tk{position:absolute;top:15px;left:50%;transform:translateX(-50%);font-size:10px;color:var(--ink2);white-space:nowrap}
.tick.on i{background:var(--peach);width:15px;height:15px;position:relative;top:-3px;box-shadow:0 0 0 5px rgba(231,154,134,.22)}.tick.on .tk{color:var(--peach);font-weight:800;font-size:11.5px}
.me{position:absolute;top:-32px;transform:translateX(-50%);background:var(--peach);color:#fff;font-weight:800;font-size:12px;border-radius:8px;padding:2px 9px}.me:after{content:"";position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:var(--peach)}
.dtype{font-size:16px;font-weight:800;color:var(--deep);margin-bottom:4px}.dtype2{font-size:16px;font-weight:800;color:var(--deep);margin-bottom:6px}.gist{font-size:14.5px}
.stage{font-size:13.5px;color:var(--ink2);background:#faf5ee;border-radius:10px;padding:8px 12px;margin:6px 0}.stage b{color:var(--deep)}
.bhead{margin-bottom:10px}
.tip{background:#fff4ec;border-radius:12px;padding:12px 14px;font-size:14px;margin-top:8px}
.ptrait{font-size:13.5px;color:var(--ink2);margin:4px 0 8px;line-height:1.7}
.watch{background:#f4f7f4;border-radius:12px;padding:12px 14px;font-size:14px;margin-top:8px}
.sinsals{margin:10px 0 4px}.ssl{display:flex;gap:10px;align-items:flex-start;background:linear-gradient(180deg,#fff8ef,#fdf3f6);border:1px solid #f1e4d6;border-radius:12px;padding:11px 13px;margin-top:8px}.ssl .sse{font-size:22px;line-height:1.2;flex:0 0 auto}.ssl div{font-size:13px;line-height:1.6}.ssl b{color:var(--deep)}
.ch{font-weight:800;color:var(--gold);font-size:14px;margin-bottom:4px}
.pick{width:100%;border-collapse:collapse;margin:2px 0 8px}.pick td{padding:9px 4px;border-bottom:1px solid #f2ece3;font-size:14px}.pick td.v{text-align:right;font-weight:800;white-space:nowrap;font-size:13px}
.cling{font-size:17px;font-weight:800;color:var(--deep);margin-bottom:6px}
.dyn{background:#f4f2fb;border-radius:12px;padding:12px 14px;margin-top:10px}
.rel{background:#fff;border-radius:12px;padding:11px 13px;margin-top:8px}.relh{font-weight:800;color:var(--deep);font-size:14px;display:flex;align-items:center;flex-wrap:wrap;gap:4px}.reltg{background:#f0ece0;color:#8a7a52;font-size:10.5px;font-weight:800;border-radius:999px;padding:2px 7px}.rel p{font-size:13.5px;color:var(--ink2);margin-top:4px}
.gem{background:linear-gradient(180deg,#fff6ec,#fbf1fb);border:1px solid #f0e2d6;border-radius:12px;padding:11px 13px;margin-top:8px;font-size:13px;line-height:1.6}.gem b{color:var(--deep)}
.sumline{background:#faf5ee;border-radius:12px;padding:11px 14px;margin:6px 0;font-size:14.5px}
.names{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.nm{background:#fff4ec;border:1px solid #f0dcc8;border-radius:10px;padding:8px 12px;font-size:14px;font-weight:700;color:var(--deep);position:relative}.nm em{font-size:11px;color:var(--ink2);font-weight:600;font-style:normal;margin-left:4px}
.pop{background:#ffe0d2;color:#c2604a;font-size:10px;font-weight:800;border-radius:6px;padding:1px 6px;margin-left:5px}
.nrow{font-size:13.5px;color:var(--ink2);margin:7px 0}.nrow b{color:var(--deep)}
.upsell{background:linear-gradient(180deg,#fdf3ea,#fff8f1);border:1px dashed #e2c4a5;border-radius:16px;padding:15px 18px;margin-top:12px;font-size:14px;line-height:1.7}.upsell b{color:var(--deep)}
.yeon{width:100%;display:block}.ygwrap{background:#fff;border-radius:16px;padding:10px 8px 4px;margin:6px 0 10px;box-shadow:0 6px 18px rgba(160,140,120,.09)}.yglg{display:flex;justify-content:center;gap:16px;font-size:11px;color:var(--ink2);padding-bottom:4px}
.ev{border-radius:12px;padding:13px 15px;font-size:13.5px;margin-top:8px;line-height:1.65}.evh{font-weight:800;margin-bottom:4px}.evy{color:var(--gold)}.evy2{color:var(--peach)}
.ev.bloom{background:linear-gradient(180deg,#fff6ec,#fff9f2);border:1px solid #f0e0cf;color:var(--deep)}.ev.care{background:#f6f3fb;border:1px solid #e8e2f5;color:#5a4f78}
.rangebox{background:linear-gradient(180deg,#fff6ec,#fff8f1);border:1px solid #f0e0cf;border-radius:16px;padding:16px;margin-bottom:14px}.rangeh{font-weight:800;color:var(--deep);font-size:14.5px;margin-bottom:12px;line-height:1.5}.rangeh b{color:var(--peach)}
.rgrow{display:flex;align-items:center;gap:9px;margin:7px 0;font-size:13px;opacity:.5}.rgrow.on{opacity:1}
.rgd{flex:0 0 48px;font-weight:900;color:var(--deep)}.rgj{flex:0 0 40px;color:var(--ink2);font-size:12px}
.rgtrack{flex:1;height:13px;background:#f0e7da;border-radius:999px;overflow:hidden}.rgfill{height:100%;background:#d8cdbb;border-radius:999px}.rgrow.on .rgfill{background:linear-gradient(90deg,var(--peach),var(--gold))}
.rgs{flex:0 0 46px;text-align:right;font-weight:800;color:var(--deep)}.rgnote{font-size:11.5px;color:var(--ink2);margin-top:10px;line-height:1.6}
.whybox{background:#fff;border:1px solid #eee6db;border-radius:16px;padding:15px 17px;margin-bottom:12px}.whyh{font-weight:800;color:var(--deep);font-size:14.5px;margin-bottom:6px}.whybox p{font-size:13.5px;margin:8px 0;color:var(--ink)}.whybox b{color:var(--deep)}
.frame{background:#fff;border:1px solid #eee6db;border-radius:16px;padding:16px;margin-bottom:12px}.frameh{font-weight:800;color:var(--deep);font-size:15px;margin-bottom:10px}.frameh b{color:var(--peach)}
.framelist{display:grid;grid-template-columns:1fr 1fr;gap:8px}.fi{display:flex;gap:9px;align-items:center;background:#fbf5ee;border-radius:12px;padding:9px 11px}.fi .fn{flex:0 0 22px;height:22px;border-radius:50%;background:var(--peach);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}.fi b{display:block;font-size:13px;color:var(--deep)}.fi em{font-size:10.5px;color:var(--ink2);font-style:normal}
.framenote{font-size:12px;color:var(--ink2);margin-top:10px;line-height:1.6}.framenote b{color:var(--deep)}
.flow{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;background:#fbf5ee;border-radius:14px;padding:12px 14px;margin-bottom:12px;font-size:12px;color:var(--ink2);font-weight:700}.flow span{white-space:nowrap}
.radar{width:100%;max-width:330px;display:block;margin:6px auto 2px}
.vs{font-size:13px;line-height:1.6;color:var(--ink2);background:#fdf6ee;border-radius:12px;padding:11px 14px;margin-top:8px;text-align:left}.vs b{color:var(--deep)}.vsit{margin-top:7px}.vsit:first-of-type{margin-top:6px}
/* 시주 곡선 */
.hourbox{background:#fbf5ee;border-radius:12px;padding:12px 12px 10px;margin-top:8px;text-align:left}.hbh{font-size:13px;color:var(--deep);margin-bottom:10px}.hbh b{font-weight:800}
.hbars{display:flex;align-items:flex-end;gap:3px;min-height:66px;padding:16px 2px 0}
.hb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px}
.hbs{font-size:8.5px;color:#b6a999;font-weight:700}.hb.on .hbs{color:var(--gold)}
.hbar{width:100%;max-width:16px;background:#e4d8c6;border-radius:4px}.hb.on .hbar{background:linear-gradient(180deg,var(--gold),var(--peach))}
.hbl{font-size:9.5px;color:var(--ink2)}.hb.on .hbl{color:var(--deep);font-weight:800}
.hbnote{font-size:11.5px;color:var(--ink2);line-height:1.6;margin-top:13px}.hbnote b{color:var(--deep)}
/* 아기→부모 인연 */
.inywrap{background:linear-gradient(180deg,#fff6ec,#fbf1fb);border:1px solid #f0e2d6;border-radius:14px;padding:14px 16px;margin-top:12px}.inyh{font-size:14px;color:var(--deep);margin-bottom:8px}.inyh b{font-weight:800}
.rel.iny{background:#fff}.rel.iny p{color:var(--ink)}
/* 신살 반짝임 */
.sparkcard{background:linear-gradient(180deg,#fffaf3,#fdf3f7)}.sparkcard .bh2{display:flex;align-items:center}
.sparkit{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.sparkit:first-of-type{border-top:none;padding-top:0}
.sph{font-size:14px;color:var(--ink2);line-height:1.5;margin-bottom:5px}.sph b{color:var(--deep)}
.sparkit p{font-size:14px;line-height:1.7;color:var(--ink);margin:4px 0}
.hap{font-size:12.5px;color:var(--ink2);background:#fbf5ee;border-radius:11px;padding:9px 12px;margin-top:8px;text-align:left}
.cmp{background:#fff;border-radius:18px;padding:16px;margin:10px 0;box-shadow:0 6px 18px rgba(160,140,120,.09)}.cmp.col{display:block;text-align:center}
.psm{width:100px;margin:0 auto}.cmph{margin-top:2px}.cmph b{font-size:17px;color:var(--deep);font-weight:900}.cmpj{font-size:12px;color:var(--gold);font-weight:700}
.crown{display:inline-block;background:#fff0d8;color:#c8992f;font-size:10.5px;font-weight:800;border-radius:999px;padding:2px 8px;margin-top:4px}
.cmplab{font-size:13px;color:var(--ink2);margin:4px 0 10px}
.sc3{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink2);margin:6px 0;text-align:left}.sc3 .sl{flex:0 0 76px}.sc3 .st{flex:1;height:8px;background:#f0e7da;border-radius:999px;overflow:hidden}.sc3 .sf{height:100%;border-radius:999px}.sc3 .sf.a{background:linear-gradient(90deg,var(--gold),var(--peach))}.sc3 .sf.b{background:var(--mint)}.sc3 .sf.c{background:var(--lav)}.sc3 b{flex:0 0 30px;text-align:right;color:var(--deep)}
.sgband{font-size:12px;color:var(--ink2);background:#f6f3fb;border-radius:10px;padding:8px 11px;margin-top:8px;text-align:left}.sgband b{color:var(--deep)}
.lvpct{font-size:11px;color:var(--ink2);margin-left:6px}
.bandshade{position:absolute;top:-4px;height:13px;background:rgba(185,173,223,.28);border-radius:999px}
.bandnote{font-size:12px;color:var(--ink2);background:#f6f3fb;border-radius:10px;padding:9px 12px;margin-top:20px}.bandnote b{color:var(--deep)}
.yongwhy{font-size:12.5px;color:var(--ink2);background:#fdf6ee;border-radius:10px;padding:9px 12px;margin-top:6px}.yongwhy b{color:var(--deep)}
/* 섹션1 두 분 공통점 */
.pcommon{background:linear-gradient(180deg,#fff6ec,#fbf1fb);border:1px solid #f0e2d6;border-radius:14px;padding:13px 15px;margin-top:6px;font-size:13.5px;line-height:1.7;color:var(--ink)}.pcommon b{color:var(--deep)}
/* 핵심 구조 3줄 */
.core3{background:linear-gradient(180deg,#fff9f1,#fdf4ef);border:1px solid #f0e4d4;border-radius:14px;padding:13px 15px;margin:4px 0 12px}
.core3h{font-size:13.5px;color:var(--deep);margin-bottom:8px}.core3h b{font-weight:800}
.c3row{display:flex;gap:10px;align-items:flex-start;margin:8px 0}
.c3n{flex:0 0 20px;height:20px;border-radius:50%;background:var(--peach);color:#fff;font-size:11.5px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:2px}
.c3row>div{flex:1;font-size:13.5px;line-height:1.6;color:var(--ink)}.c3row em{display:block;font-style:normal;font-size:11px;font-weight:800;color:var(--peach);margin-bottom:1px}.c3row b{color:var(--deep)}
/* 신살 3단 */
.sparknote{font-size:12px;color:var(--ink2);line-height:1.6;background:#fff;border-radius:10px;padding:9px 12px;margin:6px 0 4px}.sparknote b{color:var(--deep)}
.s3{font-size:13.5px;line-height:1.65;color:var(--ink);border-radius:10px;padding:8px 11px;margin:5px 0}.s3 b{color:var(--deep);margin-right:3px}
.s3.good{background:#f3f8f3}.s3.good b{color:#3f8f5f}
.s3.shadow{background:#faf5ee}.s3.shadow b{color:#c08a3a}
.s3.grow{background:#fff4ec}.s3.grow b{color:var(--peach)}
</style></head><body>
${cover}${letter}${toc}
${s01(p)}${s02(p)}${s03(p)}${s04(p)}${s05(p)}${s06(p)}${s07(p)}${s08(p)}${s09(p)}${s10(p)}
${disc}
</body></html>`;
}
module.exports={ renderReport };
