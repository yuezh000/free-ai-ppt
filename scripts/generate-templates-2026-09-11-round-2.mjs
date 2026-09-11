import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public", "templates", "files");
const decks = JSON.parse(await fs.readFile(path.join(ROOT, "lib", "template-seeds-2026-09-11-round-2.json"), "utf8"));
const noLine = { transparency: 100 };

const rect = (slide, x, y, w, h, color, radius = false, transparency = 0, lineColor = null, lineWidth = 0) =>
  slide.addShape(radius ? "roundRect" : "rect", { x, y, w, h, rectRadius: 0.05, line: lineColor ? { color: lineColor, width: lineWidth || 1 } : noLine, fill: { color, transparency } });
const circle = (slide, x, y, diameter, color, transparency = 0, lineColor = null, lineWidth = 0) =>
  slide.addShape("ellipse", { x, y, w: diameter, h: diameter, line: lineColor ? { color: lineColor, width: lineWidth || 1 } : noLine, fill: { color, transparency } });
const line = (slide, x, y, w, h, color, width = 1, dash = "solid") =>
  slide.addShape("line", { x, y, w, h, line: { color, width, dash } });
const text = (slide, value, x, y, w, h, options = {}) =>
  slide.addText(value, { x, y, w, h, margin: 0, fontFace: "Aptos", fontSize: 12, color: "222222", breakLine: false, fit: "shrink", ...options });
const tag = (slide, deck, value, x, y, color = deck.accent) =>
  text(slide, value, x, y, 5.8, 0.2, { fontSize: 7, bold: true, color, charSpacing: 1.4 });
const footer = (slide, number, color) => {
  text(slide, "FREEAIPPT / ORIGINAL EDITABLE TEMPLATE", 0.6, 7.08, 3.6, 0.16, { fontSize: 6.1, bold: true, color, charSpacing: 0.8 });
  text(slide, String(number).padStart(2, "0"), 12.05, 7.05, 0.55, 0.17, { fontSize: 7.2, bold: true, color, align: "right" });
};

function fieldLedger(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.paper, true, 0, d.dark, 1);
  text(slide, `FIELD LEDGER / S${String(n).padStart(2, "0")}`, x + 0.3, y + 0.24, w - 0.6, 0.16, { fontSize: 6.2, bold: true, color: d.dark, charSpacing: 1 });
  for (let row = 0; row < 4; row++) for (let col = 0; col < 6; col++) {
    const active = (row * 3 + col + n) % 5;
    rect(slide, x + 0.35 + col * (w - 0.7) / 6, y + 0.75 + row * (h - 1.25) / 4, (w - 1.0) / 6, (h - 1.55) / 4, active === 0 ? d.second : active === 1 ? d.third : d.soft, true, active > 1 ? 8 : 0);
    if ((row + col + n) % 4 === 0) circle(slide, x + 0.52 + col * (w - 0.7) / 6, y + 0.91 + row * (h - 1.25) / 4, 0.13, d.accent);
  }
  line(slide, x + 0.28, y + h - 0.34, w - 0.56, 0, d.accent, 2, "dash");
}

function harvest(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, "FFFFFF", false, 0, d.accent, 1.2);
  line(slide, x + w * 0.68, y + 0.12, 0, h - 0.24, d.dark, 1, "dash");
  rect(slide, x + 0.28, y + 0.3, w * 0.55, 0.52, d.dark, true);
  text(slide, `BATCH / ${String(410 + n)}`, x + 0.52, y + 0.5, w * 0.45, 0.13, { fontSize: 6.3, bold: true, color: "FFFFFF" });
  for (let row = 0; row < 4; row++) {
    rect(slide, x + 0.32, y + 1.08 + row * 0.72, w * 0.53, 0.52, row === n % 4 ? d.soft : d.paper, true);
    for (let col = 0; col < 4; col++) circle(slide, x + 0.52 + col * 0.48, y + 1.25 + row * 0.72, 0.18, [d.accent, d.second, d.third][(row + col) % 3]);
  }
  for (let i = 0; i < 14; i++) rect(slide, x + w * 0.73 + (i % 2) * 0.16, y + 0.42 + i * (h - 0.85) / 14, i % 3 ? 0.08 : 0.17, 0.18, i % 2 ? d.dark : d.accent);
}

