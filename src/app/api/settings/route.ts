import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    
    // Insert or Update the user's settings
    await db.insert(userSettings).values({
      userId: session.user.id,
      ...body,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        ...body,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SETTINGS_POST_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}