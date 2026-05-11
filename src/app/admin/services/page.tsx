"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { apiClient } from '@/infrastructure/api/clients/api-client';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search,
  Filter,
  Briefcase
} from 'lucide-react';

interface Service {
  id: string;
  _id: string;
  title: string;
  provider: {
    name: string;
    email: string;
  };
  status: 'draft' | 'published' | 'suspended' | 'deleted';
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  serviceType: string;
  location: {
    city: string;
    country: string;
    address: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  createdAt: string;
  rejectionReason?: string;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminServices();
      
      if (response.success && response.data) {
        setServices(response.data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = (services || []).filter(service => {
    const matchesSearch = (service.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.provider?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.location?.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesApproval = approvalFilter === 'all' || service.approvalStatus === approvalFilter;
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const getStatusBadge = (status: string, approvalStatus: string | null) => {
    if (approvalStatus === 'pending') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Pending Approval
      </span>;
    }
    
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Published
        </span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Draft
        </span>;
      case 'suspended':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Suspended
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  const handleApprove = async (serviceId: string) => {
    if (!confirm('Are you sure you want to approve this service?')) return;
    try {
      const response = await apiClient.approveService(serviceId);
      if (response.success) {
        setServices(services.map(service => 
          (service._id || service.id) === serviceId 
            ? { ...service, approvalStatus: 'approved' as const }
            : service
        ));
      }
    } catch (error) {
      console.error('Error approving service:', error);
    }
  };

  const handleReject = async (serviceId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        const response = await apiClient.rejectService(serviceId, reason);
        if (response.success) {
          setServices(services.map(service => 
            (service._id || service.id) === serviceId 
              ? { ...service, approvalStatus: 'rejected' as const, rejectionReason: reason }
              : service
          ));
        }
      } catch (error) {
        console.error('Error rejecting service:', error);
      }
    }
  };

  const handleView = (serviceId: string) => {
    window.open(`/services/${serviceId}`, '_blank');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-3 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Service Management
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage platform services and their approval status
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <span className="text-[11px] md:text-xs font-medium text-gray-600">
                      {services.filter(s => s.status === 'published' && s.approvalStatus === 'approved').length} Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="text-[11px] md:text-xs font-medium text-gray-600">
                      {services.filter(s => s.approvalStatus === 'pending').length} Pending Approval
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search services by title, provider, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 bg-white/50 text-sm"
                >
                  <option value="all">All Approval Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 bg-white/50 text-sm"
                >
                  <option value="all">All Service Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service._id || service.id} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-500">{service.serviceType}</p>
                    </div>
                  </div>
                  {getStatusBadge(service.status, service.approvalStatus)}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 uppercase">Provider</span>
                    <span className="text-xs font-bold text-gray-900">{service.provider?.name || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50/50 rounded-xl border border-green-100">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Price</p>
                      <p className="text-sm font-bold text-green-600">₹{service.pricing?.basePrice?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] uppercase font-bold text-gray-400">City</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{service.location?.city || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => handleView(service._id || service.id)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>

                  {service.approvalStatus === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(service._id || service.id)}
                        className="p-2.5 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all shadow-sm border border-green-200"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(service._id || service.id)}
                        className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all shadow-sm border border-red-200"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
              <p className="text-gray-500">No services match your current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
