import fs from "node:fs/promises";
import path from "node:path";
import pptxgen from "pptxgenjs";

const OUTPUT = path.join(process.cwd(), "public", "templates", "files");

const decks = [
  {slug:"circular-fashion-business-plan",title:"Circular Fashion Business Plan",subtitle:"Demand, recovery, traceability, margin, and proof",motif:"passport",accent:"C65F42",second:"627D68",dark:"243C35",soft:"E6EAD8",paper:"F8F3E7",slides:[
    ["TENSION","Closets hold value that the current system loses","Define the customer moment, current compromise, disposal friction, trust barrier, and urgency.","4 gaps","illustrative diagnosis"],
    ["LOOP","Every item carries a visible route back","Map intake, grading, renewal, resale, repair, recycling, and the data handed between stages.","7 moves","one material loop"],
    ["OFFER","One promise connects style, condition, and traceability","Explain the assortment, quality standard, service experience, return incentive, and proof.","1 promise","customer facing"],
    ["ENTRY","Start where supply density meets repeat demand","Separate the total market from a reachable launch community, acquisition route, and expansion trigger.","12K","illustrative buyers"],
    ["ECONOMICS","Margin depends on recovery yield—not volume alone","Show illustrative purchase cost, processing, yield, price, returns, and sensitivity assumptions.","58%","illustrative yield"],
    ["OPERATIONS","Batch-level decisions protect speed and quality","Assign intake criteria, routing rules, capacity, ownership, quality checks, and exception handling.","6 gates","batch control"],
    ["GATE","Fund the next loop only after demand and yield hold","Close with the illustrative capital need, validation period, thresholds, milestones, and owner.","$240K","illustrative ask"]]},
  {slug:"fintech-control-room-pitch-deck",title:"FinTech Control Room Pitch Deck",subtitle:"Movement, controls, proof, economics, and the ask",motif:"ledger",accent:"4FA7FF",second:"D78A54",dark:"101C2E",soft:"DCE9F2",paper:"F4F7FA",slides:[
    ["FRICTION","Finance teams reconcile the same truth more than once","Show the fragmented workflow, delay, affected operator, failure cost, and switching trigger.","17 hrs","illustrative delay"],
    ["RAILS","One ledger connects request, approval, movement, and proof","Trace capture, policy, execution, settlement, reconciliation, exception, and audit ownership.","7 states","one transaction"],
    ["TRUST","Controls travel with the transaction","Explain permissions, limits, verification, monitoring, human review, rollback, and evidence retention.","6 checks","before settlement"],
    ["TRACTION","Repeated use is the strongest early signal","Report illustrative activation, weekly use, retained cohorts, processed volume, and qualification limits.","$8.4M","illustrative volume"],
    ["BEACHHEAD","Enter where reconciliation blocks growth","Define the first buyer, reachable accounts, buying event, integration surface, and adjacent expansion.","160","illustrative accounts"],
    ["ECONOMICS","Usage revenue grows with verified customer value","Connect pricing, gross margin, support load, acquisition assumptions, retention, and payback.","9 mo","illustrative payback"],
    ["ASK","Raise to prove repeatable deployment and distribution","State the illustrative ask, runway, hiring, product, compliance, revenue, and evidence milestones.","$2.6M","illustrative seed ask"]]},
  {slug:"structural-grid-company-profile",title:"Structural Grid Company Profile",subtitle:"Credentials, controls, capacity, and project fit",motif:"beam",accent:"F4C542",second:"46758D",dark:"26313A",soft:"E4E8E8",paper:"F4F2EC",slides:[
    ["CREDENTIALS","Experience is useful when it matches the project risk","Present verified years, disciplines, regions, capacity, certifications, and delivery responsibility.","18 yrs","illustrative history"],
    ["NEED","Clients need certainty across changing site conditions","Define schedule, coordination, access, quality, cost, safety, and communication pressures.","7 risks","one control system"],
    ["SERVICES","Services align to the structure of delivery","Group preconstruction, civil, structural, systems, closeout, and maintenance by outcome.","6 scopes","connected delivery"],
    ["CONTROLS","Field evidence moves through one review grid","Show planning, permits, inspection, change, cost, schedule, reporting, and escalation ownership.","8 cells","visible ownership"],
    ["PROOF","Selected projects make capability specific","Use placeholder scope, role, constraint, response, measured result, period, and limitations.","3 works","illustrative proof"],
    ["CULTURE","Safety and quality are leading operating signals","Name observation, stop-work, inspection, learning, supplier, and corrective-action routines.","24 hrs","illustrative closeout"],
    ["FIT","Start with the package where control matters most","Close with project types, geographic fit, availability, procurement route, contact, and next review.","Q1","illustrative opening"]]},
  {slug:"digital-channel-launch-plan",title:"Digital Channel Launch Plan",subtitle:"Signal, episodes, conversion, budget, and learning",motif:"broadcast",accent:"5B4DFF",second:"EC3E78",third:"43C58A",dark:"20213A",soft:"E5F5EC",paper:"FBFAF6",slides:[
    ["OUTCOME","Name the customer behavior the launch must create","Connect the commercial objective to one observable action, time horizon, and guardrail.","+20%","illustrative target"],
    ["SIGNAL","Design for the moment attention becomes intent","Describe the audience context, trigger, competing choice, trusted proof, and unanswered question.","3 cues","shape the brief"],
    ["MESSAGE","One promise should survive every channel format","Build the claim, reason to believe, evidence, objection response, and next action.","1 signal","across formats"],
    ["CHANNELS","Assign channels by job—not habit","Separate discovery, validation, capture, conversion, onboarding, and advocacy responsibilities.","6 roles","one journey"],
    ["EPISODES","Sequence content from tension to demonstrated value","Plan eight original episodes with a question, proof format, owner, CTA, and reuse rule.","8 weeks","illustrative series"],
    ["TESTS","Fund learning before scaling reach","Allocate placeholder spend by hypothesis, audience, creative, threshold, stop rule, and next decision.","70/20/10","illustrative split"],
    ["REVIEW","Read the whole path before calling a winner","Review reach quality, engaged visits, qualified starts, completion, cost, retention, and action.","$36 CPA","illustrative metric"]]},
  {slug:"engineering-systems-project-proposal",title:"Engineering Systems Proposal",subtitle:"Requirements, packages, tests, risk, and approval",motif:"console",accent:"FF7043",second:"67C5A5",dark:"182126",soft:"DDE9E5",paper:"F1F4F2",slides:[
    ["CONSTRAINT","The present system fails under peak conditions","Quantify the placeholder load, bottleneck, affected operations, failure cost, and urgency.","72%","illustrative load"],
    ["TARGET","Success is a measurable operating envelope","Define throughput, quality, reliability, safety, maintainability, cost, and acceptance thresholds.","7 specs","acceptance frame"],
    ["BOUNDARY","Interfaces determine where risk changes hands","Map inputs, outputs, upstream and downstream owners, exclusions, assumptions, and dependencies.","5 ports","illustrative boundary"],
    ["PACKAGES","Work packages finish at verifiable handoffs","Sequence requirements, design, prototype, integration, commissioning, training, and closeout.","7 packs","evidence handoffs"],
    ["VALIDATE","Tests connect requirements to observed evidence","State method, environment, sample, instrumentation, pass criteria, exception path, and owner.","12 tests","illustrative plan"],
    ["CONTROLS","Risks remain visible at every evidence gate","Track safety, scope, interface, supplier, schedule, cost, performance, and change controls.","8 risks","owned weekly"],
    ["APPROVAL","Authorize design against explicit conditions","Close with the illustrative budget, schedule, decision owner, conditions, and immediate next step.","$680K","illustrative budget"]]},
  {slug:"quarterly-sales-review-presentation",title:"Quarterly Sales Review",subtitle:"Movement, gaps, quality, confidence, and ownership",motif:"receipt",accent:"F3CF3D",second:"E4584C",dark:"222424",soft:"F0EEE3",paper:"FAF9F3",slides:[
    ["READOUT","The quarter landed above plan with a mix warning","Compare illustrative bookings, target, prior period, margin, new business, expansion, and churn.","104%","illustrative attainment"],
    ["BRIDGE","Expansion offset two delayed enterprise decisions","Reconcile opening plan, created, won, expanded, contracted, churned, slipped, and closing result.","+$180K","illustrative movement"],
    ["TARGETS","Performance gaps have different operating causes","Separate volume, conversion, size, cycle, retention, and capacity instead of averaging variance.","6 causes","one variance"],
    ["PIPELINE","Coverage is sufficient; verified next actions are not","Show stage, age, conversion, concentration, customer evidence, and risk-adjusted coverage.","3.2×","illustrative coverage"],
    ["SEGMENTS","Mid-market speed leads while enterprise value builds","Compare segments using consistent placeholder revenue, cycle, conversion, expansion, and risk measures.","4 groups","same scorecard"],
    ["FORECAST","Confidence improves when assumptions are visible","Present commit, upside, downside, close events, dependencies, owners, and update cadence.","$1.1M","illustrative commit"],
    ["ACTIONS","Convert the review into five owned moves","Assign customer action, owner, support, due date, evidence signal, and next-quarter decision.","5 owners","next-quarter moves"]]},
  {slug:"constellation-lesson-plan-presentation",title:"Constellation Lesson Plan",subtitle:"Observe, map, compare, justify, and reflect",motif:"orbit",accent:"F2B84B",second:"58BFD0",dark:"17243C",soft:"DCECF0",paper:"F5F3EB",slides:[
    ["TARGET","Observe, map, compare, and justify a sky pattern","Translate the goal into learner-friendly success criteria, vocabulary, evidence, and accessibility.","4 goals","learner friendly"],
    ["NOTICE","Begin with points before naming a constellation","Invite learners to mark, group, rotate, compare, question, and explain an initial pattern.","9 points","one observation"],
    ["MODEL","A pattern changes with viewpoint and convention","Use editable points and sight lines to distinguish observation, coordinate, label, and interpretation.","4 lenses","compare carefully"],
    ["LOCATE","Coordinates make observations repeatable","Model horizon, direction, altitude, time, recording, uncertainty, and a safe observation routine.","6 fields","one sky log"],
    ["PERSPECTIVE","Communities connect the same stars differently","Compare interpretations respectfully while separating cultural story from astronomical measurement.","3 stories","one sky"],
    ["PRACTICE","Build and defend one original pattern","Pairs map a set of points, name a relationship, cite evidence, exchange maps, and revise.","16 min","guided inquiry"],
    ["EXIT","Check observation, mapping, and reasoning separately","Collect one coordinate, one pattern claim, one supporting observation, and the next question.","3 checks","guide tomorrow"]]},
  {slug:"evidence-coding-thesis-defense",title:"Evidence Coding Thesis Defense",subtitle:"Question, sample, codes, themes, limits, and contribution",motif:"transcript",accent:"315CB5",second:"DB4B3F",dark:"242427",soft:"F0E9DC",paper:"FAF7F0",slides:[
    ["QUESTION","The study asks how participants make one bounded decision","Define the phenomenon, participants, context, period, perspective, and claim boundary.","1 question","bounds the claim"],
    ["GAP","Prior work describes outcomes more often than meaning-making","Synthesize agreement, tension, missing context, methodological gap, and research opportunity.","38 papers","illustrative review"],
    ["SAMPLE","Purposeful selection matches the research question","State illustrative recruitment, inclusion, diversity, setting, saturation logic, ethics, and limits.","n=24","illustrative sample"],
    ["CODING","Codes evolve through comparison, memoing, and challenge","Show familiarization, open codes, codebook, double coding, negative cases, themes, and audit trail.","7 passes","transparent method"],
    ["THEMES","Three themes explain a shared decision pattern","Present each placeholder theme with evidence type, variation, counterexample, context, and confidence.","3 themes","illustrative result"],
    ["INTERPRET","The mechanism is plausible within a narrow setting","Separate participant account, analytic inference, theory connection, alternative reading, and uncertainty.","2 readings","one bounded claim"],
    ["CONTRIBUTION","The contribution is a transparent explanatory model","Close with theory, practice, transferability, limitations, reflexivity, open questions, and next study.","3 claims","supported here"]]},
  {slug:"clinical-decision-board-case",title:"Clinical Decision Board Case",subtitle:"Evidence, uncertainty, decisions, response, and learning",motif:"matrix",accent:"E66658",second:"6BB6B0",third:"8E7BB3",dark:"193E43",soft:"E8E3F0",paper:"FAF7F3",slides:[
    ["CONCERN","Begin with the change that prompted evaluation","Summarize fictional onset, trajectory, severity, context, affected function, and meaningful negatives.","Day 0","de-identified case"],
    ["HISTORY","Focus history on facts that change probability","Organize de-identified context, relevant history, exposures, medication, preferences, and red flags.","6 fields","fictional history"],
    ["FINDINGS","Separate observations from interpretations","Present placeholder examination, measurements, tests, missing information, reliability, and limitations.","5 findings","illustrative only"],
    ["DIFFERENTIAL","Compare explanations against the same evidence","Use an editable matrix for supporting, conflicting, absent, uncertain, and safety-critical evidence.","3 options","not a diagnosis"],
    ["DECISION","Choose the next step with uncertainty intact","Show options, anticipated benefit, risk, reversibility, patient preference, monitoring, and escalation.","2 paths","shared decision"],
    ["RESPONSE","Observed change does not prove a single cause","Compare fictional baseline and follow-up, adherence, context, variation, adverse signals, and uncertainty.","Week 4","illustrative review"],
    ["LEARNING","Close with transferable reasoning and explicit limits","State safety points, follow-up, case limitations, unresolved questions, and teaching takeaways.","3 lessons","education only"]]},
  {slug:"cyber-resilience-technology-brief",title:"Cyber Resilience Technology Brief",subtitle:"Threats, assets, signals, response, recovery, and investment",motif:"checksum",accent:"65E59B",second:"65A8E5",third:"F2B84B",dark:"101615",soft:"DCEDE7",paper:"F3F5F3",slides:[
    ["MANDATE","Protect the services the organization must keep delivering","Define critical outcomes, authority, risk appetite, obligations, operating assumptions, and measures.","4 services","illustrative scope"],
    ["THREATS","Threat models connect capability to plausible paths","Describe actors, objectives, entry points, prerequisites, affected assets, impact, and uncertainty.","6 paths","illustrative model"],
    ["ASSETS","Criticality depends on the service—not the inventory label","Map data, identity, endpoints, applications, infrastructure, suppliers, owners, and recovery needs.","8 classes","one service view"],
    ["PATHS","Controls are strongest when arranged across the path","Trace access, execution, persistence, privilege, movement, action, detection, and containment.","8 stages","defense in depth"],
    ["SIGNALS","Detection needs evidence, thresholds, and an owner","Connect logs, identity, endpoint, network, application, human reports, confidence, and action.","7 signals","owned response"],
    ["RESPONSE","Practice the decisions that preserve continuity","Sequence triage, contain, communicate, investigate, recover, validate, learn, and update controls.","8 moves","illustrative playbook"],
    ["PRIORITIES","Invest where risk reduction and readiness meet","Rank placeholder initiatives by service impact, evidence gap, feasibility, dependency, and review date.","90 days","illustrative horizon"]]},
  {slug:"fashion-pattern-portfolio",title:"Fashion Pattern Portfolio",subtitle:"Concept, cut, material, fitting, outcome, and direction",motif:"pattern",accent:"E74D3C",second:"336CC7",dark:"214338",soft:"E8E0CE",paper:"F8F1E5",slides:[
    ["POSITION","The work begins with movement before silhouette","State the creative perspective, wearer, context, recurring questions, craft, and desired feeling.","1 thesis","connects the work"],
    ["EDIT","Curate the collection around contrast and progression","Introduce placeholder looks through role, proportion, material, technique, color, and relationship.","6 looks","illustrative edit"],
    ["CONCEPT","A clear tension guides each design decision","Translate research into form principles without importing source imagery, graphics, or wording.","3 rules","shape the collection"],
    ["PATTERN","Cut lines reveal how the silhouette is built","Show editable blocks for volume, balance, grain, seam, allowance, construction, and iteration.","6 pieces","illustrative pattern"],
    ["MATERIAL","Material behavior changes the form","Present original swatch placeholders for weight, drape, texture, sourcing, care, constraint, and choice.","5 swatches","native shapes only"],
    ["FITTING","Each fitting resolves one visible question","Sequence observation, hypothesis, pin, recut, test, compare, decide, and document.","4 rounds","illustrative process"],
    ["CONTACT","Invite work that values concept and construction","Close with roles, capabilities, preferred briefs, availability, location, contact, and next step.","Q2","illustrative opening"]]},
  {slug:"dependency-calendar-product-roadmap",title:"Dependency Calendar Roadmap",subtitle:"Outcomes, windows, handoffs, gates, criteria, and decisions",motif:"calendar",accent:"FF6F61",second:"6FC3A4",third:"F0C35A",dark:"2E1F3A",soft:"DDEEDF",paper:"FAF5EB",slides:[
    ["OUTCOME","The roadmap begins with a customer behavior","Define the user, moment, changed action, quality, speed, business value, and guardrail.","< 3 min","time to value"],
    ["EVIDENCE","Confidence grows through converging signals","Combine behavior, research, support, commercial context, feasibility, reliability, and risk.","7 signals","shape priority"],
    ["WINDOWS","Use calendar windows to express intent and uncertainty","Organize current, committed, conditional, and exploratory work without false date precision.","4 windows","confidence visible"],
    ["LINKS","Every release sits on a chain of owned handoffs","Map research, design, data, platform, policy, enablement, support, and launch dependencies.","8 links","owned handoffs"],
    ["GATES","Decisions happen when evidence clears a threshold","Define discovery, design, build, evaluate, ready, release, expand, and retire gates.","8 gates","evidence led"],
    ["CRITERIA","Release readiness is more than feature completion","Check value, usability, quality, reliability, privacy, support, rollback, and communication.","8 checks","before release"],
    ["REVIEW","Move dates only after revisiting the evidence","Compare expected and observed signals, confidence, dependency movement, choices, owners, and next review.","30 days","review cadence"]]},
];

