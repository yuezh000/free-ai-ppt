import seeds from "@/lib/template-seeds-2026-10-19-round-2.json";
import type { PptTemplate, TemplateSlide } from "@/lib/templates";

type Seed = Omit<PptTemplate, "slides"> & {
  cover: [string, string, string];
  story: Array<TemplateSlide & { points: Array<[string, string]> }>;
};

export const templates20261019Round2: PptTemplate[] = (seeds as unknown as Seed[]).map((seed) => ({
  ...seed,
  slides: [
    { eyebrow: seed.cover[0], title: seed.cover[1], body: seed.cover[2] },
    ...seed.story.map(({ eyebrow, title, body, stat }) => ({ eyebrow, title, body, stat })),
  ],
}));
