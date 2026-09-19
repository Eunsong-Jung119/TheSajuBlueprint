// 날짜별 '캐릭터 축' 결정론적 배정.
//
// 왜 필요한가: 세 날짜는 각각 별도 GPT 호출이라 서로를 못 본다. 프롬프트로 "겹치지 마라"고
// 부탁해도 12/26 "사람을 모으는 아이" / 12/25 "관계를 엮어가는 아이"처럼 같은 축이 나왔다.
// → 축을 엔진에서 먼저 못박아 세 날짜에 하나씩 배정하고, GPT에는 "이 축으로만 써라"로 준다.
// 선택 가이드(섹션2)와 char_line(섹션3)이 같은 출처에서 나오므로 둘이 어긋날 수 없다.

const SS10_CAT = { 비견:'비겁', 겁재:'비겁', 식신:'식상', 상관:'식상', 편재:'재성', 정재:'재성',
                   편관:'관성', 정관:'관성', 편인:'인성', 정인:'인성' };
const LV = ['태약', '신약', '중화신약', '중화신강', '신강'];

// 원국 6글자의 십성 카테고리 비중(0~1). 격국(월령 십성)에 가중을 더 준다.
function ssMix(f) {
  const m = { 비겁:0, 식상:0, 재성:0, 관성:0, 인성:0 };
  let n = 0;
  (f.manseryeok || []).forEach(c => {
    [c.godGan, c.godZhi].forEach(g => { const k = SS10_CAT[g]; if (k) { m[k]++; n++; } });
  });
  const star = f.eval && f.eval.gyeok && SS10_CAT[f.eval.gyeok.star];
  if (star) { m[star] += 1.5; n += 1.5; }
  if (!n) return m;
  Object.keys(m).forEach(k => { m[k] = m[k] / n; });
  return m;
}
const hasSin = (f, name) => (f.sinsalChild || []).some(s => String(s.name || '').includes(name)) ? 1 : 0;
const lvIdx = f => LV.indexOf(f.strengthLevel);

