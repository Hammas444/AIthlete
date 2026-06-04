import { auth } from "@/lib/auth";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Plus, ChevronRight, CheckCircle2, Clock, Dumbbell } from "lucide-react";
import { GenerateWorkoutModal } from "@/components/workout/generate-workout-modal";


export default async function DashboardPage() {
  // 1. Validate the user session
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  // 2. Fetch the user's workout history directly from the database
  const userWorkouts = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id))
    .orderBy(desc(workouts.scheduledDate));

  // 3. Segregate into active and historical data
  const upcomingWorkouts = userWorkouts.filter((w) => !w.isCompleted);
  const completedWorkouts = userWorkouts.filter((w) => w.isCompleted);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-full min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Welcome back, {session.user.name?.split(" ")[0] || "Athlete"}
          </h1>
          <p className="text-zinc-400 mt-1">Ready to crush your next session?</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/ai-coach"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Dumbbell className="w-4 h-4 text-emerald-500" />
            Consult AI Trainer
          </Link>
          {/* In a complete app, this would open a modal triggering the generateAndSaveWorkout action */}
          <GenerateWorkoutModal />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Upcoming Workouts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Up Next
            </h2>
          </div>

          {upcomingWorkouts.length === 0 ? (
            <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
              <Calendar className="w-10 h-10 text-zinc-600 mb-3" />
              <p className="text-zinc-300 font-medium">No upcoming workouts</p>
              <p className="text-sm text-zinc-500 mt-1">
                Generate a new routine with your AI trainer to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-bold text-zinc-100">{workout.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Scheduled for {new Date(workout.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/workout?id=${workout.id}`}
                    className="flex items-center justify-center gap-2 bg-zinc-800 group-hover:bg-emerald-600 group-hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  >
                    Start Session
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Completed History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-zinc-400" />
              History
            </h2>
          </div>

          {completedWorkouts.length === 0 ? (
            <p className="text-sm text-zinc-500 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
              Your completed workouts will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {completedWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-zinc-200 text-sm">{workout.name}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {new Date(workout.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}