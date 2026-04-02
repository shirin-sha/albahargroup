import type { ImageProps } from '@/types/image';
import type { SectionProps } from '@/types/sectionProps';

/** Extract Google Maps iframe src from embed HTML or use a bare https URL. */
export function resolveMapIframeSrc(mapEmbed: string | undefined | null): string | null {
  if (!mapEmbed?.trim()) return null;
  const t = mapEmbed.trim();
  const iframeMatch = t.match(/src\s*=\s*["']([^"']+)["']/i);
  if (iframeMatch?.[1]) return iframeMatch[1];
  if (/^https?:\/\//i.test(t)) return t;
  return null;
}

export function promotionsFromCms(promotions: unknown): Array<{
  iconType: string;
  title: string;
  text: string;
}> {
  if (!Array.isArray(promotions)) return [];
  return promotions.map((promo: any, index: number) => {
    let iconType = 'location';
    const titleLower = (promo?.title || '').toLowerCase();
    if (
      titleLower.includes('call') ||
      titleLower.includes('phone') ||
      titleLower.includes('اتصل') ||
      titleLower.includes('هاتف')
    ) {
      iconType = 'phone';
    } else if (
      titleLower.includes('email') ||
      titleLower.includes('mail') ||
      titleLower.includes('بريد') ||
      titleLower.includes('@')
    ) {
      iconType = 'email';
    } else if (titleLower.includes('address') || titleLower.includes('عنوان') || index === 0) {
      iconType = 'location';
    }
    return {
      iconType,
      title: promo?.title ?? '',
      text: promo?.text ?? '',
    };
  });
}

/** Build props for `ContactSection` from CMS `contactForm` language payload only (no static fallback). */
export function contactFormToSectionProps(c: Record<string, unknown> | null | undefined): SectionProps {
  const block = c?.block as { heading?: string; text?: string } | undefined;
  const hasBlock = Boolean(block && (block.heading || block.text));
  return {
    wrapperCls: 'section-padding',
    container: 'container',
    subheading: (c?.subheading as string) ?? '',
    heading: (c?.heading as string) ?? '',
    text: (c?.text as string) ?? '',
    promotions: promotionsFromCms(c?.promotions),
    block: hasBlock
      ? { heading: block!.heading ?? '', text: block!.text ?? '' }
      : undefined,
  };
}

export function buildContactBannerPicture(imageSrc: string | undefined | null): ImageProps | null {
  const src = imageSrc?.trim() || '';
  if (!src) return null;
  return {
    src,
    srcMobile: src,
    srcTablet: src,
    width: 1920,
    height: 520,
    cls: 'media media-bg',
    alt: 'Banner',
    loading: 'eager',
  };
}
