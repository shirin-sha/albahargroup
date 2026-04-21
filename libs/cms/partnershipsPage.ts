import type { SectionProps } from '@/types/sectionProps';
import type { ImageProps } from '@/types/image';

/** Build props for `Partnerships` from CMS `partnerships` section language payload (no static fallback). */
export function partnershipsSectionToSectionProps(
  c: Record<string, unknown> | null | undefined
): SectionProps {
  const raw = c?.imageList;
  const imageList: ImageProps[] = Array.isArray(raw)
    ? (raw as unknown[])
        .map((img: any) => ({
          src: typeof img?.src === 'string' ? img.src : '',
          width: typeof img?.width === 'number' ? img.width : 200,
          height: typeof img?.height === 'number' ? img.height : 120,
          alt: typeof img?.alt === 'string' ? img.alt : '',
          category: typeof img?.category === 'string' ? img.category : '',
          // `ImageProps.loading` only allows 'lazy' | 'eager' (not generic string).
          loading: (img?.loading === 'eager' ? 'eager' : 'lazy') as ImageProps['loading'],
        }))
        .filter((img) => img.src.trim() !== '')
    : [];

  return {
    wrapperCls: 'section-padding',
    container: 'container',
    subheading: (c?.subheading as string) ?? '',
    heading: (c?.heading as string) ?? '',
    text: (c?.text as string) ?? '',
    imageList,
  };
}
