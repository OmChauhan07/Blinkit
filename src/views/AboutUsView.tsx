import React from 'react';
import { useStore } from '../context/StoreContext';

export const AboutUsView: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F8CB46] text-[#1C1C1C] flex items-center justify-center font-black text-[22px] shadow-sm">
            ⚡
          </div>
          <div>
            <h1 className="text-[22px] font-black text-[#1C1C1C]">About Blinkit</h1>
            <p className="text-[12px] text-slate-500">Pioneering 10-Minute Quick Commerce in India</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-[#0C831F] text-[13px] font-bold hover:underline cursor-pointer"
        >
          Back to Store
        </button>
      </div>

      {/* Hero Story Banner */}
      <div className="bg-gradient-to-r from-[#0C831F] to-[#00530E] text-white p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-xl relative z-10 space-y-3">
          <span className="bg-white/20 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase inline-block">
            Our Mission
          </span>
          <h2 className="text-[26px] sm:text-[34px] font-black tracking-tight leading-tight">
            Instant commerce indistinguishable from magic.
          </h2>
          <p className="text-[14px] text-white/90 leading-relaxed">
            We are committed to delivering daily grocery essentials, fresh produce, medicines, electronics, and household staples to your doorstep in 10 to 12 minutes.
          </p>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#F8CB46]/20 text-[#936F00] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">storefront</span>
          </div>
          <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Micro Dark Stores</h3>
          <p className="text-[13px] text-slate-600 leading-relaxed">
            Over 500+ localized fulfillment centers situated within 2–3 kilometers of your urban neighborhood enable sub-2-minute warehouse picking.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0C831F]/10 text-[#0C831F] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">agriculture</span>
          </div>
          <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Direct Farm Sourcing</h3>
          <p className="text-[13px] text-slate-600 leading-relaxed">
            Fruits and vegetables harvested at dawn from certified rural farms, sorted under strict optical quality checks, and chilled in cold-chain logistics.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">electric_scooter</span>
          </div>
          <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Green EV Fleet</h3>
          <p className="text-[13px] text-slate-600 leading-relaxed">
            Over 60% of deliveries are performed using clean electric two-wheelers, minimizing urban carbon emissions while safeguarding partner transit safety.
          </p>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-[28px] font-black text-[#0C831F]">10 Mins</span>
          <p className="text-[12px] font-bold text-slate-500 mt-0.5">Average Delivery Time</p>
        </div>
        <div>
          <span className="text-[28px] font-black text-[#1C1C1C]">10,000+</span>
          <p className="text-[12px] font-bold text-slate-500 mt-0.5">Products in Catalog</p>
        </div>
        <div>
          <span className="text-[28px] font-black text-[#1C1C1C]">25+</span>
          <p className="text-[12px] font-bold text-slate-500 mt-0.5">Major Indian Cities</p>
        </div>
        <div>
          <span className="text-[28px] font-black text-[#0C831F]">99.8%</span>
          <p className="text-[12px] font-bold text-slate-500 mt-0.5">Order Accuracy Rate</p>
        </div>
      </div>
    </div>
  );
};
