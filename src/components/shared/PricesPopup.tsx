"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ShieldCheck, Zap, Info, ArrowRight } from "lucide-react";

export default function TripMePopup() {
  const [show, setShow] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Show after a slight delay to allow the main page to load
    const timer = setTimeout(() => {
      const alreadyShown = localStorage.getItem("tripme_price_popup_seen");
      if (!alreadyShown) {
        setShow(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("tripme_price_popup_seen", "true");
  };

  if (!hasMounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[100] bg-black/30 "
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
            <motion.div
              initial={
                typeof window !== 'undefined' && window.innerWidth < 640 
                  ? { y: "100%" } 
                  : { opacity: 0, scale: 0.9, y: 20 }
              }
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={
                typeof window !== 'undefined' && window.innerWidth < 640 
                  ? { y: "100%" } 
                  : { opacity: 0, scale: 0.9, y: 20 }
              }
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto relative w-full max-w-[420px] bg-white sm:rounded-[32px] rounded-t-[32px] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.5)] border border-white/20"
            >
              {/* Top Handle for Mobile Drawer Feel */}
              <div className="sm:hidden w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2.5 mb-0.5" />

              {/* Close Button (Desktop) */}
              <button
                onClick={dismiss}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-gray-50/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all hover:rotate-90 sm:flex hidden"
              >
                <X size={20} />
              </button>

              {/* Header Visual Section - Larger & More Immersive */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {/* Home Image Background */}
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" 
                  alt="Luxury Villa" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Dynamic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating "Price Confidence" UI - Scaled slightly for impact */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-[280px] h-full flex flex-col justify-center gap-3">
                    {/* Floating Price Tag */}
                    <motion.div 
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white rounded-xl p-2.5 shadow-xl self-start flex items-center gap-2.5 border border-gray-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <Zap size={16} fill="currentColor" />
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Base</div>
                        <div className="text-sm font-bold text-gray-900">₹3,500</div>
                      </div>
                    </motion.div>

                    {/* Final All-In Price Tag */}
                    <motion.div 
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-[#FF385C] rounded-xl p-3 shadow-2xl self-end flex items-center gap-4 border border-white/20 transform rotate-[-1deg]"
                    >
                      <div className="text-right">
                        <div className="text-[9px] text-white/70 uppercase font-bold tracking-wider text-right">Total</div>
                        <div className="text-base font-black text-white leading-none">₹4,250</div>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white">
                        <ShieldCheck size={22} />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Transparency Badge */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-[0.05em] uppercase">
                    100% Transparent Pricing
                  </div>
                </div>
              </div>

              {/* Main Content - Ultra Compact */}
              <div className="px-6 pt-4 pb-4 sm:pb-6">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white bg-gray-200 overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 42}`} 
                          alt="User" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">Trusted by 10k+ travelers</span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight mb-1.5 tracking-tight">
                  Travel without <br />
                  <span className="text-[#FF385C]">hidden surprises.</span>
                </h2>

                <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                  The price you see is the <span className="font-bold text-gray-900">final price</span>. All fees are included.
                </p>

                {/* Side-by-Side Compact Features */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    {
                      icon: <CheckCircle2 className="text-green-500" size={14} />,
                      title: "No Extra Fees",
                    },
                    {
                      icon: <Info className="text-blue-500" size={14} />,
                      title: "Full Breakdown",
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 transition-all">
                      <div className="shrink-0">{item.icon}</div>
                      <h4 className="text-[11px] font-bold text-gray-700">{item.title}</h4>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={dismiss}
                    className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <span>Continue Browsing</span>
                    <ArrowRight size={16} />
                  </motion.button>
                  
                  <button 
                    onClick={dismiss}
                    className="w-full py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                  >
                    Not now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}


