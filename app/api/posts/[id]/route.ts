import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Post } from '@/libs/models/post';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { CacheTags } from '@/libs/cacheTags';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const db = await getDb();
    const collection = db.collection<Post>('posts');
    
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    
    let post;
    if (ObjectId.isValid(id)) {
      post = await collection.findOne({ _id: new ObjectId(id) } as any);
    } else {
      // Try to find by slug or legacy id
      post = await collection.findOne({
        $or: [
          { slug: id },
          { id: parseInt(id) }
        ]
      });
    }
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const db = await getDb();
    const collection = db.collection<Post>('posts');
    const body = await req.json();
    
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    
    // Generate slug if title changed and slug not provided
    if (body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    body.updated_at = new Date().toISOString();
    
    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = {
        $or: [
          { slug: id },
          { id: parseInt(id) }
        ]
      };
    }
    
    const result = await collection.findOneAndUpdate(
      query,
      { $set: body },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    revalidateTag(CacheTags.data.posts, 'default');
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const db = await getDb();
    const collection = db.collection<Post>('posts');
    
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    
    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = {
        $or: [
          { slug: id },
          { id: parseInt(id) }
        ]
      };
    }
    
    const result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    revalidateTag(CacheTags.data.posts, 'default');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
