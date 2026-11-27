import fs from "node:fs/promises";
import pptxgen from "pptxgenjs";

const requested = new Set(process.argv.slice(2));
const seeds = JSON.parse(await fs.readFile(new URL("../lib/template-seeds-2026-11-27.json", import.meta.url), "utf8"));
const decks = seeds.filter(({ slug }) => requested.size === 0 || requested.has(slug));
if (requested.size && decks.length !== requested.size) throw new Error("Unknown template slug");
const output = new URL("../public/templates/files/", import.meta.url);
await fs.mkdir(output, { recursive: true });

function shape(slide, type, x, y, w, h, color, options = {}) {
  slide.addShape(type, { x, y, w, h, fill: { color }, line: { transparency: 100 }, ...options });
}

function rect(slide, x, y, w, h, color) {
  shape(slide, "rect", x, y, w, h, color);
}

function text(slide, value, x, y, w, h, size, color, extra = {}) {
  slide.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize: size, color, margin: 0, valign: "mid", ...extra });
}

function label(slide, value, x, y, w, color, extra = {}) {
  text(slide, value.toUpperCase(), x, y, w, 0.28, 11, color, { bold: true, charSpacing: 1.1, ...extra });
}

function heading(slide, deck, slideInfo, x, y, w, color = deck.dark) {
  text(slide, slideInfo.title, x, y, w, 1.34, 32, color, { bold: true });
  text(slide, slideInfo.body, x, y + 1.44, w, 0.7, 17, color);
}

function item(slide, point, x, y, w, titleColor, bodyColor, options = {}) {
  text(slide, point[0], x, y, w, 0.42, options.titleSize ?? 19, titleColor, { bold: true });
  text(slide, point[1], x, y + 0.52, w, options.height ?? 0.75, 15, bodyColor);
}

function footer(slide, deck, page, color) {
  label(slide, "FREEAIPPT  /  " + deck.shortName, 0.55, 7.02, 5.6, color, { fontSize: 8 });
  label(slide, "EXAMPLE CONTENT  ·  * ILLUSTRATIVE VALUES", 6.2, 7.02, 5.2, color, { fontSize: 8 });
  text(slide, String(page).padStart(2, "0") + " / 08", 11.65, 7.02, 1.1, 0.28, 10, color, { align: "right", bold: true });
}

function coverTitle(slide, deck, x, y, w, ink, accent) {
  label(slide, deck.cover[0], x, y, w, accent);
  text(slide, deck.cover[1], x, y + 0.6, w, 2.45, 43, ink, { bold: true });
  text(slide, deck.cover[2], x, y + 3.28, w, 0.8, 18, ink);
}

function porthole(slide, deck, x, y, diameter, fill, rim) {
  shape(slide, "ellipse", x, y, diameter, diameter, rim);
  const inset = diameter * 0.16;
  shape(slide, "ellipse", x + inset, y + inset, diameter - 2 * inset, diameter - 2 * inset, fill);
  rect(slide, x + diameter * 0.57, y + diameter * 0.44, diameter * 0.27, diameter * 0.1, deck.paper);
}

function laundromat(slide, deck, info, page) {
  slide.background = { color: deck.paper };
  rect(slide, 8.15, 0, 5.18, 6.75, deck.dark);
  if (!info) {
    coverTitle(slide, deck, 0.65, 1.02, 6.55, deck.dark, deck.accent);
    for (const [x, y] of [[8.8, 0.72], [10.77, 0.72], [8.8, 2.7], [10.77, 2.7]]) {
      porthole(slide, deck, x, y, 1.77, deck.accent, deck.soft);
    }
    label(slide, "WASH  /  DRY  /  RESET", 8.8, 5.02, 4, deck.paper);
  } else {
    label(slide, info.eyebrow, 0.65, 0.62, 6.75, deck.accent);
    heading(slide, deck, info, 0.65, 1.11, 6.7);
    const steps = page === 4 ? ["CAPACITY", "ASSUMPTIONS"] : ["OPERATING NOTES", "ACTION STEPS"];
    label(slide, steps[0], 0.68, 4.02, 6, deck.accent);
    rect(slide, 0.68, 4.42, 6.6, 1.6, deck.soft);
    item(slide, info.points[0], 0.95, 4.55, 6.05, deck.accent, deck.dark, { titleSize: page === 4 ? 30 : 20 });
    label(slide, steps[1], 8.63, 1.09, 4.05, deck.paper);
    info.points.slice(1).forEach((point, index) => {
      const y = 2 + index * 1.78;
      porthole(slide, deck, 8.65, y + 0.07, 0.48, deck.accent, deck.soft);
      item(slide, point, 9.39, y, 3.35, deck.paper, deck.paper);
    });
  }
  footer(slide, deck, page, deck.dark);
}

