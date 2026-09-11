import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public", "templates", "files");
const decks = JSON.parse(await fs.readFile(path.join(ROOT, "lib", "template-seeds-2026-09-11.json"), "utf8"));
const noLine = { transparency: 100 };

const rect = (s, x, y, w, h, color, radius = false, transparency = 0, lineColor = null, lineWidth = 0) =>
  s.addShape(radius ? "roundRect" : "rect", { x, y, w, h, rectRadius: 0.05, line: lineColor ? { color: lineColor, width: lineWidth || 1 } : noLine, fill: { color, transparency } });
const circle = (s, x, y, d, color, transparency = 0, lineColor = null, lineWidth = 0) =>
  s.addShape("ellipse", { x, y, w: d, h: d, line: lineColor ? { color: lineColor, width: lineWidth || 1 } : noLine, fill: { color, transparency } });
const line = (s, x, y, w, h, color, width = 1, dash = "solid") => s.addShape("line", { x, y, w, h, line: { color, width, dash } });
const text = (s, value, x, y, w, h, options = {}) => s.addText(value, { x, y, w, h, margin: 0, fontFace: "Aptos", fontSize: 12, color: "222222", breakLine: false, fit: "shrink", ...options });
const label = (s, d, value, x, y, color = d.accent) => text(s, value, x, y, 5.8, 0.2, { fontSize: 7, bold: true, color, charSpacing: 1.5 });
const footer = (s, d, n, color) => {
  text(s, "FREEAIPPT / ORIGINAL EDITABLE TEMPLATE", 0.58, 7.08, 3.5, 0.16, { fontSize: 6.1, bold: true, color, charSpacing: 0.85 });
  text(s, String(n).padStart(2, "0"), 12.05, 7.05, 0.55, 0.17, { fontSize: 7.2, bold: true, color, align: "right" });
};

