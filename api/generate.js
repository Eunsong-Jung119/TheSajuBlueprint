const Stripe = require('stripe');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const { calcSaju, buildChartSummary, localToKST, calcSipseongV3, calcSinsal, calcHapChungV2, calcYongshin, analyzeSpouseGung, buildLoveContext, calcStrengthScore, calcDaewonFull, buildDaewonContext, analyzeNatalTensions, buildInteractionAugmentedDaewons, calcEventPredictions, calcWealthMode, calcRelationalStructure, calcEnergyProfile, calcBlindSpots, calcFinancialProfile, calcMoneyEngine } = require('../lib/saju-engine');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function g(obj, ...keys) {
  let v = obj;
  for (const k of keys) { if (v == null) break; v = v[k]; }
  return (v !== undefined && v !== null && v !== '') ? v : '—';
}

async function callGPT(systemPrompt, userPrompt, maxTokens = 1200, model = 'gpt-4o') {
  const res = await openai.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.72,
    response_format: { type: 'text' },
  });
  return res.choices[0].message.content;
}

function parseJSON(text) {
  // 1. 마크다운 코드블록 제거
  let clean = text.replace(/```json\n?|```\n?/g, '').trim();

  // 2. { ... } 추출
  const s = clean.indexOf('{');
  const e = clean.lastIndexOf('}');
  if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

  // 3. 1차 파싱
  try { return JSON.parse(clean); } catch {}

  // 4. 일반적인 JSON 에러 자동 수정
  const fixed = clean
    // trailing comma 제거
    .replace(/,(\s*[}\]])/g, '$1')
    // curly quotes → straight
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    // em-dash → --
    .replace(/\u2014/g, '--')
    // 값 안의 줄바꿈 → 공백
    .replace(/"([^"]*)\n([^"]*)"/g, '"$1 $2"')
    // 제어문자 제거
    .replace(/[\x00-\x1F\x7F]/g, ' ');

  try { return JSON.parse(fixed); } catch {}

  // 5. 잘린 JSON 복구 시도 — 마지막 완전한 키-값 쌍까지만 사용
  try {
    const lines = fixed.split('\n');
    let partial = '';
    for (let i = lines.length - 1; i >= 0; i--) {
      const attempt = lines.slice(0, i).join('\n');
      const lastComma = attempt.lastIndexOf(',');
      const closed = attempt.slice(0, lastComma) + '\n}}}}}';
      try { return JSON.parse(closed); } catch {}
    }
  } catch {}

  throw new Error('JSON parse failed: ' + clean.slice(0, 300));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { paymentIntentId, orderId, birth } = req.body;

  if (!paymentIntentId || !birth) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Verify payment with Stripe (skip for mock in dev)
    let email = birth.email || null;
    if (!paymentIntentId.startsWith('mock_') && !paymentIntentId.startsWith('paddle_')&&
    !paymentIntentId.startsWith('gumroad_')) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== 'succeeded') {
        return res.status(402).json({ error: 'Payment not completed' });
      }
      // 이메일: PaymentIntent metadata > customer email > receipt_email 순서로 확인
      email = pi.metadata?.email || pi.receipt_email || email;
    }

    // 2. Calculate Four Pillars
    const tz = birth.timezone || 'Asia/Seoul';
    const localDateStr = birth.date + 'T' + (birth.time || '00:00') + ':00';
    const kstDate = localToKST(localDateStr, tz);
    const { year, month, day, hour, minute } = kstDate;

    const saju = calcSaju(year, month, day, hour, minute, true, 126.978);
    const chartSummary = buildChartSummary(saju, birth);

    // ── 추가 사주 계산
    const sipseong = calcSipseongV3(saju.pillars, saju.dayTG);
    const ss = sipseong.summary;
    const sipseongStr = [
      'Top stars: ' + ss.top3Str,
      'Deficient: ' + ss.defStr,
      'Excess: ' + ss.excessStr,
      'Combo: ' + ss.comboStr,
      ss.dayPalaceStr,
      ss.monthPalaceStr,
      'Wealth: ' + ss.wealthStr,
      'Authority: ' + ss.gwanStr,
    ].join(' || ');

    const sinsal = calcSinsal(saju.pillars);
    const sinsalStr = sinsal.length > 0
      ? sinsal.map(s => '[' + s.nameKo + '] ' + s.intensity + ' in ' + s.positions.join('/') + ': ' + s.desc).join(' || ')
      : 'None detected';

    const hapchung = calcHapChungV2(saju.pillars);
    const hc = hapchung.summary;

    const yongshin = calcYongshin(saju);
    const spouseGung = analyzeSpouseGung(saju.pillars, saju.dayTG, birth.gender);
    const strengthResult = calcStrengthScore(saju.pillars, saju.dayTG);
    chartSummary.strengthTotal = strengthResult.total;   // PROMPT_STEP2 s4 coreDensityScore용
    chartSummary.strengthMsg   = strengthResult.msg || strengthResult.label || (strengthResult.total > 50 ? '신강' : '신약');

    // ── Energy Profile (Section 1 그래프용)
    const energyProfile = calcEnergyProfile(saju.pillars, saju.dayTG, strengthResult);
    chartSummary.energyProfile = energyProfile;

    // ── Blind Spots (Section 2)
    const blindSpots = calcBlindSpots(energyProfile, hapchung);
    chartSummary.blindSpots = blindSpots;
    const loveCtx = buildLoveContext(saju.pillars, saju.dayTG, strengthResult, sipseong, hapchung, sinsal, saju.season);
    const lc = loveCtx;

    // 대운 계산
    const daewonResult = calcDaewonFull(
      parseInt(birth.year || new Date(birth.date).getFullYear()),
      parseInt(birth.month || (new Date(birth.date).getMonth()+1)),
      parseInt(birth.day || new Date(birth.date).getDate()),
      birth.gender === 'Male' ? 'M' : 'F',
      saju.yrTG !== undefined ? saju.yrTG : saju.pillars[0][0],
      saju.pillars[1][0],
      saju.pillars[1][1]
    );
    const daewonCtx = buildDaewonContext(daewonResult, saju.dayTG, yongshin.yongshin, yongshin.gishin, new Date().getFullYear());
    const dw = daewonCtx;

    // 원국 × 대운 상호작용 분석
    const interactionCtx = buildInteractionAugmentedDaewons(
      daewonResult, saju.pillars, saju.dayTG, yongshin.yongshin, yongshin.gishin,
      strengthResult.total   // 신약/신강 점수 전달 → 비견/겁재 조건부 보강
    );
    const itr = interactionCtx;

    // ── Wealth Mode 판정 (재성 구조 기반 독립 계산 — GPT에 확정값 주입)
    const wealthMode = calcWealthMode(saju.pillars, saju.dayTG);
    chartSummary.wealthMode = wealthMode;

    // ── Financial Profile (Section 4 스냅샷용)
    const financialProfile = calcFinancialProfile(saju.pillars, saju.dayTG, wealthMode, energyProfile);
    chartSummary.financialProfile = financialProfile;

    // ── Money Engine v2 (재성 위치 + 흐름 + 타이밍)
    const moneyEngine = calcMoneyEngine(saju.pillars, saju.dayTG, daewonResult, wealthMode, energyProfile);
    chartSummary.moneyEngine = moneyEngine;

        // ── Relational Structure Profile (엔진 확정값 — GPT에 주입)
    const relStruct = calcRelationalStructure(saju.pillars, saju.dayTG, strengthResult, sipseong, hapchung);
    chartSummary.relStruct = relStruct;
    chartSummary.loveCtx = loveCtx;

    // lamData: Life Activation Map용 — 점수 + 이벤트 예측 v2
    const eventPred = calcEventPredictions(
      interactionCtx.augmented, saju.pillars, saju.dayTG,
      yongshin.yongshin, yongshin.gishin, strengthResult.total
    );
    chartSummary.lamData = eventPred.map(d => ({
      age:           d.age,
      startYear:     d.startYear,
      endYear:       d.endYear,
      score:         d.score,     // 10점 미만 +10 보정 포함
      stemGod:       d.stemGod,
      stemElem:      d.stemElem,
      branchElem:    d.branchElem,
      palaceClashes: d.palaceClashes,
      isYeokma:      d.isYeokma,
      events:        d.events,
      // 기존 호환용
      interaction: {
        score:      d.score,
        events:     interactionCtx.augmented.find(a => a.age === d.age)?.interaction?.events || [],
        scoreLog:   interactionCtx.augmented.find(a => a.age === d.age)?.interaction?.scoreLog || [],
        marriageWindow: false,
      }
    }));

    // ── LAM Peak / Caution 계산 (GPT에 실제 데이터 주입용)
    (function() {
      const lam = chartSummary.lamData;
      if (!lam || !lam.length) return;
      const nowYear = new Date().getFullYear();

      // Peak: 전체 중 최고 score 대운
      const sorted = [...lam].sort((a, b) => b.score - a.score);
      const peak   = sorted[0];

      // Caution: 전체 중 최저 score 대운
      const caution = sorted[sorted.length - 1];

      // 현재 대운
      const current = lam.find(d => d.startYear <= nowYear && nowYear <= d.endYear) || lam[0];

      // 현재 기준 미래 중 peak가 있으면 그것 우선
      const futurePeak = [...lam]
        .filter(d => d.endYear > nowYear)
        .sort((a, b) => b.score - a.score)[0];

      chartSummary.lamPeak    = futurePeak || peak;
      chartSummary.lamCaution = caution;
      chartSummary.lamCurrent = current;
    })();

    // 3. Step 1 - Chart analysis + narrative anchors
    const SYSTEM_BASE = `You are a warm, wise Korean Four Pillars of Destiny (Saju) master — like a trusted older mentor who genuinely cares about the reader.

TONE — CRITICAL:
- Warm, intimate, and encouraging as your default tone
- BUT: at least 2-3 moments across the full report must deliver honest, direct "hard truths" — the kind a real mentor would say with love, not flattery. These should feel like a gentle but firm wake-up call, not empty validation.
- Never sugarcoat everything. Real insight sometimes stings a little.
- Address the reader as "You" throughout — never third person, never by name
- No Korean/Chinese terms in output

EMPHASIS STYLE:
- For the most important words or phrases (max 1-2 per card), wrap them like this: <strong>"quoted phrase"</strong>
- Example: Your <strong>"relentless drive"</strong> is your greatest gift — and your biggest blind spot.
- Use sparingly. Only for genuinely key insights, not decoration.`;

    const PROMPT_STEP1 = `CALCULATED FOUR PILLARS (pre-computed — DO NOT recalculate):
${chartSummary.fourPillars}

Five Elements (with hidden stems):
${chartSummary.elemStr}

Hidden Stems: ${chartSummary.hiddenStems}
Day Master: ${chartSummary.dayMasterStr}
Missing Element(s): ${chartSummary.missing.length ? chartSummary.missing.join(', ') : 'None'}
Dominant Element: ${chartSummary.dominant}
Wealth Element: ${chartSummary.wealthElem}
Day Master Strength: ${chartSummary.strengthMsg}
Yongshin (용신): ${yongshin.desc}
Ten Stars Analysis (십성):
  ${ss.top3Str}
  Deficient stars: ${ss.defStr}
  Excess warning: ${ss.excessStr}
  Combination pattern: ${ss.comboStr}
  ${ss.dayPalaceStr}
  ${ss.monthPalaceStr}
  Wealth star analysis: ${ss.wealthStr}
  Authority/career star: ${ss.gwanStr}
Special Stars (신살): ${sinsalStr}
Chart Interactions:
  Clashes (instability patterns): ${hc.clashStr}
  Harmonies (opportunity patterns): ${hc.combineStr}
  Stem Combines: ${hc.stemCombineStr}
  Hidden Tensions: ${hc.tensionStr}
  Relationship palace: ${hc.spouseStr}
  Career/social: ${hc.careerInterStr}
  Overall: ${hc.overallEnergy}
Spouse Palace (배우자궁): ${spouseGung.desc}
Seasonal Balance: ${chartSummary.johuMsg}

Client: ${birth.name} | Gender: ${birth.gender} | Born: ${birth.date} ${birth.time} (${tz})

Return ONLY valid JSON (no markdown):
{
  "archetypeName": "<poetic 3-5 word archetype>",
  "dayMaster": "<Day Master in plain English>",
  "elements": [
    {"name":"Wood","colorVar":"wood","missing":<bool>,"count":<number>},
    {"name":"Fire","colorVar":"fire","missing":<bool>,"count":<number>},
    {"name":"Earth","colorVar":"gold","missing":<bool>,"count":<number>},
    {"name":"Metal","colorVar":"metal","missing":<bool>,"count":<number>},
    {"name":"Water","colorVar":"water","missing":<bool>,"count":<number>}
  ],
  "missingElement": "<element or None>",
  "dominantElement": "<element>",
  "notableEnergies": ["<energy 1>","<energy 2>","<energy 3>"],
  "vaults": [
    {"label":"Vault 1","char":"<Chinese char>","name":"<romanized>"},
    {"label":"Vault 2","char":"<Chinese char>","name":"<romanized>"},
    {"label":"Vault 3","char":"<Chinese char>","name":"<romanized>"}
  ],
  "narrativeAnchors": {
    "coreStrength": "<1 sentence: what makes this person powerful>",
    "coreTension": "<1 sentence: their fundamental internal conflict — be honest, not flattering>",
    "missingElementEffect": "<1 sentence: how the missing element shows up as a real pattern in daily life>",
    "wealthPattern": "<1 sentence: their wealth behavior — honest assessment>",
    "idealPartner": "<1 sentence: the element/energy type they truly need>",
    "careerDirection": "<1 sentence: environments where they naturally thrive>",
    "luckyDirection": "<compass direction>",
    "luckyColors": "<2 colors>",
    "luckyNumbers": "<2 numbers>",
    "hardTimes": "<1-2 sentences: which element cycles or age ranges tend to bring difficulty — be specific>",
    "goodTimes": "<1-2 sentences: which element cycles or age ranges bring opportunity, breakthroughs — be specific>",
    "daewonPattern": "<1 sentence: overall shape of their life arc — does fortune build early, peak mid-life, or ripen late?>",
    "relationshipType": "<1 sentence: their core relationship style — avoidant, intense, loyal, restless, etc.>",
    "compatibleElement": "<the element type they are most compatible with and why>",
    "incompatibleElement": "<the element type that creates friction and why>",
    "endgamePartner": "<1-2 sentences: specific human qualities of their endgame partner>",
    "relationshipPattern": "<1-2 sentences: the Attraction vs Stability gap for this chart -- what they chase vs what lasts -- and the repeating dynamic this creates>",
    "compatiblePartner": "<2-3 sentences: the stability element type as a real human -- how they communicate, how they love, their energy. Derived from yongshin and spouse palace analysis.>",
    "wealthDetail": "<1-2 sentences: specific wealth behavior based on wealth star positions and yongshin element>"
  }
}
RULES: raw JSON only, double quotes, no apostrophes in values, no newlines in values, no trailing commas, NO curly quotes or em-dashes -- use plain ASCII punctuation only`;

    const raw1 = await callGPT(SYSTEM_BASE, PROMPT_STEP1, 1200);
    const step1 = parseJSON(raw1);

    // 4. Step 2 — 5-section reading (single API call)
    const PROMPT_STEP2 = `You are writing a premium astrology report in the style of a master storyteller.
TONE: Intimate, direct, literary. Write in second person ("you"). No bullet points. No headers within cards.
No Chinese characters or romanized terms (no "甲木", no "Gapja"). Use metaphors instead:
- Wood energy = "the tree", "upward momentum", "the one who grows toward light"
- Metal energy = "the White Tiger", "the blade", "cutting clarity"
- Water energy = "deep water", "the reservoir", "what nourishes the roots"
- Fire energy = "the flame", "radiant expression", "the spark"
- Earth energy = "the soil", "the ground", "what roots grow into"
- Ten gods: use English equivalents — "Opportunistic Wealth", "Institutional Authority", "Competitive Capital", "Creative Output", "Disruptive Expression", "Structured Support", "Independent Intelligence", etc.

CHART DATA (pre-computed — do NOT recalculate):
${chartSummary.fourPillars}
Day Master: ${chartSummary.dayMasterStr}
Strength: ${chartSummary.strengthMsg}
Favorable element (용신): ${yongshin.yongshin}
Conflict element (기신): ${yongshin.gishin}
Missing: ${chartSummary.missing.join(',')||'None'} | Dominant: ${chartSummary.dominant}
Sinsal: ${sinsal.map(s=>s.name).join(', ')||'None'}
Hapchung: ${hapchung.summary||'None'}
Natal tensions: ${loveCtx?.spouseScore?.factors?.join('; ')||'None'}

RELATIONAL STRUCTURE — ENGINE-CONFIRMED VALUES (copy exactly into s3 snapshot fields):
- intimateAxisStability: ${chartSummary.relStruct ? chartSummary.relStruct.intimateAxisStability : 50}
- attractionIntensity: ${chartSummary.relStruct ? chartSummary.relStruct.attractionIntensity : 50}
- attachmentStability: ${chartSummary.relStruct ? chartSummary.relStruct.attachmentStability : 50}
- commitmentReadiness: ${chartSummary.relStruct ? chartSummary.relStruct.commitmentReadiness : 'Conditional'}
- relationalVolatility: ${chartSummary.relStruct ? chartSummary.relStruct.relationalVolatility : 'Moderate'}
- structuralNotes: ${chartSummary.relStruct ? chartSummary.relStruct.structuralNotes.join(', ') : ''}
Partner Palace is now called "Intimate Axis" — do NOT use "Partner Palace" or "배우자궁" in output.

NARRATIVE ANCHORS (locked — use these verbatim as the conceptual spine):
- Core identity: ${g(step1,'narrativeAnchors','coreStrength')}
- Core tension: ${g(step1,'narrativeAnchors','coreTension')}
- Missing element effect: ${g(step1,'narrativeAnchors','missingElementEffect')}
- Relationship pattern: ${g(step1,'narrativeAnchors','relationshipPattern')}
- Ideal partner: ${g(step1,'narrativeAnchors','idealPartner')}
- Wealth pattern: ${g(step1,'narrativeAnchors','wealthPattern')}
- Career direction: ${g(step1,'narrativeAnchors','careerDirection')}
- Hard times: ${g(step1,'narrativeAnchors','hardTimes')}
- Good times: ${g(step1,'narrativeAnchors','goodTimes')}

GRAND TIDES (대운) DATA:
${daewonCtx.fullContext}

INTERACTION ENGINE DATA:
${interactionCtx.fullContext}

---
Generate exactly 5 sections. Return ONLY valid JSON (no markdown, no backticks).

{
  "s1": {
    "title": "Your Core Energy System",
    "energyScore": "${chartSummary.energyProfile ? chartSummary.energyProfile.energyScore : 50}",
    "pressureScore": "${chartSummary.energyProfile ? chartSummary.energyProfile.pressureScore : 50}",
    "systemState": "${chartSummary.energyProfile ? chartSummary.energyProfile.systemState : 'Balanced'}",
    "resourceLevel": "${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.resource.level : 'Medium'}",
    "outputLevel": "${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.output.level : 'Medium'}",
    "wealthLevel": "${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.wealth.level : 'Medium'}",
    "authorityLevel": "${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.authority.level : 'Medium'}",
    "peerLevel": "${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.peer.level : 'Medium'}",
    "energyAnalysis": "<Write exactly 4 sentences. Maximum 90 words total. Each sentence under 20 words. Structure: Sentence 1 — which energy forces dominate this chart (Output/Wealth/Authority/Resource/Peer levels: ${chartSummary.energyProfile ? `Resource=${chartSummary.energyProfile.distribution.resource.level}, Output=${chartSummary.energyProfile.distribution.output.level}, Wealth=${chartSummary.energyProfile.distribution.wealth.level}, Authority=${chartSummary.energyProfile.distribution.authority.level}` : ''}) and what structural state that creates. Sentence 2 — the natural behavioral consequence: how this person operates day-to-day. Sentence 3 — the core structural risk if this is left unmanaged. Sentence 4 — one sharp insight that reframes the structure. End with a memorable closing line like 'This structure rewards X, but only when Y.' Tone: analytical report. No metaphors. No element names.>",
    "rechargeBody": "<3-4 sentences. Explain how this person's system naturally restores energy based on Resource level: ${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.resource.level : 'Medium'}. What environments, activities, or inputs help them recover? What happens when they skip recovery? Real-life examples only.>",
    "expressionBody": "<3-4 sentences. Explain their natural expression and output tendency based on Output level: ${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.output.level : 'Medium'}. When does their energy flow most naturally? What kind of work activates them? Real-life examples only.>",
    "opportunityBody": "<3-4 sentences. Explain how they relate to opportunity and wealth-building based on Wealth level: ${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.wealth.level : 'Medium'}. Are they opportunity-seeking or selective? What environments suit them? Real-life examples only.>",
    "structureBody": "<3-4 sentences. Explain their relationship with authority, rules, and organizational structure based on Authority level: ${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.authority.level : 'Medium'}. Do they thrive under structure or resist it? Real-life examples only.>",
    "competitionBody": "<3-4 sentences. Explain their competitive drive and peer dynamics based on Peer level: ${chartSummary.energyProfile ? chartSummary.energyProfile.distribution.peer.level : 'Medium'}. Do they compete directly or carve their own path? How do they behave in team environments? Real-life examples only.>"
  },
  "s2": {
    "title": "Structural Blind Spots",
    "spot1Key": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[0].key : ''}", 
    "spot1Title": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[0].title : ''}",
    "spot1Category": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[0].category : ''}",
    "spot1Severity": ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[0].severity : 0},
    "spot2Key": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[1].key : ''}",
    "spot2Title": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[1].title : ''}",
    "spot2Category": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[1].category : ''}",
    "spot2Severity": ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[1].severity : 0},
    "spot3Key": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[2].key : ''}",
    "spot3Title": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[2].title : ''}",
    "spot3Category": "${chartSummary.blindSpots ? chartSummary.blindSpots.spots[2].category : ''}",
    "spot3Severity": ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[2].severity : 0},
    "spot1Body": "<90-120 words. Blind spot: ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[0].title : ''} (severity ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[0].severity : 0}/100). Structural drivers causing this pattern: ${chartSummary.blindSpots ? (chartSummary.blindSpots.spots[0].drivers || []).join(', ') : ''}. Write 4 parts with NO headers, just flowing paragraphs: (1) The behavioral pattern — what this person consistently does. (2) Why it happens — reference the structural drivers above explicitly, explain the energy dynamic (Resource=${chartSummary.blindSpots ? chartSummary.blindSpots.scores.R : 0}, Output=${chartSummary.blindSpots ? chartSummary.blindSpots.scores.O : 0}, Wealth=${chartSummary.blindSpots ? chartSummary.blindSpots.scores.W : 0}, Authority=${chartSummary.blindSpots ? chartSummary.blindSpots.scores.A : 0}, Peer=${chartSummary.blindSpots ? chartSummary.blindSpots.scores.P : 0}). (3) Real-world consequence. (4) One specific adjustment. Tone: direct diagnostic report, not self-help. No metaphors.>",
    "spot2Body": "<90-120 words. Blind spot: ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[1].title : ''} (severity ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[1].severity : 0}/100). Structural drivers: ${chartSummary.blindSpots ? (chartSummary.blindSpots.spots[1].drivers || []).join(', ') : ''}. Same 4-part structure. Reference drivers explicitly. Direct, diagnostic, no metaphors.>",
    "spot3Body": "<90-120 words. Blind spot: ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[2].title : ''} (severity ${chartSummary.blindSpots ? chartSummary.blindSpots.spots[2].severity : 0}/100). Structural drivers: ${chartSummary.blindSpots ? (chartSummary.blindSpots.spots[2].drivers || []).join(', ') : ''}. Same 4-part structure. Reference drivers explicitly. Direct, diagnostic, no metaphors.>"
  },

  "s3": {
    "title": "Love & Relationship",

    "relationshipStability": "${chartSummary.relStruct ? chartSummary.relStruct.intimateAxisStability : 50}",
    "attractionIntensity":   "${chartSummary.relStruct ? chartSummary.relStruct.attractionIntensity : 50}",
    "commitmentReadiness":   "${chartSummary.relStruct ? chartSummary.relStruct.commitmentScore : 50}",
    "emotionalDepth":        "${chartSummary.relStruct ? chartSummary.relStruct.emotionalDepth : 50}",
    "volatilityScore":       "${chartSummary.relStruct ? chartSummary.relStruct.volatilityScore : 40}",
    "volatilityLabel":       "${chartSummary.relStruct ? chartSummary.relStruct.volatilityLabel : 'Moderate'}",
    "attractionType":        "${chartSummary.relStruct ? chartSummary.relStruct.attractionType : 'Independent & Self-Directed'}",
    "stabilityType":         "${chartSummary.relStruct ? chartSummary.relStruct.stabilityType : 'Calm & Grounded'}",
    "passionYears":          "${chartSummary.loveCtx ? chartSummary.loveCtx.timing.passionYears.slice(0,3).join(', ') : ''}",
    "commitWindow":          "${chartSummary.loveCtx ? chartSummary.loveCtx.timing.commitWindow : ''}",

    "loveNature": "PLACEHOLDER",

    "attractedToYou": "",

    "redFlagPattern": "PLACEHOLDER",

    "heartbreakPattern": "PLACEHOLDER",

    "timingBody": "<SECTION 6 — Relationship Timing. 70-100 words. Attraction Windows (${chartSummary.loveCtx ? chartSummary.loveCtx.timing.passionYears.slice(0,3).join(', ') : ''}) -- describe what romantic energy activates and what to do with it. Commitment Window (${chartSummary.loveCtx ? chartSummary.loveCtx.timing.commitWindow : ''}) -- describe stability energy and long-term potential. End with one sentence on the overall romantic arc. Tone: encouraging and optimistic. No mystical language. No saju terms. Format: Attraction Windows (years) -- body. Commitment Window (years) -- body. Overall, ...>"
  },
  "s4": {
    "title": "Money, Work & Power",

    "wealthTiming": ${chartSummary.moneyEngine ? JSON.stringify(chartSummary.moneyEngine.wealthTiming.slice(0,3)) : '[]'},

    "financialNature": "<5 sentences max. 100 words max. Describe how this person fundamentally generates money. Use: Wealth Mode=${chartSummary.financialProfile ? chartSummary.financialProfile.wealthMode : ''}, Money Flow=${chartSummary.moneyEngine ? chartSummary.moneyEngine.moneyFlowLabel : ''}, Wealth Source=${chartSummary.moneyEngine ? chartSummary.moneyEngine.wealthSourceLabel : ''}. Explain whether they earn through opportunity, systems, creativity, or relationships. Describe when income accelerates vs slows. Make it feel like a personal revelation. No saju terms. No scores. Conversational but insightful.>",

    "moneyFriction": "<4 sentences max. 80 words max. Explain why money sometimes feels uneven or frustrating for this person. Use: Financial Risk=${chartSummary.moneyEngine ? chartSummary.moneyEngine.financialRisk : ''}, Retention=${chartSummary.financialProfile ? chartSummary.financialProfile.retentionLabel : ''}. Describe the specific timing or behavior pattern that causes frustration. Make the reader feel seen — like you understand exactly why things feel slower than they should. End with a note of relief: this isn't a permanent problem. No saju terms.>",

    "hiddenAdvantage": "<4 sentences max. 80 words max. Describe a financial strength this person may not fully recognize. Use: Financial Advantage=${chartSummary.moneyEngine ? chartSummary.moneyEngine.financialAdvantage : ''}. Make it feel like a revelation — something they do naturally that others struggle with. Connect it to real-life situations (deals, career, projects). No saju terms. Empowering but specific.>",

    "costlyPattern": "<4 sentences max. 80 words max. Describe the one behavioral pattern that costs this person money most. Use: Financial Risk=${chartSummary.moneyEngine ? chartSummary.moneyEngine.financialRisk : ''}, Wealth Mode=${chartSummary.financialProfile ? chartSummary.financialProfile.wealthMode : ''}. Be direct and specific — not harsh, but honest. Describe exactly what this looks like in real life. End with one concrete reframe. No saju terms.>",

    "turningPoint": "<5 sentences max. 100 words max. Describe the financial turning point period: ${chartSummary.moneyEngine && chartSummary.moneyEngine.wealthTiming[0] ? (chartSummary.moneyEngine.wealthTiming[0].endYear && chartSummary.moneyEngine.wealthTiming[0].endYear !== chartSummary.moneyEngine.wealthTiming[0].year ? chartSummary.moneyEngine.wealthTiming[0].year + '–' + chartSummary.moneyEngine.wealthTiming[0].endYear : chartSummary.moneyEngine.wealthTiming[0].year) : 'upcoming years'}. Explain what shifts during this window. What type of opportunities emerge? What earlier efforts start paying off? Make it hopeful but grounded — not magical, but realistic momentum. The reader should feel like there is something worth preparing for. No saju terms.>"
  },
  "s5": {
    "title": "Your Life Activation Map",
    "subtitle": "<one line — the overall arc of this life in plain English>",
    "peakWindow": "<80 words. Peak window: ${chartSummary.lamPeak ? chartSummary.lamPeak.startYear + '–' + chartSummary.lamPeak.endYear + ' (score ' + chartSummary.lamPeak.score + '/100, ages ' + chartSummary.lamPeak.age + '–' + (chartSummary.lamPeak.age+9) + ')' : 'upcoming'}. ${chartSummary.lamPeak && chartSummary.lamPeak.startYear <= new Date().getFullYear() && new Date().getFullYear() <= chartSummary.lamPeak.endYear ? 'You are currently IN this peak.' : ''} What makes this period powerful? What should be initiated or locked in? Be specific and concrete. No saju terms.>",
    "cautionWindow": "<70 words. Caution period: ${chartSummary.lamCaution ? chartSummary.lamCaution.startYear + '–' + chartSummary.lamCaution.endYear + ' (score ' + chartSummary.lamCaution.score + '/100, ages ' + chartSummary.lamCaution.age + '–' + (chartSummary.lamCaution.age+9) + ')' : 'a period ahead'}. What slows down during this time? What should be preserved rather than pushed? Frame as a season for consolidation, not failure. No saju terms.>",
    "closingLine": "<one powerful sentence that captures the essence of this chart's life purpose — metaphorical, memorable, not generic>"
  }
}

RULES:
- Return ONLY a valid JSON object. No preamble, no explanation, no markdown fences.
- Use ONLY plain ASCII punctuation: straight double quotes, hyphens (not em-dashes), apostrophes only inside values if needed.
- No newlines inside string values. No trailing commas. No unescaped quotes inside strings.
- Keep each card body under 120 words to fit within the token limit. DO NOT truncate the JSON — every key must be present and the object must be fully closed with }.
- If a value would be too long, shorten it. A complete short JSON is far better than a truncated long one.
- Do NOT add any keys not listed in the schema above.
`;

    const raw2 = await callGPT(SYSTEM_BASE, PROMPT_STEP2, 4000);
    const step2 = parseJSON(raw2);

    // Inject relationship templates from engine (deterministic)
    if (step2 && step2.s3 && chartSummary.relStruct) {
      const rs = chartSummary.relStruct;
      if (rs.redFlagKey)       step2.s3.redFlagPattern    = rs.redFlagKey + '\n' + rs.redFlagBody;
      if (rs.loveNatureKey)    step2.s3.loveNature        = rs.loveNatureKey + '\n' + rs.loveNatureBody;
      if (rs.heartbreakKey)    step2.s3.heartbreakPattern =
        'THE TYPE THAT BREAKS YOUR HEART\n' + rs.heartbreakKey + '\n' + rs.heartbreakBody + '\n\n' +
        'THE TYPE THAT LOVES YOU RIGHT\n' + (rs.lovesYouRightKey || '') + '\n' + (rs.lovesYouRightBody || '');
    }

    // 6. Build payload - escape all non-ASCII to avoid encoding issues
    function escapeNonASCII(str) {
      return str.replace(/[^\x00-\x7F]/g, ch => {
        const code = ch.codePointAt(0);
        if (code > 0xFFFF) {
          // surrogate pair
          const hi = Math.floor((code - 0x10000) / 0x400) + 0xD800;
          const lo = ((code - 0x10000) % 0x400) + 0xDC00;
          return '\\u' + hi.toString(16).toUpperCase() + '\\u' + lo.toString(16).toUpperCase();
        }
        return '\\u' + code.toString(16).toUpperCase().padStart(4, '0');
      });
    }

    const jsonStr = escapeNonASCII(JSON.stringify({ step1, step2, birth, chartSummary }));
    const payload = Buffer.from(jsonStr).toString('base64');

    // ── Supabase에 영구 저장 (공유 링크 + 이메일 매핑)
    let reportId = null;
    try {
      reportId = Math.random().toString(36).slice(2, 8); // 6자리 slug
      const { error: dbErr } = await supabase.from('reports').insert({
        id:         reportId,
        email:      email || 'unknown',
        payload:    payload,
        payment_id: paymentIntentId,
      });
      if (dbErr) {
        console.error('Supabase insert error:', dbErr.message);
        reportId = null; // 실패 시 hash 폴백
      }
    } catch (dbEx) {
      console.error('Supabase exception:', dbEx.message);
      reportId = null;
    }

    // ── 이메일 발송 (리포트 저장 직후)
    console.log('Email debug:', { email, reportId, birthEmail: birth.email });
    if (email && email !== 'unknown' && reportId) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://saju-blueprint.vercel.app';
      const reportUrl = `${baseUrl}/result?id=${reportId}`;
      const name = birth.name || 'there';
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'The Saju Blueprint <hello@sajublueprint.com>',
          to: email,
          subject: 'Your Saju Blueprint is ready ✦',
          html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0b0f1e;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f1e;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td align="center" style="padding-bottom:28px;">
          <p style="margin:0;font-size:11px;letter-spacing:5px;color:#c9a84c;text-transform:uppercase;">✦ The Saju Blueprint ✦</p>
        </td></tr>

        <tr><td style="background:#131929;border:1px solid rgba(201,168,76,0.3);padding:44px 40px;">

          <h1 style="margin:0 0 12px;font-size:28px;font-weight:400;color:#e8dfc8;text-align:center;letter-spacing:0.5px;">
            Your Blueprint is ready.
          </h1>
          <p style="margin:0 0 36px;font-size:15px;color:rgba(232,223,200,0.55);text-align:center;line-height:1.7;">
            Hi ${name} — your personalized Saju destiny report<br>has been generated and is waiting for you.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
            <tr><td align="center">
              <a href="${reportUrl}"
                style="display:inline-block;background:#c9a84c;color:#0b0f1e;
                font-family:'Georgia',serif;font-size:14px;letter-spacing:3px;
                font-weight:700;text-transform:uppercase;padding:18px 52px;
                text-decoration:none;">
                View My Blueprint ✦
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 6px;font-size:12px;color:rgba(232,223,200,0.3);text-align:center;">
            Or open this link in your browser:
          </p>
          <p style="margin:0 0 36px;font-size:12px;color:rgba(201,168,76,0.7);text-align:center;word-break:break-all;line-height:1.6;">
            ${reportUrl}
          </p>

          <hr style="border:none;border-top:1px solid rgba(201,168,76,0.08);margin:0 0 28px;">

          <p style="margin:0;font-size:13px;color:rgba(232,223,200,0.35);text-align:center;line-height:1.8;">
            Bookmark your link — it's your permanent access to this report.<br>
            If you run into any issues, reach us at<br>
            <a href="mailto:thesajublueprint@gmail.com"
              style="color:rgba(201,168,76,0.6);text-decoration:none;">
              thesajublueprint@gmail.com
            </a>
          </p>

        </td></tr>

        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:11px;color:rgba(232,223,200,0.2);letter-spacing:2px;text-transform:uppercase;">
            The Saju Blueprint &nbsp;·&nbsp; Korean Four Pillars Destiny Report
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
        }),
      });
      console.log('Email sent to:', email);
    }

    res.json({ payload, reportId, success: true });

  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: err.message || 'Generation failed' });
  }
};