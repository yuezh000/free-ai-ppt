import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seeds = JSON.parse(await fs.readFile(path.join(root, "lib/template-seeds-2026-11-13.json"), "utf8"));
const requested = new Set(process.argv.slice(2));
const decks = seeds.filter((deck) => requested.size === 0 || requested.has(deck.slug));
if (requested.size && decks.length !== requested.size) throw Error("Unknown template slug");
const W = 13.333333;
const H = 7.5;

function box(slide, x, y, w, h, color, round = false) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error("Shape outside canvas");
  slide.addShape(round ? "roundRect" : "rect", { x, y, w, h, rectRadius: 0.09, line: { transparency: 100 }, fill: { color } });
}
function label(slide, value, x, y, w, h, size, color, bold = false, extra = {}) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > W + 0.01 || y + h > H + 0.01) throw Error(`Text outside canvas: ${value}`);
  slide.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, bold, margin: 0, valign: "mid", fit: "shrink", breakLine: false, ...extra });
}
function footer(slide, deck, page, inverse = false) {
  const ink = inverse ? deck.paper : deck.dark;
  box(slide, 0.72, 6.88, 11.88, 0.015, ink);
  label(slide, "FREEAIPPT / ORIGINAL RESEARCH DEFENSE", 0.72, 7.0, 3.35, 0.2, 7.4, ink, true);
  label(slide, "* ILLUSTRATIVE PLACEHOLDERS · REPLACE WITH VERIFIED RESEARCH", 4.1, 7.0, 6.5, 0.2, 7.4, ink);
  label(slide, `${String(page).padStart(2, "0")} / 08`, 11.72, 6.98, 0.85, 0.23, 9, ink, true, { align: "right" });
}
function cover(ppt, deck) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.dark };
  box(slide, 0, 0, 0.24, H, deck.accent);
  label(slide, deck.cover[0], 0.72, 0.66, 7.0, 0.36, 11, deck.paper, true, { charSpacing: 1.1 });
  label(slide, deck.cover[1], 0.72, 1.58, 8.0, 2.3, 50, deck.paper, true, { fontFace: "Aptos Display" });
  label(slide, deck.cover[2], 0.76, 4.58, 7.15, 0.78, 18, deck.paper);
  // The evidence spine is authored from native shapes on a blank canvas.
  box(slide, 9.34, 1.17, 0.07, 4.73, deck.paper);
  [["Q", 1.27], ["M", 2.78], ["E", 4.29]].forEach(([letter, y], i) => {
    box(slide, 8.87, y, 1.0, 1.0, i === 1 ? deck.second : deck.accent, true);
    label(slide, letter, 9.13, y + 0.21, 0.48, 0.48, 26, deck.paper, true, { align: "center" });
  });
  label(slide, "QUESTION", 10.11, 1.61, 2.1, 0.3, 14, deck.paper, true);
  label(slide, "METHOD", 10.11, 3.12, 2.1, 0.3, 14, deck.paper, true);
  label(slide, "EVIDENCE", 10.11, 4.63, 2.1, 0.3, 14, deck.paper, true);
  footer(slide, deck, 1, true);
}
function content(ppt, deck, item, index) {
  const slide = ppt.addSlide();
  slide.background = { color: deck.paper };
  box(slide, 0, 0, 0.24, H, deck.second);
  label(slide, item.eyebrow, 0.73, 0.49, 7.1, 0.34, 11, deck.second, true, { charSpacing: 1 });
  label(slide, item.title, 0.73, 1.02, 10.4, 0.92, 36, deck.dark, true, { fontFace: "Aptos Display" });
  label(slide, item.body, 0.76, 2.06, 11.1, 0.65, 17, deck.dark);
  // Alternate a broad annotation margin to give each page a deliberate rhythm.
  const odd = index % 2 === 1;
  const spineX = odd ? 10.77 : 2.55;
  box(slide, spineX, 3.13, 0.045, 2.93, deck.second);
  item.points.forEach(([heading, detail], i) => {
    const y = 3.18 + i * 0.92;
    const x = odd ? 0.77 : 3.14;
    const w = odd ? 9.5 : 9.2;
    box(slide, x, y, w, 0.75, i === 1 ? deck.soft : "F1E8DA", true);
    box(slide, x + 0.17, y + 0.15, 0.44, 0.44, i === 1 ? deck.second : deck.accent, true);
    label(slide, `${i + 1}`, x + 0.27, y + 0.21, 0.24, 0.30, 13, deck.paper, true, { align: "center" });
    label(slide, heading.toUpperCase(), x + 0.81, y + 0.13, 2.2, 0.42, 16, deck.dark, true);
    label(slide, detail, x + 3.03, y + 0.12, w - 3.25, 0.46, 15, deck.dark);
  });
  const badgeX = odd ? 11.0 : 0.78;
  box(slide, badgeX, 3.43, 1.63, 1.48, deck.dark, true);
  label(slide, item.stat, badgeX + 0.13, 3.82, 1.37, 0.45, 17, deck.paper, true, { align: "center" });
  label(slide, "PLACEHOLDER", badgeX + 0.12, 5.18, 1.4, 0.23, 8.3, deck.second, true, { align: "center" });
  footer(slide, deck, index + 2);
}

await fs.mkdir(path.join(root, "public/templates/files"), { recursive: true });
for (const deck of decks) {
  if (deck.story.length !== 7 || deck.story.some((s) => s.points.length !== 3 || !s.stat.endsWith("*"))) throw Error(`Invalid story: ${deck.slug}`);
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
