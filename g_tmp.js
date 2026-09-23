const { selectBirthDates } = require('./lib/birth-engine.js');
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
let hc=0,bc=0,blk=0,n=0;
for(let i=0;i<600;i++){
  let sel; try{ sel=selectBirthDates({
    mom:{y:rnd(1988,1998),m:rnd(1,12),d:rnd(1,28),hh:rnd(0,23)},
    dad:{y:rnd(1986,1998),m:rnd(1,12),d:rnd(1,28),hh:rnd(0,23)},
    dueFrom:{y:2026,m:11,d:5}, dueTo:{y:2026,m:11,d:11}}); }catch(e){ continue; }
  const [A,B]=sel.parentAn||[]; if(!A||!B) continue; n++;
  if(A.arche===B.arche) hc++;
  if(A.love===B.love) bc++;
  if(A.arche===B.arche && A.love===B.love) blk++;
}
console.log(`n=${n}  헤드라인 충돌 ${(hc/n*100).toFixed(1)}%  본문 충돌 ${(bc/n*100).toFixed(1)}%  둘 다 ${(blk/n*100).toFixed(2)}%`);