function enrollment(slide, deck, info, page) {
  slide.background = { color: deck.paper };
  if (!info) {
    shape(slide, "ellipse", 7.38, 0.65, 5.33, 5.33, deck.soft);
    shape(slide, "ellipse", 8.2, 1.47, 3.69, 3.69, deck.accent);
    shape(slide, "ellipse", 9.03, 2.3, 2.03, 2.03, deck.paper);
    rect(slide, 7.36, 3.58, 5.38, 2.45, deck.paper);
    for (const [index, step] of ["INQUIRY", "VISIT", "APPLY"].entries()) {
      const y = 3.63 + index * 0.64;
      rect(slide, 8.02 + index * 0.29, y, 4.08 - index * 0.58, 0.52, index === 1 ? deck.soft : deck.accent);
      label(slide, step, 8.16 + index * 0.29, y + 0.12, 3.1, index === 1 ? deck.accent : deck.paper);
    }
    coverTitle(slide, deck, 0.68, 0.97, 6.5, deck.dark, deck.accent);
  } else {
    label(slide, info.eyebrow, 0.7, 0.53, 11.7, deck.accent);
    text(slide, info.title, 0.7, 0.94, 11.95, 1.18, 34, deck.dark, { bold: true });
    text(slide, info.body, 0.73, 2.2, 11.75, 0.65, 17, deck.dark);
    info.points.forEach((point, index) => {
      const x = 0.74 + index * 4.06;
      const y = 3.76 - index * 0.25;
      const inverse = index === 2;
      const fill = inverse ? deck.accent : deck.soft;
      shape(slide, "ellipse", x, y - 0.34, 3.71, 1.25, fill);
      rect(slide, x, y + 0.27, 3.71, 2.16, fill);
      item(slide, point, x + 0.25, y + 0.62, 3.2, inverse ? deck.paper : deck.accent, inverse ? deck.paper : deck.dark,
        { titleSize: page === 4 && index === 0 ? 26 : 19, height: 0.95 });
    });
  }
  footer(slide, deck, page, deck.dark);
}

function succession(slide, deck, info, page) {
  slide.background = { color: deck.paper };
  if (!info) {
    rect(slide, 7.65, 0.7, 4.95, 5.8, deck.soft);
    rect(slide, 7.65, 3.6, 4.95, 2.9, deck.dark);
    shape(slide, "diamond", 9.1, 2.55, 2.05, 2.05, deck.accent);
    label(slide, "ROLE OWNER", 8.02, 1.13, 3.94, deck.dark);
    label(slide, "DESIGNATED BACKUP", 8.02, 5.76, 3.94, deck.paper);
    coverTitle(slide, deck, 0.66, 1.04, 6.65, deck.dark, deck.accent);
  } else {
    rect(slide, 0, 0, 13.33, 2.9, deck.dark);
    label(slide, info.eyebrow, 0.72, 0.51, 11.86, deck.soft);
    text(slide, info.title, 0.72, 0.91, 11.86, 0.94, 32, deck.paper, { bold: true });
    text(slide, info.body, 0.74, 1.97, 11.85, 0.64, 16, deck.paper);
    rect(slide, 1.18, 3.3, 0.045, 2.97, deck.accent);
    info.points.forEach((point, index) => {
      const y = 3.34 + index * 0.98;
      shape(slide, "diamond", 1.01, y + 0.17, 0.39, 0.39, deck.accent);
      label(slide, point[0], 1.72, y + 0.21, 3.04, deck.accent);
      rect(slide, 4.95, y, 7.55, 0.75, deck.soft);
      text(slide, point[1], 5.22, y + 0.13, 6.95, 0.48, 17, deck.dark);
    });
  }
  footer(slide, deck, page, deck.dark);
}

