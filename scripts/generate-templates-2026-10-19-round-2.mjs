import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const decks = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-10-19-round-2.json"), "utf8"));
const out = path.join(root, "public/templates/files");
const W = 13.333333;
const H = 7.5;

// All objects are native editable text/shapes on a blank canvas. No raster assets.
function rect(s, x, y, w, h, fill, border) {
  s.addShape("rect", { x, y, w, h, line: border ? { color: border, width: 0.8 } : { transparency: 100 }, fill: { color: fill } });
}
function rule(s, x, y, w, h, color, width = 1) {
  s.addShape("line", { x: x + Math.min(w, 0), y: y + Math.min(h, 0), w: Math.abs(w), h: Math.abs(h), flipH: w < 0, flipV: h < 0, line: { color, width } });
}
function circle(s, x, y, size, fill) {
  s.addShape("ellipse", { x, y, w: size, h: size, line: { transparency: 100 }, fill: { color: fill } });
}
function txt(s, value, x, y, w, h, size = 16, color = "242B2D", bold = false, extra = {}) {
  if (x < 0 || y < 0 || x + w > W + 0.01 || y + h > H + 0.01) throw new Error(`Text outside canvas: ${value}`);
  s.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, bold, margin: 0, breakLine: false, valign: "mid", fit: "shrink", ...extra });
}
function small(s, value, x, y, w, color) { txt(s, value, x, y, w, 0.22, 9, color, true, { charSpacing: 1.0 }); }
function footer(s, d, n, ink) {
  rule(s, 0.55, 6.96, 12.23, 0, ink, 0.5);
  txt(s, "FREEAIPPT · ORIGINAL & EDITABLE", 0.55, 7.08, 3.8, 0.15, 7, ink, true);
  txt(s, "* ILLUSTRATIVE PLACEHOLDERS · REPLACE BEFORE USE", 4.2, 7.08, 7.0, 0.15, 7, ink);
  txt(s, `${String(n).padStart(2, "0")} / 08`, 11.6, 7.05, 1.15, 0.2, 9, ink, true, { align: "right" });
}
function heading(s, d, p, x = 0.65, y = 0.55, w = 10.9, ink = d.dark) {
  small(s, p.eyebrow, x, y, w, ink);
  txt(s, p.title, x, y + 0.42, w, 1.05, 29, ink, true, { fontFace: "Aptos Display" });
  txt(s, p.body, x, y + 1.62, w, 0.5, 13, ink);
}
function point(s, label, body, x, y, w, ink, labelColor = ink, size = 17) {
  txt(s, label, x, y, w, 0.38, size, labelColor, true);
  txt(s, body, x, y + 0.54, w, 0.8, 14, ink);
}
function badge(s, d, value, x, y, w = 2.4, dark = false) {
  rect(s, x, y, w, 0.65, dark ? d.accent : d.dark);
  txt(s, value, x + 0.13, y + 0.12, w - 0.26, 0.37, 19, dark ? d.dark : "FFFFFF", true);
}

