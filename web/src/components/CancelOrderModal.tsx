import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const CANCEL_REASONS = [
  'Placed the order by mistake',
  'Forgot to add essential items',
  'Delivery time is too long',
  'Incorrect delivery address selected',
  'Payment or discount coupon issue',
  'Other reasons'
];

export const CancelOrderModal: React.FC = () => {
  const {
    cancelOrderModalOrderId,
    setCancelOrderModalOrderId,
    cancelOrder,
    getOrderById
  } = useStore();

  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  if (!cancelOrderModalOrderId) return null;

  const order = getOrderById(cancelOrderModalOrderId);

  const handleConfirmCancel = () => {
    if (cancelOrderModalOrderId) {
      cancelOrder(cancelOrderModalOrderId, selectedReason);
      setCancelOrderModalOrderId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setCancelOrderModalOrderId(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#E23744]">cancel</span>
            <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Cancel Order</h3>
          </div>
          <button
            onClick={() => setCancelOrderModalOrderId(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[12px] text-amber-900 leading-snug">
            Are you sure you want to cancel order <strong>{order?.orderNumber || 'your order'}</strong>? A full refund of <strong>₹{order?.grandTotal}</strong> will be initiated instantly.
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">
              Select Reason for Cancellation:
            </label>
            <div className="space-y-2">
              {CANCEL_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-[13px] transition-all ${
                    selectedReason === reason
                      ? 'border-[#E23744] bg-[#E23744]/5 text-[#E23744] font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span>{reason}</span>
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-[#E23744]"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setCancelOrderModalOrderId(null)}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold text-[13px] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Don&#39;t Cancel
            </button>
            <button
              onClick={handleConfirmCancel}
              className="flex-1 py-2.5 bg-[#E23744] hover:bg-[#c92431] text-white font-bold text-[13px] rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
