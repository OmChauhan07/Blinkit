import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailView: React.FC = () => {
  const { currentRoute, navigate, getItemQuantity, addToCart, updateQuantity, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();

  // Extract ID from route: /product/:id
  const productId = currentRoute.replace('/product/', '').split('/')[0];
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const quantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);

  const variants = product.variants || [
    { weight: product.packWeight, price: product.price, mrp: product.mrp }
  ];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = variants[selectedVariantIndex] || variants[0];

  // Related products in the same category
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 pb-16 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-slate-800 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/category/${product.category}`)}
          className="hover:text-slate-800 capitalize cursor-pointer"
        >
          {product.category.replace(/-/g, ' ')}
        </button>
        <span>/</span>
        <span>{product.subcategory}</span>
        <span>/</span>
        <span className="font-semibold text-[#1C1C1C] truncate">{product.name}</span>
      </div>

      {/* Main Contiguous PDP Module */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Gallery & Value Props */}
          <div className="space-y-6">
            <div className="relative aspect-square max-w-[420px] mx-auto bg-slate-50 rounded-2xl p-8 flex items-center justify-center border border-slate-100">
              {product.discount && (
                <span className="absolute top-4 left-4 bg-[#E23744] text-white text-[12px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-2xs">
                  {product.discount}
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm transition-colors ${
                  inWishlist ? 'text-[#E23744]' : 'text-slate-400 hover:text-slate-700'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <span className={`material-symbols-outlined text-[24px] ${inWishlist ? 'font-fill' : ''}`}>
                  {inWishlist ? 'favorite' : 'favorite_border'}
                </span>
              </button>

              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[340px]"
              />
            </div>

            {/* Micro Trust Badges */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#F4F6FB] rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-[#0C831F] text-[22px] mb-1">verified</span>
                <span className="text-[11px] font-bold text-slate-800 block">100% Genuine</span>
                <span className="text-[10px] text-slate-500">Direct from brand</span>
              </div>
              <div className="p-3 bg-[#F4F6FB] rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-[#F8CB46] text-[22px] mb-1">bolt</span>
                <span className="text-[11px] font-bold text-slate-800 block">10 Min Delivery</span>
                <span className="text-[10px] text-slate-500">From dark store</span>
              </div>
              <div className="p-3 bg-[#F4F6FB] rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-blue-600 text-[22px] mb-1">assignment_return</span>
                <span className="text-[11px] font-bold text-slate-800 block">Easy Returns</span>
                <span className="text-[10px] text-slate-500">Instant refunds</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#0C831F]/10 text-[#0C831F] text-[11px] font-bold px-2.5 py-1 rounded-full mb-2">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>DELIVERY IN 10 MINUTES</span>
              </div>

              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider block">
                {product.brand}
              </span>
              <h1 className="text-[22px] sm:text-[26px] font-black text-[#1C1C1C] leading-snug mt-1">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-[#0C831F] text-white text-[12px] font-bold px-2 py-0.5 rounded">
                  <span>{product.rating || 4.8}</span>
                  <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                </div>
                <span className="text-[12px] text-slate-500 font-medium">
                  {product.ratingCount?.toLocaleString() || '12,400'} ratings
                </span>
              </div>
            </div>

            {/* Pack Size Variants */}
            {variants.length > 0 && (
              <div className="border-t border-b border-slate-100 py-4">
                <span className="text-[13px] font-bold text-slate-800 block mb-2">
                  Select Unit / Quantity:
                </span>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v, idx) => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all cursor-pointer flex items-center gap-3 ${
                        selectedVariantIndex === idx
                          ? 'border-[#0C831F] bg-[#0C831F]/10 text-[#0C831F] shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{v.weight}</span>
                      <span className="tabular-nums">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price and Big Buy CTA */}
            <div className="bg-[#F4F6FB] p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] sm:text-[28px] font-black text-[#1C1C1C] tabular-nums">
                    ₹{activeVariant.price}
                  </span>
                  {activeVariant.mrp > activeVariant.price && (
                    <span className="text-[15px] text-slate-400 line-through tabular-nums">
                      MRP ₹{activeVariant.mrp}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-[13px] font-bold text-[#E23744]">
                      {product.discount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 block">(Inclusive of all taxes)</span>
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-[150px] h-[44px]">
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(product, activeVariant.weight)}
                    className="w-full h-full bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-extrabold text-[14px] rounded-xl shadow-[0_4px_12px_rgba(12,131,31,0.25)] transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                    <span>ADD TO CART</span>
                  </button>
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#0C831F] text-white flex items-center justify-between px-3 font-bold text-[15px] shadow-sm">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-8 h-full flex items-center justify-center hover:scale-120 transition-transform cursor-pointer"
                    >
                      −
                    </button>
                    <span className="tabular-nums font-black">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-8 h-full flex items-center justify-center hover:scale-120 transition-transform cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Specs Table */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[15px] font-bold text-[#1C1C1C]">Product Details</h3>
              
              <div className="space-y-2 text-[13px] text-slate-600 leading-relaxed">
                <p>{product.description}</p>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-[12px]">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Pack Weight</span>
                    <span className="font-semibold text-slate-800">{activeVariant.weight}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Shelf Life</span>
                    <span className="font-semibold text-slate-800">{product.shelfLife || '2 days from packing'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Manufacturer</span>
                    <span className="font-semibold text-slate-800">{product.manufacturer || 'Certified Producer'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Country of Origin</span>
                    <span className="font-semibold text-slate-800">{product.countryOfOrigin || 'India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">
              Customers Also Bought
            </h2>
            <button
              onClick={() => navigate(`/category/${product.category}`)}
              className="text-[#0C831F] text-[13px] font-bold hover:underline"
            >
              View More
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