function motif(s, d, x, y, w, h) {
  switch (d.style) {
    case "workbench":
      rect(s, x, y, w, h, d.soft);
      for (let i = 0; i < 4; i++) {
        rect(s, x + 0.35, y + 0.4 + i * 0.83, w - 0.7 - i * 0.33, 0.56, i === 1 ? d.second : d.accent);
        small(s, ["ASSESS", "REPAIR", "CHECK", "RETURN"][i], x + 0.52, y + 0.56 + i * 0.83, w - 1.25, i === 1 ? d.dark : "FFFFFF");
      }
      break;
    case "charge":
      for (let i = 0; i < 5; i++) {
        rect(s, x + i * 0.25, y + i * 0.8, w - i * 0.25, 0.57, i % 2 ? d.second : d.accent);
        for (let j = 1; j < 5; j++) rule(s, x + i * 0.25 + (w - i * 0.25) * j / 5, y + i * 0.8, 0, 0.57, d.dark, 4);
      }
      break;
    case "dossier":
      for (let i = 2; i >= 0; i--) {
        rect(s, x + i * 0.2, y + i * 0.3, w - 0.4, h - 0.7, i === 0 ? "FFFFFF" : d.soft, d.accent);
        rect(s, x + i * 0.2, y + i * 0.3, 0.14, h - 0.7, d.accent);
      }
      txt(s, "PRACTICE\nDOSSIER", x + 0.45, y + 0.5, w - 1.0, 1.7, 30, d.dark, true);
      for (let i = 0; i < 4; i++) rule(s, x + 0.45, y + 2.6 + i * 0.27, w - 1.1 - i * 0.15, 0, d.accent, 1.2);
      break;
    case "admission":
      for (let i = 0; i < 3; i++) {
        const xx = x + i * (w / 3);
        rect(s, xx, y + i * 0.25, w / 3 - 0.1, h - 0.5, i === 1 ? d.second : d.accent);
        small(s, ["COME", "SEE", "RETURN"][i], xx + 0.14, y + 0.5 + i * 0.25, w / 3 - 0.34, "FFFFFF");
        for (let j = 0; j < 5; j++) circle(s, xx + 0.12 + j * 0.22, y + h - 1.2 + i * 0.25, 0.08, d.paper);
      }
      break;
    case "fold":
      for (let i = 0; i < 3; i++) {
        const xx = x + i * (w / 3);
        rect(s, xx, y + (i % 2) * 0.55, w / 3, h - 0.6, [d.soft, "EED8C8", "E0E9D7"][i]);
        rule(s, xx, y + (i % 2) * 0.55, 0, h - 0.6, d.accent, 2);
        txt(s, ["OPEN", "HELP", "LEARN"][i], xx + 0.18, y + 1.2 + (i % 2) * 0.55, w / 3 - 0.36, 0.8, 18, d.dark, true);
      }
      break;
    case "sample":
      rect(s, x, y, w, h, d.accent);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const size = (w - 0.9) / 4;
        circle(s, x + 0.3 + c * (w - 0.5) / 4, y + 0.5 + r * 0.9, size * 0.65, (r + c) % 3 ? d.paper : d.dark);
      }
      break;
    case "corpus":
      txt(s, "[", x, y - 0.1, 1.2, h, 160, d.accent, true);
      txt(s, "]", x + w - 1.2, y - 0.1, 1.2, h, 160, d.accent, true);
      for (let i = 0; i < 6; i++) rect(s, x + 1.0, y + 0.7 + i * 0.5, w - 2.0 - (i % 3) * 0.22, 0.19, i === 2 ? d.second : d.dark);
      break;
    case "followup":
      rect(s, x, y, w * 0.45, h - 0.5, d.soft, d.accent);
      rect(s, x + w * 0.52, y + 0.5, w * 0.45, h - 0.5, d.paper, d.accent);
      small(s, "OBSERVE", x + 0.15, y + 0.3, w * 0.4, d.dark);
      small(s, "REVIEW", x + w * 0.52 + 0.15, y + 0.8, w * 0.4, d.dark);
      for (let i = 0; i < 4; i++) {
        rule(s, x + 0.2, y + 1.3 + i * 0.45, w * 0.31, 0, d.accent, 2);
        rule(s, x + w * 0.52 + 0.2, y + 1.8 + i * 0.45, w * 0.31, 0, d.second, 2);
      }
      break;
    case "permit":
      for (let i = 0; i < 3; i++) {
        rect(s, x + i * 0.45, y + i * 0.55, w - i * 0.9, h - i * 1.1, d.paper, d.dark);
        rect(s, x + i * 0.45, y + i * 0.55, 0.18, h - i * 1.1, i === 1 ? d.second : d.accent);
      }
      small(s, "PURPOSE", x + 1.05, y + 1.5, w - 2.1, d.dark);
      small(s, "EVIDENCE", x + 1.05, y + 2.1, w - 2.1, d.dark);
      break;
    case "folio":
      for (let i = 3; i >= 0; i--) rect(s, x + i * 0.18, y + i * 0.22, w - 0.6, h - 0.75, i === 0 ? d.paper : d.soft, d.dark);
      rect(s, x, y, 0.4, h - 0.75, d.dark);
      txt(s, "READ\nWITH\nINTENT", x + 0.65, y + 0.45, w - 1.3, 2.5, 33, d.accent, true);
      break;
    case "bridge":
      rect(s, x, y, 1.1, h, d.accent);
      rect(s, x + w - 1.1, y, 1.1, h, d.second);
      for (let i = 0; i < 4; i++) {
        rule(s, x + 1.1, y + 0.7 + i * 0.8, w - 2.2, 0.45, d.accent, 3);
        circle(s, x + w * 0.48, y + 0.7 + i * 0.8, 0.22, d.dark);
      }
      break;
    default: throw new Error(`Unknown original system ${d.style}`);
  }
}

function cover(ppt, d) {
  const s = ppt.addSlide();
  const dark = d.style === "charge";
  const ink = dark ? "FFFFFF" : d.dark;
  s.background = { color: dark ? d.dark : d.paper };
  if (d.style === "workbench") rect(s, 0, 0, 0.27, H, d.accent);
  if (d.style === "dossier") rect(s, 0, 0, W, 0.22, d.accent);
  if (d.style === "admission") rect(s, 0, 0, 7.4, 0.23, d.second);
  if (d.style === "corpus") rule(s, 0.65, 0.43, 12.0, 0, d.dark, 2);
  if (d.style === "folio") rect(s, 0, 0, 0.35, H, d.dark);
  small(s, d.cover[0], 0.7, 0.8, 6.3, ink);
  txt(s, d.cover[1], 0.7, 1.48, 6.2, 2.4, 38, ink, true, { fontFace: "Aptos Display" });
  txt(s, d.cover[2], 0.7, 4.18, 5.95, 1.1, 15, ink);
  small(s, "INDEPENDENT DESIGN · EIGHT EDITABLE SLIDES", 0.7, 6.05, 6.25, ink);
  motif(s, d, 7.55, 1.35, 5.0, 4.65);
  footer(s, d, 1, ink);
}

