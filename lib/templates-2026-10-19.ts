import seeds from "@/lib/template-seeds-2026-10-19.json";
import type { PptTemplate } from "@/lib/templates";

type Seed = Omit<PptTemplate, "slides"> & {
  cover: [string, string, string];
  story: Array<[string, string, string, string]>;
};

export const templates20261019: PptTemplate[] = (seeds as unknown as Seed[]).map((seed) => ({
  ...seed,
  slides: [
    { eyebrow: seed.cover[0], title: seed.cover[1], body: seed.cover[2] },
    ...seed.story.map(([eyebrow, title, body, stat]) => ({ eyebrow, title, body, stat })),
  ],
}));
