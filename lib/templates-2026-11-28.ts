import seeds from "@/lib/template-seeds-2026-11-28.json";
import type { PptTemplate } from "@/lib/templates";

export const templates20261128: PptTemplate[] = seeds.map(({ cover, story, ...template }) => ({
  ...template,
  slides: [
    { eyebrow: cover[0], title: cover[1], body: cover[2] },
    ...story.map(({ eyebrow, title, body, stat }) => ({ eyebrow, title, body, stat })),
  ],
}));