function content(ppt, d, p, i) {
  const s = ppt.addSlide();
  const dark = d.style === "charge";
  const ink = dark ? "FFFFFF" : d.dark;
  s.background = { color: dark ? d.dark : d.paper };
  const pts = p.points;
  switch (d.style) {
    case "workbench": {
      rect(s, 0, 0, 2.7, 6.9, d.accent);
      small(s, "WORKSHOP NOTE", 0.4, 0.6, 2.0, "FFFFFF");
      txt(s, p.stat, 0.4, 1.25, 1.95, 1.3, 31, "FFFFFF", true);
      for (let n = 0; n < 5; n++) rule(s, 0.4, 3.2 + n * 0.55, 1.85, 0, d.second, 2);
      heading(s, d, p, 3.2, 0.6, 9.35);
      pts.forEach(([a,b],n) => { rect(s,3.2,3.25+n*1.02,0.24,0.75,d.accent); txt(s,a,3.7,3.2+n*1.02,1.7,0.36,18,d.dark,true); txt(s,b,5.7,3.2+n*1.02,6.5,0.65,16,d.dark); });
      break;
    }
    case "charge": {
      heading(s,d,p,0.7,0.6,9.2,ink); badge(s,d,p.stat,10.3,0.67,2.35,true);
      pts.forEach(([a,b],n)=>{const x=0.7+n*4.13; rect(s,x,3.28,3.86,2.96,"25443A"); rect(s,x,3.28,3.86,0.16,n===1?d.second:d.accent); for(let k=0;k<4;k++)rect(s,x+0.23+k*0.85,3.68,0.65,0.15,k<=n?d.accent:"4B6356"); point(s,a,b,x+0.25,4.15,3.33,"FFFFFF",d.accent,22);});
      break;
    }
    case "dossier": {
      rect(s,0,0,0.24,6.9,d.accent);heading(s,d,p,0.8,0.55,9.0);badge(s,d,p.stat,10.35,0.7,2.2);
      pts.forEach(([a,b],n)=>{const x=0.8+n*0.22,y=3.0+n*1.02; rect(s,x,y,11.55-n*0.22,0.89,"FFFFFF",d.soft);rect(s,x,y,0.13,0.89,d.accent);txt(s,a,x+0.35,y+0.2,2.2,0.4,19,d.accent,true);txt(s,b,x+2.9,y+0.13,8.0-n*0.22,0.6,16,d.dark);});
      break;
    }
    case "admission": {
      heading(s,d,p,0.7,0.6,9.0);badge(s,d,p.stat,10.2,0.75,2.4);
      pts.forEach(([a,b],n)=>{const x=0.7+n*4.13;rect(s,x,3.1,3.85,3.25,n===1?d.second:d.accent);point(s,a,b,x+0.28,3.4,3.25,"FFFFFF","FFFFFF",22);for(let k=0;k<10;k++)circle(s,x+0.22+k*0.35,5.7,0.08,d.paper);small(s,"VISITOR JOURNEY",x+0.28,6.0,3.1,"FFFFFF");});
      break;
    }
    case "fold": {
      heading(s,d,p,0.7,0.55,9.0);badge(s,d,p.stat,10.3,0.7,2.3);
      pts.forEach(([a,b],n)=>{const x=0.7+n*4.0,y=3.05+(n%2)*0.35;rect(s,x,y,4.0,2.75,[d.soft,"EED8C8","E0E9D7"][n]);rule(s,x,y,0,2.75,d.accent,2);point(s,a,b,x+0.3,y+0.5,3.35,d.dark,d.dark,23);});
      break;
    }
    case "sample": {
      heading(s,d,p,0.7,0.55,10.8);
      rect(s,0.7,3.0,4.8,3.35,d.soft);
      for(let r=0;r<3;r++)for(let c=0;c<6;c++) circle(s,1.04+c*0.7,3.4+r*0.6,0.3,(c+r+i)%3?d.accent:d.second);
      txt(s,p.stat,1.05,5.45,4.0,0.5,25,d.dark,true);
      pts.forEach(([a,b],n)=>{txt(s,a,6.05,3.06+n*1.05,2.0,0.4,18,d.accent,true);txt(s,b,8.25,3.06+n*1.05,4.1,0.7,15,d.dark);});
      break;
    }
    case "corpus": {
      rule(s,0.7,0.4,11.9,0,d.dark,2);heading(s,d,p,0.7,0.7,9.1);badge(s,d,p.stat,10.25,0.85,2.35);
      pts.forEach(([a,b],n)=>{const y=3.25+n*0.95;txt(s,"[",0.75,y-0.12,0.5,0.72,38,d.accent,true);txt(s,a.toUpperCase(),1.4,y,2.1,0.44,14,d.dark,true);rect(s,3.75,y,0.07,0.55,d.second);txt(s,b,4.15,y-0.02,7.6,0.64,17,d.dark);txt(s,"]",12.0,y-0.12,0.5,0.72,38,d.accent,true);});
      break;
    }
    case "followup": {
      small(s,p.eyebrow,0.7,0.65,5.0,d.accent);txt(s,p.title,0.7,1.2,4.9,1.75,31,d.dark,true);txt(s,p.body,0.7,3.25,4.75,1.1,16,d.dark);badge(s,d,p.stat,0.7,5.1,3.1);
      pts.forEach(([a,b],n)=>{const y=0.85+n*1.85;rect(s,6.1+(n%2)*0.25,y,6.0,1.6,n===1?d.soft:"FFFFFF",d.accent);rect(s,6.1+(n%2)*0.25,y,0.13,1.6,d.accent);txt(s,a,6.5+(n%2)*0.25,y+0.2,5.15,0.4,21,d.dark,true);txt(s,b,6.5+(n%2)*0.25,y+0.75,5.15,0.55,16,d.dark);});
      break;
    }
    case "permit": {
      heading(s,d,p,0.7,0.55,9.1);badge(s,d,p.stat,10.4,0.7,2.15);
      pts.forEach(([a,b],n)=>{const x=0.7+n*0.75,y=3.05+n*1.0;rect(s,x,y,11.85-n*1.45,0.85,d.paper,d.dark);rect(s,x,y,0.18,0.85,n===1?d.second:d.accent);txt(s,a,x+0.38,y+0.2,2.4,0.38,20,d.dark,true);txt(s,b,x+3.0,y+0.15,8.2-n*1.45,0.52,16,d.dark);});
      break;
    }
    case "folio": {
      rect(s,0,0,0.35,6.9,d.dark);heading(s,d,p,0.85,0.55,9.0);badge(s,d,p.stat,10.3,0.7,2.3);
      pts.forEach(([a,b],n)=>{const x=0.85+n*4.05,y=3.0+n*0.18;rect(s,x+0.07,y+0.1,3.72,2.9,d.soft,d.dark);rect(s,x,y,3.72,2.9,d.paper,d.dark);rect(s,x,y,0.14,2.9,d.accent);point(s,a,b,x+0.32,y+0.4,3.05,d.dark,d.accent,22);rule(s,x+0.32,y+2.4,2.8,0,d.dark,0.6);});
      break;
    }
    case "bridge": {
      heading(s,d,p,0.7,0.55,9.0);badge(s,d,p.stat,10.3,0.7,2.3);
      rect(s,0.7,3.05,0.23,3.1,d.accent);rect(s,12.4,3.45,0.23,2.7,d.second);
      pts.forEach(([a,b],n)=>{const x=1.18+n*3.76,y=3.18+(n%2)*0.4; if(n<2)rule(s,x+3.3,y+1.2,0.45,n%2?-0.4:0.4,d.accent,3);rect(s,x,y,3.34,2.65,d.soft);point(s,a,b,x+0.25,y+0.35,2.82,d.dark,d.dark,22);circle(s,x+0.25,y+2.17,0.15,d.accent);});
      break;
    }
    default: throw new Error(`Unknown content system ${d.style}`);
  }
  footer(s,d,i+2,ink);
}

await fs.mkdir(out, { recursive: true });
for (const d of decks) {
  if (d.story.length !== 7 || d.story.some(p => p.points.length !== 3 || !p.stat.endsWith("*"))) throw new Error(`Invalid eight-slide story: ${d.slug}`);
  const ppt = new pptxgen();
  ppt.layout = "LAYOUT_WIDE";
  ppt.author = "FreeAIPPT";
  ppt.subject = "Original editable template. All sample figures are illustrative placeholders.";
  ppt.title = d.name;
  ppt.company = "FreeAIPPT";
  ppt.lang = "en-US";
  ppt.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-US" };
  cover(ppt,d);
  d.story.forEach((p,i)=>content(ppt,d,p,i));
  await ppt.writeFile({ fileName: path.join(out, `${d.slug}.pptx`) });
  console.log(`Created ${d.slug}: 8 editable slides`);
}
