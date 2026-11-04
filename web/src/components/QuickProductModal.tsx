import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const QuickProductModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    getItemQuantity,
    addToCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    navigate
  } = useStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!quickViewProduct) return null;

  const quantity = getItemQuantity(quickViewProduct.id);
  const inWishlist = isInWishlist(quickViewProduct.id);

  const variants = quickViewProduct.variants || [
    { weight: quickViewProduct.packWeight, price: quickViewProduct.price, mrp: quickViewProduct.mrp }
  ];
  const activeVariant = variants[selectedVariantIndex] || variants[0];

  const handleFullDetailView = () => {
    const id = quickViewProduct.id;
    setQuickViewProduct(null);
    navigate(`/product/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-20"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Left: Product Image Box */}
          <div className="relative bg-slate-50 flex items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-slate-100">
            {quickViewProduct.discount && (
              <span className="absolute top-4 left-4 bg-[#E23744] text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow-2xs">
                {quickViewProduct.discount}
              </span>
            )}

            <button
              onClick={() => toggleWishlist(quickViewProduct.id)}
              className={`absolute top-4 right-4 p-1.5 rounded-full bg-white shadow-sm transition-colors ${
                inWishlist ? 'text-[#E23744]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${inWishlist ? 'font-fill' : ''}`}>
                {inWishlist ? 'favorite' : 'favorite_border'}
              </span>
            </button>

            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* ETA tag */}
              <div className="inline-flex items-center gap-1 bg-[#F4F6FB] text-[#0C831F] text-[11px] font-bold px-2 py-0.5 rounded-full mb-2">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>{quickViewProduct.eta || '10 MINS'} DELIVERY</span>
              </div>

              {/* Title & Brand */}
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                {quickViewProduct.brand}
              </p>
              <h2 className="text-[17px] font-extrabold text-[#1C1C1C] leading-snug mt-0.5">
                {quickViewProduct.name}
              </h2>

              {/* Price block */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-[20px] font-black text-[#1C1C1C] tabular-nums">
                  ₹{activeVariant.price}
                </span>
                {activeVariant.mrp > activeVariant.price && (
                  <span className="text-[13px] text-slate-400 line-through tabular-nums">
                    ₹{activeVariant.mrp}
                  </span>
                )}
                {quickViewProduct.discount && (
                  <span className="text-[12px] font-bold text-[#E23744]">
                    ({quickViewProduct.discount})
                  </span>
                )}
              </div>

              {/* Pack Variant Selector */}
              {variants.length > 1 && (
                <div className="mt-4">
                  <span className="text-[12px] font-bold text-slate-700 block mb-1.5">
                    Select Unit / Pack Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, idx) => (
                      <button
                        key={v.weight}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
                          selectedVariantIndex === idx
                            ? 'border-[#0C831F] bg-[#0C831F]/10 text-[#0C831F]'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {v.weight} • ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              <div className="mt-4 text-[12px] text-slate-600 space-y-1 bg-[#F4F6FB] p-2.5 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shelf Life:</span>
                  <span className="font-semibold text-slate-700">{quickViewProduct.shelfLife || 'Check packaging'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Country of Origin:</span>
                  <span className="font-semibold text-slate-700">{quickViewProduct.countryOfOrigin || 'India'}</span>
                </div>
              </div>
            </div>

            {/* Actions: Add to Cart & Full Details */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={handleFullDetailView}
                className="text-[12px] font-bold text-[#0C831F] hover:underline cursor-pointer"
              >
                View Full Details →
              </button>

              <div className="w-[100px] h-[36px]">
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(quickViewProduct, activeVariant.weight)}
                    className="w-full h-full rounded-lg border border-[#0C831F] bg-[#F7FCF8] text-[#0C831F] hover:bg-[#0C831F] hover:text-white font-bold text-[13px] tracking-wider transition-all flex items-center justify-center uppercase cursor-pointer"
                  >
                    ADD
                  </button>
                ) : (
                  <div className="w-full h-full rounded-lg bg-[#0C831F] text-white flex items-center justify-between px-2 font-bold text-[13px]">
                    <button
                      onClick={() => updateQuantity(quickViewProduct.id, -1)}
                      className="w-6 h-full flex items-center justify-center hover:scale-120 transition-transform cursor-pointer"
                    >
                      −
                    </button>
                    <span className="tabular-nums">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(quickViewProduct.id, 1)}
                      className="w-6 h-full flex items-center justify-center hover:scale-120 transition-transform cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
