import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sanitizeUser, validateRegistrationBody } from "@/lib/auth-helpers";
import { hashPassword } from "@/lib/password";
import { signAuthToken } from "@/lib/token";

export async function POST(request) {
  try {
    const body = await request.json();
    const validationError = validateRegistrationBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");

    const email = String(body.email).trim().toLowerCase();
    const studentNumber = String(body.studentNumber).trim();

    const existingUser = await users.findOne({
      $or: [{ email }, { studentNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists with this email or student number." },
        { status: 409 },
      );
    }

    const newUser = {
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      studentNumber,
      email,
      passwordHash: hashPassword(String(body.password)),
      role: body.role === "faculty" ? "faculty" : "student",
      dataPrivacyAcceptedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const insertResult = await users.insertOne(newUser);
    const savedUser = { ...newUser, _id: insertResult.insertedId };

    const token = signAuthToken({
      sub: savedUser._id.toString(),
      email: savedUser.email,
      role: savedUser.role,
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        token,
        user: sanitizeUser(savedUser),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to register account.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
