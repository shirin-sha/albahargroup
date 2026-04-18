import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Project } from '@/libs/models/project';
import { ObjectId, UpdateFilter } from 'mongodb';

const LEGACY_PROJECT_FIELDS = [
  'slug',
  'id',
  'category',
  'categoryAr',
  'client',
  'owner',
  'starting_date',
  'ending_date',
  'website',
  'content',
  'contentAr',
  'enabled',
  'created_at',
  'updated_at',
] as const;

function pickProjectBody(body: Record<string, unknown>): Omit<Project, '_id'> | null {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const titleAr = typeof body.titleAr === 'string' ? body.titleAr.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const descriptionAr = typeof body.descriptionAr === 'string' ? body.descriptionAr.trim() : '';
  const image = typeof body.image === 'string' ? body.image.trim() : '';
  if (!image || !(title || titleAr) || !(description || descriptionAr)) {
    return null;
  }
  return { title, titleAr, description, descriptionAr, image };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const db = await getDb();
    const collection = db.collection<Project>('projects');
    
    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    
    let project;
    if (ObjectId.isValid(id)) {
      project = await collection.findOne({ _id: new ObjectId(id) } as any);
    } else {
      // Try to find by slug or legacy id
      project = await collection.findOne({
        $or: [
          { slug: id },
          { id: parseInt(id) }
        ]
      });
    }
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
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
    const collection = db.collection<Project>('projects');
    const body = await req.json();

    const doc = pickProjectBody(body);
    if (!doc) {
      return NextResponse.json(
        {
          success: false,
          error:
            'image is required, and each entry needs a title and description in at least one language (English and/or Arabic).',
        },
        { status: 400 }
      );
    }

    const $unset = LEGACY_PROJECT_FIELDS.reduce(
      (acc, key) => {
        acc[key] = '';
        return acc;
      },
      {} as Record<(typeof LEGACY_PROJECT_FIELDS)[number], ''>
    );

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
    
    const update: UpdateFilter<Project> = { $set: doc, $unset };

    const result = await collection.findOneAndUpdate(query, update, {
      returnDocument: 'after',
    });
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
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
    const collection = db.collection<Project>('projects');
    
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
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
