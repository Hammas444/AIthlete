import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// TypeScript interfaces matching our database schema expectations
export interface SetLog {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  isCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  order: number;
  sets: SetLog[];
}

export interface ActiveWorkoutState {
  workoutId: string | null;
  workoutName: string | null;
  exercises: Exercise[];
  isActive: boolean;
  startTime: number | null; // Timestamp to track duration
  
  // State Mutation Actions
  startWorkout: (id: string, name: string, exercises: Exercise[]) => void;
  updateSetMetrics: (exerciseId: string, logId: string, metrics: Partial<Omit<SetLog, 'id' | 'setNumber'>>) => void;
  toggleSetCompletion: (exerciseId: string, logId: string) => void;
  cancelWorkout: () => void;
  finishWorkout: () => void;
}

/**
 * A persistent state hook tracking live workout execution.
 * Saves current gym-floor telemetry securely to localStorage.
 */
export const useActiveWorkout = create<ActiveWorkoutState>()(
  persist(
    (set) => ({
      workoutId: null,
      workoutName: null,
      exercises: [],
      isActive: false,
      startTime: null,

      startWorkout: (id, name, exercises) => set({
        workoutId: id,
        workoutName: name,
        exercises: exercises.sort((a, b) => a.order - b.order), // Guard list ordering
        isActive: true,
        startTime: Date.now()
      }),

      updateSetMetrics: (exerciseId, logId, metrics) => set((state) => ({
        exercises: state.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === logId ? { ...s, ...metrics } : s))
          };
        })
      })),

      toggleSetCompletion: (exerciseId, logId) => set((state) => ({
        exercises: state.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === logId ? { ...s, isCompleted: !s.isCompleted } : s))
          };
        })
      })),

      cancelWorkout: () => set({
        workoutId: null,
        workoutName: null,
        exercises: [],
        isActive: false,
        startTime: null
      }),

      finishWorkout: () => set({
        workoutId: null,
        workoutName: null,
        exercises: [],
        isActive: false,
        startTime: null
      })
    }),
    {
      name: 'active-gym-session-storage', // Key item name inside localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);