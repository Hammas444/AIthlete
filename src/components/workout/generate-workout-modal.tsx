"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { generateAndSaveWorkout } from "@/actions/ai-generate";
import { useRouter } from "next/navigation";

export function GenerateWorkoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [goal, setGoal] = useState("Muscle Hypertrophy");
  const [equipment, setEquipment] = useState("Full Gym");
  
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await generateAndSaveWorkout({
        goal,
        equipment,
        targetDate: new Date(), // Schedules it for today
      });

      if (result.success) {
        setIsOpen(false);
        router.refresh(); // Tells Next.js to reload the Dashboard to show the new routine
      } else {
        alert("Failed to generate: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
      >
        <Plus className="w-4 h-4" />
        Generate Plan
      </button>

      {/* The Popup Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute cursor-pointer top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-100 mb-2">Create New Workout</h2>
            <p className="text-sm text-zinc-400 mb-6">Tell the AI what you want to achieve today.</p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 ml-1">Primary Goal</label>
                <input 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Fat loss and core strength"
                  className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none text-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 ml-1">Available Equipment</label>
                <input 
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="e.g., Just dumbbells and a bench"
                  className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none text-zinc-200"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="cursor-pointer w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Generate Routine"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}