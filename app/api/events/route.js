import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { toEventResponse, validateCreateEventBody } from "@/lib/event-helpers";

export async function POST(request) {
  try {
    const body = await request.json();
    const validationError = validateCreateEventBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const db = await getDb();
    const events = db.collection("events");

    const newEvent = {
      title: String(body.eventName).trim(),
      date: String(body.date || "").trim(),
      venue: String(body.venue || "").trim(),
      description: String(body.description || "").trim(),
      requester: String(body.requester || "").trim(),
      department: String(body.department || "").trim(),
      course: String(body.course || "").trim(),
      type: String(body.type || "").trim(),
      surveyLink: String(body.surveyLink || "").trim(),
      startTime: String(body.startTime || "").trim(),
      endTime: String(body.endTime || "").trim(),
      duration: String(body.duration || "").trim(),
      minimumAttendance: String(body.minimumAttendance || "").trim(),
      status: "Under Review",
      certificate: "Processing",
      createdAt: new Date().toISOString(),
    };

    const result = await events.insertOne(newEvent);

    return NextResponse.json(
      {
        message: "Event created successfully.",
        event: toEventResponse({ ...newEvent, _id: result.insertedId }),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create event.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const events = db.collection("events");
    const rows = await events.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ events: rows.map(toEventResponse) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch events.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
