import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/templates/files");
const decks = JSON.parse(
  await fs.readFile(path.join(ROOT, "lib/template-seeds-2026-10-19.json"), "utf8"),
);
const noLine = { transparency: 100 };

function box(slide, x, y, w, h, color, options = {}) {
  slide.addShape(options.radius ? "roundRect" : "rect", {
    x, y, w, h,
    rectRadius: options.radius ?? 0,
    line: options.line ? { color: options.line, width: options.lineWidth ?? 1 } : noLine,
    fill: { color, transparency: options.transparency ?? 0 },
  });
}

function text(slide, value, x, y, w, h, options = {}) {
  slide.addText(value, {
    x, y, w, h,
    margin: 0,
    fontFace: "Aptos",
    fontSize: 12,
    color: "1D2528",
    fit: "shrink",
    breakLine: false,
    valign: "mid",
    ...options,
  });
}

function line(slide, x, y, w, h, color, width = 1, dash = "solid") {
  slide.addShape("line", { x, y, w, h, line: { color, width, dash } });
}

function dot(slide, x, y, size, color, lineColor = color) {
  slide.addShape("ellipse", {
    x, y, w: size, h: size,
    line: { color: lineColor, width: 1 },
    fill: { color },
  });
}

function label(slide, value, x, y, w, color) {
  text(slide, value, x, y, w, 0.18, {
    fontSize: 6.6,
    bold: true,
    color,
    charSpacing: 1.1,
  });
}

function footer(slide, index, color, start = 0.55) {
  text(slide, "FREEAIPPT · ORIGINAL EDITABLE TEMPLATE", start, 7.1, 4.3, 0.12, {
    fontSize: 5.6,
    bold: true,
    color,
    charSpacing: 0.7,
  });
  text(slide, String(index).padStart(2, "0"), 12.2, 7.08, 0.55, 0.14, {
    fontSize: 6.2,
    bold: true,
    color,
    align: "right",
  });
}

function inkFor(deck, dark = false) {
  return dark ? "FFFFFF" : deck.dark;
}

