export const dynamic = "force-dynamic";

import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // Fetch existing settings if they have them
  const settings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  return (
    <div className="flex-1 h-full bg-zinc-950 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">AI Trainer Settings</h1>
          <p className="text-zinc-400">Personalize your AI Trainer by updating your body metrics and fitness goals.</p>
        </div>
        
        {/* Pass data to the interactive form */}
        <SettingsClient initialData={settings[0] || {}} />
      </div>
    </div>
  );
}