import type { Metadata } from 'next';
import Script from 'next/script';
import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';
import BlogDetails from '@/components/sections/BlogDetails';
import { notFound } from 'next/navigation';
import { getNewsPostBySlug, newsPostToArticle } from '@/libs/newsPostDetail';
import { getNewsCmsBannerTitle } from '@/libs/cms/newsPageBanner';
import { DEFAULT_SITE_NAME, absoluteUrl } from '@/libs/seo';
import { plainTextFromHtml } from '@/utils/plainText';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug;

  const post = await getNewsPostBySlug(slug);
  if (!post) {
    return {
      title: 'News not found',
      alternates: { canonical: absoluteUrl('/news') },
    };
  }

  const canonicalPath = `/news/${post.slug}`;
  const title = post.title || 'News';
  const description =
    plainTextFromHtml(post.excerpt || post.content, 170) ||
    'Latest Al Bahar Group news, updates, and announcements.';
  const images = post.image ? [{ url: absoluteUrl(post.image), alt: post.title || 'News image' }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
      languages: {
        en: absoluteUrl(canonicalPath),
        ar: absoluteUrl(`/ar/news/${post.slug}`),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      type: 'article',
      siteName: DEFAULT_SITE_NAME,
      images,
    },
    twitter: {
      card: post.image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: post.image ? [absoluteUrl(post.image)] : undefined,
    },
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  try {
    const [post, breadcrumbBannerTitle] = await Promise.all([
      getNewsPostBySlug(slug),
      getNewsCmsBannerTitle('en'),
    ]);

    if (!post) {
      notFound();
    }

    const article = newsPostToArticle(post, 'en', { includeComments: false });
    const canonicalPath = `/news/${post.slug}`;

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.title,
      description: plainTextFromHtml(post.excerpt || post.content, 220),
      image: post.image ? [absoluteUrl(post.image)] : undefined,
      datePublished:
        typeof post.created_at === 'string' ? post.created_at : post.created_at?.toISOString(),
      dateModified:
        typeof post.updated_at === 'string'
          ? post.updated_at
          : post.updated_at
            ? post.updated_at.toISOString()
            : undefined,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': absoluteUrl(canonicalPath),
      },
      isPartOf: {
        '@type': 'CollectionPage',
        name: breadcrumbBannerTitle,
        url: absoluteUrl('/news'),
      },
    };

    return (
      <>
        <Script
          id="news-article-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BreadcrumbBanner
          title={breadcrumbBannerTitle}
          breadcrumbTitle={post.title || 'News'}
          image={{
            src: BreadcrumbBannerImage.src,
            srcMobile: BreadcrumbBannerImageTablet.src,
            srcTablet: BreadcrumbBannerImageMobile.src,
            width: 1920,
            height: 520,
            cls: 'media media-bg',
            alt: 'Banner Image',
            loading: 'eager',
          }}
        />
        <BlogDetails container="container" article={article} showCommentsMeta={false} />
      </>
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    notFound();
  }
};

export default Page;
