import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requested = new Set(process.argv.slice(2));
const catalog = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-10-21.json"), "utf8"));
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
// Independently composed native geometry. No third-party media, layouts or assets.
function inventory(s,d,x,y,w,h) {
  const widths=[0.42,0.75,0.3,0.9,0.58];let px=x;
  widths.forEach((v,n)=>{const z=v*w/4.1;box(s,px,y+(n%2)*0.5,z,h-(n%2)*0.5,n%2?d.accent:d.second);px+=z+0.16;});
  box(s,x-0.12,y+h+0.12,w,0.16,d.dark);
}
function diamonds(s,d,x,y,z) {
  for(let n=0;n<3;n++)shape(s,"diamond",x+n*0.6,y+n*0.35,z,z,undefined,n%2?d.second:d.accent);
  [0,1,2].forEach(n=>box(s,x+0.7+n*0.75,y+1.5,0.14,0.14,d.accent));
}
function rings(s,d,x,y,z) {
  for(let n=0;n<4;n++)dot(s,x+n*0.38,y+n*0.38,z-n*0.76,undefined,n%2?d.second:d.accent);
}
function jaws(s,d,x,y,w,h) {
  line(s,x,y,w,0,d.accent,2);line(s,x,y,0,h,d.accent,2);line(s,x+w,y,0,h,d.accent,2);
  for(let n=0;n<8;n++)line(s,x+0.3+n*(w-0.6)/7,y,0,0.18,d.dark,0.7);
  round(s,x+0.65,y+0.75,w-1.3,h-0.95,d.soft,d.accent);
  box(s,x+w*0.4,y+1.05,w*0.2,h-1.55,d.second);
}
function cover(ppt,d) {
  const s=ppt.addSlide();s.background={color:d.paper};let ink=d.dark;
  switch(d.style) {
    case "stockrail":
      label(s,d.cover[0],0.7,0.6,8,d.dark);text(s,d.cover[1],0.7,1.3,6.7,2.1,40,d.dark,true);text(s,d.cover[2],0.7,4.2,6.0,1.35,15,d.dark);
      inventory(s,d,8.0,1.4,4.4,4.2);break;
    case "sorter":
      box(s,0,0,13.33,1.2,d.soft);label(s,d.cover[0],0.7,0.5,11,d.dark);text(s,d.cover[1],0.7,1.6,7.0,2.0,40,d.dark,true);text(s,d.cover[2],0.7,4.4,6.6,1.2,15,d.dark);
      [0,1,2].forEach(n=>shape(s,"parallelogram",8.1+n*0.6,1.7+n*0.65,2.3,3.2-n*0.25,n%2?d.dark:d.accent));break;
    case "loom":
      box(s,0,0,13.33,6.85,d.soft);box(s,9.35,0,1.1,6.85,d.accent);box(s,8.65,1.3,3.7,0.7,d.second);box(s,10.8,0.4,0.7,5.8,d.dark);box(s,8.65,4.7,3.7,0.7,d.accent);
      label(s,d.cover[0],0.7,0.7,7,d.dark);text(s,d.cover[1],0.7,1.6,6.9,2.6,38,d.dark,true);text(s,d.cover[2],0.7,4.7,6.8,1.25,15,d.dark);break;
    case "dispatch":
      box(s,0,0,2.05,6.85,d.dark);label(s,"MESSAGE",0.4,0.7,1.4,"FFFFFF");label(s,"PERMISSION",0.4,1.1,1.4,"FFFFFF");label(s,"RESPONSE",0.4,1.5,1.4,"FFFFFF");
      label(s,d.cover[0],2.7,0.7,9,d.dark);text(s,d.cover[1],2.7,1.5,9.6,1.85,40,d.dark,true);box(s,2.7,3.9,9.5,2.35,d.accent);text(s,d.cover[2],3.05,4.3,8.8,1.4,18,"FFFFFF");break;
    case "cutplan":
      label(s,d.cover[0],0.7,0.6,11,d.dark);text(s,d.cover[1],0.7,1.3,11.2,1.2,39,d.dark,true);
      box(s,0.7,3.3,7.35,2.9,d.soft);box(s,8.3,3.3,4.25,1.05,d.accent);box(s,8.3,4.6,1.15,1.6,d.second);box(s,9.7,4.6,2.85,1.6,d.dark);text(s,d.cover[2],1.05,3.7,6.55,1.85,17,d.dark);break;
    case "receipt":
      s.background={color:d.soft};box(s,8.4,0.55,3.75,5.95,"FFFFFF");for(let n=0;n<13;n++)dot(s,8.65+n*0.25,0.85,0.09,d.accent);
      label(s,d.cover[0],0.7,0.7,7,d.dark);text(s,d.cover[1],0.7,1.5,6.7,2.3,40,d.dark,true);text(s,d.cover[2],0.7,4.5,6.6,1.2,15,d.dark);
      text(s,"ELIGIBLE\nRENEWED\nREVIEWED",8.8,1.65,2.9,2.45,26,d.accent,true);line(s,8.8,4.8,2.95,0,d.accent,2);label(s,"COHORT / PERIOD",8.8,5.25,3,d.dark);break;
    case "resonance":
      s.background={color:d.dark};ink="FFFFFF";rings(s,d,8.6,1.4,3.7);label(s,d.cover[0],0.7,0.65,7,ink);text(s,d.cover[1],0.7,1.5,7.0,2.25,40,ink,true);text(s,d.cover[2],0.7,4.4,7.0,1.3,16,ink);label(s,"QUESTION / TEST / EXPLANATION",0.7,6.25,11,d.accent);break;
    case "press":
      box(s,0,0,13.33,1.0,d.dark);label(s,d.cover[0],0.7,0.4,11,"FFFFFF");text(s,d.cover[1],0.7,1.6,11.7,1.9,42,d.dark,true);line(s,0.7,4.0,11.8,0,d.accent,5);text(s,d.cover[2],0.7,4.65,7.9,1.3,17,d.dark);text(s,"SOURCE\nCONTEXT\nARGUMENT",9.45,4.6,2.8,1.3,20,d.accent,true);break;
    case "encounter":
      box(s,0.6,0.55,12.1,5.95,d.soft);box(s,0.6,0.55,12.1,0.6,d.accent);label(s,d.cover[0],0.95,0.73,11,"FFFFFF");text(s,d.cover[1],1.0,1.65,10.9,1.8,39,d.dark,true);text(s,d.cover[2],1.0,4.0,9.7,1.2,17,d.dark);[0,1,2].forEach(n=>box(s,1.0+n*0.4,5.65,0.22,0.22,n%2?d.second:d.accent));break;
    case "interference":
      s.background={color:d.dark};ink="FFFFFF";diamonds(s,d,8.15,1.5,3.1);label(s,d.cover[0],0.7,0.6,7,ink);text(s,d.cover[1],0.7,1.5,6.6,2.15,40,ink,true);text(s,d.cover[2],0.7,4.4,6.8,1.25,16,ink);break;
    case "caliper":
      label(s,d.cover[0],0.7,0.7,7,d.dark);text(s,d.cover[1],0.7,1.5,6.3,2.3,39,d.dark,true);text(s,d.cover[2],0.7,4.4,6.25,1.3,15,d.dark);jaws(s,d,7.7,1.35,4.7,4.9);break;
    case "shutters":
      label(s,d.cover[0],0.7,0.6,11,d.dark);text(s,d.cover[1],0.7,1.2,11.3,1.5,39,d.dark,true);text(s,d.cover[2],0.7,3.1,6.0,1.4,16,d.dark);
      [0,1,2].forEach(n=>{box(s,7.5+n*1.7,3.5-n*0.35,1.4,2.8+n*0.35,n===1?d.dark:d.accent);box(s,7.7+n*1.7,3.25-n*0.35,0.6,0.25,d.second);});line(s,0.7,6.4,11.9,0,d.dark,2);break;
    default:throw Error(`Unknown style: ${d.style}`);
  }
  footer(s,d,1,ink);
}
function content(ppt,d,p,i) {
  const s=ppt.addSlide();s.background={color:d.paper};let ink=d.dark;
  const pts=p.points;
  switch(d.style) {
    case "stockrail":
      head(s,d,p,0.7,0.5,9.1);stat(s,d,p,10.15,0.65,2.5);
      line(s,0.7,6.3,11.8,0,d.dark,2);pts.forEach((q,n)=>{const x=0.8+n*4.1;box(s,x,3.2,0.2,2.7,n%2?d.second:d.accent);point(s,q,x+0.45,3.55,3.2,d.dark,d.accent,21);});break;
    case "sorter":
      box(s,0,0,13.33,0.16,d.accent);head(s,d,p,0.7,0.55,8.9);stat(s,d,p,10.1,0.75,2.5);
      pts.forEach((q,n)=>{const y=3.05+n*1.08;shape(s,"parallelogram",0.7+n*0.38,y,1.4,0.78,n===1?d.dark:d.accent);text(s,q[0],3.3,y+0.04,2.1,0.5,20,d.dark,true);text(s,q[1],5.8,y+0.02,6.5,0.7,17,d.dark);});break;
    case "loom":
      box(s,0,0,0.8,6.85,d.accent);box(s,0.8,2.7,11.9,0.18,d.second);head(s,d,p,1.35,0.5,8.0);stat(s,d,p,10.1,0.7,2.5);
      box(s,11.55,3.0,0.48,3.35,d.accent);
      pts.forEach((q,n)=>{const y=3.1+n*1.05;box(s,1.35,y,10.95-n*0.23,0.86,n===1?d.soft:"F3EAF4");text(s,q[0],1.65,y+0.15,2.3,0.48,20,d.dark,true);text(s,q[1],4.45,y+0.12,6.55,0.65,16,d.dark);box(s,11.55,y+0.2,0.48,0.25,n===1?d.second:d.accent);});break;
    case "dispatch":
      box(s,0,0,2.25,6.85,d.dark);stat(s,d,p,0.35,1.0,1.6,"FFFFFF");label(s,"CAMPAIGN",0.35,4.9,1.65,"FFFFFF");head(s,d,p,2.85,0.5,9.65);
      pts.forEach((q,n)=>{const y=3.05+n*1.03;box(s,2.85,y,2.25,0.82,d.accent);text(s,q[0],3.05,y+0.12,1.85,0.5,18,"FFFFFF",true);line(s,5.1,y+0.4,0.45,0,d.accent,2);text(s,q[1],5.9,y+0.07,6.25,0.67,17,d.dark);});break;
    case "cutplan":
      head(s,d,p,0.7,0.5,9.0);stat(s,d,p,10.15,0.7,2.5);
      box(s,0.7,3.05,5.4,3.05,d.soft);point(s,pts[0],1.1,3.7,4.5,d.dark,d.accent,24);
      pts.slice(1).forEach((q,n)=>{const y=3.05+n*1.65;box(s,6.4,y,0.2,1.4,d.second);text(s,q[0],6.95,y+0.12,2.1,0.4,21,d.dark,true);text(s,q[1],9.35,y+0.09,3.0,0.95,16,d.dark);});break;
    case "receipt":
      s.background={color:d.soft};box(s,8.5,0.55,3.65,5.95,"FFFFFF");head(s,d,p,0.7,0.5,7.0);stat(s,d,p,8.9,1.15,2.9,d.accent);
      for(let n=0;n<12;n++)dot(s,8.85+n*0.25,3.05,0.07,d.accent);
      pts.forEach((q,n)=>{const y=3.0+n*1.03;text(s,q[0],0.7,y,2.1,0.45,20,d.dark,true);text(s,q[1],3.05,y,4.65,0.75,16,d.dark);});label(s,"VERIFIED SOURCE",8.9,3.65,2.9,d.dark);text(s,"Replace the sample figures before review.",8.9,4.15,2.85,1.0,16,d.dark);break;
    case "resonance":
      s.background={color:d.dark};ink="FFFFFF";head(s,d,p,0.7,0.5,8.85,ink);stat(s,d,p,10.05,0.7,2.6,d.accent);
      rings(s,d,0.8,3.15,2.75);pts.forEach((q,n)=>{const y=3.1+n*1.04;text(s,q[0],4.15,y,2.25,0.4,20,d.accent,true);text(s,q[1],6.85,y,5.4,0.75,17,ink);});break;
    case "press":
      box(s,0,0,13.33,0.23,d.dark);head(s,d,p,0.7,0.55,11.85);line(s,0.7,2.85,11.9,0,d.accent,3);
      pts.forEach((q,n)=>{const x=0.7+n*4.1;point(s,q,x,3.5,3.6,d.dark,d.accent,23);line(s,x,5.6,3.5,0,d.dark,0.6);});text(s,p.stat,0.7,6.15,4,0.4,21,d.accent,true);label(s,"ILLUSTRATIVE RESEARCH COUNTS",5.0,6.28,7,d.dark);break;
    case "encounter":
      box(s,0.6,0.5,12.1,0.48,d.soft);label(s,p.eyebrow,0.9,0.62,9,d.dark);text(s,p.title,0.7,1.25,9.2,0.95,29,d.dark,true);text(s,p.body,0.7,2.3,10.9,0.6,14,d.dark);stat(s,d,p,10.15,1.15,2.35,d.accent);
      pts.forEach((q,n)=>{const y=3.25+n*0.95;box(s,0.8,y+0.13,0.2,0.2,n===1?d.second:d.accent);text(s,q[0],1.4,y,2.35,0.4,19,d.dark,true);text(s,q[1],4.2,y,8.0,0.65,17,d.dark);line(s,1.4,y+0.78,10.8,0,d.accent,0.5);});break;
    case "interference":
      s.background={color:d.dark};ink="FFFFFF";head(s,d,p,0.7,0.5,9.0,ink);stat(s,d,p,10.1,0.7,2.5,d.accent);diamonds(s,d,0.7,3.4,2.25);
      box(s,5.05,3.0,7.6,3.35,d.soft);pts.forEach((q,n)=>{const y=3.3+n*0.95;text(s,q[0],5.35,y,2.25,0.4,19,d.dark,true);text(s,q[1],8.0,y,4.2,0.7,16,d.dark);});break;
    case "caliper":
      head(s,d,p,0.7,0.5,9.0);stat(s,d,p,10.1,0.7,2.5,d.accent);jaws(s,d,0.8,3.2,3.5,2.95);
      pts.forEach((q,n)=>{const y=3.1+n*1.03;text(s,q[0],5.05,y,2.25,0.4,20,d.accent,true);text(s,q[1],7.7,y,4.65,0.7,17,d.dark);});break;
    case "shutters":
      head(s,d,p,0.7,0.5,9.0);stat(s,d,p,10.1,0.7,2.5);
      pts.forEach((q,n)=>{const x=0.7+n*4.1,y=3.15+(n%2)*0.25;box(s,x,y,3.75,2.85,n===1?d.dark:d.accent);box(s,x+0.25,y-0.2,0.75,0.2,d.second);point(s,q,x+0.3,y+0.45,3.15,"FFFFFF","FFFFFF",22);});line(s,0.7,6.5,11.8,0,d.dark,2);break;
    default:throw Error(`Unknown style: ${d.style}`);
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
