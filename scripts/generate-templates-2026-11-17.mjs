import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seeds = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-11-17.json"), "utf8"));
const requested = new Set(process.argv.slice(2));
const decks = seeds.filter((deck) => !requested.size || requested.has(deck.slug));
if (requested.size && decks.length !== requested.size) throw Error("Unknown template slug");
const W = 13.333333;
const H = 7.5;

function rect(slide, x, y, w, h, color, radius = false) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error("Shape outside canvas");
  slide.addShape(radius ? "roundRect" : "rect", { x, y, w, h, rectRadius: 0.08, line: { transparency: 100 }, fill: { color } });
}
function txt(slide, value, x, y, w, h, size, color, bold = false, extra = {}) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error(`Text outside canvas: ${value}`);
  slide.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, bold, margin: 0, valign: "mid", fit: "shrink", breakLine: false, ...extra });
}
function footer(slide, deck, page, inverse = false) {
  const ink = inverse ? deck.paper : deck.dark;
  rect(slide, 0.65, 6.88, 12.04, 0.018, ink);
  txt(slide, "FREEAIPPT / ORIGINAL ACTIVATION ROADMAP", 0.65, 7.0, 4.0, 0.21, 8, ink, true);
  txt(slide, "* ILLUSTRATIVE PLACEHOLDERS · VERIFY BEFORE PRESENTING", 4.55, 7.0, 6.7, 0.21, 8, ink);
  txt(slide, `${String(page).padStart(2, "0")} / 08`, 11.8, 6.98, 0.88, 0.24, 9, ink, true, { align: "right" });
}
function cover(ppt, deck) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.dark };
  rect(slide, 0, 0, 0.18, H, deck.accent);
  txt(slide, deck.cover[0], 0.68, 0.69, 7.8, 0.34, 11, deck.soft, true, { charSpacing: 1.2 });
  txt(slide, deck.cover[1], 0.67, 1.66, 7.65, 2.23, 50, deck.paper, true, { fontFace: "Aptos Display" });
  txt(slide, deck.cover[2], 0.70, 4.65, 7.25, 0.86, 19, deck.paper);
  // A stepped activation column, assembled from editable native shapes.
  [
    [8.67, 4.25, 1.15, 1.55, deck.accent, "ENTRY"],
    [9.80, 3.49, 1.15, 2.31, deck.second, "SETUP"],
    [10.93, 2.73, 1.15, 3.07, deck.soft, "VALUE"],
  ].forEach(([x, y, w, h, color, label]) => {
    rect(slide, x, y, w, h, color);
    txt(slide, label, x + 0.10, y + 0.28, w - 0.2, 0.45, 11, color === deck.soft ? deck.dark : deck.paper, true, { rotate: 270, align: "center" });
  });
  footer(slide, deck, 1, true);
}
function content(ppt, deck, item, index) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.paper };
  const reversed = index % 2 === 1;
  rect(slide, 0, 0, 0.18, H, reversed ? deck.second : deck.accent);
  txt(slide, `ROADMAP / ${item.eyebrow}`, 0.68, 0.51, 8.8, 0.32, 11, deck.second, true, { charSpacing: 1 });
  txt(slide, item.title, 0.68, 1.07, 11.55, 0.91, 35, deck.dark, true, { fontFace: "Aptos Display" });
  txt(slide, item.body, 0.71, 2.12, 11.55, 0.73, 17, deck.dark);
  const baseX = reversed ? 0.71 : 3.13;
  const badgeX = reversed ? 10.83 : 0.72;
  rect(slide, badgeX, 3.38, 1.72, 1.76, deck.dark, true);
  txt(slide, item.stat, badgeX + 0.15, 3.75, 1.42, 0.63, 20, deck.paper, true, { align: "center" });
  txt(slide, "ILLUSTRATIVE", badgeX + 0.13, 4.54, 1.46, 0.29, 8.5, deck.soft, true, { align: "center" });
  item.points.forEach(([heading, detail], i) => {
    const y = 3.2 + i * 0.99;
    const x = baseX + i * 0.26;
    const w = 8.75 - i * 0.26;
    rect(slide, x, y, w, 0.83, i === 1 ? deck.soft : "EDE5D8", true);
    rect(slide, x, y, 0.15, 0.83, i === 1 ? deck.second : deck.accent);
    txt(slide, heading.toUpperCase(), x + 0.36, y + 0.17, 2.25, 0.45, 14, deck.dark, true);
    txt(slide, detail, x + 2.62, y + 0.13, w - 2.83, 0.53, 15, deck.dark);
  });
  footer(slide, deck, index + 2);
}

await fs.mkdir(path.join(root, "public/templates/files"), { recursive: true });
for (const deck of decks) {
  if (deck.story.length !== 7 || deck.story.some((item) => item.points.length !== 3 || !item.stat.endsWith("*"))) throw Error(`Invalid deck: ${deck.slug}`);
  const ppt = new pptxgen();
  ppt.layout = "LAYOUT_WIDE";
  ppt.author = "FreeAIPPT";
  ppt.company = "FreeAIPPT";
  ppt.title = deck.name;
  ppt.subject = deck.description;
  ppt.lang = "en-US";
  ppt.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-US" };
  cover(ppt, deck);
  deck.story.forEach((item, index) => content(ppt, deck, item, index));
  await ppt.writeFile({ fileName: path.join(root, "public/templates/files", `${deck.slug}.pptx`) });
  console.log(`Generated ${deck.slug}: eight editable slides`);
}