function serviceWindow(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.dark, true);
  for (let i = 0; i < 8; i++) rect(slide, x + i * w / 8, y, w / 8 + 0.01, 0.62, i % 2 ? d.paper : d.second);
  rect(slide, x + 0.38, y + 1.0, w - 0.76, h - 1.68, d.paper, true, 0, d.accent, 1.2);
  rect(slide, x + 0.65, y + 1.38, w * 0.52, 0.48, d.accent, true);
  text(slide, `ORDER RAIL / ${n + 1}`, x + 0.85, y + 1.56, w * 0.42, 0.13, { fontSize: 6, bold: true, color: "FFFFFF" });
  for (let i = 0; i < 4; i++) {
    rect(slide, x + 0.66 + i * (w - 1.45) / 4, y + 2.23, (w - 1.8) / 4, 1.12, i === n % 4 ? d.soft : "FFFFFF", true, 0, i === n % 4 ? d.second : "C9D2D0", 0.8);
    circle(slide, x + 0.91 + i * (w - 1.45) / 4, y + 2.48, 0.34, [d.second, d.accent, d.third][i % 3]);
  }
  line(slide, x + 0.35, y + h - 0.48, w - 0.7, 0, d.second, 2);
}

function proofing(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.paper, true, 0, d.dark, 1);
  rect(slide, x + 0.25, y + 0.28, w - 0.5, h - 0.56, d.soft, true);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) {
    const size = 0.44 + ((row + col + n) % 3) * 0.08;
    circle(slide, x + 0.55 + col * (w - 1.1) / 4, y + 0.78 + row * (h - 1.45) / 3, size, (row + col) % 2 ? d.second : d.accent, 10 + row * 8, d.dark, 0.6);
  }
  circle(slide, x + w - 1.52, y + h - 1.32, 0.92, d.paper, 0, d.dark, 1.2);
  line(slide, x + w - 1.06, y + h - 0.86, 0.24, -0.23, d.accent, 2);
  text(slide, `BATCH ${String(n).padStart(2, "0")}`, x + 0.48, y + h - 0.45, 1.2, 0.12, { fontSize: 5.8, bold: true, color: d.dark });
}

function marketStall(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.dark, true);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    const bx = x + 0.42 + col * (w - 0.86) / 3;
    const by = y + 0.46 + row * (h - 0.95) / 3;
    rect(slide, bx, by, (w - 1.3) / 3, (h - 1.35) / 3, row * 3 + col === n % 9 ? d.paper : d.soft, true, row * 3 + col === n % 9 ? 0 : 12);
    for (let k = 0; k < 4; k++) circle(slide, bx + 0.18 + (k % 2) * 0.35, by + 0.2 + Math.floor(k / 2) * 0.34, 0.18, [d.accent, d.second, d.third][(k + col) % 3]);
  }
  line(slide, x + w * 0.5, y + 0.22, 0, h - 0.44, d.third, 1.4, "dash");
}

function dealRoom(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.dark, true);
  for (let i = 0; i < 4; i++) {
    rect(slide, x + 0.35 + i * 0.18, y + 0.5 + i * 0.82, w - 0.7 - i * 0.36, 0.62, i === n % 4 ? d.accent : "243C50", true, i === n % 4 ? 0 : 5, i === n % 4 ? d.third : "496173", 0.8);
    text(slide, ["FIT", "DISCOVERY", "PROOF", "DECISION"][i], x + 0.62 + i * 0.18, y + 0.73 + i * 0.82, 1.2, 0.13, { fontSize: 5.8, bold: true, color: i === n % 4 ? d.dark : "FFFFFF" });
  }
  circle(slide, x + w - 1.46, y + h - 1.34, 0.84, d.second, 70, d.second, 1.6);
  text(slide, "EVIDENCE", x + w - 1.35, y + h - 1.02, 0.62, 0.12, { fontSize: 5.4, bold: true, color: "FFFFFF", align: "center" });
}

function hydrology(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.paper, true, 0, d.second, 1);
  const nodes = [[0.5, 0.12], [0.78, 0.35], [0.72, 0.72], [0.28, 0.72], [0.18, 0.35]];
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]; const b = nodes[(i + 1) % nodes.length];
    line(slide, x + a[0] * w, y + a[1] * h, (b[0] - a[0]) * w, (b[1] - a[1]) * h, i === n % 5 ? d.accent : d.third, i === n % 5 ? 3 : 1.5, "dash");
    circle(slide, x + a[0] * w - 0.27, y + a[1] * h - 0.27, 0.54, i === 0 ? d.second : i === 1 ? d.soft : d.accent, i > 1 ? 15 : 0, d.dark, 0.8);
  }
  rect(slide, x + w * 0.32, y + h * 0.39, w * 0.36, h * 0.22, d.dark, true);
  text(slide, "ENERGY + GRAVITY", x + w * 0.36, y + h * 0.48, w * 0.28, 0.13, { fontSize: 6, bold: true, color: "FFFFFF", align: "center" });
}

