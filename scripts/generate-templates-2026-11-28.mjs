
import fs from "node:fs/promises";
import PptxGenJS from "pptxgenjs";

const seeds = JSON.parse(await fs.readFile(new URL("../lib/template-seeds-2026-11-28.json", import.meta.url), "utf8"));
const output = new URL("../public/templates/files/", import.meta.url);
await fs.mkdir(output, { recursive: true });

function text(slide, value, x, y, w, h, fontSize, color, options = {}) {
  slide.addText(value, { x, y, w, h, fontFace: "Aptos", fontSize, color, margin: 0, valign: "mid", ...options });
}

function label(slide, value, x, y, w, color) {
  text(slide, value.toUpperCase(), x, y, w, 0.24, 10.5, color, { bold: true, charSpacing: 1.3 });
}

function shape(slide, type, x, y, w, h, color, line = null) {
  slide.addShape(type, { x, y, w, h, fill: { color }, line: line ? { color: line, width: 1.2 } : { transparency: 100 } });
}

function rect(slide, x, y, w, h, color) {
  shape(slide, "rect", x, y, w, h, color);
}

function copy(slide, info, x, y, w, ink, accent, size = 34) {
  label(slide, info.eyebrow, x, y, w, accent);
  text(slide, info.title, x, y + 0.36, w, 1.15, size, ink, { bold: true });
  text(slide, info.body, x, y + 1.61, w, 0.77, 16.5, ink);
}

function cover(slide, deck, x, y, w, ink, accent, size = 46) {
  label(slide, deck.cover[0], x, y, w, accent);
  text(slide, deck.cover[1], x, y + 0.55, w, 2.36, size, ink, { bold: true });
  text(slide, deck.cover[2], x, y + 3.13, w, 0.92, 17.5, ink);
}

function item(slide, [title, body], x, y, w, ink, accent, size = 21) {
  text(slide, title, x, y, w, 0.53, size, accent, { bold: true });
  text(slide, body, x, y + 0.59, w, 0.68, 15.5, ink);
}

function footer(slide, deck, page, color) {
  rect(slide, 0.65, 6.94, 12.03, 0.015, color);
  text(slide, "FREEAIPPT   /   " + deck.shortName, 0.65, 7.04, 5.72, 0.21, 9, color, { bold: true });
  text(slide, "EXAMPLE CONTENT   ·   * ILLUSTRATIVE VALUES", 6.51, 7.04, 4.91, 0.21, 9, color, { align: "right" });
  text(slide, String(page).padStart(2, "0") + " / 08", 11.66, 7.04, 1.02, 0.21, 10, color, { align: "right", bold: true });
}

function roastery(slide, deck, info, page) {
  const { paper, dark, soft, accent } = deck;
  if (!info) {
    cover(slide, deck, 0.69, 1.02, 6.15, dark, accent);
    rect(slide, 7.25, 0.75, 5.43, 5.8, dark);
    label(slide, "PRODUCTION BOARD", 7.56, 1.09, 4.8, soft);
    ["Reserve the slot", "Record the roast", "Release the lot"].forEach((step, i) => {
      const y = 1.62 + i * 1.57;
      rect(slide, 7.57, y, 4.76, 1.15, i === 1 ? "F3A579" : soft);
      rect(slide, 7.57, y, 0.16, 1.15, accent);
      text(slide, step, 7.88, y + 0.17, 4.13, 0.76, 24, dark, { bold: true });
    });
  } else {
    copy(slide, info, 0.69, 0.8, 5.63, dark, accent);
    rect(slide, 0.69, 4.18, 5.55, 1.92, dark);
    item(slide, info.points[0], 0.98, 4.5, 4.99, paper, soft, page === 4 ? 31 : 23);
    info.points.slice(1).forEach((point, i) => {
      const y = 1.57 + i * 2.31;
      rect(slide, 6.96, y, 5.72, 1.88, soft);
      rect(slide, 6.96, y, 0.12, 1.88, accent);
      item(slide, point, 7.28, y + 0.27, 5.09, dark, accent, page === 4 && i === 0 ? 27 : 22);
    });
  }
  footer(slide, deck, page, dark);
}

function practiceBars(slide, deck, x, y, scale) {
  const beats = [0.8, 1.32, 2.14, 1.48, 2.78, 1.83, 2.38, 1.23, 0.76];
  rect(slide, x, y + 1.44 * scale, 4.42 * scale, 0.015, "648369");
  beats.forEach((beat, index) => {
    const h = beat * scale;
    const barX = x + (0.18 + index * 0.47) * scale;
    rect(slide, barX, y + 1.44 * scale - h / 2, 0.23 * scale, h, index % 3 === 1 ? "87AA97" : deck.accent);
  });
}

