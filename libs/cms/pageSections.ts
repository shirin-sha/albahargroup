import { getDb } from '@/libs/mongodb';
import type { HomePageSection } from '@/libs/models/homePage';
import { unstable_cache } from 'next/cache';

export function getCmsSectionsCached(args: {
  collectionName: string;
  cacheKey: string;
  tag: string;
}) {
  const fn = async () => {
    const db = await getDb();
    const collection = db.collection<HomePageSection>(args.collectionName);
    return await collection.find({}).sort({ order: 1 }).toArray();
  };

  return unstable_cache(fn, [args.cacheKey], {
    revalidate: 60 * 60, // 1 hour, invalidated immediately by tag
    tags: [args.tag],
  });
}

