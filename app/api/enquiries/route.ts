import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/libs/mongodb";
import type { Enquiry } from "@/libs/models/enquiry";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<Enquiry>("enquiries");

    const enquiries = await collection
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

