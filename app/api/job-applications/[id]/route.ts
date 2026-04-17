import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { JobApplication } from '@/libs/models/jobApplication';
import { ObjectId } from 'mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application id' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updateData: Partial<JobApplication> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status) updateData.status = body.status;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;

    const db = await getDb();
    const collection = db.collection<JobApplication>('jobApplications');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job application' },
      { status: 500 }
    );
  }
}