function reviewDesk(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, "F2F8FA", false, 0, d.second, 1);
  for (let i = 1; i < 10; i++) line(slide, x + i * w / 10, y, 0, h, "C8DEE7", 0.45);
  for (let i = 1; i < 8; i++) line(slide, x, y + i * h / 8, w, 0, "C8DEE7", 0.45);
  rect(slide, x + 0.55, y + 0.65, w * 0.42, h * 0.56, "FFFFFF", false, 15, d.dark, 1.2);
  line(slide, x + 0.72, y + h * 0.62, w * 0.66, -h * 0.33, d.accent, 2.2);
  circle(slide, x + w * 0.69, y + h * 0.2, 0.62, d.third, 15, d.accent, 1.2);
  text(slide, `REV / ${String.fromCharCode(64 + ((n % 4) + 1))}`, x + w - 1.25, y + h - 0.48, 0.86, 0.13, { fontSize: 5.8, bold: true, color: d.dark, align: "center" });
}

function telemetry(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, "FFFFFF", true, 0, d.dark, 1);
  for (let i = 1; i < 12; i++) line(slide, x + i * w / 12, y + 0.35, 0, h - 0.7, "DCE7EA", 0.45);
  for (let i = 1; i < 8; i++) line(slide, x + 0.3, y + i * h / 8, w - 0.6, 0, "DCE7EA", 0.45);
  const points = [[0.06,0.55],[0.19,0.55],[0.25,0.46],[0.29,0.65],[0.34,0.2],[0.39,0.78],[0.45,0.55],[0.62,0.55],[0.69,0.48],[0.74,0.62],[0.79,0.3],[0.84,0.7],[0.91,0.55]];
  for (let i = 0; i < points.length - 1; i++) line(slide, x + points[i][0] * w, y + points[i][1] * h, (points[i + 1][0] - points[i][0]) * w, (points[i + 1][1] - points[i][1]) * h, d.accent, i === n % (points.length - 1) ? 3 : 1.8);
  rect(slide, x + 0.42, y + h - 0.82, w - 0.84, 0.38, d.soft, true);
  text(slide, "OBSERVE  /  INTERPRET  /  ESCALATE", x + 0.72, y + h - 0.68, w - 1.44, 0.12, { fontSize: 5.7, bold: true, color: d.dark, align: "center" });
}

function evaluation(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.dark, true, 0, "414764", 1);
  const colors = [d.accent, d.second, d.third, "5A6078"];
  for (let row = 0; row < 2; row++) for (let col = 0; col < 2; col++) {
    const i = row * 2 + col;
    rect(slide, x + 0.45 + col * 1.35, y + 0.55 + row * 1.35, 1.05, 1.05, colors[i], true, i === n % 4 ? 0 : 28);
    text(slide, `${72 + i * 7 + n}`, x + 0.45 + col * 1.35, y + 0.94 + row * 1.35, 1.05, 0.2, { fontSize: 13, bold: true, color: i === 3 ? "FFFFFF" : d.dark, align: "center" });
  }
  for (let i = 0; i < 5; i++) {
    text(slide, ["PREC", "RECALL", "CAL", "LAT", "COVER"][i], x + 3.55, y + 0.58 + i * 0.68, 0.72, 0.13, { fontSize: 5.7, bold: true, color: "FFFFFF" });
    rect(slide, x + 4.35, y + 0.58 + i * 0.68, Math.max(0.35, (w - 4.8) * (0.46 + ((i + n) % 4) * 0.12)), 0.22, i === n % 5 ? d.second : d.accent, true);
  }
}

