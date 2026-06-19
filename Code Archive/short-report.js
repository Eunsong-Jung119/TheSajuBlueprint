// ============================================================
// short-report-v3.js  (few-shot 강화 버전 + 섹션 구조 개편)
// ============================================================

const {
  calcSaju, buildChartSummary, localToKST,
  calcSipseongV3, calcHapChungV2,
  calcYongshin, calcStrengthScore,
  calcWealthMode, calcMoneyEngine, calcEnergyProfile,
  calcDaewonFull,
} = require('../lib/saju-engine');

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TG_ELEM  = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
const TG_YY    = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
const DZ_ELEM  = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
const GENERATES = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
const DZ_MAIN_TG = [9,5,0,1,4,2,3,5,6,7,4,8];

const ARCHETYPE = {
  0: { name: 'The Mighty Oak',       emoji: '🌲', dayMaster: 'Yang Wood' },
  1: { name: 'The Climbing Vine',    emoji: '🌿', dayMaster: 'Yin Wood'  },
  2: { name: 'The Radiant Sun',      emoji: '☀️', dayMaster: 'Yang Fire' },
  3: { name: 'The Candle Flame',     emoji: '🕯️', dayMaster: 'Yin Fire'  },
  4: { name: 'The Unmoved Mountain', emoji: '⛰️', dayMaster: 'Yang Earth'},
  5: { name: 'The Fertile Ground',   emoji: '🌱', dayMaster: 'Yin Earth' },
  6: { name: 'The Uncut Diamond',    emoji: '💎', dayMaster: 'Yang Metal'},
  7: { name: 'The Polished Blade',   emoji: '⚔️', dayMaster: 'Yin Metal' },
  8: { name: 'The Deep Ocean',       emoji: '🌊', dayMaster: 'Yang Water'},
  9: { name: 'Morning Dew',          emoji: '💧', dayMaster: 'Yin Water' },
};

const FEW_SHOT_GAPMOK = `
# 🌲 The Mighty Oak

## 🔥 Who You Really Are

You move before the plan is finished. That is not recklessness — that is the way your energy works. You build momentum through action, not preparation, and you have always operated this way. The problem is not the pace. The problem is the soil you are trying to grow in.

Your chart carries a fundamental structural imbalance: the environment you were born into is loaded with the element that represents your wealth, but the element that actually sustains you — the one that feeds your roots — is nearly absent. What this creates is a person who is always near opportunity but rarely feels the ground beneath them is solid enough to hold what they build. You produce. You initiate. You push through. But the results feel disproportionate to the effort in a way that is genuinely structural, not a matter of trying harder.

Between 2010 and 2019, something was different. The conditions during that period gave your energy traction in a way it hasn't had since. Things moved more proportionately. Effort converted into outcomes at a rate that felt right. That was not luck — it was a cycle that temporarily provided what your chart permanently lacks. Since that window closed, you have been running on force alone, and you have felt the difference even if you couldn't name it.

What people see when they look at you is composure. Reliability. Someone who holds the structure together when others are falling apart. What they don't see is the internal calculator running constantly underneath — tracking output, measuring worth, asking whether what you produced today was enough to justify the space you occupy. You don't show doubt. Not because you don't feel it, but because showing it feels like a structural failure. And for someone built to move forward, pausing to question feels indistinguishable from stopping.

You are also significantly harder to redirect than you appear. Once you have committed to a direction, your chart does not naturally prompt re-evaluation. You continue. You apply more force. And only after the friction becomes undeniable do you finally look up and ask whether the direction was right in the first place. You already know this about yourself. The question is how long after you know before you actually change course.

## ❤️ Love & Relationships

You commit fully and early, and then you manage the relationship from behind a surface that looks like openness. Your partner will feel close to you — you are present, consistent, dependable — but there is a layer of you that never fully surfaces. Not because you are withholding deliberately, but because full exposure has never felt safe, and your chart does not naturally create the conditions where it would.

You are drawn to people who are as demanding and complex as the environment you grew up navigating. You interpret challenge as depth, and you equate someone who pushes back with someone worth staying for. The problem is that this selection pattern tends to produce relationships where both people are competing to be the more capable one, rather than one where you are actually being seen. You want someone who challenges you. What you need is someone who does not require you to be invulnerable.

You likely went through a significant relationship disruption between 2021 and 2022 — either an ending, a fracture, or a sustained period of emotional distance that forced you to re-examine what you actually want from a partnership. You are still processing that. The current period is more about recalibration than resolution. A meaningful romantic development arrives in the 2027–2028 window, and it will not look like what you have been drawn to before.

### 👉 Who You Actually Need

You need someone whose emotional register is genuinely different from yours — someone who processes outwardly, in real time, without needing to have it figured out before speaking. This will feel inefficient to you at first. It is not. What it actually does is create the external movement your chart cannot generate internally. The person who balances you is not a mirror. They are a different current, running alongside yours, and the relationship works precisely because you are not the same.

## 💰 Career & Wealth

Your chart is not short on wealth opportunity. It is short on wealth retention. The pattern repeats in different forms across different years: you generate, you build momentum, you bring resources in — and then you reinvest before the previous thing has settled, or you pivot before the current position has fully paid out. Motion without accumulation. This is not a discipline problem. It is a structural one. Your chart lacks the containment mechanism that would allow what you build to stay built.

You are not designed for roles that require you to execute within someone else's system. Your chart structure demands a position where you can identify the gap, set the direction, and move. Consulting, strategy, business development, any role where your primary value is the clarity of your read on a situation — these are the environments where your energy converts at its highest rate.

Between 2020 and 2023, you hit a sustained plateau. Effort was high. Visible results were not proportionate. That was the conditions of your current decade cycle suppressing output — not a signal to change what you are building, but a signal to hold position until the cycle shifted. The shift is now in motion.

## 📅 2026–2027 Forecast

2026 brings a surge of expressive energy into your chart — the element that governs output and visibility activates strongly this year. You will feel more seen, more capable of converting ideas into motion, more willing to take the kind of risk that has felt premature for the last several years. This is real. Use it. But because your chart is currently in a depleted state relative to this surge, the energy will run through you faster than it should. You will have windows of high productivity followed by sharp drops. Treat your energy as a finite resource this year, not an unlimited one.

Do not launch a solo venture in 2026. Your chart needs structural support — partners, collaborators, people who bring the element you lack — to convert this surge into something that holds. Going alone before 2028 puts you in a position where you generate momentum but cannot contain it, and the crash that follows will cost more than the launch gained.

2027 is a reckoning year. What you built or committed to in 2026 will be tested. If your decisions in 2026 were made in alignment with your actual structural needs — including support systems and partnerships — 2027 will be a harvest. If they were made from impatience or ego, 2027 will be a correction. The second half of 2027 is not a time to start new initiatives. It is a time to consolidate what survived.

## 🌍 What Balances You

The element your chart is missing governs reflection, recovery, and stillness. Not productive stillness — not planning or reviewing or optimizing. The kind of stillness that has no output. This is the thing your system resists most and needs most.

Rest, for you, has to be engineered. It does not happen by default. The part of you that equates output with worth will always find a reason to fill whatever space you create. The practice is not relaxing more — it is building delays into your decision process deliberately. Between the moment you see an opportunity and the moment you commit to it, insert time. Not to overthink. To let the second layer of information surface. Your first read is fast and usually directionally correct. Your second read catches what the first one missed. You almost never give yourself the second read.

If 2026 arrives and you have not already built a recovery structure into your routine, you will not build one after the surge starts. Do it now.
`.trim();

