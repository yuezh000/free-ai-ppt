import fs from "node:fs/promises";
import path from "node:path";
import pptxgen from "pptxgenjs";

const OUTPUT = path.join(process.cwd(), "public", "templates", "files");
const W = 13.333;
const H = 7.5;

const decks = [
  { slug:"restaurant-launch-business-plan", title:"Restaurant Launch Business Plan", subtitle:"Occasion, menu, service, and opening discipline", motif:"menu", accent:"C95B3D", second:"788256", dark:"26352B", soft:"F3E4C7", paper:"FCF7EA", slides:[
    ["OCCASION","Win one dining moment before expanding the menu","Define the guest, occasion, current compromise, frequency, and reason to choose this concept.","3 nights","illustrative frequency"],
    ["CONCEPT","Make the promise visible from doorway to check","Connect positioning, atmosphere, service pace, signature offer, and the feeling guests remember.","1 ritual","anchors the concept"],
    ["MENU","A compact menu protects quality and margin","Organize anchors, complements, beverages, prep overlap, price points, and seasonal rotation.","18 items","illustrative menu"],
    ["DEMAND","Size the neighborhood from observable behavior","Use footfall, occasions, trade area, competitive supply, conversion, and realistic seat capacity.","1.8 mi","illustrative trade area"],
    ["ECONOMICS","Contribution begins with every plate","Show average check, ingredient cost, labor, occupancy, waste, and sensitivity as placeholder assumptions.","68%","illustrative margin"],
    ["SERVICE","Design the shift before opening the doors","Map reservations, prep, handoffs, quality checks, table turns, recovery, and closing routines.","7 moves","one service rhythm"],
    ["OPENING","Release capital only when evidence is ready","Sequence permits, build, hiring, soft opening, launch, and the first operating review.","$180K","illustrative budget"]]},
  { slug:"deep-tech-startup-pitch-deck", title:"Deep Tech Startup Pitch Deck", subtitle:"A technical advantage made commercially legible", motif:"circuit", accent:"53D7E8", second:"F2A542", dark:"17142D", soft:"E8E3F6", paper:"F8F6FC", slides:[
    ["CONSTRAINT","Critical measurements arrive too late to change outcomes","Show the workflow, delay, failure cost, affected operator, and why existing options fall short.","36 hrs","illustrative delay"],
    ["BREAKTHROUGH","A new sensing stack converts noise into a useful signal","Explain the technical leap, customer consequence, boundary conditions, and present maturity.","4 layers","one integrated stack"],
    ["SYSTEM","Hardware, models, and workflow operate as one product","Trace capture, processing, inference, review, action, feedback, and system ownership.","7 steps","closed feedback loop"],
    ["VALIDATION","Representative tests show a repeatable advantage","Compare baseline, protocol, sample, result, uncertainty, failure cases, and next validation gate.","4.6×","illustrative result"],
    ["BEACHHEAD","Enter where delay is expensive and proof is accessible","Define the first buyer, use case, reachable accounts, buying trigger, and adjacent expansion.","120","illustrative accounts"],
    ["MOAT","The advantage compounds through deployment learning","Connect proprietary methods, data rights, integration depth, certification, know-how, and switching cost.","6 layers","defense in depth"],
    ["ASK","Fund the evidence required for commercial scale","State capital, runway, engineering, validation, pilot, regulatory, and revenue milestones.","$3.2M","illustrative seed ask"]]},
  { slug:"retro-company-profile-presentation", title:"Retro Company Profile", subtitle:"Identity, practice, proof, and partnership fit", motif:"capsule", accent:"D06B45", second:"D4A53B", dark:"4A1F2A", soft:"F1D69E", paper:"FAF0D9", slides:[
    ["PROMISE","We turn complicated offers into confident choices","Name the audience, recurring decision, useful outcome, and standard the company owns.","1 promise","connects the work"],
    ["FACTS","Focused scale keeps senior expertise close","Present verified locations, years, clients, disciplines, capacity, and ownership.","24 people","illustrative team"],
    ["CONTEXT","Customer expectations move faster than internal systems","Describe the market shift, friction, business consequence, and reason for action.","3 shifts","change the brief"],
    ["OFFERS","Three connected offers create one coherent experience","Group capabilities by outcome with clear scope, deliverables, timing, and accountable leads.","3 offers","one practice"],
    ["METHOD","A steady rhythm moves from evidence to adoption","Show diagnose, frame, make, test, launch, learn, and improve as an owned workflow.","7 moves","repeatable delivery"],
    ["PROOF","Selected outcomes reveal how the practice works","State client context, baseline, intervention, measured result, period, and limitations.","+22%","illustrative outcome"],
    ["FIT","Begin where clarity would change a decision","Close with project fit, working mode, availability, contact, and one specific invitation.","Q4","illustrative opening"]]},
  { slug:"event-marketing-plan-presentation", title:"Event Marketing Plan", subtitle:"A twelve-week path from relevance to attendance", motif:"ticket", accent:"F2645A", second:"75C7A7", dark:"35203F", soft:"DFF0DF", paper:"FCF8EF", slides:[
    ["BRIEF","Define the attendance behavior the event must create","Set audience, capacity, paid or free model, commercial goal, timing, and constraints.","750 seats","illustrative capacity"],
    ["AUDIENCE","Prioritize communities with a shared reason to attend","Map roles, motivations, objections, trusted sources, decision timing, and accessibility needs.","4 groups","one event need"],
    ["PROMISE","Sell the change participants take home","Build the event promise, proof, program pillars, speaker role, and action hierarchy.","1 promise","earns attention"],
    ["CHANNELS","Give each channel one job in the attendance journey","Assign awareness, validation, capture, conversion, reminder, and advocacy roles.","6 roles","across the journey"],
    ["FLIGHTING","Use twelve weeks to build belief, urgency, and readiness","Sequence announce, educate, prove, convert, prepare, live coverage, and follow-up.","12 weeks","illustrative flight"],
    ["PARTNERS","Make partner reach useful to both audiences","Define partner fit, asset exchange, ownership, tracking, deadlines, and shared value.","8 partners","illustrative network"],
    ["SCORECARD","Measure attendance quality—not registrations alone","Track qualified reach, conversion, show rate, engagement, pipeline, cost, and next action.","$42 CPA","illustrative metric"]]},
  { slug:"road-construction-project-proposal", title:"Road Construction Project Proposal", subtitle:"Safety, access, delivery, cost, and confidence", motif:"lane", accent:"F1A52B", second:"D7D9D3", dark:"25292C", soft:"E9E4D8", paper:"F5F2EA", slides:[
    ["NEED","The corridor no longer serves present demand safely","Quantify delay, conflict points, access, maintenance burden, affected users, and urgency.","18 min","illustrative delay"],
    ["OUTCOME","Success means safer and more reliable movement","Define travel, safety, access, resilience, construction, and community outcome measures.","6 measures","one corridor"],
    ["CONCEPT","A complete corridor separates competing movements","Explain alignment, intersections, transit, walking, cycling, drainage, utilities, and boundaries.","4 modes","designed together"],
    ["SCOPE","Package the work around verifiable handoffs","List design, enabling works, civil works, systems, testing, exclusions, and owner obligations.","6 packages","clear boundaries"],
    ["STAGING","Maintain access while the route changes","Sequence surveys, utilities, temporary traffic, zones, commissioning, and reinstatement.","5 stages","continuous access"],
    ["CONTROLS","Put safety, cost, environment, and change on one register","Assign leading indicators, thresholds, mitigations, owners, reporting, and escalation.","8 controls","visible weekly"],
    ["GATE","Approve detailed design against stated conditions","Close with budget range, funding, decision owner, dependencies, and next evidence gate.","$24M","illustrative range"]]},
  { slug:"weekly-sales-report-presentation", title:"Weekly Sales Report", subtitle:"Seven days of movement, confidence, and ownership", motif:"weekgrid", accent:"C8E34D", second:"E1B86B", dark:"202829", soft:"ECE4CE", paper:"F7F5EC", slides:[
    ["HEADLINE","The week finished above pace with one timing risk","Compare bookings, target, prior week, quarter pace, mix, and the cause behind variance.","108%","illustrative pace"],
    ["BRIDGE","Expansion and one new logo drove the gain","Separate opening pipeline, created, advanced, won, slipped, lost, and closing position.","+$84K","illustrative bookings"],
    ["FUNNEL","Discovery moved faster; proposals need stronger next steps","Show entries, exits, conversion, age, velocity, and verified customer actions.","−3 pts","proposal conversion"],
    ["ACTIVITY","Quality conversations matter more than raw volume","Connect calls, meetings, decision-makers, follow-ups, next actions, and opportunity movement.","23 meets","illustrative quality"],
    ["REGIONS","West leads on velocity while East holds larger value","Compare consistent measures across territories and name the operating explanation.","4 regions","one scorecard"],
    ["FORECAST","Commit holds, but two dates require evidence","Present weekly movement, commit, upside, risks, assumptions, and next confirmation events.","$960K","illustrative commit"],
    ["ACTIONS","Close the review with owned moves for next week","Assign customer action, rep, support needed, signal of progress, and review date.","5 owners","next-week actions"]]},
  { slug:"grammar-lesson-plan-presentation", title:"Grammar Lesson Plan", subtitle:"Notice, name, move, test, explain, apply", motif:"syntax", accent:"E96951", second:"7A9CC6", dark:"213A5A", soft:"F2E4C9", paper:"FCF7E9", slides:[
    ["TARGET","Make the language move and its purpose visible","State what learners will identify, manipulate, explain, and use by the end.","4 goals","learner friendly"],
    ["NOTICE","Begin with two sentences that create different effects","Invite comparison, annotation, prediction, and discussion before naming the rule.","2 examples","one contrast"],
    ["ANATOMY","Map how each phrase contributes to meaning","Use movable word groups to show function, relationship, optionality, and punctuation.","5 parts","one sentence"],
    ["MODEL","Think aloud while testing alternative structures","Reveal cues, choices, tradeoffs, a misconception, and how the reader experience changes.","3 moves","thinking made visible"],
    ["PRACTICE","Rebuild sentences with one controlled change","Move from whole-class sorting to paired transformation and independent explanation.","18 min","guided to independent"],
    ["TRANSFER","Use the pattern in writing that matters","Apply the structure to a real paragraph, then justify the choice against the intended effect.","1 paragraph","authentic transfer"],
    ["EXIT","Check recognition, control, and reasoning separately","Collect one identification, one revision, one explanation, and the next teaching decision.","3 checks","guide tomorrow"]]},
  { slug:"monochrome-thesis-defense-presentation", title:"Monochrome Thesis Defense", subtitle:"Question, evidence, uncertainty, contribution", motif:"monograph", accent:"D64B3B", second:"8A8A86", dark:"161616", soft:"E8E5DE", paper:"F7F5F0", slides:[
    ["QUESTION","The study tests one bounded relationship","Define exposure, outcome, population, setting, period, and the claim the design can support.","1 question","bounds the claim"],
    ["GAP","Prior evidence measures access more often than accountability","Synthesize agreement, conflict, missing mechanism, measurement gap, and research opportunity.","46 papers","illustrative review"],
    ["HYPOTHESES","Three predictions connect visibility to behavior","State direction, mechanism, moderator, observable measure, and falsifying evidence.","H1–H3","preregistered"],
    ["DESIGN","A preregistered panel design tests change over time","Present sampling, assignment, measures, procedure, ethics, exclusions, and analysis plan.","n=384","illustrative sample"],
    ["RESULTS","Ownership cues improved traceability in the sample","Report estimate, interval, model, robustness, missingness, and planned versus exploratory results.","+0.31 SD","illustrative effect"],
    ["INTERPRET","The effect supports the mechanism within a narrow setting","Separate observation, inference, practical meaning, alternative explanation, and uncertainty.","95% CI","show uncertainty"],
    ["CONTRIBUTION","The contribution is a measurable theory of ownership cues","Close with theory, practice, limitations, replication, open questions, and the defended claim.","2 claims","supported here"]]},
  { slug:"patient-recovery-clinical-case", title:"Patient Recovery Clinical Case", subtitle:"Function, reasoning, response, and safety", motif:"carepath", accent:"A9415B", second:"6A9FA3", dark:"243448", soft:"F2DDE0", paper:"FBF7F6", slides:[
    ["CONCERN","Begin with the functional change that prompted evaluation","Summarize onset, trajectory, context, severity, relevant history, and meaningful negatives.","Day 0","de-identified"],
    ["BASELINE","Describe what the person could and could not do","Separate symptoms, activity, participation, environment, support, and patient priorities.","4 domains","one baseline"],
    ["ASSESS","Prioritize findings that change the working explanation","Present focused observations, measures, red flags, uncertainty, and the differential.","5 findings","changed reasoning"],
    ["GOALS","Translate priorities into observable recovery goals","Set function, time horizon, measure, shared decision, stopping rule, and review point.","3 goals","patient centered"],
    ["PATHWAY","Progress through stages only when criteria are met","Connect education, supported activity, graded load, monitoring, adaptation, and escalation.","5 stages","criteria led"],
    ["RESPONSE","Show change over time without overstating causality","Compare baseline and follow-up observations, adherence, context, variation, and uncertainty.","Week 6","illustrative review"],
    ["LEARNING","Separate case-specific outcome from transferable learning","Close with safety, follow-up, limitations, unresolved questions, and teaching points.","3 points","education only"]]},
  { slug:"ai-governance-presentation", title:"AI Governance", subtitle:"Evidence, ownership, review, and response", motif:"gate", accent:"FF6A35", second:"3566D6", dark:"191919", soft:"E8E4D8", paper:"F8F5EC", slides:[
    ["MANDATE","Govern decisions and consequences—not technology labels","Define purpose, scope, principles, authority, regulatory context, and success measures.","1 mandate","sets authority"],
    ["INVENTORY","Know every AI system, use case, owner, and dependency","Record purpose, users, decisions, data, provider, model, integrations, status, and review date.","27 systems","illustrative inventory"],
    ["RISK","Classification determines the depth of evidence and review","Assess impact, autonomy, sensitivity, reversibility, exposure, uncertainty, and obligations.","4 tiers","proportionate review"],
    ["RIGHTS","Make decision rights explicit across the lifecycle","Assign proposal, domain, data, engineering, security, legal, approval, operation, and audit roles.","8 roles","clear ownership"],
    ["GATES","Progress only when evidence satisfies the next gate","Sequence intake, design, evaluation, release, monitoring, material change, and retirement.","7 gates","lifecycle control"],
    ["MONITOR","Connect production signals to owned responses","Track quality, harm, bias, drift, privacy, misuse, reliability, complaints, and escalation.","9 signals","owned response"],
    ["ROLLOUT","Establish visibility before scaling governance depth","Phase inventory, triage, high-risk controls, operating cadence, automation, and assurance.","90 days","illustrative phase"]]},
  { slug:"architecture-portfolio-presentation", title:"Architecture Portfolio", subtitle:"Climate, movement, material, and daily life", motif:"planar", accent:"B8583D", second:"BFC5C4", dark:"303336", soft:"DDD9D1", paper:"F1EFEB", slides:[
    ["POSITION","Architecture begins with the life a place must support","State the practice position, contexts, scales, collaborators, and principles connecting the work.","7 years","illustrative practice"],
    ["INDEX","Curate projects around relevant range and depth","Introduce role, type, place, stage, collaborators, constraints, and one outcome for each.","4 works","selected with intent"],
    ["SITE","A civic edge becomes a shaded public room","Frame climate, movement, history, access, constraints, stakeholders, and the design question.","32° C","illustrative context"],
    ["SPACE","Three linked volumes organize a gradual threshold","Explain massing, circulation, program, light, view, accessibility, and moments of pause.","3 volumes","one sequence"],
    ["MATERIAL","A restrained material system supports repair and aging","Present structure, envelope, finish, sourcing, maintenance, carbon assumptions, and detail intent.","4 materials","illustrative palette"],
    ["PROCESS","Models make tradeoffs visible before commitments harden","Show research, alternatives, critique, coordination, prototyping, review, and iteration.","9 models","illustrative studies"],
    ["CONTACT","Invite the next project through a clear fit","Close with project types, role, availability, location, collaborators, and contact details.","Q1","illustrative opening"]]},
  { slug:"release-train-product-roadmap", title:"Release Train Product Roadmap", subtitle:"Outcomes, tracks, stations, gates, and decisions", motif:"transit", accent:"F2B134", second:"58B6D8", dark:"181D23", soft:"DCEAF0", paper:"F7F7F3", slides:[
    ["OUTCOME","The destination is a changed customer behavior","Define the user, moment, action, speed, quality, business value, and guardrail.","< 2 min","time to first value"],
    ["EVIDENCE","Signals determine which route deserves investment","Combine behavior, interviews, support, commercial context, reliability, and technical learning.","6 signals","shape priority"],
    ["TRACKS","Three outcome tracks keep initiatives connected","Group discovery, activation, trust, platform, and go-to-market work around owned results.","3 tracks","one destination"],
    ["STATIONS","Each release station delivers value and tests a belief","Show audience, availability, capability, hypothesis, success signal, and expansion rule.","4 stations","H1 sequence"],
    ["LINKS","Expose cross-track dependencies before dates move","Map data, platform, research, policy, enablement, staffing, vendor, and owner links.","8 links","visible early"],
    ["READY","Readiness gates protect quality without freezing learning","Define evaluation, reliability, privacy, support, commercial, rollback, and launch evidence.","7 checks","before departure"],
    ["REVIEW","Use the roadmap review to reroute investment","Compare expected and observed signals, update confidence, record choices, and own next actions.","30 days","review cadence"]]},
];