function studio(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.dark, true);
  text(slide, `TAKE ${String(n + 1).padStart(2, "0")}`, x + 0.38, y + 0.35, 0.9, 0.14, { fontSize: 6, bold: true, color: d.third, charSpacing: 1 });
  for (let i = 0; i < 28; i++) {
    const bar = 0.18 + ((i * 7 + n * 3) % 9) * 0.09;
    rect(slide, x + 0.38 + i * (w - 0.76) / 28, y + 1.35 + (1.25 - bar) / 2, (w - 1.05) / 28, bar, i % 5 === 0 ? d.accent : d.second, true, i % 5 ? 25 : 0);
  }
  const tracks = ["VOICE", "RHYTHM", "TEXTURE", "SPACE"];
  tracks.forEach((track, i) => {
    rect(slide, x + 0.42, y + 3.0 + i * 0.52, w - 0.84, 0.32, i === n % 4 ? d.soft : "4B3653", true, i === n % 4 ? 0 : 5);
    text(slide, track, x + 0.66, y + 3.12 + i * 0.52, 0.72, 0.11, { fontSize: 5.4, bold: true, color: i === n % 4 ? d.dark : "FFFFFF" });
  });
}

function launchControl(slide, d, x, y, w, h, n) {
  rect(slide, x, y, w, h, d.dark, true);
  line(slide, x + 0.45, y + h * 0.52, w - 0.9, 0, d.soft, 2);
  const labels = ["T–12", "T–8", "T–4", "T–1", "T+1", "T+4"];
  labels.forEach((labelValue, i) => {
    const px = x + 0.48 + i * (w - 1.0) / 5;
    circle(slide, px - 0.14, y + h * 0.52 - 0.14, 0.28, i === n % 6 ? d.second : d.accent);
    text(slide, labelValue, px - 0.3, y + h * 0.52 + 0.28, 0.6, 0.12, { fontSize: 5.5, bold: true, color: "FFFFFF", align: "center" });
    if (i < 5) rect(slide, px + 0.12, y + 0.72 + (i % 2) * 0.55, (w - 1.4) / 5, 0.36, i % 2 ? d.third : d.accent, true, 12);
  });
  rect(slide, x + w - 1.68, y + h - 0.92, 1.18, 0.44, d.second, true);
  text(slide, "GO / HOLD", x + w - 1.5, y + h - 0.75, 0.82, 0.12, { fontSize: 5.8, bold: true, color: d.dark, align: "center" });
}

const motifFns = { fieldledger: fieldLedger, harvest, servicewindow: serviceWindow, proofing, marketstall: marketStall, dealroom: dealRoom, hydrology, reviewdesk: reviewDesk, telemetry, evaluation, studio, launchcontrol: launchControl };
const visual = (slide, deck, x, y, w, h, number) => motifFns[deck.motif](slide, deck, x, y, w, h, number);
const darkMotifs = new Set(["dealroom", "evaluation", "studio", "launchcontrol"]);

function addCover(presentation, deck) {
  const slide = presentation.addSlide();
  const dark = darkMotifs.has(deck.motif);
  slide.background = { color: dark ? deck.dark : deck.paper };
  const ink = dark ? "FFFFFF" : deck.dark;
  const muted = dark ? "C7CAD8" : "65716E";
  if (["cycle", "aisle"].includes(deck.layout)) {
    tag(slide, deck, "FREEAIPPT / ORIGINAL SERIES", 0.72, 0.62);
    text(slide, deck.cover[1], 0.72, 1.25, 5.25, 1.65, { fontSize: 34, bold: true, color: ink });
    text(slide, deck.cover[2], 0.74, 3.28, 5.2, 0.9, { fontSize: 13.5, color: muted });
    visual(slide, deck, 6.55, 0.72, 6.05, 6.0, 0);
  } else if (["blueprint", "rounds"].includes(deck.layout)) {
    visual(slide, deck, 0.65, 0.72, 5.25, 6.05, 0);
    tag(slide, deck, "FREEAIPPT / REVIEW EDITION", 6.35, 0.72);
    text(slide, deck.cover[1], 6.35, 1.45, 5.75, 1.85, { fontSize: 33, bold: true, color: ink });
    line(slide, 6.35, 3.65, 4.8, 0, deck.accent, 3);
    text(slide, deck.cover[2], 6.35, 4.02, 5.35, 1.0, { fontSize: 13.5, color: muted });
  } else if (["console", "setlist", "timeline"].includes(deck.layout)) {
    tag(slide, deck, "FREEAIPPT / CONTROL ROOM", 0.72, 0.62, deck.second);
    text(slide, deck.cover[1], 0.72, 1.3, 11.2, 1.25, { fontSize: 35, bold: true, color: ink });
    text(slide, deck.cover[2], 0.74, 2.82, 5.25, 0.92, { fontSize: 13.5, color: muted });
    visual(slide, deck, 6.45, 2.75, 6.15, 3.85, 0);
    rect(slide, 0.74, 5.3, 4.95, 0.58, "FFFFFF", true, 88, deck.accent, 0.8);
    text(slide, "8 EDITABLE SLIDES · NATIVE SHAPES", 1.0, 5.52, 4.42, 0.14, { fontSize: 6.7, bold: true, color: ink, align: "center" });
  } else {
    tag(slide, deck, "FREEAIPPT / ORIGINAL SERIES", 0.72, 0.65);
    text(slide, deck.cover[1], 0.72, 1.4, 5.8, 1.75, { fontSize: 34, bold: true, color: ink });
    text(slide, deck.cover[2], 0.74, 3.52, 5.55, 0.9, { fontSize: 13.5, color: muted });
    visual(slide, deck, 7.0, 0.8, 5.55, 5.95, 0);
    rect(slide, 0.74, 5.35, 5.15, 0.58, dark ? "FFFFFF" : deck.soft, true, dark ? 90 : 0);
    text(slide, "8 EDITABLE SLIDES · NATIVE SHAPES", 0.99, 5.57, 4.65, 0.14, { fontSize: 6.7, bold: true, color: ink, align: "center" });
  }
}