function grid(slide, deck, x, y, unit, columns, rows) {
  rect(slide, x, y, columns * unit, rows * unit, deck.paper);
  for (let column = 0; column <= columns; column++) {
    rect(slide, x + column * unit, y, 0.014, rows * unit, "829EC2");
  }
  for (let row = 0; row <= rows; row++) {
    rect(slide, x, y + row * unit, columns * unit, 0.014, "829EC2");
  }
}

function scaleDiagram(slide, deck, page, x, y, unit) {
  const distorted = page === 7;
  rect(slide, x, y, 6.2, 4.07, deck.dark);
  grid(slide, deck, x + 0.4, y + 0.58, unit, 12, 6);
  const referenceX = x + 0.4 + unit;
  const copyX = x + 0.4 + unit * 6;
  const baseY = y + 0.58 + unit;
  shape(slide, "rect", referenceX, baseY, unit * 2, unit, deck.soft, { line: { color: deck.accent, width: 2 } });
  shape(slide, "rect", copyX, baseY, unit * 4, unit * (distorted ? 3 : 2), deck.soft, { line: { color: deck.accent, width: 2 } });
  rect(slide, referenceX, baseY - 0.027, unit * 2, 0.05, "E67828");
  rect(slide, copyX, baseY - 0.027, unit * 4, 0.05, "E67828");
  label(slide, "ORIGINAL", x + 0.53, y + 3.5, 2.43, deck.paper);
  label(slide, distorted ? "STRETCHED COPY" : "COPY", x + 3.24, y + 3.5, 2.5, deck.paper);
}

function geometry(slide, deck, info, page) {
  slide.background = { color: deck.paper };
  if (!info) {
    scaleDiagram(slide, deck, page, 6.52, 1.36, 0.448);
    coverTitle(slide, deck, 0.66, 1.19, 5.53, deck.dark, deck.accent);
  } else if ([3, 4, 7].includes(page)) {
    label(slide, info.eyebrow, 0.64, 0.45, 11.9, deck.accent);
    text(slide, info.title, 0.64, 0.91, 11.95, 0.87, 31, deck.dark, { bold: true });
    text(slide, info.body, 0.65, 1.89, 11.78, 0.5, 15, deck.dark);
    scaleDiagram(slide, deck, page, 0.66, 2.63, 0.448);
    info.points.forEach((point, index) => {
      item(slide, point, 7.3, 2.7 + index * 1.25, 5.27, deck.accent, deck.dark, { height: 0.58 });
    });
  } else {
    label(slide, info.eyebrow, 0.68, 0.57, 6.34, deck.accent);
    heading(slide, deck, info, 0.68, 1.07, 6.25);
    if (page === 5 || page === 8) {
      label(slide, page === 5 ? "PRACTICE GRID" : "EXIT TICKET GRID", 0.68, 3.5, 6.25, deck.accent);
      grid(slide, deck, 0.69, 3.94, 0.33, 18, 7);
    }
    rect(slide, 7.35, 0.64, 5.33, 6.04, deck.dark);
    info.points.forEach((point, index) => {
      const y = 1.05 + index * 1.72;
      shape(slide, "rect", 7.72, y + 0.08, 0.31, 0.31, deck.dark, { line: { color: deck.soft, width: 1.1 } });
      item(slide, point, 8.27, y, 3.94, deck.paper, deck.paper, { height: 0.88 });
    });
  }
  footer(slide, deck, page, deck.dark);
}

