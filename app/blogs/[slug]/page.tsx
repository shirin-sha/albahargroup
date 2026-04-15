import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import BreadcrumbBanner from '@/components/BreadcrumbBanner';
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';
import BlogDetails from '@/components/sections/BlogDetails';
import { ArticleType } from '@/types/article';
import { getDb } from '@/libs/mongodb';
import type { Post } from '@/libs/models/post';
import { DEFAULT_SITE_NAME, absoluteUrl } from '@/libs/seo';
import { plainTextFromHtml } from '@/utils/plainText';

export const revalidate = 3600;

const BLOG_LISTING_PATH = '/blogs';
const DETAIL_BANNER_TITLE = 'News & Updates';

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const db = await getDb();
    const collection = db.collection<Post>('posts');
    const post = await collection.findOne({ slug, enabled: { $ne: false } } as any);
    return post || null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

function postToArticle(post: Post): ArticleType {
  const numericId =
    post.id ||
    (post._id ? parseInt(String(post._id).substring(0, 8), 16) : 0) ||
    0;
  const createdAt =
    typeof post.created_at === 'string' ? post.created_at : post.created_at?.toISOString();

  return {
    id: numericId,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    category: post.category,
    image: post.image,
    video: post.video,
    tags: post.tags || [],
    comments: post.comments || 0,
    authorId: post.authorId,
    created_at: createdAt,
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug;

  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Post not found',
      alternates: { canonical: absoluteUrl(`${BLOG_LISTING_PATH}`) },
    };
  }

  const canonicalPath = `/blogs/${post.slug}`;
  const title = post.title || 'Blog';
  const description = plainTextFromHtml(post.excerpt || post.content, 170) || 'Read the latest update.';
  const images = post.image ? [{ url: absoluteUrl(post.image), alt: post.title || 'Blog image' }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
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

const Page = async ({ params }: { params: Promise<{ slug: string }> | { slug: string } }) => {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const article = postToArticle(post);
  const canonicalPath = `/blogs/${post.slug}`;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
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
      '@type': 'Blog',
      name: DEFAULT_SITE_NAME,
      url: absoluteUrl(BLOG_LISTING_PATH),
    },
  };

  return (
    <>
      <Script
        id="blog-post-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreadcrumbBanner
        title={DETAIL_BANNER_TITLE}
        breadcrumbTitle={post.title || 'Blog'}
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

      <BlogDetails container="container" article={article} />
    </>
  );
};

export default Page;