function drawVisual(slide, deck, x, y, w, h, step) {
  const colors = [deck.accent, deck.second, deck.third, deck.soft];
  switch (deck.style) {
    case "ledger": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark });
      box(slide, x, y, w, 0.38, deck.dark);
      for (let row = 0; row < 6; row += 1) {
        const yy = y + 0.68 + row * ((h - 0.92) / 6);
        line(slide, x + 0.28, yy, w - 0.56, 0, row === step % 6 ? deck.accent : "C8CDC8", row === step % 6 ? 2 : 0.6);
        text(slide, `${String(row + 1).padStart(2, "0")} / ${["ASSUMPTION", "SIGNAL", "OWNER", "COST", "GATE", "DATE"][row]}`, x + 0.3, yy - 0.18, 1.45, 0.13, { fontSize: 5.5, bold: true, color: deck.dark });
        for (let col = 0; col < 3; col += 1) box(slide, x + 1.85 + col * ((w - 2.15) / 3), yy - 0.21, (w - 2.5) / 3, 0.23, colors[(row + col + step) % 4], { transparency: col === 1 ? 55 : 15 });
      }
      return;
    }
    case "biofold": {
      box(slide, x, y, w, h, deck.dark);
      for (let i = 0; i < 5; i += 1) {
        const xx = x + 0.35 + i * ((w - 0.7) / 5);
        box(slide, xx, y + 0.35 + (i % 2) * 0.45, (w - 1.0) / 5, h - 0.9, colors[i % 3], { transparency: i === step % 5 ? 0 : 72, line: colors[i % 3] });
        dot(slide, xx + 0.18, y + h - 0.85 - (i % 2) * 0.45, 0.28, colors[(i + 1) % 3]);
      }
      line(slide, x + 0.5, y + h / 2, w - 1.0, 0, "FFFFFF", 0.8, "dash");
      return;
    }
    case "section": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark });
      line(slide, x + 0.4, y + 0.45, 0, h - 0.9, deck.accent, 2);
      line(slide, x + 0.4, y + h - 0.45, w - 0.8, 0, deck.dark, 1);
      for (let i = 0; i < 5; i += 1) {
        const yy = y + 0.65 + i * ((h - 1.35) / 5);
        const ww = w * (0.42 + ((i + step) % 4) * 0.12);
        box(slide, x + 0.75, yy, ww, 0.34, i === step % 5 ? deck.accent : deck.soft, { line: deck.dark });
        text(slide, `SECTION ${String.fromCharCode(65 + i)}`, x + 0.92, yy + 0.09, 1.0, 0.1, { fontSize: 5.3, bold: true, color: deck.dark });
      }
      for (let i = 0; i < 8; i += 1) line(slide, x + 0.75 + i * ((w - 1.5) / 8), y + 0.45, 0, h - 0.9, "D7D0C5", 0.45, "dash");
      return;
    }
    case "signaltiles": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark });
      const cells = [[0, 0, 2, 1], [2, 0, 1, 2], [0, 1, 1, 1], [1, 1, 1, 1], [0, 2, 2, 1], [2, 2, 1, 1]];
      cells.forEach(([cx, cy, cw, ch], i) => {
        const gap = 0.1;
        const unitW = (w - 0.6) / 3;
        const unitH = (h - 0.6) / 3;
        box(slide, x + 0.2 + cx * unitW, y + 0.2 + cy * unitH, cw * unitW - gap, ch * unitH - gap, colors[(i + step) % 3], { transparency: i === step % cells.length ? 0 : 18 });
        text(slide, ["OBSERVE", "FRAME", "TEST", "LEARN", "DECIDE", "REPEAT"][i], x + 0.35 + cx * unitW, y + 0.36 + cy * unitH, cw * unitW - 0.3, 0.18, { fontSize: 6.2, bold: true, color: i % 3 === 2 ? deck.dark : "FFFFFF" });
      });
      return;
    }
    case "bracketpath": {
      box(slide, x, y, w, h, "FFFFFF", { line: deck.dark });
      line(slide, x + w * 0.5, y + 0.45, 0, h - 0.9, deck.dark, 2);
      for (let i = 0; i < 5; i += 1) {
        const yy = y + 0.55 + i * ((h - 1.1) / 5);
        const left = i % 2 === 0;
        line(slide, left ? x + 0.55 : x + w * 0.5, yy + 0.18, w * 0.5 - 0.55, 0, colors[i % 3], 2);
        dot(slide, x + w * 0.5 - 0.11, yy + 0.07, 0.22, i === step % 5 ? deck.second : deck.dark);
        text(slide, `${i + 1}`, left ? x + 0.6 : x + w - 0.9, yy, 0.3, 0.22, { fontSize: 8, bold: true, color: deck.dark, align: "center" });
      }
      return;
    }
    case "prismchart": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark });
      line(slide, x + 0.45, y + h - 0.55, w - 0.9, 0, deck.dark, 1.4);
      line(slide, x + 0.45, y + 0.45, 0, h - 1.0, deck.dark, 1.4);
      const values = [0.48, 0.82, 0.6, 0.92, 0.7];
      values.forEach((value, i) => {
        const barH = (h - 1.35) * value;
        box(slide, x + 0.85 + i * ((w - 1.4) / 5), y + h - 0.56 - barH, (w - 2.0) / 5, barH, colors[(i + step) % 3], { transparency: i === step % 5 ? 0 : 20 });
        text(slide, `R${i + 1}`, x + 0.85 + i * ((w - 1.4) / 5), y + h - 0.42, (w - 2.0) / 5, 0.13, { fontSize: 5.4, bold: true, color: deck.dark, align: "center" });
      });
      line(slide, x + 0.65, y + h * 0.42, w - 1.1, -0.55, deck.dark, 2, "dash");
      return;
    }
    case "fieldnotes": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark });
      for (let i = 1; i < 8; i += 1) line(slide, x + (w / 8) * i, y, 0, h, "D8CFBC", 0.45);
      for (let i = 1; i < 6; i += 1) line(slide, x, y + (h / 6) * i, w, 0, "D8CFBC", 0.45);
      const points = [[0.18, 0.24], [0.4, 0.62], [0.62, 0.36], [0.78, 0.72], [0.88, 0.2]];
      points.forEach(([px, py], i) => {
        dot(slide, x + w * px, y + h * py, i === step % 5 ? 0.34 : 0.2, colors[i % 3]);
        if (i) line(slide, x + w * points[i - 1][0] + 0.1, y + h * points[i - 1][1] + 0.1, w * (px - points[i - 1][0]), h * (py - points[i - 1][1]), deck.dark, 0.8, "dash");
      });
      label(slide, "FIELD / OBSERVE · LOCATE · EXPLAIN", x + 0.3, y + h - 0.35, w - 0.6, deck.dark);
      return;
    }
    case "evidenceledger": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark });
      box(slide, x, y, 1.15, h, deck.dark);
      for (let i = 0; i < 5; i += 1) {
        const yy = y + 0.45 + i * ((h - 0.9) / 5);
        text(slide, `[${i + 1}]`, x + 0.25, yy, 0.55, 0.2, { fontSize: 8, bold: true, color: i === step % 5 ? deck.third : "FFFFFF" });
        line(slide, x + 1.45, yy + 0.12, w - 1.8, 0, "B9B5A9", 0.7);
        box(slide, x + 1.45, yy - 0.03, (w - 1.8) * (0.4 + ((i + step) % 4) * 0.13), 0.27, colors[i % 3], { transparency: 20 });
      }
      return;
    }
    case "triagelanes": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark });
      for (let i = 0; i < 4; i += 1) {
        const yy = y + 0.45 + i * ((h - 0.9) / 4);
        box(slide, x + 0.35, yy, w - 0.7, 0.62, i === step % 4 ? colors[i % 3] : deck.soft, { radius: 0.08, line: deck.dark, transparency: i === step % 4 ? 0 : 18 });
        dot(slide, x + 0.55 + ((i + step) % 4) * (w - 1.5) / 4, yy + 0.17, 0.27, i === step % 4 ? "FFFFFF" : colors[i % 3], deck.dark);
        text(slide, ["OBSERVE", "COMPARE", "ACT", "REVIEW"][i], x + w - 1.55, yy + 0.2, 0.95, 0.12, { fontSize: 5.7, bold: true, color: deck.dark, align: "right" });
      }
      return;
    }
    case "dataplane": {
      box(slide, x, y, w, h, step === 0 ? deck.dark : deck.paper, { line: deck.dark });
      const dark = step === 0;
      for (let i = 0; i < 5; i += 1) {
        const yy = y + 0.42 + i * ((h - 0.84) / 5);
        box(slide, x + 0.5 + (i % 2) * 0.38, yy, w - 1.0 - (i % 2) * 0.75, 0.46, colors[i % 3], { transparency: i === step % 5 ? 0 : dark ? 55 : 30, line: dark ? colors[i % 3] : deck.dark });
        text(slide, ["EXPERIENCE", "SERVE", "TRANSFORM", "STORE", "SOURCE"][i], x + 0.72, yy + 0.15, 1.2, 0.1, { fontSize: 5.2, bold: true, color: dark ? "FFFFFF" : deck.dark });
      }
      return;
    }
    case "chromablocks": {
      box(slide, x, y, w, h, deck.paper, { line: deck.dark, lineWidth: 2 });
      const blocks = [[0.05, 0.08, 0.42, 0.35], [0.5, 0.08, 0.45, 0.2], [0.5, 0.32, 0.22, 0.6], [0.75, 0.32, 0.2, 0.35], [0.05, 0.47, 0.42, 0.45], [0.75, 0.7, 0.2, 0.22]];
      blocks.forEach(([bx, by, bw, bh], i) => {
        box(slide, x + w * bx, y + h * by, w * bw, h * bh, colors[(i + step) % 3], { line: deck.dark, lineWidth: 1.4 });
        text(slide, String(i + 1).padStart(2, "0"), x + w * bx + 0.12, y + h * by + 0.1, 0.35, 0.18, { fontSize: 7, bold: true, color: i % 3 === 2 ? deck.dark : "FFFFFF" });
      });
      return;
    }
    case "runway": {
      box(slide, x, y, w, h, deck.dark);
      for (let lane = 0; lane < 3; lane += 1) {
        const xx = x + 0.65 + lane * ((w - 1.3) / 3);
        line(slide, xx, y + 0.45, 0, h - 0.9, lane === step % 3 ? deck.accent : "55585D", lane === step % 3 ? 3 : 1.1);
        text(slide, ["NOW", "NEXT", "LATER"][lane], xx + 0.14, y + 0.45, 0.65, 0.14, { fontSize: 5.8, bold: true, color: lane === step % 3 ? deck.accent : "B7BABD" });
        for (let m = 0; m < 3; m += 1) dot(slide, xx - 0.1, y + 1.25 + m * ((h - 2.0) / 3), 0.22, colors[(lane + m) % 3]);
      }
      line(slide, x + 0.4, y + h - 0.45, w - 0.8, 0, "777A7D", 0.7, "dash");
      return;
    }
    default:
      box(slide, x, y, w, h, deck.soft, { line: deck.dark });
  }
}

