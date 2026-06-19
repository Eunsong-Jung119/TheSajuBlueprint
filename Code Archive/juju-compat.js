const OpenAI = require('openai');
const {
  calcSaju, buildChartSummary, localToKST,
  calcSipseongV3, calcSinsal, calcHapChungV2,
  calcYongshin, analyzeSpouseGung, buildLoveContext,
  calcStrengthScore, calcRelationalStructure
} = require('../lib/saju-engine');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function calcFullChart(birth) {
  try {
    const tz = 'America/New_York';
    const localDateStr = birth.date + 'T' + (birth.time || '12:00') + ':00';
    const kstDate = localToKST(localDateStr, tz);
    const { year, month, day, hour, minute } = kstDate;

    const saju = calcSaju(year, month, day, hour, minute, true, 126.978);
    const chartSummary = buildChartSummary(saju, birth);
    const sipseong    = calcSipseongV3(saju.pillars, saju.dayTG);
    const ss          = sipseong.summary;
    const sinsal      = calcSinsal(saju.pillars);
    const sinsalStr   = sinsal.length ? sinsal.map(s => s.nameKo + '(' + s.intensity + ')').join(', ') : 'None';
    const hapchung    = calcHapChungV2(saju.pillars);
    const hc          = hapchung.summary;
    const yongshin    = calcYongshin(saju);
    const spouseGung  = analyzeSpouseGung(saju.pillars, saju.dayTG, birth.gender);
    const strength    = calcStrengthScore(saju.pillars, saju.dayTG);
    const loveCtx     = buildLoveContext(saju.pillars, saju.dayTG, strength, sipseong, hapchung, sinsal, saju.season);
    const relStruct   = calcRelationalStructure(saju.pillars, saju.dayTG, strength, sipseong, hapchung);

    return { birth, saju, chartSummary, ss, sinsalStr, hc, yongshin, spouseGung, strength, loveCtx, relStruct };
  } catch(e) {
    console.error('calcFullChart error:', e.message);
    return { error: e.message, birth };
  }
}

const ELEM_MAP = {
  // 한자
  '甲':'Wood','乙':'Wood','丙':'Fire','丁':'Fire','戊':'Earth',
  '己':'Earth','庚':'Metal','辛':'Metal','壬':'Water','癸':'Water',
  // 숫자 인덱스 (saju-engine 내부 표현)
  0:'Wood', 1:'Wood', 2:'Fire', 3:'Fire', 4:'Earth',
  5:'Earth', 6:'Metal', 7:'Metal', 8:'Water', 9:'Water',
  '0':'Wood','1':'Wood','2':'Fire','3':'Fire','4':'Earth',
  '5':'Earth','6':'Metal','7':'Metal','8':'Water','9':'Water',
};
const GENERATES = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
const CONTROLS  = { Wood:'Earth', Earth:'Water', Water:'Fire', Fire:'Metal', Metal:'Wood' };

function buildChartBlock(c) {
  const { birth, chartSummary, ss, sinsalStr, hc, yongshin, spouseGung, strength, loveCtx, relStruct } = c;
  const strengthLabel = strength?.total > 50 ? 'Strong (신강)' : 'Weak (신약)';
  return `
[${birth.name || 'Person'} · ${birth.gender} · ${birth.date} ${birth.time || 'time unknown'}]
Four Pillars: ${chartSummary.fourPillars}
Day Master: ${chartSummary.dayMasterStr} · ${strengthLabel}
Elements: ${chartSummary.elemStr}
Dominant: ${chartSummary.dominant} | Missing: ${chartSummary.missing?.join(', ') || 'None'}
Favorable element: ${yongshin?.yongshin || '—'} | Conflict element: ${yongshin?.gishin || '—'}
Ten Stars — Top: ${ss?.top3Str || '—'} | Wealth: ${ss?.wealthStr || '—'} | Authority: ${ss?.gwanStr || '—'} | Day Palace: ${ss?.dayPalaceStr || '—'}
Special Stars: ${sinsalStr}
Clashes in chart: ${hc?.clashStr || 'None'} | Harmonies: ${hc?.combineStr || 'None'}
Spouse Palace: ${spouseGung?.desc || '—'} | Instability: ${hc?.spouseStr || '—'}
Love timing — Attraction years: ${loveCtx?.timing?.passionYears?.slice(0,4).join(', ') || '—'} | Commitment window: ${loveCtx?.timing?.commitWindow || '—'}
Relational structure — Attraction: ${relStruct?.attractionIntensity || '—'} | Stability: ${relStruct?.intimateAxisStability || '—'} | Volatility: ${relStruct?.relationalVolatility || '—'} | Commitment: ${relStruct?.commitmentReadiness || '—'}
Love pattern: ${loveCtx?.spouseScore?.factors?.join(', ') || '—'}`.trim();
}

