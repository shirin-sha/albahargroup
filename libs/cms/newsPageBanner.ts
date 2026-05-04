import { getCmsSectionsCached } from '@/libs/cms/pageSections';
import { CacheTags } from '@/libs/cacheTags';

const BANNER_TITLE_FALLBACK: Record<'en' | 'ar', string> = {
  en: 'News & Updates',
  ar: 'الأخبار والتحديثات',
};

/**
 * Banner title from News Page CMS (`sectionId: banner`), same source as `/news` and `/ar/news` listing pages.
 */
export async function getNewsCmsBannerTitle(lang: 'en' | 'ar'): Promise<string> {
  try {
    const getSections = getCmsSectionsCached({
      collectionName: 'newsPageSections',
      cacheKey: 'cms-news',
      tag: CacheTags.cms.news,
    });
    const sections = await getSections();
    const banner = sections.find((s) => s.sectionId === 'banner');
    const raw = banner?.[lang]?.title;
    if (typeof raw === 'string' && raw.trim()) return raw.trim();
  } catch {
    // CMS/DB unavailable at build or request time
  }
  return BANNER_TITLE_FALLBACK[lang];
}
