import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seeds = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-11-25.json"), "utf8"));
const requested = new Set(process.argv.slice(2));
const decks = seeds.filter((deck) => !requested.size || requested.has(deck.slug));
if (requested.size && decks.length !== requested.size) throw Error("Unknown template slug");
const W = 13.333333, H = 7.5;
function rect(s, x, y, w, h, color, border) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + .01 || y + h > H + .01) throw Error("Shape outside slide");
  s.addShape("rect", { x, y, w, h, fill: { color }, line: border ? { color: border, width: 1 } : { transparency: 100 } });
}
function text(s, value, x, y, w, h, size, color, bold = false, more = {}) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + .01 || y + h > H + .01) throw Error(`Text outside slide: ${value}`);
  s.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, bold, margin: 0, valign: "mid", fit: "shrink", breakLine: false, ...more });
}
function footer(s, d, page, inverse = false) {
  const ink = inverse ? d.paper : d.dark;
  rect(s, .66, 6.84, 12.02, .018, ink);
  text(s, "FREEAIPPT  /  DATA LAB", .68, 6.98, 3.5, .2, 8, ink, true);
  text(s, "* ILLUSTRATIVE SAMPLE DATA — REPLACE BEFORE USE", 4.1, 6.98, 6.9, .2, 8, ink);
  text(s, `${String(page).padStart(2, "0")} / 08`, 11.6, 6.97, 1.05, .22, 9, ink, true, { align: "right" });
}
function head(s, d, item, page, inverse = false) {
  s.background = { color: inverse ? d.dark : d.paper };
  const ink = inverse ? d.paper : d.dark;
  text(s, `DATA LAB  /  ${item.eyebrow}`, .7, .48, 8, .3, 10, inverse ? d.soft : d.second, true, { charSpacing: 1 });
  text(s, item.title, .68, .98, 11.9, .85, 32, ink, true, { fontFace: "Aptos Display" });
  text(s, item.body, .7, 1.95, 11.5, .69, 16, ink);
  footer(s, d, page, inverse);
}
function tile(s, d, x, y, w, h, heading, body, inverse = false) {
  rect(s, x, y, w, h, inverse ? "514363" : d.soft);
  rect(s, x, y, .10, h, d.accent);
  text(s, heading.toUpperCase(), x + .28, y + .2, w - .55, .3, 12, inverse ? d.paper : d.dark, true);
  text(s, body, x + .28, y + .58, w - .55, h - .75, 14, inverse ? d.paper : d.dark);
}
function cover(ppt, d) {
  const s = ppt.addSlide(); s.background = { color: d.paper };
  rect(s, .7, .75, 3.35, .12, d.accent);
  text(s, d.cover[0], .73, 1.05, 5.6, .35, 12, d.second, true, { charSpacing: 1.2 });
  text(s, d.cover[1], .7, 1.68, 7.7, 2.03, 49, d.dark, true, { fontFace: "Aptos Display" });
  text(s, d.cover[2], .74, 4.04, 6.8, 1.1, 19, d.dark);
  // Original ledger mark: editable count cells and a baseline, with no source artwork.
  rect(s, 8.84, 1.25, 3.72, 4.65, d.dark);
  [0, 1, 2, 3].forEach((row) => [0, 1, 2].forEach((col) => {
    rect(s, 9.12 + col * 1.03, 1.55 + row * 1.0, .75, .72,
      (row + col) % 3 === 0 ? d.accent : (row + col) % 3 === 1 ? d.soft : d.second);
  }));
  text(s, "ASK  /  COUNT  /  EXPLAIN", 9.0, 5.49, 3.45, .25, 10, d.paper, true, { align: "center" });
  footer(s, d, 1);
}
function question(ppt, d, item) {
  const s = ppt.addSlide(); head(s, d, item, 2);
  rect(s, .72, 3.07, 7.25, 2.82, d.dark);
  text(s, "THE CLASSROOM QUESTION", 1.07, 3.42, 6.4, .35, 12, d.soft, true);
  text(s, "Where would you choose to read?", 1.05, 4.0, 6.1, 1.0, 28, d.paper, true);
  item.points.forEach(([a,b],i) => tile(s,d,8.25,3.07+i*.96,4.37,.82,a,b));
}
function sample(ppt,d,item) {
  const s=ppt.addSlide(); head(s,d,item,3);
  const values=[8,10,6];
  item.points.forEach(([a],i)=>{
    const y=3.03+i*.96;
    text(s,a.toUpperCase(),.72,y+.18,2.05,.35,15,d.dark,true);
    for(let n=0;n<values[i];n++) rect(s,3.0+n*.62,y+.13,.46,.46,i===1?d.accent:d.second);
    text(s,`${values[i]}*`,10.75,y+.09,1.25,.55,24,d.dark,true,{align:"right"});
  });
  text(s,"EACH SQUARE = ONE ILLUSTRATIVE RESPONSE",.74,6.09,10,.26,10,d.second,true);
}
function compare(ppt,d,item) {
  const s=ppt.addSlide(); head(s,d,item,4,true);
  const values=[10,8,6], labels=["LIBRARY","WINDOW","GARDEN"];
  labels.forEach((name,i)=>{
    const y=3.03+i*.9;
    text(s,name,.77,y+.16,2.25,.3,13,d.paper,true);
    rect(s,3.05,y+.1,values[i]*.65,.54,i===0?d.accent:d.soft);
    text(s,`${values[i]}*`,10.52,y+.04,1.26,.65,23,d.paper,true,{align:"right"});
  });
  text(s,"COMPARE THE COUNTS, THEN EXPLAIN THE GAP.",.76,6.06,11,.3,13,d.soft,true);
}
function method(ppt,d,item) {
  const s=ppt.addSlide(); head(s,d,item,5);
  item.points.forEach(([a,b],i)=>{
    const x=.73+i*4.19;
    rect(s,x,3.16,3.89,2.66,i===1?d.dark:d.soft);
    text(s,`0${i+1}`,x+.28,3.39,1.3,.75,37,i===1?d.accent:d.second,true);
    text(s,a.toUpperCase(),x+.28,4.28,3.25,.35,17,i===1?d.paper:d.dark,true);
    text(s,b,x+.28,4.79,3.25,.56,15,i===1?d.paper:d.dark);
  });
}
function practice(ppt,d,item) {
  const s=ppt.addSlide(); head(s,d,item,6);
  rect(s,.73,3.07,5.6,2.83,d.soft);
  text(s,"MY CLAIM",1.04,3.44,4.9,.4,15,d.second,true);
  text(s,"The sample suggests…",1.04,4.03,4.76,.8,25,d.dark,true);
  rect(s,6.61,3.07,5.95,2.83,d.dark);
  text(s,"PARTNER CHECK",6.93,3.44,4.9,.4,15,d.accent,true);
  item.points.forEach(([a,b],i)=>text(s,`${a.toUpperCase()}  /  ${b}`,6.94,4.02+i*.48,5.0,.35,13,d.paper));
}
function caution(ppt,d,item) {
  const s=ppt.addSlide(); head(s,d,item,7,true);
  rect(s,.74,3.07,11.83,2.89,"514363");
  text(s,"CHECK THE BASELINE",1.1,3.4,5.2,.4,14,d.soft,true);
  rect(s,1.12,4.2,9.8,.05,d.paper);
  [0,1,2,3,4].forEach(i=>{
    rect(s,1.2+i*2.33,4.48,.04,.58,d.soft);
    text(s,String(i*3)+"*",1.08+i*2.33,5.2,.55,.32,12,d.paper,true);
  });
  text(s,"START AT ZERO* TO SEE THE FULL SCALE",1.12,5.72,10.65,.31,14,d.paper,true);
}
function exitTicket(ppt,d,item) {
  const s=ppt.addSlide(); head(s,d,item,8);
  item.points.forEach(([a,b],i)=>tile(s,d,.74+i*4.19,3.1,3.89,2.4,a,b));
  text(s,"NEXT: COLLECT REAL CLASS DATA AND TEST THE CLAIM.",.77,6.08,11.8,.34,15,d.second,true);
}
await fs.mkdir(path.join(root,"public/templates/files"),{recursive:true});
for(const d of decks){
  if(d.story.length!==7 || d.story.some(x=>x.points.length!==3 || !x.stat.endsWith("*"))) throw Error(`Invalid seed: ${d.slug}`);
  const ppt=new pptxgen(); ppt.layout="LAYOUT_WIDE"; ppt.author="FreeAIPPT"; ppt.company="FreeAIPPT"; ppt.title=d.name; ppt.subject=d.description; ppt.lang="en-US";
  ppt.theme={headFontFace:"Aptos Display",bodyFontFace:"Aptos",lang:"en-US"};
  cover(ppt,d); question(ppt,d,d.story[0]); sample(ppt,d,d.story[1]); compare(ppt,d,d.story[2]); method(ppt,d,d.story[3]); practice(ppt,d,d.story[4]); caution(ppt,d,d.story[5]); exitTicket(ppt,d,d.story[6]);
  await ppt.writeFile({fileName:path.join(root,"public/templates/files",`${d.slug}.pptx`)});
  console.log(`Generated ${d.slug}: eight editable slides`);
}
