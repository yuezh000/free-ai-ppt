import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seeds = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-11-10.json"), "utf8"));
const requested = new Set(process.argv.slice(2));
const decks = seeds.filter((deck) => requested.size === 0 || requested.has(deck.slug));
if (requested.size !== 0 && decks.length !== requested.size) throw Error("Unknown template slug");
const W = 13.333333;
const H = 7.5;

function rect(slide, x, y, w, h, color) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error("Shape outside canvas");
  slide.addShape("rect", { x, y, w, h, line: { transparency: 100 }, fill: { color } });
}
function line(slide, x, y, w, color, width = 1) {
  slide.addShape("line", { x, y, w, h: 0, line: { color, width } });
}
function text(slide, value, x, y, w, h, size, color, bold = false, extra = {}) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error(`Text outside canvas: ${value}`);
  slide.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, bold, margin: 0, breakLine: false, valign: "mid", fit: "shrink", ...extra });
}
function footer(slide, deck, number) {
  line(slide, 0.68, 6.91, 11.98, deck.dark, 0.7);
  text(slide, "FREEAIPPT · ORIGINAL & EDITABLE", 0.68, 7.04, 3.0, 0.19, 7, deck.dark, true);
  text(slide, "* ILLUSTRATIVE PLACEHOLDERS · REPLACE BEFORE USE", 3.75, 7.04, 6.5, 0.19, 7, deck.dark);
  text(slide, `${String(number).padStart(2, "0")} / 08`, 11.65, 7.01, 1.0, 0.22, 9, deck.dark, true, { align: "right" });
}
function cover(ppt, deck) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.paper };
  rect(slide, 0, 0, 0.22, 6.91, deck.accent);
  text(slide, deck.cover[0], 0.7, 0.75, 6.5, 0.25, 10, deck.accent, true, { charSpacing: 1.1 });
  text(slide, deck.cover[1], 0.7, 1.53, 7.1, 1.95, 45, deck.dark, true, { fontFace: "Aptos Display" });
  text(slide, deck.cover[2], 0.72, 4.07, 6.45, 1.2, 18, deck.dark);
  const widths = [3.85, 2.65, 3.12];
  const colors = [deck.accent, deck.second, deck.dark];
  widths.forEach((width, i) => {
    const y = 1.52 + i * 1.33;
    rect(slide, 8.18 + i * 0.18, y, width, 0.4, colors[i]);
    rect(slide, 8.18 + i * 0.18, y + 0.52, 0.18, 0.18, colors[i]);
    line(slide, 8.63 + i * 0.18, y + 0.61, 3.55 - i * 0.1, colors[i], 0.8);
  });
  text(slide, "BASE / SIGNAL / RESPONSE", 8.1, 6.1, 4.35, 0.25, 10, deck.dark, true, { align: "right", charSpacing: 1 });
  footer(slide, deck, 1);
}
function content(ppt, deck, item, index) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.paper };
  rect(slide, 0, 0, 0.22, 6.91, index % 2 ? deck.second : deck.accent);
  text(slide, item.eyebrow, 0.7, 0.54, 7.6, 0.26, 10, deck.accent, true, { charSpacing: 1.2 });
  text(slide, item.title, 0.7, 1.05, 9.55, 0.94, 34, deck.dark, true, { fontFace: "Aptos Display" });
  text(slide, item.body, 0.72, 2.16, 9.7, 0.52, 16, deck.dark);
  rect(slide, 10.45, 0.52, 2.18, 2.18, deck.soft);
  text(slide, item.stat, 10.67, 1.05, 1.75, 0.66, 25, deck.accent, true, { align: "center" });
  text(slide, "ILLUSTRATIVE", 10.67, 1.83, 1.75, 0.22, 8, deck.dark, true, { align: "center" });
  item.points.forEach(([heading, body], i) => {
    const y = 3.08 + i * 1.07;
    rect(slide, 0.7 + (i % 2) * 0.2, y, 0.16, 0.78, i === 1 ? deck.second : deck.accent);
    line(slide, 1.08, y + 0.82, 11.55, deck.dark, 0.55);
    text(slide, heading, 1.13, y + 0.06, 2.65, 0.42, 21, deck.dark, true);
    text(slide, body, 4.05, y + 0.04, 7.85, 0.55, 17, deck.dark);
    rect(slide, 12.1, y + 0.18, 0.25, 0.25, i === 1 ? deck.second : deck.accent);
  });
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
