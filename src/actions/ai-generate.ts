// src/actions/ai-generate.ts
'use server';

import { db } from '@/db';
import { workouts, exercises, setLogs } from '@/db/schema';
import { auth } from '@/lib/auth';
import { generateText } from 'ai'; 
import { google } from '@ai-sdk/google'; // FIX 1: Import Google provider
import { z } from 'zod';

const workoutPlanSchema = z.object({
  workoutName: z.string(),
  exercises: z.array(z.object({
    name: z.string(),
    targetMuscle: z.string(),
    setsCount: z.number(),
    targetReps: z.number(),
    suggestedRpe: z.number()
  }))
});

interface GenerationOptions {
  goal: string;       
  equipment: string;  
  targetDate: Date;
}

export async function generateAndSaveWorkout({ goal, equipment, targetDate }: GenerationOptions) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized access request." };
    const userId = session.user.id;

    // FIX 2: Ask Gemini 1.5 Flash for the routine
    const { text } = await generateText({
      model: google('gemini-2.5-flash'), 
      system: `You are an elite personal trainer. 
      You MUST respond with ONLY raw, valid JSON. 
      Do not include markdown blocks, backticks, or any conversational text.`,
      prompt: `Generate a single-day workout for the goal: "${goal}" using only this equipment: "${equipment}". 
      
      The JSON must exactly match this structure:
      {
        "workoutName": "String (e.g., Full Body Hypertrophy)",
        "exercises": [
          {
            "name": "String",
            "targetMuscle": "String",
            "setsCount": Number,
            "targetReps": Number,
            "suggestedRpe": Number
          }
        ]
      }`,
    });

    // Clean and parse the AI response
    const cleanJsonString = text.replace(/```json/g, '').replace(/\n```/g, '').trim();
    const rawData = JSON.parse(cleanJsonString);
    const object = workoutPlanSchema.parse(rawData);

    // 1. Create the Workout (No db.transaction wrapper used)
    const [insertedWorkout] = await db.insert(workouts).values({
      userId,
      name: object.workoutName,
      scheduledDate: targetDate,
      isCompleted: false,
    }).returning({ id: workouts.id });

    // 2. Iterate through exercises
    for (let i = 0; i < object.exercises.length; i++) {
      const item = object.exercises[i];

      // Create the specific exercise
      const [insertedExercise] = await db.insert(exercises).values({
        workoutId: insertedWorkout.id,
        name: item.name,
        targetMuscle: item.targetMuscle,
        order: i + 1,
      }).returning({ id: exercises.id });

      // Prepare all sets for this exercise
      const setsToInsert = [];
      for (let setIdx = 1; setIdx <= item.setsCount; setIdx++) {
        setsToInsert.push({
          exerciseId: insertedExercise.id,
          setNumber: setIdx,
          weight: 0, 
          reps: item.targetReps,
          rpe: item.suggestedRpe,
          isCompleted: false,
        });
      }

      // 3. Bulk insert the sets instantly via HTTP
      if (setsToInsert.length > 0) {
        await db.insert(setLogs).values(setsToInsert);
      }
    }

    return { success: true, message: "Workout successfully generated!" };
  } catch (error: any) {
    console.error("AI_GENERATION_ERROR:", error);
    return { success: false, error: error.message || "Internal server failed to process routine assignment." };
  }
}
  