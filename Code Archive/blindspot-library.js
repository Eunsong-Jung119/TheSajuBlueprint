// Blind Spot Co-Star Style Library
// Key → { title, pattern, howItShowsUp[] }
// No saju terms. Behavior-first. Relatable situations.

const BLIND_SPOT_LIBRARY = {

  // ── ENERGY ──────────────────────────────────────────────────────────────
  burnout_risk: {
    title: "Quiet Burnout",
    pattern: "Your exhaustion builds gradually instead of dramatically.\nBy the time you notice it, you've already been pushing too long.",
    howItShowsUp: [
      "You keep working even when your energy is clearly dropping",
      "Rest feels like something you have to earn first",
      "You realize you were tired only after you finally stop"
    ]
  },
  creative_burnout: {
    title: "Creative Burnout Loop",
    pattern: "You pour energy into ideas and output until there's nothing left.\nThen you wonder why the spark feels gone.",
    howItShowsUp: [
      "You go all-in on a project, then crash once it's done",
      "Periods of high output are followed by stretches of emptiness",
      "You push through creative blocks instead of stepping back"
    ]
  },
  momentum_dependency: {
    title: "Momentum Dependency",
    pattern: "Your productivity runs on momentum.\nWhen the energy is there, you move fast — but restarting after a break feels harder than it should.",
    howItShowsUp: [
      "You work in intense bursts, then go quiet for stretches",
      "Picking up a paused project feels unusually heavy",
      "Interruptions cost you more time than they should"
    ]
  },
  pressure_without_support: {
    title: "Pressure Without Support",
    pattern: "You take on responsibility quietly, without asking for help.\nThe weight accumulates before anyone around you notices.",
    howItShowsUp: [
      "You solve problems alone before mentioning them to others",
      "People are surprised to learn how much you were carrying",
      "You feel resentful sometimes — but never said you needed support"
    ]
  },
  energy_deficit: {
    title: "Energy Deficit",
    pattern: "You commit to things your future self will have to pay for.\nThe math catches up slowly.",
    howItShowsUp: [
      "Your schedule looks manageable until it suddenly isn't",
      "You cancel things you actually want to do because you're depleted",
      "Recovery takes longer than you expect"
    ]
  },
  delayed_recovery: {
    title: "Delayed Recovery",
    pattern: "After intense periods, you expect to bounce back quickly.\nYour body and mind need more time than you give them.",
    howItShowsUp: [
      "You push back into work before you've actually recovered",
      "You mistake the absence of symptoms for being fine",
      "Slowing down feels like falling behind"
    ]
  },
  pressure_driven_growth: {
    title: "Pressure-Driven Growth Trap",
    pattern: "You grow fastest under pressure — which means you unconsciously seek it out.\nBut pressure as a default setting eventually stops working.",
    howItShowsUp: [
      "You procrastinate until urgency forces you into action",
      "Deadlines motivate you more than goals do",
      "Calm periods feel unproductive even when they're not"
    ]
  },
  resource_deficiency: {
    title: "Recovery Deficit",
    pattern: "You give out more than you take in.\nThe gap doesn't show immediately — but it compounds.",
    howItShowsUp: [
      "You keep going when others would have stopped already",
      "Your recovery window is shorter than your output window",
      "You're running on reserves more often than you realize"
    ]
  },
  fragile_balance: {
    title: "Fragile Balance",
    pattern: "Things feel stable until one extra thing tips everything.\nYour equilibrium requires more maintenance than most people realize.",
    howItShowsUp: [
      "One unexpected obligation throws off your whole rhythm",
      "You function well in controlled conditions but struggle with surprises",
      "Balance is something you have to rebuild repeatedly"
    ]
  },
  clash_energy_drain: {
    title: "Internal Friction Drain",
    pattern: "Part of you wants to push forward while another part pulls back.\nThe conflict itself costs energy before anything gets done.",
    howItShowsUp: [
      "You feel tired from decisions you haven't even made yet",
      "Starting things takes more out of you than finishing them",
      "You sometimes feel blocked without knowing why"
    ]
  },
  low_momentum: {
    title: "Structural Low Momentum",
    pattern: "Getting started requires more activation energy than it should.\nOnce moving, you're fine — but the launch is the hard part.",
    howItShowsUp: [
      "You delay starting things you actually want to do",
      "Mornings or re-entries after breaks feel sluggish",
      "You need more runway than others to get up to speed"
    ]
  },
  energy_leak: {
    title: "Energy Leak Pattern",
    pattern: "Energy drains through things that shouldn't cost that much.\nSmall obligations, minor decisions, unresolved tensions — they add up quietly.",
    howItShowsUp: [
      "You end the day tired without being able to explain why",
      "Small unresolved things sit in the back of your mind",
      "Low-stakes decisions drain you more than high-stakes ones"
    ]
  },
  pressure_fatigue: {
    title: "Chronic Pressure Fatigue",
    pattern: "You've been running at high intensity for so long it feels normal.\nThe baseline has shifted — and you don't notice until you stop.",
    howItShowsUp: [
      "You describe being overwhelmed in a calm, matter-of-fact tone",
      "You can't remember the last time you felt genuinely rested",
      "You normalize stress levels that others would consider unsustainable"
    ]
  },
  month_day_clash_energy: {
    title: "Inner Conflict Drain",
    pattern: "The version of you that the world sees and the version you feel inside don't always match.\nMaintaining the gap costs more energy than you'd expect.",
    howItShowsUp: [
      "Social situations leave you more drained than they seem to leave others",
      "You perform energy you don't actually have",
      "Alone time isn't optional — it's necessary"
    ]
  },
  output_resource_imbalance: {
    title: "Output-Recovery Imbalance",
    pattern: "You produce more than you replenish.\nCreativity and energy aren't infinite — but your output schedule treats them like they are.",
    howItShowsUp: [
      "You push through creative blocks instead of stepping back",
      "Your best work happens in short windows, not sustained stretches",
      "You need longer breaks than you allow yourself"
    ]
  },
  resource_dominance: {
    title: "Over-Reliance on Preparation",
    pattern: "You prepare thoroughly before acting.\nSometimes the preparation becomes a reason not to act at all.",
    howItShowsUp: [
      "You research longer than the decision actually requires",
      "You feel more ready than you act",
      "Starting feels premature even when you're clearly ready"
    ]
  },
  high_pressure_low_output: {
    title: "Suppressed Drive",
    pattern: "You have more ambition than your current output reflects.\nSomething keeps the engine from fully engaging.",
    howItShowsUp: [
      "You know what you want to do but struggle to start",
      "You feel capable of more than you've shown",
      "Motivation arrives in flashes but doesn't sustain"
    ]
  },
  collision_fatigue: {
    title: "Structural Collision Fatigue",
    pattern: "Different parts of your life want different things at the same time.\nThe coordination cost is real — and ongoing.",
    howItShowsUp: [
      "You feel pulled in multiple directions that don't overlap",
      "Progress in one area tends to create friction in another",
      "You often feel like you're robbing from one priority to fund another"
    ]
  },
  weak_start_weak_finish: {
    title: "Consistency Gap",
    pattern: "Getting started is hard. Finishing is hard. The middle is where you live.\nBut the middle alone doesn't produce results.",
    howItShowsUp: [
      "Projects stall at the beginning or drag near the end",
      "You're most productive when already in motion",
      "Your output is inconsistent in ways that frustrate even you"
    ]
  },
  year_month_clash_instability: {
    title: "Foundation Instability",
    pattern: "The environment you grew up in set a pattern of disruption.\nYou adapted — but the adaptation has costs you're still paying.",
    howItShowsUp: [
      "You're more comfortable with uncertainty than most, but not always by choice",
      "Stability feels unfamiliar sometimes, even when you want it",
      "You rebuild from scratch more often than your peers"
    ]
  },

  // ── EXECUTION ──────────────────────────────────────────────────────────
  starting_strong_finishing_weak: {
    title: "Starting Strong, Finishing Weak",
    pattern: "You begin things with a burst of excitement and clarity.\nBut once the work becomes routine, your energy fades faster than you expected.",
    howItShowsUp: [
      "You launch projects enthusiastically but struggle with the middle phase",
      "Your best ideas appear at the start, not the finish",
      "You sometimes lose interest once things stop feeling new"
    ]
  },
  structure_resistance: {
    title: "Structure Resistance",
    pattern: "Systems and rules feel like constraints, not support.\nYou work around them more than with them.",
    howItShowsUp: [
      "You resist processes that others find helpful",
      "Being told how to do things drains your motivation",
      "You build your own way — even when an existing way works fine"
    ]
  },
  scattered_focus: {
    title: "Scattered Focus",
    pattern: "Your attention moves across too many things at once.\nNothing gets ignored, but nothing gets the depth it deserves.",
    howItShowsUp: [
      "You start multiple things and finish fewer than you intended",
      "Your to-do list grows faster than it shrinks",
      "You switch tasks before the current one is done"
    ]
  },
  output_dominance: {
    title: "Expression Overload",
    pattern: "You generate more ideas and output than you can actually execute.\nThe overflow creates noise — for you and for others.",
    howItShowsUp: [
      "You share ideas before they're ready",
      "People sometimes feel overwhelmed by your output volume",
      "You move to the next idea before the current one lands"
    ]
  },
  authority_dominance: {
    title: "Control Orientation",
    pattern: "You work best when you control the outcome.\nShared ownership creates friction you don't always recognize in yourself.",
    howItShowsUp: [
      "Delegation feels inefficient more than it should",
      "You redo things others have already done",
      "Collaborative projects are harder for you than solo ones"
    ]
  },
  suppressed_voice: {
    title: "Delayed Voice",
    pattern: "Your thoughts are clear — just slightly late.\nYou often know exactly what you wanted to say, but only after the moment has passed.",
    howItShowsUp: [
      "The perfect response appears after the conversation ends",
      "You replay interactions later wishing you'd spoken up",
      "Important thoughts stay internal instead of entering the room"
    ]
  },
  output_deficiency: {
    title: "Suppressed Expression",
    pattern: "You think more than you say.\nIdeas stay internal longer than they need to.",
    howItShowsUp: [
      "People underestimate what you know because you don't always share it",
      "You hold back opinions until the moment passes",
      "You're more capable than your visible output suggests"
    ]
  },
  direction_drift: {
    title: "Direction Drift",
    pattern: "Without external structure, your path tends to wander.\nNot from lack of ability — from lack of a fixed point to aim at.",
    howItShowsUp: [
      "You do good work but aren't sure where it's leading",
      "Your goals shift frequently enough to slow real progress",
      "Clarity arrives in bursts, then fades"
    ]
  },
  fragmented_focus: {
    title: "Fragmented Focus",
    pattern: "Your attention is distributed across more commitments than your capacity supports.\nEach piece gets less than it needs.",
    howItShowsUp: [
      "You're involved in many things but fully present in few",
      "Important projects get bumped by whatever feels urgent",
      "You often feel behind despite being constantly busy"
    ]
  },
  creative_identity: {
    title: "Identity-Output Dependency",
    pattern: "Your sense of self is tied to what you produce.\nWhen output slows, your confidence quietly follows.",
    howItShowsUp: [
      "Rest feels like stagnation, not recovery",
      "Quiet periods trigger self-doubt even when nothing is wrong",
      "Your mood tracks closer to your productivity than you'd like"
    ]
  },
  day_hour_clash_execution: {
    title: "Execution Disruption Pattern",
    pattern: "What you decide and what you do don't always line up.\nThe gap between intention and action is wider than you account for.",
    howItShowsUp: [
      "You commit to things and then struggle to follow through",
      "The version of you that plans and the version that executes feel like different people",
      "You need more lead time than you typically give yourself"
    ]
  },
  idea_overflow: {
    title: "Idea Overflow",
    pattern: "Your mind generates possibilities faster than you can act on them.\nThe abundance creates its own kind of paralysis.",
    howItShowsUp: [
      "You start several things knowing you won't finish all of them",
      "A new idea appears before the current one is done",
      "Your notebook is full of beginnings"
    ]
  },
  year_month_clash_career: {
    title: "Career Path Disruption",
    pattern: "Your career path has had more pivots than you planned.\nEach shift felt necessary, but the pattern adds up.",
    howItShowsUp: [
      "You've changed directions more times than feels intentional",
      "You often feel like you're starting over instead of building on",
      "Long-term career identity is harder to define than you'd like"
    ]
  },
  low_authority_drift: {
    title: "Structural Drift",
    pattern: "Without a clear direction, you keep moving but not necessarily forward.\nEffort without anchor doesn't compound.",
    howItShowsUp: [
      "You're productive but not sure what it's adding up to",
      "Goals feel abstract even when your work feels real",
      "Progress is hard to measure because the target keeps shifting"
    ]
  },
  high_output_no_anchor: {
    title: "High Drive, No Anchor",
    pattern: "You have the energy and the ambition.\nWhat's missing is a fixed point to direct it at.",
    howItShowsUp: [
      "You move fast but change direction frequently",
      "Other people benefit from your drive more than you do",
      "The effort is real — the return is inconsistent"
    ]
  },
  pressure_execution_gap: {
    title: "Pressure-Execution Gap",
    pattern: "You perform well under pressure but struggle to sustain that performance outside of it.\nUrgency is your fuel — but it's not always available.",
    howItShowsUp: [
      "Your best work happens close to deadlines",
      "Without pressure, the same task takes twice as long",
      "You've wondered why motivation is so conditional"
    ]
  },
  reactive_execution: {
    title: "Reactive Execution Pattern",
    pattern: "You respond to what's in front of you more than what you planned.\nThe day takes over before your intentions do.",
    howItShowsUp: [
      "Your schedule rarely matches what you meant to do",
      "Other people's urgency consistently overrides your priorities",
      "You end the day having been busy but not moved forward"
    ]
  },
  month_day_clash_execution: {
    title: "Internal-External Execution Conflict",
    pattern: "How you want to work and how your environment requires you to work create constant friction.\nThe tension is productive sometimes — exhausting most of the time.",
    howItShowsUp: [
      "Your best output happens when conditions are just right — which isn't often",
      "Standard workflows feel designed for someone else",
      "You work around systems instead of through them"
    ]
  },
  authority_output_clash: {
    title: "Drive vs Control Tension",
    pattern: "You want to create and you want to control.\nBut the two don't always coexist — and choosing between them slows you down.",
    howItShowsUp: [
      "You struggle to let projects leave your hands",
      "Collaboration is energizing in theory, frustrating in practice",
      "Perfectionism and ambition compete for the same energy"
    ]
  },
  low_output_high_pressure: {
    title: "Stalled Under Pressure",
    pattern: "High-pressure environments slow you down instead of speeding you up.\nThe harder you're pushed, the more internal resistance builds.",
    howItShowsUp: [
      "Deadlines make you freeze instead of focus",
      "You do your best work when no one is watching",
      "Urgency from others creates anxiety, not momentum"
    ]
  },

  // ── MONEY ──────────────────────────────────────────────────────────────
  opportunity_overextension: {
    title: "Opportunity Overextension",
    pattern: "You say yes to opportunities before checking if you have the capacity.\nGood opportunities stack up until they become a burden.",
    howItShowsUp: [
      "You commit to things that made sense individually but conflict collectively",
      "You're known for being reliable — and people test that constantly",
      "Financial stress sometimes comes from abundance, not scarcity"
    ]
  },
  wealth_instability: {
    title: "Income Inconsistency",
    pattern: "Your financial picture fluctuates more than you'd like.\nHigh periods exist — but they don't automatically build into stability.",
    howItShowsUp: [
      "Your income in good months doesn't protect you in slow ones",
      "Financial planning feels difficult because the baseline keeps moving",
      "You've had to rebuild financially more than once"
    ]
  },
  risk_aversion: {
    title: "Risk Avoidance Pattern",
    pattern: "You protect what you have more than you move toward what you want.\nSafety feels rational — but it quietly limits your upside.",
    howItShowsUp: [
      "You pass on opportunities that feel uncertain, even when the odds are reasonable",
      "You research exits before you've entered",
      "Others take chances you were already considering"
    ]
  },
  wealth_dominance: {
    title: "Opportunity Fixation",
    pattern: "You chase opportunities instinctively.\nBut not every open door leads somewhere worth going.",
    howItShowsUp: [
      "You're drawn to the next deal before the current one is stable",
      "You've started more things than you've finished",
      "Exciting potential consistently outcompetes realistic assessment"
    ]
  },
  wealth_deficiency: {
    title: "Opportunity Blindness",
    pattern: "Financial opportunities exist around you — but you don't always recognize them in time.\nThe gap isn't ability, it's attention.",
    howItShowsUp: [
      "You learn about opportunities after the window has passed",
      "You undervalue what you have until someone else sees it first",
      "You often realize in hindsight what you could have done"
    ]
  },
  career_money_conflict: {
    title: "Career vs Income Tension",
    pattern: "What you want to do and what pays well aren't always the same thing.\nThe gap creates ongoing friction that neither ambition nor practicality fully resolves.",
    howItShowsUp: [
      "You've made financial decisions that cost you career satisfaction — and vice versa",
      "Money conversations at work feel loaded with something beyond the numbers",
      "You've wondered which one you're actually optimizing for"
    ]
  },
  financial_drain: {
    title: "Financial Energy Drain",
    pattern: "Money leaves as quickly as it arrives.\nNot from recklessness — but from a pattern that keeps the account from growing.",
    howItShowsUp: [
      "Income feels like it disappears before you can hold onto it",
      "You earn more but don't seem to accumulate more",
      "Financial planning keeps getting postponed"
    ]
  },
  money_leakage: {
    title: "Money Leakage Pattern",
    pattern: "Small financial decisions add up to a significant drain.\nIndividually they're defensible — collectively they're a problem.",
    howItShowsUp: [
      "You're surprised by what you've spent when you actually look",
      "Convenience spending is higher than you'd estimate",
      "You're not sure where the money went"
    ]
  },
  resource_drain: {
    title: "Resource Drain Risk",
    pattern: "People and situations regularly draw on your capacity without equivalent return.\nYou give more than you recognize — and budget less for yourself as a result.",
    howItShowsUp: [
      "You support others financially or emotionally more than they know",
      "Your own projects get delayed because someone else needed something",
      "You're generous in ways that quietly cost you"
    ]
  },
  risk_attraction: {
    title: "High-Risk Attraction",
    pattern: "You're drawn to high-upside situations even when the downside is significant.\nThe potential feels real — the risk gets underweighted.",
    howItShowsUp: [
      "You've taken financial swings that didn't pay off the way you expected",
      "Conservative options feel like settling",
      "You trust your read on situations more than the data suggests you should"
    ]
  },
  day_clash_wealth_drain: {
    title: "Relationship-Wealth Conflict",
    pattern: "Close relationships and financial decisions create friction in your life.\nCommitments to people and commitments to financial goals pull in opposite directions.",
    howItShowsUp: [
      "Important financial decisions are complicated by relationship dynamics",
      "You've spent money to maintain peace or connection",
      "Your financial life looks different when you factor in the people in it"
    ]
  },
  year_month_clash_money: {
    title: "Inherited Financial Pattern",
    pattern: "Early financial experiences set a pattern you're still running.\nNot the money itself — the relationship to it.",
    howItShowsUp: [
      "Your financial habits feel automatic in ways you can't always explain",
      "Certain money situations trigger disproportionate anxiety or confidence",
      "The patterns your family had around money show up in yours"
    ]
  },
  status_conflict: {
    title: "Status vs Wealth Conflict",
    pattern: "How things look and how they actually perform don't always align.\nThe gap between status and substance creates financial friction.",
    howItShowsUp: [
      "You invest in appearance at the expense of foundation",
      "How others perceive your success influences your financial decisions",
      "Keeping up with visible markers costs more than you've calculated"
    ]
  },
  opportunity_overload: {
    title: "Opportunity Overload",
    pattern: "Too many options make it harder to execute on any of them.\nThe abundance becomes its own obstacle.",
    howItShowsUp: [
      "You spend more time evaluating options than acting on them",
      "Picking one path means giving up others you genuinely wanted",
      "Good opportunities get delayed by better ones that haven't arrived yet"
    ]
  },
  low_wealth_high_pressure: {
    title: "Financial Pressure Without Direction",
    pattern: "The pressure to do something financially is high — but the direction isn't clear.\nUrgency without strategy produces motion, not progress.",
    howItShowsUp: [
      "You feel behind financially without knowing what 'ahead' looks like",
      "Financial decisions happen reactively rather than by design",
      "You work hard but the financial results don't reflect it yet"
    ]
  },
  day_hour_clash_money: {
    title: "Inconsistent Financial Execution",
    pattern: "You make good financial plans and then don't follow them.\nThe gap between decision and behavior is wider than you account for.",
    howItShowsUp: [
      "You know what you should be doing financially — and don't always do it",
      "Good periods don't automatically convert to better habits",
      "The plan exists; the follow-through is where things break down"
    ]
  },
  peer_wealth_drain: {
    title: "Social Financial Drain",
    pattern: "Your social environment has a higher financial cost than you budget for.\nKeeping up socially quietly erodes what you're trying to build.",
    howItShowsUp: [
      "Social spending is the category you justify most",
      "Your financial behavior changes when others are watching",
      "FOMO has cost you more money than you've admitted to yourself"
    ]
  },
  high_output_low_wealth: {
    title: "Effort-Reward Gap",
    pattern: "You work harder than your financial results reflect.\nThe output is real — but it's not converting to income the way it should.",
    howItShowsUp: [
      "You've noticed others earn more while seeming to do less",
      "Your skills aren't always positioned where the money is",
      "You undercharge, under-negotiate, or undervalue what you produce"
    ]
  },
  wealth_no_structure: {
    title: "Wealth Without Structure",
    pattern: "Money comes in — but without a system, it doesn't build.\nIncome without architecture stays fluid.",
    howItShowsUp: [
      "Good income months don't noticeably improve your financial position",
      "You don't have a clear financial system — just patterns",
      "The money is there until it isn't"
    ]
  },
  clash_count_wealth: {
    title: "Financial Instability Pattern",
    pattern: "Your financial life has had more disruptions than your effort level should produce.\nThe instability isn't random — it follows a pattern.",
    howItShowsUp: [
      "Financial setbacks arrive when you're not expecting them",
      "Progress gets interrupted just as things start stabilizing",
      "You rebuild from scratch more often than you'd like"
    ]
  },

  // ── RELATIONSHIP ────────────────────────────────────────────────────────
  independence_reflex: {
    title: "Independence Reflex",
    pattern: "When things feel too controlled, your instinct is to pull back.\nEven when the structure might actually help you.",
    howItShowsUp: [
      "You resist relying on others more than most people would",
      "Being told what to do drains your motivation faster than the task itself",
      "You solve problems alone before mentioning them to anyone"
    ]
  },
  isolation_drive: {
    title: "Isolation Drive",
    pattern: "Solitude isn't just a preference — it's a requirement.\nBut there's a difference between recharging alone and using alone time to avoid.",
    howItShowsUp: [
      "You disappear when things get emotionally heavy",
      "People sometimes wonder if you're okay — because you went quiet",
      "Connection requires effort you don't always have available"
    ]
  },
  comparison_trap: {
    title: "Comparison Pressure",
    pattern: "You measure your progress against others without realizing you're doing it.\nThe comparison isn't always visible — but the pressure it creates is.",
    howItShowsUp: [
      "Other people's wins quietly affect how you feel about yours",
      "You're more aware of where you rank than you'd admit",
      "Motivation spikes when you're behind — and dips when you're ahead"
    ]
  },
  peer_dominance: {
    title: "External Approval Dependency",
    pattern: "Other people's perception of you carries more weight than you'd like.\nValidation from outside shows up in decisions you think you're making for yourself.",
    howItShowsUp: [
      "You make choices based on how they'll look to others",
      "Criticism lands harder than it should",
      "Success feels better when it's visible to the right people"
    ]
  },
  independence_identity: {
    title: "Lone Operator Pattern",
    pattern: "You function best alone.\nCollaboration isn't impossible — but shared ownership always costs you something.",
    howItShowsUp: [
      "Group projects are more friction than they're worth",
      "You'd rather do it yourself than explain what you need",
      "Your best work happens when you're not coordinating with anyone"
    ]
  },
  peer_deficiency: {
    title: "Connection Avoidance",
    pattern: "You maintain enough distance to stay safe.\nBut safety and closeness aren't the same thing — and the gap has a cost.",
    howItShowsUp: [
      "People sense you're holding something back, even when you're present",
      "Close relationships take longer to form than you expect",
      "You're comfortable with acquaintances in ways you're not with intimacy"
    ]
  },
  emotional_misalignment: {
    title: "Emotional Misalignment",
    pattern: "What you feel and what you show don't always match.\nThe disconnect isn't dishonesty — it's habit.",
    howItShowsUp: [
      "People misread your emotional state regularly",
      "You express things differently than you experience them",
      "Emotional conversations take more energy than they seem to cost others"
    ]
  },
  trust_reserve: {
    title: "Trust Reserve Pattern",
    pattern: "You extend trust slowly and retract it quickly.\nOnce it's gone, it rarely comes back.",
    howItShowsUp: [
      "First impressions carry enormous weight in how you proceed",
      "A single breach can close a relationship that took years to build",
      "You're selective in ways that look like coldness from the outside"
    ]
  },
  attraction_compat_gap: {
    title: "Attraction vs Compatibility Gap",
    pattern: "Who you're drawn to and who's actually good for you aren't always the same person.\nThe pull is real — the fit is the problem.",
    howItShowsUp: [
      "You've been in relationships that felt exciting but cost you stability",
      "Calm, reliable people sometimes feel like they're missing something",
      "The most intense connections have also been the most complicated"
    ]
  },
  day_clash_relationship: {
    title: "Closeness-Friction Pattern",
    pattern: "The closer the relationship, the more friction it generates.\nDistance is easier — intimacy brings out tensions you don't see elsewhere.",
    howItShowsUp: [
      "Your most important relationships have been the most complicated",
      "You're easier to be around when the stakes are lower",
      "Conflict tends to show up in the relationships you care about most"
    ]
  },
  year_day_clash_relationship: {
    title: "Identity-Relationship Conflict",
    pattern: "Who you are in relationships and who you are on your own feel like different people.\nYou adapt — sometimes more than you intend to.",
    howItShowsUp: [
      "You notice yourself changing around certain people",
      "Relationships have asked you to be someone you weren't sure you wanted to be",
      "Independence and connection feel mutually exclusive more often than they should"
    ]
  },
  high_peer_low_resource: {
    title: "Social Energy Drain",
    pattern: "Social connection energizes you until it doesn't.\nYou overextend socially before recognizing you've hit your limit.",
    howItShowsUp: [
      "You say yes to social commitments and regret it later",
      "You're the person who keeps things going — even when you're running on empty",
      "Withdrawal comes suddenly rather than gradually"
    ]
  },
  authority_peer_gap: {
    title: "Control vs Connection Conflict",
    pattern: "You want closeness, but you also want things done your way.\nThe two create friction in relationships that should be easy.",
    howItShowsUp: [
      "You find it hard to let people help without directing how they do it",
      "Relationships work best when you're in a leading role",
      "You've been told you're hard to get close to — you didn't fully understand why"
    ]
  },
  output_relationship_imbalance: {
    title: "Creation Over Connection",
    pattern: "Work, projects, and output get the energy that relationships could use.\nNot because people don't matter — but because momentum pulls you toward making things.",
    howItShowsUp: [
      "Important people in your life know they compete with your work",
      "You show up fully when things are fine — less when maintenance is required",
      "Relationships thrive in your high-energy periods and strain during your focused ones"
    ]
  },
  comparison_pressure: {
    title: "Competitive Relationship Lens",
    pattern: "You see social dynamics through a lens of positioning — even when competition isn't the frame.\nThis sharpens your awareness, but it also makes connection harder.",
    howItShowsUp: [
      "You're more aware of who's ahead or behind than most people in the room",
      "Collaboration sometimes feels like competition you're not naming",
      "Genuine admiration is hard to separate from assessment"
    ]
  },
  day_hour_clash_relationship: {
    title: "Intimacy Disruption Pattern",
    pattern: "Something about deep closeness triggers distance.\nNot because you don't want it — but because it activates something that pushes back.",
    howItShowsUp: [
      "You pull away right when things are getting close",
      "People who get too near sometimes feel like a threat without being one",
      "Intimacy and discomfort arrive together"
    ]
  },
  high_output_low_peer: {
    title: "Output Isolation Pattern",
    pattern: "What you produce keeps you company in ways that other people don't.\nWork fills space that connection could — and eventually people stop trying.",
    howItShowsUp: [
      "You've been described as hard to reach",
      "You're more comfortable producing than relating",
      "Important relationships have quietly faded while you were focused on something else"
    ]
  },
  peer_authority_clash: {
    title: "Social-Authority Friction",
    pattern: "You want to be liked, and you want to be in charge.\nWhen those two wants conflict, the result is friction you don't always account for.",
    howItShowsUp: [
      "You've been called intense in situations where you thought you were just engaged",
      "Leading sometimes costs you likability in ways you only notice later",
      "You're more comfortable with hierarchy than you might admit"
    ]
  },
  wealth_relationship_drain: {
    title: "Wealth-Relationship Trade-off",
    pattern: "Pursuing financial goals has cost you relational ones — and vice versa.\nThe two compete for the same energy, and there's rarely enough of both.",
    howItShowsUp: [
      "Important relationships have suffered during your most ambitious periods",
      "Money-related decisions have introduced tension into close relationships",
      "You've had to choose, more than once, between what you want and who you want it with"
    ]
  },
  multi_clash_relationships: {
    title: "Relational Instability Pattern",
    pattern: "Your relationships go through more disruption than feels proportionate to the people involved.\nThe instability isn't always about them.",
    howItShowsUp: [
      "Relationships that start strong have a pattern of becoming complicated",
      "You've rebuilt important connections from scratch more than once",
      "Stability in relationships takes sustained effort that others seem to get for free"
    ]
  },

  // ── DECISION ────────────────────────────────────────────────────────────
  analysis_paralysis: {
    title: "Analysis Paralysis",
    pattern: "You gather more information before acting.\nSometimes the gathering becomes the reason not to act.",
    howItShowsUp: [
      "You know the decision intellectually before you can make it emotionally",
      "Deadlines force action that reflection alone never produced",
      "You've missed windows while still evaluating them"
    ]
  },
  overthinking_loop: {
    title: "Overthinking Loop",
    pattern: "Your mind returns to the same questions without arriving at new answers.\nThe loop runs longer than it needs to.",
    howItShowsUp: [
      "You've made a decision, then unmade it, then made it again",
      "Certainty arrives and then quietly disappears",
      "Sleep is the first casualty of unresolved decisions"
    ]
  },
  reactive_decision: {
    title: "Reactive Decision Pattern",
    pattern: "You decide in response to what's happening, not what you planned.\nThe environment sets the agenda more than you do.",
    howItShowsUp: [
      "Your most important decisions have happened under pressure",
      "You've committed to things because the moment demanded it",
      "Deliberate choices are harder to make than reactive ones"
    ]
  },
  external_validation_loop: {
    title: "External Validation Loop",
    pattern: "You seek input before deciding — and sometimes need agreement before committing.\nConfidence in your own judgment is more conditional than you'd like.",
    howItShowsUp: [
      "You poll others before acting on things you already know",
      "Disagreement from someone you respect shifts your confidence, not just your thinking",
      "Your best decisions happen when no one else is watching"
    ]
  },
  high_pressure_low_clarity: {
    title: "High Pressure, Low Clarity",
    pattern: "Urgency and confusion arrive together.\nThe pressure to decide amplifies the lack of direction instead of resolving it.",
    howItShowsUp: [
      "Important decisions come with a sense of fog you can't push through",
      "The stakes make it harder, not easier, to think straight",
      "You've acted under pressure and wished you'd waited"
    ]
  },
  direction_without_anchor: {
    title: "Direction Without Anchor",
    pattern: "You're capable and moving — but toward what isn't always clear.\nMotion without destination is its own kind of stuck.",
    howItShowsUp: [
      "You work hard and wonder periodically what it's actually for",
      "Long-term goals feel important but abstract",
      "You make good decisions individually but struggle to string them into a coherent direction"
    ]
  },
  narrow_focus_trap: {
    title: "Narrow Focus Trap",
    pattern: "When you commit to something, you commit fully.\nBut full commitment can mean missing things happening outside the frame.",
    howItShowsUp: [
      "You've been caught off guard by things you should have seen coming",
      "Important context lives in the periphery you weren't watching",
      "Your best decisions happen inside your domain — your blind spots live outside it"
    ]
  },
  resource_decision_loop: {
    title: "Preparation Over Action Loop",
    pattern: "You prepare until you feel ready — but ready keeps moving.\nMore information becomes the reason to wait rather than the foundation to act.",
    howItShowsUp: [
      "You've been ready for a long time without starting",
      "The last piece of information you need turns into the next piece of information you need",
      "People who prepared less have already begun"
    ]
  },
  resource_dominance_decision: {
    title: "Support Dependence in Decisions",
    pattern: "You make better decisions with input and backing.\nAlone, the confidence wavers in ways that show up as delay.",
    howItShowsUp: [
      "Big decisions get postponed until you have someone in your corner",
      "You seek permission without realizing that's what you're doing",
      "Autonomy is harder when the stakes are high"
    ]
  },
  selective_ambition: {
    title: "Selective Ambition",
    pattern: "You're highly capable in the domains you care about — and completely disengaged from the rest.\nThe gap between your best and your average is unusually wide.",
    howItShowsUp: [
      "You excel when motivated and disengage when you're not",
      "Mandatory tasks get your minimum, chosen tasks get your everything",
      "You've been called inconsistent by people who've only seen part of you"
    ]
  },
  status_orientation: {
    title: "Status-Driven Decision Making",
    pattern: "Prestige and perception influence your choices more than you'd prefer.\nDecisions that look good compete with decisions that are good.",
    howItShowsUp: [
      "You've chosen paths partly because of how they'd be perceived",
      "Being seen as successful is hard to fully separate from being successful",
      "You notice when your choices would look bad to people whose opinion matters to you"
    ]
  },
  pressure_identity: {
    title: "Pressure-Driven Identity",
    pattern: "You know yourself best under pressure.\nWithout it, defining who you are and what you want gets harder.",
    howItShowsUp: [
      "Calm periods trigger more self-doubt than intense ones",
      "You perform your clearest self when the stakes are high",
      "Ease doesn't suit you the way you expect it to"
    ]
  },
  weak_anchor_multi_direction: {
    title: "Multi-Direction Scatter",
    pattern: "Multiple pulls in different directions make commitment feel like loss.\nChoosing one thing means letting go of others — and that cost is hard to accept.",
    howItShowsUp: [
      "You pursue several paths in parallel because picking one feels premature",
      "You're envious of people who seem to just know what they want",
      "Your energy is spread thin across directions you haven't eliminated yet"
    ]
  },
  high_output_identity_lock: {
    title: "Identity Lock",
    pattern: "You've built your identity around what you do.\nChanging course — even when it would help — feels like losing yourself.",
    howItShowsUp: [
      "Pivoting feels like admitting something rather than evolving",
      "Your sense of self is harder to maintain during quiet or transitional periods",
      "You hold onto roles, projects, or identities longer than they're useful"
    ]
  },
  peer_decision_noise: {
    title: "Peer Decision Noise",
    pattern: "Other people's choices create noise in your decision-making.\nWhat others are doing is louder than your own direction.",
    howItShowsUp: [
      "You reconsider your path when you see peers taking different ones",
      "Comparison makes you question choices you already settled",
      "You've made decisions based on keeping pace rather than purpose"
    ]
  },
  uncertain_direction: {
    title: "Uncertain Direction",
    pattern: "You're capable of more than you're currently pointed at.\nThe difficulty isn't ability — it's knowing which way to aim it.",
    howItShowsUp: [
      "You work hard without being sure what it's building toward",
      "Direction feels like something you're still waiting to find",
      "You know what you don't want more clearly than what you do"
    ]
  },
  year_month_clash_decision: {
    title: "Early Conditioning Decision Pattern",
    pattern: "Early experiences shaped how you make decisions in ways you haven't fully traced.\nThe pattern runs automatically — which means you don't always choose it.",
    howItShowsUp: [
      "Certain kinds of decisions trigger reactions that feel disproportionate",
      "You default to the same approach even in situations that call for something different",
      "The way you were taught to decide isn't always the way that works for you now"
    ]
  },
  clash_decision_instability: {
    title: "Clash-Driven Decision Instability",
    pattern: "Decisions that feel settled have a way of becoming unsettled.\nWhat you commit to today faces pressure you didn't anticipate.",
    howItShowsUp: [
      "You've reversed important decisions more than feels comfortable",
      "New information regularly challenges conclusions you thought were final",
      "Commitment takes more energy to maintain than it should"
    ]
  },
  wealth_authority_conflict: {
    title: "Wealth vs Structure Conflict",
    pattern: "Financial goals and structural constraints pull in opposite directions.\nFollowing the rules costs opportunity. Breaking them costs stability.",
    howItShowsUp: [
      "You've had to choose between institutional paths and independent ones",
      "Playing it safe and taking the shot rarely feel available at the same time",
      "The most financially interesting options often carry the most friction"
    ]
  },
  day_hour_clash_decision: {
    title: "Inconsistent Decision Execution",
    pattern: "You decide well and follow through inconsistently.\nThe gap between your intentions and your actions is wider than you'd like.",
    howItShowsUp: [
      "You commit clearly and then wonder where the momentum went",
      "The version of you that decides and the version that executes don't always agree",
      "You need external accountability to bridge the gap"
    ]
  },
};

module.exports = { BLIND_SPOT_LIBRARY };