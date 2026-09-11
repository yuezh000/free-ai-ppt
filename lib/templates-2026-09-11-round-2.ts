import seeds from "@/lib/template-seeds-2026-09-11-round-2.json";
import type { PptTemplate, TemplateSlide } from "@/lib/templates";

type TemplateSeed = Omit<PptTemplate, "slides"> & {
  cover: [string, string, string];
  story: Array<[string, string, string, string?, string?]>;
  second: string;
  third: string;
  paper: string;
  motif: string;
  layout: string;
};

export const templates20260911Round2: PptTemplate[] = (seeds as TemplateSeed[]).map((seed) => {
  const slides: TemplateSlide[] = [
    { eyebrow: seed.cover[0], title: seed.cover[1], body: seed.cover[2] },
    ...seed.story.map(([eyebrow, title, body, stat]) => ({ eyebrow, title, body, stat })),
  ];
  return {
    slug: seed.slug,
    name: seed.name,
    shortName: seed.shortName,
    category: seed.category,
    categorySlug: seed.categorySlug,
    description: seed.description,
    longDescription: seed.longDescription,
    accent: seed.accent,
    dark: seed.dark,
    soft: seed.soft,
    tags: seed.tags,
    slides,
    included: seed.included,
    bestFor: seed.bestFor,
  };
});
