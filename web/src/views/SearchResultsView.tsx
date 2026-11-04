import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const SearchResultsView: React.FC = () => {
  const { currentRoute, navigate, sortBy, setSortBy, setQuickViewProduct } = useStore();

  // Extract query from URL e.g. /search?q=amul+milk
  const query = useMemo(() => {
    const match = currentRoute.match(/[?&]q=([^&]+)/);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : 'milk';
  }, [currentRoute]);

  const searchResults = useMemo(() => {
    const cleanQ = query.toLowerCase().trim();
    const words = cleanQ.split(' ').filter(Boolean);

    let list = PRODUCTS.filter((p) => {
      const text = `${p.name} ${p.brand} ${p.category} ${p.subcategory}`.toLowerCase();
      return words.some((w) => text.includes(w));
    });

    if (list.length === 0) {
      // fallback to popular products if specific search yielded nothing
      list = PRODUCTS.slice(0, 8);
    }

    const sorted = [...list];
    if (sortBy === 'price_low_high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high_low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_high') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return sorted;
  }, [query, sortBy]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-4">
        <button onClick={() => navigate('/')} className="hover:text-slate-800 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span>Search</span>
        <span>/</span>
        <span className="font-semibold text-[#1C1C1C] truncate">&quot;{query}&quot;</span>
      </div>

      {/* Header and Results Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-extrabold text-[#1C1C1C]">
              Showing results for &quot;{query}&quot;
            </h1>
            <span className="bg-[#0C831F]/10 text-[#0C831F] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {searchResults.length} items
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5">
            ⚡ All items in stock for instant 10-minute delivery
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[12px] font-bold text-slate-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-[#F4F6FB] border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 focus:outline-none focus:border-[#0C831F] cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="rating_high">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Suggested Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        <span className="text-[12px] font-bold text-slate-400 shrink-0">Related:</span>
        {['Amul Gold', 'Toned Milk', 'Cow Milk', 'Curd', 'Brown Bread', 'Paneer'].map((keyword) => (
          <button
            key={keyword}
            onClick={() => navigate(`/search?q=${encodeURIComponent(keyword)}`)}
            className="px-3 py-1 bg-white hover:bg-[#0C831F]/10 hover:text-[#0C831F] text-slate-700 rounded-full text-[12px] font-medium border border-slate-200 shrink-0 transition-colors cursor-pointer"
          >
            {keyword}
          </button>
        ))}
      </div>

      {/* Product Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {searchResults.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>
    </div>
  );
};