const noLine = { transparency: 100 };
const rect = (s,x,y,w,h,color,radius=false,transparency=0,lineColor=null,lineWidth=0) => s.addShape(radius ? "roundRect" : "rect", { x,y,w,h,rectRadius:.06,line:lineColor ? {color:lineColor,width:lineWidth||1} : noLine,fill:{color,transparency} });
const circle = (s,x,y,d,color,transparency=0,lineColor=null,lineWidth=0) => s.addShape("ellipse", { x,y,w:d,h:d,line:lineColor ? {color:lineColor,width:lineWidth||1} : noLine,fill:{color,transparency} });
const line = (s,x,y,w,h,color,width=1,dash="solid") => s.addShape("line", { x,y,w,h,line:{color,width,dash} });
const text = (s,value,x,y,w,h,o={}) => s.addText(value, { x,y,w,h,margin:0,fontFace:"Aptos",fontSize:12,color:"222222",breakLine:false,fit:"shrink",...o });
const label = (s,d,value,x=.72,y=.55,color=d.accent) => text(s,value,x,y,5.6,.24,{fontSize:8,bold:true,color,charSpacing:1.8});
const footer = (s,d,n,color=d.dark) => { text(s,"FREEAIPPT / ORIGINAL EDITABLE TEMPLATE",.72,7.1,3.35,.16,{fontSize:6.5,bold:true,color,charSpacing:1.1}); text(s,String(n).padStart(2,"0"),12.02,7.06,.58,.2,{fontSize:8,bold:true,color,align:"right"}); };
const darkMotifs = new Set(["circuit","lane","weekgrid","gate","transit"]);

