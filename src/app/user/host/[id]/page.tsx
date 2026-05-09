"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useHostContext } from "@/core/store/useHostStore";
import HostBottomSheet from "@/components/rooms/host-section/HostBottomSheet";
import HostDesktopLayout from "@/components/rooms/host-section/HostDesktopLayout";
import { ArrowLeft, UserX } from "lucide-react";

export default function HostPage() {
  const params = useParams();
  const hostId = params.id as string;
  const { host, hostListings, loading, error, fetchHost, fetchHostListings } = useHostContext();
  const router = useRouter();

  useEffect(() => {
    if (hostId && !host && !loading) {
      fetchHost(hostId);
    }
  }, [hostId, host, loading, fetchHost]);

  useEffect(() => {
    if (hostId && !loading) {
      fetchHostListings(hostId);
    }
  }, [fetchHostListings, hostId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
            {/* Skeleton - Profile Card */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-6 w-36 bg-gray-200 rounded-lg animate-pulse mt-4" />
                <div className="h-4 w-20 bg-gray-100 rounded-lg animate-pulse mt-2" />
                <div className="border-t border-gray-100 my-6 w-full" />
                <div className="grid grid-cols-3 gap-4 w-full">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-6 w-10 bg-gray-200 rounded animate-pulse mx-auto" />
                      <div className="h-3 w-14 bg-gray-100 rounded animate-pulse mx-auto mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skeleton - Content */}
            <div className="space-y-8">
              <div>
                <div className="h-8 w-56 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex gap-3 mt-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-9 w-32 bg-gray-100 rounded-full animate-pulse" />
                  ))}
                </div>
                <div className="space-y-2 mt-6">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-3/5 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div>
                <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse mb-5" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !host) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserX className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Host not found</h1>
          <p className="text-gray-500 mb-8">
            {error || "We couldn't find this host profile. They may have removed their account or the link might be incorrect."}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <HostBottomSheet host={host} />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <HostDesktopLayout host={host} hostListings={hostListings} />
      </div>
    </>
  );
}
