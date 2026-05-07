"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/core/store/auth-context';
import { apiClient } from '@/infrastructure/api/clients/api-client';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Users,
  Home,
  BookOpen,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function AdminAnalytics() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    revenue: { total: 0, growth: 0 },
    users: { total: 0, growth: 0 },
    bookings: { total: 0, growth: 0 },
    properties: { total: 0, growth: 0 },
    monthlyRevenue: [],
    topDestinations: [],
    userGrowth: [],
    bookingTrends: [],
    bookingAnalytics: {
      completed: { count: 0, percentage: 0 },
      pending: { count: 0, percentage: 0 },
      cancelled: { count: 0, percentage: 0 }
    },
    propertyAnalytics: {
      published: { count: 0, percentage: 0 },
      draft: { count: 0, percentage: 0 },
      suspended: { count: 0, percentage: 0 }
    },
    userAnalytics: {
      guests: { count: 0, percentage: 0 },
      hosts: { count: 0, percentage: 0 },
      verifiedHosts: { count: 0, percentage: 0 }
    },
    geographicDistribution: []
  });

  useEffect(() => {
    if (isAdmin()) {
      fetchAnalyticsData();
    }
  }, [isAdmin, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminDashboardStats();
      console.log('📊 Analytics API Response:', response);
      if (response.success && response.data) {
        const data = response.data;
        console.log('📊 Analytics Data:', data);
        
        const bookingTotal = (data.bookings?.completed || 0) + (data.bookings?.pending || 0) + (data.bookings?.cancelled || 0);
        const propertyTotal = (data.properties?.published || 0) + (data.properties?.draft || 0) + (data.properties?.suspended || 0);
        const userTotal = (data.users?.guests || 0) + (data.users?.hosts || 0);
        
        setAnalyticsData({
          revenue: {
            total: data.revenue?.total || 0,
            growth: data.revenue?.growth || 0
          },
          users: {
            total: data.users?.total || 0,
            growth: data.users?.growth || 0
          },
          bookings: {
            total: data.bookings?.total || 0,
            growth: data.bookings?.growth || 0
          },
          properties: {
            total: data.properties?.total || 0,
            growth: data.properties?.growth || 0
          },
          monthlyRevenue: data.monthlyRevenue || [],
          topDestinations: data.topDestinations || [],
          userGrowth: data.userGrowth || [],
          bookingTrends: data.bookingTrends || [],
          bookingAnalytics: {
            completed: {
              count: data.bookings?.completed || 0,
              percentage: bookingTotal > 0 ? ((data.bookings?.completed || 0) / bookingTotal) * 100 : 0
            },
            pending: {
              count: data.bookings?.pending || 0,
              percentage: bookingTotal > 0 ? ((data.bookings?.pending || 0) / bookingTotal) * 100 : 0
            },
            cancelled: {
              count: data.bookings?.cancelled || 0,
              percentage: bookingTotal > 0 ? ((data.bookings?.cancelled || 0) / bookingTotal) * 100 : 0
            }
          },
          propertyAnalytics: {
            published: {
              count: data.properties?.published || 0,
              percentage: propertyTotal > 0 ? ((data.properties?.published || 0) / propertyTotal) * 100 : 0
            },
            draft: {
              count: data.properties?.draft || 0,
              percentage: propertyTotal > 0 ? ((data.properties?.draft || 0) / propertyTotal) * 100 : 0
            },
            suspended: {
              count: data.properties?.suspended || 0,
              percentage: propertyTotal > 0 ? ((data.properties?.suspended || 0) / propertyTotal) * 100 : 0
            }
          },
          userAnalytics: {
            guests: {
              count: data.users?.guests || 0,
              percentage: userTotal > 0 ? ((data.users?.guests || 0) / userTotal) * 100 : 0
            },
            hosts: {
              count: data.users?.hosts || 0,
              percentage: userTotal > 0 ? ((data.users?.hosts || 0) / userTotal) * 100 : 0
            },
            verifiedHosts: {
              count: data.users?.verifiedHosts || 0,
              percentage: (data.users?.hosts || 0) > 0 ? ((data.users?.verifiedHosts || 0) / (data.users?.hosts || 0)) * 100 : 0
            }
          },
          geographicDistribution: data.geographicDistribution || []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Loading analytics...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-3 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="mt-2 text-sm md:text-lg text-gray-600">
                  Detailed insights and performance metrics for TripMe platform
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Revenue: ₹{analyticsData.revenue.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Users: {analyticsData.users.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Bookings: {analyticsData.bookings.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white/70 px-3 md:px-4"
                  >
                    <Download className="w-4 h-4 mr-4" />
                    Export
                  </Button>
                  <Button 
                    onClick={fetchAnalyticsData}
                    className="bg-purple-600 hover:bg-purple-700 px-3 md:px-4"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {/* Total Revenue */}
            <Card className="p-3 md:p-6 shadow-md border-white/20 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded-md">
                    {analyticsData.revenue.growth >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-[10px] md:text-sm font-bold ${analyticsData.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analyticsData.revenue.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-tight">Revenue</p>
                  <p className="text-sm md:text-2xl font-black text-gray-900 break-words">
                    ₹{analyticsData.revenue.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Active Users */}
            <Card className="p-3 md:p-6 shadow-md border-white/20 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center bg-blue-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-[10px] md:text-sm font-bold text-green-600">
                      +{analyticsData.users.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-tight">Users</p>
                  <p className="text-sm md:text-2xl font-black text-gray-900">
                    {analyticsData.users.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Bookings */}
            <Card className="p-3 md:p-6 shadow-md border-white/20 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center bg-purple-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-[10px] md:text-sm font-bold text-green-600">
                      +{analyticsData.bookings.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-tight">Bookings</p>
                  <p className="text-sm md:text-2xl font-black text-gray-900">
                    {analyticsData.bookings.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Properties */}
            <Card className="p-3 md:p-6 shadow-md border-white/20 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4 md:w-6 md:h-6 text-orange-600" />
                  </div>
                  <div className="flex items-center bg-orange-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-[10px] md:text-sm font-bold text-green-600">
                      +{analyticsData.properties.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-tight">Properties</p>
                  <p className="text-sm md:text-2xl font-black text-gray-900">
                    {analyticsData.properties.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <Button variant="outline" size="sm">
                  <LineChart className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Revenue chart will be displayed here</p>
                </div>
              </div>
            </Card>

            {/* User Growth Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">User growth chart will be displayed here</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Analytics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-medium">{analyticsData.bookingAnalytics.completed.count} ({analyticsData.bookingAnalytics.completed.percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium">{analyticsData.bookingAnalytics.pending.count} ({analyticsData.bookingAnalytics.pending.percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cancelled</span>
                  <span className="text-sm font-medium">{analyticsData.bookingAnalytics.cancelled.count} ({analyticsData.bookingAnalytics.cancelled.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            </Card>

            {/* Property Analytics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="text-sm font-medium">{analyticsData.propertyAnalytics.published.count} ({analyticsData.propertyAnalytics.published.percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Draft</span>
                  <span className="text-sm font-medium">{analyticsData.propertyAnalytics.draft.count} ({analyticsData.propertyAnalytics.draft.percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Suspended</span>
                  <span className="text-sm font-medium">{analyticsData.propertyAnalytics.suspended.count} ({analyticsData.propertyAnalytics.suspended.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            </Card>

            {/* User Analytics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Guests</span>
                  <span className="text-sm font-medium">{analyticsData.userAnalytics.guests.count} ({analyticsData.userAnalytics.guests.percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hosts</span>
                  <span className="text-sm font-medium">{analyticsData.userAnalytics.hosts.count} ({analyticsData.userAnalytics.hosts.percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verified Hosts</span>
                  <span className="text-sm font-medium">{analyticsData.userAnalytics.verifiedHosts.count} ({analyticsData.userAnalytics.verifiedHosts.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Geographic Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
              <Button variant="outline" size="sm">
                <PieChart className="w-4 h-4 mr-2" />
                View Map
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.geographicDistribution.length > 0 ? (
                analyticsData.geographicDistribution.map((location: any, index: number) => {
                  const colors = [
                    { bg: 'bg-blue-50', text: 'text-blue-900', value: 'text-blue-600' },
                    { bg: 'bg-green-50', text: 'text-green-900', value: 'text-green-600' },
                    { bg: 'bg-purple-50', text: 'text-purple-900', value: 'text-purple-600' },
                    { bg: 'bg-orange-50', text: 'text-orange-900', value: 'text-orange-600' }
                  ];
                  const color = colors[index % colors.length];
                  return (
                    <div key={index} className={`text-center p-4 ${color.bg} rounded-lg`}>
                      <h4 className={`font-semibold ${color.text}`}>{location.name}</h4>
                      <p className={`text-2xl font-bold ${color.value}`}>{location.percentage}%</p>
                      <p className={`text-sm ${color.value}`}>{location.bookings} bookings</p>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center p-4 text-gray-500">
                  No geographic data available
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}