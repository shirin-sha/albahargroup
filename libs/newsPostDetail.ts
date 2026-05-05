import { getDb } from '@/libs/mongodb';
import type { Post } from '@/libs/models/post';
import type { ArticleType } from '@/types/article';

export async function getNewsPostBySlug(slug: string): Promise<Post | null> {
  try {
    const db = await getDb();
    const collection = db.collection<Post>('posts');
    const post = await collection.findOne({ slug, enabled: { $ne: false } } as any);
    return post || null;
  } catch (error) {
    console.error('Error fetching news post by slug:', error);
    return null;
  }
}

function numericIdFromPost(post: Post): number {
  if (post.id) return post.id;
  if (post._id) {
    try {
      return parseInt(String(post._id).substring(0, 8), 16) || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

export function newsPostToArticle(
  post: Post,
  lang: 'en' | 'ar',
  options?: { includeComments?: boolean },
): ArticleType {
  const includeComments = options?.includeComments ?? true;
  const createdAt =
    typeof post.created_at === 'string'
      ? post.created_at
      : post.created_at?.toISOString() || new Date().toISOString();

  if (lang === 'ar') {
    return {
      id: numericIdFromPost(post),
      title: (post.titleAr && post.titleAr.trim()) || post.title,
      slug: post.slug,
      content: (post.contentAr && post.contentAr.trim()) || post.content,
      excerpt: (post.excerptAr && post.excerptAr.trim()) || post.excerpt || '',
      image: post.image || null,
      video: post.video ?? null,
      tags: post.tags || [],
      comments: includeComments ? post.comments || 0 : undefined,
      authorId: post.authorId ?? null,
      created_at: createdAt,
    };
  }

  return {
    id: numericIdFromPost(post),
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || '',
    image: post.image || null,
    video: post.video ?? null,
    tags: post.tags || [],
    comments: includeComments ? post.comments || 0 : undefined,
    authorId: post.authorId ?? null,
    created_at: createdAt,
  };
}
