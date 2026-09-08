import fs from "node:fs/promises";
import path from "node:path";
import pptxgen from "pptxgenjs";

const OUTPUT = path.join(process.cwd(), "public", "templates", "files");
const W = 13.333;
const H = 7.5;

const decks = [
  { slug:"vintage-small-business-plan", title:"Vintage Small Business Plan", subtitle:"A practical first year, filed with intent", motif:"archive", accent:"B54A3A", dark:"172D45", soft:"F1E7D2", paper:"FAF6EA", slides:[
    ["PURPOSE","Begin with the change the business exists to make","State the customer, recurring problem, useful promise, and reason this team can deliver it.","1 promise","anchors every choice"],
    ["CUSTOMER","Serve one reachable group exceptionally well","Define where customers are, what triggers demand, what they value, and what they choose today.","01","priority customer"],
    ["OFFER","Turn expertise into three simple packages","Make scope, outcome, timing, and price easy to understand before adding optional services.","3 offers","simple to compare"],
    ["MARKET","Size the opportunity from the ground up","Use reachable locations, buyer frequency, conversion assumptions, and realistic capacity.","2,400","reachable buyers"],
    ["OPERATIONS","Design the week before scaling the year","Map demand, staffing, suppliers, quality checks, and the constraints that protect delivery.","5 checks","protect quality"],
    ["FUNDING","Connect every dollar to a measurable milestone","Separate setup, working capital, contingency, and the evidence each investment should unlock.","$65K","illustrative need"],
    ["YEAR ONE","Build repeatability before expanding","Set quarterly milestones for customers, quality, cash, capacity, and the next review decision.","4 quarters","one disciplined plan"]]},
  { slug:"retail-startup-pitch-deck", title:"Retail Startup Pitch Deck", subtitle:"Trust, discovery, and repeat purchase", motif:"shelf", accent:"7DA33C", dark:"24352D", soft:"EEE5CF", paper:"FBF8ED", slides:[
    ["TENSION","Choice is abundant, but confidence is scarce","Show the customer moment, current compromise, purchase frequency, and cost of uncertainty.","47%","seek better guidance"],
    ["CONCEPT","Curate fewer products around one useful promise","Explain assortment rules, service layer, physical experience, and the reason customers return.","120","curated products"],
    ["EXPERIENCE","Every touchpoint reduces one purchase barrier","Connect discovery, evaluation, checkout, fulfillment, and post-purchase support.","5 moments","one journey"],
    ["PROOF","Early stores show repeatable demand","Present cohorts, repeat rate, basket growth, referrals, and verified customer feedback.","38%","illustrative repeat rate"],
    ["ECONOMICS","Store contribution improves with local density","Show average order value, margin, labor, occupancy, payback, and sensitivity ranges.","14 mo","illustrative payback"],
    ["EXPANSION","Grow through clusters, not isolated locations","Sequence neighborhoods using demand signals, logistics reach, hiring, and brand awareness.","4 clusters","next market plan"],
    ["ASK","Fund the proof for a repeatable second market","State capital, runway, location milestones, team needs, and evidence required for expansion.","$2.1M","illustrative seed ask"]]},
  { slug:"modern-company-overview-presentation", title:"Modern Company Overview", subtitle:"Identity, practice, proof, and people", motif:"stamp", accent:"E44535", dark:"202020", soft:"F3EBDD", paper:"FBF7EF", slides:[
    ["IDENTITY","One promise connects every part of the company","Explain who you serve, what outcome you own, and the standards that make it credible.","12 years","focused practice"],
    ["SCALE","A focused footprint with room to respond","Present locations, customers, disciplines, capacity, and the operating facts that matter.","6 hubs","connected delivery"],
    ["CAPABILITIES","Capabilities organized around customer outcomes","Group expertise into a few offers with clear ownership instead of a long service inventory.","4 offers","clear ownership"],
    ["DELIVERY","Senior judgment stays close to the work","Show the path from diagnosis and design through delivery, assurance, and improvement.","4 stages","one accountable team"],
    ["PROOF","Evidence turns claims into confidence","Use a verified baseline, intervention, result, measurement window, and customer context.","−26%","illustrative cycle time"],
    ["CULTURE","The operating principles customers experience","Connect internal behaviors to quality, responsiveness, transparency, and long-term value.","5 principles","visible in the work"],
    ["PARTNER","Start with one decision worth improving","Close with the right first engagement, named owner, timing, and preparation needed.","30 min","working session"]]},
  { slug:"campaign-marketing-plan-presentation", title:"Campaign Marketing Plan", subtitle:"One idea, expressed with disciplined variety", motif:"poster", accent:"3157D5", second:"EC503E", dark:"1D2130", soft:"E9EDF5", paper:"F8F8F5", slides:[
    ["BRIEF","Define the commercial move before the creative task","Name the behavior, business value, timing, constraints, and evidence the campaign must create.","+18%","target response"],
    ["AUDIENCE","Find the tension that makes the message relevant","Describe the situation, motivation, barrier, current workaround, and language customers use.","1 tension","worth resolving"],
    ["MESSAGE","Build a hierarchy the audience can remember","Separate the central promise, reasons to believe, useful detail, and required action.","4 layers","one message system"],
    ["PLATFORM","Create a campaign idea that can travel","Set the recurring thought, visual behavior, tone, and boundaries for channel adaptation.","1 idea","many expressions"],
    ["CHANNELS","Give every channel a specific job","Assign attention, education, capture, conversion, and retention roles before choosing formats.","5 roles","across the journey"],
    ["FLIGHTING","Sequence learning, launch, and reinforcement","Plan moments, dependencies, owners, stop rules, and transitions between campaign phases.","8 weeks","illustrative flight"],
    ["MEASUREMENT","Link every signal to a decision","Track reach quality, response, conversion, incrementality, payback, and next investment.","6 signals","guide the next move"]]},
  { slug:"blueprint-project-proposal", title:"Blueprint Project Proposal", subtitle:"Outcomes, boundaries, delivery, and controls", motif:"blueprint", accent:"43D8E8", dark:"12345A", soft:"DCEEF2", paper:"F7FBFC", slides:[
    ["CASE","The current system creates three avoidable costs","Quantify delay, rework, risk, and the trigger that makes action necessary now.","3 costs","require action"],
    ["TARGET","Describe the future state in observable terms","Define what users can do, how work flows, which measures improve, and what remains unchanged.","01","target operating state"],
    ["PRINCIPLES","Use design rules to prevent local optimization","Set decision principles for simplicity, ownership, interoperability, safety, and evidence.","5 rules","guide delivery"],
    ["WORKSTREAMS","Separate work without fragmenting accountability","Show connected workstreams, owners, interfaces, deliverables, and shared decision points.","4 streams","one outcome"],
    ["SCHEDULE","Use milestones as evidence gates","Sequence discovery, prototype, pilot, migration, and review around acceptance criteria.","16 wks","illustrative plan"],
    ["CONTROLS","Make risk visible before it becomes delay","Assign dependencies, assumptions, risk indicators, mitigations, escalation, and governance.","6 controls","protect delivery"],
    ["DECISION","Approve the first controlled commitment","State scope, investment, sponsor, start date, and evidence required for the next gate.","Gate 01","decision required"]]},
  { slug:"sales-performance-review-presentation", title:"Sales Performance Review", subtitle:"Numbers, causes, confidence, commitments", motif:"ticker", accent:"EF654C", dark:"29345F", soft:"F5ECD8", paper:"FBF8EF", slides:[
    ["ATTAINMENT","Revenue reached plan with uneven contribution","Compare actual, target, prior period, and mix before discussing the headline result.","103%","illustrative attainment"],
    ["BRIDGE","Expansion offset slower new-logo growth","Separate new, expansion, contraction, churn, timing, and one-off effects.","+$420K","illustrative expansion"],
    ["CONVERSION","Discovery improved while proposal discipline slipped","Show stage volume, conversion, age, loss reason, and behavior behind the change.","−6 pts","proposal conversion"],
    ["PIPELINE","Coverage is sufficient but timing is concentrated","Explain quality by stage, source, size, age, concentration, and verified next action.","3.2×","pipeline coverage"],
    ["SEGMENTS","Mid-market leads on speed and expansion","Use consistent measures to compare segment economics, cycle, conversion, and retention.","21 days","illustrative cycle"],
    ["FORECAST","Confidence depends on two customer decisions","Present commit, best case, risk range, assumptions, and leading indicators.","$4.1M","illustrative commit"],
    ["COMMITMENTS","Turn insight into three coached behaviors","Assign owners, observable actions, expected signals, and the next review date.","3 moves","owned this month"]]},
  { slug:"yellow-lesson-plan-presentation", title:"Yellow Lesson Plan", subtitle:"Notice, model, practise, check, reflect", motif:"whiteboard", accent:"F4C542", second:"65B9DB", dark:"24354A", soft:"E4F1F7", paper:"FFFDF6", slides:[
    ["QUESTION","Open with a question worth revisiting","Use an accessible puzzle that exposes prior ideas and creates a reason to learn.","5 min","curiosity first"],
    ["OBJECTIVES","Make success visible to learners","Describe what students will understand, produce, and explain by the end.","3 goals","learner friendly"],
    ["ACTIVATE","Surface prior knowledge before adding content","Give every learner time to retrieve, predict, compare, and share a starting idea.","4 prompts","all can enter"],
    ["MODEL","Reveal the decisions inside the example","Think aloud through the process, name cues, and contrast one common misconception.","3 cues","make thinking visible"],
    ["PRACTICE","Release responsibility in deliberate steps","Move from whole-class response to pairs and independent work with one success criterion.","18 min","guided to independent"],
    ["CHECK","Use evidence to choose the next teaching move","Ask one diagnostic question, group responses, and plan immediate feedback.","1 check","changes instruction"],
    ["REFLECT","Return to the opening question","Let learners revise their explanation, name the evidence used, and preview transfer.","4 min","close the loop"]]},
  { slug:"green-thesis-defense-presentation", title:"Green Thesis Defense", subtitle:"Trace every claim to evidence", motif:"margin", accent:"52745B", dark:"3E302B", soft:"E5E8D5", paper:"F8F4E8", slides:[
    ["THESIS","The central claim in one testable sentence","Define the relationship, population, setting, and scope without overstating the evidence.","1 claim","guides the defense"],
    ["GAP","Prior work describes access but not ownership","Synthesize what is known, where findings conflict, and the precise unanswered question.","41 papers","illustrative review"],
    ["FRAME","Three mechanisms connect context to action","Explain the conceptual model, propositions, boundaries, and observable implications.","3 mechanisms","one framework"],
    ["DESIGN","A longitudinal field study tests the mechanism","Describe sampling, measures, procedure, comparison, ethics, and analysis choices.","n=216","illustrative sample"],
    ["RESULT","Named ownership improved decision traceability","Present magnitude, uncertainty, robustness, and planned versus exploratory findings.","+19%","sample effect"],
    ["CONTRIBUTION","The study connects information design to accountability","State the theoretical addition, practical implication, and what remains unresolved.","2 contributions","bounded by evidence"],
    ["LIMITS","Interpret the effect within its boundaries","Name setting, selection, measurement, duration, and the next study needed.","4 limits","shape interpretation"]]},
  { slug:"modern-clinical-case-presentation", title:"Modern Clinical Case", subtitle:"Chronology, reasoning, decisions, learning", motif:"pulse", accent:"3479D3", second:"8D78D6", dark:"173F4B", soft:"E7EDF8", paper:"F8FBFC", slides:[
    ["CONCERN","Begin with the change that prompted evaluation","Summarize onset, trajectory, severity, context, and relevant negative information.","Day 0","de-identified"],
    ["CHRONOLOGY","Sequence events before interpreting them","Separate symptoms, observations, interventions, tests, and responses on one time axis.","6 events","in sequence"],
    ["FINDINGS","Prioritize findings that change probability","Present focused examination, vital trends, red flags, and meaningful negatives.","4 findings","changed assessment"],
    ["TESTS","Show what each investigation contributed","Include indication, timing, reference, result, uncertainty, and effect on reasoning.","5 tests","ordered by value"],
    ["DIFFERENTIAL","Compare support, conflict, urgency, and consequence","Make competing explanations visible and explain why the working assessment changed.","3 options","explicitly compared"],
    ["MANAGEMENT","Tie each action to a clinical objective","Document treatment, monitoring, shared decisions, escalation thresholds, and response.","3 goals","guide management"],
    ["LEARNING","Separate case-specific outcome from general lesson","Close with follow-up, limitations, safety considerations, and three teaching points.","3 points","for education only"]]},
  { slug:"ai-strategy-presentation", title:"AI Strategy", subtitle:"Useful intelligence, reliable work", motif:"console", accent:"70E59B", second:"ED5FB2", dark:"111516", soft:"252B2B", paper:"F5F7F4", slides:[
    ["OUTCOME","Start with decisions worth improving","Define the user, decision, friction, economic value, acceptable risk, and measurable change.","4 outcomes","prioritized"],
    ["PORTFOLIO","Balance value, feasibility, and consequence","Compare use cases using common evidence instead of prioritizing the most impressive demo.","12 cases","scored consistently"],
    ["MODEL","Make ownership explicit across the lifecycle","Assign product, domain, data, engineering, risk, and operational responsibilities.","6 owners","one lifecycle"],
    ["EVALUATION","Test representative work before broad access","Set baselines, datasets, failure categories, thresholds, human review, and monitoring.","6 gates","before scale"],
    ["DATA","Improve context quality before model complexity","Address access, permissions, freshness, provenance, structure, retention, and feedback.","7 checks","for readiness"],
    ["CONTROLS","Match safeguards to consequence","Design approval, disclosure, isolation, escalation, audit, rollback, and incident response.","5 levels","risk aligned"],
    ["ADOPTION","Scale workflows only after evidence","Sequence pilot groups, training, support, behavior measures, economics, and expansion gates.","90 days","illustrative pilot"]]},
  { slug:"y2k-creative-portfolio", title:"Y2K Creative Portfolio", subtitle:"Selected work with productive friction", motif:"pixel", accent:"F04F9B", second:"53D5DF", dark:"34333A", soft:"DDE5E8", paper:"F3F2F4", slides:[
    ["THESIS","Distinctive work begins with a useful point of view","State the problems you choose, principles you apply, and value you aim to create.","1 thesis","connects the work"],
    ["INDEX","Curate projects around the audience","Select a small set that demonstrates relevant range, depth, constraints, and outcomes.","4 projects","selected with intent"],
    ["CASE","A new identity made a complex offer legible","Show context, brief, constraint, exploration, decision, delivered system, and evidence.","+31%","illustrative response"],
    ["PROCESS","Structure creates room for surprise","Explain how research, framing, prototypes, critique, testing, and refinement connect.","6 moves","from question to system"],
    ["EXPERIMENTS","Use side projects to test new visual behavior","Present the question, boundary, iteration, learning, and influence on client work.","9 studies","across one year"],
    ["OUTCOMES","Connect craft to comprehension and action","Use verified measures, feedback, adoption, efficiency, or recognition with context.","4 signals","of useful quality"],
    ["CONTACT","Make the next collaboration easy to begin","Share fit, availability, working mode, contact information, and one specific invitation.","Q4","availability"]]},
  { slug:"quarterly-product-roadmap", title:"Quarterly Product Roadmap", subtitle:"Evidence-led bets across three horizons", motif:"terrain", accent:"B6E05A", second:"5AB9A3", dark:"18362F", soft:"E8E5CF", paper:"F7F5E9", slides:[
    ["OUTCOME","Anchor the roadmap in changed customer behavior","State who succeeds, what they can do, how quickly, and why the outcome matters.","< 3 min","time to first value"],
    ["EVIDENCE","Use multiple signals to shape each bet","Combine behavior, research, support, commercial context, reliability, and technical learning.","5 signals","support priorities"],
    ["BETS","Name the assumptions behind the investment","Describe expected outcome, user, mechanism, evidence, confidence, and stop condition.","4 bets","different confidence"],
    ["QUARTERS","Sequence releases around learning","Show what becomes available, to whom, what it tests, and what unlocks the next horizon.","3 horizons","Q4 through Q2"],
    ["DEPENDENCIES","Expose the paths that can change timing","Connect platform, data, policy, research, commercial, and staffing constraints to owners.","6 paths","need ownership"],
    ["CAPACITY","Fund reliability and discovery alongside delivery","Make allocation, interrupt budget, maintenance, and discovery capacity visible.","65/20/15","illustrative split"],
    ["REVIEW","Use roadmap reviews to change decisions","Compare expected and observed signals, update confidence, and record the next commitment.","30 days","review cadence"]]}
];

