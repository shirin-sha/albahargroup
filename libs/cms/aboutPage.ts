/** Title for About page hero / breadcrumb when CMS `pageHeader` is missing or empty. */
export function getAboutPageBannerTitle(
  pageHeader: { heading?: string; title?: string } | null | undefined,
  lang: 'en' | 'ar'
): string {
  const h = pageHeader?.heading?.trim() || pageHeader?.title?.trim();
  if (h) return h;
  return lang === 'ar' ? 'من نحن' : 'About Us';
}
