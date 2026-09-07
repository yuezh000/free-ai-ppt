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

export const templates: PptTemplate[] = [
  {
    slug: "business-plan-presentation",
    name: "Free Business Plan PowerPoint Template",
    shortName: "Business Plan",
    category: "Business",
    categorySlug: "business",
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
    categorySlug: "business",
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
    categorySlug: "business",
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
];

export function getTemplate(slug: string) { return templates.find((template) => template.slug === slug); }