function practice(slide, deck, info, page) {
  const { paper, dark, accent } = deck;
  slide.background = { color: dark };
  if (!info) {
    cover(slide, deck, 0.71, 1.03, 6.39, paper, accent, 49);
    practiceBars(slide, deck, 7.34, 1.31, 1.12);
    label(slide, "CUE   /   TAKE   /   REFLECT", 7.37, 4.88, 4.77, accent);
  } else {
    copy(slide, info, 0.71, 0.64, 8.44, paper, accent, 35);
    practiceBars(slide, deck, 9.75, 1.16, 0.61);
    info.points.forEach((point, i) => {
      const x = 0.7 + i * 4.16;
      const y = 3.8 + i * 0.24;
      const fills = ["263D31", "365243", accent];
      const ink = i === 2 ? dark : paper;
      rect(slide, x, y, 3.66, 1.83, fills[i]);
      rect(slide, x, y, 3.66, 0.055, accent);
      item(slide, point, x + 0.23, y + 0.24, 3.16, ink, i === 2 ? dark : accent, page === 4 ? 23 : 21);
    });
  }
  footer(slide, deck, page, paper);
}

function referral(slide, deck, info, page) {
  const { accent, dark, soft, paper } = deck;
  if (!info) {
    rect(slide, 0.65, 0.67, 12.03, 4.27, soft);
    cover(slide, deck, 1.02, 0.87, 10.96, dark, accent, 49);
    ["Invite", "Welcome", "First shift"].forEach((step, i) => {
      const x = 0.66 + i * 4.15;
      rect(slide, x, 5.19, 3.72, 1.25, i === 1 ? dark : accent);
      text(slide, step, x + 0.43, 5.36, 2.9, 0.88, 27, paper, { bold: true });
      shape(slide, "ellipse", x - 0.12, 5.66, 0.28, 0.28, paper);
    });
  } else {
    copy(slide, info, 0.7, 0.62, 11.9, dark, accent, 35);
    info.points.forEach(([title, body], i) => {
      const y = 3.19 + i * 1.08;
      rect(slide, 0.7, y, 11.97, 0.91, i === 2 ? dark : soft);
      rect(slide, 0.7, y, 3.92, 0.91, accent);
      shape(slide, "ellipse", 4.49, y + 0.31, 0.26, 0.26, paper);
      text(slide, title, 0.95, y + 0.12, 3.34, 0.67, page === 4 ? 23 : 20, paper, { bold: true });
      text(slide, body, 4.91, y + 0.1, 7.39, 0.69, 16, i === 2 ? paper : dark);
    });
  }
  footer(slide, deck, page, dark);
}

function ring(slide, deck, x, y, size, inner) {
  shape(slide, "ellipse", x, y, size, size, deck.soft, deck.accent);
  const inset = size * 0.19;
  shape(slide, "ellipse", x + inset, y + inset, size - inset * 2, size - inset * 2, inner);
  [[0.5, 0.09], [0.82, 0.7], [0.15, 0.68]].forEach(([dx, dy]) => {
    const marker = size * 0.105;
    shape(slide, "ellipse", x + dx * size - marker / 2, y + dy * size - marker / 2, marker, marker, deck.accent);
  });
}

function packaging(slide, deck, info, page) {
  const { accent, dark, paper, soft } = deck;
  if (!info) {
    slide.background = { color: dark };
    ring(slide, deck, 0.87, 0.98, 5.11, dark);
    text(slide, "RETURN\nLOOP", 1.82, 2.46, 3.22, 1.55, 28, paper, { align: "center", bold: true });
    cover(slide, deck, 6.73, 1.04, 5.76, paper, soft);
  } else {
    const panelInk = page === 4 ? dark : accent;
    const panelFill = page === 4 ? "ABD8DF" : soft;
    rect(slide, 0.66, 0.71, 5.52, 5.88, panelFill);
    copy(slide, info, 0.93, 1.11, 4.95, dark, panelInk, 31);
    ring(slide, deck, 2.49, 4.17, 1.78, panelFill);
    rect(slide, 7.19, 1.24, 0.033, 4.82, accent);
    info.points.forEach((point, i) => {
      const y = 1.34 + i * 1.73;
      shape(slide, "ellipse", 7.05, y + 0.13, 0.31, 0.31, accent);
      item(slide, point, 7.65, y, 4.91, dark, accent, page === 4 ? 25 : 22);
    });
  }
  footer(slide, deck, page, info ? dark : paper);
}

