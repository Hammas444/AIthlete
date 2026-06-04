"use client";

import React, { useEffect } from "react";
import { useActiveWorkout } from "@/hooks/use-active-workout";
import { updateSetLogEntry, markWorkoutAsComplete } from "@/actions/workout";
import { useRouter } from "next/navigation";
import { CheckCircle, Dumbbell, Timer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorkoutClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const {
    workoutId,
    workoutName,
    exercises,
    startWorkout,
    updateSetMetrics,
    toggleSetCompletion,
    finishWorkout,
  } = useActiveWorkout();

  // Initialize the Zustand store when the component mounts if it's a new session
  useEffect(() => {
    if (workoutId !== initialData.id) {
      startWorkout(initialData.id, initialData.name, initialData.exercises);
    }
  }, [initialData, workoutId, startWorkout]);

  const handleSetToggle = async (
    exerciseId: string,
    logId: string,
    currentSet: any
  ) => {
    // 1. Instantly update local UI state for snappy feedback
    toggleSetCompletion(exerciseId, logId);

    // 2. Fire and forget server mutation to sync with database
    await updateSetLogEntry(logId, {
      weight: currentSet.weight,
      reps: currentSet.reps,
      rpe: currentSet.rpe || 8,
      isCompleted: !currentSet.isCompleted,
    });
  };

  const handleCompleteWorkout = async () => {
    if (!workoutId) return;
    await markWorkoutAsComplete(workoutId);
    finishWorkout(); // Clears Zustand localStorage
    router.push("/dashboard");
  };

  if (!workoutId) return <div className="p-8 text-white animate-pulse">Loading routine...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 min-h-screen bg-zinc-950 text-zinc-50">
      {/* Top Navigation */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              {workoutName}
            </h1>
            <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
              <Timer className="w-4 h-4" /> Session Active
            </p>
          </div>
        </div>
        <button
          onClick={handleCompleteWorkout}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          Finish
        </button>
      </header>

      {/* Exercise List */}
      <div className="space-y-8">
        {exercises.map((exercise, idx) => (
          <div key={exercise.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-zinc-800/50 px-5 py-3 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-zinc-100">
                {idx + 1}. {exercise.name}
              </h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-lg">
                {exercise.targetMuscle}
              </span>
            </div>

            <div className="p-5 space-y-3">
              {/* Table Headers */}
              <div className="grid grid-cols-4 text-xs font-medium text-zinc-500 mb-2 px-2">
                <div>SET</div>
                <div>LBS</div>
                <div>REPS</div>
                <div className="text-right">DONE</div>
              </div>

              {/* Set Rows */}
              {exercise.sets.map((set) => (
                <div
                  key={set.id}
                  className={`grid grid-cols-4 items-center gap-4 p-2 rounded-xl transition-colors ${
                    set.isCompleted ? "bg-emerald-900/20" : "hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-400 pl-2">
                    {set.setNumber}
                  </div>
                  
                  <div>
                    <input
                      type="number"
                      value={set.weight || ""}
                      placeholder="0"
                      onChange={(e) =>
                        updateSetMetrics(exercise.id, set.id, { weight: Number(e.target.value) })
                      }
                      disabled={set.isCompleted}
                      className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-center text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateSetMetrics(exercise.id, set.id, { reps: Number(e.target.value) })
                      }
                      disabled={set.isCompleted}
                      className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-center text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="flex justify-end pr-2">
                    <button
                      onClick={() => handleSetToggle(exercise.id, set.id, set)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        set.isCompleted
                          ? "bg-emerald-500 text-zinc-950"
                          : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}