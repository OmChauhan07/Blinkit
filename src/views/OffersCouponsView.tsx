import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const OffersCouponsView: React.FC = () => {
  const { coupons, appliedCoupon, applyCoupon, removeCoupon, navigate, setIsCartDrawerOpen } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code: string) => {
    applyCoupon(code);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="max-w-[840px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1C1C1C]">Offers &amp; Promo Codes</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Save big on daily groceries, dairy, snacks, and household essentials</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-[#0C831F] text-[13px] font-bold hover:underline cursor-pointer"
        >
          Back to Store
        </button>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-[#FFE08F] via-[#F8CB46] to-[#FFE08F] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-900 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-black uppercase tracking-wider bg-white/80 px-2.5 py-0.5 rounded-full inline-block">
            Mega Savings Month
          </span>
          <h3 className="text-[20px] font-black">Up to 50% OFF + Free Delivery</h3>
          <p className="text-[13px] text-slate-800 font-medium">Use code BLINKIT50 on your orders above ₹199</p>
        </div>
        <button
          onClick={() => handleApply('BLINKIT50')}
          className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shrink-0 shadow-sm transition-all"
        >
          Apply BLINKIT50
        </button>
      </div>

      {/* Coupons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon) => {
          const isApplied = appliedCoupon?.code === coupon.code;
          return (
            <div
              key={coupon.code}
              className={`bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                isApplied ? 'border-[#0C831F] bg-[#0C831F]/5 shadow-sm' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-[#F8CB46]/30 text-[#6e5600] text-[13px] font-black px-2.5 py-0.5 rounded tracking-wider">
                    {coupon.code}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{coupon.expiryDate}</span>
                </div>

                <h4 className="text-[15px] font-bold text-[#1C1C1C] mt-2">{coupon.title}</h4>
                <p className="text-[12px] text-slate-600 mt-1 leading-snug">{coupon.description}</p>
                <p className="text-[11px] text-slate-400 mt-2">Min. order value: ₹{coupon.minOrderValue}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="text-[12px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedCode === coupon.code ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}</span>
                </button>

                {isApplied ? (
                  <button
                    onClick={removeCoupon}
                    className="text-[#E23744] text-[12px] font-bold hover:underline cursor-pointer"
                  >
                    Remove Coupon
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(coupon.code)}
                    className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white text-[12px] font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