const noLine = { transparency: 100 };
const rect = (s,x,y,w,h,color,radius=false,transparency=0) => s.addShape(radius ? "roundRect" : "rect", { x,y,w,h,rectRadius:.06,line:noLine,fill:{color,transparency} });
const circle = (s,x,y,d,color,transparency=0) => s.addShape("ellipse", { x,y,w:d,h:d,line:noLine,fill:{color,transparency} });
const line = (s,x,y,w,h,color,width=1,dash="solid") => s.addShape("line", { x,y,w,h,line:{color,width,dash} });
const text = (s,value,x,y,w,h,o={}) => s.addText(value, { x,y,w,h,margin:0,fontFace:"Aptos",fontSize:12,color:"222222",breakLine:false,fit:"shrink",...o });
const label = (s,d,value,x=.72,y=.55,color=d.accent) => text(s,value,x,y,4.8,.24,{fontSize:8,bold:true,color,charSpacing:2});
const footer = (s,d,n,color=d.dark) => { text(s,"FREEAIPPT / ORIGINAL EDITABLE TEMPLATE",.72,7.1,3.3,.16,{fontSize:6.5,bold:true,color,charSpacing:1.2}); text(s,String(n).padStart(2,"0"),12.03,7.06,.55,.2,{fontSize:8,bold:true,color,align:"right"}); };

