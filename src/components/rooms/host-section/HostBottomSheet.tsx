"use client";

import { X, Star, ShieldCheck, Clock, MessageCircle, Calendar, MapPin, Globe, Award, Home, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HostBottomSheet({ host }: { host: any }) {
  const router = useRouter();

  const memberSince = host.createdAt
    ? new Date(host.createdAt).getFullYear()
    : new Date().getFullYear();

  const yearsHosting = new Date().getFullYear() - memberSince;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute bottom-0 w-full bg-white rounded-t-3xl h-[92vh] overflow-y-auto">
        {/* Handle Bar */}
        <div className="sticky top-0 bg-white z-10 pt-3 pb-2 px-5 border-b border-gray-100 rounded-t-3xl">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Host Profile</h2>
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100">
                {host.profileImage ? (
                  <img
                    src={host.profileImage}
                    alt={host.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {host.name?.charAt(0)?.toUpperCase() || "H"}
                    </span>
                  </div>
                )}
              </div>
              {host.isSuperhost && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 shadow-sm">
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                    <Award className="w-3 h-3 text-amber-500" />
                    Superhost
                  </div>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{host.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Host</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 bg-gray-50 rounded-2xl p-4 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{host.reviewCount || 0}</div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-0.5">
                {host.rating || "New"}
                {host.rating && <Star className="w-3 h-3 fill-gray-900 text-gray-900" />}
              </div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{yearsHosting || "<1"}</div>
              <div className="text-xs text-gray-500">{yearsHosting === 1 ? "Year" : "Years"}</div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2">
            {host.location?.city && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-700">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {host.location.city}{host.location.state ? `, ${host.location.state}` : ""}
              </div>
            )}
            {host.languages && host.languages.length > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-700">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                {host.languages.join(", ")}
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Joined {memberSince}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* About */}
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-2">About {host.name}</h3>
            {host.bio ? (
              <p className="text-sm text-gray-700 leading-relaxed">{host.bio}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">No bio available yet.</p>
            )}
          </section>

          {/* Highlights */}
          {(host.responseRate || host.responseTime || host.isSuperhost) && (
            <>
              <div className="border-t border-gray-100" />
              <section>
                <h3 className="text-base font-bold text-gray-900 mb-3">Highlights</h3>
                <div className="space-y-3">
                  {host.isSuperhost && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Superhost</p>
                        <p className="text-xs text-gray-500">Experienced, highly rated host</p>
                      </div>
                    </div>
                  )}
                  {host.responseRate && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FDF8F3] flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-[#C45D3E]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{host.responseRate}% response rate</p>
                        <p className="text-xs text-gray-500">Responds to messages quickly</p>
                      </div>
                    </div>
                  )}
                  {host.responseTime && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Responds within {host.responseTime}</p>
                        <p className="text-xs text-gray-500">Average response time</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* Verified Info */}
          <div className="border-t border-gray-100" />
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">Verified information</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Identity verified</span>
              </div>
              {host.email && (
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Email address</span>
                </div>
              )}
              {host.phone && (
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Phone number</span>
                </div>
              )}
            </div>
          </section>

          {/* Bottom padding for safe area */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