function keycard(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.paper, true, 0, d.accent, 1.2);
  rect(s, x, y, w, 0.7, d.dark, true); text(s, `ROOM ${String(201 + n).padStart(3, "0")}`, x + 0.3, y + 0.27, 1.5, 0.16, { fontSize: 7, bold: true, color: d.paper, charSpacing: 1 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const active = (r * 4 + c + n) % 4 !== 0; rect(s, x + 0.35 + c * (w - 0.65) / 4, y + 1.2 + r * 0.85, 0.72, 0.54, active ? d.soft : d.second, true, active ? 0 : 18);
    circle(s, x + 0.88 + c * (w - 0.65) / 4, y + 1.42 + r * 0.85, 0.08, active ? d.accent : d.paper);
  }
  rect(s, x + 0.35, y + h - 0.8, w - 0.7, 0.34, d.accent, true); text(s, "CHECK-IN  /  STAY  /  RETURN", x + 0.55, y + h - 0.68, w - 1.1, 0.12, { fontSize: 6.1, bold: true, color: d.dark, align: "center" });
}
function dossier(s, d, x, y, w, h, n) {
  rect(s, x, y + 0.18, w, h - 0.18, "FFFFFF", false, 0, "AFC4CA", 0.8); rect(s, x + 0.35, y, 1.25, 0.42, d.accent, true);
  text(s, `TEST DOSSIER / V${n}`, x + 0.22, y + 0.62, w - 0.44, 0.18, { fontSize: 6.5, bold: true, color: d.dark, charSpacing: 0.8 });
  for (let i = 0; i < 5; i++) { rect(s, x + 0.28, y + 1.08 + i * 0.62, w - 0.56, 0.42, i === n % 5 ? d.soft : "F5F7F6", true); circle(s, x + 0.48, y + 1.22 + i * 0.62, 0.14, i <= n % 5 ? d.third : "CAD5D5"); line(s, x + 0.83, y + 1.29 + i * 0.62, w - 1.45, 0, i === n % 5 ? d.second : "B8C6C7", 1.1); }
  rect(s, x + w - 1.35, y + h - 0.68, 1.05, 0.36, d.second, true); text(s, "VERIFY", x + w - 1.19, y + h - 0.55, 0.72, 0.11, { fontSize: 5.8, bold: true, color: "FFFFFF", align: "center" });
}
function routing(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, "FFFFFF", true, 0, d.dark, 1); const nodes = [[0.12, 0.25], [0.42, 0.16], [0.66, 0.42], [0.35, 0.7], [0.82, 0.77]];
  for (let i = 0; i < nodes.length - 1; i++) line(s, x + nodes[i][0] * w, y + nodes[i][1] * h, (nodes[i + 1][0] - nodes[i][0]) * w, (nodes[i + 1][1] - nodes[i][1]) * h, i === n % 4 ? d.accent : d.second, i === n % 4 ? 4 : 1.6, i === 2 ? "dash" : "solid");
  nodes.forEach((p, i) => { circle(s, x + p[0] * w - 0.16, y + p[1] * h - 0.16, 0.32, i === 2 ? d.accent : d.dark); text(s, `H${i + 1}`, x + p[0] * w - 0.18, y + p[1] * h - 0.045, 0.36, 0.1, { fontSize: 5.3, bold: true, color: "FFFFFF", align: "center" }); });
  for (let i = 0; i < 18; i++) rect(s, x + 0.3 + i * (w - 0.6) / 18, y + h - 0.55, i % 3 ? 0.07 : 0.14, 0.28, i % 4 === 0 ? d.accent : d.dark);
}
function windowGrid(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.dark); const cols = [0.12, 0.43, 0.68]; const widths = [0.25, 0.19, 0.2];
  cols.forEach((p, i) => { rect(s, x + p * w, y + 0.36, widths[i] * w, h - 0.72, i === n % 3 ? d.second : d.paper, false, i === n % 3 ? 0 : 8); line(s, x + p * w + widths[i] * w / 2, y + 0.36, 0, h - 0.72, i === n % 3 ? d.paper : d.third, 0.8); });
  text(s, "LISTING / ELEVATION", x + 0.28, y + h - 0.25, w - 0.56, 0.12, { fontSize: 5.7, bold: true, color: d.paper, charSpacing: 1.2 });
}
function transect(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.soft, true); for (let i = 0; i < 5; i++) circle(s, x + w * 0.5 - (0.55 + i * 0.36), y + h * 0.48 - (0.55 + i * 0.36), 1.1 + i * 0.72, d.soft, 100, i % 2 ? d.second : d.accent, i === n % 5 ? 2.5 : 0.8);
  line(s, x + 0.22, y + h * 0.18, w - 0.44, h * 0.58, d.dark, 1.2, "dash");
  for (let i = 0; i < 7; i++) { const px = x + 0.46 + i * (w - 0.9) / 7; const py = y + 0.58 + ((i * 7 + n) % 5) * 0.56; circle(s, px, py, 0.2, i % 3 === 0 ? d.second : d.accent); line(s, px + 0.1, py + 0.2, 0, 0.18, d.dark, 0.8); }
}
function yearstrip(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.dark, true); const qs = ["Q1", "Q2", "Q3", "Q4"];
  qs.forEach((q, i) => { const bx = x + 0.28 + i * (w - 0.45) / 4; const bh = 1.15 + ((i * 3 + n) % 4) * 0.5; rect(s, bx, y + h - 0.55 - bh, (w - 0.75) / 4, bh, i === n % 4 ? d.second : d.accent, true, i === n % 4 ? 0 : 22); text(s, q, bx, y + h - 0.36, (w - 0.75) / 4, 0.12, { fontSize: 6.2, bold: true, color: "FFFFFF", align: "center" }); });
  line(s, x + 0.25, y + 0.65, w - 0.5, 0, d.third, 1.5, "dash"); text(s, "PLAN", x + w - 0.72, y + 0.48, 0.42, 0.12, { fontSize: 5.5, bold: true, color: d.third });
}
function museum(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.paper, false, 0, "B8A98F", 0.8); rect(s, x, y, 0.72, h, d.dark); text(s, `A-${String(170 + n)}`, x + 0.19, y + 0.3, 0.34, 0.14, { fontSize: 6.1, bold: true, color: d.paper, rotate: 270 });
  const layers = [d.soft, d.third, d.accent, d.second]; layers.forEach((c, i) => rect(s, x + 0.98, y + 0.65 + i * 0.68, w - 1.3 - i * 0.22, 0.42, c, false, i * 12));
  rect(s, x + 1.15, y + h - 1.05, w - 1.55, 0.56, "FFFFFF", false, 0, d.accent, 1); text(s, "OBSERVE  →  CONTEXT  →  CLAIM", x + 1.32, y + h - 0.83, w - 1.9, 0.13, { fontSize: 6, bold: true, color: d.dark, align: "center" });
}
function archive(s, d, x, y, w, h, n) {
  rect(s, x + 0.18, y + 0.15, w - 0.18, h - 0.15, d.soft, false, 0, d.second, 0.8); rect(s, x, y, w - 0.28, h - 0.28, d.paper, false, 0, d.accent, 1);
  rect(s, x + 0.34, y - 0.18, 1.2, 0.42, d.accent, true); text(s, `FOLIO ${String(n).padStart(2, "0")}`, x + 0.48, y - 0.04, 0.9, 0.12, { fontSize: 5.8, bold: true, color: "FFFFFF", align: "center" });
  for (let i = 0; i < 6; i++) line(s, x + 0.48, y + 0.75 + i * 0.55, w - 1.0, 0, i === 2 ? d.second : "C9BEAA", i === 2 ? 2 : 0.7);
  text(s, "COLLECTION / SERIES / ITEM", x + 0.48, y + h - 0.55, w - 1, 0.13, { fontFace: "Georgia", fontSize: 6.1, bold: true, color: d.dark, charSpacing: 0.5 });
}
function session(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.paper, true, 0, d.dark, 0.8); const xs = [0.45, 1.7, 2.95]; const colors = [d.accent, d.second, d.third];
  xs.forEach((dx, i) => { rect(s, x + dx, y + 0.52 + ((i + n) % 2) * 0.45, w - dx - 0.4, 0.65, colors[i], true, i ? 82 : 72, colors[i], 1); text(s, ["OBSERVATION", "HYPOTHESIS", "UNCERTAINTY"][i], x + dx + 0.18, y + 0.76 + ((i + n) % 2) * 0.45, 1.35, 0.13, { fontSize: 5.7, bold: true, color: d.dark }); });
  for (let i = 0; i < 4; i++) { circle(s, x + 0.3 + i * (w - 0.7) / 3, y + h - 0.64, 0.18, colors[i % 3]); if (i < 3) line(s, x + 0.48 + i * (w - 0.7) / 3, y + h - 0.55, (w - 0.88) / 3, 0, colors[i], 1.2, "dash"); }
}
function promptlab(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, "111019", true, 0, "3E3950", 1); const widths = [0.68, 0.82, 0.56];
  widths.forEach((p, i) => { const left = i % 2 === 0; const bw = w * p; rect(s, left ? x + 0.28 : x + w - bw - 0.28, y + 0.38 + i * 1.1, bw, 0.72, i === 1 ? d.accent : "292536", true, i === 1 ? 12 : 0); text(s, i === 0 ? "TASK + CONTEXT" : i === 1 ? "DRAFT + SOURCES" : "HUMAN REVIEW", (left ? x + 0.48 : x + w - bw - 0.08), y + 0.64 + i * 1.1, bw - 0.4, 0.13, { fontSize: 6.1, bold: true, color: i === 1 ? d.dark : "FFFFFF" }); });
  for (let i = 0; i < 10; i++) rect(s, x + 0.3 + i * (w - 0.66) / 10, y + h - 0.52, (w - 0.9) / 10, 0.18, i <= n ? d.second : "393448", true);
}
function kiln(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.paper, false, 0, d.dark, 0.9); const colors = [d.accent, d.second, d.third, "6B7D68", "D2C7B4", "4A4038"];
  colors.forEach((c, i) => { circle(s, x + 0.35 + (i % 3) * 0.72, y + 0.42 + Math.floor(i / 3) * 0.72, 0.5, c); });
  const cx = x + w * 0.67; line(s, x + 2.65, y + h - 0.65, w - 3.05, 0, d.dark, 0.8); line(s, cx, y + 1.15, 0, h - 1.8, d.second, 1, "dash");
  s.addShape("arc", { x: cx - 1.0, y: y + 1.2, w: 2.0, h: 2.8, adjustPoint: 0.2, rotate: 0, fill: { color: d.accent, transparency: 28 }, line: { color: d.dark, width: 1.4 } });
  text(s, `KILN LOG / ${String(n).padStart(2, "0")}`, x + 0.32, y + h - 0.32, 1.4, 0.12, { fontSize: 5.8, bold: true, color: d.dark });
}
function stack(s, d, x, y, w, h, n) {
  rect(s, x, y, w, h, d.dark, true); const names = ["EXPERIENCE", "SERVICES", "DATA", "PLATFORM", "OPERATIONS"];
  names.forEach((name, i) => { const shift = (i % 2) * 0.22; rect(s, x + 0.35 + shift, y + 0.36 + i * 0.68, w - 0.7 - shift * 2, 0.48, i === n % 5 ? d.accent : i === 2 ? d.second : "2B3B47", true, i === n % 5 ? 0 : 8); text(s, name, x + 0.62 + shift, y + 0.54 + i * 0.68, w - 1.24, 0.12, { fontSize: 5.8, bold: true, color: i === n % 5 ? d.dark : "FFFFFF" }); });
  line(s, x + 0.5, y + h - 0.42, w - 1, 0, d.third, 2, "dash");
}