function cover(p,d){
  const s=p.addSlide(),m=d.motif;s.background={color:["blueprint","console","terrain"].includes(m)?d.dark:d.paper};
  if(m==="archive"){
    rect(s,0,0,1.65,H,d.dark);rect(s,1.65,0,.12,H,d.accent);["01","02","03","04"].forEach((v,i)=>{rect(s,10.75,.85+i*.72,1.58,.47,i===0?d.accent:d.soft,true);text(s,v,11.16,1+i*.72,.72,.16,{fontSize:8,bold:true,color:i===0?"FFFFFF":d.dark,align:"center"});});label(s,d,"FILE 01 / BUSINESS",2.35,.75,d.accent);text(s,d.title,2.32,1.72,7.5,1.7,{fontFace:"Georgia",fontSize:39,bold:true,color:d.dark});line(s,2.35,3.66,7.2,0,d.accent,2);text(s,d.subtitle,2.35,4.02,6.1,.62,{fontSize:15,color:"596471"});text(s,"PLAN / OPERATE / REVIEW",2.35,6.15,4.1,.2,{fontSize:8,bold:true,color:d.dark,charSpacing:1.4});
  }else if(m==="shelf"){
    rect(s,0,0,W,1.05,d.dark);label(s,d,"RETAIL / SEED DECK",.72,.42,"FFFFFF");for(let i=0;i<5;i++){rect(s,7.65+i*.92,1.62+(i%2)*.72,.7,3.9-(i%2)*.72,i===2?d.accent:d.soft,true);rect(s,7.78+i*.92,4.72,.44,.4,d.dark,true);}text(s,d.title,.72,1.72,6.35,1.55,{fontFace:"Aptos Display",fontSize:41,bold:true,color:d.dark});text(s,d.subtitle,.75,3.58,5.55,.58,{fontSize:15,color:"607063"});rect(s,.75,5.35,2.1,.82,d.accent,true);text(s,"OPEN / 2026",1.07,5.65,1.48,.2,{fontSize:8,bold:true,color:"FFFFFF",align:"center",charSpacing:1.2});
  }else if(m==="stamp"){
    rect(s,0,0,3.55,H,d.accent);circle(s,9.55,.72,2.35,d.dark);circle(s,9.94,1.11,1.57,d.paper);text(s,"CO",10.25,1.57,.95,.45,{fontSize:20,bold:true,color:d.dark,align:"center"});label(s,d,"PROFILE / REGISTERED",.62,.62,"FFFFFF");text(s,"MAKE\nDELIVERY\nDEPENDABLE",.62,1.55,2.5,3.3,{fontSize:23,bold:true,color:"FFFFFF",breakLine:true});text(s,d.title,4.25,2.15,7.25,1.4,{fontFace:"Aptos Display",fontSize:40,bold:true,color:d.dark});text(s,d.subtitle,4.28,4.02,5.6,.55,{fontSize:15,color:"665E58"});line(s,4.28,5.45,6.9,0,d.accent,3);
  }else if(m==="poster"){
    rect(s,0,0,W,2.08,d.accent);rect(s,10.68,0,2.653,H,d.second);text(s,"01",9.38,4.7,2.85,1.65,{fontSize:72,bold:true,color:d.soft,align:"right"});label(s,d,"CAMPAIGN / LAUNCH",.72,.72,"FFFFFF");text(s,d.title,.72,2.72,8.85,1.45,{fontFace:"Aptos Display",fontSize:43,bold:true,color:d.dark});text(s,d.subtitle,.75,4.42,6.2,.62,{fontSize:15,color:"646A78"});text(s,"BRIEF → IDEA → ACTION",.75,6.12,3.85,.2,{fontSize:8,bold:true,color:d.dark,charSpacing:1.4});
  }else if(m==="blueprint"){
    for(let x=.45;x<W;x+=.55)line(s,x,0,0,H,"28547A",.45);for(let y=.4;y<H;y+=.55)line(s,0,y,W,0,"28547A",.45);rect(s,.62,.62,12.08,6.2,d.dark,true,4);rect(s,8.45,1.15,3.15,3.15,d.accent,true,88);label(s,d,"DRAWING 01 / PROPOSAL",.92,.92,d.accent);text(s,d.title,.88,1.82,7.15,1.52,{fontFace:"Aptos Display",fontSize:40,bold:true,color:"FFFFFF"});text(s,d.subtitle,.92,3.62,5.9,.6,{fontSize:15,color:"B8D8E5"});line(s,.92,5.18,9.9,0,d.accent,2,"dash");text(s,"SCALE / OUTCOME / CONTROL",.92,5.55,4.6,.2,{fontSize:8,bold:true,color:"FFFFFF",charSpacing:1.4});
  }else if(m==="ticker"){
    rect(s,0,0,W,.88,d.dark);label(s,d,"SALES / QUARTERLY REVIEW",.72,.36,"FFFFFF");[2.1,3.05,4.2,5.65].forEach((h,i)=>rect(s,8.25+i*.78,6.15-h*.65,.52,h*.65,i===3?d.accent:d.dark,true));text(s,d.title,.72,1.58,7.15,1.42,{fontFace:"Aptos Display",fontSize:40,bold:true,color:d.dark});text(s,d.subtitle,.75,3.32,5.85,.58,{fontSize:15,color:"626779"});rect(s,.75,5.35,5.85,.64,d.soft,true);text(s,"ACTUAL  103%     PIPELINE  3.2×     COMMIT  $4.1M",1.02,5.58,5.32,.18,{fontSize:8,bold:true,color:d.dark,align:"center"});
  }else if(m==="whiteboard"){
    rect(s,0,0,W,1.15,d.accent);label(s,d,"LESSON / 50 MIN",.72,.52,d.dark);[d.second,"FFFFFF",d.second].forEach((c,i)=>{rect(s,8.05+i*1.48,1.75+(i%2)*.65,1.18,3.15,c,true);text(s,["ASK","TRY","REFLECT"][i],8.26+i*1.48,4.15+(i%2)*.65,.78,.18,{fontSize:7,bold:true,color:d.dark,align:"center"});});text(s,d.title,.72,1.78,6.85,1.4,{fontFace:"Aptos Display",fontSize:43,bold:true,color:d.dark});text(s,d.subtitle,.75,3.48,5.65,.62,{fontSize:15,color:"5E6B78"});line(s,.75,5.72,6.2,0,d.second,5);
  }else if(m==="margin"){
    rect(s,0,0,2.2,H,d.dark);rect(s,2.2,0,.16,H,d.accent);label(s,d,"DEFENSE / MANUSCRIPT",.55,.62,"FFFFFF");text(s,"THESIS",.55,1.55,1.2,2.8,{fontFace:"Georgia",fontSize:22,bold:true,color:"FFFFFF",vert:"vert270"});text(s,d.title,3.05,1.58,7.9,1.45,{fontFace:"Georgia",fontSize:41,bold:true,color:d.dark});line(s,3.08,3.35,8.2,0,d.accent,2);text(s,d.subtitle,3.08,3.72,6.15,.6,{fontSize:15,color:"665F59"});text(s,"CLAIM  /  EVIDENCE  /  LIMITS",3.08,5.75,4.5,.2,{fontSize:8,bold:true,color:d.dark,charSpacing:1.5});
  }else if(m==="pulse"){
    rect(s,0,0,W,.2,d.accent);[4.2,2.8,1.5].forEach((v,i)=>circle(s,9.15+i*.38,.62+i*.5,v,i%2?d.second:d.accent,75));label(s,d,"CASE / DE-IDENTIFIED",.72,.72,d.accent);text(s,d.title,.72,1.68,7.25,1.42,{fontFace:"Aptos Display",fontSize:42,bold:true,color:d.dark});text(s,d.subtitle,.75,3.45,5.65,.58,{fontSize:15,color:"5E6F78"});line(s,.75,5.28,1.2,0,d.accent,3);line(s,1.95,5.28,.28,-.35,d.accent,3);line(s,2.23,4.93,.36,.72,d.accent,3);line(s,2.59,5.65,.32,-.37,d.accent,3);line(s,2.91,5.28,3.4,0,d.accent,3);text(s,"EDUCATIONAL USE ONLY",.75,5.82,2.8,.18,{fontSize:7,bold:true,color:d.dark,charSpacing:1.3});
  }else if(m==="console"){
    for(let i=0;i<9;i++)line(s,.5+i*1.55,0,0,H,"202727",.5);rect(s,.62,.62,12.08,6.18,d.soft,true);label(s,d,"> AI_STRATEGY / RUN",.92,.92,d.accent);text(s,d.title,.88,1.82,7.1,1.25,{fontFace:"Aptos Display",fontSize:44,bold:true,color:"FFFFFF"});text(s,d.subtitle,.92,3.34,5.9,.58,{fontSize:15,color:"B9C6C1"});["OUTCOME","EVIDENCE","CONTROL"].forEach((v,i)=>{rect(s,.92+i*2.05,5.2,1.78,.58,i===1?d.second:d.accent,true);text(s,v,1.15+i*2.05,5.41,1.3,.16,{fontSize:7,bold:true,color:d.dark,align:"center"});});text(s,"STATUS / READY",9.7,5.35,2.2,.2,{fontSize:8,bold:true,color:d.accent,align:"right"});
  }else if(m==="pixel"){
    rect(s,0,0,4.35,H,d.dark);[[4.85,.65,2.1,1.4,d.accent],[7.15,.65,1.05,1.4,d.second],[8.4,.65,3.8,1.4,d.soft],[9.65,5.2,2.55,1.35,d.accent],[8.4,5.2,1.05,1.35,d.second]].forEach(v=>rect(s,...v));label(s,d,"PORTFOLIO / SELECTED",.65,.62,"FFFFFF");text(s,"WORK_\nSYSTEMS_\nSIGNALS_",.62,1.5,3.1,3.1,{fontSize:29,bold:true,color:"FFFFFF",breakLine:true});text(s,d.title,4.82,2.42,7.1,1.35,{fontFace:"Aptos Display",fontSize:39,bold:true,color:d.dark});text(s,d.subtitle,4.85,4.08,5.8,.58,{fontSize:15,color:"69666F"});
  }else{
    [5.8,4.3,2.7].forEach((v,i)=>circle(s,9.15+i*.65,-.8+i*.4,v,i===0?d.second:d.accent,58+i*9));label(s,d,"ROADMAP / THREE HORIZONS",.72,.72,d.accent);text(s,d.title,.72,1.62,7.15,1.42,{fontFace:"Aptos Display",fontSize:41,bold:true,color:"FFFFFF"});text(s,d.subtitle,.75,3.35,5.9,.58,{fontSize:15,color:"C4D3CC"});["NOW","NEXT","LATER"].forEach((v,i)=>{circle(s,1.05+i*1.75,5.2,.72,i===0?d.accent:d.second);text(s,v,.9+i*1.75,6.05,1.05,.18,{fontSize:7,bold:true,color:"FFFFFF",align:"center"});if(i<2)line(s,1.77+i*1.75,5.56,1.03,0,"658078",2,"dash");});
  }
}

