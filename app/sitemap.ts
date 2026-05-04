import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/libs/seo';
import { getDb } from '@/libs/mongodb';
import type { Service } from '@/libs/models/service';
import type { Post } from '@/libs/models/post';

const staticPaths = [
  '/',
  '/about-us',
  '/services',
  '/businesses',
  '/capabilities',
  '/careers',
  '/contact-us',
  '/news',
  '/ourpartnerships',
  '/projects',
  '/blogs',
  '/blogs-list',
  '/ar',
  '/ar/about-us',
  '/ar/businesses',
  '/ar/capabilities',
  '/ar/careers',
  '/ar/contact-us',
  '/ar/news',
  '/ar/ourpartnerships',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path === '/' ? '/' : path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' || path === '/ar' ? 1 : 0.7,
  }));

  try {
    const db = await getDb();
    const services = await db
      .collection<Service>('services')
      .find({ enabled: { $ne: false } } as any, { projection: { slug: 1, updated_at: 1, created_at: 1 } })
      .toArray();

    services.forEach((service: any) => {
      if (!service?.slug) return;
      const lastModified = service.updated_at || service.created_at || now;
      entries.push(
        {
          url: `${siteUrl}/services/${service.slug}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        {
          url: `${siteUrl}/ar/services/${service.slug}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.8,
        }
      );
    });

    const posts = await db
      .collection<Post>('posts')
      .find({ enabled: { $ne: false } } as any, { projection: { slug: 1, updated_at: 1, created_at: 1 } })
      .toArray();

    posts.forEach((post: any) => {
      if (!post?.slug) return;
      const lastModified = post.updated_at || post.created_at || now;
      entries.push({
        url: `${siteUrl}/blogs/${post.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.6,
      });

      entries.push({
        url: `${siteUrl}/ar/blogs/${post.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.6,
      });

      entries.push({
        url: `${siteUrl}/news/${post.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  } catch {
    // Keep sitemap functional even if DB is unavailable at build time.
  }

  return entries;
}