function clinical(slide, deck, info, page) {
  slide.background = { color: deck.paper };
  rect(slide, 0, 0, 3.48, 6.76, deck.soft);
  if (!info) {
    shape(slide, "ellipse", 0.5, 0.91, 2.47, 2.47, deck.accent);
    shape(slide, "ellipse", 0.9, 1.31, 1.67, 1.67, deck.soft);
    shape(slide, "ellipse", 1.29, 1.7, 0.89, 0.89, deck.dark);
    label(slide, "CASE CONFERENCE", 0.5, 4.03, 2.63, deck.dark);
    text(slide, "Documentation\nReceipt\nFollow-up", 0.5, 4.44, 2.6, 1.35, 18, deck.dark);
    coverTitle(slide, deck, 4.1, 1.03, 8.06, deck.dark, deck.accent);
  } else {
    label(slide, info.eyebrow, 0.47, 0.66, 2.56, deck.accent, { fontSize: 10 });
    rect(slide, 0.47, 1.12, 2.52, 0.025, deck.accent);
    text(slide, info.points[0][0], 0.47, 1.38, 2.55, 0.94, page === 4 ? 27 : 22, deck.accent, { bold: true });
    text(slide, info.points[0][1], 0.47, 2.49, 2.55, 1.35, 16, deck.dark, { valign: "top" });
    heading(slide, deck, info, 4.1, 0.69, 8.46);
    info.points.slice(1).forEach((point, index) => {
      const y = 3.3 + index * 1.39;
      rect(slide, 4.13, y, 8.44, 0.023, deck.accent);
      item(slide, point, 4.16, y + 0.12, 8.2, deck.accent, deck.dark, { height: 0.47 });
    });
  }
  footer(slide, deck, page, deck.dark);
}

function beam(slide, deck, x, y, w, h, color, transparency = 0) {
  shape(slide, "triangle", x, y, w, h, color, { fill: { color, transparency } });
  shape(slide, "ellipse", x + w * 0.15, y + h - 0.13, w * 0.7, 0.22, deck.paper, { fill: { color: deck.paper, transparency: 51 } });
}

function lighting(slide, deck, info, page) {
  slide.background = { color: deck.dark };
  if (!info) {
    rect(slide, 7.31, 0.93, 5.39, 5.31, deck.soft);
    beam(slide, deck, 7.73, 1.52, 3.12, 3.89, deck.accent, 29);
    beam(slide, deck, 9.32, 2.78, 2.82, 2.62, deck.accent, 52);
    label(slide, "ENTRY  /  FOCUS  /  TRANSITION", 7.55, 5.68, 4.96, deck.paper, { align: "center" });
    coverTitle(slide, deck, 0.65, 1.2, 6.14, deck.paper, deck.accent);
  } else {
    label(slide, info.eyebrow, 0.68, 0.48, 12, deck.accent);
    text(slide, info.title, 0.68, 0.98, 11.88, 1.05, 34, deck.paper, { bold: true });
    text(slide, info.body, 0.69, 2.13, 11.8, 0.62, 17, deck.paper);
    rect(slide, 0.68, 3.06, 12.0, 3.55, deck.soft);
    info.points.forEach((point, index) => {
      const x = 0.96 + index * 4.0;
      if (page === 3) {
        beam(slide, deck, x + 0.58, 3.22, 2.43, 1.48, deck.accent, 29 + index * 12);
      } else {
        rect(slide, x + 0.04, 3.54 + index * 0.2, 3.28, 0.055, deck.accent);
        shape(slide, "ellipse", x + 0.05 + index * 1.08, 3.44 + index * 0.2, 0.26, 0.26, deck.accent);
      }
      item(slide, point, x + 0.04, page === 3 ? 4.89 : 4.4, 3.42, deck.accent, deck.paper, { height: 0.94 });
    });
  }
  footer(slide, deck, page, deck.paper);
}

const layouts = {
  "business-plan": laundromat,
  marketing: enrollment,
  "project-proposal": succession,
  education: geometry,
  medical: clinical,
  portfolio: lighting,
};

for (const deck of decks) {
  if (deck.story.length !== 7) throw new Error("Expected one cover and seven content slides: " + deck.slug);
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "FreeAIPPT";
  pptx.company = "FreeAIPPT";
  pptx.title = deck.name;
  pptx.subject = deck.category;
  pptx.theme = { headFontFace: "Aptos", bodyFontFace: "Aptos", lang: "en-US" };
  [null, ...deck.story].forEach((info, index) => layouts[deck.categorySlug](pptx.addSlide(), deck, info, index + 1));
  await pptx.writeFile({ fileName: new URL(deck.slug + ".pptx", output).pathname });
  console.log("Generated " + deck.slug + " with eight slides");
}