function content(p,d,a,n){
  const [e,t,b,stat,caption]=a,m=d.motif,dark=["blueprint","console","terrain"].includes(m),s=p.addSlide();s.background={color:dark?d.dark:(n%2?d.paper:"FFFFFF")};const ink=dark?"FFFFFF":d.dark,muted=dark?"B9CBC8":"636B73";label(s,d,`${String(n).padStart(2,"0")} / ${e}`,.72,.52,d.accent);line(s,.72,.95,11.88,0,dark?"36574F":"D9D9D4",.8);
  if(m==="archive"){
    rect(s,.72,1.3,2.0,4.95,d.dark);text(s,"FILE",1.08,1.68,1.1,.2,{fontSize:8,bold:true,color:d.soft,charSpacing:1.5});text(s,String(n).padStart(2,"0"),1.05,2.2,1.25,.8,{fontFace:"Georgia",fontSize:38,bold:true,color:"FFFFFF"});text(s,stat,1.05,4.42,1.25,.55,{fontSize:24,bold:true,color:d.accent});text(s,caption,1.05,5.15,1.22,.55,{fontSize:8,color:d.soft});text(s,t,3.45,1.45,7.95,1.35,{fontFace:"Georgia",fontSize:30,bold:true,color:ink});text(s,b,3.48,3.08,7.1,.78,{fontSize:13.2,color:muted});["NOTE","EVIDENCE","DECISION"].forEach((v,i)=>{line(s,3.48,4.68+i*.46,5.9-i*.55,0,i===2?d.accent:"C9C1AF",2);text(s,v,9.62,4.58+i*.46,1.2,.18,{fontSize:6.5,bold:true,color:d.dark,align:"right"});});
  }else if(m==="shelf"){
    text(s,t,.72,1.35,7.25,1.3,{fontFace:"Aptos Display",fontSize:30,bold:true,color:ink});text(s,b,.75,2.92,6.3,.76,{fontSize:13.2,color:muted});for(let i=0;i<4;i++){rect(s,.78+i*2.06,4.63,1.72,1.32,i===n%4?d.accent:d.soft,true);rect(s,1.03+i*2.06,5.05,.66,.46,d.dark,true);text(s,`BAY ${i+1}`,1.02+i*2.06,6.12,.88,.16,{fontSize:6.5,bold:true,color:d.dark,align:"center"});}rect(s,9.58,1.42,2.65,4.55,d.dark,true);text(s,stat,9.94,2.18,1.9,.72,{fontSize:31,bold:true,color:d.accent,align:"center"});text(s,caption,9.92,3.15,1.92,.6,{fontSize:9,color:"D6DED5",align:"center"});
  }else if(m==="stamp"){
    rect(s,.72,1.32,3.05,4.92,n%2?d.accent:d.dark,true);circle(s,1.42,2.12,1.62,"FFFFFF",82);text(s,stat,1.03,3.9,2.4,.65,{fontSize:29,bold:true,color:"FFFFFF",align:"center"});text(s,caption,1.1,4.8,2.25,.5,{fontSize:9,color:"FFFFFF",align:"center"});text(s,t,4.45,1.48,7.35,1.3,{fontFace:"Aptos Display",fontSize:30,bold:true,color:ink});text(s,b,4.48,3.08,6.65,.75,{fontSize:13.2,color:muted});["CLAIM","PROOF","OWNER"].forEach((v,i)=>{rect(s,4.48+i*2.15,4.72,1.86,.72,i===n%3?d.soft:"FFFFFF",true);text(s,v,4.74+i*2.15,4.98,1.32,.18,{fontSize:7,bold:true,color:d.dark,align:"center"});});
  }else if(m==="poster"){
    rect(s,0,1.18,W,1.12,n%2?d.accent:d.second);text(s,String(n).padStart(2,"0"),9.55,2.55,2.55,1.55,{fontSize:66,bold:true,color:d.soft,align:"right"});text(s,t,.72,2.7,8.25,1.35,{fontFace:"Aptos Display",fontSize:32,bold:true,color:ink});text(s,b,.75,4.35,6.85,.72,{fontSize:13.4,color:muted});rect(s,.75,5.7,2.65,.56,d.dark,true);text(s,stat,.98,5.89,1.2,.18,{fontSize:9,bold:true,color:"FFFFFF"});text(s,caption,2.0,5.89,1.08,.18,{fontSize:7,color:"FFFFFF",align:"right"});
  }else if(m==="blueprint"){
    for(let x=.5;x<W;x+=.55)line(s,x,1.15,0,5.72,"28547A",.4);for(let y=1.15;y<6.9;y+=.55)line(s,.3,y,12.7,0,"28547A",.4);rect(s,.72,1.35,7.15,4.78,d.dark,true,3);text(s,t,1.05,1.78,6.25,1.25,{fontFace:"Aptos Display",fontSize:29,bold:true,color:ink});text(s,b,1.08,3.25,5.7,.74,{fontSize:13,color:muted});line(s,1.08,4.66,5.92,0,d.accent,2,"dash");rect(s,8.55,1.35,3.72,4.78,d.accent,true,88);text(s,stat,8.95,2.3,2.9,.72,{fontSize:30,bold:true,color:"FFFFFF",align:"center"});text(s,caption,9.12,3.28,2.55,.55,{fontSize:9,color:"FFFFFF",align:"center"});text(s,"SPEC / VERIFIED",9.02,5.12,2.75,.18,{fontSize:7,bold:true,color:d.dark,align:"center"});
  }else if(m==="ticker"){
    text(s,t,.72,1.34,7.55,1.25,{fontFace:"Aptos Display",fontSize:30,bold:true,color:ink});text(s,b,.75,2.88,6.35,.7,{fontSize:13.2,color:muted});rect(s,8.42,1.34,3.78,2.15,d.dark,true);text(s,stat,8.78,1.8,3.0,.7,{fontSize:31,bold:true,color:d.accent});text(s,caption,8.8,2.72,2.8,.3,{fontSize:8.5,color:"D2D6E5"});[.46,.72,.58,.88,.8].forEach((v,i)=>{rect(s,.78+i*1.38,5.95-v*1.72,.86,v*1.72,i===n%5?d.accent:d.dark,true);text(s,`M${i+1}`,1.03+i*1.38,6.15,.34,.15,{fontSize:6.5,bold:true,color:d.dark,align:"center"});});line(s,8.42,4.58,3.78,0,d.accent,3);text(s,"NEXT DECISION",8.42,4.88,1.65,.18,{fontSize:7,bold:true,color:d.dark,charSpacing:1.1});
  }else if(m==="whiteboard"){
    rect(s,.72,1.3,7.1,4.92,"FFFFFF",true);rect(s,8.08,1.3,4.16,4.92,n%2?d.accent:d.second,true);text(s,t,1.08,1.82,5.95,1.25,{fontFace:"Aptos Display",fontSize:29,bold:true,color:ink});text(s,b,1.1,3.35,5.75,.74,{fontSize:13,color:muted});["NOTICE","TRY","EXPLAIN"].forEach((v,i)=>{rect(s,1.1+i*1.76,5.02,1.5,.47,i===n%3?d.soft:"F4F2E8",true);text(s,v,1.26+i*1.76,5.19,1.18,.14,{fontSize:6.5,bold:true,color:d.dark,align:"center"});});text(s,stat,8.55,2.1,3.2,.75,{fontSize:34,bold:true,color:d.dark,align:"center"});text(s,caption,8.68,3.13,2.92,.54,{fontSize:9,color:d.dark,align:"center"});
  }else if(m==="margin"){
    rect(s,.72,1.3,2.52,5,d.soft,true);text(s,"MARGIN NOTE",1.02,1.73,1.65,.2,{fontSize:7,bold:true,color:d.accent,charSpacing:1.2});text(s,stat,1.02,2.42,1.85,.7,{fontFace:"Georgia",fontSize:29,bold:true,color:d.dark});text(s,caption,.96,3.3,2.05,.55,{fontSize:7.6,color:muted,breakLine:true});text(s,t,3.92,1.45,7.8,1.3,{fontFace:"Georgia",fontSize:29,bold:true,color:ink});text(s,b,3.95,3.08,6.9,.72,{fontSize:13,color:muted});line(s,3.95,4.52,6.7,0,d.accent,2);text(s,"CLAIM",3.95,4.82,1,.18,{fontSize:7,bold:true,color:d.dark,charSpacing:1.1});text(s,"Support the interpretation within its stated boundaries.",3.95,5.2,6.5,.38,{fontFace:"Georgia",fontSize:15,bold:true,color:d.dark});
  }else if(m==="pulse"){
    rect(s,.72,1.32,11.55,1.12,d.soft,true);text(s,t,1.02,1.64,8.2,.58,{fontFace:"Aptos Display",fontSize:25,bold:true,color:ink});text(s,b,.78,2.92,6.95,.72,{fontSize:13,color:muted});for(let i=0;i<5;i++){circle(s,.92+i*1.4,5.18,.34,i===n%5?d.second:d.accent);if(i<4)line(s,1.26+i*1.4,5.35,1.06,0,"98BDD4",2);}rect(s,8.35,2.8,3.92,2.9,"FFFFFF",true);text(s,"CASE SIGNAL",8.72,3.18,2.5,.18,{fontSize:7,bold:true,color:d.accent,charSpacing:1.2});text(s,stat,8.68,3.72,3.0,.65,{fontSize:30,bold:true,color:d.dark});text(s,caption,8.7,4.6,2.85,.4,{fontSize:9,color:muted});
  }else if(m==="console"){
    rect(s,.72,1.3,7.2,4.92,d.soft,true);text(s,"> "+t,.98,1.7,6.45,1.2,{fontFace:"Aptos Display",fontSize:27,bold:true,color:ink});text(s,b,1,3.22,5.98,.72,{fontSize:12.8,color:muted});["INPUT","CHECK","OUTPUT"].forEach((v,i)=>{rect(s,1+i*1.82,5.04,1.56,.5,i===n%3?d.second:d.accent,true);text(s,v,1.22+i*1.82,5.22,1.1,.15,{fontSize:6.5,bold:true,color:d.dark,align:"center"});});rect(s,8.3,1.3,3.95,4.92,"1B2121",true);text(s,"STATUS",8.68,1.78,1.2,.18,{fontSize:7,bold:true,color:d.second,charSpacing:1.2});text(s,stat,8.65,2.48,3.0,.68,{fontSize:30,bold:true,color:d.accent});text(s,caption,8.68,3.38,2.85,.4,{fontSize:9,color:"B9C6C1"});line(s,8.68,4.55,2.98,0,d.second,2);text(s,"READY_FOR_REVIEW",8.68,4.92,2.85,.18,{fontSize:7,bold:true,color:d.accent});
  }else if(m==="pixel"){
    rect(s,.72,1.3,5.05,4.95,n%2?d.soft:d.second,true);rect(s,1.12,1.72,4.25,3.18,"FFFFFF",true);rect(s,1.12,1.72,.7,.7,d.accent);text(s,"PROJECT_"+String(n).padStart(2,"0"),1.42,2.02,2,.18,{fontSize:7,bold:true,color:d.dark,charSpacing:1.2});text(s,stat,1.42,3.72,2.75,.62,{fontSize:29,bold:true,color:d.dark});text(s,t,6.45,1.55,5.7,1.45,{fontFace:"Aptos Display",fontSize:28,bold:true,color:ink});text(s,b,6.48,3.35,5.05,.78,{fontSize:13,color:muted});rect(s,6.48,4.78,3.9,.13,d.accent);text(s,caption,6.48,5.15,3.85,.34,{fontSize:9,color:d.accent});
  }else{
    [3.35,2.25,1.28].forEach((v,i)=>circle(s,9.15+i*.42,1.15+i*.58,v,i===0?d.second:d.accent,62+i*8));text(s,t,.72,1.35,7.4,1.28,{fontFace:"Aptos Display",fontSize:29,bold:true,color:ink});text(s,b,.75,2.94,6.35,.72,{fontSize:13,color:muted});for(let i=0;i<4;i++){const x=.92+i*1.72;circle(s,x,5.22,.54,i===n%4?d.accent:d.second);if(i<3)line(s,x+.54,5.49,1.18,0,"668179",2,"dash");}rect(s,8.72,4.68,3.35,1.12,d.soft,true);text(s,stat,9.02,4.93,1.35,.48,{fontSize:22,bold:true,color:d.dark});text(s,caption,10.12,5.0,1.58,.34,{fontSize:8,color:d.dark,align:"right"});
  }
  footer(s,d,n,dark?"728D85":d.dark);
}

await fs.mkdir(OUTPUT,{recursive:true});
for(const d of decks){
  const pptx=new pptxgen();
  pptx.layout="LAYOUT_WIDE";
  pptx.author="FreeAIPPT";
  pptx.company="FreeAIPPT";
  pptx.subject="Original free editable PowerPoint template";
  pptx.title=d.title;
  pptx.lang="en-US";
  pptx.theme={headFontFace:"Aptos Display",bodyFontFace:"Aptos",lang:"en-US"};
  cover(pptx,d);
  d.slides.forEach((slide,index)=>content(pptx,d,slide,index+1));
  await pptx.writeFile({fileName:path.join(OUTPUT,`${d.slug}.pptx`),compression:true});
}
console.log(`Generated ${decks.length} daily original templates in ${OUTPUT}`);
