import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/libs/mongodb";
import { HomePageSection } from "@/libs/models/homePage";
import { revalidateTag } from "next/cache";
import { CacheTags } from "@/libs/cacheTags";

// GET - Fetch all about page sections
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("aboutPageSections");
    
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";
    const sectionId = searchParams.get("sectionId");

    let query: any = {};
    if (sectionId) {
      query.sectionId = sectionId;
    }

    const sections = await collection
      .find(query)
      .sort({ order: 1 })
      .toArray();

    // Transform data to return only requested language
    const transformed = sections.map((section) => ({
      ...section,
      content: section[lang as "en" | "ar"] || section.en,
    }));

    return NextResponse.json({ success: true, data: transformed });
  } catch (error) {
    console.error("Error fetching about page sections:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

// POST - Create or update a section
export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("aboutPageSections");
    
    const body = await req.json();
    const { sectionId, enabled, order, en, ar } = body;

    if (!sectionId) {
      return NextResponse.json(
        { success: false, error: "sectionId is required" },
        { status: 400 }
      );
    }

    const updateData: Partial<HomePageSection> = {
      sectionId,
      enabled: enabled !== undefined ? enabled : true,
      order: order !== undefined ? order : 0,
      updatedAt: new Date(),
    };

    if (en) updateData.en = en;
    if (ar) updateData.ar = ar;

    const result = await collection.findOneAndUpdate(
      { sectionId },
      {
        $set: updateData,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, returnDocument: "after" }
    );

    revalidateTag(CacheTags.cms.about, 'default');
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error saving about page section:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save section" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a section
export async function DELETE(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<HomePageSection>("aboutPageSections");
    
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json(
        { success: false, error: "sectionId is required" },
        { status: 400 }
      );
    }

    await collection.deleteOne({ sectionId });

    revalidateTag(CacheTags.cms.about, 'default');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
