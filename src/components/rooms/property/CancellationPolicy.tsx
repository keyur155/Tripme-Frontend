"use client";

import { Calendar, Shield, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface CancellationPolicyProps {
  policy?: "flexible" | "moderate" | "strict" | "super-strict";
  cancellationPolicy?: "flexible" | "moderate" | "strict" | "super-strict";
}

const policyDetails = {
  flexible: {
    title: "Flexible",
    tagline: "Easy to cancel",
    description: "Free cancellation up to 24 hours before check-in",
    details: [
      { text: "Full refund if you cancel at least 24 hours before check-in", positive: true },
      { text: "50% refund if you cancel less than 24 hours before check-in", positive: false },
      { text: "No refund after check-in", positive: false },
    ],
    badge: "bg-[#2D5F3A] text-white",
    ring: "ring-[#2D5F3A]/20",
  },
  moderate: {
    title: "Moderate",
    tagline: "5-day window",
    description: "Free cancellation up to 5 days before check-in",
    details: [
      { text: "Full refund if you cancel at least 5 days before check-in", positive: true },
      { text: "50% refund if you cancel between 5 days and 24 hours before check-in", positive: false },
      { text: "No refund if you cancel less than 24 hours before check-in", positive: false },
    ],
    badge: "bg-[#B8860B] text-white",
    ring: "ring-[#B8860B]/20",
  },
  strict: {
    title: "Strict",
    tagline: "14-day window",
    description: "Free cancellation up to 14 days before check-in",
    details: [
      { text: "Full refund if you cancel at least 14 days before check-in", positive: true },
      { text: "50% refund if you cancel between 14 and 7 days before check-in", positive: false },
      { text: "25% refund if you cancel between 7 days and 48 hours before check-in", positive: false },
      { text: "No refund if you cancel less than 48 hours before check-in", positive: false },
    ],
    badge: "bg-[#C45D3E] text-white",
    ring: "ring-[#C45D3E]/20",
  },
  "super-strict": {
    title: "Super Strict",
    tagline: "30-day window",
    description: "Free cancellation up to 30 days before check-in",
    details: [
      { text: "Full refund if you cancel at least 30 days before check-in", positive: true },
      { text: "50% refund if you cancel between 30 and 14 days before check-in", positive: false },
      { text: "25% refund if you cancel between 14 days and 7 days before check-in", positive: false },
      { text: "No refund if you cancel less than 7 days before check-in", positive: false },
    ],
    badge: "bg-[#1A1A1A] text-white",
    ring: "ring-[#1A1A1A]/10",
  },
};

export default function CancellationPolicy({ policy, cancellationPolicy }: CancellationPolicyProps) {
  const resolvedPolicy = (cancellationPolicy || policy || "moderate") as keyof typeof policyDetails;
  const policyInfo = policyDetails[resolvedPolicy] || policyDetails.moderate;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F5E6D3] flex items-center justify-center">
          <Calendar className="w-5 h-5 text-[#C45D3E]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Cancellation policy</h2>
      </div>

      {/* Policy badge */}
      <div className="flex items-center gap-3 mb-5">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ring-4 ${policyInfo.badge} ${policyInfo.ring}`}>
          <Shield className="w-3.5 h-3.5" />
          {policyInfo.title}
        </span>
        <span className="text-sm text-gray-500">{policyInfo.tagline}</span>
      </div>

      <p className="text-gray-600 text-sm mb-5">{policyInfo.description}</p>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {policyInfo.details.map((detail, index) => (
          <div key={index} className="flex items-start gap-3">
            {detail.positive ? (
              <CheckCircle2 className="w-4 h-4 text-[#2D5F3A] flex-shrink-0 mt-0.5" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-gray-700">{detail.text}</p>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-[#FDF8F3] border border-[#F5E6D3] rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#B8860B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-1">Important information</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              TripMe&apos;s Guest Refund Policy does not cover cancellations due to illness, travel
              restrictions, or other unforeseen circumstances. Consider purchasing travel insurance
              for additional protection.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <a href="#" className="text-xs font-semibold text-[#C45D3E] hover:text-[#A84B32] hover:underline transition-colors">
          Learn more about cancellation policies →
        </a>
      </div>
    </div>
  );
}
