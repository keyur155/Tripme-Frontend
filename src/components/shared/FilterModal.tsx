import {
  Home, Building2, DoorOpen, Hotel, Warehouse, TentTree, Trees, Ship,
  Building, Castle, Zap, Key, RefreshCcw, X, SlidersHorizontal,
  Wifi, Tv, UtensilsCrossed, WashingMachine, Wind, Snowflake, Flame,
  Monitor, Waves, ParkingCircle, Dumbbell, Coffee, Shield, Sparkles,
  Eye, Mountain, TreePine, Flower2, Fence, Sun, Accessibility, PawPrint, Cigarette, Calendar
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="relative w-full sm:max-w-2xl sm:mx-4 bg-white sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl">
        {children}
      </div>
    </div>
  );
};

interface AirbnbFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: any) => void;
  resultsCount?: number;
  onResultsCountChange?: (count: number) => void;
}

const AirbnbFilters: React.FC<AirbnbFiltersProps> = ({
  isOpen, onClose, onApplyFilters, resultsCount = 0, onResultsCountChange
}) => {
  const [priceRange, setPriceRange] = useState({ min: 900, max: 100000 });
  const [placeType, setPlaceType] = useState<string>('any');
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [beds, setBeds] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [instantBook, setInstantBook] = useState(false);
  const [cancellationPolicy, setCancellationPolicy] = useState<string>('any');

  const handleClearAll = () => {
    setPriceRange({ min: 900, max: 100000 });
    setPlaceType('any');
    setBedrooms(null);
    setBeds(null);
    setBathrooms(null);
    setPropertyTypes([]);
    setAmenities([]);
    setFeatures([]);
    setStyle([]);
    setInstantBook(false);
    setCancellationPolicy('any');
  };

  const getFilteredCount = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (priceRange.min > 900) params.append('minPrice', String(priceRange.min));
      if (priceRange.max < 100000) params.append('maxPrice', String(priceRange.max));
      if (bedrooms) params.append('bedrooms', String(bedrooms));
      if (beds) params.append('beds', String(beds));
      if (bathrooms) params.append('bathrooms', String(bathrooms));
      if (propertyTypes.length > 0) params.append('type', propertyTypes.join(','));
      if (placeType !== 'any') params.append('placeType', placeType);
      if (amenities.length > 0) params.append('amenities', amenities.join(','));
      if (features.length > 0) params.append('features', features.join(','));
      if (style.length > 0) params.append('style', style.join(','));
      if (instantBook) params.append('instantBook', 'true');
      if (cancellationPolicy !== 'any') params.append('cancellationPolicy', cancellationPolicy);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/listings?${params}`
      );
      const data = await response.json();
      if (data.success) {
        const count = data.data?.pagination?.totalItems || data.data?.listings?.length || 0;
        onResultsCountChange?.(count);
      }
    } catch (error) {
      console.error('Error getting filtered count:', error);
      onResultsCountChange?.(0);
    }
  }, [priceRange, placeType, bedrooms, beds, bathrooms, propertyTypes, amenities, features, style, instantBook, cancellationPolicy, onResultsCountChange]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => { getFilteredCount(); }, 400);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, getFilteredCount]);

  const handleApplyFilters = () => {
    const filters = {
      priceRange, placeType, bedrooms, beds, bathrooms,
      propertyTypes, amenities, features, style, instantBook, cancellationPolicy
    };
    if (onApplyFilters) onApplyFilters(filters);
    onClose();
  };

  // Matches backend: enum ['villa', 'apartment', 'hostel', 'house', 'cottage', 'cabin', 'treehouse', 'boat']
  const PROPERTY_TYPE_OPTIONS = [
    { value: "villa", label: "Villa", icon: Castle },
    { value: "apartment", label: "Apartment", icon: Building2 },
    { value: "house", label: "House", icon: Home },
    { value: "hostel", label: "Hostel", icon: Hotel },
    { value: "cottage", label: "Cottage", icon: Trees },
    { value: "cabin", label: "Cabin", icon: TentTree },
    { value: "treehouse", label: "Treehouse", icon: TreePine },
    { value: "boat", label: "Boat", icon: Ship },
  ];

  // Matches backend amenities enum
  const AMENITY_OPTIONS = [
    { value: "wifi", label: "Wifi", icon: Wifi },
    { value: "tv", label: "TV", icon: Tv },
    { value: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
    { value: "washer", label: "Washer", icon: WashingMachine },
    { value: "dryer", label: "Dryer", icon: Wind },
    { value: "ac", label: "AC", icon: Snowflake },
    { value: "heating", label: "Heating", icon: Flame },
    { value: "workspace", label: "Workspace", icon: Monitor },
    { value: "pool", label: "Pool", icon: Waves },
    { value: "hot-tub", label: "Hot Tub", icon: Sparkles },
    { value: "parking", label: "Parking", icon: ParkingCircle },
    { value: "gym", label: "Gym", icon: Dumbbell },
    { value: "breakfast", label: "Breakfast", icon: Coffee },
    { value: "fireplace", label: "Fireplace", icon: Flame },
    { value: "security", label: "Security", icon: Shield },
    { value: "essentials", label: "Essentials", icon: Key },
  ];

  // Matches backend features enum
  const FEATURE_OPTIONS = [
    { value: "ocean-view", label: "Ocean View", icon: Eye },
    { value: "mountain-view", label: "Mountain View", icon: Mountain },
    { value: "city-view", label: "City View", icon: Building },
    { value: "garden", label: "Garden", icon: Flower2 },
    { value: "balcony", label: "Balcony", icon: Fence },
    { value: "terrace", label: "Terrace", icon: Sun },
    { value: "elevator", label: "Elevator", icon: Building2 },
    { value: "wheelchair-accessible", label: "Accessible", icon: Accessibility },
    { value: "pet-friendly", label: "Pet Friendly", icon: PawPrint },
    { value: "smoking-allowed", label: "Smoking OK", icon: Cigarette },
    { value: "long-term-stays", label: "Long Term", icon: Calendar },
  ];

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const CounterButton = ({
    label, value, onChange
  }: {
    label: string;
    value: number | null;
    onChange: (val: number | null) => void;
  }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-b-0">
      <span className="text-[15px] font-medium text-[#1A1A1A]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(value ? Math.max(0, value - 1) : 0)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#C45D3E] hover:text-[#C45D3E] transition disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={!value}
        >
          <span className="text-base leading-none">−</span>
        </button>
        <span className="w-6 text-center text-sm font-medium text-[#1A1A1A]">
          {value || '–'}
        </span>
        <button
          onClick={() => onChange((value || 0) + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#C45D3E] hover:text-[#C45D3E] transition"
        >
          <span className="text-base leading-none">+</span>
        </button>
      </div>
    </div>
  );

  const activeFilterCount = [
    priceRange.min > 900 || priceRange.max < 100000,
    placeType !== 'any',
    bedrooms !== null,
    beds !== null,
    bathrooms !== null,
    propertyTypes.length > 0,
    amenities.length > 0,
    features.length > 0,
    style.length > 0,
    instantBook,
    cancellationPolicy !== 'any',
  ].filter(Boolean).length;

  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const visibleAmenities = showAllAmenities ? AMENITY_OPTIONS : AMENITY_OPTIONS.slice(0, 8);
  const visibleFeatures = showAllFeatures ? FEATURE_OPTIONS : FEATURE_OPTIONS.slice(0, 6);

  return (
    <FilterModal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <X size={18} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#C45D3E]" />
            <h2 className="font-semibold text-[17px] text-[#1A1A1A]">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#C45D3E] text-white text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="w-8" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto overscroll-contain px-5 py-5 space-y-7" style={{ maxHeight: 'calc(92vh - 130px)' }}>

        {/* Place Type */}
        <section>
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3">Type of place</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'any', label: 'Any', icon: Building2 },
              { key: 'entire', label: 'Entire', icon: Home },
              { key: 'room', label: 'Room', icon: DoorOpen },
              { key: 'shared', label: 'Shared', icon: Hotel },
            ].map(({ key, label, icon: Icon }) => {
              const active = placeType === key;
              return (
                <button
                  key={key}
                  onClick={() => setPlaceType(key)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all
                    ${active
                      ? 'border-[#C45D3E] bg-[#FDF8F3] shadow-sm ring-1 ring-[#C45D3E]/20'
                      : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <Icon size={20} className={active ? 'text-[#C45D3E]' : 'text-gray-500'} />
                  <span className={`text-xs font-medium ${active ? 'text-[#C45D3E]' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Price Range */}
        <section className="border-t border-gray-100 pt-6">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-1">Price range</h3>
          <p className="text-xs text-gray-500 mb-4">Per night, includes all fees</p>

          <div className="space-y-4">
            <div className="px-1">
              <input
                type="range"
                min="900"
                max="100000"
                step="500"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C45D3E]
                  [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition"
                  />
                </div>
              </div>
              <div className="flex items-end pb-2.5 text-gray-300">–</div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms and Beds */}
        <section className="border-t border-gray-100 pt-6">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-2">Rooms and beds</h3>
          <CounterButton label="Bedrooms" value={bedrooms} onChange={setBedrooms} />
          <CounterButton label="Beds" value={beds} onChange={setBeds} />
          <CounterButton label="Bathrooms" value={bathrooms} onChange={setBathrooms} />
        </section>

        {/* Property Type */}
        <section className="border-t border-gray-100 pt-6">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3">Property type</h3>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {PROPERTY_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => {
              const active = propertyTypes.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleArrayItem(propertyTypes, setPropertyTypes, value)}
                  className={`flex flex-col items-center gap-1.5 p-3 border rounded-xl transition-all
                    ${active
                      ? 'border-[#C45D3E] bg-[#FDF8F3] shadow-sm ring-1 ring-[#C45D3E]/20'
                      : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <Icon size={20} className={active ? 'text-[#C45D3E]' : 'text-gray-500'} />
                  <span className={`text-[11px] sm:text-xs font-medium ${active ? 'text-[#C45D3E]' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Amenities */}
        <section className="border-t border-gray-100 pt-6">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {visibleAmenities.map(({ value, label, icon: Icon }) => {
              const active = amenities.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleArrayItem(amenities, setAmenities, value)}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg transition-all text-left
                    ${active
                      ? 'border-[#C45D3E] bg-[#FDF8F3] ring-1 ring-[#C45D3E]/20'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <Icon size={15} className={`shrink-0 ${active ? 'text-[#C45D3E]' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium truncate ${active ? 'text-[#C45D3E]' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          {!showAllAmenities && AMENITY_OPTIONS.length > 8 && (
            <button
              onClick={() => setShowAllAmenities(true)}
              className="mt-3 text-sm font-medium text-[#C45D3E] hover:text-[#A84B32] transition"
            >
              Show all {AMENITY_OPTIONS.length} amenities
            </button>
          )}
        </section>

        {/* Features */}
        <section className="border-t border-gray-100 pt-6">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3">Standout features</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {visibleFeatures.map(({ value, label, icon: Icon }) => {
              const active = features.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleArrayItem(features, setFeatures, value)}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg transition-all text-left
                    ${active
                      ? 'border-[#C45D3E] bg-[#FDF8F3] ring-1 ring-[#C45D3E]/20'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <Icon size={15} className={`shrink-0 ${active ? 'text-[#C45D3E]' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium truncate ${active ? 'text-[#C45D3E]' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          {!showAllFeatures && FEATURE_OPTIONS.length > 6 && (
            <button
              onClick={() => setShowAllFeatures(true)}
              className="mt-3 text-sm font-medium text-[#C45D3E] hover:text-[#A84B32] transition"
            >
              Show all {FEATURE_OPTIONS.length} features
            </button>
          )}
        </section>

        {/* Booking Options */}
        <section className="border-t border-gray-100 pt-6">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3">Booking options</h3>
          <div className="space-y-2">
            <button
              onClick={() => setInstantBook(v => !v)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all
                ${instantBook
                  ? 'border-[#C45D3E] bg-[#FDF8F3] ring-1 ring-[#C45D3E]/20'
                  : 'border-gray-200 hover:border-gray-400'
                }`}
            >
              <Zap size={18} className={`shrink-0 ${instantBook ? 'text-[#C45D3E]' : 'text-gray-500'}`} />
              <div className="flex-1">
                <div className={`text-sm font-medium ${instantBook ? 'text-[#C45D3E]' : 'text-[#1A1A1A]'}`}>Instant Book</div>
                <div className="text-xs text-gray-500">Book without waiting for host approval</div>
              </div>
            </button>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section className="border-t border-gray-100 pt-6">
          <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-3">Cancellation policy</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'any', label: 'Any' },
              { key: 'flexible', label: 'Flexible' },
              { key: 'moderate', label: 'Moderate' },
              { key: 'strict', label: 'Strict' },
            ].map(({ key, label }) => {
              const active = cancellationPolicy === key;
              return (
                <button
                  key={key}
                  onClick={() => setCancellationPolicy(key)}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all
                    ${active
                      ? 'border-[#C45D3E] bg-[#FDF8F3] text-[#C45D3E] ring-1 ring-[#C45D3E]/20'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
        <button
          onClick={handleClearAll}
          className="text-sm font-medium text-gray-700 hover:text-[#C45D3E] transition underline underline-offset-2"
        >
          Clear all
        </button>
        <button
          onClick={handleApplyFilters}
          className="bg-[#C45D3E] text-white px-6 py-3 rounded-xl hover:bg-[#A84B32] font-medium text-sm transition-all shadow-sm active:scale-[0.98]"
        >
          Show {resultsCount || 0} places
        </button>
      </div>
    </FilterModal>
  );
};

export default AirbnbFilters;