const motifFns = { keycard, dossier, routing, window: windowGrid, transect, yearstrip, museum, archive, session, promptlab, kiln, stack };
function visual(s, d, x, y, w, h, n) { motifFns[d.motif](s, d, x, y, w, h, n); }

function cover(p, d) {
  const dark = ["promptlab", "stack", "yearstrip"].includes(d.motif); const s = p.addSlide(); s.background = { color: dark ? d.dark : d.paper }; const ink = dark ? "FFFFFF" : d.dark; const muted = dark ? "B9C4C8" : "65706D";
  if (d.layout === "band") { rect(s, 0, 0, 4.0, 7.5, d.dark); label(s, d, "FREEAIPPT / NETWORK PROFILE", 0.65, 0.65, d.accent); text(s, d.cover[1], 0.65, 1.42, 3.0, 2.4, { fontSize: 31, bold: true, color: "FFFFFF" }); text(s, d.cover[2], 0.65, 4.35, 2.95, 1.0, { fontSize: 12.8, color: "D4DCDD" }); visual(s, d, 4.55, 0.85, 7.9, 5.8, 0); }
  else if (d.layout === "catalog" || d.layout === "folio") { label(s, d, "FREEAIPPT / RESEARCH SERIES", 0.8, 0.62); visual(s, d, 0.78, 1.2, 4.45, 5.55, 0); text(s, d.cover[1], 5.78, 1.45, 6.25, 1.8, { fontFace: "Georgia", fontSize: 35, bold: true, color: ink }); text(s, d.cover[2], 5.8, 3.72, 5.85, 0.85, { fontSize: 14, color: muted }); rect(s, 5.8, 5.34, 5.5, 0.58, d.soft, true); text(s, "8 EDITABLE SLIDES  ·  NATIVE SHAPES", 6.05, 5.56, 5, 0.14, { fontSize: 6.8, bold: true, color: d.dark, align: "center" }); }
  else if (d.layout === "gallery") { visual(s, d, 7.15, 0.58, 5.5, 6.35, 0); label(s, d, "FREEAIPPT / STUDIO EDITION", 0.72, 0.72); text(s, d.cover[1], 0.72, 1.65, 5.7, 1.72, { fontFace: "Georgia", fontSize: 35, bold: true, color: ink }); line(s, 0.72, 3.78, 4.7, 0, d.accent, 4); text(s, d.cover[2], 0.72, 4.18, 5.55, 0.88, { fontSize: 14, color: muted }); }
  else { label(s, d, d.layout === "chat" ? "FREEAIPPT / PROMPT LAB" : "FREEAIPPT / ORIGINAL SERIES", 0.72, 0.68); text(s, d.cover[1], 0.72, 1.45, 6.25, 1.75, { fontSize: 35, bold: true, color: ink }); text(s, d.cover[2], 0.74, 3.58, 5.9, 0.82, { fontSize: 14, color: muted }); visual(s, d, 7.42, 0.94, 5.15, 5.65, 0); rect(s, 0.74, 5.42, 5.4, 0.58, dark ? "292637" : d.soft, true); text(s, "8 EDITABLE SLIDES  ·  NATIVE SHAPES", 1.0, 5.64, 4.86, 0.14, { fontSize: 6.8, bold: true, color: dark ? d.accent : d.dark, align: "center" }); }
}

