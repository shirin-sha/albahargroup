import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/libs/mongodb";
import type { Enquiry } from "@/libs/models/enquiry";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject and message are required" },
        { status: 400 }
      );
    }

    // Save enquiry to MongoDB (for admin listing)
    try {
      const db = await getDb();
      const collection = db.collection<Enquiry>("enquiries");
      const enquiry: Enquiry = {
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
      };
      await collection.insertOne(enquiry);
    } catch (dbError) {
      console.error("Failed to save enquiry:", dbError);
      // Don't fail the request if saving to DB fails
    }

    return NextResponse.json({
      success: true,
      message: "Thanks for contacting us. We'll get back to you as soon as possible.",
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}