// ── 축 7종 ──
// wish : 선택 가이드 좌변 (부모의 바람)
// tail : 선택 가이드 설명
// axis : GPT에게 주는 축 정의 — char_line은 이걸 다른 말로 풀어 쓴 것이어야 함
// play/friend/work/money/parent : 각 섹션에서 이 축이 어떻게 드러나야 하는지 (동어반복 방지용 힌트)
const AXES = [
  { key:'social',
    wish:'사람들과 잘 어울리는 아이',
    tail:'낯선 자리에서도 먼저 말을 붙이고, 친구들 사이에서 기운을 얻어 오는 결이에요.',
    axis:'사람들 사이에 먼저 다리를 놓는 아이 — 무리를 이끄는 쪽이 아니라, 서로를 이어 붙이고 분위기를 풀어주는 쪽',
    play:'혼자 놀다가도 곁에 누가 오면 놀이를 바꿔 같이 하게 만듦',
    friend:'무리의 리더는 아닌데 그 애가 빠지면 모임이 어색해지는 자리',
    work:'사람과 사람, 부서와 부서 사이를 잇는 일',
    money:'인연이 그대로 기회가 되어 돈이 사람을 타고 들어옴',
    parent:'부모에게 바깥 이야기를 물어다 나르는 아이',
    s:(f,m)=> m.식상*3 + m.재성*2 + hasSin(f,'도화')*1.6 + hasSin(f,'역마')*1.1 },

  { key:'focus',
    wish:'하나에 깊이 파고드는 아이',
    tail:'좋아하는 게 생기면 조용히 오래 붙잡고 늘어지는, 몰입으로 크는 결이에요.',
    axis:'한번 빠지면 끝까지 파고드는 아이 — 넓게 벌이기보다 하나를 깊게 파는 쪽',
    play:'같은 놀이를 며칠씩 반복하며 조금씩 정교하게 만듦',
    friend:'친구는 적지만 그 몇 명과는 아주 깊게',
    work:'전문성이 누적되는 일, 오래 해야 실력이 드러나는 분야',
    money:'한 우물이 깊어지면서 값이 붙는 구조',
    parent:'몰입을 끊지 않고 지켜봐 주는 사람이 부모의 자리',
    s:(f,m)=> m.인성*3 + hasSin(f,'화개')*1.8 + hasSin(f,'문창')*1.5 + hasSin(f,'학당')*1.5 },

  { key:'lead',
    wish:'앞에 나서서 이끄는 아이',
    tail:'무리 안에서 자연스럽게 앞자리에 서고, 정하면 미루지 않는 결이에요.',
    axis:'먼저 결정하고 앞장서는 아이 — 어울리는 쪽이 아니라, 방향을 정하고 끌고 가는 쪽',
    play:'놀이 규칙을 자기가 정하고 역할을 나눠줌',
    friend:'무리의 결정권을 자연스럽게 쥐는 자리',
    work:'책임을 지고 판단을 내리는 자리',
    money:'스스로 판을 벌여 버는 쪽',
    parent:'부모가 정답을 내리면 반발, 선택지를 주면 순해짐',
    s:(f,m)=> m.비겁*3 + hasSin(f,'장성')*1.8 + hasSin(f,'양인')*1.4 + hasSin(f,'괴강')*1.4 + (lvIdx(f)>=3?0.8:0) },

  { key:'order',
    wish:'반듯하고 믿음직한 아이',
    tail:'약속과 순서를 스스로 지켜서, 어른들 눈에 유난히 안심되는 결이에요.',
    axis:'제 손으로 질서를 지키는 아이 — 시켜서가 아니라 스스로 순서와 약속을 챙기는 쪽',
    play:'정해진 순서대로 놀고, 규칙이 흐트러지면 먼저 불편해함',
    friend:'믿고 맡길 수 있는 아이로 통함, 약속 어기는 친구에 유독 예민',
    work:'신뢰와 정확함이 곧 실력이 되는 일',
    money:'새는 돈이 없어 차곡차곡 쌓이는 쪽',
    parent:'기준을 흔들지 않는 것이 부모의 역할',
    s:(f,m)=> m.관성*3 + ((f.eval && f.eval.stages && f.eval.stages.structure) || 0) / 40 },

  { key:'creative',
    wish:'자기만의 세계가 뚜렷한 아이',
    tail:'남이 안 보는 각도에서 이야기를 만들고, 제 방식대로 풀어내는 결이에요.',
    axis:'제 방식대로 새로 만들어내는 아이 — 있는 걸 잘하는 쪽이 아니라, 없던 걸 지어내는 쪽',
    play:'주어진 장난감을 원래 용도와 다르게 씀, 사연을 붙여 놀이를 지어냄',
    friend:'무리에 섞이기보다 자기 세계를 보여주고 사람을 끌어옴',
    work:'정답이 없는 일, 만들어내야 하는 일',
    money:'남들이 안 하는 방식에서 값이 나옴',
    parent:'엉뚱함을 교정하지 않고 첫 관객이 되어주는 것',
    s:(f)=>{ const st=(f.eval && f.eval.gyeok && f.eval.gyeok.star) || '';
             return (st==='상관'?3:0) + (st==='편인'?2.6:0) + hasSin(f,'화개')*1.5 + hasSin(f,'홍염')*1.2; } },

  { key:'gentle',
    wish:'다정하고 마음이 순한 아이',
    tail:'곁의 기분을 먼저 살피고, 부딪히기보다 품는 쪽을 고르는 결이에요.',
    axis:'곁의 마음을 먼저 읽는 아이 — 나서는 쪽이 아니라, 알아채고 맞춰주는 쪽',
    play:'같이 노는 친구 표정을 살피며 놀이를 바꿈',
    friend:'다툼을 못 견뎌 먼저 물러서고, 속상한 친구 옆에 남아 있는 아이',
    work:'사람 마음을 다루는 일, 돌보고 듣는 일',
    money:'크게 벌기보다 잃지 않게 지키는 쪽',
    parent:'참느라 넘긴 제 마음을 부모가 꺼내 물어봐 줘야 함',
    s:(f,m)=> m.인성*1.6 + (lvIdx(f)<=1?1.8:0) + (((f.ohaeng||{}).토||0) + ((f.ohaeng||{}).수||0)) / 40 },

  { key:'money',
    wish:'현실 감각이 야무진 아이',
    tail:'제 것을 챙길 줄 알고, 손해 보지 않게 셈이 빠른 결이에요.',
    axis:'수를 먼저 헤아리는 아이 — 감정보다 실익과 현실을 먼저 보는 쪽',
    play:'교환·거래가 들어간 놀이를 좋아하고 제 몫을 분명히 함',
    friend:'손해 보는 관계를 오래 끌지 않음',
    work:'숫자와 성과가 바로 보이는 일',
    money:'어릴 때부터 제 돈 개념이 분명함',
    parent:'용돈과 약속을 흐지부지하지 않는 것이 중요',
    s:(f,m)=> m.재성*3 + (f.wealthSinsal||[]).length*0.7 },
];

// 날짜 × 축 점수표 → 한 날짜에 하나씩, 겹치지 않게 배정.
// ※ 절대점수로 고르면 척도가 큰 축(관성 등)만 계속 뽑히므로 후보끼리의 '상대 우위'로 정규화한다.
function assignAxes(facts) {
  if (!facts || !facts.length) return [];
  const raw = facts.map(f => { const m = ssMix(f); return AXES.map(a => a.s(f, m) || 0); });
  const cells = [];
  AXES.forEach((_, ai) => {
    const col = raw.map(r => r[ai]);
    const mu = col.reduce((x, y) => x + y, 0) / col.length;
    const sd = Math.sqrt(col.reduce((x, y) => x + (y - mu) * (y - mu), 0) / col.length) || 1;
    facts.forEach((_, di) => cells.push({ di, ai, v: (raw[di][ai] - mu) / sd + raw[di][ai] * 0.01 }));
  });
  cells.sort((x, y) => y.v - x.v);
  const usedD = new Set(), usedA = new Set(), out = [];
  for (const c of cells) {
    if (usedD.has(c.di) || usedA.has(c.ai)) continue;
    usedD.add(c.di); usedA.add(c.ai); out.push(c);
    if (out.length === facts.length) break;
  }
  facts.forEach((_, di) => {                                   // 못 채운 날짜는 남은 축 아무거나
    if (usedD.has(di)) return;
    const ai = AXES.findIndex((_, i) => !usedA.has(i));
    if (ai >= 0) { usedA.add(ai); usedD.add(di); out.push({ di, ai, v: 0 }); }
  });
  const res = [];
  out.forEach(c => { res[c.di] = AXES[c.ai]; });
  return res;
}

module.exports = { AXES, assignAxes };
