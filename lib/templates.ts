import { dailyTemplates } from "@/lib/templates-daily";
import { templates20260910 } from "@/lib/templates-2026-09-10";
import { templates20260910Round2 } from "@/lib/templates-2026-09-10-round-2";

export type TemplateSlide = { eyebrow: string; title: string; body: string; stat?: string };

export type PptTemplate = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categorySlug: string;
  description: string;
  longDescription: string;
  accent: string;
  dark: string;
  soft: string;
  tags: string[];
  slides: TemplateSlide[];
  included: string[];
  bestFor: string[];
};

export type TemplateCategory = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  searchIntent: string;
};

export const templateCategories: TemplateCategory[] = [
  { slug: "business-plan", name: "Business Plan", shortName: "Business plan", description: "Turn a business model, market opportunity, operating plan, and financial outlook into a decision-ready story.", searchIntent: "free business plan PowerPoint template" },
  { slug: "pitch-deck", name: "Startup Pitch Deck", shortName: "Pitch deck", description: "Frame the problem, product, traction, market, business model, and fundraising ask for investors.", searchIntent: "free startup pitch deck template" },
  { slug: "company-profile", name: "Company Profile", shortName: "Company profile", description: "Introduce a company, its services, team, proof, and next step with a credible visual narrative.", searchIntent: "free company profile PowerPoint template" },
  { slug: "marketing", name: "Marketing Plan", shortName: "Marketing plan", description: "Present audience insights, positioning, channels, campaign ideas, budget, and measurable goals.", searchIntent: "free marketing plan PowerPoint template" },
  { slug: "project-proposal", name: "Project Proposal", shortName: "Project proposal", description: "Explain a project challenge, proposed approach, scope, schedule, budget, risks, and approval request.", searchIntent: "free project proposal PowerPoint template" },
  { slug: "sales-report", name: "Sales Report", shortName: "Sales report", description: "Review performance, pipeline, customer segments, wins, risks, and the next sales priorities.", searchIntent: "free sales report PowerPoint template" },
  { slug: "education", name: "Lesson Plan", shortName: "Lesson plan", description: "Build a clear lesson with objectives, concepts, examples, activities, checks, and a recap.", searchIntent: "free lesson plan PowerPoint template" },
  { slug: "thesis-defense", name: "Thesis Defense", shortName: "Thesis defense", description: "Guide an academic audience through the question, literature, method, findings, limits, and conclusion.", searchIntent: "free thesis defense PowerPoint template" },
  { slug: "medical", name: "Clinical Case", shortName: "Clinical case", description: "Present a de-identified patient history, assessment, evidence, treatment path, and learning points.", searchIntent: "free medical PowerPoint template" },
  { slug: "artificial-intelligence", name: "AI & Technology", shortName: "AI presentation", description: "Explain an AI product or technical concept through the problem, system, workflow, evidence, and safeguards.", searchIntent: "free artificial intelligence PowerPoint template" },
  { slug: "portfolio", name: "Creative Portfolio", shortName: "Portfolio", description: "Showcase selected work, process, outcomes, capabilities, biography, and contact details.", searchIntent: "free portfolio PowerPoint template" },
  { slug: "product-roadmap", name: "Product Roadmap", shortName: "Product roadmap", description: "Align teams around product vision, themes, releases, dependencies, measures, and the next milestone.", searchIntent: "free product roadmap PowerPoint template" },
];

