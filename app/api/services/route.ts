import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Service } from '@/libs/models/service';

const CAPABILITY_SLUGS = new Set([
  'human-capital',
  'knowledge-insights',
  'business-excellence',
  'logistics',
  'customer-care',
]);

const normalizeSection = (section?: string): Service['section'] =>
  section === 'capabilities' ? 'capabilities' : 'businesses';

const inferSectionFromSlug = (slug?: string): Service['section'] =>
  slug && CAPABILITY_SLUGS.has(slug) ? 'capabilities' : 'businesses';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Service>('services');
    const { searchParams } = new URL(req.url);
    const enabled = searchParams.get('enabled');
    const section = searchParams.get('section');

    const query: any = {};
    if (enabled !== null) {
      query.enabled = enabled === 'true';
    }
    if (section === 'businesses' || section === 'capabilities') {
      query.section = section;
    }

    const services = await collection.find(query).sort({ created_at: -1 }).toArray();

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Service>('services');
    const body = await req.json();

    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (!body.created_at) {
      body.created_at = new Date().toISOString();
    }

    if (body.enabled === undefined) {
      body.enabled = true;
    }
    body.section = body.section
      ? normalizeSection(body.section)
      : inferSectionFromSlug(body.slug);

    const result = await collection.insertOne(body);
    const newService = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, data: newService });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

