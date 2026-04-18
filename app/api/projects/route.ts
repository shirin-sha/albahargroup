import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Project } from '@/libs/models/project';

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

export async function GET(_req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Project>('projects');

    const projects = await collection
      .find({})
      .sort({ _id: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const result = await collection.insertOne(doc);
    const newProject = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({ success: true, data: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
