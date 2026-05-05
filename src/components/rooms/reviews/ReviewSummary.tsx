// import { Star } from "lucide-react";
// import { ReviewSummary } from "@/shared/types";

// interface ReviewSummaryProps {
//   summary: ReviewSummary;
// }

// export default function ReviewSummary({ summary }: ReviewSummaryProps) {
//   const categories = [
//     { key: 'cleanliness', label: 'Cleanliness' },
//     { key: 'communication', label: 'Communication' },
//     { key: 'checkIn', label: 'Check-in' },
//     { key: 'accuracy', label: 'Accuracy' },
//     { key: 'location', label: 'Location' },
//     { key: 'value', label: 'Value' }
//   ];

//   const totalPercentage = summary.totalReviews > 0 ? 100 : 0;

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-sm border">
//       <h3 className="text-xl font-semibold text-gray-900 mb-6">
//         Rating Summary
//       </h3>

//       {/* Overall Rating */}
//       <div className="flex items-center gap-4 mb-8">
//         <div className="text-center">
//           <div className="text-5xl font-bold text-gray-900">
//             {summary.averageRating.toFixed(1)}
//           </div>
//           <div className="flex items-center gap-1 justify-center mt-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 className={`w-5 h-5 ${
//                   star <= Math.round(summary.averageRating)
//                     ? 'fill-yellow-400 text-yellow-400'
//                     : 'text-gray-300'
//                 }`}
//               />
//             ))}
//           </div>
//           <div className="text-sm text-gray-600 mt-1">
//             {summary.totalReviews} reviews
//           </div>
//         </div>

//         {/* Rating Breakdown */}
//         <div className="flex-1 space-y-2">
//           {[5, 4, 3, 2, 1].map((rating) => {
//             const count = summary.ratingBreakdown[rating as keyof typeof summary.ratingBreakdown];
//             const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
            
//             return (
//               <div key={rating} className="flex items-center gap-3">
//                 <div className="flex items-center gap-1 w-16">
//                   <span className="text-sm">{rating}</span>
//                   <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                 </div>
//                 <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
//                   <div
//                     className="bg-yellow-400 h-full rounded-full transition-all duration-300"
//                     style={{ width: `${percentage}%` }}
//                   />
//                 </div>
//                 <span className="text-sm text-gray-600 w-12 text-right">
//                   {count}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Category Ratings */}
//       <div className="border-t pt-6">
//         <h4 className="font-medium text-gray-900 mb-4">Category Ratings</h4>
//         <div className="grid grid-cols-2 gap-4">
//           {categories.map(({ key, label }) => {
//             const rating = summary.categoryAverages[key as keyof typeof summary.categoryAverages];
            
//             return (
//               <div key={key} className="flex items-center justify-between">
//                 <span className="text-sm text-gray-700">{label}</span>
//                 <div className="flex items-center gap-2">
//                   <div className="flex">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         className={`w-3 h-3 ${
//                           star <= Math.round(rating)
//                             ? 'fill-yellow-400 text-yellow-400'
//                             : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <span className="text-sm font-medium">{rating.toFixed(1)}</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Sparkles,
  ShieldCheck,
  KeyRound,
  MessageSquare,
  Map,
  BadgeCheck,
  Tags,
  Crown
} from "lucide-react";

import { ReviewSummary } from "@/shared/types";

interface ReviewTag {
  label: string;
  count: number;
  icon?: string;
}

interface ReviewSummaryProps {
  summary: ReviewSummary;
  badge: any;
  tags?: ReviewTag[];
}


export default function ReviewSummaryAirbnb({ summary, badge, tags = [] }: ReviewSummaryProps) {
  const categories = [
    { key: "cleanliness", label: "Cleanliness", icon: Sparkles },
    { key: "accuracy", label: "Accuracy", icon: BadgeCheck },
    { key: "checkIn", label: "Check-in", icon: KeyRound },
    { key: "communication", label: "Communication", icon: MessageSquare },
    { key: "location", label: "Location", icon: Map },
    { key: "value", label: "Value", icon: Tags },
  ];

  const heroBadge = badge;

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        {/* TOP SECTION */}
        <div className="flex flex-col items-center text-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
          <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900">
            {Number(summary?.averageRating || 0).toFixed(2)}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-100 shadow-sm">
            <span className="text-emerald-500 text-lg sm:text-xl md:text-2xl">
              {heroBadge.icon}
            </span>
            <span className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
              {heroBadge.label}
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
            This home is a guest favourite based on ratings, reviews and reliability.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="border-t border-gray-200 pt-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max divide-x divide-gray-200 rounded-3xl border border-gray-200 bg-slate-50">
              {/* Overall Rating Column */}
              <div className="flex flex-col gap-4 px-5 py-6 min-w-[190px]">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Overall rating
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      summary.ratingBreakdown[
                        rating as keyof typeof summary.ratingBreakdown
                      ];
                    const percentage =
                      summary.totalReviews > 0
                        ? (count / summary.totalReviews) * 100
                        : 0;

                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="w-4 text-xs font-medium text-gray-600">
                          {rating}
                        </span>
                        <div className="flex-1 h-[3px] rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-slate-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs text-gray-400">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Columns */}
              {categories.map(({ key, label, icon: Icon }) => {
                const rating =
                  summary.categoryAverages[
                    key as keyof typeof summary.categoryAverages
                  ];

                return (
                  <div
                    key={key}
                    className="flex min-w-[170px] flex-col items-start justify-between gap-2.5 px-6 py-6 text-left sm:min-w-[190px] lg:items-center lg:text-center bg-white"
                  >
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">
                      {label}
                    </span>
                    <span className="text-[28px] font-semibold text-gray-900">
                      {Number(rating || 0).toFixed(1)}
                    </span>
                    <Icon className="h-6 w-6 text-[#4285F4]" aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* TAG CHIPS — Only render if tags exist */}
          {tags.length > 0 && (
            <div className="mt-6 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-3 pb-2">
                {tags.map((tag, index) => (
                  <button
                    key={tag.label}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 whitespace-nowrap flex-shrink-0 transition-colors"
                  >
                    <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {tag.icon || index + 1}
                    </span>
                    <span>{tag.label}</span>
                    {tag.count > 0 && (
                      <span className="text-gray-400 text-xs">{tag.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


