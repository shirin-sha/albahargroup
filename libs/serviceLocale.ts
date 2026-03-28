import type { Language } from '@/libs/language';
import type { Service } from '@/libs/models/service';

/**
 * Returns a copy of the service with display fields resolved for the current locale.
 * Arabic strings fall back to English when empty.
 */
export function resolveServiceFields<T extends Partial<Service>>(service: T, lang: Language): T {
  if (lang !== 'ar') return service;
  const titleAr = service.titleAr?.trim();
  const detailTitleAr = service.detailTitleAr?.trim();
  const descriptionAr = service.descriptionAr?.trim();
  const contentAr = service.contentAr?.trim();
  return {
    ...service,
    title: titleAr || service.title,
    detailTitle: detailTitleAr || service.detailTitle,
    description: descriptionAr || service.description,
    content: contentAr || service.content,
  };
}

export function serviceDisplayTitle(service: Partial<Service>, lang: Language): string {
  if (lang === 'ar' && service.detailTitleAr?.trim()) return service.detailTitleAr.trim();
  if (lang === 'ar' && service.titleAr?.trim()) return service.titleAr.trim();
  return service.detailTitle || service.title || '';
}