function addContent(presentation, deck, item, number) {
  const [eyebrow, titleValue, body, stat = `${number + 1} signals`, caption = "editable framework"] = item;
  const slide = presentation.addSlide();
  const dark = darkMotifs.has(deck.motif);
  slide.background = { color: dark ? deck.dark : number % 2 ? deck.paper : "FFFFFF" };
  const ink = dark ? "FFFFFF" : deck.dark;
  const muted = dark ? "C7CAD8" : "64716F";
  tag(slide, deck, `${String(number).padStart(2, "0")} / ${eyebrow}`, 0.68, 0.52, dark ? deck.second : deck.accent);
  line(slide, 0.68, 0.92, 11.95, 0, dark ? "48506A" : "D5D8D2", 0.8);

  const visualLeft = (number + deck.slug.length) % 2 === 0;
  if (["cycle", "blueprint", "rounds", "console", "timeline"].includes(deck.layout)) {
    text(slide, titleValue, 0.68, 1.14, 11.8, 0.95, { fontSize: 28, bold: true, color: ink });
    visual(slide, deck, 0.68, 2.35, 8.0, 4.05, number);
    text(slide, body, 9.0, 2.5, 3.5, 1.15, { fontSize: 12.2, color: muted });
    rect(slide, 9.0, 4.35, 3.0, 1.18, dark ? "FFFFFF" : deck.soft, true, dark ? 90 : 0);
    text(slide, stat, 9.25, 4.62, 2.5, 0.38, { fontSize: 21, bold: true, color: dark ? deck.second : deck.accent });
    text(slide, caption, 9.27, 5.13, 2.35, 0.16, { fontSize: 6.6, color: ink });
  } else {
    const vx = visualLeft ? 0.72 : 7.88;
    const tx = visualLeft ? 5.72 : 0.72;
    visual(slide, deck, vx, 1.25, 4.65, 5.35, number);
    text(slide, titleValue, tx, 1.38, 6.45, 1.3, { fontSize: 28, bold: true, color: ink });
    text(slide, body, tx, 2.98, 5.75, 0.95, { fontSize: 12.4, color: muted });
    line(slide, tx, 4.2, 4.75, 0, deck.accent, 2.2);
    text(slide, stat, tx, 4.58, 2.35, 0.42, { fontSize: 21, bold: true, color: dark ? deck.second : deck.accent });
    text(slide, caption, tx, 5.12, 2.45, 0.17, { fontSize: 6.6, color: ink });
  }
  footer(slide, number, ink);
}

await fs.mkdir(OUTPUT, { recursive: true });
for (const deck of decks) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "FreeAIPPT";
  pptx.company = "FreeAIPPT";
  pptx.subject = "Original editable PowerPoint template";
  pptx.title = deck.shortName;
  pptx.lang = "en-US";
  pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-US" };
  addCover(pptx, deck);
  deck.story.forEach((slide, index) => addContent(pptx, deck, slide, index + 1));
  await pptx.writeFile({ fileName: path.join(OUTPUT, `${deck.slug}.pptx`), compression: true });
}
console.log(`Generated ${decks.length} original templates for the second 2026-09-11 run in ${OUTPUT}`);
