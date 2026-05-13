"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  MapPin,
  ChefHat,
  Dumbbell,
  Camera,
  Scissors,
  Music,
  Paintbrush,
  Sparkles,
  Star,
  Plus,
  Check,
  Minus,
  Loader2,
  Info,
  Bike,
  HeartHandshake,
  X,
  Clock,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/shared/constants/pricing.constants";

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface RecommendedService {
  _id: string;
  title: string;
  description: string;
  serviceType: string;
  provider: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  media?: Array<{
    url: string;
    type: string;
    caption?: string;
  }>;
  rating: {
    average: number;
  };
  reviewCount: number;
  pricing: {
    basePrice: number;
    perPersonPrice: number;
    currency: string;
    includedGuests: number;
    calculatedTotal: number;
    pricingType: string;
    pricingLabel: string;
    perDayPrice?: number;
    perGuestPrice?: number;
  };
  duration: {
    value?: number;
    unit: string;
  };
  groupSize: {
    min: number;
    max: number;
  };
  cancellationPolicy: string;
  location: {
    city?: string;
    address?: string;
  };
  _recommendationScore: number;
  _recommendationReason: string;
  _matchedRules: string[];
  slotBooking?: {
    enabled: boolean;
    defaultSlots?: Array<{
      startTime: string;
      endTime: string;
      capacity: number;
      label?: string;
    }>;
  };
}

export interface ServiceSlot {
  _id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  availableCapacity: number;
  status: string;
  priceOverride: number | null;
  isAvailable: boolean;
}

export interface SelectedAddon {
  serviceId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  pricingType: string;
  pricingLabel: string;
  serviceType: string;
  selectedSlot?: {
    slotId: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null;
}

interface RecommendedServicesProps {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  onSelectionChange: (
    selectedServices: SelectedAddon[],
    totalAddonCost: number
  ) => void;
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// ICON MAP
// ════════════════════════════════════════════════════════════════════════════════

const SERVICE_TYPE_ICONS: Record<string, React.ReactNode> = {
  "tour-guide": <MapPin className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  transportation: <Car className="w-4 h-4" />,
  fitness: <Dumbbell className="w-4 h-4" />,
  chef: <ChefHat className="w-4 h-4" />,
  photographer: <Camera className="w-4 h-4" />,
  hairdresser: <Scissors className="w-4 h-4" />,
  "yoga-teacher": <HeartHandshake className="w-4 h-4" />,
  cleaning: <Sparkles className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  art: <Paintbrush className="w-4 h-4" />,
  other: <Star className="w-4 h-4" />,
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  "tour-guide": "Local Guide",
  transport: "Transport",
  transportation: "Transport",
  fitness: "Fitness",
  chef: "Private Chef",
  photographer: "Photographer",
  hairdresser: "Stylist",
  "yoga-teacher": "Yoga",
  cleaning: "Cleaning",
  music: "Musician",
  art: "Art",
  other: "Service",
};

const SERVICE_TYPE_COLORS: Record<string, string> = {
  "tour-guide": "bg-blue-50 text-blue-700 border-blue-200",
  transport: "bg-indigo-50 text-indigo-700 border-indigo-200",
  transportation: "bg-indigo-50 text-indigo-700 border-indigo-200",
  fitness: "bg-green-50 text-green-700 border-green-200",
  chef: "bg-orange-50 text-orange-700 border-orange-200",
  photographer: "bg-purple-50 text-purple-700 border-purple-200",
  hairdresser: "bg-pink-50 text-pink-700 border-pink-200",
  "yoga-teacher": "bg-teal-50 text-teal-700 border-teal-200",
  cleaning: "bg-cyan-50 text-cyan-700 border-cyan-200",
  music: "bg-rose-50 text-rose-700 border-rose-200",
  art: "bg-amber-50 text-amber-700 border-amber-200",
  other: "bg-gray-50 text-gray-700 border-gray-200",
};

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export default function RecommendedServices({
  propertyId,
  checkIn,
  checkOut,
  adults,
  children,
  nights,
  onSelectionChange,
  className = "",
}: RecommendedServicesProps) {
  const [services, setServices] = useState<RecommendedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMap, setSelectedMap] = useState<Map<string, SelectedAddon>>(
    new Map()
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [slotsMap, setSlotsMap] = useState<Map<string, ServiceSlot[]>>(new Map());
  const [slotsLoading, setSlotsLoading] = useState<Set<string>>(new Set());
  const [selectedSlots, setSelectedSlots] = useState<Map<string, ServiceSlot>>(new Map());

  // Fetch slots for a service
  const fetchSlots = useCallback(async (serviceId: string, date: string) => {
    if (slotsMap.has(serviceId)) return;
    setSlotsLoading(prev => new Set(prev).add(serviceId));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/services/${serviceId}/slots?date=${date}`);
      const data = await res.json();
      if (data.success && data.slotBookingEnabled && data.slots) {
        setSlotsMap(prev => new Map(prev).set(serviceId, data.slots));
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setSlotsLoading(prev => {
        const next = new Set(prev);
        next.delete(serviceId);
        return next;
      });
    }
  }, [slotsMap]);

  // Fetch recommended services
  useEffect(() => {
    if (!propertyId) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          propertyId,
          ...(checkIn && { checkIn }),
          ...(checkOut && { checkOut }),
          adults: String(adults || 1),
          children: String(children || 0),
          limit: "12",
        });

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/services/recommended?${params}`);
        const data = await res.json();

        if (data.success && data.data?.services) {
          setServices(data.data.services);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching recommended services:", err);
        setError("Unable to load recommendations");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [propertyId, checkIn, checkOut, adults, children]);

  // Notify parent on selection changes
  const notifyParent = useCallback(
    (map: Map<string, SelectedAddon>) => {
      const selected = Array.from(map.values());
      const total = selected.reduce((sum, s) => sum + s.lineTotal, 0);
      onSelectionChange(selected, total);
    },
    [onSelectionChange]
  );

  const toggleService = (service: RecommendedService) => {
    // If service has slot booking, fetch slots when adding
    if (!selectedMap.has(service._id) && service.slotBooking?.enabled && checkIn) {
      fetchSlots(service._id, checkIn);
    }

    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (next.has(service._id)) {
        next.delete(service._id);
        // Clear selected slot too
        setSelectedSlots(sp => {
          const ns = new Map(sp);
          ns.delete(service._id);
          return ns;
        });
      } else {
        const slot = selectedSlots.get(service._id);
        next.set(service._id, {
          serviceId: service._id,
          title: service.title,
          quantity: 1,
          unitPrice: service.pricing.calculatedTotal,
          lineTotal: service.pricing.calculatedTotal,
          pricingType: service.pricing.pricingType,
          pricingLabel: service.pricing.pricingLabel,
          serviceType: service.serviceType,
          selectedSlot: slot ? {
            slotId: slot._id,
            date: checkIn,
            startTime: slot.startTime,
            endTime: slot.endTime,
          } : null,
        });
      }
      notifyParent(next);
      return next;
    });
  };

