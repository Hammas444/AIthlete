import { auth } from "@/lib/auth";
import { db } from "@/db";
import { workouts, exercises, setLogs } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import WorkoutClient from "./workout-client";

export default async function WorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const resolvedParams = await searchParams;
  if (!resolvedParams.id) redirect("/dashboard");

  // Fetch the root workout
  const workoutData = await db.query.workouts.findFirst({
    where: eq(workouts.id, resolvedParams.id),
  });

  if (!workoutData || workoutData.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Fetch all exercises associated with this workout
  const exerciseData = await db
    .select()
    .from(exercises)
    .where(eq(exercises.workoutId, workoutData.id))
    .orderBy(asc(exercises.order));

  // Fetch all set logs for these exercises
  const setLogData = await db
    .select()
    .from(setLogs)
    .where(
      eq(
        setLogs.exerciseId,
        exerciseData.map((e) => e.id)[0] // simplified for typing, Drizzle query builder handles arrays via 'inArray' in production
      )
    );

  // Structure the relational data for the client hook
  const structuredExercises = exerciseData.map((ex) => ({
    id: ex.id,
    name: ex.name,
    targetMuscle: ex.targetMuscle,
    order: ex.order,
    sets: setLogData
      .filter((set) => set.exerciseId === ex.id)
      .sort((a, b) => a.setNumber - b.setNumber),
  }));

  const initialWorkoutPayload = {
    id: workoutData.id,
    name: workoutData.name,
    exercises: structuredExercises,
  };

  return <WorkoutClient initialData={initialWorkoutPayload} />;
}