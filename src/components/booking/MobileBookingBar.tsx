"use client";

import React, { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle, Calendar, CheckCircle, Clock, Zap, ChevronDown, ChevronUp } from "lucide-react";

interface MobileBookingBarProps {
  property: any;
  dateRange: any;
  nights: number;
  pricing?: any;

  availabilityChecked: boolean;
  availabilityLoading: boolean;
  availabilityError?: string;
  selectionStep: string;
  ownerProperty: any;
  setShowTimePrompt: (val: boolean) => void;

  formatPrice: (value: number) => string;
  formatDate: (date: Date) => string;

  setShowDatePicker: (val: boolean) => void;
  setSelectionStep: (step: string) => void;

  checkAvailability: () => void;
  /** now this should be handleCompleteBooking */
  handleBooking: () => void;
  setTimeConfirmed: (val: boolean) => void;

  // Inline time picker
  checkInTimeStr?: string;
  setCheckInTimeStr?: (val: string) => void;
  timeOptions?: string[];
  formatTimeHour?: (hour: number) => string;
  isHourlyProperty?: boolean;

  // Hourly extension
  hourlyExtension?: number | null;
  setHourlyExtension?: (extension: number | null) => void;
  hourlySettings?: any;

  // Guest selection
  guests?: number;
  setGuests?: (guests: number) => void;
  maxGuests?: number;
}

