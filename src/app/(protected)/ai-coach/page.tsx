import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AICoachClient from "./client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AICoachPage() {
  // 1. Verify the user is logged in
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // 2. Fetch all past messages for this specific user safely
  const history = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, session.user.id))
    .orderBy(asc(chatMessages.createdAt));

  // 3. Format the database rows to match exactly what the Vercel AI SDK expects
  const initialMessages = history.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }));

  return (
    <div className="flex-1 h-full bg-zinc-950">
      {/* Pass the formatted history into the interactive chat component */}
      <AICoachClient initialMessages={initialMessages} />
    </div>
  );
}