"use client";

import Link from "next/link";
import { Star, ShieldCheck, MessageCircle, ChevronRight } from "lucide-react";

export default function HostCard({ host }: { host: any }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#F5E6D3] flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-[#C45D3E]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Meet your host</h2>
      </div>

      <Link href={`/user/host/${host.id}`} className="block group">
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-[#FAFAF8] hover:border-[#F5E6D3] hover:bg-[#FDF8F3] transition-colors">
          <div className="relative flex-shrink-0">
            <img
              src={host.profileImage || '/placeholder-avatar.png'}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              alt={host.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(host.name || 'H')}&background=F5E6D3&color=C45D3E`;
              }}
            />
            {host.superhost && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#C45D3E] rounded-full flex items-center justify-center border-2 border-white">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1A1A1A] text-base">Hosted by {host.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-3.5 h-3.5 fill-[#B8860B] text-[#B8860B]" />
                <span className="font-semibold text-[#1A1A1A]">{host.rating || 0}</span>
                <span className="text-gray-400">·</span>
                <span>{host.reviewCount || 0} reviews</span>
              </div>
              {host.superhost && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C45D3E]">
                  <ShieldCheck className="w-3 h-3" />
                  Superhost
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C45D3E] transition-colors flex-shrink-0" />
        </div>
      </Link>
    </div>
  );
}
