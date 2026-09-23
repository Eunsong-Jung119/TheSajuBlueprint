const { parentChart, analyzeParent, selectBirthDates } = require('./lib/birth-engine.js');
const TG='갑을병정무기경신임계';
function find(pillar){
  for(let y=1985;y<=2000;y++) for(let m=1;m<=12;m++) for(let d=1;d<=28;d++){
    const pc=parentChart(y,m,d,12,0);
    if(TG[pc.dayTG]+pc.dayBranch===pillar){
      const a=analyzeParent(pc);
      if(a.sipseongTop==='재성' && a.branchSipseong10==='편재' && a.sipseongSub==='인성') return {y,m,d,hh:12};
    }
  } return null;
}
const mom=find('경인'), dad=find('병신');
const sel=selectBirthDates({mom,dad,dueFrom:{y:2026,m:9,d:1},dueTo:{y:2026,m:9,d:5}});
sel.parentAn.forEach(a=>{
  console.log(`${a.who} ${a.dayPillar} · ${a.dayEl} · ${a.sipseongTop} · 일지 ${a.branchSipseong10} · 부 ${a.sipseongSub} · ${a.level}`);
  console.log(`  ${a.arche}`);
  console.log(`  ${a.love}\n`);
});
console.log('본문 동일?', sel.parentAn[0].love===sel.parentAn[1].love ? '예 ❌' : '아니오 ✅');