const noLine = {transparency:100};
const rect=(s,x,y,w,h,color,radius=false,transparency=0,lineColor=null,lineWidth=0)=>s.addShape(radius?"roundRect":"rect",{x,y,w,h,rectRadius:.05,line:lineColor?{color:lineColor,width:lineWidth||1}:noLine,fill:{color,transparency}});
const circle=(s,x,y,d,color,transparency=0,lineColor=null,lineWidth=0)=>s.addShape("ellipse",{x,y,w:d,h:d,line:lineColor?{color:lineColor,width:lineWidth||1}:noLine,fill:{color,transparency}});
const line=(s,x,y,w,h,color,width=1,dash="solid")=>s.addShape("line",{x,y,w,h,line:{color,width,dash}});
const text=(s,value,x,y,w,h,o={})=>s.addText(value,{x,y,w,h,margin:0,fontFace:"Aptos",fontSize:12,color:"222222",breakLine:false,fit:"shrink",...o});
const darkMotifs=new Set(["ledger","console","orbit","checksum","calendar"]);
const label=(s,d,v,x=.72,y=.52,color=d.accent)=>text(s,v,x,y,6,.2,{fontSize:7.4,bold:true,color,charSpacing:1.7});
const footer=(s,d,n,color)=>{text(s,"FREEAIPPT / ORIGINAL EDITABLE TEMPLATE",.72,7.08,3.4,.17,{fontSize:6.3,bold:true,color,charSpacing:1.05});text(s,String(n).padStart(2,"0"),12.0,7.04,.55,.19,{fontSize:7.5,bold:true,color,align:"right"});};

