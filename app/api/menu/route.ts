import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/libs/mongodb';
import { Menu } from '@/libs/models/menu';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Menu>('headerMenu');
    
    const menus = await collection
      .find({ enabled: { $ne: false } })
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: menus });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Menu>('headerMenu');
    const body = await req.json();
    
    // If updating all menus, delete existing and insert new
    if (body.replaceAll) {
      await collection.deleteMany({});
      const menusWithDates = body.menus.map((menu: Menu) => ({
        ...menu,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      const result = await collection.insertMany(menusWithDates);
      return NextResponse.json({ success: true, data: result });
    }
    
    // Single menu update
    const menu = {
      ...body,
      updated_at: new Date().toISOString(),
      created_at: body.created_at || new Date().toISOString(),
    };
    
    const result = await collection.insertOne(menu);
    const newMenu = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({ success: true, data: newMenu });
  } catch (error) {
    console.error('Error saving menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save menu' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Menu>('headerMenu');
    const body = await req.json();
    
    // If updating all menus
    if (body.replaceAll) {
      await collection.deleteMany({});
      const menusWithDates = body.menus.map((menu: Menu) => ({
        ...menu,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      const result = await collection.insertMany(menusWithDates);
      return NextResponse.json({ success: true, data: result });
    }
    
    // Single menu update
    if (!body._id) {
      return NextResponse.json(
        { success: false, error: '_id is required' },
        { status: 400 }
      );
    }
    
    const { _id, ...updateData } = body;
    updateData.updated_at = new Date().toISOString();
    
    let query: any;
    if (ObjectId.isValid(_id)) {
      query = { _id: new ObjectId(_id) };
    } else {
      query = { _id: _id };
    }
    
    const result = await collection.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}
