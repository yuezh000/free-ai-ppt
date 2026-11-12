import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seeds = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-11-12.json"), "utf8"));
const requested = new Set(process.argv.slice(2));
const decks = seeds.filter((deck) => requested.size === 0 || requested.has(deck.slug));
if (requested.size && decks.length !== requested.size) throw Error("Unknown template slug");
const W = 13.333333;
const H = 7.5;

function shape(slide, x, y, w, h, color, radius = false) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error("Shape outside canvas");
  slide.addShape(radius ? "roundRect" : "rect", { x, y, w, h, rectRadius: 0.1, line: { transparency: 100 }, fill: { color } });
}
function text(slide, value, x, y, w, h, size, color, bold = false, extra = {}) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error(`Text outside canvas: ${value}`);
  slide.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, bold, margin: 0, valign: "mid", fit: "shrink", breakLine: false, ...extra });
}
function footer(slide, deck, number, light = false) {
  const color = light ? deck.paper : deck.dark;
  shape(slide, 0.7, 6.88, 11.93, 0.012, color);
  text(slide, "FREEAIPPT  /  ORIGINAL LESSON", 0.7, 7.02, 3.2, 0.18, 7.5, color, true);
  text(slide, "* ILLUSTRATIVE PLACEHOLDERS · REPLACE BEFORE USE", 4.0, 7.02, 5.8, 0.18, 7.5, color);
  text(slide, `${String(number).padStart(2, "0")} / 08`, 11.8, 7.0, 0.8, 0.2, 9, color, true, { align: "right" });
}
function cover(ppt, deck) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.dark };
  shape(slide, 0, 0, 0.28, 7.5, deck.accent);
  text(slide, deck.cover[0], 0.75, 0.74, 6.6, 0.3, 11, deck.accent, true, { charSpacing: 1.0 });
  text(slide, deck.cover[1], 0.75, 1.62, 7.2, 1.9, 53, deck.paper, true, { fontFace: "Aptos Display" });
  text(slide, deck.cover[2], 0.77, 4.02, 6.9, 1.0, 19, deck.paper);
  // An original claim ledger: editable offset strips, with no sourced artwork.
  shape(slide, 8.15, 1.20, 3.90, 0.85, deck.accent, true);
  shape(slide, 8.55, 2.31, 3.90, 0.85, deck.paper, true);
  shape(slide, 7.90, 3.42, 3.90, 0.85, deck.second, true);
  text(slide, "01  CLAIM", 8.45, 1.43, 2.7, 0.35, 17, deck.dark, true);
  text(slide, "02  TRACE", 8.86, 2.54, 2.7, 0.35, 17, deck.dark, true);
  text(slide, "03  DECIDE", 8.22, 3.65, 2.7, 0.35, 17, deck.paper, true);
  footer(slide, deck, 1, true);
}
function content(ppt, deck, item, index) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.paper };
  shape(slide, 0, 0, 0.28, 7.5, deck.accent);
  text(slide, item.eyebrow, 0.75, 0.46, 7.5, 0.3, 11, deck.second, true, { charSpacing: 1.1 });
  text(slide, item.title, 0.75, 1.03, 10.8, 1.05, 36, deck.dark, true, { fontFace: "Aptos Display" });
  text(slide, item.body, 0.78, 2.20, 10.7, 0.56, 17, deck.dark);
  shape(slide, 0.76, 3.12, 11.85, 3.22, deck.soft, true);
  item.points.forEach(([label, detail], i) => {
    const y = 3.39 + i * 0.9;
    shape(slide, 1.05, y + 0.06, 0.49, 0.49, i === 1 ? deck.second : deck.accent, true);
    text(slide, `${i + 1}`, 1.17, y + 0.12, 0.25, 0.35, 15, i === 1 ? deck.paper : deck.dark, true, { align: "center" });
    text(slide, label.toUpperCase(), 1.78, y + 0.02, 2.45, 0.56, 20, deck.dark, true);
    text(slide, detail, 4.30, y + 0.03, 7.73, 0.54, 16, deck.dark);
    if (i < 2) shape(slide, 1.08, y + 0.75, 11.2, 0.012, deck.dark);
  });
  shape(slide, 10.56, 0.42, 2.05, 0.48, deck.dark, true);
  text(slide, item.stat, 10.69, 0.53, 1.78, 0.25, 12, deck.paper, true, { align: "center" });
  footer(slide, deck, index + 2);
}
await fs.mkdir(path.join(root, "public/templates/files"), { recursive: true });
for (const deck of decks) {
  if (deck.story.length !== 7 || deck.story.some((item) => item.points.length !== 3 || !item.stat.endsWith("*"))) throw Error(`Invalid story: ${deck.slug}`);
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
