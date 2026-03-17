import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Category } from '@/libs/models/category';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const db = await getDb();
    const collection = db.collection<Category>('categories');
    
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    
    let category;
    if (ObjectId.isValid(id)) {
      category = await collection.findOne({ _id: new ObjectId(id) } as any);
    } else {
      category = await collection.findOne({
        $or: [
          { slug: id },
          { id: parseInt(id) }
        ]
      });
    }
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
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
    const collection = db.collection<Category>('categories');
    const body = await req.json();
    
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    
    // Generate slug if title changed and slug not provided
    if (body.name && !body.slug) {
      body.slug = body.name
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
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
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
    const collection = db.collection<Category>('categories');
    
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
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
