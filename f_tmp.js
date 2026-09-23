const { parentChart, analyzeParent } = require('./lib/birth-engine.js');
const TG='갑을병정무기경신임계';
function find(pillar){
  for(let y=1985;y<=2000;y++) for(let m=1;m<=12;m++) for(let d=1;d<=28;d++){
    const pc=parentChart(y,m,d,12,0);
    if(TG[pc.dayTG]+pc.dayBranch===pillar){
      const a=analyzeParent(pc);
      if(a.sipseongTop==='재성' && a.branchSipseong10==='편재') return [y,m,d];
    }
  } return null;
}
[['엄마','경인'],['아빠','병신']].forEach(([w,pil])=>{
  const b=find(pil); if(!b){console.log(w,'못찾음');return;}
  const a=analyzeParent(parentChart(b[0],b[1],b[2],12,0));
  console.log(`${w} ${a.dayPillar} · ${a.dayEl} · ${a.sipseongTop} 발달 · 일지 ${a.branchSipseong10} · 부 ${a.sipseongSub}`);
  console.log(`  ${a.arche}`);
  console.log(`  ${a.love}\n`);
});
