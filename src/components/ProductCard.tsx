import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { getItemQuantity, addToCart, updateQuantity, toggleWishlist, isInWishlist, navigate } = useStore();
  const quantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicked on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-black/8 hover:border-[#0C831F]/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer overflow-hidden p-3 min-h-[290px]"
    >
      {/* Top badges: Discount & Wishlist */}
      <div className="relative w-full aspect-square flex items-center justify-center bg-white rounded-lg overflow-hidden mb-2">
        {product.discount && (
          <span className="absolute top-1 left-1 bg-[#E23744] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 tracking-wide uppercase">
            {product.discount}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-1 right-1 p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors z-10 ${
            inWishlist ? 'text-[#E23744]' : 'text-slate-400 hover:text-slate-700'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <span className={`material-symbols-outlined text-[18px] ${inWishlist ? 'font-fill' : ''}`}>
            {inWishlist ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick View Button overlay on hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 flex items-center gap-1 border border-slate-200"
          >
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            Quick View
          </button>
        )}
      </div>

      {/* Product Metadata Stacking */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Time Guarantee tag */}
          <div className="inline-flex items-center gap-1 bg-[#F4F6FB] text-[#0C831F] text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1">
            <span className="material-symbols-outlined text-[12px]">bolt</span>
            <span>{product.eta || '10 MINS'}</span>
          </div>

          {/* Product Title (2-line clamped) */}
          <h3 className="text-[13px] font-semibold text-[#1C1C1C] line-clamp-2 leading-[18px] min-h-[36px] group-hover:text-[#0C831F] transition-colors">
            {product.name}
          </h3>

          {/* Weight / Pack info */}
          <p className="text-[12px] text-slate-500 font-normal mt-1">
            {product.packWeight}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-bold text-[#1C1C1C] tabular-nums">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-slate-400 line-through tabular-nums">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* Responsive Zero-Shift CTA Button */}
          <div className="w-[72px] h-[32px] shrink-0">
            {quantity === 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="w-full h-full rounded-lg border border-[#0C831F] bg-[#F7FCF8] text-[#0C831F] hover:bg-[#0C831F] hover:text-white font-bold text-[12px] tracking-wider transition-all duration-150 flex items-center justify-center uppercase shadow-2xs cursor-pointer active:scale-95"
              >
                ADD
              </button>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full h-full rounded-lg bg-[#0C831F] text-white flex items-center justify-between px-1.5 font-bold text-[13px] shadow-sm"
              >
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="w-5 h-full flex items-center justify-center text-white/90 hover:text-white hover:scale-120 transition-all cursor-pointer"
                  title="Decrease"
                >
                  −
                </button>
                <span className="tabular-nums font-bold text-[12px]">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-5 h-full flex items-center justify-center text-white/90 hover:text-white hover:scale-120 transition-all cursor-pointer"
                  title="Increase"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
