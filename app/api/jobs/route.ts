import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Job } from '@/libs/models/job';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Job>('jobs');
    const { searchParams } = new URL(req.url);
    const enabled = searchParams.get('enabled');

    let query: any = {};
    if (enabled !== null) {
      query.enabled = enabled === 'true';
    }

    const jobs = await collection
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Job>('jobs');
    const body = await req.json();

    // Set postedDate if not provided
    if (!body.postedDate) {
      body.postedDate = new Date().toISOString().slice(0, 10);
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
    const newJob = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, data: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