function passport(s,d,x,y,scale=1){
  circle(s,x,y,1.55*scale,d.soft,0,d.accent,2);circle(s,x+.2*scale,y+.2*scale,1.15*scale,d.paper,0,d.second,1.2);circle(s,x+.47*scale,y+.47*scale,.61*scale,d.accent,12,d.accent,1);
  for(let i=0;i<6;i++){const a=i*Math.PI/3;line(s,x+.78*scale,y+.78*scale,Math.cos(a)*.64*scale,Math.sin(a)*.64*scale,d.second,1);}
}
function ledgerRows(s,d,x,y,w,count){for(let i=0;i<count;i++){rect(s,x,y+i*.55,w,.4,i%2?"182943":"14233A",true);text(s,`TX-${String(i+1).padStart(2,"0")}`,x+.18,y+.14,.7,.13,{fontSize:6.2,bold:true,color:d.accent});line(s,x+1.05,y+.2+i*.55,w-1.42,0,i===count-1?d.second:"38506D",1);circle(s,x+w-.28,y+.12+i*.55,.15,i===count-1?d.second:d.accent);}}
function beamGrid(s,d,x,y,w,h){for(let i=0;i<5;i++)line(s,x+i*w/4,y,0,h,d.second,i===0||i===4?2:1);for(let i=0;i<4;i++)line(s,x,y+i*h/3,w,0,i===2?d.accent:d.second,i===2?5:1);text(s,"GRID / 04",x+.12,y+.12,1.1,.15,{fontSize:6.2,bold:true,color:d.dark});}
function broadcast(s,d,x,y,w,h){rect(s,x,y,w,h,"FFFFFF",true,0,d.dark,1.2);rect(s,x+.18,y+.18,w-.36,.25,d.accent,true);for(let i=0;i<11;i++)rect(s,x+.22+i*(w-.55)/11,y+h-.55,.18,.08+((i*3)%5)*.065,i%3===0?d.second:(d.third||d.accent),true);text(s,"REC  00:08:24",x+.26,y+.58,1.25,.15,{fontSize:6.3,bold:true,color:d.second});circle(s,x+w-.55,y+.54,.18,d.second);}
function consoleGrid(s,d,x,y,w,h){rect(s,x,y,w,h,"10181C",true,0,"465258",1);for(let i=1;i<6;i++)line(s,x+i*w/6,y,0,h,"29363B",.7);for(let i=1;i<5;i++)line(s,x,y+i*h/5,w,0,"29363B",.7);line(s,x+.3,y+h-.55,w-.65,-h+.95,d.accent,2);circle(s,x+w*.58,y+h*.38,.22,d.second);text(s,"TEST VECTOR / PASS",x+.25,y+.18,1.55,.16,{fontSize:6.2,bold:true,color:d.second});}
function receipt(s,d,x,y,w,h){rect(s,x,y,w,h,"FFFEF8",false,0,"A8A69E",.8);for(let yy=y+.45;yy<y+h-.4;yy+=.43)line(s,x+.28,yy,w-.56,0,"D7D4C9",.7,"dash");rect(s,x,y,w,.28,d.accent);text(s,"QTR / AUDIT COPY",x+.28,y+.48,1.6,.16,{fontSize:6.4,bold:true,color:d.dark,charSpacing:.8});}
function orbit(s,d,x,y,size){circle(s,x,y,size,d.dark,100,"52627B",1);circle(s,x+size*.16,y+size*.16,size*.68,d.dark,100,"52627B",1);circle(s,x+size*.34,y+size*.34,size*.32,d.dark,100,"52627B",1);[[.1,.47],[.28,.14],[.66,.18],[.78,.56],[.48,.75]].forEach((p,i)=>circle(s,x+p[0]*size,y+p[1]*size,.13+(i%2)*.05,i===3?d.second:d.accent));for(let i=0;i<18;i++){const a=i*Math.PI/9;line(s,x+size/2+Math.cos(a)*size*.48,y+size/2+Math.sin(a)*size*.48,Math.cos(a)*.12,Math.sin(a)*.12,d.second,.7);}}
function transcript(s,d,x,y,w,h){rect(s,x,y,w,h,"FFFEFA",false,0,"C8C1B5",.8);rect(s,x,y,.62,h,d.soft);line(s,x+.82,y,0,h,d.second,1.2);for(let i=0;i<7;i++){line(s,x+1.08,y+.55+i*.58,w-1.35,0,"CEC8BC",.7);if(i===1||i===4)rect(s,x+1.45,y+.43+i*.58,1.25,.18,d.accent,true,18);text(s,`C${i+1}`,x+.14,y+.52+i*.58,.3,.12,{fontSize:5.7,bold:true,color:i===4?d.second:d.accent,align:"center"});}}
function matrix(s,d,x,y,w,h){const colors=[d.accent,d.second,d.third||d.soft];for(let c=0;c<3;c++){rect(s,x+c*w/3,y,w/3-.08,h,colors[c],true,c===1?78:88,colors[c],1);text(s,["SUPPORTS","CONFLICTS","UNCERTAIN"][c],x+.14+c*w/3,y+.18,w/3-.34,.15,{fontSize:5.8,bold:true,color:d.dark,align:"center"});for(let r=0;r<4;r++)circle(s,x+.2+c*w/3,y+.68+r*.58,.14,r===c?colors[c]:"FFFFFF",0,colors[c],1);}}
function checksum(s,d,x,y,w,h){rect(s,x,y,w,h,"0A0E0D",true,0,"30443C",1);for(let i=0;i<7;i++){text(s,`${i%2?"ALLOW":"CHECK"}  ${String(491+i*83).padStart(4,"0")}  ${i===5?"WARN":"PASS"}`,x+.22,y+.3+i*.48,w-1,.14,{fontFace:"Liberation Mono",fontSize:6.2,bold:i===5,color:i===5?(d.third||"F2B84B"):d.accent});line(s,x+w-.72,y+.37+i*.48,.42,0,i===5?(d.third||"F2B84B"):d.second,2);}}
function pattern(s,d,x,y,w,h){rect(s,x,y,w,h,d.soft,false,0,d.dark,.8);line(s,x+.5,y+.25,w-.9,h-.65,d.accent,1.4,"dash");line(s,x+w-.65,y+.2,-w*.42,h-.4,d.second,1.4,"dash");circle(s,x+w*.36,y+h*.3,.95,d.paper,100,d.dark,1);for(let i=0;i<8;i++)line(s,x+.18+i*w/8,y+h-.35,0,.18,d.dark,.7);text(s,"CUT 02 / GRAIN →",x+.2,y+.2,1.35,.15,{fontSize:6.2,bold:true,color:d.dark});}
function calendar(s,d,x,y,w,h){const names=["JUL","AUG","SEP","OCT"];names.forEach((v,i)=>{const cw=w/4-.08;rect(s,x+i*w/4,y,cw,h,i===1?d.accent:(i===2?d.second:"3D2A4C"),true,i===0||i===3?0:8);text(s,v,x+.15+i*w/4,y+.18,cw-.3,.15,{fontSize:6.2,bold:true,color:"FFFFFF",align:"center"});for(let r=0;r<3;r++)circle(s,x+.23+i*w/4+r*.31,y+h-.42,.13,r<=i?(i===1?d.dark:(d.third||d.accent)):"FFFFFF",i===0||i===3?0:12);});}