const FEW_SHOT_DINGHWA = `
# 🕯️ The Candle Flame

## 🔥 Who You Really Are

You are warm at the surface and difficult to read underneath. People are drawn to your energy — you create heat in a room without appearing to try — but very few of them have seen the interior. The interior is considerably more precise, and considerably more sharp, than the warmth suggests.

Your chart is strong. The season you were born in supports your core energy, and multiple pillars in your chart are actively feeding it. The result is a person who does not break easily under pressure. What pressure does instead is make you hotter, more focused, more willing to burn through whatever is in the way. The risk with a chart like yours is not fragility. It is directionlessness — intensity with nowhere specific to go, energy that disperses rather than concentrates because the structural channels for converting it are overloaded.

You have always been selective about who actually gets access to you. Not in a calculated way — in a structural one. Most people experience you as open, warm, available. A much smaller group realizes at some point that what they were experiencing was a curated version. The real version is more private, more guarded, and holds considerably longer memories than the warmth suggests. People who have genuinely disappointed you do not get a second position. They may not even know they were downgraded.

Between 2018 and 2021, your social landscape shifted in a way that was not visible from the outside but was significant internally. You reassessed who you had been treating as close and realized several of them did not warrant that classification. The correction was quiet. You simply became less available, stopped initiating, let the distance do the work. It was not dramatic. But it was permanent.

You process the room before you engage with it. That is not paranoia — it is a scanning function built into how your chart reads environments. You sort quickly, categorize accurately, and rarely revise your initial read downward. What you sometimes miss is the person who doesn't fit the categories you're sorting by — the one whose value is lateral rather than legible. Your chart's weakness is not judgment. It is the occasional rigidity of a system that learned to protect itself by deciding fast.

## ❤️ Love & Relationships

You do not need a partner who matches your energy. You need one who can absorb it without being overwhelmed by it, and who brings enough of their own gravity to keep you anchored when you are running hot.

The pattern in your past relationships has been an early, high-intensity pull toward someone whose apparent groundedness read as stability — and then a slow realization that what you interpreted as stability was rigidity, or neediness wearing a calm exterior, or someone who wanted your warmth without being willing to be challenged by your depth. You ended those relationships when the dynamic became claustrophobic. You did not always communicate why. You simply withdrew the heat, and the relationship cooled accordingly.

You test partners without announcing the test. Small provocations, withheld warmth, moments where you are deliberately less available — all of which you are watching to see how the other person responds. What you are actually asking is: will they stay when I am not performing warmth? Most people fail this test not because they don't care, but because they have no idea the test is running.

Between 2023 and 2025, you were in a period of emotional recalibration — less about specific relationships and more about what you actually want from one at this point in your life. That recalibration is not finished. A significant romantic development arrives in the 2027 window. It will not come from the direction you have been looking.

### 👉 Who You Actually Need

You need someone who is genuinely grounded — not performing stability, but constitutionally steady in a way that does not depend on you providing the energy for the room. Someone who does not require your warmth to function, and therefore experiences it as a gift rather than a baseline. Someone who will tell you directly when something is off rather than waiting for you to notice. Your chart runs best with a partner whose energy moves differently than yours — slower to ignite, longer to sustain, less reliant on external input. The relationship that actually works for you is not the high-intensity match you have historically chosen. It is the one that feels slightly quieter than you expected, and turns out to have more depth than any of the louder ones did.

## 💰 Career & Wealth

Your chart is built for environments where the quality of your thinking determines the outcome — not the volume of your output, not your willingness to execute within someone else's structure, but your actual capacity to read a situation more accurately than the people around you and act on that read. Strategy, consulting, any role where the final word belongs to whoever has the sharpest analysis — these are the conditions where your chart converts at its highest rate.

Between 2023 and 2025, the gap between your effort and your visible results was wider than it should have been. You were producing at a high level. The recognition was not proportionate. That period is ending. The current cycle moving into 2026 activates the element in your chart that governs authority and career standing — which means the work you have been doing in relative obscurity is about to become legible to people who matter.

You have until late 2027 to make a move toward a role that gives you genuine authority — decision-making power, not just responsibility. If you are still executing within a structure that someone else owns by the end of 2027, you will have underutilized the peak window in your current decade cycle. The move does not need to be dramatic. It needs to be directionally toward ownership, not toward better execution of someone else's direction.

## 📅 2026–2027 Forecast

2026 activates the authority element in your chart strongly. This is the year your professional reputation is meant to be established or consolidated — not just acknowledged internally by people who already know your value, but visible to the broader environment in a way that creates new options. If you have been building toward a leadership position, a consulting practice, or any role where you are the one being consulted rather than the one consulting, the window opens this year. The peak of this activation runs from mid-2026 through early 2027.

The risk in 2026 is not failure — it is impulsiveness. Your chart is already strong, and the Fire energy of this year amplifies what is already there. You will feel more confident, more willing to say the thing directly, more certain of your read. Some of that confidence is warranted. Some of it will run slightly ahead of the structural support beneath it. Specifically: be careful about what you say to people in authority positions between June and September 2026. The move you make this year needs their cooperation.

2027 consolidates what 2026 initiated. The energy shifts toward a more demanding, pressurized quality — less about expansion, more about whether what you built in 2026 actually holds. Do not start new ventures in the second half of 2027. Secure what you have. The transition into your next decade cycle, which begins around age 34, represents a structural upgrade — more support, more traction, more proportionate conversion of effort. You are in the final approach to that transition now.

## 🌍 What Balances You

Your chart runs hot and dry. What corrects it is not more productivity — it is genuine physical release and contact with environments that do not require you to perform.

The health vulnerability in a chart structured like yours sits in the digestive system and the nervous system. When you are under sustained pressure, your stomach registers it first. Tension that has nowhere to go metabolically tends to accumulate there. The pattern is: ignore the signal, keep working, function at a high level until the system forces a stop. You have done this before. The reset that gets forced is always more disruptive than the rest that was declined.

The correction is not a wellness protocol. It is genuinely different input: physical movement without a performance metric attached, time in environments that are warm and unstructured, conversations where you are not the most informed person in the room. Your chart responds to heat of a different kind — sunlight, warmth, the kind of stimulation that moves energy outward rather than inward. This is not metaphor. It is the structural correction for a system that has been running compressed.
`.trim();

