import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seeds = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-11-26.json"), "utf8"));
const requested = new Set(process.argv.slice(2));
const decks = seeds.filter(d => !requested.size || requested.has(d.slug));
if (requested.size && decks.length !== requested.size) throw Error("Unknown template slug");
function box(s,x,y,w,h,color) {
  if (x<0 || y<0 || w<=0 || h<=0 || x+w>13.34 || y+h>7.5) throw Error("Shape outside canvas");
  s.addShape("rect", {x,y,w,h,fill:{color},line:{transparency:100}});
}
function txt(s,value,x,y,w,h,size,color,bold=false,extra={}) {
  if(x<0 || y<0 || w<=0 || h<=0 || x+w>13.34 || y+h>7.5) throw Error("Text outside canvas");
  s.addText(value,{x,y,w,h,fontFace:"Aptos",fontSize:size,color,bold,margin:0,breakLine:false,valign:"mid",...extra});
}
function base(p,d,n,inverse=false) {
  const s=p.addSlide();s.background={color:inverse?d.dark:d.paper};
  const ink=inverse?d.paper:d.dark;
  box(s,.56,6.87,12.2,.015,inverse?d.soft:d.dark);
  txt(s,"FREEAIPPT / SERVICE PRACTICE",.58,7.02,3.4,.2,8,ink,true);
  txt(s,"FICTIONAL CASE · * ILLUSTRATIVE DATA — REPLACE BEFORE USE",4.1,7.02,7.3,.2,8,ink);
  txt(s,`${String(n).padStart(2,"0")} / 08`,11.75,6.99,1,.24,10,ink,true,{align:"right"});
  return s;
}
function head(s,d,item,inverse=false) {
  const ink=inverse?d.paper:d.dark;
  txt(s,`SERVICE PRACTICE / ${item.eyebrow}`,.63,.48,11,.3,11,inverse?d.soft:d.accent,true);
  txt(s,item.title,.61,1.02,12,.84,31,ink,true);
  txt(s,item.body,.64,2.02,11.7,.72,16,ink);
}
function note(s,d,a,b,x,y,w,h,inverse=false) {
  txt(s,a.toUpperCase(),x,y,w,.35,12,inverse?d.soft:d.accent,true);
  txt(s,b,x,y+.5,w,h-.5,18,inverse?d.paper:d.dark);
}
for(const d of decks) {
  if(d.story.length!==7) throw Error("Exactly eight slides required");
  const p=new pptxgen();p.layout="LAYOUT_WIDE";p.author="FreeAIPPT";p.subject="Original editable service design portfolio";p.title=d.name;p.company="FreeAIPPT";p.lang="en-US";
  p.theme={headFontFace:"Aptos",bodyFontFace:"Aptos",lang:"en-US"};
  let s=base(p,d,1);
  txt(s,d.cover[0],.65,.65,10,.35,12,d.accent,true);
  txt(s,d.cover[1],.62,1.44,11.8,1.95,46,d.dark,true);
  txt(s,d.cover[2],.66,3.62,10.4,.75,19,d.dark);
  // Native routing bands: customer, visible service, supporting operation.
  [0,1,2].forEach(i=>{box(s,.67,4.72+i*.53,12,.39,d.soft);box(s,2.35+i*3.5,4.72+i*.53,2.85,.39,i===1?d.accent:d.dark);});
  txt(s,"CUSTOMER",.8,4.78,1.5,.2,9,d.dark,true);txt(s,"SERVICE",.8,5.31,1.5,.2,9,d.dark,true);txt(s,"SUPPORT",.8,5.84,1.5,.2,9,d.dark,true);
  // Context: one problem on the left; contribution is separated on the right.
  s=base(p,d,2);head(s,d,d.story[0]);
  box(s,.65,3.12,7.1,3.09,d.soft);
  note(s,d,...d.story[0].points[0],.95,3.43,6.45,1.1);
  note(s,d,...d.story[0].points[1],.95,4.86,6.45,1.1);
  box(s,8.05,3.12,4.62,3.09,d.dark);
  note(s,d,...d.story[0].points[2],8.4,3.58,3.92,2.0,true);
  // Handoff: service lanes are original diagrams built from editable rectangles.
  s=base(p,d,3);head(s,d,d.story[1]);
  d.story[1].points.forEach(([a,b],i)=>{
    const y=3.08+i*.94;
    box(s,.65,y,12.02,.72,d.soft);txt(s,a.toUpperCase(),.88,y+.22,2.6,.26,12,d.dark,true);
    const x=3.8+i*2.65;box(s,x,y+.08,2.73,.56,i===1?d.accent:d.dark);
    txt(s,b,x+.12,y+.18,2.49,.29,13,d.paper,true,{align:"center"});
    if(i<2) box(s,x+2.52,y+.64,.035,.39,d.accent);
  });
  txt(s,"REPLACE EACH HANDOFF WITH A REAL OWNER AND A REAL DECISION.",.86,6.15,11.5,.28,11,d.accent,true);
  // Evidence: no decorative chart implying a measured outcome.
  s=base(p,d,4,true);head(s,d,d.story[2],true);
  txt(s,"6* / 8*",.72,3.2,5.4,1.28,64,d.paper,true);
  txt(s,"ILLUSTRATIVE SESSIONS",.77,4.58,5.1,.3,12,d.soft,true);
  txt(s,d.story[2].points[0][1],.77,5.13,5.2,.9,18,d.paper);
  note(s,d,...d.story[2].points[1],7.02,3.27,5.25,1.2,true);
  note(s,d,...d.story[2].points[2],7.02,4.92,5.25,1.2,true);
  // Method: rising text blocks give the working process its own rhythm.
  s=base(p,d,5);head(s,d,d.story[3]);
  d.story[3].points.forEach(([a,b],i)=>{
    const x=.67+i*4.08, y=3.45-i*.19;
    box(s,x,y,3.8,2.65,d.soft);box(s,x,y,3.8,.07,d.accent);
    txt(s,a,x+.25,y+.3,3.3,.58,27,d.dark,true);
    txt(s,b,x+.25,y+1.12,3.25,1.05,18,d.dark);
  });
  // Delivery: explicit phases and exit evidence rather than sample dates.
  s=base(p,d,6);head(s,d,d.story[4]);
  const exits=["Agreed question","Reviewed prototype","Named owner"];
  d.story[4].points.forEach(([a,b],i)=>{
    const y=3.05+i*1.04;
    box(s,.67,y,2.2,.84,i===1?d.accent:d.dark);txt(s,a,.9,y+.25,1.75,.3,17,d.paper,true);
    txt(s,b,3.13,y+.11,5.9,.6,17,d.dark);
    box(s,9.65,y,3.01,.84,d.soft);txt(s,exits[i],9.86,y+.23,2.55,.36,14,d.dark,true);
  });
  // Limits: narrow signal bar and open rows, without copying source artwork.
  s=base(p,d,7);head(s,d,d.story[5]);
  d.story[5].points.forEach(([a,b],i)=>{
    const y=3.16+i*1.02;box(s,.7,y,.1,.76,d.accent);
    txt(s,a,.98,y+.14,2.35,.4,20,d.dark,true);txt(s,b,3.65,y+.07,8.65,.63,18,d.dark);
  });
  s=base(p,d,8,true);head(s,d,d.story[6],true);
  d.story[6].points.forEach(([a,b],i)=>note(s,d,a,b,.78+i*4.12,3.4,3.55,1.9,true));
  box(s,.78,5.74,11.72,.58,d.accent);txt(s,"YOUR NAME  /  YOUR ROLE  /  YOUR CONTACT",1,5.89,11.2,.26,13,d.paper,true);
  await fs.mkdir(path.join(root,"public/templates/files"),{recursive:true});
  await p.writeFile({fileName:path.join(root,"public/templates/files",`${d.slug}.pptx`)});
  console.log(`Generated ${d.slug}: 8 editable slides`);
}