function visual(s,d,x,y,w,h){
  if(d.motif==="passport")passport(s,d,x+w*.28,y+h*.18,1.45);
  else if(d.motif==="ledger")ledgerRows(s,d,x,y,w,7);
  else if(d.motif==="beam")beamGrid(s,d,x,y,w,h);
  else if(d.motif==="broadcast")broadcast(s,d,x,y,w,h);
  else if(d.motif==="console")consoleGrid(s,d,x,y,w,h);
  else if(d.motif==="receipt")receipt(s,d,x,y,w,h);
  else if(d.motif==="orbit")orbit(s,d,x,y,Math.min(w,h));
  else if(d.motif==="transcript")transcript(s,d,x,y,w,h);
  else if(d.motif==="matrix")matrix(s,d,x,y,w,h);
  else if(d.motif==="checksum")checksum(s,d,x,y,w,h);
  else if(d.motif==="pattern")pattern(s,d,x,y,w,h);
  else calendar(s,d,x,y,w,h);
}

function cover(p,d){
  const dark=darkMotifs.has(d.motif),s=p.addSlide();s.background={color:dark?d.dark:d.paper};const ink=dark?"FFFFFF":d.dark,muted=dark?"B7C2C7":"65706D";
  label(s,d,d.motif==="receipt"?"QTR / AUDIT COPY":d.motif==="orbit"?"OBSERVATORY / LESSON":d.motif==="checksum"?"SYSTEM / INTEGRITY CHECK":"FREEAIPPT / ORIGINAL SERIES",.72,.68,d.accent);
  text(s,d.title,.72,1.45,6.45,1.75,{fontFace:d.motif==="transcript"||d.motif==="pattern"?"Georgia":"Aptos Display",fontSize:36,bold:true,color:ink});
  text(s,d.subtitle,.75,3.55,5.72,.7,{fontSize:14.5,color:muted});
  visual(s,d,7.72,1.0,4.85,5.48);
  rect(s,.75,5.45,5.45,.58,dark?"263238":d.soft,true);text(s,"8 EDITABLE SLIDES  ·  NATIVE SHAPES",1.05,5.67,4.85,.15,{fontSize:7,bold:true,color:dark?d.accent:d.dark,align:"center",charSpacing:.8});
}

