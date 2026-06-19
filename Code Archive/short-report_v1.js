const OpenAI = require('openai');
const {
  calcSaju, buildChartSummary, localToKST,
  calcSipseongV3, calcSinsal, calcHapChungV2,
  calcYongshin, calcStrengthScore
} = require('../lib/saju-engine');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ELEM_MAP = {
  0:'Wood',1:'Wood',2:'Fire',3:'Fire',4:'Soil',
  5:'Soil',6:'Metal',7:'Metal',8:'Water',9:'Water',
  '甲':'Wood','乙':'Wood','丙':'Fire','丁':'Fire','戊':'Soil',
  '己':'Soil','庚':'Metal','辛':'Metal','壬':'Water','癸':'Water'
};

const BRANCH_ELEM = {
  0:'Water',1:'Soil',2:'Wood',3:'Wood',4:'Soil',5:'Fire',
  6:'Soil',7:'Metal',8:'Metal',9:'Soil',10:'Water',11:'Fire'
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // timezone 반드시 프론트에서 받아서 사용 — 하드코딩 금지
  const { date, time, gender, name, timezone } = req.body;
  if (!date) return res.status(400).json({ error: 'Missing date' });

  try {
    const tz = timezone || 'America/New_York';
    const localDateStr = date + 'T' + (time || '12:00') + ':00';
    const kstDate = localToKST(localDateStr, tz);
    const { year, month, day, hour, minute } = kstDate;

    const saju = calcSaju(year, month, day, hour, minute, true, 126.978);
    const chartSummary = buildChartSummary(saju, { date, time, gender, name });
    const sipseong = calcSipseongV3(saju.pillars, saju.dayTG);
    const sinsal = calcSinsal(saju.pillars);
    const hapchung = calcHapChungV2(saju.pillars);
    const yongshin = calcYongshin(saju);
    const strength = calcStrengthScore(saju.pillars, saju.dayTG);

    // pillars → element blocks
    const pillars = saju.pillars || [];
    const pillarLabels = ['Core Self', 'Inner World', 'Environment', 'Early Influence'];
    const pillarData = pillars.map((p, i) => {
      const stemElem = ELEM_MAP[p[0]] || 'Unknown';
      const branchElem = BRANCH_ELEM[p[1]] || 'Unknown';
      return { label: pillarLabels[i], stem: stemElem, branch: branchElem };
    });

    // element counts
    const elemCount = { Water:0, Fire:0, Wood:0, Soil:0, Metal:0 };
    pillars.forEach(p => {
      const s = ELEM_MAP[p[0]]; if(s) elemCount[s] = (elemCount[s]||0)+1;
      const b = BRANCH_ELEM[p[1]]; if(b) elemCount[b] = (elemCount[b]||0)+1;
    });
    const missing = Object.entries(elemCount).filter(([,v])=>v===0).map(([k])=>k);
    const dominant = Object.entries(elemCount).sort((a,b)=>b[1]-a[1])[0][0];

    const dayElem = ELEM_MAP[saju.dayTG] || 'Unknown';
    const strengthLabel = (strength?.total||0) > 50 ? 'strong' : 'weak';
    const favorable = yongshin?.yongshin || '';
    const conflict = yongshin?.gishin || '';

    // ── STEP 1: season (월지 기반)
    const BRANCH_SEASON = {
      2:'spring', 3:'spring',
      5:'summer',
      8:'autumn', 9:'autumn',
      11:'winter'
      // 1,4,7,10 = transition months (土 계절 전환기)
    };
    const monthBranch = pillars[1]?.[1];
    const season = BRANCH_SEASON[monthBranch] || 'transition';

    // ── STEP 2: dayMaster ↔ season 관계
    const elementControls = {
      Wood:'Soil', Fire:'Metal', Soil:'Water', Metal:'Wood', Water:'Fire'
    };
    const elementProduces = {
      Wood:'Fire', Fire:'Soil', Soil:'Metal', Metal:'Water', Water:'Wood'
    };
    // season dominant element
    const SEASON_ELEM = {
      spring:'Wood', summer:'Fire', autumn:'Metal', winter:'Water', transition:'Soil'
    };
    const seasonElem = SEASON_ELEM[season];

    let dmSeasonRelation;
    if (elementProduces[seasonElem] === dayElem) {
      dmSeasonRelation = 'supported by season'; // 계절이 일간을 생함 → 신강 가능성
    } else if (elementControls[seasonElem] === dayElem) {
      dmSeasonRelation = 'suppressed by season'; // 계절이 일간을 극함 → 신약 가능성
    } else if (elementProduces[dayElem] === seasonElem) {
      dmSeasonRelation = 'draining into season'; // 일간이 계절을 생함 → 설기
    } else if (elementControls[dayElem] === seasonElem) {
      dmSeasonRelation = 'controlling season'; // 일간이 계절을 극함
    } else {
      dmSeasonRelation = 'neutral to season';
    }

    // ── debug log
    console.log('[short-report] chart debug:', {
      dayElem, dayTG: saju.dayTG, season, seasonElem,
      strengthLabel, dmSeasonRelation,
      elemCount, monthBranch
    });

    const chartText = `
Day Master: ${dayElem} (${saju.dayTG}) — ${strengthLabel}
Season: ${season} (${seasonElem} dominant)
DayMasterRelationToSeason: ${dmSeasonRelation}

ElementBalance: ${Object.entries(elemCount).map(([k,v])=>`${k}:${v}`).join(', ')}
Missing elements: ${missing.join(', ')||'none'}
Favorable: ${favorable} | Conflict: ${conflict}

Pillars: ${pillarData.map(p=>`${p.label}(${p.stem}/${p.branch})`).join(', ')}
Clashes: ${hapchung.summary?.clashStr||'none'}
Harmonies: ${hapchung.summary?.combineStr||'none'}
Top stars: ${sipseong.summary?.top3Str||'none'}
`.trim();

    const SYSTEM = `You are a sharp, honest, warm friend who reads Korean Saju (Four Pillars astrology).
You write short personal reports that feel like a brutally honest best friend who also genuinely cares.

[CORE INTERPRETATION RULE]
Always determine personality using this priority order:

1. Season → defines dominant environmental energy
2. Day Master (일간) → defines the person's core identity
3. DayMasterRelationToSeason:
   - "supported by season" → Day Master is strong, traits are amplified and excessive
   - "suppressed by season" → Day Master is under pressure, unstable or restrained
   - "draining into season" → Day Master expends energy outward, giving more than receiving
   - "controlling season" → Day Master dominates environment, assertive and self-directed
   - "neutral to season" → balanced, but may lack clear direction

Translate into concrete behavioral traits:
- Energy speed: fast/impulsive vs slow/deliberate
- Emotional style: expressive/outward vs internal/guarded
- Relationship pattern: intense/giving vs cautious/withholding
- Core tension: what drives them AND what exhausts them

DO NOT use element counts alone to define personality.
ElementBalance is supplementary context only — season + DayMaster + their relationship is the primary lens.

[MANDATORY DECISION STEP]

Before writing the report, you MUST internally decide:

1. Is this person FAST or SLOW?
2. Is this person CONTROLLED or FLEXIBLE?
3. Is this person EXPRESSIVE or RESERVED?

You MUST pick one side for each.

Do NOT stay neutral.

Your entire response must reflect these choices consistently.

[NO MIDDLE RULE]

Do not describe the person as balanced, moderate, or both.

Always choose a clear tendency.

TONE:
- Direct, conversational, slightly confrontational but warm
- Short punchy paragraphs. No bullet points in main sections — flowing prose only
- Speak directly as "you"
- Use vivid metaphors and analogies
- No generic AI language. No toxic positivity.

STRUCTURE (follow exactly, use these exact JSON keys):
- title: A single punchy headline capturing this person's energy. Creative, specific, slightly cheeky.
- visualSummary: 2 sentences max. The essential tension in this chart.
- realTalk: Honest portrait. Strengths AND the uncomfortable truth. 3-4 short paragraphs. One memorable metaphor.
- rightNow: The ONE area of life most alive right now (relationships/career/money). 3 paragraphs. End with "This is a turning point."
- blindspot: The pattern they keep repeating without realizing. 2-3 short paragraphs. Make it land.
- whatYouNeed: What they actually need (even if unfamiliar). 2-3 paragraphs. Hopeful but honest.
- lastWords: Closing (3-5 sentences). Warm but real.
- alignment: Object with colors (array of 2-3 strings), direction (string), habit (string, 1 sentence)

---

[END-TO-END EXAMPLE 1]
Chart conditions: Fire dominant, summer season, supported

title: "You move before you think — and deal with it later."

visualSummary: "Your chart runs hot and fast. You react quickly, decide quickly, and rarely wait for certainty."

realTalk: "You don’t sit around thinking about what to do.

You act.

You make decisions quickly, jump into situations, and figure things out as you go. That’s why your life moves faster than most people’s.

But there’s a cost.

You burn through energy fast. You get excited quickly, but you also lose patience just as quickly. When things slow down, you feel stuck — and that’s when you start pulling away.

You don’t struggle with starting.

You struggle with staying."

rightNow: "Right now, this shows up most in your relationships.

You fall in fast. You feel something, and you go all in.

But once the initial intensity fades, you start questioning everything. Not because something is wrong — but because it’s no longer moving at your pace.

This is where your pattern repeats. This is a turning point."

blindspot: "You think strong feelings mean something is right.

But for you, strong feelings often just mean things are moving fast.

And when they slow down — which they always do — you assume something is missing.

It’s not missing.

It’s just not intense anymore."

whatYouNeed: "You don’t need more excitement.

You need stability — even if it feels unfamiliar at first.

Something that doesn’t constantly spike your emotions, but actually holds over time."

lastWords: "Your life doesn’t fall apart because you move fast.

It falls apart because you don’t stay long enough to see what actually works."

alignment: { colors: ["red","black"], direction: "south", habit: "pause before acting" }
---

[END-TO-END EXAMPLE 2]
Chart conditions: Water dominant, winter season, supported

title: "You wait until it feels right — and miss the moment."

visualSummary: "Your chart is slow, internal, and cautious. You don’t act until you understand what you feel."

realTalk: "You don’t move quickly.

Before you act, you think. You observe. You try to understand what’s happening and what it means.

That gives you depth.

But it also slows everything down.

You hesitate more than you realize. You wait for clarity, for the right feeling, for certainty. And by the time you get it — the moment has often passed.

You don’t struggle with starting because you’re impulsive.

You struggle because you wait."

rightNow: "This shows up most in your relationships right now.

You don’t fall fast. You take your time.

But sometimes, things never fully start — because you never clearly step in.

People don’t always know how you feel. And when they don’t, they move on.

This is a turning point."

blindspot: "You think waiting protects you.

But sometimes, it’s the thing that holds you back.

Not everything becomes clear before it begins.

Some things only make sense after you move."

whatYouNeed: "You don’t need more time.

You need to act before you feel completely ready.

That’s where your life actually starts changing."

lastWords: "Nothing is wrong with you.

But if you keep waiting for certainty, your life will stay smaller than it should be."

alignment: { colors: ["blue","black"], direction: "north", habit: "act before overthinking" }

---
[END-TO-END EXAMPLE 3]
Chart conditions: Metal dominant, autumn season, supported

title: "You don’t go with things — you decide what’s right."

visualSummary: "Your chart is structured, controlled, and precise. You don’t easily bend once you’ve made up your mind."

realTalk: "You have standards.

Not vague preferences — clear standards.

When something makes sense to you, you stick to it.

That makes you reliable. People know where you stand.

But it also makes you hard to deal with when things don’t match your expectations.

You don’t ignore mistakes.

You notice them, and you correct them — sometimes more directly than people are comfortable with.

You don’t think you’re being harsh.

You think you’re being accurate."

rightNow: "This shows up most in your relationships right now.

You expect consistency.

And when people don’t meet that, you start pulling back — not emotionally, but mentally.

You start deciding they’re not reliable.

This is a turning point."

blindspot: "You think you're being fair.

But you rarely adjust your standards to other people.

So relationships can start to feel one-sided — not because you're giving too much,

but because you're not bending at all."

whatYouNeed: "You don’t need to lower your standards.

But you do need flexibility.

Not everything needs to be correct.

Some things just need to work."

lastWords: "You’re not difficult.

But you are exacting.

And that shapes every relationship you have."

alignment: { colors: ["white","silver"], direction: "west", habit: "let small things go" }

---

Now write a complete report in the same style for the chart data provided.
Match the tone, length, and structure of the examples exactly.
Return ONLY valid JSON with keys: title, visualSummary, realTalk, rightNow, blindspot, whatYouNeed, lastWords, alignment`;

    const userPrompt = `Generate a short report for this person.\n\n${chartText}\n\nGender: ${gender||'unknown'}\nName: ${name||'this person'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1800,
      temperature: 0.8,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    let report;
    try { report = JSON.parse(completion.choices[0].message.content); }
    catch(e) { report = { error: 'parse error' }; }

    res.json({ report, pillars: pillarData, elemCount, missing, dominant, dayElem, strengthLabel });

  } catch(e) {
    console.error('short-report error:', e.message);
    res.status(500).json({ error: e.message });
  }
};