  const selectSlot = (serviceId: string, slot: ServiceSlot) => {
    setSelectedSlots(prev => new Map(prev).set(serviceId, slot));
    // Update addon with slot info if already selected
    setSelectedMap(prev => {
      const item = prev.get(serviceId);
      if (!item) return prev;
      const next = new Map(prev);
      next.set(serviceId, {
        ...item,
        selectedSlot: {
          slotId: slot._id,
          date: checkIn,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      });
      notifyParent(next);
      return next;
    });
  };

  const updateQuantity = (serviceId: string, delta: number) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      const item = next.get(serviceId);
      if (!item) return prev;
      const newQty = Math.max(1, item.quantity + delta);
      next.set(serviceId, {
        ...item,
        quantity: newQty,
        lineTotal: item.unitPrice * newQty,
      });
      notifyParent(next);
      return next;
    });
  };

  // Don't render section at all if no services
  if (!loading && services.length === 0) return null;

  return (
    <div className={`${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#FDF8F3] rounded-xl">
          <Sparkles className="w-5 h-5 text-[#C45D3E]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Enhance Your Stay
          </h3>
          <p className="text-sm text-gray-500">
            Add local services to make your trip special
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#C45D3E]" />
          <span className="ml-2 text-sm text-gray-500">
            Finding services near your stay...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-sm text-gray-400 text-center py-4">{error}</div>
      )}

      {/* Service Cards Grid */}
      {!loading && services.length > 0 && (
        <div className="space-y-3">
          {/* Horizontal scrollable on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
            {services.map((service) => {
              const isSelected = selectedMap.has(service._id);
              const selected = selectedMap.get(service._id);
              const isExpanded = expandedId === service._id;
              const typeColor =
                SERVICE_TYPE_COLORS[service.serviceType] ||
                SERVICE_TYPE_COLORS.other;
              const typeIcon =
                SERVICE_TYPE_ICONS[service.serviceType] ||
                SERVICE_TYPE_ICONS.other;
              const typeLabel =
                SERVICE_TYPE_LABELS[service.serviceType] ||
                SERVICE_TYPE_LABELS.other;
              const imageUrl = service.media?.[0]?.url || null;

              return (
                <motion.div
                  key={service._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    snap-start min-w-[280px] md:min-w-0
                    rounded-2xl border transition-all duration-200
                    ${
                      isSelected
                        ? "border-[#C45D3E] bg-[#FFFAF7] shadow-md shadow-[#C45D3E]/10"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }
                  `}
                >
                  {/* Card Content */}
                  <div className="p-3">
                    <div className="flex gap-3">
                      {/* Service Image */}
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={service.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#F5E6D3] to-[#EFDCC8] flex items-center justify-center">
                            <span className="text-[#C45D3E] opacity-60">
                              {typeIcon}
                            </span>
                          </div>
                        )}
                        {/* Rating badge */}
                        {service.rating?.average > 0 && (
                          <div className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            {service.rating.average.toFixed(1)}
                          </div>
                        )}
                      </div>

                      {/* Service Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            {/* Type Badge */}
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${typeColor}`}
                            >
                              {typeIcon}
                              {typeLabel}
                            </span>
                            {/* Title */}
                            <h4 className="font-semibold text-sm text-gray-900 mt-1 truncate">
                              {service.title}
                            </h4>
                            {/* Provider */}
                            <p className="text-xs text-gray-500 truncate">
                              by {service.provider?.name || "Local Provider"}
                            </p>
                          </div>
                        </div>

                        {/* Recommendation Reason */}
                        {service._recommendationReason && (
                          <p className="text-[10px] text-[#C45D3E] mt-1 font-medium">
                            {service._recommendationReason}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Expanded Description */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                            {service.description?.substring(0, 200)}
                            {(service.description?.length || 0) > 200
                              ? "..."
                              : ""}
                          </p>
                          {service.location?.city && (
                            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{" "}
                              {service.location.city}
                            </p>
                          )}

                          {/* Slot Selector */}
                          {service.slotBooking?.enabled && (
                            <div className="mt-3 pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Clock className="w-3.5 h-3.5 text-[#C45D3E]" />
                                <span className="text-xs font-semibold text-gray-700">
                                  Select a time slot
                                </span>
                              </div>
                              {slotsLoading.has(service._id) ? (
                                <div className="flex items-center gap-2 py-2">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                                  <span className="text-[10px] text-gray-400">Loading slots...</span>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {(slotsMap.get(service._id) || []).map((slot) => {
                                    const isSlotSelected = selectedSlots.get(service._id)?._id === slot._id;
                                    return (
                                      <button
                                        key={slot._id}
                                        disabled={!slot.isAvailable}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (slot.isAvailable) selectSlot(service._id, slot);
                                        }}
                                        className={`
                                          px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all
                                          ${!slot.isAvailable
                                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                                            : isSlotSelected
                                              ? "bg-[#C45D3E] text-white border-[#C45D3E] shadow-sm"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-[#C45D3E]/50 hover:bg-[#FFFAF7]"
                                          }
                                        `}
                                      >
                                        {slot.startTime} - {slot.endTime}
                                        {slot.availableCapacity > 0 && slot.availableCapacity <= 3 && slot.isAvailable && (
                                          <span className="ml-1 text-[8px] opacity-70">
                                            ({slot.availableCapacity} left)
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                  {(slotsMap.get(service._id) || []).length === 0 && !slotsLoading.has(service._id) && (
                                    <span className="text-[10px] text-gray-400 italic">
                                      No slots available for this date
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Price + Action Row */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(
                            service.pricing.calculatedTotal,
                            service.pricing.currency
                          )}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-1">
                          {service.pricing.pricingLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Info toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(
                              isExpanded ? null : service._id
                            );
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          {isExpanded ? (
                            <X className="w-3.5 h-3.5 text-gray-400" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </button>

                        {/* Add/Remove Button */}
                        {isSelected ? (
                          <div className="flex items-center gap-1">
                            {/* Quantity controls */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if ((selected?.quantity || 1) <= 1) {
                                  toggleService(service);
                                } else {
                                  updateQuantity(service._id, -1);
                                }
                              }}
                              className="w-6 h-6 rounded-full bg-[#C45D3E]/10 text-[#C45D3E] flex items-center justify-center hover:bg-[#C45D3E]/20 transition-colors"
                            >
                              {(selected?.quantity || 1) <= 1 ? (
                                <X className="w-3 h-3" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                            </button>
                            <span className="text-xs font-semibold w-5 text-center text-[#C45D3E]">
                              {selected?.quantity || 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(service._id, 1);
                              }}
                              className="w-6 h-6 rounded-full bg-[#C45D3E] text-white flex items-center justify-center hover:bg-[#B04D30] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(service);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#C45D3E] text-white text-xs font-medium hover:bg-[#B04D30] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Selected line total */}
                    <AnimatePresence>
                      {isSelected && selected && selected.quantity > 1 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-right mt-1"
                        >
                          <span className="text-xs text-[#C45D3E] font-medium">
                            Total:{" "}
                            {formatCurrency(
                              selected.lineTotal,
                              service.pricing.currency
                            )}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Selection Summary */}
          <AnimatePresence>
            {selectedMap.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FFFAF7] border border-[#C45D3E]/20 rounded-xl p-3 mt-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C45D3E]" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedMap.size} service
                      {selectedMap.size > 1 ? "s" : ""} added
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#C45D3E]">
                    +
                    {formatCurrency(
                      Array.from(selectedMap.values()).reduce(
                        (sum, s) => sum + s.lineTotal,
                        0
                      ),
                      "INR"
                    )}
                  </span>
                </div>

                {/* List selected items */}
                <div className="mt-2 space-y-1">
                  {Array.from(selectedMap.values()).map((item) => (
                    <div
                      key={item.serviceId}
                      className="flex items-center justify-between text-xs text-gray-600"
                    >
                      <span className="truncate flex-1">
                        {item.title}
                        {item.quantity > 1 && ` × ${item.quantity}`}
                      </span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(item.lineTotal, "INR")}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
