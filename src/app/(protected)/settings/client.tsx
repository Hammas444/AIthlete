"use client";

import { useState } from "react";

export default function SettingsClient({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    age: initialData.age || "",
    weight: initialData.weight || "",
    targetWeight: initialData.targetWeight || "",
    height: initialData.height || "",
    gender: initialData.gender || "",
    goal: initialData.goal || "Build Muscle",
    activityLevel: initialData.activityLevel || "Moderately Active",
    equipment: initialData.equipment || "Full Gym",
    dietaryRestrictions: initialData.dietaryRestrictions || "",
    medicalLimitations: initialData.medicalLimitations || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
          targetWeight: formData.targetWeight ? parseInt(formData.targetWeight) : null,
        }),
      });

      if (res.ok) setSaveMessage("Settings saved successfully!");
      else setSaveMessage("Failed to save settings.");
    } catch (error) {
      setSaveMessage("An error occurred.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const inputClasses = "w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm";
  const labelClasses = "block text-sm font-medium text-zinc-400 mb-2 mt-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Biometrics Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">Biometrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClasses} placeholder="e.g., 25" />
          </div>
          <div>
            <label className={labelClasses}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Current Weight (lbs)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} placeholder="e.g., 180" />
          </div>
          <div>
            <label className={labelClasses}>Target Weight (lbs)</label>
            <input type="number" name="targetWeight" value={formData.targetWeight} onChange={handleChange} className={inputClasses} placeholder="e.g., 170" />
          </div>
        </div>
      </div>

      {/* Fitness Profile Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">Fitness Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Primary Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className={inputClasses}>
              <option value="Build Muscle">Build Muscle</option>
              <option value="Lose Fat">Lose Fat</option>
              <option value="Maintain Health">Maintain Health</option>
              <option value="Improve Endurance">Improve Endurance</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Available Equipment</label>
            <select name="equipment" value={formData.equipment} onChange={handleChange} className={inputClasses}>
              <option value="Full Gym">Full Commercial Gym</option>
              <option value="Home Gym (Dumbbells/Bands)">Home Gym (Dumbbells/Bands)</option>
              <option value="Bodyweight Only">Bodyweight Only</option>
            </select>
          </div>
        </div>
        
        <label className={labelClasses}>Dietary Restrictions</label>
        <input type="text" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} className={inputClasses} placeholder="e.g., Vegan, Lactose Intolerant, None" />

        <label className={labelClasses}>Injuries or Medical Limitations</label>
        <textarea name="medicalLimitations" value={formData.medicalLimitations} onChange={handleChange} rows={3} className={inputClasses} placeholder="e.g., Bad lower back, recovering from shoulder surgery..." />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl sticky bottom-4 shadow-2xl">
        <span className="text-emerald-400 text-sm font-medium">{saveMessage}</span>
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] text-white px-8 py-3 rounded-xl font-medium transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}