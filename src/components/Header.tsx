import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockData';

const SEARCH_PLACEHOLDERS = [
  "Search 'milk'...",
  "Search 'bread'...",
  "Search 'atta'...",
  "Search 'chips'...",
  "Search 'curd'...",
  "Search 'eggs'...",
  "Search 'coke'..."
];

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    cart,
    billSummary,
    selectedAddress,
    user,
    setIsCartDrawerOpen,
    setIsLocationModalOpen,
    setIsLoginModalOpen,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Cycle search placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchSuggestionClick = (query: string) => {
    setSearchQuery(query);
    setIsSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Top Main Navigation Bar (Height: 76px) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[76px] flex items-center justify-between gap-4">
        
        {/* Left Section: Logo & Location Selector */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Dual-Color Wordmark Logo */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer select-none flex items-center"
            title="Blinkit Home"
          >
            <span className="text-[28px] sm:text-[32px] font-black tracking-tighter text-[#F8CB46] font-['Plus_Jakarta_Sans']">
              blink
            </span>
            <span className="text-[28px] sm:text-[32px] font-black tracking-tighter text-[#0C831F] font-['Plus_Jakarta_Sans']">
              it
            </span>
          </div>

          {/* Location Selector (Stacked BBD Delivery Info) */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden sm:flex flex-col text-left py-1 px-2.5 rounded-lg hover:bg-slate-100/80 transition-colors group cursor-pointer max-w-[210px] md:max-w-[260px]"
          >
            <div className="flex items-center gap-1 text-[#1C1C1C] text-[12px] font-extrabold tracking-tight">
              <span className="material-symbols-outlined text-[16px] text-[#F8CB46] fill-1">
                bolt
              </span>
              <span>Delivery in 10 minutes</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate w-full">
              <span className="truncate">{selectedAddress.houseNo}, {selectedAddress.city}</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-y-0.5">
                expand_more
              </span>
            </div>
          </button>
        </div>

        {/* Center Section: Flexible Omni-Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-[620px] mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center bg-[#F4F6FB] rounded-xl border border-transparent focus-within:border-[#0C831F] focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(12,131,31,0.1)] transition-all h-[46px] px-3">
              <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2.5">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                className="w-full bg-transparent text-[14px] text-[#1C1C1C] placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </form>

          {/* Search Suggestions Dropdown Overlay */}
          {isSearchFocused && (
            <div className="absolute top-[52px] left-0 right-0 bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Amul Milk', 'Curd', 'Brown Bread', 'Potato Chips', 'Paneer', 'Eggs', 'Cold Drinks'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearchSuggestionClick(term)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F6FB] hover:bg-[#0C831F]/10 hover:text-[#0C831F] text-slate-700 text-[12px] font-medium rounded-full transition-colors cursor-pointer border border-slate-200/60"
                    >
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Popular Categories
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setIsSearchFocused(false);
                        navigate(`/category/${cat.slug}`);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                    >
                      <img src={cat.image} alt={cat.name} className="w-8 h-8 object-contain rounded" />
                      <span className="text-[12px] font-semibold text-slate-800 truncate">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Header Actions (Login/Profile & Floating Cart Button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Wishlist Quick Link */}
          <button
            onClick={() => navigate('/wishlist')}
            className="hidden md:flex p-2 text-slate-600 hover:text-[#E23744] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Saved Items / Wishlist"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
          </button>

          {/* Account/Profile/Login Trigger */}
          {user.isLoggedIn ? (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 py-2 px-3 text-[#1C1C1C] hover:text-[#0C831F] hover:bg-slate-100 rounded-lg font-semibold text-[14px] transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#F8CB46] text-[#1C1C1C] flex items-center justify-center font-bold text-[12px]">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3.5 py-2 text-[#1C1C1C] hover:text-[#0C831F] font-bold text-[14px] transition-colors cursor-pointer"
            >
              Login
            </button>
          )}

          {/* Cart CTA Trigger Bar */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2.5 bg-[#0C831F] hover:bg-[#0a6d1a] text-white px-3 sm:px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all shadow-[0_2px_8px_rgba(12,131,31,0.25)] active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[11px] font-semibold opacity-90">
                {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-[13px] font-bold tabular-nums">
                ₹{billSummary.grandTotal}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Secondary Category Navigation Ribbon */}
      <div className="w-full bg-white border-t border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center overflow-x-auto no-scrollbar py-2 gap-6 text-[13px] font-medium text-slate-600 whitespace-nowrap">
          <button
            onClick={() => navigate('/')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              currentRoute === '/'
                ? 'text-[#0C831F] font-bold border-[#0C831F]'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Home
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = currentRoute === `/category/${cat.slug}`;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className={`cursor-pointer transition-colors pb-1 border-b-2 ${
                  isActive
                    ? 'text-[#0C831F] font-bold border-[#0C831F]'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