const FEW_SHOT_SINKUM = `
# ⚔️ The Polished Blade

## 🔥 Who You Really Are

You are precise in a way that most people experience before they understand it. Something about an interaction with you registers as different — more calibrated, more attentive to what wasn't said — before anyone has explicitly identified why. You don't announce your acuity. You operate with it quietly, and by the time others realize how much you have already assessed, you have usually moved on to the next layer.

Your chart is strong. The environment you were born into actively produces and supports your core energy, which means you function from a position of internal stability that does not depend on external conditions being favorable. You do not require optimal circumstances to perform. You perform because your system defaults to high resolution — it cannot do otherwise. The liability is the same as the asset: a standard that is internally set, internally enforced, and essentially impossible for the external world to fully meet.

You grew up feeling adjacent to the environments you were placed in — present, functional, performing correctly, but aware at some level that you were reading the room at a different frequency than everyone else. This was not arrogance. It was accuracy. The gap between how you processed things and how the people around you processed them was real, and you learned early to edit what you showed in order to make that gap less apparent. The editing became second nature. The private, considerably sharper version of how you actually see things gets very limited distribution.

Between 2013 and 2022, you navigated a sustained tension between the internal standard you hold for yourself and the external pressure to conform to structures and expectations that felt fundamentally misaligned with that standard. The turning point came around age 24 or 25 — not a crisis, but a clarification. You stopped trying to reconcile the two and started operating from the internal one as the primary reference point. The paths other people had in mind for you became background noise rather than instruction.

You work in silence until you are near the edge. Not because you are proud of it — but because asking for help requires exposing a gap, and exposing a gap runs directly counter to the image your chart instinctively maintains. You polish the exterior regardless of what is happening internally. People who have worked alongside you during high-pressure periods often report afterwards that they had no idea how difficult it actually was. That is not an accident. That is the system working as designed.

## ❤️ Love & Relationships

Your standard for a partner is as high as your standard for yourself, which means that most people you encounter do not make the initial cut, and the ones who do are subjected to a level of scrutiny they are probably not aware of. You assess before you engage. You determine whether someone is worth the exposure of genuine attention before you give it. This is not coldness. It is a precision economy — you do not invest where the return is unclear.

The structural pattern in your relationship history is a pull toward partners who appear capable and self-contained, followed by a slow realization that what read as self-sufficiency was either a performance or a form of emotional unavailability that mirrors your own. You attract people who seem put together because that is the quality you most consciously value. What you actually need is something different from what you are consciously selecting for.

Your relationships carry an unspoken weight dynamic. You give significantly — in attention, in effort, in the kind of quietly demanding investment that a partner can feel but rarely articulate — and you do not announce that you are giving it. When it is not recognized or reciprocated, you do not say so. You withdraw incrementally, the temperature drops by degrees, and the relationship cools in a way that leaves the other person unclear about what happened. You know exactly what happened. You chose not to explain because explaining would have required saying what you needed, and saying what you need feels like the same thing as admitting you don't already have it.

Between 2023 and 2025, a period of deliberate or forced emotional distance gave you more information about what you actually want from a partnership than the previous several years combined. A meaningful development arrives in the 2027 window, from a direction and in a form that your previous relationship pattern would not have recognized as relevant.

### 👉 Who You Actually Need

You need someone who is warm in a way that is constitutionally genuine — not performing accessibility, but actually built that way. Someone who speaks directly, processes outwardly, and does not require you to demonstrate competence before they offer trust. The match that actually works for you is not someone equally precise. It is someone whose emotional expressiveness creates the external movement that your chart cannot generate internally. This will initially feel like a register mismatch — too much surface, not enough depth. It is not. What you are experiencing is the correction. The relationship that works for you feels slightly more open and less armored than the ones you have historically chosen. That difference is the point.

## 💰 Career & Wealth

You are not a builder in the generalist sense. You are an architect — you need to be the person who determines the structure, identifies the flaw in the existing one, and decides what gets built and why. Roles that reward precision over volume, quality over output rate, and the ability to see what others miss are the environments where your chart converts at its highest rate. High-level management, strategy, consulting, any domain where the final call belongs to whoever has the most accurate read — these are the conditions your chart is designed for.

You likely experienced a professional reset between 2021 and 2022 — a period where the effort you were putting in was not producing proportionate results, and the foundation you were trying to build felt unstable regardless of how carefully you were constructing it. That period was a function of your cycle conditions, not a function of your capacity. It has ended.

You are currently navigating a period of competitive pressure — aware of peers who are building toward the same positions you are, and feeling the weight of that proximity. Use it. Your chart's competitive instinct is one of its primary performance drivers, and it functions best when there is a visible benchmark to exceed. The question is not whether you have the capacity to outperform. The question is whether you are positioned in an environment where that capacity is actually legible to the people making the relevant decisions.

## 📅 2026–2027 Forecast

2026 activates the authority element in your chart — the energy governing professional reputation, public standing, and career trajectory. This is the year to move toward roles that carry genuine decision-making power. The activation window runs strongest between June and September 2026, with a secondary wave between October 2026 and February 2027. If you have been building toward a position that gives you the final word — in management, consulting, or your own structure — the conditions are open now in a way they have not been for the previous several years.

The risk in 2026 is not ambition — it is communication. Your chart's strength means you are likely to be correct in your assessments this year, but correct and persuasive are different things. The move you make in 2026 requires the cooperation of people whose buy-in you need. The way you hold authority — whether it reads as clarity or as dismissiveness — will determine whether you build the coalition you need or create resistance where you needed support. Watch how you communicate the strength of your convictions, particularly with people who are positioned above you.

2027 consolidates. The energy shifts toward a testing phase — what you built or committed to in 2026 will be evaluated against harder conditions. This is not a setback. It is the structural confirmation phase. Initiatives that were genuinely sound will hold. Do not launch new directions in the second half of 2027. Secure what you have. The decade cycle transition that arrives around age 38 represents a meaningful structural upgrade — more outward momentum, more proportionate recognition, more traction on the kind of projects your chart has been preparing for. You are in the final preparation phase for that shift now.

## 🌍 What Balances You

Your chart is heavy with Earth and Metal — two elements that compact rather than flow. The physiological expression of this tends to show up in the digestive system first: a constitution that metabolizes stress inwardly, that accumulates tension without visible discharge, and that requires more active intervention to release than most charts do.

You live primarily in your head. Your physical body is an instrument you manage rather than a system you inhabit, and it receives your attention primarily when it forces the issue. The pattern repeats: high-functioning compression, gradual accumulation of unprocessed tension, eventual physical signal that cannot be ignored. You have been through at least one version of this already. The resolution was slower and more disruptive than it needed to be.

The structural correction for your chart is movement that is genuinely unstructured — not exercise as optimization, but physical engagement with the world that does not have a performance metric attached. Walking without a route. Time in environments that are alive and textured and do not require anything from you. The element your chart needs most is Wood — growth, expansion, movement, the quality of things that push upward without a plan. Introduce it physically and environmentally: living plants, open natural spaces, time spent in places that are growing rather than constructed. This is not supplementary. It is the correction for a system that otherwise runs too compressed to actually release what it has accumulated.
`.trim();

