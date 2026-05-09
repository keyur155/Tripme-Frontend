"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "@/components/host/OnboardingLayout";
import { serviceOnboarding } from "@/core/context/ServiceContext";


const UNIT_LIMITS = {
  minutes: { min: 15, max: 480 }, // 15 min to 8 hours (480 min)
  hours: { min: 1, max: 24 }, // 1 to 24 hours
  days: { min: 1, max: 30 } // 1 to 30 days
};

export default function ServiceDurationPage() {
  const router = useRouter();
  const { data, updateData, goToNextSubStep } = serviceOnboarding();

  const [minDuration, setMinDuration] = useState<number>(
    data.duration?.minDuration || 2
  );
  const [maxDuration, setMaxDuration] = useState<number>(
    data.duration?.maxDuration || 4
  );
  const [unit, setUnit] = useState<
  "minutes" | "hours" | "days"
>(() => {
  // ✅ Load saved unit directly without conversion
  const savedUnit = data.duration?.unit;
  return savedUnit || "hours"; // ✅ Don't convert, just use as-is
});

  const limits = UNIT_LIMITS[unit];
  const isValid =
    minDuration >= limits.min &&
    maxDuration >= minDuration &&
    maxDuration <= limits.max;

  const handleNext = () => {
    if (!isValid) return;

    updateData({
      duration: {
        minDuration,
        maxDuration,
        unit,
      },
    });

    const nextUrl = goToNextSubStep();
    if (nextUrl) router.push(nextUrl);
  };

  return (
    <OnboardingLayout
      flow="service"
      currentMainStep={3}
      currentSubStep="duration"
      nextDisabled={!isValid}
      onNext={handleNext}
    >
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-3">
        How long does your service last?
      </h1>

      <p className="text-gray-500 mb-8">
        Give guests a realistic time range.
      </p>

      {/* Duration range */}
      <div className="max-w-md space-y-6">
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={limits.min}
            max={limits.max}
            value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value))}
            className="w-full text-xl px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
          />

          <span className="text-gray-500 font-medium">to</span>

          <input
            type="number"
            min={minDuration}
            max={limits.max}
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="w-full text-xl px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Unit selector */}
        <select
          value={unit}
          onChange={(e) =>
           setUnit(e.target.value as "minutes" | "hours" | "days")
          }
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
        >
          <option value="hours">Hours</option>
          <option value="minutes">Minutes</option>
          <option value="days">Days</option>
        
        </select>

        <p className="text-sm text-gray-400">
          Example: 2–4 hours
        </p>

        {!isValid && (
          <p className="text-sm text-red-500">
            Maximum duration must be greater than or equal to minimum.
          </p>
        )}
      </div>
    </OnboardingLayout>
  );
}
