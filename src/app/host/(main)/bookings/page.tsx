"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/store/auth-context';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  User,
  Home,
  Receipt,
  Sparkles,
  Loader2,
  Filter,
  Search
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { apiClient } from '@/infrastructure/api/clients/api-client';

interface Booking {
  _id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'expired';
  checkIn: string;
  checkOut: string;
  checkInTime?: string;   // Custom check-in time (e.g., "16:00")
  checkOutTime?: string;  // Calculated check-out time (e.g., "15:00")
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalAmount: number;
  specialRequests?: string;
  createdAt: string;
  listing?: {
    title: string;
    images: string[];
  };
  service?: {
    title: string;
    media: string[];
  };
  user: {
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
  // Fee breakdown
  serviceFee?: number;
  cleaningFee?: number;
  securityDeposit?: number;
  platformFee?: number;
  hostFee?: number;
  discountAmount?: number;
  paymentStatus?: string;
  // Check-in status
  checkedIn?: boolean;
  checkedInAt?: string;
  checkedInBy?: {
    _id: string;
    name: string;
  };
  checkInNotes?: string;
  hostEarnings?:number
}

const HostBookingsPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);
  const [hostEarning ,setHostEarning] = useState<number>(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getHostBookings();
      
      if (response.success && response.data) {
        const data = response.data as any;
        setBookings(data.bookings || []);
        setHostEarning(data.totalEarnings?.[0]?.total || 0);
      } else {
        setError('Failed to load bookings');
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: 'confirmed' | 'cancelled', reason?: string) => {
    try {
      setUpdatingBooking(bookingId);
      
      // Use appropriate API method based on status
      let response;
      if (status === 'confirmed') {
        response = await apiClient.acceptBooking(bookingId);
      } else if (status === 'cancelled' && reason) {
        response = await apiClient.rejectBooking(bookingId, reason);
      } else {
        // Fallback to updateBookingStatus with just the status string (not object)
        response = await apiClient.updateBookingStatus(bookingId, status);
      }
      
      if (response.success) {
        // Update the booking in the local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status }
            : booking
        ));
      } else {
        alert('Failed to update booking status');
      }
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      alert(err?.message || 'Failed to update booking status');
    } finally {
      setUpdatingBooking(null);
    }
  };

  const handleViewDetails = (bookingId: string) => {
    router.push(`/host/bookings/${bookingId}`);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-[#F5E6D3] text-[#1A1A1A] border-[#F5E6D3]';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = (booking.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (booking.listing?.title || booking.service?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="h-8 w-52 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-72 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="h-4 w-16 bg-gray-100 rounded animate-pulse mb-3" />
              <div className="h-7 w-10 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 h-44 animate-pulse" />
          ))}
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
          <button onClick={fetchBookings} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
              <p className="text-gray-500 mt-1">Manage incoming booking requests</p>
            </div>
            <button
              onClick={() => router.push('/host/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalAmount, 0))}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">₹</span>
                </div>
              </div>
            </Card>
          </div> */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500">Total</span>
      <div className="w-9 h-9 bg-[#FDF8F3] rounded-xl flex items-center justify-center">
        <Receipt className="w-4 h-4 text-[#C45D3E]" />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
  </div>

  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500">Pending</span>
      <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
        <Clock className="w-4 h-4 text-amber-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-amber-600">{bookings.filter(b => b.status === 'pending').length}</div>
  </div>

  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500">Confirmed</span>
      <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
        <CheckCircle className="w-4 h-4 text-green-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</div>
  </div>

  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500">Earnings</span>
      <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
        <span className="text-green-600 font-bold text-sm">₹</span>
      </div>
    </div>
    <div className="text-xl font-bold text-gray-900">{formatPrice(hostEarning || 0)}</div>
  </div>
</div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by guest name or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
         {filteredBookings.length === 0 ? (
  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
      <Calendar className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No reservations found</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
      {bookings.length === 0 
        ? "You haven't received any booking requests yet. Promote your listings to get more bookings."
        : "No bookings match your current filters. Try adjusting your search criteria."
      }
    </p>
    <button
      onClick={() => router.push('/host/listings')}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
    >
      <Home className="w-4 h-4" />
      Manage Listings
    </button>
  </div>
) : (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {filteredBookings.map((booking) => (
      <Card 
        key={booking._id}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
      >
        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <div className="flex flex-col gap-4 flex-1">
            
            {/* 1. Header: Image + Title + Status Badge */}
            <div className="flex gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                <img
                  src={
                    (booking.listing?.images?.[0] as any)?.url || 
                    (typeof booking.listing?.images?.[0] === 'string' ? booking.listing.images[0] : null) ||
                    (booking.service?.media?.[0] as any)?.url ||
                    (typeof booking.service?.media?.[0] === 'string' ? booking.service.media[0] : null) ||
                    '/placeholder-property.jpg'
                  }
                  alt={booking.listing?.title || booking.service?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="font-bold text-gray-900 truncate pr-2">
                    {booking.listing?.title || booking.service?.title}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 mb-2">
                   <User className="w-3 h-3" />
                   {booking.user?.name || 'Guest'} • {booking.guests.adults} guests
                </p>
                {/* Mobile Price Display */}
                <p className="text-lg font-black text-gray-900 md:hidden">
                  {formatPrice(booking.totalAmount)}
                </p>
              </div>
            </div>

            {/* 2. Detail Grid: Dates & Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div className="text-xs">
                  <p className="text-gray-400 font-medium uppercase tracking-tighter">Stay Dates</p>
                  <p className="text-gray-900 font-semibold">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
                </div>
              </div>
              
              {(booking.checkInTime || booking.checkOutTime) && (
                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-3">
                  <Clock className="w-4 h-4 text-[#C45D3E]" />
                  <div className="text-xs flex gap-3">
                    {booking.checkInTime && (
                      <div>
                        <p className="text-gray-400 font-medium uppercase tracking-tighter">In</p>
                        <p className="font-semibold text-[#C45D3E]">{booking.checkInTime}</p>
                      </div>
                    )}
                    {booking.checkOutTime && (
                      <div>
                        <p className="text-gray-400 font-medium uppercase tracking-tighter">Out</p>
                        <p className="font-semibold text-gray-700">{booking.checkOutTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Status Alerts (Checked In / Earnings) */}
            <div className="space-y-2">
              {booking.checkedIn && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle className="w-4 h-4" /> Guest Checked In
                  </div>
                  <span className="text-[10px] opacity-70">{formatDateTime(booking.checkedInAt || '')}</span>
                </div>
              )}

              {booking.hostFee && booking.hostFee > 0 && (
                <div className="flex justify-between items-center p-3 bg-[#FDF8F3] text-[#C45D3E] rounded-xl border border-[#F5E6D3] text-sm">
                  <span className="font-medium">Your Payout:</span>
                  <span className="font-black text-[#1A1A1A]">{formatPrice(booking.hostFee)}</span>
                </div>
              )}
            </div>

            {/* 4. Action Bar */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
              <Button
                onClick={() => handleViewDetails(booking._id)}
                variant="outline"
                className="flex-1 border-gray-200 text-gray-700 font-bold rounded-xl h-12 order-2 sm:order-1"
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </Button>

              <div className="flex gap-2 flex-1 order-1 sm:order-2">
                {booking.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                      disabled={updatingBooking === booking._id}
                      className="flex-1 bg-emerald-600 text-white font-bold rounded-xl h-12 shadow-lg shadow-emerald-100"
                    >
                      {updatingBooking === booking._id ? <Loader2 className="animate-spin" /> : 'Accept'}
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                      disabled={updatingBooking === booking._id}
                      variant="outline"
                      className="w-14 border-red-100 text-red-600 rounded-xl h-12"
                    >
                      <XCircle className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {booking.status === 'confirmed' && (
                   <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100">
                      <CheckCircle className="w-4 h-4" /> Confirmed
                   </div>
                )}

                {booking.status === 'cancelled' && (
                   <div className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 rounded-xl font-bold text-sm border border-red-100">
                      <XCircle className="w-4 h-4" /> Cancelled
                   </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </Card>
    ))}
  </div>
)}
        </div>
      </div>
    );
  };

export default HostBookingsPage; 