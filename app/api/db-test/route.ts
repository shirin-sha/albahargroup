import { NextResponse } from "next/server";
import { getDb } from "@/libs/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      db: db.databaseName,
      ping: result,
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