function content(p, d, item, n) {
  const [eyebrow, titleValue, body, stat = `${n + 1} signals`, caption = "editable framework"] = item; const dark = ["promptlab", "stack", "yearstrip"].includes(d.motif); const s = p.addSlide(); s.background = { color: dark ? d.dark : (n % 2 ? d.paper : "FFFFFF") }; const ink = dark ? "FFFFFF" : d.dark; const muted = dark ? "B8C4C7" : "63706F";
  if (d.layout === "sidebar") { rect(s, 0, 0, 2.1, 7.5, n % 2 ? d.accent : d.dark); text(s, String(n).padStart(2, "0"), 0.52, 0.72, 1.0, 0.55, { fontSize: 28, bold: true, color: "FFFFFF" }); label(s, d, eyebrow, 0.52, 1.48, "FFFFFF"); text(s, stat, 0.52, 5.54, 1.2, 0.45, { fontSize: 19, bold: true, color: "FFFFFF" }); text(s, caption, 0.52, 6.08, 1.15, 0.36, { fontSize: 6.4, color: "FFFFFF" }); text(s, titleValue, 2.68, 0.82, 9.6, 1.25, { fontSize: 29, bold: true, color: ink }); text(s, body, 2.7, 2.28, 8.8, 0.65, { fontSize: 12.5, color: muted }); visual(s, d, 2.72, 3.22, 8.9, 3.05, n); }
  else if (d.layout === "band") { label(s, d, `${String(n).padStart(2, "0")} / ${eyebrow}`, 0.68, 0.55); text(s, titleValue, 0.68, 1.02, 11.75, 1.0, { fontSize: 28, bold: true, color: ink }); rect(s, 0, 2.45, 13.333, 2.85, d.soft); visual(s, d, 0.7, 2.78, 7.1, 2.2, n); text(s, body, 8.3, 2.92, 4.25, 1.05, { fontSize: 12.3, color: d.dark }); text(s, stat, 8.3, 4.18, 2.0, 0.45, { fontSize: 22, bold: true, color: d.accent }); text(s, caption, 10.38, 4.38, 1.8, 0.16, { fontSize: 6.5, color: d.dark }); }
  else if (["map", "dashboard", "layers"].includes(d.layout)) { label(s, d, `${String(n).padStart(2, "0")} / ${eyebrow}`, 0.65, 0.5); text(s, titleValue, 0.65, 1.03, 12.0, 1.0, { fontSize: 28, bold: true, color: ink }); visual(s, d, 0.65, 2.25, 8.0, 4.2, n); text(s, body, 9.02, 2.42, 3.55, 1.05, { fontSize: 12.4, color: muted }); rect(s, 9.02, 4.2, 3.0, 1.25, dark ? "2B3942" : d.soft, true); text(s, stat, 9.28, 4.48, 2.45, 0.4, { fontSize: 22, bold: true, color: d.accent }); text(s, caption, 9.3, 5.02, 2.35, 0.18, { fontSize: 6.8, color: ink }); }
  else if (["catalog", "folio", "notes", "gallery"].includes(d.layout)) { const reverse = (n + d.slug.length) % 2 === 0; const vx = reverse ? 0.72 : 7.95; const tx = reverse ? 6.0 : 0.72; label(s, d, `${String(n).padStart(2, "0")} / ${eyebrow}`, tx, 0.56); text(s, titleValue, tx, 1.23, 6.35, 1.35, { fontFace: d.layout === "notes" ? "Aptos Display" : "Georgia", fontSize: 28, bold: true, color: ink }); text(s, body, tx, 2.92, 5.7, 0.92, { fontSize: 12.3, color: muted }); visual(s, d, vx, 1.05, 4.65, 5.6, n); line(s, tx, 4.25, 4.95, 0, d.accent, 2); text(s, stat, tx, 4.62, 2.2, 0.42, { fontSize: 21, bold: true, color: d.accent }); text(s, caption, tx, 5.14, 2.4, 0.18, { fontSize: 6.8, color: ink }); }
  else { label(s, d, `${String(n).padStart(2, "0")} / ${eyebrow}`, 0.72, 0.52); line(s, 0.72, 0.92, 11.88, 0, dark ? "3C4650" : "D4D0C6", 0.8); const reverse = n % 2 === 0; const vx = reverse ? 0.76 : 8.18; const tx = reverse ? 5.88 : 0.76; visual(s, d, vx, 1.3, 4.38, 4.95, n); text(s, titleValue, tx, 1.45, 6.45, 1.3, { fontSize: 28, bold: true, color: ink }); text(s, body, tx, 3.0, 6.0, 0.86, { fontSize: 12.5, color: muted }); rect(s, tx, 4.5, 2.55, 1.2, dark ? "292637" : d.soft, true); text(s, stat, tx + 0.22, 4.74, 2.1, 0.4, { fontSize: 21, bold: true, color: d.accent }); text(s, caption, tx + 0.23, 5.27, 2.0, 0.18, { fontSize: 6.7, color: ink }); }
  footer(s, d, n, ink);
}

await fs.mkdir(OUTPUT, { recursive: true });
for (const deck of decks) {
  const pptx = new pptxgen(); pptx.layout = "LAYOUT_WIDE"; pptx.author = "FreeAIPPT"; pptx.company = "FreeAIPPT"; pptx.subject = "Original editable PowerPoint template"; pptx.title = deck.shortName; pptx.lang = "en-US";
  pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-US" };
  cover(pptx, deck); deck.story.forEach((slide, index) => content(pptx, deck, slide, index + 1));
  await pptx.writeFile({ fileName: path.join(OUTPUT, `${deck.slug}.pptx`), compression: true });
}
console.log(`Generated ${decks.length} original templates for 2026-09-11 in ${OUTPUT}`);
