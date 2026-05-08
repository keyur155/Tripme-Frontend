"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, Clock, MessageCircle, Calendar, MapPin, Globe, Award, Home, CheckCircle2 } from "lucide-react";
import StayCard from "@/components/trips/StayCard";

interface HostDesktopLayoutProps {
  host: any;
  hostListings: any[];
}

export default function HostDesktopLayout({ host, hostListings }: HostDesktopLayoutProps) {
  const router = useRouter();

  const memberSince = host.createdAt
    ? new Date(host.createdAt).getFullYear()
    : new Date().getFullYear();

  const yearsHosting = new Date().getFullYear() - memberSince;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
          
          {/* Left Column - Profile Card (Sticky) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8 text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 mx-auto">
                  {host.profileImage ? (
                    <img
                      src={host.profileImage}
                      alt={host.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {host.name?.charAt(0)?.toUpperCase() || "H"}
                      </span>
                    </div>
                  )}
                </div>
                {host.isSuperhost && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      Superhost
                    </div>
                  </div>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-900 mt-3">{host.name}</h1>
              {host.role === 'host' && (
                <p className="text-sm text-gray-500 mt-1">Host</p>
              )}

              {/* Divider */}
              <div className="border-t border-gray-100 my-6" />

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{host.reviewCount || 0}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Reviews</div>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                    {host.rating || "New"}
                    {host.rating && <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{yearsHosting || "<1"}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{yearsHosting === 1 ? "Year" : "Years"} hosting</div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-6" />

              {/* Verified Info */}
              <div className="space-y-3 text-left">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Confirmed information
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Identity verified</span>
                  </div>
                  {host.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Email address</span>
                    </div>
                  )}
                  {host.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Phone number</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Host Details */}
          <div className="space-y-10">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                About {host.name}
              </h2>
              
              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3 mt-4 mb-6">
                {host.location?.city && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Lives in {host.location.city}{host.location.state ? `, ${host.location.state}` : ""}
                  </div>
                )}
                {host.languages && host.languages.length > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Speaks {host.languages.join(", ")}
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Joined in {memberSince}
                </div>
              </div>

              {/* Bio */}
              {host.bio ? (
                <p className="text-gray-700 leading-relaxed text-base">{host.bio}</p>
              ) : (
                <p className="text-gray-500 italic">This host hasn&apos;t added a bio yet.</p>
              )}
            </section>

            {/* Host Highlights */}
            {(host.responseRate || host.responseTime || host.isSuperhost) && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  {host.name}&apos;s highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {host.isSuperhost && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Superhost</h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Experienced, highly rated hosts who are committed to providing great stays
                        </p>
                      </div>
                    </div>
                  )}
                  {host.responseRate && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-[#FDF8F3] flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-[#C45D3E]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{host.responseRate}% response rate</h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Typically responds to messages quickly
                        </p>
                      </div>
                    </div>
                  )}
                  {host.responseTime && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Response time: {host.responseTime}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Average time to respond to inquiries
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {hostListings?.length || 0} {(hostListings?.length || 0) === 1 ? "listing" : "listings"}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Properties available for booking
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Host Listings */}
            {hostListings && hostListings.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {host.name}&apos;s listings
                  </h2>
                  {hostListings.length > 3 && (
                    <span className="text-sm text-gray-500">
                      Showing all {hostListings.length} listings
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {hostListings.map((listing: any) => (
                    <StayCard
                      key={listing._id}
                      stay={listing}
                      className="w-full"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty Listings State */}
            {(!hostListings || hostListings.length === 0) && (
              <section className="text-center py-12 bg-gray-50 rounded-2xl">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">No listings yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  This host hasn&apos;t published any properties yet.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
