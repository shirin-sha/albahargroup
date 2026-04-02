import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Service } from '@/libs/models/service';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { CacheTags } from '@/libs/cacheTags';

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const db = await getDb();
    const collection = db.collection<Service>('services');

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    let service;
    if (ObjectId.isValid(id)) {
      service = await collection.findOne({ _id: new ObjectId(id) } as any);
    } else {
      service = await collection.findOne({
        $or: [{ slug: id }, { id: parseInt(id) }],
      } as any);
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
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
    const collection = db.collection<Service>('services');
    const body = await req.json();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    if (body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    body.section = body.section
      ? normalizeSection(body.section)
      : inferSectionFromSlug(body.slug);

    body.updated_at = new Date().toISOString();

    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = {
        $or: [{ slug: id }, { id: parseInt(id) }],
      };
    }

    const result = await collection.findOneAndUpdate(
      query,
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    revalidateTag(CacheTags.data.services, 'default');
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
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
    const collection = db.collection<Service>('services');

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = {
        $or: [{ slug: id }, { id: parseInt(id) }],
      };
    }

    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    revalidateTag(CacheTags.data.services, 'default');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}