const darkStyles = new Set(["biofold", "runway"]);
const modeByStyle = {
  ledger: 0,
  biofold: 3,
  section: 1,
  signaltiles: 2,
  bracketpath: 0,
  prismchart: 2,
  fieldnotes: 1,
  evidenceledger: 0,
  triagelanes: 1,
  dataplane: 3,
  chromablocks: 2,
  runway: 3,
};

function cover(presentation, deck) {
  const slide = presentation.addSlide();
  const dark = darkStyles.has(deck.style) || deck.style === "dataplane";
  slide.background = { color: dark ? deck.dark : deck.paper };
  const ink = inkFor(deck, dark);
  const mode = modeByStyle[deck.style];
  if (mode === 3) {
    drawVisual(slide, deck, 0, 0, 13.333, 7.5, 0);
    box(slide, 0.65, 0.62, 5.55, 5.9, dark ? deck.dark : "FFFFFF", { transparency: dark ? 8 : 4, line: deck.accent, lineWidth: 1.3 });
    label(slide, deck.cover[0], 0.95, 0.98, 4.7, deck.accent);
    text(slide, deck.cover[1], 0.93, 1.52, 4.9, 2.05, { fontSize: 31, bold: true, color: ink, valign: "top" });
    text(slide, deck.cover[2], 0.95, 4.05, 4.55, 1.05, { fontSize: 11.4, color: dark ? "CFD8DF" : deck.dark, valign: "top" });
  } else if (mode === 2) {
    box(slide, 0, 0, 4.0, 7.5, deck.accent);
    label(slide, deck.cover[0], 0.65, 0.72, 3.0, mode === 2 ? deck.dark : deck.accent);
    text(slide, deck.cover[1], 0.65, 1.35, 3.0, 3.0, { fontSize: 29, bold: true, color: deck.dark, valign: "top" });
    text(slide, deck.cover[2], 0.65, 5.2, 2.95, 1.2, { fontSize: 10.5, color: deck.dark, valign: "top" });
    drawVisual(slide, deck, 4.55, 0.72, 8.05, 6.05, 0);
  } else {
    label(slide, deck.cover[0], 0.72, 0.65, 5.4, deck.accent);
    text(slide, deck.cover[1], 0.72, 1.32, 5.45, 1.85, { fontSize: 31.5, bold: true, color: ink, valign: "top" });
    text(slide, deck.cover[2], 0.74, 3.55, 5.2, 1.15, { fontSize: 11.3, color: dark ? "CED8DF" : deck.dark, valign: "top" });
    box(slide, 0.74, 5.48, 4.9, 0.5, deck.soft, { radius: 0.08 });
    text(slide, "8 EDITABLE SLIDES · NATIVE SHAPES", 0.98, 5.64, 4.4, 0.15, { fontSize: 6.2, bold: true, color: deck.dark, align: "center" });
    drawVisual(slide, deck, 6.65, 0.65, 5.95, 6.12, 0);
  }
}

