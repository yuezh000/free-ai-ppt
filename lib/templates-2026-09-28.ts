import seeds from "@/lib/template-seeds-2026-09-28.json";
import type { PptTemplate } from "@/lib/templates";
type Seed = Omit<PptTemplate,"slides"> & { cover:[string,string,string]; story:Array<[string,string,string,string]> };
export const templates20260928: PptTemplate[] = (seeds as unknown as Seed[]).map((s) => ({...s, categorySlug: s.categorySlug === "technology" ? "artificial-intelligence" : s.categorySlug, slides:[{eyebrow:s.cover[0],title:s.cover[1],body:s.cover[2]},...s.story.map(([eyebrow,title,body,stat])=>({eyebrow,title,body,stat}))]}));