const originalTemplates: PptTemplate[] = [
  {
    slug: "business-plan-presentation",
    name: "Free Business Plan PowerPoint Template",
    shortName: "Business Plan",
    category: "Business",
    categorySlug: "business-plan",
    description: "A clean, editable business plan deck for presenting the opportunity, market, model, go-to-market strategy, operations, and financial outlook.",
    longDescription: "This free business plan PowerPoint template turns a detailed plan into an executive-friendly narrative. Its eight editable slides move from the core opportunity to customer needs, solution, market, business model, go-to-market plan, operating roadmap, and financial outlook. The restrained navy and lime visual system works for internal planning, lender discussions, partner meetings, and early investor conversations. Replace every sample statement, number, and chart with verified information from your own business plan before presenting.",
    accent: "B7F34A", dark: "10231E", soft: "EFF8E2",
    tags: ["Business plan", "Strategy", "Startup", "16:9"],
    slides: [
      { eyebrow: "BUSINESS PLAN · 2026", title: "Build a business that earns repeat trust", body: "A focused plan for solving a valuable customer problem and growing responsibly." },
      { eyebrow: "01 · OPPORTUNITY", title: "The market is ready for a simpler choice", body: "Customers lose time and money navigating fragmented, complicated alternatives.", stat: "42%" },
      { eyebrow: "02 · CUSTOMER", title: "Start with one high-value audience", body: "Define the buyer, the moment of need, and the outcome they are willing to pay for." },
      { eyebrow: "03 · SOLUTION", title: "One clear promise, delivered consistently", body: "Show how the product removes friction and creates a measurable improvement." },
      { eyebrow: "04 · MARKET", title: "Enter through a reachable segment", body: "Separate the total market from the customers the current team can realistically win.", stat: "$2.4B" },
      { eyebrow: "05 · BUSINESS MODEL", title: "Revenue grows with customer value", body: "Explain pricing, unit economics, retention, and the assumptions behind the model." },
      { eyebrow: "06 · ROADMAP", title: "Prove demand before scaling operations", body: "Sequence validation, launch, channel expansion, and team investment over 18 months." },
      { eyebrow: "07 · FINANCIAL OUTLOOK", title: "A disciplined path to sustainable growth", body: "Present a base case, key sensitivities, capital needs, and the next decision point.", stat: "3.1×" },
    ],
    included: ["Cover and positioning", "Market opportunity", "Target customer", "Solution", "Market sizing", "Business model", "18-month roadmap", "Financial outlook"],
    bestFor: ["Startup business plans", "Small-business financing", "Internal strategy reviews", "Partner and investor meetings"],
  },
  {
    slug: "startup-pitch-deck",
    name: "Free Startup Pitch Deck PowerPoint Template",
    shortName: "Startup Pitch Deck",
    category: "Business",
    categorySlug: "pitch-deck",
    description: "An editable startup pitch deck template built around a concise problem, solution, market, traction, business model, competition, and funding story.",
    longDescription: "This free startup pitch deck template provides an eight-slide structure for a clear first investor conversation. It prioritizes evidence and narrative over decoration: establish a painful problem, reveal the product, quantify the market, show traction, explain the business model, position the company against alternatives, and finish with a specific funding ask. The cobalt and coral design uses editable native PowerPoint shapes, so founders can replace colors, numbers, and copy without specialist design software.",
    accent: "FF6B57", dark: "14213D", soft: "EEF2FF",
    tags: ["Pitch deck", "Startup", "Fundraising", "16:9"],
    slides: [
      { eyebrow: "SEED ROUND · 2026", title: "The operating system for independent teams", body: "Turn scattered work into one clear, repeatable customer workflow." },
      { eyebrow: "01 · PROBLEM", title: "Critical work disappears between disconnected tools", body: "Teams spend their best hours coordinating information instead of serving customers.", stat: "11h" },
      { eyebrow: "02 · SOLUTION", title: "One workspace that moves work forward", body: "Capture requests, coordinate decisions, and deliver outcomes without manual handoffs." },
      { eyebrow: "03 · MARKET", title: "A large market with a focused entry point", body: "Begin with service teams where workflow speed directly affects revenue.", stat: "$8.7B" },
      { eyebrow: "04 · TRACTION", title: "Early users return, expand, and refer", body: "Use verified cohorts, pipeline, and customer proof to demonstrate real pull.", stat: "+18%" },
      { eyebrow: "05 · BUSINESS MODEL", title: "Simple pricing that scales with usage", body: "Connect pricing to customer value and explain the path to attractive unit economics." },
      { eyebrow: "06 · COMPETITION", title: "Win on workflow depth, not feature count", body: "Show why the chosen customer switches and why the advantage becomes stronger." },
      { eyebrow: "07 · THE ASK", title: "Raise to prove repeatable distribution", body: "State the amount, runway, milestones, hiring plan, and evidence this round will create.", stat: "$1.5M" },
    ],
    included: ["Cover and vision", "Problem", "Product solution", "Market opportunity", "Traction", "Business model", "Competitive position", "Funding ask"],
    bestFor: ["Pre-seed and seed pitches", "Accelerator demo days", "Angel investor meetings", "Internal fundraising preparation"],
  },
  {
    slug: "company-profile-presentation",
    name: "Free Company Profile PowerPoint Template",
    shortName: "Company Profile",
    category: "Business",
    categorySlug: "company-profile",
    description: "A modern company profile template for explaining who you are, what you offer, how you work, your proof, team, and next step.",
    longDescription: "This free company profile PowerPoint template helps businesses introduce themselves without producing a generic corporate brochure. The eight-slide story covers the company promise, key facts, customer problem, services, delivery approach, evidence, leadership team, and a practical call to action. Warm amber accents and editorial layouts create a credible but approachable style for sales meetings, partnership proposals, recruitment, onboarding, and company introductions. All text and graphic elements are editable in PowerPoint.",
    accent: "F5B544", dark: "263238", soft: "FFF5DD",
    tags: ["Company profile", "Corporate", "Sales", "16:9"],
    slides: [
      { eyebrow: "COMPANY PROFILE · 2026", title: "Make complex operations feel simple", body: "A specialist team helping growing companies design reliable customer experiences." },
      { eyebrow: "01 · AT A GLANCE", title: "Experienced enough to deliver, focused enough to care", body: "Introduce the company with a few verified facts that matter to prospective customers.", stat: "12 yrs" },
      { eyebrow: "02 · WHY WE EXIST", title: "Growth should not create customer friction", body: "Describe the costly problem your company is uniquely equipped to solve." },
      { eyebrow: "03 · WHAT WE DO", title: "Expert support across the full journey", body: "Group services into three understandable offers rather than a long capability list." },
      { eyebrow: "04 · HOW WE WORK", title: "A practical path from diagnosis to results", body: "Explain discovery, design, delivery, and continuous improvement." },
      { eyebrow: "05 · PROOF", title: "Outcomes customers can verify", body: "Use specific case evidence, a clear baseline, and a credible measurement period.", stat: "31%" },
      { eyebrow: "06 · TEAM", title: "Senior people stay close to the work", body: "Introduce accountable leaders and the expertise customers will actually access." },
      { eyebrow: "07 · NEXT STEP", title: "Begin with one valuable problem", body: "End with a low-friction next action, a named contact, and a clear expectation." },
    ],
    included: ["Company introduction", "At-a-glance facts", "Mission and customer problem", "Services", "Delivery process", "Case-study proof", "Leadership team", "Contact and next step"],
    bestFor: ["Sales introductions", "Partnership proposals", "Recruitment and onboarding", "Corporate overview meetings"],
  },
  {
    slug: "marketing-plan-presentation",
    name: "Free Marketing Plan PowerPoint Template",
    shortName: "Marketing Plan",
    category: "Marketing Plan",
    categorySlug: "marketing",
    description: "A vivid, editable marketing plan template for connecting audience insight, positioning, channels, campaigns, budget, and KPIs.",
    longDescription: "This free marketing plan PowerPoint template turns a collection of tactics into one coherent growth story. Eight editable slides move from the commercial objective and audience insight to positioning, channel choices, campaign concept, budget allocation, measurement, and the next experiment. The original violet, aqua, and warm-white visual system uses gradients sparingly and keeps charts readable, making it suitable for launch plans, quarterly reviews, agency proposals, and internal marketing alignment.",
    accent: "6C4BFF", dark: "211A46", soft: "E9FAF7",
    tags: ["Marketing plan", "Campaign", "Strategy", "16:9"],
    slides: [
      { eyebrow: "MARKETING PLAN · 2026", title: "Make the useful choice feel obvious", body: "A focused growth plan built around one audience, one promise, and measurable learning." },
      { eyebrow: "01 · OBJECTIVE", title: "Define the behavior the plan must change", body: "Connect a commercial goal to one observable customer action and a clear time horizon.", stat: "+24%" },
      { eyebrow: "02 · AUDIENCE", title: "Design for a specific moment of need", body: "Describe the audience context, tension, alternatives, and evidence that shapes the message." },
      { eyebrow: "03 · POSITIONING", title: "Own one valuable difference", body: "Translate product capability into a memorable customer promise supported by credible proof." },
      { eyebrow: "04 · CHANNEL MIX", title: "Match each channel to its job", body: "Separate demand creation, demand capture, conversion, and retention instead of copying tactics.", stat: "4 roles" },
      { eyebrow: "05 · CAMPAIGN", title: "Build one idea that travels", body: "Create a campaign platform that stays recognizable across formats without repeating one asset." },
      { eyebrow: "06 · BUDGET", title: "Fund learning before scale", body: "Allocate spend by hypothesis, define stop rules, and reserve room for the strongest signal.", stat: "70/20/10" },
      { eyebrow: "07 · MEASUREMENT", title: "Measure the path, not just the finish", body: "Track leading indicators, conversion quality, payback, and the next decision the data enables." },
    ],
    included: ["Plan overview", "Objective", "Audience insight", "Positioning", "Channel mix", "Campaign platform", "Budget allocation", "KPI scorecard"],
    bestFor: ["Product launch plans", "Quarterly marketing reviews", "Agency recommendations", "Growth experiments"],
  },
  {
    slug: "project-proposal-presentation",
    name: "Free Project Proposal PowerPoint Template",
    shortName: "Project Proposal",
    category: "Project Proposal",
    categorySlug: "project-proposal",
    description: "An editable project proposal deck for clarifying the challenge, approach, deliverables, timeline, budget, risks, and approval needed.",
    longDescription: "This free project proposal PowerPoint template is designed to help a sponsor make a confident decision. It opens with the outcome and context, then explains the proposed approach, scope boundaries, work plan, investment, risk controls, and the exact approval required. An original modular layout system combines bright orange with ink and pale stone, using oversized section numbers and structured blocks rather than borrowed illustrations or decorative assets.",
    accent: "FF7139", dark: "24242A", soft: "F4EFE7",
    tags: ["Project proposal", "Scope", "Timeline", "16:9"],
    slides: [
      { eyebrow: "PROJECT PROPOSAL · 2026", title: "Move from a costly gap to a working result", body: "A practical proposal with clear ownership, boundaries, milestones, and measures." },
      { eyebrow: "01 · CONTEXT", title: "The current process creates avoidable delay", body: "Show what happens today, who is affected, and why the problem is worth solving now.", stat: "9 days" },
      { eyebrow: "02 · OUTCOME", title: "Define success in observable terms", body: "Describe the future state and the evidence that will demonstrate meaningful improvement." },
      { eyebrow: "03 · APPROACH", title: "Deliver value in three controlled stages", body: "Sequence discovery, pilot delivery, and measured rollout with an owner for each stage." },
      { eyebrow: "04 · SCOPE", title: "Make the boundaries explicit", body: "State what is included, what is excluded, and which assumptions could change the plan.", stat: "6 outputs" },
      { eyebrow: "05 · TIMELINE", title: "Create decision points, not just dates", body: "Use milestones to review evidence, resolve dependencies, and authorize the next investment." },
      { eyebrow: "06 · INVESTMENT", title: "Connect cost to delivered value", body: "Separate fixed work, variable costs, contingency, and the client responsibilities behind the estimate.", stat: "$48K" },
      { eyebrow: "07 · APPROVAL", title: "End with one clear decision", body: "Name the approver, decision deadline, immediate next step, and materials needed to begin." },
    ],
    included: ["Proposal cover", "Current context", "Target outcome", "Delivery approach", "Scope boundaries", "Milestone plan", "Budget", "Approval request"],
    bestFor: ["Client proposals", "Internal transformation projects", "Consulting engagements", "Technology implementations"],
  },
  {
    slug: "sales-report-presentation",
    name: "Free Sales Report PowerPoint Template",
    shortName: "Sales Report",
    category: "Sales Report",
    categorySlug: "sales-report",
    description: "A sharp sales report template for presenting revenue performance, pipeline health, segment movement, wins, risks, and next actions.",
    longDescription: "This free sales report PowerPoint template keeps a recurring business review focused on decisions. The eight-slide structure moves from the executive scorecard to trend, pipeline, segment performance, customer wins, risks, forecast, and commitments. Its original dark dashboard aesthetic uses high-contrast chartreuse and cyan accents, native charts made from PowerPoint shapes, and generous spacing so performance signals remain easy to scan in a meeting.",
    accent: "C8F04B", dark: "111719", soft: "DDF7F4",
    tags: ["Sales report", "Revenue", "Dashboard", "16:9"],
    slides: [
      { eyebrow: "SALES REVIEW · Q3 2026", title: "Growth is healthy—quality is the next constraint", body: "A concise view of revenue, pipeline, customer movement, and the decisions ahead." },
      { eyebrow: "01 · SCORECARD", title: "Revenue finished ahead of the base plan", body: "Compare actual, target, prior period, and forecast without hiding the underlying mix.", stat: "$3.8M" },
      { eyebrow: "02 · TREND", title: "Expansion now contributes more of the gain", body: "Separate new business, expansion, contraction, and churn to explain the movement." },
      { eyebrow: "03 · PIPELINE", title: "Coverage is strong but concentrated", body: "Show stage conversion, age, source, and deal concentration—not just the headline multiple." },
      { eyebrow: "04 · SEGMENTS", title: "Mid-market momentum offsets enterprise delay", body: "Compare segments using the same revenue, cycle, conversion, and retention measures.", stat: "3.4×" },
      { eyebrow: "05 · WINS", title: "The strongest wins share one trigger", body: "Extract repeatable buying signals from recent customers and connect them to the playbook." },
      { eyebrow: "06 · RISKS", title: "Two gaps could weaken the next quarter", body: "Name the exposure, leading indicator, accountable owner, and mitigation date.", stat: "2 risks" },
      { eyebrow: "07 · COMMITMENTS", title: "Convert the review into owned actions", body: "Close with three priorities, one owner each, and the next date progress will be reviewed." },
    ],
    included: ["Executive scorecard", "Revenue trend", "Pipeline health", "Segment performance", "Customer wins", "Key risks", "Forecast", "Team commitments"],
    bestFor: ["Weekly sales meetings", "Quarterly business reviews", "Board updates", "Revenue leadership reviews"],
  },
  {
    slug: "lesson-plan-presentation",
    name: "Free Lesson Plan PowerPoint Template",
    shortName: "Lesson Plan",
    category: "Lesson Plan",
    categorySlug: "education",
    description: "A friendly lesson plan template with clear objectives, concepts, examples, guided practice, checks for understanding, and recap.",
    longDescription: "This free lesson plan PowerPoint template gives teachers a calm, flexible structure for classroom or online instruction. It includes a welcome, learning objectives, prior-knowledge prompt, concept explanation, worked example, guided activity, quick assessment, and recap. The original visual system uses large rounded learning cards, a soft lavender, peach, mint, and navy palette, and a subtle dot grid; it does not copy notebook paper, tape, stickers, or illustrations from any reference template.",
    accent: "7C66E8", dark: "24304A", soft: "FFF2E7",
    tags: ["Lesson plan", "Education", "Teacher", "16:9"],
    slides: [
      { eyebrow: "TODAY'S LESSON · 45 MIN", title: "Patterns help us explain change", body: "Observe, describe, test, and communicate one useful pattern." },
      { eyebrow: "01 · OBJECTIVES", title: "By the end, you can do three things", body: "Describe the skill in learner-friendly language and connect it to a visible outcome.", stat: "3 goals" },
      { eyebrow: "02 · WARM-UP", title: "What do you notice first?", body: "Activate prior knowledge with one accessible prompt and time for every learner to think." },
      { eyebrow: "03 · CONCEPT", title: "A pattern connects inputs to outcomes", body: "Introduce one idea at a time, define essential language, and show a simple representation." },
      { eyebrow: "04 · EXAMPLE", title: "Watch the reasoning, not only the answer", body: "Model each step, explain why it matters, and surface a common misconception.", stat: "4 steps" },
      { eyebrow: "05 · PRACTICE", title: "Try it together, then independently", body: "Move from guided support to individual work with a clear success criterion." },
      { eyebrow: "06 · CHECK", title: "Use one question to reveal understanding", body: "Choose a quick response that shows who is ready and who needs another example.", stat: "2 min" },
      { eyebrow: "07 · RECAP", title: "Name the idea you will use again", body: "Summarize the concept, invite one reflection, and preview where it appears next." },
    ],
    included: ["Lesson opener", "Learning objectives", "Warm-up", "Core concept", "Worked example", "Guided practice", "Quick assessment", "Recap"],
    bestFor: ["Classroom lessons", "Online teaching", "Teacher training", "Student workshops"],
  },
  {
    slug: "thesis-defense-presentation",
    name: "Free Thesis Defense PowerPoint Template",
    shortName: "Thesis Defense",
    category: "Thesis Defense",
    categorySlug: "thesis-defense",
    description: "A formal thesis defense template for presenting the research question, literature, method, findings, discussion, limitations, and conclusion.",
    longDescription: "This free thesis defense PowerPoint template is built for an evidence-led academic presentation. Its eight slides create a disciplined path through the research question, context, gap, method, results, interpretation, limitations, and contribution. The original cream, cobalt, and burgundy system uses editorial rules, citations, and restrained geometric annotations. It avoids copied photography, waves, illustrations, and page compositions from the visual reference.",
    accent: "325DCC", dark: "22243A", soft: "F2EBDD",
    tags: ["Thesis defense", "Research", "University", "16:9"],
    slides: [
      { eyebrow: "THESIS DEFENSE · 2026", title: "How shared context changes team decisions", body: "An empirical study of information quality, coordination, and decision speed." },
      { eyebrow: "01 · QUESTION", title: "When does more information improve a decision?", body: "State one research question, define the setting, and explain why the answer matters.", stat: "1 question" },
      { eyebrow: "02 · LITERATURE", title: "Prior work explains access, not interpretation", body: "Synthesize the dominant findings and the unresolved tension that motivates the study." },
      { eyebrow: "03 · METHOD", title: "A mixed-method design tests both effect and mechanism", body: "Describe the sample, measures, procedure, analysis, ethics, and preregistered choices." },
      { eyebrow: "04 · FINDINGS", title: "Structured context improved decision speed", body: "Lead with the main result, show uncertainty, and distinguish planned from exploratory analysis.", stat: "−18%" },
      { eyebrow: "05 · DISCUSSION", title: "Shared interpretation matters more than volume", body: "Connect the finding to theory without claiming more than the evidence supports." },
      { eyebrow: "06 · LIMITATIONS", title: "The result is bounded by setting and duration", body: "Name meaningful constraints and explain how future work can test generalizability.", stat: "3 limits" },
      { eyebrow: "07 · CONTRIBUTION", title: "Design context for use, not storage", body: "Close with the theoretical contribution, practical implication, and next research question." },
    ],
    included: ["Title and abstract", "Research question", "Literature and gap", "Method", "Findings", "Discussion", "Limitations", "Conclusion"],
    bestFor: ["Master's thesis defenses", "Doctoral research talks", "Conference presentations", "Research proposal reviews"],
  },
  {
    slug: "clinical-case-presentation",
    name: "Free Medical Clinical Case PowerPoint Template",
    shortName: "Clinical Case",
    category: "Clinical Case",
    categorySlug: "medical",
    description: "A clean clinical case template for presenting de-identified history, examination, investigation, assessment, treatment, outcome, and learning points.",
    longDescription: "This free medical clinical case PowerPoint template supports a clear and privacy-conscious case discussion. The structure covers the de-identified presentation, relevant history, examination, investigations, differential, management, outcome, and learning points. Its original white and blue interface uses clinical data bands, simple evidence markers, and a cyan accent. No patient photographs, medical illustrations, icons, or other third-party template elements are included.",
    accent: "1E8FA8", dark: "153B56", soft: "E8F5F7",
    tags: ["Medical", "Clinical case", "Healthcare", "16:9"],
    slides: [
      { eyebrow: "CLINICAL CASE · EDUCATIONAL", title: "A structured review of a complex presentation", body: "De-identified history, reasoning, management, outcome, and learning points." },
      { eyebrow: "01 · PRESENTATION", title: "Begin with the reason care was sought", body: "Summarize the presenting concern, onset, severity, and relevant context without identifiers.", stat: "Day 1" },
      { eyebrow: "02 · HISTORY", title: "Separate relevant signal from background", body: "Organize medical, medication, family, social, and exposure history around the question." },
      { eyebrow: "03 · EXAMINATION", title: "Report findings that change the assessment", body: "Present vital signs, focused examination, red flags, and meaningful negative findings." },
      { eyebrow: "04 · INVESTIGATION", title: "Use tests to update probability", body: "Show the sequence, reference ranges, imaging summary, and how each result changed reasoning.", stat: "4 tests" },
      { eyebrow: "05 · ASSESSMENT", title: "Make the differential explicit", body: "Compare supporting and opposing evidence, urgency, and the consequences of missing each option." },
      { eyebrow: "06 · MANAGEMENT", title: "Connect each intervention to a clinical goal", body: "Explain treatment, monitoring, shared decisions, escalation criteria, and supporting evidence.", stat: "3 goals" },
      { eyebrow: "07 · LEARNING", title: "Turn one case into transferable practice", body: "Close with outcome, follow-up, limitations, and three points the audience can apply." },
    ],
    included: ["Case overview", "Presentation", "Relevant history", "Examination", "Investigations", "Differential assessment", "Management", "Learning points"],
    bestFor: ["Clinical case conferences", "Medical education", "Residency teaching", "Quality and safety reviews"],
  },
  {
    slug: "artificial-intelligence-presentation",
    name: "Free Artificial Intelligence PowerPoint Template",
    shortName: "Artificial Intelligence",
    category: "AI & Technology",
    categorySlug: "artificial-intelligence",
    description: "An original AI presentation template for explaining the opportunity, system, workflow, evidence, safeguards, roadmap, and adoption plan.",
    longDescription: "This free artificial intelligence PowerPoint template helps technical and non-technical audiences understand an AI initiative without leaning on robot imagery. Eight editable slides move from the user problem to system architecture, workflow, evaluation, human oversight, risks, roadmap, and adoption. The original visual language combines white space, near-black type, electric violet, and a network of simple nodes and routes made entirely from native PowerPoint shapes.",
    accent: "7A4DFF", dark: "16152B", soft: "EEF0FF",
    tags: ["Artificial intelligence", "Technology", "AI strategy", "16:9"],
    slides: [
      { eyebrow: "AI SYSTEM · 2026", title: "Build intelligence people can direct", body: "A clear view of the user need, system behavior, evidence, safeguards, and adoption path." },
      { eyebrow: "01 · OPPORTUNITY", title: "The best automation begins with a costly decision", body: "Define the user, workflow, current failure mode, and value of a better outcome.", stat: "6.2h" },
      { eyebrow: "02 · SYSTEM", title: "Separate inputs, reasoning, tools, and outputs", body: "Explain the architecture in language each stakeholder can inspect and challenge." },
      { eyebrow: "03 · EXPERIENCE", title: "Keep the user in control at consequential moments", body: "Show where people provide context, review work, override results, and recover from errors." },
      { eyebrow: "04 · EVALUATION", title: "Measure quality before speed", body: "Define representative tasks, baselines, failure categories, acceptance thresholds, and monitoring.", stat: "92%" },
      { eyebrow: "05 · SAFEGUARDS", title: "Design limits into the product", body: "Address privacy, permissions, provenance, harmful output, escalation, and auditability." },
      { eyebrow: "06 · ROADMAP", title: "Expand capability only after evidence", body: "Sequence prototype, limited pilot, operational validation, and controlled availability.", stat: "4 gates" },
      { eyebrow: "07 · ADOPTION", title: "Change the workflow, not only the tool", body: "Name ownership, training, support, success measures, and the feedback loop after launch." },
    ],
    included: ["AI opportunity", "System architecture", "User workflow", "Evaluation plan", "Safeguards", "Operating model", "Roadmap", "Adoption plan"],
    bestFor: ["AI product demos", "Technology strategy", "Internal AI proposals", "Technical concept explainers"],
  },
  {
    slug: "creative-portfolio-presentation",
    name: "Free Creative Portfolio PowerPoint Template",
    shortName: "Creative Portfolio",
    category: "Creative Portfolio",
    categorySlug: "portfolio",
    description: "An elegant, image-ready portfolio template for presenting selected work, process, outcomes, capabilities, biography, and contact details.",
    longDescription: "This free creative portfolio PowerPoint template gives work enough space to speak. Its eight-slide sequence introduces a point of view, selected projects, a case study, the creative process, measurable outcomes, capabilities, biography, and contact information. The original editorial design combines warm gray, terracotta, charcoal, and asymmetric image placeholders. All placeholders are native shapes; no photographs, fonts, frames, or decorative assets were copied from the visual reference.",
    accent: "C35F4A", dark: "302B2A", soft: "F0E9E3",
    tags: ["Portfolio", "Creative", "Case study", "16:9"],
    slides: [
      { eyebrow: "SELECTED WORK · 2026", title: "Ideas made useful, clear, and memorable", body: "A curated portfolio of identity, digital, and communication work." },
      { eyebrow: "01 · POINT OF VIEW", title: "Design should make the next action easier", body: "Introduce the principles that connect your strongest work and the clients you serve.", stat: "8 yrs" },
      { eyebrow: "02 · SELECTED WORK", title: "Three projects, three kinds of value", body: "Curate a small set of relevant work instead of presenting every completed project." },
      { eyebrow: "03 · CASE STUDY", title: "From a fragmented story to one clear system", body: "Frame the challenge, constraints, key choice, delivered work, and visible result." },
      { eyebrow: "04 · PROCESS", title: "Make collaboration part of the craft", body: "Show how you learn, frame, explore, decide, make, test, and refine with stakeholders.", stat: "6 steps" },
      { eyebrow: "05 · OUTCOMES", title: "Connect quality to an observable result", body: "Use evidence such as adoption, comprehension, conversion, efficiency, or recognition." },
      { eyebrow: "06 · CAPABILITIES", title: "Present a focused offer, not a software list", body: "Group capabilities around client outcomes and clarify the role you play in each.", stat: "3 offers" },
      { eyebrow: "07 · CONTACT", title: "Invite one specific conversation", body: "Finish with availability, preferred project types, contact details, and a practical next step." },
    ],
    included: ["Portfolio cover", "Creative point of view", "Selected work", "Case study", "Process", "Outcomes", "Capabilities", "Biography and contact"],
    bestFor: ["Designer portfolios", "Creative agency credentials", "Photography selections", "Freelance client pitches"],
  },
  {
    slug: "product-roadmap-presentation",
    name: "Free Product Roadmap PowerPoint Template",
    shortName: "Product Roadmap",
    category: "Product Roadmap",
    categorySlug: "product-roadmap",
    description: "A dark, high-contrast product roadmap template for aligning vision, evidence, themes, releases, dependencies, metrics, and next milestones.",
    longDescription: "This free product roadmap PowerPoint template turns a list of features into a strategy the team can discuss. It starts with vision and evidence, then organizes product themes, now-next-later priorities, release gates, dependencies, success measures, and immediate commitments. Its original midnight interface uses cyan, lime, and amber waypoints connected by a stepped route, with every visual created from editable PowerPoint shapes.",
    accent: "48D9D0", dark: "111A2C", soft: "E9F7F2",
    tags: ["Product roadmap", "Product management", "Timeline", "16:9"],
    slides: [
      { eyebrow: "PRODUCT ROADMAP · H2 2026", title: "Move from useful moments to lasting habits", body: "A strategy-led roadmap connecting customer evidence, product bets, releases, and measures." },
      { eyebrow: "01 · VISION", title: "Make the core outcome achievable in minutes", body: "State the future customer behavior and the durable advantage the product will build.", stat: "< 5 min" },
      { eyebrow: "02 · EVIDENCE", title: "Three signals shape the next bets", body: "Combine behavioral data, customer research, commercial context, and technical learning." },
      { eyebrow: "03 · THEMES", title: "Organize work around outcomes", body: "Use a small set of strategic themes to connect individual initiatives to customer value." },
      { eyebrow: "04 · PRIORITIES", title: "Now, next, and later express confidence", body: "Show sequencing and uncertainty without implying precision the evidence cannot support.", stat: "3 horizons" },
      { eyebrow: "05 · RELEASES", title: "Every release has an evidence gate", body: "Define who receives it, what is learned, how risk is contained, and what unlocks expansion." },
      { eyebrow: "06 · DEPENDENCIES", title: "Surface constraints before they become delays", body: "Map platform, data, policy, go-to-market, and staffing dependencies to accountable owners.", stat: "5 links" },
      { eyebrow: "07 · MEASURES", title: "Review outcomes and make the next decision", body: "Track adoption, customer value, quality, reliability, and the next milestone to revisit." },
    ],
    included: ["Roadmap cover", "Product vision", "Customer evidence", "Strategic themes", "Now-next-later", "Release gates", "Dependencies", "Success measures"],
    bestFor: ["Product strategy reviews", "Cross-functional planning", "Leadership updates", "Release planning"],
  },
];

export const templates: PptTemplate[] = [...originalTemplates, ...dailyTemplates, ...templates20260910, ...templates20260910Round2];

export function getTemplate(slug: string) { return templates.find((template) => template.slug === slug); }
export function getTemplateCategory(slug: string) { return templateCategories.find((category) => category.slug === slug); }
