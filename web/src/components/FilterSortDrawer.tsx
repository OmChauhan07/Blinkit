import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface FilterSortDrawerProps {
  brands?: string[];
  selectedBrands?: string[];
  onSelectBrands?: (brands: string[]) => void;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
}

export const FilterSortDrawer: React.FC<FilterSortDrawerProps> = ({
  brands = ['Amul', 'Mother Dairy', 'Harvest Gold', "Lay's", "Haldiram's", 'Cadbury', 'Coca-Cola', 'Real', 'Pringles'],
  selectedBrands = [],
  onSelectBrands
}) => {
  const {
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    sortBy,
    setSortBy
  } = useStore();

  const [localSort, setLocalSort] = useState(sortBy);
  const [localBrands, setLocalBrands] = useState<string[]>(selectedBrands);

  if (!isFilterDrawerOpen) return null;

  const toggleBrand = (b: string) => {
    setLocalBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const handleApply = () => {
    setSortBy(localSort);
    if (onSelectBrands) {
      onSelectBrands(localBrands);
    }
    setIsFilterDrawerOpen(false);
  };

  const handleReset = () => {
    setLocalSort('relevance');
    setLocalBrands([]);
    setSortBy('relevance');
    if (onSelectBrands) {
      onSelectBrands([]);
    }
    setIsFilterDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsFilterDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-[360px] bg-white flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0C831F]">tune</span>
              <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Filters &amp; Sort</h3>
            </div>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Sort Section */}
            <div>
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Sort Products By
              </span>
              <div className="space-y-2">
                {[
                  { id: 'relevance', label: 'Relevance (Popularity)' },
                  { id: 'price_low_high', label: 'Price: Low to High' },
                  { id: 'price_high_low', label: 'Price: High to Low' },
                  { id: 'discount_high', label: 'Discount: High to Low' },
                  { id: 'rating_high', label: 'Customer Rating' }
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      localSort === opt.id
                        ? 'border-[#0C831F] bg-[#0C831F]/5 text-[#0C831F] font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                    } text-[13px]`}
                  >
                    <span>{opt.label}</span>
                    <input
                      type="radio"
                      name="sort_option"
                      checked={localSort === opt.id}
                      onChange={() => setLocalSort(opt.id)}
                      className="accent-[#0C831F]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Brands Filter Section */}
            <div>
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Filter by Brand
              </span>
              <div className="space-y-2">
                {brands.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-[13px] text-slate-700 font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={localBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="w-4 h-4 rounded accent-[#0C831F] cursor-pointer"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Guarantee */}
            <div className="bg-[#F4F6FB] p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-[#0C831F] font-bold text-[13px] mb-1">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Express Delivery Only</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                All shown inventory is pre-stocked in your micro dark store for 10-minute dispatch.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 flex items-center gap-3 bg-white shrink-0">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[13px] rounded-xl transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2.5 bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[13px] rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