function winLoss(slide, deck, info, page) {
  const { accent, dark, paper, soft } = deck;
  if (!info) {
    const split = 8.68;
    rect(slide, split, 0, 13.33333 - split, 6.69, accent);
    cover(slide, deck, 0.75, 1.07, 7.48, dark, accent, 48);
    label(slide, "BUYER OUTCOMES", 9.04, 0.81, 3.75, paper);
    ["Won", "Lost", "Deferred"].forEach((entry, i) => {
      const y = 1.57 + i * 1.45;
      rect(slide, 9.04, y, 3.82, 0.021, soft);
      text(slide, entry, 9.04, y + 0.18, 3.66, 0.73, 27, paper, { bold: true });
    });
  } else {
    copy(slide, info, 0.69, 0.56, 12, dark, accent);
    info.points.slice(0, 2).forEach((point, i) => {
      const x = 0.69 + i * 6.17;
      rect(slide, x, 3.08, 5.83, 1.93, i === 0 ? soft : "EAE5F2");
      rect(slide, x, 3.08, 5.83, 0.045, accent);
      item(slide, point, x + 0.26, 3.34, 5.22, dark, accent, page === 4 ? 30 : 23);
    });
    const [title, body] = info.points[2];
    rect(slide, 0.69, 5.28, 12, 0.99, dark);
    text(slide, title, 0.95, 5.4, 3.54, 0.73, 20, paper, { bold: true });
    text(slide, body, 4.71, 5.4, 7.61, 0.73, 16, paper);
  }
  footer(slide, deck, page, dark);
}

function mechanism(slide, deck, x, y, type) {
  if (type === "contact") {
    rect(slide, x + 0.06, y + 0.07, 0.35, 0.55, "E77B62");
    rect(slide, x + 0.41, y + 0.07, 0.35, 0.55, "7F9BCC");
    shape(slide, "rightArrow", x + 0.27, y + 0.27, 0.31, 0.15, deck.dark);
  } else if (type === "motion") {
    shape(slide, "ellipse", x + 0.09, y + 0.02, 0.64, 0.64, deck.soft);
    shape(slide, "upArrow", x + 0.22, y + 0.17, 0.13, 0.34, deck.accent);
    shape(slide, "downArrow", x + 0.46, y + 0.17, 0.13, 0.34, "405E9F");
  } else {
    shape(slide, "ellipse", x + 0.04, y + 0.18, 0.33, 0.33, "DE6649");
    [0, 0.12, 0.24].forEach((offset) => {
      rect(slide, x + 0.47, y + 0.22 + offset, 0.28, 0.022, deck.accent);
    });
  }
}

function heat(slide, deck, info, page) {
  const { accent, dark, soft, paper } = deck;
  if (!info) {
    cover(slide, deck, 0.69, 0.96, 6.45, dark, accent, 53);
    rect(slide, 7.2, 0.78, 5.44, 5.76, soft);
    [["contact", "Contact"], ["motion", "Fluid motion"], ["waves", "Radiation"]].forEach(([type, title], i) => {
      const y = 1.36 + i * 1.5;
      rect(slide, 7.54, y, 4.72, 1.09, paper);
      mechanism(slide, deck, 7.73, y + 0.19, type);
      text(slide, title, 8.75, y + 0.12, 3.18, 0.84, 25, dark, { bold: true });
    });
  } else {
    copy(slide, info, 0.69, 0.65, 11.9, dark, accent, 36);
    if (page === 3 || page === 7) {
      info.points.forEach((point, i) => {
        const x = 0.69 + 4.08 * i;
        rect(slide, x, 3.22, 3.8, 2.93, soft);
        mechanism(slide, deck, x + 0.24, 3.53, ["contact", "motion", "waves"][i]);
        item(slide, point, x + 0.24, 4.38, 3.31, dark, accent);
      });
    } else {
      rect(slide, 0.69, 3.12, 12, 0.02, accent);
      info.points.forEach(([title, body], i) => {
        const y = 3.21 + i * 1.05;
        rect(slide, 0.69, y, 3.39, 0.87, i === 0 ? soft : "F3E6DB");
        text(slide, title, 0.88, y + 0.1, 3.04, 0.67, page === 4 ? 24 : 20, accent, { bold: true });
        text(slide, body, 4.39, y + 0.1, 8.05, 0.67, 16, dark);
        rect(slide, 4.39, y + 0.86, 8.28, 0.01, "DAB9AE");
      });
    }
  }
  footer(slide, deck, page, dark);
}

