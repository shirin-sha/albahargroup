import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Category } from '@/libs/models/category';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Category>('categories');
    const { searchParams } = new URL(req.url);
    const enabled = searchParams.get('enabled');
    
    let query: any = {};
    if (enabled !== null) {
      query.enabled = enabled === 'true';
    }
    
    const categories = await collection
      .find(query)
      .sort({ name: 1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Category>('categories');
    const body = await req.json();
    
    // Generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
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
    const newCategory = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
