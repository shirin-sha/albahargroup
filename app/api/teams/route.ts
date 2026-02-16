import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Team } from '@/libs/models/team';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Team>('teams');
    const { searchParams } = new URL(req.url);
    const enabled = searchParams.get('enabled');
    
    let query: any = {};
    if (enabled !== null) {
      query.enabled = enabled === 'true';
    }
    
    const teams = await collection
      .find(query)
      .sort({ created_at: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Team>('teams');
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
    const newTeam = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({ success: true, data: newTeam });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