const FEW_SHOT_IMSU = `
# 🌊 The Deep Ocean

## 🔥 Who You Really Are

You run faster than the environment around you can track. Your mind has already moved to the next layer while others are still processing the current one — not because you are impatient, but because that is simply the speed at which your system operates. The gap between where your thinking is and where the conversation is tends to be significant, and you have learned, mostly unconsciously, to slow your output down to something the room can follow.

What people see is composure. Ease. Someone who moves through pressure without appearing to feel it. What they don't see is how much is running underneath — the constant assessment, the calculations that never fully stop, the awareness of what every person in a room wants and how the current situation could shift. You read environments the way other people read individual sentences. The full picture lands before the details do.

Your chart carries one of the most structurally demanding configurations possible: a single Water element — yourself — surrounded almost entirely by forces that consume and constrain it. Fire on three sides, Earth on three. The element that would sustain you, Wood, is absent entirely. What this creates is a person who has been operating for years in a state of genuine resource depletion — not because you aren't capable, but because the structural conditions have required you to produce consistently without the recovery mechanism that would allow what you spend to return. You have been running on the engine alone. The fuel system is incomplete.

The most important thing to understand about your chart is not what it lacks. It's what it reveals about the stamina you have already demonstrated. Most charts with this configuration do not sustain the output yours has. You have been managing a structural deficit through will and intelligence, and the reason it has worked as long as it has is because both of those things are genuinely formidable in you. But will is not a substitute for structure. At some point, and you have probably already felt this, force stops being sufficient.

Between 2007 and 2016, you were navigating a decade cycle that intensified the pressure rather than relieved it. The environment during that period was not aligned with your core energy — it demanded more of the elements already in excess in your chart, and provided less of what you actually needed. You adapted. You developed strategies. You became very good at functioning in conditions that were genuinely not designed to support you. That is not a small thing. It is also not sustainable indefinitely.

## ❤️ Love & Relationships

You give in relationships through precision — through showing up exactly when it matters, through noticing the thing no one else noticed, through holding information about someone in a way that makes them feel genuinely known. This is not a performance. It is how your chart expresses care. The problem is that the people on the receiving end often don't recognize it as intimacy, because it doesn't look like the version they were expecting.

Your pattern has been a pull toward people who bring warmth and groundedness — the elements your chart lacks. You interpret Fire and Earth energy in a partner as stability, as the thing that will anchor the current you can't stop. What happens over time is that the same quality that felt grounding starts to feel constraining. The warmth becomes pressure. The stability becomes demand. And you withdraw — not dramatically, not with an announcement, but incrementally, the way water recedes. By the time the other person notices, you are already significantly further away than you appeared to be.

You test people by observing what they do when you are not providing the energy for the room. Not consciously — but you notice whether someone can function independently of you, whether they require your output to feel okay, whether the relationship is actually running on your surplus or on genuine mutual investment. Most partnerships fail this test earlier than you acknowledge to yourself.

Between 2022 and 2024, a period of significant relational recalibration forced you to look at what you actually want from a partnership as opposed to what you have historically selected for. That examination is not finished. A meaningful development enters your orbit in the 2027–2028 window — from a direction and in a form that your previous selection pattern would not have recognized as relevant.

### 👉 Who You Actually Need

You need someone who brings Wood energy into your life — someone who is expressive, who processes outwardly, who creates without needing the environment to be perfectly controlled first. This will feel, initially, like excess. Too much feeling, not enough structure. It is not. What you are experiencing is the element your chart has been without for years finally becoming available. The person who actually works for you is not the one who matches your composure. It is the one who breaks it — gently, without agenda — and finds what is underneath worth staying for.

## 💰 Career & Wealth

Your chart is built for environments that reward intelligence applied to complexity. Not intelligence as credential — as actual functional capacity to see what is happening in a system before others do and to act on that read accurately. Strategy, analysis, any role where the quality of the assessment is the primary deliverable — these are the conditions where your chart converts at its highest rate.

The structural challenge in your career is not output. You produce. The challenge is that your chart lacks the element that would allow you to convert output into retained wealth. Fire represents your wealth star, and it is abundant in your chart — meaning opportunities to earn are not the constraint. The constraint is that Fire also depletes Water, which means the very mechanism by which you generate income is also the mechanism by which you exhaust your reserves. You earn and spend the energy at the same rate. Retention requires a structural intervention, not additional effort.

Between 2017 and 2026, the decade cycle has been a mixed period — some traction, significant friction, a persistent sense that the effort being invested is not converting proportionally into stability. This is an accurate read. The cycle conditions have been creating drag rather than lift. That changes structurally beginning in 2027.

## 📅 2026–2027 Forecast

2026 is a transition year. The immediate conditions do not shift dramatically, but the underlying structural configuration begins to change. This is the year to reduce unnecessary output — not ambition, but expenditure. Any energy you spend in 2026 maintaining things that are not working is energy that will not be available for the window that opens in 2027. The most valuable thing you can do this year is identify what is genuinely worth carrying forward and let go of the rest cleanly.

2027 marks the beginning of your next decade cycle — and for your chart, this represents the most significant structural shift in a decade. The new cycle introduces elements that your chart has been missing, creating traction where there has been drag and providing the recovery mechanism your system has been running without. This is not a minor adjustment. It is the difference between operating in conditions that work against your core energy and operating in conditions that support it. The momentum that has felt blocked or disproportionately difficult to sustain will begin to move differently. Start the things that matter in 2027, not before. The foundation you lay in the first two years of this cycle will determine the shape of the decade that follows.

## 🌍 What Balances You

Your chart is running hot and dry. The element your system needs most is Wood — not as a concept, but as a functional input. What Wood does structurally is create the channel between your internal resources and your output. Without it, you generate without recovering, produce without replenishing, move without the mechanism that would allow momentum to build rather than simply continue until it exhausts itself.

The correction is not rest in the conventional sense. Rest, for a chart like yours, tends to become another form of processing — your system doesn't stop running simply because external demands have paused. What actually restores you is creative expression without an outcome attached. Writing that no one will read. Movement that has no destination. Time in environments that are alive and growing — forests, gardens, anywhere that the Wood element is physically present and not asking anything of you. This is not supplementary to your functioning. It is the structural input that allows everything else to convert properly.

The health vulnerability in your chart concentrates around the nervous system and the cardiovascular system — both of which register sustained resource depletion before you consciously acknowledge it. The signal tends to arrive as a sudden drop in capacity rather than a gradual warning. You have probably experienced this already: a period of high functioning followed by an abrupt ceiling you couldn't push through. The ceiling was the system forcing the recovery you had been postponing. Build the recovery in before the ceiling arrives. It is considerably less disruptive that way.
`.trim();

