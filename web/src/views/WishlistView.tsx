import React from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlistIds, navigate, setQuickViewProduct } = useStore();

  const savedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-black text-[#1C1C1C]">Your Wishlist</h1>
            <span className="bg-[#E23744]/10 text-[#E23744] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {savedProducts.length} items
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5">Quick access to the products you love and reorder regularly</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-[#0C831F] text-[13px] font-bold hover:underline cursor-pointer"
        >
          Explore More Products
        </button>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#E23744] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[32px]">favorite_border</span>
          </div>
          <h3 className="text-[16px] font-bold text-slate-700">No saved items in wishlist</h3>
          <p className="text-[12px] text-slate-400 mt-1 mb-4">Tap the heart icon on any product to save it here for later.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#0C831F] text-white px-5 py-2 rounded-xl text-[13px] font-bold"
          >
            Explore Groceries
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {savedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
