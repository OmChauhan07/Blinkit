import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const ApplyCouponModal: React.FC = () => {
  const {
    isApplyCouponModalOpen,
    setIsApplyCouponModalOpen,
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    billSummary
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isApplyCouponModalOpen) return null;

  const handleApply = (codeToApply: string) => {
    const res = applyCoupon(codeToApply);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setIsApplyCouponModalOpen(false);
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsApplyCouponModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0C831F] text-[22px]">sell</span>
            <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Apply Coupon &amp; Offers</h3>
          </div>
          <button
            onClick={() => setIsApplyCouponModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Custom Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code (e.g. BLINKIT50)"
              className="flex-1 px-3.5 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] font-bold text-[#1C1C1C] uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
            />
            <button
              onClick={() => handleApply(inputCode)}
              disabled={!inputCode.trim()}
              className="bg-[#0C831F] disabled:opacity-40 hover:bg-[#0a6d1a] text-white font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Apply
            </button>
          </div>

          {feedback && (
            <p className={`text-[12px] font-semibold ${feedback.success ? 'text-[#0C831F]' : 'text-[#E23744]'}`}>
              {feedback.message}
            </p>
          )}

          {/* Currently Applied Warning / Indicator */}
          {appliedCoupon && (
            <div className="p-3 bg-[#0C831F]/10 rounded-xl border border-[#0C831F]/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Coupon</span>
                <p className="text-[14px] font-extrabold text-[#0C831F]">{appliedCoupon.code}</p>
                <p className="text-[11px] text-slate-600">Saved ₹{billSummary.discount} on this order</p>
              </div>
              <button
                onClick={removeCoupon}
                className="text-[#E23744] text-[12px] font-bold hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          {/* Available Coupons List */}
          <div>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Available Deals &amp; Discounts
            </span>

            <div className="space-y-3">
              {coupons.map((coupon) => {
                const isApplied = appliedCoupon?.code === coupon.code;
                const isApplicable = billSummary.itemTotal >= coupon.minOrderValue;

                return (
                  <div
                    key={coupon.code}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isApplied
                        ? 'border-[#0C831F] bg-[#0C831F]/5'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="inline-block bg-[#F8CB46]/30 text-[#6e5600] font-black text-[12px] px-2 py-0.5 rounded tracking-wider mb-1">
                          {coupon.code}
                        </div>
                        <h4 className="font-bold text-[13px] text-[#1C1C1C]">
                          {coupon.title}
                        </h4>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">
                          {coupon.description}
                        </p>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          {coupon.expiryDate}
                        </span>
                      </div>

                      <div>
                        {isApplied ? (
                          <span className="text-[#0C831F] font-bold text-[12px] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(coupon.code)}
                            disabled={!isApplicable}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                              isApplicable
                                ? 'bg-[#0C831F] hover:bg-[#0a6d1a] text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isApplicable ? 'Apply' : `Add ₹${coupon.minOrderValue - billSummary.itemTotal}`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
