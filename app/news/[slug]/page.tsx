import type { Metadata } from 'next';
import BreadcrumbBanner from "@/components/BreadcrumbBanner";
import BreadcrumbBannerImage from '@/public/img/banner/page-banner.jpg';
import BreadcrumbBannerImageTablet from '@/public/img/banner/page-banner-991.jpg';
import BreadcrumbBannerImageMobile from '@/public/img/banner/page-banner-575.jpg';
import BlogDetails from '@/components/sections/BlogDetails';
import { ArticleType } from '@/types/article';
import { notFound } from 'next/navigation';
import { getDb } from '@/libs/mongodb';
import { Post } from '@/libs/models/post';

const PAGE_TITLE: string = 'News Details';

export const metadata: Metadata = {
  title: PAGE_TITLE,
}

const Page = async ({ params }: {params: Promise<{slug: string}>}) => {
    const { slug } = await params;
    
    try {
      const db = await getDb();
      const collection = db.collection<Post>('posts');
      
      // Find post by slug, only if enabled (published)
      const post = await collection.findOne({ 
        slug: slug,
        enabled: { $ne: false } // Only published posts
      });
      
      if (!post) {
        notFound();
      }
      
      // Map Post to ArticleType
      // Generate a numeric ID from MongoDB _id if legacy id doesn't exist
      let numericId = post.id || 0;
      if (!numericId && post._id) {
        // Convert MongoDB ObjectId to a numeric value (using first 8 chars as hex)
        try {
          numericId = parseInt(post._id.toString().substring(0, 8), 16) || 0;
        } catch {
          numericId = 0;
        }
      }
      
      const article: ArticleType = {
        id: numericId,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category,
        image: post.image || null,
        video: post.video || null,
        tags: post.tags || [],
        comments: post.comments || 0,
        authorId: post.authorId || null,
        created_at: typeof post.created_at === 'string' ? post.created_at : post.created_at?.toISOString() || new Date().toISOString(),
      };

      return (
          <>
              <BreadcrumbBanner 
                  title={PAGE_TITLE}
                  image={{
                      src: BreadcrumbBannerImage.src,
                      srcMobile: BreadcrumbBannerImageTablet.src,
                      srcTablet: BreadcrumbBannerImageMobile.src,
                      width: 1920,
                      height: 520,
                      cls: "media media-bg",
                      alt: "Banner Image",
                      loading: "eager"
                  }}
              />
              <BlogDetails container="container" article={article} />
          </>
      );
    } catch (error) {
      console.error('Error fetching news:', error);
      notFound();
    }
}

export default Page;