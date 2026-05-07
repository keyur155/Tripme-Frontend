"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { apiClient } from '@/infrastructure/api/clients/api-client';
import { 
  Award,
  Search,
  Plus,
  X,
  Check,
  Home,
  Tag,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronDown,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface Badge {
  type: string;
  label: string;
  priority?: number;
}

interface AvailableBadges {
  highlight: Badge[];
  details: Badge[];
  insights: Badge[];
  urgency: Badge[];
}

interface Property {
  _id: string;
  title: string;
  host: {
    name: string;
    email: string;
  };
  location: {
    city: string;
  };
  useAdminBadges: boolean;
  adminBadges: {
    highlight: Badge[];
    details: Badge[];
    insights: Badge[];
    urgency: Badge[];
  };
}

// Badge category icons and colors
const CATEGORY_CONFIG = {
  highlight: { 
    icon: Sparkles, 
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    label: 'Highlight Badges'
  },
  details: { 
    icon: Tag, 
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    label: 'Detail Badges'
  },
  insights: { 
    icon: TrendingUp, 
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    label: 'Insight Badges'
  },
  urgency: { 
    icon: Clock, 
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    label: 'Urgency Badges'
  }
};

export default function AdminBadges() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [availableBadges, setAvailableBadges] = useState<AvailableBadges | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof AvailableBadges>('highlight');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, badgesRes] = await Promise.all([
        apiClient.getAdminListings(),
        apiClient.getAvailableBadges()
      ]);

      if (propertiesRes.success && propertiesRes.data) {
        // Handle both possible response structures - cast to any to access dynamic properties
        const data = propertiesRes.data as any;
        const props = data.properties || data.listings || data || [];
        setProperties(Array.isArray(props) ? props : []);
      }

      if (badgesRes.success && badgesRes.data) {
        setAvailableBadges(badgesRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.host?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenBadgeModal = async (property: Property) => {
    try {
      // Fetch latest badge data for this property
      const response = await apiClient.getPropertyBadges(property._id);
      if (response.success && response.data) {
        setSelectedProperty({
          ...property,
          useAdminBadges: response.data.useAdminBadges || false,
          adminBadges: response.data.adminBadges || { highlight: [], details: [], insights: [], urgency: [] }
        });
      } else {
        setSelectedProperty(property);
      }
      setShowBadgeModal(true);
    } catch (error) {
      console.error('Error fetching property badges:', error);
      setSelectedProperty(property);
      setShowBadgeModal(true);
    }
  };

  const handleAddBadge = async (badge: Badge) => {
    if (!selectedProperty) return;
    
    setSaving(true);
    try {
      const response = await apiClient.addPropertyBadge(selectedProperty._id, {
        category: selectedCategory,
        badge: { type: badge.type, label: badge.label }
      });

      if (response.success && response.data) {
        setSelectedProperty({
          ...selectedProperty,
          useAdminBadges: response.data.useAdminBadges,
          adminBadges: response.data.adminBadges
        });
        // Update in the list
        setProperties(prev => prev.map(p => 
          p._id === selectedProperty._id 
            ? { ...p, useAdminBadges: response.data.useAdminBadges, adminBadges: response.data.adminBadges }
            : p
        ));
      }
    } catch (error) {
      console.error('Error adding badge:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBadge = async (category: keyof AvailableBadges, badgeType: string) => {
    if (!selectedProperty) return;
    
    setSaving(true);
    try {
      const response = await apiClient.removePropertyBadge(selectedProperty._id, {
        category,
        badgeType
      });

      if (response.success && response.data) {
        setSelectedProperty({
          ...selectedProperty,
          useAdminBadges: response.data.useAdminBadges,
          adminBadges: response.data.adminBadges
        });
        // Update in the list
        setProperties(prev => prev.map(p => 
          p._id === selectedProperty._id 
            ? { ...p, useAdminBadges: response.data.useAdminBadges, adminBadges: response.data.adminBadges }
            : p
        ));
      }
    } catch (error) {
      console.error('Error removing badge:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAdminBadges = async () => {
    if (!selectedProperty) return;
    
    setSaving(true);
    try {
      const response = await apiClient.toggleAdminBadges(selectedProperty._id);

      if (response.success && response.data) {
        setSelectedProperty({
          ...selectedProperty,
          useAdminBadges: response.data.useAdminBadges
        });
        // Update in the list
        setProperties(prev => prev.map(p => 
          p._id === selectedProperty._id 
            ? { ...p, useAdminBadges: response.data.useAdminBadges }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling admin badges:', error);
    } finally {
      setSaving(false);
    }
  };

  const getAssignedBadges = (category: keyof AvailableBadges): Badge[] => {
    return selectedProperty?.adminBadges?.[category] || [];
  };

  const isBadgeAssigned = (category: keyof AvailableBadges, badgeType: string): boolean => {
    return getAssignedBadges(category).some(b => b.type === badgeType);
  };

  const getTotalBadgeCount = (property: Property): number => {
    if (!property.adminBadges) return 0;
    return (
      (property.adminBadges.highlight?.length || 0) +
      (property.adminBadges.details?.length || 0) +
      (property.adminBadges.insights?.length || 0) +
      (property.adminBadges.urgency?.length || 0)
    );
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
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Badge Management
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Assign badges like &quot;Guest Favourite&quot; to properties
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search properties by title, host, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProperties.map((property) => (
              <div 
                key={property._id} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Property Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-xs text-gray-500">{property.location?.city || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Badge Status */}
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">Badges Assigned</span>
                    <span className={`text-sm font-bold ${getTotalBadgeCount(property) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {getTotalBadgeCount(property)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {property.useAdminBadges ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Admin Badges Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Dynamic Badges
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleOpenBadgeModal(property)}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Award className="h-4 w-4" />
                  Manage Badges
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No properties available.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Badge Management Modal */}
      {showBadgeModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Manage Badges</h2>
                  <p className="text-purple-100 text-sm mt-1">{selectedProperty.title}</p>
                </div>
                <button
                  onClick={() => setShowBadgeModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Toggle Admin Badges */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Use Admin Badges</h3>
                  <p className="text-xs text-gray-500">Enable to show admin-assigned badges instead of dynamic ones</p>
                </div>
                <button
                  onClick={handleToggleAdminBadges}
                  disabled={saving}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedProperty.useAdminBadges 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {selectedProperty.useAdminBadges ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((category) => {
                  const config = CATEGORY_CONFIG[category];
                  const Icon = config.icon;
                  const count = getAssignedBadges(category).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                          : `${config.bgColor} ${config.textColor} hover:shadow-md`
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {config.label}
                      {count > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                          selectedCategory === category ? 'bg-white/20' : 'bg-white'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Assigned Badges */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Assigned Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {getAssignedBadges(selectedCategory).length > 0 ? (
                    getAssignedBadges(selectedCategory).map((badge) => (
                      <span
                        key={badge.type}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${CATEGORY_CONFIG[selectedCategory].bgColor} ${CATEGORY_CONFIG[selectedCategory].textColor} ${CATEGORY_CONFIG[selectedCategory].borderColor} border`}
                      >
                        {badge.label}
                        <button
                          onClick={() => handleRemoveBadge(selectedCategory, badge.type)}
                          disabled={saving}
                          className="hover:bg-white/50 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No badges assigned in this category</p>
                  )}
                </div>
              </div>

              {/* Available Badges */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Badges</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableBadges?.[selectedCategory]?.map((badge) => {
                    const isAssigned = isBadgeAssigned(selectedCategory, badge.type);
                    
                    return (
                      <button
                        key={badge.type}
                        onClick={() => !isAssigned && handleAddBadge(badge)}
                        disabled={isAssigned || saving}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isAssigned
                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                            : `${CATEGORY_CONFIG[selectedCategory].bgColor} ${CATEGORY_CONFIG[selectedCategory].borderColor} hover:shadow-md cursor-pointer`
                        }`}
                      >
                        <span className={`text-sm font-medium ${isAssigned ? 'text-gray-400' : CATEGORY_CONFIG[selectedCategory].textColor}`}>
                          {badge.label}
                        </span>
                        {isAssigned ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Plus className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowBadgeModal(false)}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
