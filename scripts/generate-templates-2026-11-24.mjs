import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seeds = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-11-24.json"), "utf8"));
const requested = new Set(process.argv.slice(2));
const decks = seeds.filter((deck) => !requested.size || requested.has(deck.slug));
if (requested.size && decks.length !== requested.size) throw Error("Unknown template slug");
const W = 13.333333;
const H = 7.5;

function box(slide, x, y, w, h, fill, line) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error("Shape outside canvas");
  slide.addShape("rect", { x, y, w, h, line: line ? { color: line, width: 1 } : { transparency: 100 }, fill: { color: fill } });
}
function label(slide, value, x, y, w, h, size, color, bold = false, extra = {}) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error(`Text outside canvas: ${value}`);
  slide.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, bold, margin: 0, valign: "mid", fit: "shrink", breakLine: false, ...extra });
}
function footer(slide, deck, page, inverted = false) {
  const color = inverted ? deck.paper : deck.dark;
  box(slide, 0.6, 6.82, 12.12, 0.016, color);
  label(slide, "FREEAIPPT / ORIGINAL FUNDING PROPOSAL", 0.6, 6.97, 4.4, 0.23, 8, color, true);
  label(slide, "* ILLUSTRATIVE SAMPLE DATA · REPLACE BEFORE USE", 5.0, 6.97, 6.7, 0.23, 8, color);
  label(slide, `${String(page).padStart(2, "0")} / 08`, 11.8, 6.96, 0.92, 0.25, 9, color, true, { align: "right" });
}
function cover(ppt, deck) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.dark };
  box(slide, 0.64, 0.65, 1.13, 0.1, deck.accent);
  label(slide, deck.cover[0], 0.65, 0.91, 7.4, 0.34, 11, deck.soft, true, { charSpacing: 1.1 });
  label(slide, deck.cover[1], 0.63, 1.7, 8.5, 2.3, 53, deck.paper, true, { fontFace: "Aptos Display" });
  label(slide, deck.cover[2], 0.67, 4.6, 7.65, 0.95, 19, deck.paper);
  // An original shelter-like open frame, formed entirely with editable rectangles.
  box(slide, 9.35, 1.24, 2.55, 0.3, deck.accent);
  box(slide, 9.35, 1.54, 0.3, 3.83, deck.accent);
  box(slide, 11.6, 1.54, 0.3, 3.83, deck.accent);
  box(slide, 9.63, 4.55, 1.98, 0.82, deck.soft);
  box(slide, 9.84, 2.36, 1.58, 0.11, deck.second);
  box(slide, 10.16, 2.79, 0.95, 0.11, deck.second);
  label(slide, "OPEN / WELCOME / REVIEW", 9.38, 5.64, 2.6, 0.27, 9, deck.soft, true, { align: "center" });
  footer(slide, deck, 1, true);
}
function content(ppt, deck, item, index) {
  const slide = ppt.addSlide();
  const inverse = index === 2 || index === 6;
  slide.background = { color: inverse ? deck.dark : deck.paper };
  const ink = inverse ? deck.paper : deck.dark;
  const muted = inverse ? deck.soft : deck.second;
  const panel = inverse ? "23445C" : "E7EBE7";
  box(slide, 0, 0, 0.26, H, index % 2 ? deck.second : deck.accent);
  label(slide, `PROPOSAL / ${item.eyebrow}`, 0.66, 0.49, 7.3, 0.31, 10, muted, true, { charSpacing: 1.1 });
  label(slide, item.title, 0.65, 1.0, 11.8, 0.92, 34, ink, true, { fontFace: "Aptos Display" });
  label(slide, item.body, 0.68, 2.05, 11.28, 0.67, 17, ink);
  // A large decision number and three independent horizontal evidence rows.
  box(slide, 0.68, 3.05, 2.4, 2.85, index % 2 ? deck.second : deck.accent);
  label(slide, item.stat, 0.88, 3.68, 1.98, 0.7, 26, "FFFFFF", true, { align: "center" });
  label(slide, "ILLUSTRATIVE", 0.86, 4.59, 2.0, 0.27, 9, "FFFFFF", true, { align: "center" });
  item.points.forEach(([heading, detail], i) => {
    const y = 3.05 + i * 0.95;
    box(slide, 3.31, y, 9.36, 0.77, panel);
    box(slide, 3.31, y, 0.10, 0.77, i === 1 ? deck.accent : deck.second);
    label(slide, heading.toUpperCase(), 3.64, y + 0.16, 2.1, 0.42, 13, ink, true);
    label(slide, detail, 5.59, y + 0.13, 6.72, 0.48, 14, ink);
  });
  footer(slide, deck, index + 2, inverse);
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
