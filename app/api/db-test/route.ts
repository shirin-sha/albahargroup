import { NextResponse } from "next/server";
import { getDb } from "@/libs/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.command({ ping: 1 });

    const collectionsToCheck = [
      'homePageSections',
      'contactPageSections',
      'partnershipsPageSections',
      'services',
      'projects',
      'posts',
      'jobs',
      'careers',
    ];

    const counts: Record<string, number> = {};
    await Promise.all(
      collectionsToCheck.map(async (name) => {
        try {
          counts[name] = await db.collection(name).countDocuments();
        } catch {
          counts[name] = -1; // collection may not exist yet
        }
      })
    );

    return NextResponse.json({
      ok: true,
      db: db.databaseName,
      ping: result,
      counts,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Unknown MongoDB error",
      },
      { status: 500 },
    );
  }
}