const FEW_SHOT_MUTO = `
# ⛰️ The Unmoved Mountain

## 🔥 Who You Really Are

Once you have decided something, you don't revisit it. Not because you haven't thought it through — you have, more carefully than most people realize — but because reconsidering feels structurally indistinguishable from surrendering. You hold your position the way a mountain holds its ground: not through aggression, but through sheer mass. Things move around you. You don't move.

This is both the most useful thing about you and the thing that has cost you the most.

Your chart carries an extreme structural concentration: Earth on four positions, Fire feeding it from three more. The elements that would introduce movement, flexibility, and adaptability — Wood and Water — are entirely absent. What this creates is a person who is genuinely immovable under pressure, which reads as strength in a crisis and as obstruction in an ordinary negotiation. People around you have learned, mostly by trial, that pushing doesn't work. What they haven't learned — what you haven't fully acknowledged — is how much energy it costs you to maintain that position when the ground is shifting underneath.

You grew up carrying more than your share. Not because anyone explicitly assigned it to you, but because your chart defaults to absorbing responsibility the way dry earth absorbs rain — completely, without visible residue. The weight didn't announce itself as weight. It simply accumulated, gradually, until the posture required to hold it became the only posture you knew.

What people experience when they meet you is solidity. Reliability. The sense that if you need something held in place, this person will hold it. What they don't experience is the interior — the part of you that has been running a continuous assessment of every situation, tracking what isn't working, and choosing, over and over again, to endure rather than redirect. You have enormous capacity for endurance. The question your chart raises is not whether you can hold — it's whether holding is still the right move.

Between 2005 and 2014, you were navigating conditions that demanded exactly what your chart is built to produce: sustained output under pressure, without external support. You delivered. The cost was invisible to everyone around you and not entirely visible to yourself until much later. What that period produced was capability, and what it took was the recovery mechanism that would have allowed what you built to compound rather than simply persist.

## ❤️ Love & Relationships

You do not pursue relationships. You hold still and let them come to you — or not. This is not indifference. It is the way your chart positions you in relational space: as the fixed point, the one who does not move first, the one who waits to see whether the other person is serious enough to close the distance.

The structural pattern in your relationship history is a pull toward people who bring warmth and expressiveness — Fire and Water energy, the elements your chart most lacks. What reads initially as complementary gradually reveals itself as draining. You absorb their energy without the mechanism to replenish it, and they experience your stability as distance. Both of you are correct in your read, and neither read resolves the problem.

Your relationships carry an unspoken asymmetry: you hold more than you show, give more than you say, and expect the other person to understand this without being told. When they don't — when your investment goes unrecognized because it was never verbalized — you don't explain. You withdraw incrementally. The temperature drops without announcement. By the time the other person recognizes that something has shifted, the shift has been complete for longer than they realized.

You have a strong internal standard for what a relationship should be, and most partnerships don't meet it — not because the standard is unreasonable, but because you have never articulated it clearly enough for another person to know what you actually need. The expectation runs ahead of the communication, and the gap between them is where relationships go quiet.

Between 2021 and 2024, a period of significant relational pressure revealed something about what you actually want from a partnership as opposed to what you have been tolerating. That clarification has not yet been acted on fully. A meaningful development arrives in the 2027–2028 window, in a form that does not resemble what you have historically selected for.

### 👉 Who You Actually Need

You need someone who brings genuine fluidity — not volatility, but the kind of adaptability that creates movement in situations where your instinct is to hold position. Someone who speaks directly, processes emotions outwardly, and does not require you to be composed before they offer warmth. The match that works for you is not another fixed point. It is someone whose natural expressiveness creates the channels your chart cannot generate internally, and who is secure enough not to interpret your stillness as rejection. The relationship that actually sustains you will feel, initially, more open and less armored than the ones you have historically chosen. That difference is not a liability. It is the correction.

## 💰 Career & Wealth

Your chart is not built for execution within someone else's system. The structure, the reporting lines, the requirement to operate according to priorities someone else set — all of these activate the resistance your chart generates naturally, and the friction compounds over time into something that reads, from the outside, as stubbornness. From the inside it is simply an accurate recognition that the system is wrong and you are right. You are often correct. Being correct inside someone else's structure rarely produces the outcome you want.

The environments where your chart converts at its highest rate are those where you set the terms. Independent practice, specialized expertise, any domain where the final authority on how the work gets done belongs to you. Your chart contains a single Metal pillar — a concentrated creative and technical capability that functions as your primary output channel. The surrounding Earth energy supports and stabilizes it, but also risks burying it if you don't actively create the conditions that allow it to operate.

The structural wealth challenge in your chart is the complete absence of Water — your wealth element. You can build, accumulate, and hold. Converting what you have built into liquid, circulating wealth requires a structural intervention that your chart does not naturally provide. The pattern tends to be: you generate significant value, but it stays locked in the form it was created rather than flowing into usable resources. Retention without circulation. The correction requires you to deliberately create outflow — not spending, but investing in distribution channels that allow what you have built to reach people who can return value in a different form.

Between 2016 and 2025, the decade cycle has been running with significant drag — a period where effort has been genuine but traction has been inconsistent, where the foundation you were building kept shifting before it could hold. That configuration begins to change in 2026.

## 📅 2026–2027 Forecast

2026 is a transition year — the final phase of a long period of compression before the structural conditions shift. The most important thing you can do in 2026 is identify what is genuinely worth carrying forward and release the rest cleanly. Not dramatically. Not with announcement. Simply stop supporting the things that have been taking weight without returning it.

2027 marks the beginning of a new decade cycle that introduces the element your chart has been without. For the first time in a significant period, the conditions will support outward movement rather than simply sustained endurance. This is not a minor adjustment — it is the difference between a structure that holds and a structure that grows. The initiatives you begin in 2027 will have traction that the same initiatives attempted in the previous cycle did not. Start the things that matter in 2027, not before. The work you do in the first two years of this cycle will determine the shape of the decade that follows.

Do not make major structural changes — new ventures, significant financial commitments, relocations — before mid-2027. The conditions are not yet aligned. Preparation in 2026, movement in 2027.

## 🌍 What Balances You

Your chart is dry and compacted. The elements it needs most are Water and Wood — movement and growth, the qualities that allow what is built to circulate and expand rather than simply accumulate. Without them, the energy concentrates inward, and what presents externally as solidity is, internally, a system under sustained pressure with nowhere to release.

The health vulnerability in a chart like yours concentrates in the digestive system and the musculoskeletal structure — both of which register sustained compression before you consciously acknowledge the load. The pattern is: function at a high level, absorb without releasing, continue until the system produces a signal you cannot override. You have been through at least one version of this. The reset was more disruptive than it needed to be.

The correction is not rest in the conventional sense. Your system doesn't stop processing when external demands pause — it simply redirects the pressure inward. What actually restores you is genuine physical release: movement that has force behind it, contact with water, time in environments that are growing rather than static. Forest, river, any space where Wood and Water are physically present and not asking anything of you. This is not a supplement to your functioning. It is the structural input that allows the compression your chart naturally generates to discharge rather than accumulate until the system forces the release on its own terms.
`.trim();

