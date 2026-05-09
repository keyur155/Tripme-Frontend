"use client";

import { useState } from "react";
import { Users, Clock, Heart, Shield, X, Dog, Camera, Car, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface HouseRulesProps {
  houseRules?: {
    common: string[];
    additional: Record<string, string>;
  };
  checkInTime?: string;
  checkOutTime?: string;
}

const ruleLabels: Record<string, string> = {
  noSmoking: "No smoking",
  noParties: "No parties or events",
  noPets: "No pets",
  noUnregisteredGuests: "No unregistered guests",
  quietHours: "Quiet hours",
  checkInRestrictions: "Check-in time restrictions",
  checkOutRestrictions: "Check-out time restrictions",
  noFoodInBedrooms: "No food or drink in bedrooms",
  shoesOff: "Shoes off indoors",
  noChildren: "No children under 12",
  noFilming: "No filming or photography",
  additionalGuestsFee: "Additional guests fee applies",
  securityDeposit: "Security deposit required",
  idVerification: "ID verification required",
};

const ruleIcons: Record<string, any> = {
  noSmoking: X,
  noParties: Users,
  noPets: Heart,
  noUnregisteredGuests: Users,
  quietHours: Clock,
  checkInRestrictions: Clock,
  checkOutRestrictions: Clock,
  noFoodInBedrooms: Shield,
  shoesOff: Shield,
  noChildren: Users,
  noFilming: Camera,
  additionalGuestsFee: Users,
  securityDeposit: Shield,
  idVerification: Shield,
};

const additionalRulesConfig = [
  { id: "pets", icon: Dog, options: [
    { value: "allowed", label: "Pets allowed" },
    { value: "not_allowed", label: "No pets" },
    { value: "conditional", label: "Pets on request" },
  ]},
  { id: "checkIn", icon: Clock, options: [
    { value: "flexible", label: "Flexible check-in" },
    { value: "strict", label: "Strict check-in time" },
  ]},
  { id: "photography", icon: Camera, options: [
    { value: "allowed", label: "Photography allowed" },
    { value: "not_allowed", label: "No photography" },
    { value: "conditional", label: "Photography with permission" },
  ]},
  { id: "parking", icon: Car, options: [
    { value: "free", label: "Free parking on premises" },
    { value: "paid", label: "Paid parking available" },
    { value: "street", label: "Street parking only" },
    { value: "none", label: "No parking available" },
  ]},
];

export default function HouseRules({
  houseRules = { common: [], additional: {} },
  checkInTime = "15:00",
  checkOutTime = "11:00",
}: HouseRulesProps) {
  const [showAll, setShowAll] = useState(false);

  const commonRulesWithLabels = houseRules.common.map((rule) => ({
    key: rule,
    label:
      ruleLabels[rule] ||
      rule.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
    icon: ruleIcons[rule] || Shield,
  }));

  const additionalRulesWithLabels = Object.entries(houseRules.additional || {}).map(([key, value]) => {
    const ruleConfig = additionalRulesConfig.find((r) => r.id === key);
    const option = ruleConfig?.options.find((o) => o.value === value);
    return { key, label: option?.label || value, icon: ruleConfig?.icon || Shield };
  });

  const allRules = [...commonRulesWithLabels, ...additionalRulesWithLabels];
  const displayRules = showAll ? allRules : allRules.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F5E6D3] flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#C45D3E]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">House rules</h2>
      </div>

      {/* Check-in / Check-out Times */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#FAFAF8] rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#C45D3E]" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</p>
          </div>
          <p className="text-base font-bold text-[#1A1A1A]">After {checkInTime}</p>
        </div>
        <div className="bg-[#FAFAF8] rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#2D5F3A]" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</p>
          </div>
          <p className="text-base font-bold text-[#1A1A1A]">Before {checkOutTime}</p>
        </div>
      </div>

      {/* Rules List */}
      {allRules.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayRules.map((rule, index) => {
              const Icon = rule.icon || Shield;
              return (
                <div key={index} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 bg-[#F5E6D3] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#C45D3E]" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{rule.label}</p>
                </div>
              );
            })}
          </div>

          {allRules.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#C45D3E] hover:text-[#A84B32] transition-colors"
            >
              {showAll ? (
                <><ChevronUp className="w-4 h-4" /> Show fewer rules</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> Show all {allRules.length} rules</>
              )}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-[#F5E6D3] rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-[#C45D3E]" />
          </div>
          <p className="text-gray-700 font-medium">No specific house rules</p>
          <p className="text-sm text-gray-500 mt-1">Standard TripMe policies apply</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          By booking this property, you agree to these house rules and TripMe&apos;s{" "}
          <a href="#" className="text-[#C45D3E] hover:underline font-medium">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-[#C45D3E] hover:underline font-medium">Guest Refund Policy</a>.
        </p>
      </div>
    </div>
  );
}
