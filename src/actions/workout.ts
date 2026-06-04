'use server';

import { db } from '@/db';
import { workouts, setLogs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Updates an isolated set tracking metrics entry directly from active inputs
 */
export async function updateSetLogEntry(logId: string, payload: { weight: number; reps: number; rpe: number; isCompleted: boolean }) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated call.");

    await db.update(setLogs)
      .set({
        weight: payload.weight,
        reps: payload.reps,
        rpe: payload.rpe,
        isCompleted: payload.isCompleted
      })
      .where(eq(setLogs.id, logId));

    // Revalidate client-side caches instantly
    revalidatePath('/workout');
    return { success: true };
  } catch (error) {
    console.error("UPDATE_SET_LOG_ERROR:", error);
    return { success: false, error: "Failed to persist set logging metrics." };
  }
}

/**
 * Finalizes and flags a target root workout session day as fully complete
 */
export async function markWorkoutAsComplete(workoutId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated call.");

    await db.update(workouts)
      .set({ isCompleted: true })
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id)));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("COMPLETE_WORKOUT_ERROR:", error);
    return { success: false, error: "Failed to update routine confirmation status." };
  }
}