console.log("DINGHWA words:", FEW_SHOT_DINGHWA.split(/\s+/).length);
// ============================================================
// Helper functions
// ============================================================

function getTenGodKr(dayTG, targetTG) {
  if (dayTG === targetTG) return '비견';
  const dE = TG_ELEM[dayTG], dY = TG_YY[dayTG];
  const tE = TG_ELEM[targetTG], tY = TG_YY[targetTG];
  const gen    = { Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood' };
  const ctrl   = { Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire' };
  const genBy  = { Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water' };
  const ctrlBy = { Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water' };
  if (tE === dE)          return tY === dY ? '비견' : '겁재';
  if (gen[dE] === tE)     return tY === dY ? '식신' : '상관';
  if (ctrl[dE] === tE)    return tY !== dY ? '정재' : '편재';
  if (ctrlBy[dE] === tE)  return tY !== dY ? '정관' : '편관';
  if (genBy[dE] === tE)   return tY !== dY ? '정인' : '편인';
  return '비견';
}

function getMissingElemRole(dayElem, missingElem) {
  const gen    = { Wood:'Fire',Fire:'Earth',Earth:'Metal',Metal:'Water',Water:'Wood' };
  const ctrl   = { Wood:'Earth',Fire:'Metal',Earth:'Water',Metal:'Wood',Water:'Fire' };
  const genBy  = { Fire:'Wood',Earth:'Fire',Metal:'Earth',Water:'Metal',Wood:'Water' };
  const ctrlBy = { Earth:'Wood',Metal:'Fire',Water:'Earth',Wood:'Metal',Fire:'Water' };
  if (gen[dayElem] === missingElem)    return `Output channel — ${dayElem} produces ${missingElem}; without it, effort doesn't convert to results`;
  if (ctrl[dayElem] === missingElem)   return `Wealth star — ${dayElem} controls ${missingElem}; money-capture mechanism absent`;
  if (ctrlBy[dayElem] === missingElem) return `Authority star — ${missingElem} structures ${dayElem}; self-regulation underpowered`;
  if (genBy[dayElem] === missingElem)  return `Resource/root — ${missingElem} feeds ${dayElem}; reflection and recovery channel absent`;
  return `${missingElem} is missing — elemental function absent from chart`;
}

function buildReportContext(saju, sipseong, wealthMode, moneyEngine) {
  const { dayTG, pillars, elemCount, missing, dominant, isStrong, strengthLabel } = saju;
  const archetype = ARCHETYPE[dayTG];
  const elemStatus = {};
  ['Wood','Fire','Earth','Metal','Water'].forEach(e => {
    const c = elemCount[e] || 0;
    elemStatus[e] = { count: c, status: c === 0 ? 'MISSING' : c >= 4 ? 'EXCESS' : c >= 2 ? 'PRESENT' : 'WEAK' };
  });
  const [yrP, moP, dayP, hrP] = pillars;
  const stemElems = { year: TG_ELEM[yrP[0]], month: TG_ELEM[moP[0]], hour: TG_ELEM[hrP[0]] };
  const branchElems = { year: DZ_ELEM[yrP[1]], month: DZ_ELEM[moP[1]], day: DZ_ELEM[dayP[1]], hour: DZ_ELEM[hrP[1]] };
  const stemCount = {};
  Object.values(stemElems).forEach(e => { stemCount[e] = (stemCount[e]||0) + 1; });
  const outwardElem = Object.entries(stemCount).sort((a,b) => b[1]-a[1])[0]?.[0];
  const branchCount = {};
  Object.values(branchElems).forEach(e => { branchCount[e] = (branchCount[e]||0) + 1; });
  const inwardElem = Object.entries(branchCount).sort((a,b) => b[1]-a[1])[0]?.[0];
  const dayElem = TG_ELEM[dayTG];
  const flowNext = GENERATES[dayElem];
  const flowNext2 = GENERATES[flowNext];
  let flowBreak = null;
  if (elemStatus[flowNext2]?.status === 'MISSING') flowBreak = `${dayElem} → ${flowNext} → ${flowNext2}(MISSING): produces output but result-capture broken`;
  else if (elemStatus[flowNext]?.status === 'MISSING') flowBreak = `${dayElem} → ${flowNext}(MISSING): primary output channel blocked`;
  const dayDZ = dayP[1], monthDZ = moP[1];
  const dayBranchGod   = DZ_MAIN_TG[dayDZ]   !== undefined ? getTenGodKr(dayTG, DZ_MAIN_TG[dayDZ])   : null;
  const monthBranchGod = DZ_MAIN_TG[monthDZ] !== undefined ? getTenGodKr(dayTG, DZ_MAIN_TG[monthDZ]) : null;
  const sip = sipseong.total || {};
  const sikSangTotal = (sip['식신']||0) + (sip['상관']||0);
  const jaeTotal     = (sip['정재']||0) + (sip['편재']||0);
  const gwanTotal    = (sip['정관']||0) + (sip['편관']||0);
  const inSungTotal  = (sip['정인']||0) + (sip['편인']||0);
  const primaryMissing = missing[0];
  const missingElemRole = primaryMissing ? { elem: primaryMissing, role: getMissingElemRole(dayElem, primaryMissing) } : null;
  const yongshin = calcYongshin(saju);
  return {
    dayMaster: archetype.dayMaster, archetypeName: archetype.name, archetypeEmoji: archetype.emoji,
    isStrong, strengthLabel, dayElem, elemStatus, missing, dominant, missingElemRole,
    outwardElem, inwardElem, environmentElem: branchElems.month, coreElem: branchElems.day,
    stemElems, branchElems, flowBreak,
    moneyFlow: moneyEngine?.moneyFlow || null, wealthSource: moneyEngine?.wealthSourceLabel || null,
    top3Str: sipseong.summary?.top3Str || '', excessStr: sipseong.summary?.excessStr || 'None', defStr: sipseong.summary?.defStr || 'None',
    sikSangTotal, jaeTotal, gwanTotal, inSungTotal, dayBranchGod, monthBranchGod,
    yongshinElem: yongshin.yongshin, gishinElem: yongshin.gishin,
    wealthMode: wealthMode?.primaryWealthMode || null, volatility: wealthMode?.volatilityIndex || null,
  };
}

function buildDaewonSummary(daewonResult, yongshinElem, gishinElem, currentYear) {
  if (!daewonResult || !daewonResult.daewons) return null;
  const { daewons } = daewonResult;
  const labeled = daewons.map(d => {
    const tgElem = TG_ELEM[d.tg], dzElem = DZ_ELEM[d.dz];
    const tgYong = tgElem === yongshinElem, tgGi = tgElem === gishinElem;
    const dzYong = dzElem === yongshinElem, dzGi = dzElem === gishinElem;
    let quality;
    if (tgYong && dzYong) quality = 'PEAK';
    else if (tgYong && !dzGi) quality = 'FAVORABLE';
    else if (!tgGi && dzYong) quality = 'FAVORABLE';
    else if (tgGi && dzGi) quality = 'DIFFICULT';
    else if (tgGi) quality = 'MIXED/TENSE';
    else if (dzGi) quality = 'MIXED/UNSTABLE';
    else quality = 'NEUTRAL';
    const isCurrent = d.startYear <= currentYear && currentYear <= d.endYear;
    const isFuture  = d.startYear > currentYear;
    return { ...d, tgElem, dzElem, quality, isCurrent, isFuture };
  });
  const current = labeled.find(d => d.isCurrent);
  const favorable = labeled.filter(d => d.quality === 'PEAK' || d.quality === 'FAVORABLE');
  const difficult = labeled.filter(d => d.quality === 'DIFFICULT' || d.quality === 'MIXED/UNSTABLE');
  const pastHighlight = labeled.filter(d => !d.isCurrent && !d.isFuture).slice(-1)[0] || null;
  const lines = labeled.map(d =>
    `  [${d.isCurrent ? 'CURRENT' : d.isFuture ? 'FUTURE' : 'PAST'}] Age ${d.age} (${d.startYear}–${d.endYear}): ${d.tgElem}/${d.dzElem} — ${d.quality}`
  ).join('\n');
  const peakStr = favorable.length > 0 ? favorable.map(d => `${d.startYear}–${d.endYear} (Age ${d.age})`).join(', ') : 'None in near term';
  const difficultStr = difficult.length > 0 ? difficult.map(d => `${d.startYear}–${d.endYear} (Age ${d.age})`).join(', ') : 'None identified';
  return `[Grand Cycle Data — USE EXACT YEARS ONLY]
Favorable element: ${yongshinElem} | Difficult element: ${gishinElem || 'N/A'}
All cycles:\n${lines}
Current decade: ${current ? `${current.startYear}–${current.endYear} (${current.tgElem}/${current.dzElem}, ${current.quality})` : 'Not identified'}
Peak windows: ${peakStr}
Difficult periods: ${difficultStr}
Past highlight (for past validation paragraph): ${pastHighlight ? `${pastHighlight.startYear}–${pastHighlight.endYear} (Age ${pastHighlight.age}, ${pastHighlight.quality})` : 'None'}
CRITICAL: Use EXACT year ranges. NEVER write "late 2020s" or "in a few years".`;
}

function buildKeyTension(ctx) {
  const lines = [];
  if (ctx.sikSangTotal >= 2.5 && ctx.jaeTotal < 0.5) lines.push('"Output is high. Capture is broken."');
  if (ctx.jaeTotal >= 1.5 && ctx.gwanTotal < 0.5) lines.push('"Earns but lacks holding structure."');
  if (ctx.inSungTotal >= 2.5 && ctx.sikSangTotal < 0.5) lines.push('"Thinks but doesn\'t convert."');
  if (ctx.flowBreak) lines.push(`Flow interruption: ${ctx.flowBreak}`);
  if (ctx.outwardElem && ctx.inwardElem && ctx.outwardElem !== ctx.inwardElem) lines.push(`Surface vs Foundation mismatch: ${ctx.outwardElem} outward / ${ctx.inwardElem} inward`);
  return lines.length > 0 ? lines.join('\n') : 'No dominant structural tension';
}

function buildPrompt(ctx, daewonSummaryStr) {
  const missingStr = ctx.missing.length > 0
    ? ctx.missing.map(m => { const role = ctx.missingElemRole?.elem === m ? ctx.missingElemRole.role : m; return `${m} → ${role}`; }).join('\n  ')
    : 'None';
  const daewonBlock = daewonSummaryStr ? `\n${daewonSummaryStr}\n` : '\n[Grand Cycle Data: Not available]\n';

  const SYSTEM = `You are a Four Pillars report writer for The Saju Blueprint.

Your job: write a deeply personal, psychologically precise report that makes the reader feel seen — not explained at.

TONE RULES:
- Lead with BEHAVIOR and FEELING, not element mechanics
- Use specific, vivid sentences that make the reader think "that's exactly me"
- Short punchy sentences and fragments are fine for emphasis
- Second person ("You") throughout
- DO NOT lead with element mechanics. Lead with human experience, then anchor it to chart structure.
- DO NOT use Chinese characters, romanized terms, or technical jargon (no "yongshin", "gishin", "hurting officer", "eating god", "spouse palace", "seven killings", etc.)
- NO sub-headers within sections. Each section flows as continuous prose paragraphs only.

LENGTH RULES:
- Every section minimum 200 words
- 🔥 Who You Really Are: minimum 350 words. The first ~800 characters are shown as a free preview. Make the opening hook immediately personal — the reader must feel seen within the first two sentences.
- 📅 2026–2027 Forecast: use EXACT year ranges from Grand Cycle Data. Never approximate.

SECTION ORDER:
## 🔥 Who You Really Are
## ❤️ Love & Relationships
### 👉 Who You Actually Need
## 💰 Career & Wealth
## 📅 2026–2027 Forecast
## 🌍 What Balances You

---
EXAMPLE 1 — Yang Wood, The Mighty Oak:
${FEW_SHOT_GAPMOK}

---
EXAMPLE 2 — Yin Fire, The Eternal Flame:
${FEW_SHOT_DINGHWA}

---
EXAMPLE 3 — Yin Metal, The Buried Blade:
${FEW_SHOT_SINKUM}

---
EXAMPLE 4 — Yang Water, The Deep Ocean: 
${FEW_SHOT_IMSU}
---
EXAMPLE 5 — Yang Earth, The Unmoved Mountain: 
${FEW_SHOT_MUTO}

Now write for the chart below. Same depth, same psychological precision. Do NOT copy sentences from the examples — re-derive everything from the actual chart data provided.`;

const USER = `CHART DATA:

Day Master: ${ctx.dayMaster}
Archetype: ${ctx.archetypeEmoji} ${ctx.archetypeName}
Strength: ${ctx.strengthLabel} (${ctx.isStrong ? 'Strong' : 'Weak'})

[Element Structure]
${Object.entries(ctx.elemStatus).map(([e,v]) => `  ${e}: ${v.count} (${v.status})`).join('\n')}

Missing element(s):
  ${missingStr}

Dominant element: ${ctx.dominant}

[Position Analysis]
  Stems (outward): Year: ${ctx.stemElems.year} | Month: ${ctx.stemElems.month} | Hour: ${ctx.stemElems.hour}
  Branches (inward): Year: ${ctx.branchElems.year} | Month: ${ctx.branchElems.month} | Day: ${ctx.branchElems.day} | Hour: ${ctx.branchElems.hour}
  Outward dominant: ${ctx.outwardElem || 'Mixed'}
  Inward dominant: ${ctx.inwardElem || 'Mixed'}
  Environment (month branch): ${ctx.environmentElem}
  Core instinct (day branch): ${ctx.coreElem}

[Flow Analysis]
  ${ctx.flowBreak || 'Flow intact'}
  Money flow: ${ctx.moneyFlow || 'N/A'}

[Ten Gods]
  ${ctx.top3Str || 'N/A'}
  Excess: ${ctx.excessStr} | Deficient: ${ctx.defStr}
  Output: ${ctx.sikSangTotal.toFixed(1)} | Wealth: ${ctx.jaeTotal.toFixed(1)} | Authority: ${ctx.gwanTotal.toFixed(1)} | Resource: ${ctx.inSungTotal.toFixed(1)}

[Key Structural Tension]
  ${buildKeyTension(ctx)}

[Corrective Element]
  Needs more of: ${ctx.yongshinElem}
  Creates friction: ${ctx.gishinElem || 'N/A'}
${daewonBlock}
---
WRITE THE REPORT NOW. Title: # ${ctx.archetypeEmoji} ${ctx.archetypeName}`;

  return { system: SYSTEM, user: USER };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { date, time, gender, name, timezone } = req.body;
  if (!date) return res.status(400).json({ error: 'Missing date' });

  try {
    const tz = timezone || 'America/New_York';
    const localDateStr = date + 'T' + (time || '12:00') + ':00';
    const kstDate = localToKST(localDateStr, tz);
    const { year, month, day, hour, minute } = kstDate;

    const saju          = calcSaju(year, month, day, hour, minute, false, 126.978);
    const sipseong      = calcSipseongV3(saju.pillars, saju.dayTG);
    const strength      = calcStrengthScore(saju.pillars, saju.dayTG);
    const wealthMode    = calcWealthMode(saju.pillars, saju.dayTG);
    const energyProfile = calcEnergyProfile(saju.pillars, saju.dayTG, strength);
    const moneyEngine   = calcMoneyEngine(saju.pillars, saju.dayTG, { daewons: [] }, wealthMode, energyProfile);

    const genderCode = (gender === 'Male' || gender === 'M') ? 'M' : 'F';
    let daewonSummaryStr = null;
    try {
      const daewonResult = calcDaewonFull(year, month, day, genderCode, saju.yrTG, saju.monthTG, saju.monthDZ);
      const yongshin = calcYongshin(saju);
      daewonSummaryStr = buildDaewonSummary(daewonResult, yongshin.yongshin, yongshin.gishin, new Date().getFullYear());
    } catch (e) {
      console.warn('[short-report-v3] daewon calc failed:', e.message);
    }

    const ctx = buildReportContext(saju, sipseong, wealthMode, moneyEngine);
    const pillarData = saju.pillars.map(([tg, dz]) => [tg, dz]);

    console.log('[short-report-v3]', JSON.stringify({
      archetype: ctx.archetypeName, strength: ctx.strengthLabel, missing: ctx.missing, yongshin: ctx.yongshinElem
    }));

    const { system, user } = buildPrompt(ctx, daewonSummaryStr);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4500,
      temperature: 0.6,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    });

    const reportText = completion.choices[0].message.content;

    res.json({
      report:    reportText,
      archetype: { name: ctx.archetypeName, emoji: ctx.archetypeEmoji },
      pillars:   pillarData,
      elemCount: { ...saju.elemCount },
      missing:   saju.missing,
      dayTG:     saju.dayTG,
      debug:     ctx,
    });

  } catch (e) {
    console.error('[short-report-v3] error:', e.message);
    res.status(500).json({ error: e.message });
  }
};