function content(p,d,a,n){
  const [eyebrow,title,body,stat,caption]=a,dark=darkMotifs.has(d.motif),s=p.addSlide();s.background={color:dark?d.dark:(n%2?d.paper:"FFFFFF")};const ink=dark?"FFFFFF":d.dark,muted=dark?"B8C4C7":"65706D";
  label(s,d,`${String(n).padStart(2,"0")} / ${eyebrow}`,.72,.5,d.accent);line(s,.72,.92,11.88,0,dark?"3C4B50":"D6D3CA",.8);
  const reverse=(n+d.slug.length)%2===0,vx=reverse ? .75 : 8.28,tx=reverse ? 5.9 : .75;
  visual(s,d,vx,1.36,4.32,4.88);
  text(s,title,tx,1.45,6.55,1.32,{fontFace:d.motif==="transcript"||d.motif==="pattern"?"Georgia":"Aptos Display",fontSize:27.5,bold:true,color:ink});
  text(s,body,tx,3.02,6.1,.85,{fontSize:12.7,color:muted});
  rect(s,tx,4.52,2.48,1.22,dark?"253134":d.soft,true);text(s,stat,tx+.22,4.75,2.04,.38,{fontSize:21,bold:true,color:d.accent});text(s,caption,tx+.23,5.28,2.0,.2,{fontSize:7.2,color:dark?"D7DEDF":d.dark});
  const stripX=tx+2.76;["INPUT","EVIDENCE","DECISION"].forEach((v,i)=>{rect(s,stripX+i*1.18,4.72,1.02,.48,i===n%3?d.accent:(i===1&&d.second?d.second:(dark?"324146":"FFFFFF")),true,0,dark?"516066":"C9C5BB",.7);text(s,v,stripX+.08+i*1.18,4.91,.86,.12,{fontSize:5.5,bold:true,color:i===n%3||i===1?"FFFFFF":ink,align:"center"});});
  footer(s,d,n,ink);
}

await fs.mkdir(OUTPUT,{recursive:true});
for(const d of decks){
  const pptx=new pptxgen();pptx.layout="LAYOUT_WIDE";pptx.author="FreeAIPPT";pptx.company="FreeAIPPT";pptx.subject="Original editable PowerPoint template";pptx.title=d.title;pptx.lang="en-US";pptx.theme={headFontFace:"Aptos Display",bodyFontFace:"Aptos",lang:"en-US"};
  cover(pptx,d);d.slides.forEach((slide,index)=>content(pptx,d,slide,index+1));
  await pptx.writeFile({fileName:path.join(OUTPUT,`${d.slug}.pptx`),compression:true});
}
console.log(`Generated ${decks.length} original templates for 2026-09-10 round 2 in ${OUTPUT}`);
