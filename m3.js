const { parentChart, analyzeParent } = require('./lib/birth-engine.js');
const P=(y,m,d,h)=>{try{return analyzeParent(parentChart(y,m,d,h,0));}catch(e){return null;}};
const first=t=>String(t||'').split(/(?<=\.)\s+/)[0];
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
let hc=0,f1=0,blk=0,n=0; const H=new Set(),F=new Set(),B=new Set();
for(let i=0;i<1500;i++){
  const A=P(rnd(1988,1998),rnd(1,12),rnd(1,28),rnd(0,23));
  const B2=P(rnd(1986,1998),rnd(1,12),rnd(1,28),rnd(0,23));
  if(!A||!B2||!A.arche) continue; n++;
  const ba=A.arche+'|'+A.love, bb=B2.arche+'|'+B2.love;
  H.add(A.arche);H.add(B2.arche);F.add(first(A.love));F.add(first(B2.love));B.add(ba);B.add(bb);
  if(A.arche===B2.arche) hc++;
  if(first(A.love)===first(B2.love)) f1++;
  if(ba===bb) blk++;
}
console.log(`헤드라인 충돌  ${(hc/n*100).toFixed(1)}%  (고유 ${H.size}종)`);
console.log(`첫 문장 충돌   ${(f1/n*100).toFixed(1)}%  (고유 ${F.size}종)`);
console.log(`블록 전체 충돌 ${(blk/n*100).toFixed(2)}%  (고유 ${B.size}종)`);