function drawRoute(s,d,x,y,w,nodes,color=d.accent){
  line(s,x,y,w,0,color,3);
  for(let i=0;i<nodes;i++) circle(s,x+(w/(nodes-1))*i-.13,y-.13,.26,i===nodes-1?d.second:color,0,d.dark,1);
}

function cover(p,d){
  const s=p.addSlide(), m=d.motif, dark=darkMotifs.has(m);
  s.background={color:dark?d.dark:d.paper};
  if(m==="menu"){
    rect(s,0,0,3.15,H,d.dark); label(s,d,"OPENING MENU / PLAN",.6,.62,"FFFFFF"); text(s,"01",.62,1.55,1.6,.85,{fontFace:"Georgia",fontSize:42,bold:true,color:d.accent});
    ["OCCASION","MENU","SERVICE","ECONOMICS"].forEach((v,i)=>{text(s,v,.65,3.35+i*.55,1.72,.18,{fontSize:7.2,bold:true,color:"FFFFFF",charSpacing:1.1});line(s,1.82,3.46+i*.55,.72,0,d.soft,1,"dash");});
    text(s,d.title,3.88,1.4,7.75,1.55,{fontFace:"Georgia",fontSize:38,bold:true,color:d.dark}); text(s,d.subtitle,3.92,3.35,6.65,.62,{fontSize:15,color:"687068"});
    rect(s,3.92,5.25,6.82,.72,d.soft,true); text(s,"NEIGHBORHOOD TABLE  ·  OPENING 2026",4.25,5.52,6.18,.18,{fontSize:8,bold:true,color:d.dark,charSpacing:1.1,align:"center"}); circle(s,11.25,5.0,1.2,d.accent); circle(s,11.57,5.32,.56,d.paper);
  }else if(m==="circuit"){
    for(let x=.6;x<W;x+=.95)line(s,x,0,0,H,"2D2851",.6); for(let y=.6;y<H;y+=.95)line(s,0,y,W,0,"2D2851",.6);
    label(s,d,"SIGNAL / SEED ROUND",.75,.68,d.accent); text(s,d.title,.75,1.55,7.4,1.5,{fontFace:"Aptos Display",fontSize:39,bold:true,color:"FFFFFF"}); text(s,d.subtitle,.78,3.38,6.3,.62,{fontSize:15,color:"BDB7D8"});
    const pts=[[8.4,1.65],[10.2,1.65],[10.2,3.05],[11.65,3.05],[11.65,5.2],[9.3,5.2],[9.3,6.15]]; for(let i=0;i<pts.length-1;i++)line(s,pts[i][0],pts[i][1],pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1],i===3?d.second:d.accent,3); pts.forEach((q,i)=>circle(s,q[0]-.15,q[1]-.15,.3,i===3?d.second:d.accent));
    rect(s,.78,5.35,5.2,.66,"242044",true); text(s,"CAPTURE  →  INFER  →  DECIDE",1.08,5.59,4.55,.18,{fontSize:8,bold:true,color:d.accent,align:"center",charSpacing:1.1});
  }else if(m==="capsule"){
    rect(s,0,0,W,H,d.dark); rect(s,.7,.7,2.18,6.1,d.accent,true); circle(s,1.03,1.05,1.5,d.soft); text(s,"CO",1.3,1.55,.9,.38,{fontSize:19,bold:true,color:d.dark,align:"center"}); label(s,d,"PROFILE / EST. 2019",.95,5.88,"FFFFFF");
    text(s,d.title,3.65,1.55,7.82,1.45,{fontFace:"Georgia",fontSize:39,bold:true,color:"FFFFFF"}); text(s,d.subtitle,3.68,3.38,6.55,.62,{fontSize:15,color:d.soft});
    [[3.68,5.15,2.35,.68,d.soft],[6.2,5.15,1.55,.68,d.second],[7.92,5.15,3.15,.68,d.accent]].forEach(v=>rect(s,...v,true)); text(s,"PROMISE",4.18,5.41,1.34,.16,{fontSize:7,bold:true,color:d.dark,align:"center"}); text(s,"PROOF",6.53,5.41,.9,.16,{fontSize:7,bold:true,color:d.dark,align:"center"}); text(s,"PARTNERSHIP",8.5,5.41,2,.16,{fontSize:7,bold:true,color:"FFFFFF",align:"center"});
  }else if(m==="ticket"){
    rect(s,.55,.55,12.23,6.4,"FFFDF7",true,0,d.dark,1.2); rect(s,.55,.55,3.25,6.4,d.dark,true); for(let y=.86;y<6.7;y+=.42)circle(s,3.66,y,.14,d.paper);
    label(s,d,"EVENT / ADMIT ONE",.92,.9,d.accent); text(s,"12",.9,2.0,2.35,1.05,{fontSize:54,bold:true,color:"FFFFFF",align:"center"}); text(s,"WEEKS",1.28,3.18,1.55,.2,{fontSize:8,bold:true,color:d.second,align:"center",charSpacing:1.6});
    text(s,d.title,4.42,1.48,7.05,1.42,{fontFace:"Aptos Display",fontSize:40,bold:true,color:d.dark}); text(s,d.subtitle,4.45,3.2,6.2,.58,{fontSize:15,color:"706878"});
    [d.accent,d.second,d.soft].forEach((c,i)=>rect(s,4.45+i*2.18,5.18,1.85,.56,c,true)); ["REACH","CONVERT","GATHER"].forEach((v,i)=>text(s,v,4.74+i*2.18,5.39,1.26,.15,{fontSize:6.8,bold:true,color:i===2?d.dark:"FFFFFF",align:"center"}));
  }else if(m==="lane"){
    for(let x=.55;x<W;x+=1.35)line(s,x,5.72,.7,0,d.accent,6); line(s,0,5.05,W,0,"FFFFFF",1.5); line(s,0,6.42,W,0,"FFFFFF",1.5);
    label(s,d,"CORRIDOR / GATE 01",.72,.7,d.accent); text(s,d.title,.72,1.45,8.25,1.62,{fontFace:"Aptos Display",fontSize:37,bold:true,color:"FFFFFF"}); text(s,d.subtitle,.75,3.45,6.7,.58,{fontSize:15,color:"BCC1C2"});
    rect(s,9.4,.85,2.9,2.9,d.accent,true); rect(s,9.86,1.31,1.98,1.98,d.dark,true); text(s,"R01",10.23,2.05,1.2,.36,{fontSize:17,bold:true,color:d.accent,align:"center"});
  }else if(m==="weekgrid"){
    label(s,d,"SALES / WEEK 37",.72,.65,d.accent); text(s,d.title,.72,1.42,7.35,1.42,{fontFace:"Aptos Display",fontSize:40,bold:true,color:"FFFFFF"}); text(s,d.subtitle,.75,3.15,6.3,.58,{fontSize:15,color:"B8C2C0"});
    ["M","T","W","T","F","S","S"].forEach((v,i)=>{rect(s,.75+i*1.05,5.12,.82,.82,i===4?d.accent:"303A3A",true);text(s,v,.98+i*1.05,5.4,.36,.2,{fontSize:9,bold:true,color:i===4?d.dark:"FFFFFF",align:"center"});});
    [1.8,2.5,1.55,3.35,2.9].forEach((h,i)=>rect(s,8.8+i*.65,5.6-h*.72,.42,h*.72,i===4?d.accent:d.second,true)); line(s,8.55,5.6,3.75,0,"697573",1);
  }else if(m==="syntax"){
    rect(s,0,0,W,1.12,d.dark); label(s,d,"GRAMMAR LAB / 45 MIN",.72,.48,"FFFFFF"); text(s,d.title,.72,1.72,7.1,1.4,{fontFace:"Georgia",fontSize:42,bold:true,color:d.dark}); text(s,d.subtitle,.75,3.42,6.3,.58,{fontSize:15,color:"646F7D"});
    const words=[[7.95,1.5,1.25,"HOW"],[9.45,1.5,2.15,"STRUCTURE"],[8.55,3.28,1.4,"CHANGES"],[10.3,3.28,1.65,"EMPHASIS"]]; words.forEach((v,i)=>{rect(s,v[0],v[1],v[2],.62,i%2?d.soft:d.accent,true);text(s,v[3],v[0]+.12,v[1]+.23,v[2]-.24,.16,{fontSize:7,bold:true,color:i%2?d.dark:"FFFFFF",align:"center"});}); line(s,8.9,3.28,.95,-1.16,d.second,2);line(s,9.85,2.12,1.26,1.16,d.second,2); drawRoute(s,d,.75,5.65,5.7,6,d.second);
  }else if(m==="monograph"){
    rect(s,0,0,1.45,H,d.dark); rect(s,1.45,0,.12,H,d.accent); label(s,d,"DISSERTATION / DEFENSE",2.18,.72,d.accent); text(s,d.title,2.15,1.6,8.3,1.55,{fontFace:"Georgia",fontSize:39,bold:true,color:d.dark}); line(s,2.18,3.5,8.85,0,d.dark,1); text(s,d.subtitle,2.18,3.88,6.25,.58,{fontFace:"Georgia",fontSize:15,color:"61615E"});
    ["QUESTION","EVIDENCE","LIMITS"].forEach((v,i)=>{text(s,v,2.18+i*2.23,5.82,1.9,.18,{fontSize:7,bold:true,color:i===1?d.accent:d.dark,charSpacing:1.1});line(s,2.18+i*2.23,5.62,1.75,0,i===1?d.accent:d.dark,2);}); text(s,"95%",10.45,5.18,1.5,.7,{fontSize:34,bold:true,color:d.accent,align:"right"});
  }else if(m==="carepath"){
    rect(s,0,0,W,.18,d.accent); label(s,d,"CASE / DE-IDENTIFIED",.72,.72,d.accent); text(s,d.title,.72,1.58,7.5,1.45,{fontFace:"Aptos Display",fontSize:39,bold:true,color:d.dark}); text(s,d.subtitle,.75,3.35,6.2,.58,{fontSize:15,color:"65707B"});
    drawRoute(s,d,1.0,5.6,10.8,6,d.second); ["BASE","ASSESS","GOAL","LOAD","REVIEW","LEARN"].forEach((v,i)=>text(s,v,.72+i*2.16,6.08,1.62,.18,{fontSize:6.5,bold:true,color:d.dark,align:"center"})); circle(s,9.55,.9,2.5,d.soft);circle(s,10.0,1.35,1.6,d.accent,12);circle(s,10.42,1.77,.76,d.paper);
  }else if(m==="gate"){
    for(let i=0;i<5;i++){rect(s,8.05+i*.82,.9+i*.72,.52,4.9-i*.72,i===4?d.accent:(i%2?d.second:"FFFFFF"),true);}
    label(s,d,"GOVERN / REVIEW / RESPOND",.72,.7,d.accent); text(s,d.title,.72,1.55,6.55,1.35,{fontFace:"Aptos Display",fontSize:42,bold:true,color:"FFFFFF"}); text(s,d.subtitle,.75,3.22,5.85,.6,{fontSize:15,color:"C4C1B8"});
    ["INVENTORY","RISK","GATE","MONITOR"].forEach((v,i)=>{rect(s,.75+i*1.55,5.35,1.3,.5,i===2?d.accent:"2C2C2C",true);text(s,v,.88+i*1.55,5.54,1.04,.14,{fontSize:6.2,bold:true,color:"FFFFFF",align:"center"});});
  }else if(m==="planar"){
    rect(s,0,0,4.18,H,d.dark); label(s,d,"SELECTED WORK / 2026",.62,.68,"FFFFFF"); text(s,"01",.62,1.7,1.5,.7,{fontSize:38,bold:true,color:d.accent}); text(s,"SITE\nSPACE\nMATERIAL",.62,3.05,2.6,2.3,{fontFace:"Georgia",fontSize:19,bold:true,color:"FFFFFF",breakLine:true});
    rect(s,4.72,.8,7.7,2.22,d.soft); rect(s,5.12,1.2,2.6,1.42,d.accent); line(s,8.15,1.2,3.62,0,d.dark,1);line(s,8.15,1.65,2.72,0,d.dark,1);line(s,8.15,2.1,3.16,0,d.dark,1);
    text(s,d.title,4.72,3.55,7.1,1.22,{fontFace:"Aptos Display",fontSize:38,bold:true,color:d.dark}); text(s,d.subtitle,4.75,5.1,6.2,.56,{fontSize:14.5,color:"626668"}); text(s,"1:200",10.65,6.45,1.2,.16,{fontSize:7,bold:true,color:d.dark,align:"right"});line(s,9.45,6.28,2.4,0,d.accent,3);
  }else{
    for(let y=1.45;y<=5.35;y+=1.95)line(s,6.75,y,5.35,0,y===3.4?d.second:d.accent,4); for(let i=0;i<4;i++){circle(s,7.45+i*1.42,1.25,.4,d.accent);circle(s,8.15+i*.88,3.2,.4,d.second);circle(s,7.1+i*1.52,5.15,.4,i===3?d.accent:"FFFFFF");}
    label(s,d,"RELEASE TRAIN / H1",.72,.7,d.accent); text(s,d.title,.72,1.55,5.25,1.65,{fontFace:"Aptos Display",fontSize:38,bold:true,color:"FFFFFF"}); text(s,d.subtitle,.75,3.62,5.15,.58,{fontSize:15,color:"BEC8CF"}); rect(s,.75,5.35,4.75,.58,"262C33",true);text(s,"OUTCOME  →  STATION  →  EVIDENCE",1.05,5.56,4.15,.17,{fontSize:7,bold:true,color:d.accent,align:"center"});
  }
}