function drawBranch(slide, deck, x, y, labels) {
  const { dark, accent, soft } = deck;
  rect(slide, x, y + 1.18, 2.04, 0.045, soft);
  rect(slide, x + 2.04, y + 0.3, 0.045, 1.8, soft);
  [0.3, 2.055].forEach((offset) => rect(slide, x + 2.04, y + offset, 0.42, 0.045, soft));
  shape(slide, "diamond", x + 1.52, y + 0.74, 1.02, 0.92, "A7EDC2");
  rect(slide, x - 0.15, y + 0.9, 1.37, 0.62, accent);
  text(slide, labels[0], x - 0.1, y + 0.97, 1.27, 0.45, 14, deck.paper, { align: "center", bold: true });
  labels.slice(1).forEach((value, i) => {
    const yy = y + i * 1.75;
    rect(slide, x + 2.44, yy, 1.5, 0.67, soft);
    text(slide, value, x + 2.48, yy + 0.11, 1.42, 0.44, 14, dark, { align: "center", bold: true });
  });
}

function routing(slide, deck, info, page) {
  const { paper, accent, dark, soft } = deck;
  slide.background = { color: dark };
  if (!info) {
    cover(slide, deck, 0.68, 1.01, 6.66, paper, soft, 47);
    rect(slide, 7.65, 0.87, 5.03, 5.65, "22433E");
    label(slide, "DECISION PATH", 8.05, 1.33, 4.19, soft);
    drawBranch(slide, deck, 8.11, 2.56, ["Intake", "Route", "Review"]);
  } else if (page === 3 || page === 6) {
    rect(slide, 0.66, 0.72, 5.63, 5.91, "22433E");
    label(slide, page === 3 ? "DECISION PATH" : "PILOT GATE", 1.05, 1.19, 4.86, soft);
    drawBranch(slide, deck, 1.19, 2.65, page === 3 ? ["Suggest", "Route", "Review"] : ["Shadow", "Enable", "Hold"]);
    copy(slide, info, 6.71, 0.7, 5.91, paper, soft, 30);
    info.points.forEach(([title, body], i) => {
      const y = 3.41 + i * 0.97;
      rect(slide, 6.71, y, 5.96, 0.015, soft);
      text(slide, title, 6.72, y + 0.12, 1.78, 0.64, 17, "A7EDC2", { bold: true });
      text(slide, body, 8.64, y + 0.11, 4.01, 0.68, 14.5, paper);
    });
  } else {
    copy(slide, info, 0.71, 0.64, 11.9, paper, soft, 35);
    rect(slide, 1.25, 4.46, 10.21, 0.04, "A7EDC2");
    info.points.forEach((point, i) => {
      const x = 0.69 + i * 4.17;
      rect(slide, x, 3.61, 3.66, 2.2, i === 1 ? accent : "22433E");
      shape(slide, "diamond", x + 0.24, 3.91, 0.24, 0.24, "A7EDC2");
      item(slide, point, x + 0.27, 4.18, 3.12, paper, soft, page === 4 ? 21 : 20);
    });
  }
  footer(slide, deck, page, paper);
}

const layouts = {
  "coffee-roastery-business-plan": roastery,
  "music-practice-app-pitch-deck": practice,
  "volunteer-referral-marketing-plan": referral,
  "reusable-packaging-pilot-proposal": packaging,
  "buyer-win-loss-sales-report": winLoss,
  "heat-transfer-investigation-lesson": heat,
  "document-intake-routing-ai-brief": routing,
};

for (const deck of seeds) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "FreeAIPPT";
  pptx.title = deck.shortName;
  pptx.subject = deck.description;
  pptx.theme = { headFontFace: "Aptos", bodyFontFace: "Aptos", lang: "en-US" };
  const layout = layouts[deck.slug];
  for (const [index, info] of [null, ...deck.story].entries()) {
    const slide = pptx.addSlide();
    slide.background = { color: deck.paper };
    layout(slide, deck, info, index + 1);
  }
  await pptx.writeFile({ fileName: new URL(deck.slug + ".pptx", output).pathname });
}
