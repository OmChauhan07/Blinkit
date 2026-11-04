import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const RateOrderModal: React.FC = () => {
  const {
    rateOrderModalOrderId,
    setRateOrderModalOrderId,
    rateOrder,
    getOrderById
  } = useStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  if (!rateOrderModalOrderId) return null;

  const order = getOrderById(rateOrderModalOrderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rateOrderModalOrderId) {
      rateOrder(rateOrderModalOrderId, rating, review);
      setRateOrderModalOrderId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setRateOrderModalOrderId(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F8CB46]">star</span>
            <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Rate Your Experience</h3>
          </div>
          <button
            onClick={() => setRateOrderModalOrderId(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 text-center space-y-4">
          <div>
            <p className="text-[13px] text-slate-600">
              How was your delivery for Order <strong>{order?.orderNumber}</strong>?
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Delivered by {order?.driverName || 'Ramesh Kumar'} in 9 mins
            </p>
          </div>

          {/* Star selector */}
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[32px] ${
                    (hoverRating || rating) >= star
                      ? 'text-[#F8CB46] fill-1'
                      : 'text-slate-200'
                  }`}
                >
                  star
                </span>
              </button>
            ))}
          </div>

          <p className="text-[12px] font-bold text-slate-700">
            {rating === 5
              ? 'Excellent • 5 Stars'
              : rating === 4
              ? 'Very Good • 4 Stars'
              : rating === 3
              ? 'Average • 3 Stars'
              : rating === 2
              ? 'Poor • 2 Stars'
              : 'Terrible • 1 Star'}
          </p>

          <div>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you liked (packaging, fast delivery, fresh items)..."
              className="w-full p-3 bg-[#F4F6FB] rounded-xl text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[14px] py-3 rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};