function content(presentation, deck, item, index) {
  const [eyebrow, title, body, stat] = item;
  const mode = modeByStyle[deck.style];
  const dark = darkStyles.has(deck.style) || (deck.style === "dataplane" && index % 2 === 1);
  const slide = presentation.addSlide();
  slide.background = { color: dark ? deck.dark : index % 2 ? deck.paper : "FFFFFF" };
  const ink = inkFor(deck, dark);
  const muted = dark ? "CBD4DB" : "596268";

  if (mode === 0) {
    label(slide, eyebrow, 0.65, 0.48, 5.0, deck.accent);
    line(slide, 0.65, 0.88, 12.0, 0, dark ? "4C5A63" : "CFD3CE", 0.8);
    text(slide, title, 0.65, 1.12, 11.75, 0.82, { fontSize: 25.5, bold: true, color: ink, valign: "top" });
    drawVisual(slide, deck, 0.65, 2.2, 7.85, 4.35, index);
    text(slide, body, 8.95, 2.36, 3.5, 1.3, { fontSize: 11.6, color: muted, valign: "top" });
    box(slide, 8.95, 4.38, 3.12, 1.2, dark ? "FFFFFF" : deck.soft, { radius: 0.08 });
    text(slide, stat, 9.2, 4.62, 2.62, 0.36, { fontSize: 20, bold: true, color: dark ? deck.dark : deck.accent });
    label(slide, "ILLUSTRATIVE PLACEHOLDER", 9.2, 5.1, 2.5, dark ? deck.dark : deck.dark);
  } else if (mode === 1) {
    box(slide, 0, 0, 2.65, 7.5, dark ? deck.accent : deck.dark);
    label(slide, eyebrow, 0.45, 0.58, 1.75, dark ? deck.dark : deck.accent);
    text(slide, title, 0.43, 1.18, 1.82, 3.65, { fontSize: 15.5, bold: true, color: "FFFFFF", valign: "top" });
    text(slide, stat, 0.43, 5.65, 1.35, 0.45, { fontSize: 17, bold: true, color: deck.third });
    label(slide, "PLACEHOLDER", 0.45, 6.18, 1.25, "FFFFFF");
    text(slide, body, 3.12, 0.67, 9.25, 0.7, { fontSize: 11.5, color: muted, valign: "top" });
    drawVisual(slide, deck, 3.12, 1.63, 9.5, 5.2, index);
  } else if (mode === 2) {
    label(slide, eyebrow, 0.65, 0.46, 5.2, deck.accent);
    text(slide, stat, 0.65, 1.0, 3.2, 0.8, { fontSize: 37, bold: true, color: deck.accent });
    label(slide, "ILLUSTRATIVE PLACEHOLDER", 0.7, 1.8, 2.65, ink);
    text(slide, title, 4.3, 0.92, 8.1, 0.95, { fontSize: 25.5, bold: true, color: ink, valign: "top" });
    text(slide, body, 4.32, 1.95, 7.65, 0.64, { fontSize: 10.8, color: muted, valign: "top" });
    drawVisual(slide, deck, 0.65, 2.85, 11.98, 3.95, index);
  } else {
    drawVisual(slide, deck, 0, 0, 13.333, 7.5, index);
    box(slide, 0.62, 0.58, 5.75, 5.92, dark ? deck.dark : "FFFFFF", { transparency: dark ? 7 : 3, line: deck.accent, lineWidth: 1.2 });
    label(slide, eyebrow, 0.92, 0.92, 4.7, deck.accent);
    text(slide, title, 0.9, 1.38, 4.95, 1.9, { fontSize: 21.5, bold: true, color: ink, valign: "top" });
    text(slide, body, 0.92, 3.52, 4.65, 1.0, { fontSize: 10.8, color: muted, valign: "top" });
    text(slide, stat, 0.92, 5.05, 2.4, 0.42, { fontSize: 21, bold: true, color: deck.accent });
    label(slide, "ILLUSTRATIVE PLACEHOLDER", 0.94, 5.56, 2.55, ink);
  }
  const footerColor = deck.style === "dataplane" ? deck.dark : ink;
  footer(slide, index, footerColor, mode === 1 ? 3.12 : 0.55);
}

await fs.mkdir(OUT, { recursive: true });
for (const deck of decks) {
  if (deck.story.length !== 7) throw new Error(`${deck.slug} must contain exactly seven content slides`);
  const presentation = new pptxgen();
  presentation.layout = "LAYOUT_WIDE";
  presentation.author = "FreeAIPPT";
  presentation.company = "FreeAIPPT";
  presentation.subject = "Original editable PowerPoint template";
  presentation.title = deck.shortName;
  presentation.lang = "en-US";
  presentation.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "en-US" };
  cover(presentation, deck);
  deck.story.forEach((item, index) => content(presentation, deck, item, index + 1));
  await presentation.writeFile({
    fileName: path.join(OUT, `${deck.slug}.pptx`),
    compression: true,
  });
}

console.log(`Generated ${decks.length} original templates for 2026-10-19`);
