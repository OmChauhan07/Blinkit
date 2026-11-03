import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, HERO_BANNERS, PRODUCTS } from '../data/mockData';

export const MobileAppView: React.FC = () => {
  const {
    cart,
    billSummary,
    selectedAddress,
    setIsLocationModalOpen,
    setIsCartDrawerOpen,
    setIsLoginModalOpen,
    getItemQuantity,
    addToCart,
    updateQuantity,
    navigate,
    setQuickViewProduct
  } = useStore();

  const [activeTab, setActiveTab] = useState<'delivery' | 'categories' | 'print' | 'orders' | 'profile'>('delivery');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('dairy-bread-eggs');
  const [activeSubcategory, setActiveSubcategory] = useState('All');

  const dairyProducts = PRODUCTS.filter((p) => p.category === 'dairy-bread-eggs');
  const munchiesProducts = PRODUCTS.filter((p) => p.category === 'munchies');
  const drinksProducts = PRODUCTS.filter((p) => p.category === 'cold-drinks-juices');
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const selectedCategory = CATEGORIES.find((c) => c.slug === selectedCategorySlug) || CATEGORIES[1];

  let categoryFilteredProducts = PRODUCTS.filter((p) => p.category === selectedCategory.slug);
  if (activeSubcategory && activeSubcategory !== 'All') {
    categoryFilteredProducts = categoryFilteredProducts.filter((p) =>
      p.subcategory.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
      activeSubcategory.toLowerCase().includes(p.subcategory.toLowerCase())
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F4F6FB] text-[#1C1C1C] relative select-none">
      
      {/* iOS Status Bar Mockup */}
      <div className="h-10 px-6 pt-3 flex items-center justify-between text-[13px] font-bold text-slate-800 bg-white shrink-0">
        <span>9:41</span>
        {/* Dynamic Island */}
        <div className="w-24 h-5 bg-black rounded-full mx-auto" />
        <div className="flex items-center gap-1.5 text-[12px]">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Top Mobile Header (Blinkit Mobile Top Bar) */}
      <div className="bg-white px-4 pt-2 pb-3 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[17px] font-black text-[#F8CB46] tracking-tighter">blink</span>
              <span className="text-[17px] font-black text-[#0C831F] tracking-tighter">it</span>
              <span className="text-[11px] font-bold text-[#1C1C1C] ml-1">in 10 minutes</span>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-0.5 truncate max-w-[220px] text-left cursor-pointer"
            >
              <span className="truncate">{selectedAddress.type}: {selectedAddress.houseNo}, {selectedAddress.city}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-8 h-8 rounded-full bg-[#F8CB46] text-[#1C1C1C] flex items-center justify-center font-bold text-[13px] shrink-0"
          >
            O
          </button>
        </div>

        {/* Search Bar Input */}
        <div
          onClick={() => navigate('/search?q=milk')}
          className="flex items-center bg-[#F4F6FB] rounded-xl px-3 py-2 border border-slate-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">search</span>
          <span className="text-[12px] text-slate-400 flex-1 truncate">Search &quot;milk&quot;, &quot;bread&quot;, &quot;chips&quot;...</span>
          <span className="material-symbols-outlined text-slate-500 text-[18px]">mic</span>
        </div>
      </div>

      {/* Main Tab Screen Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        
        {/* Tab 1: Delivery (Home) */}
        {activeTab === 'delivery' && (
          <div className="p-3.5 space-y-4">
            {/* Promo Carousel Banner */}
            <div className="bg-gradient-to-r from-[#FFE08F] via-[#F8CB46] to-[#FFE08F] p-4 rounded-2xl text-slate-900 shadow-xs relative overflow-hidden">
              <span className="bg-white text-[#0C831F] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                ⚡ Express Delivery
              </span>
              <h3 className="text-[16px] font-black leading-tight max-w-[200px]">
                Pharmacy &amp; Essentials in 10 minutes
              </h3>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5 max-w-[190px]">
                Medicines, first-aid &amp; health supplies
              </p>
              <button
                onClick={() => navigate('/category/cleaning-essentials')}
                className="mt-2.5 bg-[#0C831F] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
              >
                Order Now →
              </button>
              <div className="absolute -right-2 -bottom-2 w-28 h-24 opacity-90">
                <img
                  src={HERO_BANNERS[0].image}
                  alt="banner"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Circular Category Scroller */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-extrabold text-[#1C1C1C]">Explore Categories</span>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="text-[11px] font-bold text-[#0C831F]"
                >
                  See all →
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5 text-center">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategorySlug(cat.slug);
                      setActiveTab('categories');
                    }}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-1 line-clamp-1 leading-tight">
                      {cat.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Product Shelf: Dairy, Bread & Eggs */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h4 className="text-[14px] font-black text-[#1C1C1C]">Dairy, Bread &amp; Eggs</h4>
                  <p className="text-[10px] text-slate-400">Fresh milk, artisan breads &amp; curd</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('dairy-bread-eggs');
                    setActiveTab('categories');
                  }}
                  className="text-[11px] font-bold text-[#0C831F]"
                >
                  See all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {dairyProducts.slice(0, 4).map((product) => {
                  const qty = getItemQuantity(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-[#F8F9FA] rounded-xl p-2.5 flex flex-col justify-between border border-slate-200/60"
                    >
                      <div className="aspect-square bg-white rounded-lg p-1 relative flex items-center justify-center mb-1.5">
                        {product.discount && (
                          <span className="absolute top-1 left-1 bg-[#E23744] text-white text-[9px] font-bold px-1 rounded">
                            {product.discount}
                          </span>
                        )}
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>

                      <span className="text-[9px] font-bold text-[#0C831F]">⚡ 10 MINS</span>
                      <h5 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mt-0.5">
                        {product.name}
                      </h5>
                      <span className="text-[10px] text-slate-400">{product.packWeight}</span>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                        <span className="text-[12px] font-black text-[#1C1C1C] tabular-nums">₹{product.price}</span>
                        
                        <div className="w-[60px] h-[26px]">
                          {qty === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className="w-full h-full rounded-md border border-[#0C831F] bg-white text-[#0C831F] font-black text-[10px] flex items-center justify-center uppercase shadow-2xs"
                            >
                              ADD
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-full rounded-md bg-[#0C831F] text-white flex items-center justify-between px-1 text-[11px] font-bold"
                            >
                              <button onClick={() => updateQuantity(product.id, -1)} className="px-1">−</button>
                              <span className="tabular-nums">{qty}</span>
                              <button onClick={() => updateQuantity(product.id, 1)} className="px-1">+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Product Shelf: Munchies & Chips */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h4 className="text-[14px] font-black text-[#1C1C1C]">Snacks &amp; Munchies</h4>
                  <p className="text-[10px] text-slate-400">Crispy chips, nachos &amp; bhujia</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('munchies');
                    setActiveTab('categories');
                  }}
                  className="text-[11px] font-bold text-[#0C831F]"
                >
                  See all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {munchiesProducts.slice(0, 4).map((product) => {
                  const qty = getItemQuantity(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-[#F8F9FA] rounded-xl p-2.5 flex flex-col justify-between border border-slate-200/60"
                    >
                      <div className="aspect-square bg-white rounded-lg p-1 relative flex items-center justify-center mb-1.5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[9px] font-bold text-[#0C831F]">⚡ 10 MINS</span>
                      <h5 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mt-0.5">
                        {product.name}
                      </h5>
                      <span className="text-[10px] text-slate-400">{product.packWeight}</span>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                        <span className="text-[12px] font-black text-[#1C1C1C] tabular-nums">₹{product.price}</span>
                        
                        <div className="w-[60px] h-[26px]">
                          {qty === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className="w-full h-full rounded-md border border-[#0C831F] bg-white text-[#0C831F] font-black text-[10px] flex items-center justify-center uppercase shadow-2xs"
                            >
                              ADD
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-full rounded-md bg-[#0C831F] text-white flex items-center justify-between px-1 text-[11px] font-bold"
                            >
                              <button onClick={() => updateQuantity(product.id, -1)} className="px-1">−</button>
                              <span className="tabular-nums">{qty}</span>
                              <button onClick={() => updateQuantity(product.id, 1)} className="px-1">+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Product Shelf: Cold Drinks */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h4 className="text-[14px] font-black text-[#1C1C1C]">Cold Drinks &amp; Juices</h4>
                  <p className="text-[10px] text-slate-400">Chilled sodas, juices &amp; refreshments</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('cold-drinks-juices');
                    setActiveTab('categories');
                  }}
                  className="text-[11px] font-bold text-[#0C831F]"
                >
                  See all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {drinksProducts.slice(0, 4).map((product) => {
                  const qty = getItemQuantity(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-[#F8F9FA] rounded-xl p-2.5 flex flex-col justify-between border border-slate-200/60"
                    >
                      <div className="aspect-square bg-white rounded-lg p-1 relative flex items-center justify-center mb-1.5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[9px] font-bold text-[#0C831F]">⚡ 10 MINS</span>
                      <h5 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mt-0.5">
                        {product.name}
                      </h5>
                      <span className="text-[10px] text-slate-400">{product.packWeight}</span>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                        <span className="text-[12px] font-black text-[#1C1C1C] tabular-nums">₹{product.price}</span>
                        
                        <div className="w-[60px] h-[26px]">
                          {qty === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className="w-full h-full rounded-md border border-[#0C831F] bg-white text-[#0C831F] font-black text-[10px] flex items-center justify-center uppercase shadow-2xs"
                            >
                              ADD
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-full rounded-md bg-[#0C831F] text-white flex items-center justify-between px-1 text-[11px] font-bold"
                            >
                              <button onClick={() => updateQuantity(product.id, -1)} className="px-1">−</button>
                              <span className="tabular-nums">{qty}</span>
                              <button onClick={() => updateQuantity(product.id, 1)} className="px-1">+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Categories (Aisle Screen) */}
        {activeTab === 'categories' && (
          <div className="flex h-full">
            {/* Left Category Vertical Rail */}
            <div className="w-20 bg-white border-r border-slate-200 shrink-0 overflow-y-auto no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategorySlug(cat.slug);
                      setActiveSubcategory('All');
                    }}
                    className={`w-full py-3 px-1 flex flex-col items-center text-center border-l-3 transition-colors ${
                      isActive
                        ? 'border-[#0C831F] bg-[#0C831F]/5 text-[#0C831F]'
                        : 'border-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 mb-1 flex items-center justify-center">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[9px] font-bold leading-tight">{cat.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Subcategory Filter & Products */}
            <div className="flex-1 p-3 overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
                {selectedCategory.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${
                      activeSubcategory === sub
                        ? 'bg-[#0C831F] text-white border-[#0C831F]'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {categoryFilteredProducts.map((p) => {
                  const qty = getItemQuantity(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => setQuickViewProduct(p)}
                      className="bg-white rounded-xl p-2.5 border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="aspect-square bg-slate-50 rounded-lg p-1 relative flex items-center justify-center mb-1">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[9px] font-bold text-[#0C831F]">⚡ 10 MINS</span>
                      <h5 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                        {p.name}
                      </h5>
                      <span className="text-[10px] text-slate-400">{p.packWeight}</span>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        <span className="text-[12px] font-black text-[#1C1C1C] tabular-nums">₹{p.price}</span>
                        <div className="w-[56px] h-[26px]">
                          {qty === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(p);
                              }}
                              className="w-full h-full rounded-md border border-[#0C831F] bg-[#F7FCF8] text-[#0C831F] font-bold text-[10px] flex items-center justify-center"
                            >
                              ADD
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-full rounded-md bg-[#0C831F] text-white flex items-center justify-between px-1 text-[11px] font-bold"
                            >
                              <button onClick={() => updateQuantity(p.id, -1)}>−</button>
                              <span>{qty}</span>
                              <button onClick={() => updateQuantity(p.id, 1)}>+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Print Store */}
        {activeTab === 'print' && (
          <div className="p-5 text-center flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-[#0C831F]/10 text-[#0C831F] flex items-center justify-center">
              <span className="material-symbols-outlined text-[42px]">print</span>
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1C1C1C]">Blinkit Print Delivery</h3>
            <p className="text-[12px] text-slate-500 max-w-[260px] leading-relaxed">
              Upload documents, resumes, and study materials for B/W or Color printing delivered in 10 minutes.
            </p>
            <button className="bg-[#0C831F] text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-sm">
              Upload PDF or Images
            </button>
          </div>
        )}

        {/* Tab 4: Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-4 space-y-3">
            <h3 className="text-[16px] font-black text-[#1C1C1C]">My Orders</h3>
            <div
              onClick={() => navigate('/order-tracking/ord-101')}
              className="bg-white rounded-2xl p-4 border border-[#0C831F] shadow-sm cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#0C831F]/15 text-[#0C831F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase animate-pulse">
                  ⚡ Arriving in 8 mins
                </span>
                <span className="text-[11px] text-slate-400">Order #BLK-98214</span>
              </div>
              <h4 className="font-bold text-[13px] text-[#1C1C1C]">3 Items • Amul Milk, Bread &amp; Eggs</h4>
              <p className="text-[11px] text-slate-500 mt-1">Delivering to Home (Sector 48, Gurugram)</p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12px] font-bold text-[#0C831F]">
                <span>Track Live Status →</span>
                <span className="text-[#1C1C1C]">₹153</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/orders')}
              className="bg-white rounded-2xl p-4 border border-slate-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Delivered Yesterday
                </span>
                <span className="text-[11px] text-slate-400">Order #BLK-87103</span>
              </div>
              <h4 className="font-bold text-[13px] text-[#1C1C1C]">3 Items • Lay&#39;s, Coke &amp; Silk</h4>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12px] font-bold text-slate-700">
                <span>View Full Receipt</span>
                <span>₹234</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F8CB46] text-[#1C1C1C] flex items-center justify-center font-black text-[20px]">
                O
              </div>
              <div>
                <h4 className="font-black text-[16px] text-[#1C1C1C]">Omkar Chauhan</h4>
                <p className="text-[12px] font-semibold text-slate-600">+91 98765 43210</p>
                <p className="text-[11px] text-slate-400">odchauhan0702@gmail.com</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-[13px] font-bold text-slate-800">
              <button onClick={() => navigate('/orders')} className="w-full p-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-blue-600">receipt_long</span> Orders</span>
                <span>›</span>
              </button>
              <button onClick={() => navigate('/addresses')} className="w-full p-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#0C831F]">location_on</span> Addresses</span>
                <span>›</span>
              </button>
              <button onClick={() => navigate('/wishlist')} className="w-full p-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-red-500">favorite</span> Wishlist</span>
                <span>›</span>
              </button>
              <button onClick={() => navigate('/offers')} className="w-full p-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#F8CB46]">sell</span> Coupons</span>
                <span>›</span>
              </button>
              <button onClick={() => navigate('/support')} className="w-full p-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-purple-600">support_agent</span> 24x7 Support</span>
                <span>›</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Pill (Over tabs when items in cart) */}
      {totalCartCount > 0 && (
        <div className="absolute bottom-[66px] left-3 right-3 z-30">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full bg-[#0C831F] text-white rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-[0_4px_16px_rgba(12,131,31,0.4)] active:scale-98 transition-all cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">
                {totalCartCount} {totalCartCount === 1 ? 'ITEM' : 'ITEMS'}
              </span>
              <span className="text-[14px] font-black tabular-nums">
                ₹{billSummary.grandTotal}
              </span>
            </div>
            <div className="flex items-center gap-1 font-bold text-[13px]">
              <span>View Cart</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </button>
        </div>
      )}

      {/* Fixed Mobile Bottom Tab Bar */}
      <div className="h-[60px] bg-white border-t border-slate-200 flex items-center justify-around px-2 shrink-0 z-20">
        {[
          { id: 'delivery', label: 'Delivery', icon: 'bolt' },
          { id: 'categories', label: 'Categories', icon: 'grid_view' },
          { id: 'print', label: 'Print', icon: 'print' },
          { id: 'orders', label: 'Orders', icon: 'receipt_long' },
          { id: 'profile', label: 'Profile', icon: 'person' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
                isActive ? 'text-[#0C831F]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'font-fill' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-[#0C831F]' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
