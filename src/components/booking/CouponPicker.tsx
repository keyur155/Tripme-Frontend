"use client";

import React, { useState, useEffect } from 'react';
import { X, Tag, Ticket, ChevronRight, Check, Search, Info, Gift } from 'lucide-react';
import { Coupon } from '@/types';
import { formatCurrency } from '@/shared/constants/pricing.constants';

interface CouponPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  availableCoupons: Coupon[];
  isLoading?: boolean;
  currentBookingAmount: number;
  currentPropertyId?: string;
}

const CouponPicker: React.FC<CouponPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  availableCoupons,
  isLoading = false,
  currentBookingAmount,
  currentPropertyId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'all'>('available');

  const isApplicable = (coupon: Coupon) => {
    // Check if listing specific
    if (coupon.applicableToListings && coupon.applicableToListings.length > 0) {
      if (currentPropertyId && !coupon.applicableToListings.includes(currentPropertyId)) {
        return { valid: false, reason: 'Not applicable for this property' };
      }
    }

    // Check min booking amount
    if (coupon.minBookingAmount && currentBookingAmount < coupon.minBookingAmount) {
      return { 
        valid: false, 
        reason: `Min booking amount ₹${coupon.minBookingAmount.toLocaleString()} required` 
      };
    }

    // Check validity dates
    const now = new Date();
    if (new Date(coupon.validFrom) > now) {
      return { valid: false, reason: 'Offer starts soon' };
    }
    if (new Date(coupon.validTo) < now) {
      return { valid: false, reason: 'Offer expired' };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, reason: 'Offer limit reached' };
    }

    return { valid: true };
  };

  const filteredCoupons = availableCoupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'available') {
      return isApplicable(coupon).valid;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet/Modal */}
      <div className={`
        relative w-full max-w-lg bg-white 
        sm:rounded-3xl shadow-2xl overflow-hidden
        h-[90vh] sm:h-auto sm:max-h-[85vh]
        flex flex-col
        animate-in slide-in-from-bottom sm:zoom-in duration-300
        mt-auto sm:mt-0
      `}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C45D3E]/10 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#C45D3E]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Available Offers</h2>
              <p className="text-xs text-gray-500">Apply a coupon to save on your trip</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="px-6 py-4 space-y-4 shrink-0">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-[#C45D3E]" />
            <input 
              type="text" 
              placeholder="Search for a coupon code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C45D3E]/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('available')}
              className={`
                flex-1 py-2 text-xs font-bold rounded-lg transition-all
                ${activeTab === 'available' ? 'bg-white text-[#C45D3E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              Applicable
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`
                flex-1 py-2 text-xs font-bold rounded-lg transition-all
                ${activeTab === 'all' ? 'bg-white text-[#C45D3E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              All Offers
            </button>
          </div>
        </div>

        {/* Coupon List */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4 scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-[#F5E6D3] border-t-[#C45D3E] rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Finding the best deals...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No coupons found</h3>
              <p className="text-sm text-gray-500 max-w-[240px] mt-1">
                Try searching for a different code or check later for new offers.
              </p>
            </div>
          ) : (
            filteredCoupons.map((coupon) => {
              const status = isApplicable(coupon);
              return (
                <div 
                  key={coupon._id}
                  className={`
                    group relative bg-white border rounded-2xl p-4 transition-all
                    ${status.valid 
                      ? 'border-gray-200 hover:border-[#C45D3E] hover:shadow-md cursor-pointer active:scale-[0.98]' 
                      : 'border-gray-100 opacity-75'}
                  `}
                  onClick={() => status.valid && onSelect(coupon.code)}
                >
                  <div className="flex items-start gap-4">
                    {/* Discount Badge */}
                    <div className={`
                      w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0
                      ${status.valid ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}
                    `}>
                      <span className="text-lg font-black leading-none">
                        {coupon.discountType === 'percentage' ? `${coupon.amount}%` : `₹${coupon.amount}`}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter mt-0.5">OFF</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-bold truncate ${status.valid ? 'text-gray-900' : 'text-gray-400'}`}>
                          {coupon.code}
                        </span>
                        {status.valid && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                            Applicable
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-xs mt-1 line-clamp-2 ${status.valid ? 'text-gray-600' : 'text-gray-400'}`}>
                        {coupon.discountType === 'percentage' 
                          ? `Get ${coupon.amount}% off your booking` 
                          : `Flat ₹${coupon.amount} off your booking`}
                        {coupon.maxDiscount ? ` up to ₹${coupon.maxDiscount.toLocaleString()}` : ''}.
                        {coupon.minBookingAmount ? ` Valid on orders above ₹${coupon.minBookingAmount.toLocaleString()}.` : ''}
                      </p>

                      {!status.valid && (
                        <div className="flex items-center gap-1.5 mt-2 text-rose-500">
                          <Info size={12} />
                          <span className="text-[10px] font-semibold">{status.reason}</span>
                        </div>
                      )}
                    </div>

                    {status.valid && (
                      <div className="flex items-center self-center text-[#C45D3E] group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={20} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 shrink-0">
          <p className="text-[10px] text-center text-gray-400 font-medium">
            T&C apply. Coupons cannot be combined with other offers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponPicker;