export default function MobileBookingBar({
  property,
  dateRange,
  nights,
  pricing,
  availabilityChecked,
  availabilityLoading,
  availabilityError,
  selectionStep,
  formatPrice,
  formatDate,
  setShowDatePicker,
  setSelectionStep,
  checkAvailability,
  handleBooking,
  ownerProperty,
  setShowTimePrompt,
  setTimeConfirmed,
  checkInTimeStr,
  setCheckInTimeStr,
  timeOptions = [],
  formatTimeHour,
  isHourlyProperty = false,
  hourlyExtension,
  setHourlyExtension,
  hourlySettings,
  guests,
  setGuests,
  maxGuests,
}: MobileBookingBarProps) {
  const router = useRouter();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  /* 🔔 Haptic Feedback (mobile safe) */
  const haptic = (type: "light" | "medium" = "light") => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(type === "light" ? 10 : 20);
    }
  };

  /* 💰 Price logic */
  const pricingBaseAmount = pricing?.baseAmount;
  const hasBaseAmount = typeof pricingBaseAmount === "number" && pricingBaseAmount > 0;
  const displayPrice = hasBaseAmount
    ? formatPrice(pricingBaseAmount)
    : formatPrice(property?.pricing?.basePrice || 0);

  const priceLabel = hasBaseAmount ? " total" : " / night";

  // Debug: log pricing object when breakdown is shown
  if (showBreakdown) {
    console.log('MobileBookingBar pricing object:', pricing);
  }

  /* 🕐 Parse next available time from error */
  const maintenanceMatch = availabilityError?.match(/after\s+([\d:]+\s*[AP]M)/i);
  const nextAvailableTime = maintenanceMatch?.[1] ?? null;

  /* 📅 Parse "next available date" style errors — backend may say "Available from Mar 15" */
  const dateMatch = availabilityError?.match(/(?:available\s+(?:from|after|on)\s+)([A-Za-z]+\s+\d{1,2}(?:,?\s*\d{4})?)/i);
  const nextAvailableDate = dateMatch?.[1] ?? null;

  const showError = !!availabilityError
    && !availabilityError.toLowerCase().includes("please select")
    && selectionStep === "complete";

  const datesSelected = selectionStep === "complete" && !!dateRange.startDate && !!dateRange.endDate;

  return (
    <AnimatePresence>
      <motion.div
        key="mobile-booking-bar"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="lg:hidden fixed bottom-0 inset-x-0 z-50"
      >
        {!ownerProperty ? (
          <div className="bg-white border-t shadow-2xl px-4 py-3 space-y-3">

            {/* ─── Compact Header (always visible) ─── */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {displayPrice}
                  <span className="text-sm font-normal text-gray-600">{priceLabel}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {dateRange.startDate && dateRange.endDate
                    ? `${formatDate(dateRange.startDate)} – ${formatDate(dateRange.endDate)}`
                    : "Select dates"}
                </div>
                {availabilityChecked && (
                  <div className="text-xs text-green-600 font-medium">
                    {nights} night{nights > 1 ? "s" : ""} · Available ✓
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {hasBaseAmount && (
                  <button
                    onClick={() => {
                      haptic();
                      setShowBreakdown(!showBreakdown);
                    }}
                    className="text-xs font-semibold text-orange-600 px-2 py-1 bg-orange-50 rounded-lg flex items-center gap-1"
                  >
                    {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    Breakdown
                  </button>
                )}
                <button
                  onClick={() => {
                    haptic();
                    if (isExpanded) {
                      setIsExpanded(false);
                    } else {
                      setIsExpanded(true);
                      setShowBreakdown(false); // Hide breakdown when opening Edit
                    }
                  }}
                  className="text-xs font-semibold text-orange-600 px-2 py-1 bg-orange-50 rounded-lg"
                >
                  {isExpanded ? 'Close' : 'Edit'}
                </button>
              </div>
            </div>

            {/* ─── Pricing Breakdown (collapsible) ─── */}
            {!isExpanded && (
              <AnimatePresence>
                {showBreakdown && hasBaseAmount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base amount</span>
                      <span className="font-medium">{formatPrice(pricing?.baseAmount || pricing?.basePrice || 0)}</span>
                    </div>
                    {pricing?.extraGuestCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Extra guests</span>
                        <span className="font-medium">{formatPrice(pricing?.extraGuestCost)}</span>
                      </div>
                    )}
                    {pricing?.cleaningFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cleaning fee</span>
                        <span className="font-medium">{formatPrice(pricing?.cleaningFee)}</span>
                      </div>
                    )}
                    {pricing?.securityDeposit > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Security deposit</span>
                        <span className="font-medium">{formatPrice(pricing?.securityDeposit)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Subtotal</span>
                      <span className="font-bold">{formatPrice(pricing?.subtotal || pricing?.hostSubtotal || 0)}</span>
                    </div>
                    {pricing?.gst > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">GST</span>
                        <span className="font-medium">{formatPrice(pricing?.gst)}</span>
                      </div>
                    )}
                    {pricing?.processingFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing fee</span>
                        <span className="font-medium">{formatPrice(pricing?.processingFee)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                      <span className="text-gray-900 font-bold">Total</span>
                      <span className="font-bold text-orange-600">{formatPrice(pricing?.totalAmount || pricing?.total || 0)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* ─── Expanded Content (collapsible) ─── */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {/* Calendar Button */}
                  <button
                    onClick={() => {
                      haptic();
                      setShowDatePicker(true);
                      setTimeConfirmed(true);
                      setSelectionStep("checkin");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 border border-orange-500 rounded-lg text-sm font-semibold text-orange-600"
                  >
                    <Calendar className="w-4 h-4" />
                    Select Dates
                  </button>

                  {/* Hourly Extension Selector (for hourly properties) */}
                  {isHourlyProperty && hourlySettings && setHourlyExtension && (
                    <div className="bg-orange-50 border border-orange-500 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-600">Add extra hours</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[6, 12, 18].map((hours) => (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => {
                              haptic();
                              setHourlyExtension(hourlyExtension === hours ? null : hours);
                            }}
                            className={`p-2 border-2 rounded-lg text-center transition-all ${
                              hourlyExtension === hours
                                ? 'border-orange-500 bg-orange-100 shadow-md'
                                : 'border-orange-300 bg-white hover:bg-orange-50'
                            }`}
                          >
                            <div className="text-lg mb-1">⏰</div>
                            <div className="text-xs font-bold text-gray-900">{hours}h</div>
                            <div className="text-[10px] text-gray-600">
                              {Math.round((hourlySettings?.hourlyRates?.[`${hours}Hours`] || hours === 6 ? 0.3 : hours === 12 ? 0.6 : 0.75) * 100)}%
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inline Time Picker (for hourly properties) */}
                  {isHourlyProperty && checkInTimeStr && setCheckInTimeStr && timeOptions.length > 0 && (
                    <div className="bg-orange-50 border border-orange-500 rounded-xl px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-600">Check-in Time</span>
                        </div>
                        {/* Compact Stepper */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              haptic();
                              const idx = timeOptions.indexOf(checkInTimeStr);
                              const prev = timeOptions[(idx - 1 + timeOptions.length) % timeOptions.length];
                              setCheckInTimeStr(prev);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border-orange-300 text-orange-600 font-bold text-base hover:bg-orange-100 active:scale-95 transition-all"
                          >
                            ‹
                          </button>
                          <span className="text-sm font-bold text-orange-700 min-w-[80px] text-center">
                            {(() => {
                              const [h] = checkInTimeStr.split(":").map(Number);
                              return formatTimeHour ? formatTimeHour(h) : checkInTimeStr;
                            })()}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              haptic();
                              const idx = timeOptions.indexOf(checkInTimeStr);
                              const next = timeOptions[(idx + 1) % timeOptions.length];
                              setCheckInTimeStr(next);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border-orange-300 text-orange-600 font-bold text-base hover:bg-orange-100 active:scale-95 transition-all"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-orange-500 mt-1">
                        Tap arrows to pick your check-in time
                      </p>
                    </div>
                  )}

                  {/* Guest Selection */}
                  {setGuests && (
                    <div className="bg-orange-50 border border-orange-500 rounded-xl px-3 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-orange-600">Guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              haptic();
                              if (guests && guests > 1) setGuests(guests - 1);
                            }}
                            disabled={!guests || guests <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border-orange-300 text-orange-600 font-bold text-base hover:bg-orange-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ‹
                          </button>
                          <span className="text-sm font-bold text-gray-900 min-w-[30px] text-center">{guests || 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              haptic();
                              if (maxGuests && (!guests || guests < maxGuests)) setGuests((guests || 1) + 1);
                            }}
                            disabled={!!maxGuests && !!guests && guests >= maxGuests}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border-orange-300 text-orange-600 font-bold text-base hover:bg-orange-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-orange-500">
                        {maxGuests ? `Max ${maxGuests} guests` : 'Select number of guests'}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Availability Error Card ─── */}
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden border border-orange-200"
              >
                {/* Header */}
                <div className="bg-orange-50 px-3 py-2 flex items-center gap-2 border-b border-orange-100">
                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-orange-800">Not Available</span>
                </div>

                {/* Body */}
                <div className="bg-white px-3 py-2 space-y-2">
                  {nextAvailableTime ? (
                    /* Maintenance conflict — show next available time */
                    <>
                      <p className="text-xs text-gray-600">
                        Maintenance period ends before your selected check-in time.
                      </p>
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Next Available</p>
                          <p className="text-sm font-bold text-emerald-800">Check-in after {nextAvailableTime}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Please pick a time after {nextAvailableTime}
                      </p>
                    </>
                  ) : nextAvailableDate ? (
                    /* Next available date from backend */
                    <>
                      <p className="text-xs text-gray-600">
                        Your selected dates are fully booked.
                      </p>
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Next Available Date</p>
                          <p className="text-sm font-bold text-emerald-800">{nextAvailableDate}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Generic unavailability */
                    <>
                      <p className="text-xs text-gray-600">{availabilityError}</p>
                      <p className="text-xs text-gray-400">
                        Please choose different dates or adjust your check-in time.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── CTA Button ─── */}
            <Button
              onClick={() => {
                haptic("medium");
                if (!dateRange.startDate || !dateRange.endDate || selectionStep !== "complete") {
                  setShowDatePicker(true);
                  return;
                }
                handleBooking(); // This is now handleCompleteBooking
              }}
              disabled={availabilityLoading || selectionStep !== "complete"}
              className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-lg ${selectionStep === "complete"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {availabilityLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking availability...
                </span>
              ) : selectionStep !== "complete" ? (
                <span className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectionStep === "checkin" ? "Select Check-in Date" : "Select Check-out Date"}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Complete Booking
                </span>
              )}
            </Button>

            {/* ─── Terms & Privacy Links ─── */}
          

          </div>
        ) : (
          <div className="bg-white border-t shadow-2xl px-4 py-3">
            <Button
              onClick={() => router.push(`/host/property/${property.id}`)}
              className="w-full py-3 rounded-xl font-semibold bg-[#4285f4] text-white"
            >
              Edit your property
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