function content(p,d,a,n){
  const [e,title,body,stat,caption]=a, m=d.motif, dark=darkMotifs.has(m), s=p.addSlide(); s.background={color:dark?d.dark:(n%2?d.paper:"FFFFFF")};
  const ink=dark?"FFFFFF":d.dark, muted=dark?"BFC8C8":"626A70"; label(s,d,`${String(n).padStart(2,"0")} / ${e}`,.72,.52,d.accent); line(s,.72,.95,11.88,0,dark?"454B4D":"D7D3C9",.8);
  if(m==="menu"){
    rect(s,.72,1.35,3.0,4.85,d.dark,true);text(s,"TODAY",1.08,1.75,1.2,.18,{fontSize:7,bold:true,color:d.soft,charSpacing:1.2});text(s,stat,1.05,2.35,2.05,.68,{fontFace:"Georgia",fontSize:30,bold:true,color:d.accent});text(s,caption,1.08,3.25,1.95,.45,{fontSize:8.5,color:"DFE2D8"});
    ["INPUT","CHOICE","PROOF"].forEach((v,i)=>{text(s,v,1.08,4.5+i*.47,.88,.15,{fontSize:6.5,bold:true,color:"FFFFFF"});line(s,2.0,4.59+i*.47,1.05,0,d.soft,1,"dash");});text(s,title,4.35,1.55,7.35,1.3,{fontFace:"Georgia",fontSize:29,bold:true,color:ink});text(s,body,4.38,3.15,6.55,.78,{fontSize:13,color:muted});rect(s,4.38,4.82,6.45,.63,d.soft,true);text(s,"APPETITE  ·  CAPACITY  ·  CONTRIBUTION",4.78,5.06,5.65,.16,{fontSize:7,bold:true,color:d.dark,align:"center",charSpacing:.8});
  }else if(m==="circuit"){
    rect(s,.72,1.32,7.12,4.9,"211D3E",true);text(s,title,1.05,1.78,6.15,1.22,{fontFace:"Aptos Display",fontSize:28,bold:true,color:ink});text(s,body,1.08,3.25,5.72,.74,{fontSize:12.8,color:muted});
    const pts=[[1.1,5.3],[2.25,5.3],[2.25,4.62],[3.65,4.62],[3.65,5.3],[5.0,5.3],[5.0,4.72],[6.5,4.72]];for(let i=0;i<pts.length-1;i++)line(s,pts[i][0],pts[i][1],pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1],i===4?d.second:d.accent,2);pts.filter((_,i)=>i%2===0).forEach(q=>circle(s,q[0]-.1,q[1]-.1,.2,d.accent));
    rect(s,8.35,1.32,3.9,4.9,"100E22",true);text(s,"VALIDATION SIGNAL",8.75,1.8,2.7,.18,{fontSize:7,bold:true,color:d.second,charSpacing:1.1});text(s,stat,8.7,2.55,3.0,.72,{fontSize:31,bold:true,color:d.accent});text(s,caption,8.73,3.52,2.8,.4,{fontSize:8.5,color:muted});line(s,8.73,4.7,2.85,0,d.second,2);text(s,"NEXT_GATE / READY",8.73,5.02,2.8,.18,{fontSize:7,bold:true,color:d.accent});
  }else if(m==="capsule"){
    circle(s,.75,1.35,4.8,n%2?d.soft:d.accent,12);circle(s,1.45,2.05,3.4,d.paper);text(s,stat,1.8,2.65,2.65,.72,{fontFace:"Georgia",fontSize:30,bold:true,color:d.dark,align:"center"});text(s,caption,1.93,3.6,2.4,.4,{fontSize:8.5,color:muted,align:"center"});
    text(s,title,6.15,1.55,5.72,1.42,{fontFace:"Georgia",fontSize:28,bold:true,color:ink});text(s,body,6.18,3.35,5.25,.76,{fontSize:13,color:muted});["WHO","WHAT","PROOF"].forEach((v,i)=>{rect(s,6.18+i*1.7,4.95,1.45,.6,i===n%3?d.accent:d.soft,true);text(s,v,6.42+i*1.7,5.18,.95,.15,{fontSize:6.8,bold:true,color:i===n%3?"FFFFFF":d.dark,align:"center"});});
  }else if(m==="ticket"){
    rect(s,.72,1.32,11.52,4.92,"FFFDF8",true,0,d.dark,1);rect(s,.72,1.32,2.5,4.92,n%2?d.dark:d.accent,true);for(let y=1.57;y<6.05;y+=.4)circle(s,3.12,y,.12,dark?d.dark:(n%2?d.paper:"FFFFFF"));text(s,stat,1.02,2.15,1.9,.72,{fontSize:29,bold:true,color:"FFFFFF",align:"center"});text(s,caption,1.12,3.12,1.72,.48,{fontSize:8,color:"FFFFFF",align:"center"});text(s,title,3.85,1.72,7.65,1.24,{fontFace:"Aptos Display",fontSize:28,bold:true,color:ink});text(s,body,3.88,3.22,6.82,.76,{fontSize:13,color:muted});["REACH","BELIEVE","ACT"].forEach((v,i)=>{rect(s,3.88+i*1.85,4.87,1.55,.55,i===n%3?d.second:d.soft,true);text(s,v,4.1+i*1.85,5.08,1.1,.14,{fontSize:6.7,bold:true,color:d.dark,align:"center"});});
  }else if(m==="lane"){
    line(s,.72,5.78,11.55,0,"FFFFFF",1.4);for(let x=1;x<12;x+=1.5)line(s,x,5.25,.78,0,d.accent,5);text(s,title,.72,1.35,7.2,1.3,{fontFace:"Aptos Display",fontSize:29,bold:true,color:ink});text(s,body,.75,2.95,6.25,.74,{fontSize:13,color:muted});rect(s,8.35,1.32,3.88,3.25,d.accent,true);text(s,"PROJECT SIGNAL",8.72,1.75,2.55,.18,{fontSize:7,bold:true,color:d.dark,charSpacing:1.1});text(s,stat,8.68,2.35,3.05,.72,{fontSize:31,bold:true,color:d.dark,align:"center"});text(s,caption,8.8,3.32,2.75,.44,{fontSize:8.5,color:d.dark,align:"center"});
  }else if(m==="weekgrid"){
    text(s,title,.72,1.33,7.25,1.3,{fontFace:"Aptos Display",fontSize:29,bold:true,color:ink});text(s,body,.75,2.9,6.35,.75,{fontSize:13,color:muted});rect(s,8.3,1.32,3.95,2.2,"2B3536",true);text(s,stat,8.7,1.83,3.05,.7,{fontSize:31,bold:true,color:d.accent});text(s,caption,8.73,2.78,2.75,.35,{fontSize:8.5,color:muted});
    ["M","T","W","T","F","S","S"].forEach((v,i)=>{const h=.22+((i+n)%4)*.12;rect(s,.75+i*1.05,4.85,.83,1.08,i===n%7?d.accent:"303A3B",true);rect(s,.89+i*1.05,5.7-h,.55,h,i===n%7?d.dark:d.second,true);text(s,v,.98+i*1.05,5.02,.35,.16,{fontSize:7,bold:true,color:i===n%7?d.dark:"FFFFFF",align:"center"});});line(s,8.3,4.85,3.95,0,d.accent,3);text(s,"NEXT WEEK / OWNERS",8.3,5.22,2.0,.18,{fontSize:7,bold:true,color:"FFFFFF",charSpacing:1.1});
  }else if(m==="syntax"){
    text(s,title,.72,1.35,7.4,1.25,{fontFace:"Georgia",fontSize:28,bold:true,color:ink});text(s,body,.75,2.93,6.45,.73,{fontSize:13,color:muted});rect(s,8.4,1.34,3.82,4.75,d.soft,true);text(s,stat,8.83,2.02,2.95,.68,{fontFace:"Georgia",fontSize:29,bold:true,color:d.dark});text(s,caption,8.85,2.9,2.8,.4,{fontSize:8.5,color:muted});
    const words=["SUBJECT","VERB","OBJECT"];words.forEach((v,i)=>{rect(s,.78+i*2.0,4.68,1.65,.58,i===n%3?d.accent:"FFFFFF",true,0,d.second,1);text(s,v,1.0+i*2,4.9,1.2,.15,{fontSize:6.7,bold:true,color:i===n%3?"FFFFFF":d.dark,align:"center"});});line(s,1.6,5.26,0,.52,d.second,2);line(s,3.6,5.26,0,.52,d.second,2);line(s,5.6,5.26,0,.52,d.second,2);line(s,1.6,5.78,4,0,d.second,2);
  }else if(m==="monograph"){
    rect(s,.72,1.3,2.28,5.0,d.soft);text(s,"REF.",1.0,1.72,.7,.18,{fontSize:7,bold:true,color:d.accent,charSpacing:1.2});text(s,String(n).padStart(2,"0"),1.0,2.25,1.3,.7,{fontFace:"Georgia",fontSize:32,bold:true,color:d.dark});text(s,stat,1.0,4.35,1.63,.5,{fontSize:21,bold:true,color:d.accent});text(s,caption,1.0,5.03,1.58,.5,{fontSize:8,color:muted});text(s,title,3.75,1.48,7.92,1.3,{fontFace:"Georgia",fontSize:28,bold:true,color:ink});text(s,body,3.78,3.08,6.85,.75,{fontFace:"Georgia",fontSize:12.5,color:muted});line(s,3.78,4.48,6.72,0,d.dark,1);rect(s,3.78,4.83,5.4,.74,d.soft);rect(s,3.78,4.83,(2.4+(n%4)*.65),.74,d.accent,true);text(s,"ESTIMATE / CONFIDENCE BAND",3.95,5.07,4.75,.18,{fontSize:7,bold:true,color:"FFFFFF",charSpacing:.7});
  }else if(m==="carepath"){
    rect(s,.72,1.32,7.15,4.9,"FFFFFF",true);text(s,title,1.08,1.78,6.02,1.2,{fontFace:"Aptos Display",fontSize:28,bold:true,color:ink});text(s,body,1.1,3.25,5.75,.75,{fontSize:13,color:muted});drawRoute(s,d,1.18,5.25,5.7,5,d.second);rect(s,8.25,1.32,3.98,4.9,n%2?d.soft:"E8EEF0",true);text(s,"CASE CHECKPOINT",8.67,1.78,2.6,.18,{fontSize:7,bold:true,color:d.accent,charSpacing:1.1});text(s,stat,8.62,2.48,3.05,.7,{fontSize:30,bold:true,color:d.dark});text(s,caption,8.66,3.4,2.75,.42,{fontSize:8.5,color:muted});text(s,"EDUCATION ONLY",8.66,5.13,2.75,.18,{fontSize:7,bold:true,color:d.dark});
  }else if(m==="gate"){
    rect(s,.72,1.32,7.2,4.9,"242424",true);text(s,title,1.06,1.76,6.2,1.25,{fontFace:"Aptos Display",fontSize:28,bold:true,color:ink});text(s,body,1.08,3.27,5.8,.74,{fontSize:12.8,color:muted});["PROPOSE","EVIDENCE","DECIDE"].forEach((v,i)=>{rect(s,1.08+i*1.82,5.02,1.55,.52,i===n%3?d.accent:d.second,true);text(s,v,1.27+i*1.82,5.22,1.15,.14,{fontSize:6.3,bold:true,color:"FFFFFF",align:"center"});});rect(s,8.35,1.32,3.9,4.9,"111111",true);text(s,"CONTROL SIGNAL",8.75,1.78,2.65,.18,{fontSize:7,bold:true,color:d.second,charSpacing:1.1});text(s,stat,8.7,2.5,3.05,.7,{fontSize:30,bold:true,color:d.accent});text(s,caption,8.73,3.43,2.75,.42,{fontSize:8.5,color:muted});line(s,8.73,4.7,2.82,0,d.accent,2);text(s,"OWNER / REVIEW DATE",8.73,5.04,2.75,.17,{fontSize:6.8,bold:true,color:"FFFFFF"});
  }else if(m==="planar"){
    rect(s,.72,1.32,4.55,4.93,n%2?d.soft:"C9CECD");rect(s,1.1,1.72,2.75,2.2,d.accent,0,12);line(s,1.1,4.45,3.75,0,d.dark,1);line(s,1.1,4.8,2.9,0,d.dark,1);text(s,stat,1.12,5.28,2.3,.46,{fontSize:22,bold:true,color:d.dark});text(s,caption,3.26,5.32,1.55,.36,{fontSize:7.2,color:d.dark,align:"right"});text(s,title,5.95,1.55,6.02,1.38,{fontFace:"Aptos Display",fontSize:28,bold:true,color:ink});text(s,body,5.98,3.28,5.35,.75,{fontSize:13,color:muted});text(s,"CONTEXT  /  CHOICE  /  CONSEQUENCE",5.98,5.18,5.4,.18,{fontSize:7,bold:true,color:d.accent,charSpacing:.9});line(s,5.98,4.82,5.25,0,d.accent,3);
  }else{
    text(s,title,.72,1.35,7.12,1.3,{fontFace:"Aptos Display",fontSize:29,bold:true,color:ink});text(s,body,.75,2.95,6.35,.75,{fontSize:13,color:muted});rect(s,8.35,1.32,3.9,2.18,"252B32",true);text(s,stat,8.75,1.83,3.05,.7,{fontSize:30,bold:true,color:d.accent});text(s,caption,8.78,2.78,2.75,.35,{fontSize:8.5,color:muted});
    const y=[4.65,5.35,6.05];y.forEach((yy,i)=>{line(s,.8,yy,10.95,0,i===1?d.second:d.accent,3);for(let j=0;j<4;j++)circle(s,1.35+j*2.85+(i%2)*.75,yy-.13,.26,j===n%4?"FFFFFF":(i===1?d.second:d.accent));});text(s,"TRACK A",11.85,4.57,.55,.15,{fontSize:6,bold:true,color:d.accent,align:"right"});text(s,"TRACK B",11.85,5.27,.55,.15,{fontSize:6,bold:true,color:d.second,align:"right"});text(s,"TRACK C",11.85,5.97,.55,.15,{fontSize:6,bold:true,color:d.accent,align:"right"});
  }
  footer(s,d,n,ink);
}

await fs.mkdir(OUTPUT,{recursive:true});
for(const deck of decks){
  const pptx=new pptxgen(); pptx.layout="LAYOUT_WIDE"; pptx.author="FreeAIPPT"; pptx.company="FreeAIPPT"; pptx.subject="Original editable PowerPoint template"; pptx.title=deck.title; pptx.lang="en-US";
  pptx.theme={headFontFace:"Aptos Display",bodyFontFace:"Aptos",lang:"en-US"};
  cover(pptx,deck); deck.slides.forEach((slide,index)=>content(pptx,deck,slide,index+1));
  await pptx.writeFile({fileName:path.join(OUTPUT,`${deck.slug}.pptx`),compression:true});
}
console.log(`Generated ${decks.length} original templates for 2026-09-10 in ${OUTPUT}`);
