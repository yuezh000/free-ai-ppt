import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requested = new Set(process.argv.slice(2));
const catalog = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-10-20.json"), "utf8"));
const decks = catalog.filter(d => requested.size === 0 || requested.has(d.slug));
if (requested.size && decks.length !== requested.size) throw Error("Unknown template slug requested");
const W = 13.333333, H = 7.5;
// Each deck begins with a blank canvas. Only editable native shapes and system text.
function shape(s, type, x, y, w, h, fill, border) {
  if (x < 0 || y < 0 || w < 0 || h < 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error(`Shape bounds: ${type}`);
  s.addShape(type, { x, y, w, h, radius: 0.12, rectRadius: 0.12, fill: { color: fill ?? "FFFFFF", transparency: fill ? 0 : 100 }, line: border ? { color: border, width: 1.3 } : { transparency: 100 } });
}
const box = (s,x,y,w,h,c,b) => shape(s,"rect",x,y,w,h,c,b);
const round = (s,x,y,w,h,c,b) => shape(s,"roundRect",x,y,w,h,c,b);
const dot = (s,x,y,z,c,b) => shape(s,"ellipse",x,y,z,z,c,b);
function line(s,x,y,w,h,c,width=1) {
  s.addShape("line", { x:x+Math.min(w,0),y:y+Math.min(h,0),w:Math.abs(w),h:Math.abs(h),flipH:w<0,flipV:h<0,line:{color:c,width} });
}
function text(s,value,x,y,w,h,size,color,bold=false,more={}) {
  if (x<0 || y<0 || x+w>W+0.01 || y+h>H+0.01) throw Error(`Text bounds: ${value}`);
  s.addText(value,{x,y,w,h,fontFace:"Aptos",fontSize:size,color,bold,margin:0,breakLine:false,valign:"mid",fit:"shrink",...more});
}
const label = (s,t,x,y,w,c) => text(s,t,x,y,w,0.24,9,c,true,{charSpacing:1.1});
function footer(s,d,n,c=d.dark) {
  line(s,0.6,6.94,12.13,0,c,0.45);
  text(s,"FREEAIPPT · ORIGINAL & EDITABLE",0.6,7.08,3.6,0.17,7,c,true);
  text(s,"* ILLUSTRATIVE PLACEHOLDERS · REPLACE BEFORE USE",4.0,7.08,7.3,0.17,7,c);
  text(s,`${String(n).padStart(2,"0")} / 08`,11.7,7.04,1.0,0.23,9,c,true,{align:"right"});
}
function head(s,d,p,x=0.7,y=0.55,w=11.9,c=d.dark) {
  label(s,p.eyebrow,x,y,w,c);
  text(s,p.title,x,y+0.45,w,1.0,29,c,true,{fontFace:"Aptos Display"});
  text(s,p.body,x,y+1.6,w,0.57,14,c);
}
function point(s,p,x,y,w,c,labelColor=c,size=20) {
  text(s,p[0],x,y,w,0.42,size,labelColor,true);
  text(s,p[1],x,y+0.61,w,0.85,15,c);
}
function stat(s,d,p,x,y,w=2.5,c=d.dark) {
  text(s,p.stat,x,y,w,0.66,25,c,true);
  label(s,"ILLUSTRATIVE",x,y+0.76,w,c);
}
function vessel(s,d,x,y,w,h,fill) {
  round(s,x,y,w,h,undefined,d.accent);
  box(s,x+0.12,y+h-fill,w-0.24,fill-0.14,d.accent);
  for(let k=0;k<4;k++) line(s,x+w-0.44,y+0.5+k*(h-1)/4,0.25,0,d.dark,1);
}
function processor(s,d,x,y,w,h) {
  box(s,x,y,w,h,d.dark);
  for(let k=0;k<7;k++) {
    box(s,x-0.2,y+0.28+k*(h-0.56)/7,0.2,0.13,d.accent);
    box(s,x+w,y+0.28+k*(h-0.56)/7,0.2,0.13,d.accent);
  }
  box(s,x+0.35,y+0.35,w-0.7,h-0.7,d.paper);
  for(let k=0;k<3;k++)box(s,x+0.65,y+0.85+k*0.65,w-1.3,0.24,k===1?d.accent:d.dark);
}
function cover(ppt,d) {
  const s=ppt.addSlide();s.background={color:d.paper};
  let ink=d.dark;
  switch(d.style) {
    case "courtyard":
      label(s,d.cover[0],0.75,0.65,10,d.dark);
      text(s,d.cover[1],0.75,1.25,10.7,1.6,38,d.dark,true);
      text(s,d.cover[2],0.75,3.0,6.3,1.15,15,d.dark);
      box(s,8.1,3.0,4.3,3.15,undefined,d.accent);box(s,8.6,3.5,1.1,2.1,d.soft);box(s,10.4,3.5,1.45,0.75,d.accent);box(s,10.4,4.7,1.45,0.95,d.second);
      line(s,0.75,5.6,6.2,0,d.accent,5);label(s,"SPACE / SERVICE / OCCUPANCY",0.75,5.95,6,d.dark);
      break;
    case "reservoir":
      s.background={color:d.dark};ink="FFFFFF";
      label(s,d.cover[0],0.75,0.7,6,ink);text(s,d.cover[1],0.75,1.35,6.2,2.4,38,ink,true);
      text(s,d.cover[2],0.75,4.35,6.0,1.2,15,ink);
      vessel(s,d,7.7,1.4,2.1,4.6,2.5);vessel(s,d,10.2,2.15,2.1,3.85,1.4);
      label(s,"CAPTURE",7.85,0.8,2,d.accent);label(s,"RETURN",10.35,1.55,2,d.accent);
      break;
    case "stage":
      box(s,0,0,3.0,6.85,d.dark);label(s,"STUDIO PROFILE",0.4,0.6,2.3,"FFFFFF");
      for(let i=0;i<3;i++)box(s,0.45+i*0.28,1.5+i*0.45,2.1-i*0.56,4.3-i*0.9,undefined,d.second);
      label(s,d.cover[0],3.65,0.75,8,d.dark);text(s,d.cover[1],3.65,1.45,8.6,2.1,39,d.dark,true);
      text(s,d.cover[2],3.65,4.1,8.3,0.95,16,d.dark);box(s,3.65,5.7,8.95,0.55,d.accent);
      break;
    case "broadcast":
      box(s,0,0,13.33,0.28,d.accent);label(s,d.cover[0],0.7,0.75,9,d.dark);
      text(s,d.cover[1],0.7,1.35,11.8,1.8,41,d.dark,true);
      text(s,d.cover[2],0.7,3.4,7.1,1.0,15,d.dark);
      for(let i=0;i<6;i++)box(s,0.7+i*2.03,5.0+(i%3)*0.21,1.78,1.1-(i%3)*0.21,i===2?d.second:d.accent);
      label(s,"LISTEN / DISCOVER / RETURN",0.7,6.35,9,d.dark);
      break;
    case "roofline":
      shape(s,"parallelogram",7.65,0.9,4.75,4.8,d.dark);box(s,7.65,5.7,4.75,0.5,d.accent);
      label(s,d.cover[0],0.7,0.75,6.5,d.dark);text(s,d.cover[1],0.7,1.45,6.4,2.4,38,d.dark,true);text(s,d.cover[2],0.7,4.25,6.1,1.2,15,d.dark);
      for(let i=0;i<4;i++)line(s,8.45,2.1+i*0.75,2.9,0,d.paper,2);
      label(s,"SITE / OPTIONS / DECISION",0.7,6.2,6.5,d.dark);
      break;
    case "variance":
      label(s,d.cover[0],0.75,0.65,6,d.dark);text(s,d.cover[1],0.75,1.4,6.4,2.2,39,d.dark,true);text(s,d.cover[2],0.75,4.05,5.95,1.35,15,d.dark);
      line(s,9.6,1.1,0,4.95,d.dark,2);
      [2.2,-1.25,1.6,-1.85].forEach((v,i)=>{box(s,v>0?9.6:9.6+v,1.5+i*1.05,Math.abs(v),0.65,v>0?d.accent:d.second);});
      label(s,"RECONCILE BEFORE INTERPRETING",7.3,6.3,5.3,d.dark);
      break;
    case "forum":
      label(s,d.cover[0],0.7,0.65,10,d.dark);text(s,d.cover[1],0.7,1.25,11.9,1.7,40,d.dark,true);
      round(s,0.75,3.4,5.45,2.7,d.accent);round(s,7.1,3.4,5.45,2.7,d.second);
      text(s,"CLAIM",1.1,3.75,4.6,0.65,30,"FFFFFF",true);text(s,"RESPONSE",7.45,3.75,4.6,0.65,30,"FFFFFF",true);
      text(s,d.cover[2],1.1,4.65,4.7,1.1,14,"FFFFFF");text(s,"Listen for the reason.\nAsk what the evidence supports.",7.45,4.65,4.7,1.1,17,"FFFFFF");
      line(s,6.2,4.7,0.9,0,d.dark,4);
      break;
    case "diptych":
      box(s,0,0,4.65,6.85,d.soft);box(s,4.65,0,0.18,6.85,d.accent);
      text(s,"QUESTION\nCONTEXT\nCOMPARISON",0.7,1.5,3.45,2.4,29,d.accent,true);
      label(s,d.cover[0],5.45,0.75,7.1,d.dark);text(s,d.cover[1],5.45,1.45,7.0,2.65,36,d.dark,true);
      text(s,d.cover[2],5.45,4.65,6.85,1.25,15,d.dark);break;
    case "nightwatch":
      s.background={color:d.dark};ink="FFFFFF";
      label(s,d.cover[0],0.75,0.7,10,ink);text(s,d.cover[1],0.75,1.4,10.6,1.7,40,ink,true);text(s,d.cover[2],0.75,3.5,7.0,1.0,16,ink);
      for(let i=0;i<8;i++)round(s,0.75+i*1.5,5.2,1.25,0.9,i===3?d.second:d.accent);
      label(s,"OBSERVATION / EVIDENCE / QUALIFIED REVIEW",0.75,6.4,11,ink);break;
    case "device":
      label(s,d.cover[0],0.75,0.7,6,d.dark);text(s,d.cover[1],0.75,1.4,6.25,2.35,39,d.dark,true);text(s,d.cover[2],0.75,4.25,6.1,1.15,15,d.dark);
      processor(s,d,8.0,1.3,4.1,4.7);label(s,"TASK / DEVICE / RECOVERY",0.75,6.2,6.5,d.dark);break;
    case "keyframe":
      box(s,0,0,13.33,3.2,d.soft);label(s,d.cover[0],0.7,0.55,11,d.dark);text(s,d.cover[1],0.7,1.0,11.85,1.75,40,d.dark,true);
      [0,1,2].forEach(i=>{const x=0.75+i*4.15;box(s,x,3.7,3.85,1.25,undefined,d.accent);dot(s,x+0.35+i*0.7,3.98,0.65,i===1?d.second:d.accent);});
      text(s,d.cover[2],0.75,5.5,11.7,0.95,16,d.dark);break;
    case "ramp":
      label(s,d.cover[0],0.75,0.65,10,d.dark);text(s,d.cover[1],0.75,1.3,10.9,1.8,40,d.dark,true);
      text(s,d.cover[2],0.75,3.3,6.3,1.1,15,d.dark);
      for(let i=0;i<4;i++){box(s,7.4+i*1.26,5.9-i*0.66,1.26,0.4+i*0.66,i%2?d.accent:d.second);line(s,7.4+i*1.26,5.6-i*0.66,1.26,-0.66,d.dark,2);}
      label(s,"BARRIERS / OWNERS / VALIDATION",0.75,5.9,6.3,d.dark);break;
    default: throw Error(`Unknown style: ${d.style}`);
  }
  footer(s,d,1,ink);
}
function content(ppt,d,p,i) {
  const s=ppt.addSlide();s.background={color:d.paper};let ink=d.dark;
  const pts=p.points;
  const cue=["CONTEXT TO CONFIRM","CORE STRUCTURE","EVIDENCE TO VERIFY","METHOD & OWNERSHIP","STAGED PLAN","LIMITS TO REVIEW","NEXT DECISION"][i];
  switch(d.style) {
    case "courtyard":
      head(s,d,p,0.75,0.55,9.0);stat(s,d,p,10.05,0.7,2.55);
      box(s,0.75,3.1,11.8,3.05,undefined,d.accent);
      pts.forEach((q,n)=>{const x=1.05+n*3.85;box(s,x,3.4,0.45,0.45,n===1?d.second:d.accent);point(s,q,x,4.02,3.25,d.dark,d.dark);});
      label(s,cue,0.75,6.5,11,d.dark);break;
    case "reservoir":
      s.background={color:d.dark};ink="FFFFFF";head(s,d,p,0.75,0.55,9.15,ink);stat(s,d,p,10.15,0.7,2.5,d.accent);
      pts.forEach((q,n)=>{const x=0.8+n*4.15;vessel(s,d,x,3.3,1.0,2.85,0.65+n*0.62);point(s,q,x+1.3,3.65,2.55,ink,d.accent,19);});
      label(s,cue,0.75,6.5,11,ink);break;
    case "stage":
      box(s,0,0,1.1,6.85,d.dark);label(s,"STUDIO",0.16,0.6,0.8,"FFFFFF");head(s,d,p,1.65,0.55,10.85);
      pts.forEach((q,n)=>{const x=1.65+n*3.66,y=3.05+n*0.25;box(s,x,y,3.35,2.6-n*0.25,undefined,d.accent);box(s,x,y+2.6-n*0.25,3.35,0.32,n===1?d.second:d.accent);point(s,q,x+0.25,y+0.3,2.85,d.dark);});
      text(s,p.stat,1.65,6.15,3.2,0.45,21,d.accent,true);label(s,cue,5.25,6.35,7,d.dark);break;
    case "broadcast":
      head(s,d,p,0.75,0.55,9.0);stat(s,d,p,10.15,0.7,2.45);
      pts.forEach((q,n)=>{const y=3.05+n*1.04;box(s,0.75,y,2.55,0.85,n===1?d.dark:d.accent);text(s,q[0],0.95,y+0.12,2.15,0.58,19,"FFFFFF",true);text(s,q[1],3.65,y+0.07,7.8,0.68,17,d.dark);for(let k=0;k<3;k++)box(s,11.9+k*0.23,y+0.22+k*0.08,0.12,0.4-k*0.08,d.accent);});
      label(s,cue,0.75,6.5,11,d.dark);break;
    case "roofline":
      shape(s,"parallelogram",0.4,0.45,0.32,5.95,d.accent);head(s,d,p,1.1,0.55,8.5);stat(s,d,p,10.15,0.7,2.5);
      pts.forEach((q,n)=>{const x=1.1+n*3.86;shape(s,"parallelogram",x,3.15,3.55,0.48,n===1?d.second:d.accent);point(s,q,x+0.1,4.0,3.25,d.dark);line(s,x+0.1,5.9,3.2,0,d.dark,1);});
      label(s,cue,1.1,6.45,11,d.dark);break;
    case "variance":
      head(s,d,p,0.75,0.55,11.8);stat(s,d,p,0.75,3.25,3.0);
      line(s,4.4,3.0,0,3.35,d.dark,1.5);
      pts.forEach((q,n)=>{const y=3.15+n*1.05;box(s,n===1?3.4:4.4,y+0.1,n===1?1.0:0.55+n*0.23,0.38,n===1?d.second:d.accent);text(s,q[0],5.75,y,2.1,0.35,18,d.dark,true);text(s,q[1],8.0,y-0.03,4.4,0.72,15,d.dark);});
      label(s,cue,0.75,6.5,11,d.dark);break;
    case "forum":
      head(s,d,p,0.75,0.55,9.0);stat(s,d,p,10.15,0.7,2.5);
      pts.forEach((q,n)=>{const x=0.75+n*4.14,y=3.25+(n===1?0.28:0);round(s,x,y,3.85,2.75,n===1?d.second:d.accent);point(s,q,x+0.27,y+0.35,3.3,"FFFFFF","FFFFFF",23);});
      line(s,4.6,4.7,0.29,0,d.dark,3);line(s,8.74,4.7,0.29,0,d.dark,3);label(s,cue,0.75,6.5,11,d.dark);break;
    case "diptych":
      box(s,0,0,4.45,6.85,d.soft);box(s,4.45,0,0.12,6.85,d.accent);
      label(s,p.eyebrow,0.65,0.6,3.2,d.dark);text(s,p.title,0.65,1.2,3.15,2.35,29,d.dark,true);text(s,p.body,0.65,3.9,3.15,1.1,14,d.dark);stat(s,d,p,0.65,5.5,3.1,d.accent);
      pts.forEach((q,n)=>{const y=0.85+n*1.8;line(s,5.2,y,7.4,0,d.accent,1.2);text(s,q[0],5.2,y+0.23,2.1,0.45,21,d.accent,true);text(s,q[1],7.7,y+0.2,4.6,1.0,17,d.dark);});label(s,cue,5.2,6.5,7.1,d.dark);break;
    case "nightwatch":
      box(s,0,0,3.35,6.85,d.dark);label(s,p.eyebrow,0.45,0.65,2.45,"FFFFFF");stat(s,d,p,0.45,1.4,2.45,"FFFFFF");
      for(let n=0;n<5;n++)round(s,0.45+n*0.5,5.6,0.35,0.65,n===i%5?d.second:d.accent);
      text(s,p.title,3.95,0.7,8.6,1.0,29,d.dark,true);text(s,p.body,3.95,1.95,8.35,0.65,14,d.dark);
      pts.forEach((q,n)=>{const y=3.05+n*0.98;round(s,3.95,y,8.55,0.83,undefined,d.accent);text(s,q[0],4.2,y+0.13,2.15,0.5,18,d.dark,true);text(s,q[1],6.65,y+0.09,5.5,0.6,15,d.dark);});label(s,cue,3.95,6.5,8,d.dark);break;
    case "device":
      head(s,d,p,0.75,0.55,9.0);stat(s,d,p,10.15,0.7,2.5,d.accent);
      processor(s,d,1.0,3.1,2.9,3.0);
      pts.forEach((q,n)=>{const y=3.05+n*1.02;box(s,4.6,y+0.28,0.45,0.17,d.accent);text(s,q[0],5.4,y,2.2,0.4,19,d.dark,true);text(s,q[1],8.0,y-0.02,4.45,0.72,15,d.dark);});label(s,cue,0.75,6.5,11,d.dark);break;
    case "keyframe":
      box(s,0,0,13.33,2.8,d.soft);head(s,d,p,0.75,0.4,9.0);stat(s,d,p,10.15,0.55,2.5,d.accent);
      pts.forEach((q,n)=>{const x=0.75+n*4.15;box(s,x,3.25,3.85,1.1,undefined,d.accent);dot(s,x+0.3+n*0.7,3.47,0.65,n===1?d.second:d.accent);point(s,q,x+0.05,4.7,3.55,d.dark,d.accent,23);});label(s,cue,0.75,6.5,11,d.dark);break;
    case "ramp":
      head(s,d,p,0.75,0.55,9.0);stat(s,d,p,10.15,0.7,2.5);
      pts.forEach((q,n)=>{const x=0.75+n*4.15,y=4.1-n*0.52;box(s,x,y,3.85,2.2+n*0.52,n===1?d.dark:d.accent);point(s,q,x+0.28,y+0.24,3.28,"FFFFFF","FFFFFF",22);line(s,x,y-0.25,3.85,-0.48,d.dark,1.5);});label(s,cue,0.75,6.55,11,d.dark);break;
    default: throw Error(`Unknown style: ${d.style}`);
  }
  footer(s,d,i+2,ink);
}
await fs.mkdir(path.join(root,"public/templates/files"),{recursive:true});
for(const d of decks) {
  if(d.story.length!==7 || d.story.some(p=>!p.stat.endsWith("*") || p.points.length!==3))throw Error(`Invalid story: ${d.slug}`);
  const ppt=new pptxgen();ppt.layout="LAYOUT_WIDE";ppt.author="FreeAIPPT";ppt.subject=d.description;ppt.title=d.name;ppt.company="FreeAIPPT";ppt.lang="en-US";
  ppt.theme={headFontFace:"Aptos Display",bodyFontFace:"Aptos",lang:"en-US"};
  cover(ppt,d);d.story.forEach((p,i)=>content(ppt,d,p,i));
  await ppt.writeFile({fileName:path.join(root,"public/templates/files",`${d.slug}.pptx`)});
  console.log(`Generated ${d.slug}: 8 editable slides`);
}