function buildCrossAnalysis(c1, c2) {
  const p1 = c1.saju?.pillars || [];
  const p2 = c2.saju?.pillars || [];

  // 지지 인덱스: 0=子 1=丑 2=寅 3=卯 4=辰 5=午 6=未 7=申 8=酉 9=戌 10=亥 11=巳
  const CLASH   = [[0,5],[1,6],[2,7],[3,8],[4,9],[11,10]];
  const COMBINE = [[0,1],[2,10],[3,9],[4,8],[11,7],[5,6]];
  // 형(刑): 寅巳申(2,11,7) 丑戌未(1,9,6) 子卯(0,3) 辰午酉亥 자형(4,5,8,10)
  const XING = [[2,11],[2,7],[11,7],[1,9],[1,6],[9,6],[0,3]];
  const N = {0:'子',1:'丑',2:'寅',3:'卯',4:'辰',5:'午',6:'未',7:'申',8:'酉',9:'戌',10:'亥',11:'巳'};
  const names = ['Year','Month','Day','Hour'];
  const clashes = [], combines = [], xings = [];
  p1.forEach((a,i) => p2.forEach((b,j) => {
    const [b1,b2] = [a[1], b[1]];
    if (CLASH.some(([x,y]) => (x===b1&&y===b2)||(x===b2&&y===b1)))
      clashes.push(`${c1.birth.name} ${names[i]}(${N[b1]||b1}) ↔ ${c2.birth.name} ${names[j]}(${N[b2]||b2}) CLASH`);
    if (COMBINE.some(([x,y]) => (x===b1&&y===b2)||(x===b2&&y===b1)))
      combines.push(`${c1.birth.name} ${names[i]}(${N[b1]||b1}) ↔ ${c2.birth.name} ${names[j]}(${N[b2]||b2}) COMBINE`);
    if (XING.some(([x,y]) => (x===b1&&y===b2)||(x===b2&&y===b1)))
      xings.push(`${c1.birth.name} ${names[i]}(${N[b1]||b1}) ↔ ${c2.birth.name} ${names[j]}(${N[b2]||b2}) XING(형-friction)`);
  }));

  const raw1 = c1.saju?.dayTG;
  const raw2 = c2.saju?.dayTG;
  const e1 = ELEM_MAP[raw1] || '—';
  const e2 = ELEM_MAP[raw2] || '—';

  let dmRel = 'Same element — peer dynamic (comfort but no tension)';
  if (e1 === '—' || e2 === '—') {
    // dayTG 못 읽으면 chartSummary.dayMasterStr에서 파싱 시도
    const dm1 = c1.chartSummary?.dayMasterStr || '';
    const dm2 = c2.chartSummary?.dayMasterStr || '';
    console.log(`[DEBUG dayMasterStr] ${c1.birth.name}: "${dm1}" | ${c2.birth.name}: "${dm2}"`);
    // dayMasterStr 예: "Yin Wood (乙, Yi)" → 한자 추출
    const extractChar = (str) => {
      const match = str.match(/[(（]([甲乙丙丁戊己庚辛壬癸])/);
      return match ? match[1] : null;
    };
    const char1 = extractChar(dm1);
    const char2 = extractChar(dm2);
    const fe1 = char1 ? (ELEM_MAP[char1] || '—') : '—';
    const fe2 = char2 ? (ELEM_MAP[char2] || '—') : '—';
    console.log(`[DEBUG fallback] ${c1.birth.name}: ${char1}→${fe1} | ${c2.birth.name}: ${char2}→${fe2}`);

    if (fe1 !== '—' && fe2 !== '—') {
      if (GENERATES[fe1] === fe2) dmRel = `${c1.birth.name}(${fe1}) nurtures ${c2.birth.name}(${fe2}) — giver/receiver dynamic`;
      else if (GENERATES[fe2] === fe1) dmRel = `${c2.birth.name}(${fe2}) nurtures ${c1.birth.name}(${fe1}) — giver/receiver dynamic`;
      else if (CONTROLS[fe1] === fe2) dmRel = `${c1.birth.name}(${fe1}) pressures ${c2.birth.name}(${fe2}) — dominance dynamic, initial spark but long-term strain`;
      else if (CONTROLS[fe2] === fe1) dmRel = `${c2.birth.name}(${fe2}) pressures ${c1.birth.name}(${fe1}) — dominance dynamic, initial spark but long-term strain`;
      else if (fe1 !== fe2) dmRel = `${fe1} and ${fe2} — neutral independent energies`;
    }
  } else {
    if (GENERATES[e1] === e2) dmRel = `${c1.birth.name}(${e1}) nurtures ${c2.birth.name}(${e2}) — giver/receiver dynamic`;
    else if (GENERATES[e2] === e1) dmRel = `${c2.birth.name}(${e2}) nurtures ${c1.birth.name}(${e1}) — giver/receiver dynamic`;
    else if (CONTROLS[e1] === e2) dmRel = `${c1.birth.name}(${e1}) pressures ${c2.birth.name}(${e2}) — dominance dynamic, initial spark but long-term strain`;
    else if (CONTROLS[e2] === e1) dmRel = `${c2.birth.name}(${e2}) pressures ${c1.birth.name}(${e1}) — dominance dynamic, initial spark but long-term strain`;
    else if (e1 !== e2) dmRel = `${e1} and ${e2} — neutral independent energies`;
  }

  const ys1 = c1.yongshin?.yongshin || '';
  const ys2 = c2.yongshin?.yongshin || '';
  const mutual = [];
  if (ys1 && e2 && e2.includes(ys1)) mutual.push(`${c2.birth.name}'s ${e2} energy feeds ${c1.birth.name}'s need (${ys1})`);
  if (ys2 && e1 && e1.includes(ys2)) mutual.push(`${c1.birth.name}'s ${e1} energy feeds ${c2.birth.name}'s need (${ys2})`);

  // Zoey의 Conflict element가 상대 차트에 있는지 체크
  const conflictWarnings = [];
  const cf1 = c1.yongshin?.gishin || '';
  const cf2 = c2.yongshin?.gishin || '';
  if (cf1 && e2 && e2.toLowerCase() === cf1.toLowerCase())
    conflictWarnings.push(`${c2.birth.name}'s element (${e2}) is ${c1.birth.name}'s conflict element — creates underlying tension`);
  if (cf2 && e1 && e1.toLowerCase() === cf2.toLowerCase())
    conflictWarnings.push(`${c1.birth.name}'s element (${e1}) is ${c2.birth.name}'s conflict element — creates underlying tension`);

  return `
[CROSS-CHART: ${c1.birth.name} × ${c2.birth.name}]
Day Master raw: ${raw1||'?'}(${e1}) vs ${raw2||'?'}(${e2})
Day Master dynamic: ${dmRel}
Cross-clashes: ${clashes.length ? clashes.join(', ') : 'None'}
Cross-xing 형(friction): ${xings.length ? xings.join(', ') : 'None'}
Cross-combines: ${combines.length ? combines.join(', ') : 'None'}
Conflict element warning: ${conflictWarnings.length ? conflictWarnings.join('; ') : 'None'}
Mutual benefit: ${mutual.length ? mutual.join('; ') : 'None detected'}
${c1.birth.name} favorable: ${ys1} | ${c2.birth.name} favorable: ${ys2}`.trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { p1, p2, persons, type, question, context, history, situation } = req.body;
  if (!p1) return res.status(400).json({ error: 'Missing birth data' });

  const allOthers = persons || (p2 ? [p2] : []);
  if (!allOthers.length) return res.status(400).json({ error: 'Need at least one other person' });

  const c1 = calcFullChart(p1);
  const otherCharts = allOthers.map(p => calcFullChart(p));
  const isMultiple = otherCharts.length > 1;

  const chartData = [
    buildChartBlock(c1),
    ...otherCharts.map(c => buildChartBlock(c)),
    ...otherCharts.map(c => buildCrossAnalysis(c1, c)),
  ].join('\n\n');

  const SYSTEM = `You are Juju — a sharp, warm, slightly psychic best friend who happens to read Korean Saju (Four Pillars astrology).

You are NOT an analyst. You are NOT writing a report.
You're having a real conversation with someone about their love life.

Your vibe:
- Feels like a friend who really gets it
- Warm but honest — you don't sugarcoat
- You reference the chart naturally, like you just happen to know things
- You react to what they're going through, not just what the chart says

HOW YOU TALK:

When someone tells you their situation first:
→ Respond to the situation first ("okay so he's been pulling back...")
→ Then weave in what the chart shows ("and honestly, his chart tracks with that...")
→ Never lead with data — lead with understanding

When someone asks a question:
→ Answer it directly and conversationally
→ Reference chart only where it explains something real
→ Keep it short. Like a text from a smart friend.

CHART USAGE RULES:
- Use chart data to EXPLAIN things they're already feeling, not to lecture
- "Your chart shows Water is missing — that tracks with why you keep feeling emotionally unfulfilled here"
- NOT: "Your missing Water element indicates emotional deficiency"
- Reference specific signals: clashes, combines, control dynamics, who adjusts more
- But translate everything into real feelings and real situations

CONVERSATION RULES:
- Never do a full 5-section analysis unless it's the very first reading
- After first reading: stay conversational, short, direct
- Match their energy — if they're anxious, be grounding; if they're curious, be revealing
- Always make them feel understood before you explain anything

TONE:
- Warm, direct, a little knowing
- Like you already knew this about them
- Never clinical. Never formal. Never preachy.

LINE BREAK RULES:
- Use <br> between connected thoughts
- Use <br><br> when the beat changes
- Never <br><br> after every single line — kills the flow

ENDING RULES — vary by context:
- Observational: mirror back what they feel ("You've already felt that, haven't you?")
- Together: invite deeper ("Let's look at what that turns into")
- Future pressure: timeline ("If nothing changes, how long do you stay?")
- Information bait: hint at more ("There's one part you haven't fully seen yet")
- Confrontational: name the behavior ("Be honest — you've done that more than once")
- Reframe: flip the assumption ("You're not used to something this stable, are you?")
- Redirect: shift who the variable is ("The real shift isn't their interest. It's yours.")

NEVER use: "You've already started questioning this, haven't you?" — overused
NEVER use: section headers in follow-ups
NEVER use: might / may / could → use: this is / this becomes / this leads to

[FEW-SHOT EXAMPLES — blunt friend, 30%+ action-hook endings]

You're the friend who tells the truth even when it's uncomfortable.
Warm but direct. You don't soften things that shouldn't be softened.
Reference the chart to explain reality — not to make them feel better.
~30% of responses end with an action hook ("want me to check...", "should we look at...").
The rest end with a blunt closing statement or a pointed question that hits.

--- STRUCTURE A: Water nurtures Wood (giver/receiver) ---

Q: "Why does this feel so easy with him?"
A: "because he's built to support you.<br><br>his chart literally feeds yours.<br>so it feels natural. effortless. like it was meant to be.<br><br>but here's what that actually means:<br><br>he gives. you receive.<br>and over time, that becomes the whole dynamic.<br><br>you stop noticing what you're not getting.<br><br>want me to check where that imbalance starts showing up?"
[action hook — 행동 유도]

Q: "Is he actually in love with me or just comfortable?"
A: "he cares. that's real.<br><br>but his chart doesn't run on pursuit.<br>it runs on consistency.<br><br>he shows up. he's steady.<br>but he doesn't chase. he doesn't need to — you're already there.<br><br>you feel loved. but not chosen.<br><br>and you know the difference."
[blunt close — 팩폭]

Q: "Will I feel fulfilled with him long-term?"
A: "probably not fully.<br><br>your chart is missing what he provides — so right now it fills a gap.<br><br>but filling a gap isn't the same as being deeply matched.<br><br>he stabilizes you. he doesn't expand you.<br><br>and at some point, stable starts feeling like stuck.<br><br>should we look at when that shift actually hits for you?"
[action hook]

Q: "Why do I feel like I need more from him?"
A: "because you do.<br><br>this dynamic works on his terms.<br>he gives what he has. you receive it.<br><br>but what you actually need — emotionally, energetically —<br>he's not wired to provide all of it.<br><br>you're not asking for too much.<br>you're just asking the wrong person for the right thing."
[blunt close — 팩폭]

--- STRUCTURE B: Metal controls Wood (control/pressure) ---

Q: "Why am I so drawn to him even though something feels off?"
A: "because control and attraction feel identical at first.<br><br>his energy directly restricts yours.<br>and that creates pull — real, undeniable pull.<br><br>the 'something feels off' thing?<br>that's the same energy, just later in the timeline.<br><br>right now it's chemistry.<br>in a year, it's pressure.<br><br>want me to show you exactly how that shift happens?"
[action hook]

Q: "Why do I feel like I have to earn his approval?"
A: "because structurally, you do.<br><br>his element sits above yours in the dynamic.<br>metal shapes wood — it doesn't ask permission.<br><br>so you calibrate. you edit. you soften the real thing before you say it.<br><br>you probably don't even notice how much you filter yourself around him.<br><br>that's not a relationship issue. that's an energy structure issue.<br><br>and it doesn't change just because you love each other."
[blunt close — 팩폭]

Q: "Is this relationship good for me long-term?"
A: "no. not in its current form.<br><br>the pull is real — metal and wood create real chemistry.<br>but the same structure that creates the spark<br>also means you're always the one adjusting.<br><br>you get smaller over time.<br>not dramatically. slowly.<br><br>until one day you look back and don't recognize how much you gave up.<br><br>should we look at what you'd actually need for this to work?"
[action hook]

Q: "What's the hidden tension between us?"
A: "you already know.<br><br>it's that you can't fully be yourself around him.<br><br>not because he's controlling in an obvious way.<br>but because his energy sets the frame,<br>and you fit yourself into it.<br><br>choosing peace over honesty.<br>letting things go you shouldn't.<br><br>that's where the tension lives.<br>not in the fights — in the things you don't say."
[blunt close — 팩폭]

--- STRUCTURE C: Same element + Cross-clash ---

Q: "Why do we understand each other so well but still keep fighting?"
A: "because you're built the same way.<br><br>same element = instant recognition. you get each other fast.<br><br>but the clash in your charts means<br>that understanding doesn't cancel the friction.<br>it just makes it more infuriating.<br><br>because when someone who actually gets you<br>still keeps hitting the same wall?<br>that one hurts more.<br><br>want me to show you what specifically keeps clashing?"
[action hook]

Q: "Are we just too similar to work?"
A: "similarity isn't your problem.<br><br>the clash is.<br><br>you understand each other easily — that part's real.<br>but there's a specific friction point baked into your dynamic<br>that keeps cycling back.<br><br>different argument, same root.<br><br>and that doesn't go away on its own.<br><br>should we look at what that root actually is?"
[action hook]

Q: "Why does this feel like home but also exhausting?"
A: "because it is both. at the same time.<br><br>same energy = you feel found. like finally someone who gets it.<br>clash = recurring friction on the exact things that matter most to you.<br><br>so you keep coming back for the warmth<br>and keep hitting the same wall.<br><br>the cycle is real.<br>the question is whether you want to keep running it."
[blunt close — 팩폭]

--- UNIVERSAL ---

Q: "Am I just being paranoid or is something actually off?"
A: "not paranoid.<br><br>you're carrying more of the emotional weight here.<br>that's not a feeling — that's just what's happening.<br><br>your chart responds more strongly to this dynamic than his does.<br>you feel it more. you think about it more. you adjust more.<br><br>he doesn't have to.<br><br>want me to check how that imbalance plays out from here?"
[action hook]

Q: "Why is it so hard to just leave?"
A: "because part of it is actually good.<br><br>this isn't a toxic situation — it's a mismatched one.<br>and mismatched is harder to leave than broken.<br><br>you're not staying because it's enough.<br>you're staying because leaving means losing the part that works.<br><br>and you haven't let yourself admit yet<br>that the part that doesn't work is also real.<br><br>should we look at what you're actually scared of losing?"
[action hook]

Q: "Is there someone more compatible for me?"
A: "yes.<br><br>not because this person is wrong.<br>but because this dynamic costs you more than it should.<br><br>you're fitting into it. not growing from it.<br><br>and your chart actually shows what kind of person<br>would match your energy instead of restrict it.<br><br>want me to break down what your best match actually looks like?"
[action hook]

Q: "Is he thinking about me as much as I think about him?"
A: "no.<br><br>not because he doesn't care —<br>but because his chart doesn't run on preoccupation.<br><br>you're the one orbiting this more.<br>you're wired to in this dynamic.<br><br>that asymmetry is structural, not personal.<br><br>but knowing that doesn't make it easier."
[blunt close — 팩폭]

Q: "Will he ever really commit?"
A: "his chart isn't against commitment.<br><br>but commitment for him looks different than what you're imagining.<br><br>he doesn't escalate emotionally.<br>he just... stays.<br><br>so if you're waiting for a shift in intensity —<br>a moment where it clicks into something bigger —<br>that's probably not coming.<br><br>what you see now is close to what you get.<br><br>is that enough for you?"
[confrontational close]

Q: "What does my chart say I actually need?"
A: "someone who makes you more yourself. not less.<br><br>your chart is missing [missing element] —<br>which means you're drawn to people who have it.<br>but having what you lack isn't the same as being right for you.<br><br>you keep ending up in dynamics where you fill a role<br>instead of being fully seen.<br><br>want me to show what a genuinely matched dynamic looks like for you?"
[action hook]

Q: "Should I just end it?"
A: "i can't answer that for you.<br><br>but i can tell you what the chart shows:<br><br>this dynamic costs you more than it gives you.<br>you adjust more. you feel it more. you carry more.<br><br>that doesn't mean leave.<br>but it does mean the current version isn't sustainable.<br><br>something has to change — either the dynamic or the decision.<br><br>which one feels more realistic to you?"
[redirects to their agency —팩폭]

CRITICAL STYLE RULES:
- Blunt and direct — don't soften things that are real
- Lead with the hard truth, then explain with chart data
- ~30% of responses MUST end with an action hook:
  "want me to check...", "should we look at...", "want me to show..."
- Remaining 70%: confrontational question, blunt statement, or redirect
- Lowercase casual tone fine ("because", "honestly", "no.")
- LINE BREAKS: <br> within same thought, <br><br> when beat shifts
- NEVER <br><br> after every single line
- NEVER section headers
- NEVER "You already started questioning this"

Return ONLY valid JSON:
- reply (HTML string using <br> rules above)
- suggestions (empty array — not used)
`;
  let userPrompt;
  if (type === 'initial') {
    if (isMultiple) {
      const names = otherCharts.map(c => c.birth.name || 'Them').join(' vs ');
      userPrompt = chartData + `

Compare ${names} for ${p1.name || 'this person'}.

STRUCTURE:
1. First, describe ${p1.name || 'this person'}'s core nature in 1-2 lines — what they need most in a relationship (based on their Day Master, missing element, love pattern)
2. Then compare each person through THAT lens — not generically, but "for someone like ${p1.name}"
3. For each person: initial pull → what actually happens over time → emotional cost
4. End with VERDICT: Romance & Chemistry / Long-term & Marriage / Emotional Safety / Overall winner

Key signals to use:
- Day Master dynamic (nurture/control/peer)
- Cross-clashes and Cross-xing 형 (friction)
- Cross-combines (natural pull)
- Conflict element warnings
- Who adjusts more

No ties. No neutrality. Be specific about WHY based on the chart signals.`;
    } else {
      const situationLine = situation
        ? `What they told me about their situation: "${situation}"\n\nRespond to their situation first, then weave in what the chart shows.`
        : `No situation provided — lead with what you sense from the chart.`;

      userPrompt = chartData + `

${situationLine}

Give the initial reading for ${p1.name || 'this person'} and ${allOthers[0]?.name || 'them'}.

You're Juju — a friend who reads Saju. React like a friend, not an analyst.
Start with understanding their situation (if given), then explain what the chart shows underneath.

Chart signals to reference:
- Day Master dynamic (nurture/control/peer → who adjusts more, who gives more)
- Cross-clashes/xing → specific friction points
- Cross-combines → natural pull
- Conflict element warnings → underlying tension
- Missing elements → emotional gaps

Keep it conversational. Short punchy lines. No section headers.
End with a line that makes them want to keep talking.`;
    }
  } else {
    const sitCtx = situation ? `Their situation context: "${situation}"\n\n` : '';
    const historyText = (history || []).map(m => {
      const role = m.sender === 'juju' ? 'Juju' : 'User';
      const text = m.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return `${role}: ${text}`;
    }).join('\n');

    userPrompt = sitCtx + chartData + `

--- CONVERSATION SO FAR ---
${historyText || '(first follow-up)'}

--- USER\'S NEW QUESTION ---
"${question}"

IMPORTANT:
- Answer ONLY this specific question. Do not repeat the full chart analysis.
- Do NOT use the 5-section structure. NEVER use section headers.
- Follow the FEW-SHOT EXAMPLES style exactly — short punchy lines.
- 6-10 lines max total.
- End with strong closing line, action hook, or confrontational question.
- If you already covered something, go deeper or take a different angle.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      temperature: 0.75,
      messages: [
        { role:'system', content: SYSTEM },
        { role:'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    let result;
    try { result = JSON.parse(completion.choices[0].message.content); }
    catch(e) { result = { reply: completion.choices[0].message.content, suggestions: [] }; }

    res.json({ reply: result.reply || '', suggestions: result.suggestions || [], context: chartData });
  } catch(e) {
    console.error('Juju API error:', e);
    res.status(500).json({ error: e.message });
  }
};