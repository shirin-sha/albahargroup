import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Post } from '@/libs/models/post';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Post>('posts');
    const { searchParams } = new URL(req.url);
    const enabled = searchParams.get('enabled');
    
    let query: any = {};
    if (enabled !== null) {
      query.enabled = enabled === 'true';
    }
    
    const posts = await collection
      .find(query)
      .sort({ created_at: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Post>('posts');
    const body = await req.json();
    
    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Set created_at if not provided
    if (!body.created_at) {
      body.created_at = new Date().toISOString();
    }
    
    // Set enabled to true by default
    if (body.enabled === undefined) {
      body.enabled = true;
    }
    
    const result = await collection.insertOne(body);
    const newPost = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({ success: true, data: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
