import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Project } from '@/libs/models/project';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Project>('projects');
    const { searchParams } = new URL(req.url);
    const enabled = searchParams.get('enabled');
    
    let query: any = {};
    if (enabled !== null) {
      query.enabled = enabled === 'true';
    }
    
    const projects = await collection
      .find(query)
      .sort({ created_at: -1 })
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
