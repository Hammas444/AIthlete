export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { streamText } from 'ai';
// FIX: Imported Google instead of Groq
import { google } from '@ai-sdk/google'; 
import { db } from "@/db";
import { chatMessages, userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Invalid message body", { status: 400 });
    }

    // 1. Save the user's latest message
    const lastMessage = messages[messages.length - 1];
    await db.insert(chatMessages).values({
      userId,
      role: 'user', 
      content: lastMessage.content,
    });

    // 2. Fetch the user's custom settings from the database
    const [profile] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    // 3. Format messages 
    const sanitizedMessages = messages.map((msg: any) => ({
      role: msg.role === "model" ? "assistant" : msg.role,
      content: msg.content,
    }));

    // 4. Build the dynamic System Prompt
    let systemPrompt = "You are an elite AI personal trainer, physiotherapist, and nutrition coach. Be encouraging, precise, concise, and focused on scientifically proven exercise physiology guidelines. Format your responses in clean Markdown.";

    // Inject user settings into Gemini's brain
    if (profile) {
      systemPrompt += `\n\n--- STRICT CLIENT CONTEXT ---\n`;
      systemPrompt += `You must strictly tailor all advice to the following client details:\n`;
      if (profile.age || profile.gender) systemPrompt += `- Identity: ${profile.age ? profile.age + ' years old' : ''} ${profile.gender || ''}\n`;
      if (profile.weight) systemPrompt += `- Current Weight: ${profile.weight} lbs\n`;
      if (profile.targetWeight) systemPrompt += `- Target Weight: ${profile.targetWeight} lbs\n`;
      if (profile.goal) systemPrompt += `- Primary Goal: ${profile.goal}\n`;
      if (profile.equipment) systemPrompt += `- Available Equipment: ${profile.equipment}\n`;
      if (profile.dietaryRestrictions) systemPrompt += `- Dietary Restrictions: ${profile.dietaryRestrictions}\n`;
      if (profile.medicalLimitations) systemPrompt += `- Medical/Injuries: ${profile.medicalLimitations}\n`;
    }

    // 5. Stream and save the AI's response using Gemini!
    const result = streamText({
      model: google('gemini-2.5-flash'), // Swapped to Gemini
      system: systemPrompt,
      messages: sanitizedMessages,
      async onFinish({ text }) {
        try {
          await db.insert(chatMessages).values({
            userId,
            role: 'assistant',
            content: text,
          });
          console.log("✅ Gemini Message saved to database!");
        } catch (dbError) {
          console.error("❌ Failed to save Gemini message:", dbError);
        }
      }
    });

    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("GEMINI_STREAM_ROUTE_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}