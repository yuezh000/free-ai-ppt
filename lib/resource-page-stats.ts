import { locales } from "@/lib/i18n";
import { templateCategories, templates } from "@/lib/templates";

export type ResourcePageBreakdown = {
  key: "template-details" | "template-categories" | "template-collections" | "guides";
  label: string;
  primary: number;
  localized: number;
  indexed: number;
};

export type ResourcePageStats = {
  primaryResourcePages: number;
  localizedResourcePages: number;
  indexedResourceUrls: number;
  sitemapUrls: number;
  utilityUrls: number;
  templateCount: number;
  categoryCount: number;
  guideCount: number;
  languageCount: number;
  breakdown: ResourcePageBreakdown[];
};

export function getResourcePageStats(): ResourcePageStats {
  const languageCount = locales.length;
  const additionalLocaleCount = languageCount - 1;
  const templateCount = templates.length;
  const categoryCount = templateCategories.length;

  // /templates and the broader /templates/business landing page.
  const templateCollectionCount = 2;
  // /resources plus the two currently published English guides.
  const primaryGuideAndHubCount = 3;
  // The resource hub and slide-size guide are localized into every additional locale.
  const localizedGuideAndHubCount = 2 * additionalLocaleCount;

  const breakdown: ResourcePageBreakdown[] = [
    {
      key: "template-details",
      label: "Template detail pages",
      primary: templateCount,
      localized: templateCount * additionalLocaleCount,
      indexed: templateCount * languageCount,
    },
    {
      key: "template-categories",
      label: "Template category pages",
      primary: categoryCount,
      localized: categoryCount * additionalLocaleCount,
      indexed: categoryCount * languageCount,
    },
    {
      key: "template-collections",
      label: "Template collection pages",
      primary: templateCollectionCount,
      localized: templateCollectionCount * additionalLocaleCount,
      indexed: templateCollectionCount * languageCount,
    },
    {
      key: "guides",
      label: "Resource hub and guides",
      primary: primaryGuideAndHubCount,
      localized: localizedGuideAndHubCount,
      indexed: primaryGuideAndHubCount + localizedGuideAndHubCount,
    },
  ];

  const primaryResourcePages = breakdown.reduce((sum, item) => sum + item.primary, 0);
  const localizedResourcePages = breakdown.reduce((sum, item) => sum + item.localized, 0);
  const indexedResourceUrls = primaryResourcePages + localizedResourcePages;
  // Home and pricing are indexed for all supported languages but are not resource pages.
  const utilityUrls = 2 * languageCount;

  return {
    primaryResourcePages,
    localizedResourcePages,
    indexedResourceUrls,
    sitemapUrls: indexedResourceUrls + utilityUrls,
    utilityUrls,
    templateCount,
    categoryCount,
    guideCount: primaryGuideAndHubCount - 1,
    languageCount,
    breakdown,
  };
}
