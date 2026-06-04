import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validate the input
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields." }, 
        { status: 400 }
      );
    }

    // 2. Check if the user already exists in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "An account with this email already exists." }, 
        { status: 400 }
      );
    }

    // 3. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save the new user to the database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Account created successfully." }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again." }, 
      { status: 500 }
    );
  }
}