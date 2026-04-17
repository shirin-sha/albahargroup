import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { JobApplication } from '@/libs/models/jobApplication';
import { getCmsUploadImgRoot } from '@/libs/uploadsPath';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_RESUME_SIZE = 10 * 1024 * 1024;

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<JobApplication>('jobApplications');
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query: Partial<JobApplication> = {};
    if (status) query.status = status as JobApplication['status'];

    const applications = await collection
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job applications' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const applicantName = String(formData.get('applicantName') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const linkedin = String(formData.get('linkedin') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const jobId = String(formData.get('jobId') || '').trim();
    const jobTitle = String(formData.get('jobTitle') || '').trim();
    const jobTitleAr = String(formData.get('jobTitleAr') || '').trim();
    const resume = formData.get('resume') as File | null;

    if (!applicantName || !email || !phone || !message || !jobId || !jobTitle || !resume) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be completed.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_RESUME_TYPES.includes(resume.type)) {
      return NextResponse.json(
        { success: false, error: 'Resume must be a PDF, DOC, or DOCX file.' },
        { status: 400 }
      );
    }

    if (resume.size > MAX_RESUME_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Resume size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    const uploadDir = join(getCmsUploadImgRoot(), 'applications');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const originalName = resume.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const application: JobApplication = {
      jobId,
      jobTitle,
      jobTitleAr,
      applicantName,
      email,
      phone,
      linkedin,
      message,
      resumePath: `/api/upload/file/applications/${filename}`,
      resumeOriginalName: resume.name,
      status: 'new',
      adminNotes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const db = await getDb();
    const collection = db.collection<JobApplication>('jobApplications');
    const result = await collection.insertOne(application as any);

    return NextResponse.json({
      success: true,
      message: 'Your application has been submitted successfully.',
      data: { ...application, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit job application' },
      { status: 500 }
    );
  }
}
