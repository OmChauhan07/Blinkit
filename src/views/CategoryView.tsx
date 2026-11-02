import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { FilterSortDrawer } from '../components/FilterSortDrawer';

export const CategoryView: React.FC = () => {
  const { currentRoute, navigate, sortBy, setSortBy, setIsFilterDrawerOpen, setQuickViewProduct } = useStore();

  // Extract category slug from route: /category/:slug
  const slug = currentRoute.replace('/category/', '').split('/')[0] || 'dairy-bread-eggs';
  const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[1]; // default to dairy

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(category.subcategories[0]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Filter products by category and subcategory
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.category === category.slug);

    if (selectedSubcategory && !selectedSubcategory.toLowerCase().startsWith('all')) {
      list = list.filter((p) => p.subcategory.toLowerCase().includes(selectedSubcategory.toLowerCase()) || selectedSubcategory.toLowerCase().includes(p.subcategory.toLowerCase()));
    }

    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // Apply sorting
    const sorted = [...list];
    if (sortBy === 'price_low_high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high_low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_high') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return sorted;
  }, [category.slug, selectedSubcategory, selectedBrands, sortBy]);

  // Extract available brands in this category for the filter
  const categoryBrands = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.filter((p) => p.category === category.slug).forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [category.slug]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-4">
        <button onClick={() => navigate('/')} className="hover:text-slate-800 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="font-semibold text-[#1C1C1C]">{category.name}</span>
      </div>

      <div className="flex items-start gap-6">
        
        {/* Left Subcategory Rail (240px Desktop) */}
        <aside className="w-56 shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden hidden md:block sticky top-28">
          <div className="p-3.5 border-b border-slate-100 bg-[#F4F6FB] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0C831F] text-[20px]">{category.icon}</span>
            <span className="font-extrabold text-[13px] text-[#1C1C1C] truncate">{category.name}</span>
          </div>

          <nav className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
            {category.subcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`w-full text-left px-4 py-3 text-[13px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#0C831F]/10 text-[#0C831F] font-bold border-l-4 border-[#0C831F]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                  }`}
                >
                  <span className="truncate">{sub}</span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Product Grid Area */}
        <main className="flex-1 min-w-0">
          
          {/* Top Filter & Sort Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">
                  {selectedSubcategory}
                </h1>
                <span className="bg-[#0C831F]/10 text-[#0C831F] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {filteredProducts.length} items
                </span>
              </div>
              <p className="text-[12px] text-slate-400 mt-0.5">Instant delivery to your address in 10-12 mins</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Filter Drawer Trigger */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F6FB] hover:bg-slate-200 border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Filters {selectedBrands.length > 0 ? `(${selectedBrands.length})` : ''}</span>
              </button>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-[#F4F6FB] border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 focus:outline-none focus:border-[#0C831F] cursor-pointer"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="rating_high">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Mobile Horizontal Subcategory Scroll Bar */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-2">
            {category.subcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0C831F] text-white border-[#0C831F]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">inventory_2</span>
              <h3 className="text-[16px] font-bold text-slate-700">No items found</h3>
              <p className="text-[12px] text-slate-400 mt-1">Try resetting brand filters or selecting another category.</p>
              <button
                onClick={() => {
                  setSelectedSubcategory(category.subcategories[0]);
                  setSelectedBrands([]);
                }}
                className="mt-4 bg-[#0C831F] text-white px-4 py-2 rounded-xl text-[12px] font-bold hover:bg-[#0a6d1a] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Filter Drawer */}
      <FilterSortDrawer
        brands={categoryBrands}
        selectedBrands={selectedBrands}
        onSelectBrands={setSelectedBrands}
      />
    </div>
  );
};
