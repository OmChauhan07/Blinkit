import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, HERO_BANNERS, PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const StorefrontView: React.FC = () => {
  const { navigate, setQuickViewProduct } = useStore();
  const [activeBanner, setActiveBanner] = useState(0);

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const dairyProducts = PRODUCTS.filter((p) => p.category === 'dairy-bread-eggs');
  const munchiesProducts = PRODUCTS.filter((p) => p.category === 'munchies');
  const drinksProducts = PRODUCTS.filter((p) => p.category === 'cold-drinks-juices');
  const staplesProducts = PRODUCTS.filter((p) => p.category === 'atta-rice-dal' || p.category === 'instant-frozen-food');

  return (
    <div className="w-full pb-16 space-y-8 max-w-[1280px] mx-auto px-4 sm:px-6 pt-4">
      {/* Hero Promotional Banner Carousel */}
      <section className="relative w-full rounded-2xl overflow-hidden shadow-xs">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeBanner * 100}%)` }}
        >
          {HERO_BANNERS.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full flex-shrink-0 bg-gradient-to-r ${banner.gradient} p-6 sm:p-10 min-h-[220px] sm:min-h-[240px] flex items-center justify-between relative overflow-hidden`}
            >
              <div className="max-w-xl z-10 space-y-2.5">
                <span className="inline-flex items-center gap-1 bg-white text-[#0C831F] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                  <span className="material-symbols-outlined text-[14px]">{banner.badgeIcon}</span>
                  {banner.badge}
                </span>

                <h2 className="text-[22px] sm:text-[30px] font-black text-[#1C1C1C] tracking-tight leading-tight">
                  {banner.title}
                </h2>

                <p className="text-[13px] sm:text-[14px] text-slate-700 font-medium max-w-md">
                  {banner.subtitle}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/category/${banner.categorySlug}`)}
                    className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{banner.ctaText}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Banner Graphic Image */}
              <div className="hidden md:block w-72 h-44 shrink-0 relative">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBanner(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeBanner === idx ? 'w-6 bg-[#0C831F]' : 'w-2 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Category Shelf Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">
            Explore Categories
          </h2>
          <span className="text-[12px] font-bold text-[#0C831F]">
            ⚡ Delivered in 10 mins
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="bg-white rounded-xl p-3 border border-slate-200/80 hover:border-[#0C831F]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-[13px] font-bold text-slate-800 group-hover:text-[#0C831F] transition-colors leading-tight line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {cat.itemCount}+ items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Shelf 1: Dairy, Bread & Eggs */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">
                Dairy, Bread &amp; Eggs
              </h2>
              <span className="bg-[#0C831F]/10 text-[#0C831F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Daily Essentials
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">Fresh milk, artisan breads, farmhouse butter &amp; eggs</p>
          </div>
          <button
            onClick={() => navigate('/category/dairy-bread-eggs')}
            className="text-[#0C831F] text-[13px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>see all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {dairyProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Shelf 2: Munchies & Chips */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">
                Snacks &amp; Munchies
              </h2>
              <span className="bg-[#F8CB46]/30 text-[#6e5600] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Late Night Favorites
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">Crispy chips, nachos, bhujia &amp; spiced corn puffs</p>
          </div>
          <button
            onClick={() => navigate('/category/munchies')}
            className="text-[#0C831F] text-[13px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>see all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {munchiesProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Shelf 3: Cold Drinks & Juices */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">
                Cold Drinks &amp; Juices
              </h2>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Chilled Refreshment
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">Chilled sodas, 100% fruit juices, and mango pulps</p>
          </div>
          <button
            onClick={() => navigate('/category/cold-drinks-juices')}
            className="text-[#0C831F] text-[13px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>see all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {drinksProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Shelf 4: Daily Staples & Instant Meals */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#1C1C1C]">
              Atta, Rice &amp; Quick Meals
            </h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Aashirvaad chakki atta, royal basmati &amp; Maggi</p>
          </div>
          <button
            onClick={() => navigate('/category/atta-rice-dal')}
            className="text-[#0C831F] text-[13px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>see all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {staplesProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Value Proposition Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8CB46]/20 flex items-center justify-center text-[#936F00] shrink-0">
            <span className="material-symbols-outlined text-[26px]">electric_bolt</span>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#1C1C1C]">Superfast 10-Minute Delivery</h4>
            <p className="text-[12px] text-slate-500">From micro-stores located right in your neighborhood</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0C831F]/10 flex items-center justify-center text-[#0C831F] shrink-0">
            <span className="material-symbols-outlined text-[26px]">inventory_2</span>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#1C1C1C]">Best Prices &amp; Genuine Products</h4>
            <p className="text-[12px] text-slate-500">Direct from certified brands &amp; verified farmers</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
            <span className="material-symbols-outlined text-[26px]">verified_user</span>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#1C1C1C]">Easy Returns &amp; Instant Refunds</h4>
            <p className="text-[12px] text-slate-500">No questions asked refund credited to your account</p>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="pt-8 border-t border-slate-200 text-slate-600 text-[13px] space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h5 className="font-bold text-[#1C1C1C] mb-2.5">Useful Links</h5>
            <ul className="space-y-1.5">
              <li><button onClick={() => navigate('/about')} className="hover:text-[#0C831F] cursor-pointer">About Us</button></li>
              <li><button onClick={() => navigate('/support')} className="hover:text-[#0C831F] cursor-pointer">Customer Support 24x7</button></li>
              <li><button onClick={() => navigate('/faq')} className="hover:text-[#0C831F] cursor-pointer">FAQs &amp; Help</button></li>
              <li><button onClick={() => navigate('/offers')} className="hover:text-[#0C831F] cursor-pointer">Coupons &amp; Deals</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[#1C1C1C] mb-2.5">Categories</h5>
            <ul className="space-y-1.5">
              <li><button onClick={() => navigate('/category/vegetables-fruits')} className="hover:text-[#0C831F] cursor-pointer">Vegetables &amp; Fruits</button></li>
              <li><button onClick={() => navigate('/category/dairy-bread-eggs')} className="hover:text-[#0C831F] cursor-pointer">Dairy &amp; Breakfast</button></li>
              <li><button onClick={() => navigate('/category/munchies')} className="hover:text-[#0C831F] cursor-pointer">Munchies</button></li>
              <li><button onClick={() => navigate('/category/cold-drinks-juices')} className="hover:text-[#0C831F] cursor-pointer">Cold Drinks</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[#1C1C1C] mb-2.5">Customer Account</h5>
            <ul className="space-y-1.5">
              <li><button onClick={() => navigate('/profile')} className="hover:text-[#0C831F] cursor-pointer">My Profile</button></li>
              <li><button onClick={() => navigate('/orders')} className="hover:text-[#0C831F] cursor-pointer">Order History</button></li>
              <li><button onClick={() => navigate('/addresses')} className="hover:text-[#0C831F] cursor-pointer">Saved Addresses</button></li>
              <li><button onClick={() => navigate('/wishlist')} className="hover:text-[#0C831F] cursor-pointer">My Wishlist</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[#1C1C1C] mb-2.5">10 Minute Cities</h5>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Delhi NCR, Gurugram, Noida, Bengaluru, Mumbai, Hyderabad, Kolkata, Pune, Chennai, Jaipur, Chandigarh, Lucknow.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>&copy; {new Date().getFullYear()} Blinkit Clone Frontend App. Crafted with high utility quick-commerce precision.</span>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
