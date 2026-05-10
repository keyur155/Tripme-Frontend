"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/store/auth-context';
import { 
  Home, 
  Briefcase, 
  Calendar, 
  Plus,
  RefreshCw, 
  CheckCircle, 
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  ArrowUpRight,
  IndianRupee,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { apiClient } from '@/infrastructure/api/clients/api-client';

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalEarnings: number;
  recentBookings: RecentBooking[];
  occupancyRate?: number;
  currentBookings?: number;
}

interface RecentBooking {
  _id: string;
  user: {
    _id: string;
    name: string;
    fullName?: string;
    profileImage?: string;
  };
  listing?: {
    _id: string;
    title: string;
    images?: string[];
  };
  service?: {
    _id: string;
    title: string;
    media?: string[];
  };
  checkIn?: Date;
  checkOut?: Date;
  timeSlot?: {
    startTime: Date;
    endTime: Date;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
  totalAmount: number;
  createdAt: Date;
}

const HostDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    recentBookings: [],
    occupancyRate: 0,
    currentBookings: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
    
      const response = await apiClient.getDashboardStats();
    
      if (response.success && response.data) {
        let dashboardData: any = response.data;
        
        if (response.data && typeof response.data === 'object' && 'stats' in response.data) {
          dashboardData = response.data.stats;
        }
        
        const processedStats: DashboardStats = {
          totalListings: dashboardData?.totalListings || 0,
          activeListings: dashboardData?.activeListings || 0,
          totalServices: dashboardData?.totalServices || 0,
          activeServices: dashboardData?.activeServices || 0,
          totalBookings: dashboardData?.totalBookings || 0,
          pendingBookings: dashboardData?.pendingBookings || 0,
          completedBookings: dashboardData?.completedBookings || 0,
          totalEarnings: dashboardData?.totalEarnings || 0,
          recentBookings: dashboardData?.recentBookings || [],
          occupancyRate: dashboardData?.occupancyRate || 0,
          currentBookings: dashboardData?.currentBookings || 0
        };
        
        setStats(processedStats);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-50 text-green-700',
      pending: 'bg-amber-50 text-amber-700',
      completed: 'bg-[#FDF8F3] text-[#C45D3E]',
      cancelled: 'bg-red-50 text-red-700',
      expired: 'bg-gray-100 text-gray-600',
    };
    return styles[status] || 'bg-gray-100 text-gray-600';
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(date));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Skeleton Header */}
        <div className="mb-10">
          <div className="h-8 w-72 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-48 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        {/* Skeleton Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse mb-3" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Skeleton Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between py-3">
                <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6 text-center max-w-sm">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'host') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Become a Host</h2>
          <p className="text-gray-500 mb-6">Start earning by hosting guests and offering services</p>
          <button
            onClick={() => router.push('/become-host')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C45D3E] text-white rounded-xl font-semibold hover:bg-[#A84B32] transition-colors"
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const occupancyRate = stats.occupancyRate || (stats.activeListings > 0 
    ? Math.round((stats.currentBookings || 0) / stats.activeListings * 100) 
    : 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your properties today.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Listings</span>
            <div className="w-9 h-9 bg-[#FDF8F3] rounded-xl flex items-center justify-center">
              <Home className="w-4.5 h-4.5 text-[#C45D3E]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalListings}</div>
          <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            {stats.activeListings} active
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Services</span>
            <div className="w-9 h-9 bg-[#FDF8F3] rounded-xl flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-[#C45D3E]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalServices}</div>
          <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            {stats.activeServices} active
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Bookings</span>
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
          <div className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {stats.pendingBookings} pending
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Earnings</span>
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-4.5 h-4.5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalEarnings)}</div>
          <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Total earned
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => {
              localStorage.removeItem('propertyOnboardingData');
              localStorage.removeItem('propertyMainStep');
              localStorage.removeItem('propertySubStep');
              router.push('/host/property/new/onboarding/step-1');
            }}
            className="flex items-center gap-3 p-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors group"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">New listing</div>
              <div className="text-xs text-gray-400">Add property</div>
            </div>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('serviceDraft');
              localStorage.removeItem('serviceStep');
              router.push('/host/service/new');
            }}
            className="flex items-center gap-3 p-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors group"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">New service</div>
              <div className="text-xs text-gray-400">Offer service</div>
            </div>
          </button>

          <button
            onClick={() => router.push('/host/listings')}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <Home className="w-5 h-5 text-gray-700" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-gray-900">Listings</div>
              <div className="text-xs text-gray-500">Manage all</div>
            </div>
          </button>

          <button
            onClick={() => router.push('/host/bookings')}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <Calendar className="w-5 h-5 text-gray-700" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-gray-900">Bookings</div>
              <div className="text-xs text-gray-500">View all</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Recent reservations</h2>
              <button
                onClick={() => router.push('/host/bookings')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {stats.recentBookings.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.recentBookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-white">
                        {(booking.user?.name || booking.user?.fullName || 'G').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {booking.user?.name || booking.user?.fullName || 'Guest'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {booking.listing?.title || booking.service?.title}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(booking.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-700 text-sm">No reservations yet</p>
                <p className="text-xs text-gray-500 mt-1">They&apos;ll show up here once guests start booking.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Occupancy */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Occupancy rate</h3>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-3xl font-bold text-gray-900">{occupancyRate}%</span>
              {occupancyRate > 0 && (
                <span className="text-xs text-green-600 font-medium mb-1">Active</span>
              )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.currentBookings || 0} of {stats.activeListings} properties currently booked
            </p>
          </div>

          {/* Performance Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.completedBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.pendingBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-[#C45D3E] rounded-full" />
                  <span className="text-sm text-gray-600">Current bookings</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.currentBookings || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-[#C45D3E] rounded-full" />
                  <span className="text-sm text-gray-600">Active services</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.activeServices}</span>
              </div>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/host/payouts')}
                className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>Payouts & earnings</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => router.push('/host/service')}
                className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>Manage services</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => router.push('/user/profile')}
                className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>Edit profile</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboardContent;
