import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';
import { LoginOtpModal } from './components/LoginOtpModal';
import { QuickProductModal } from './components/QuickProductModal';
import { AddEditAddressModal } from './components/AddEditAddressModal';
import { ApplyCouponModal } from './components/ApplyCouponModal';
import { CancelOrderModal } from './components/CancelOrderModal';
import { RateOrderModal } from './components/RateOrderModal';
import { MobileAppView } from './components/MobileAppView';
import { ReactNativeExporterModal } from './components/ReactNativeExporterModal';

import { StorefrontView } from './views/StorefrontView';
import { CategoryView } from './views/CategoryView';
import { SearchResultsView } from './views/SearchResultsView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { ProfileView } from './views/ProfileView';
import { OrdersHistoryView } from './views/OrdersHistoryView';
import { SavedAddressesView } from './views/SavedAddressesView';
import { WishlistView } from './views/WishlistView';
import { OffersCouponsView } from './views/OffersCouponsView';
import { SupportView } from './views/SupportView';
import { FAQView } from './views/FAQView';
import { AboutUsView } from './views/AboutUsView';

const AppContent: React.FC = () => {
  const {
    currentRoute,
    navigate,
    setIsCartDrawerOpen,
    setIsLocationModalOpen,
    setIsLoginModalOpen,
    setIsFilterDrawerOpen,
    setQuickViewProduct,
    setIsAddAddressModalOpen,
    setIsApplyCouponModalOpen,
    setCancelOrderModalOrderId,
    setRateOrderModalOrderId,
    orders
  } = useStore();

  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isScreenNavOpen, setIsScreenNavOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Determine which page view to render based on URL route
  const renderCurrentView = () => {
    if (currentRoute === '/' || currentRoute === '') {
      return <StorefrontView />;
    }
    if (currentRoute.startsWith('/category/')) {
      return <CategoryView />;
    }
    if (currentRoute.startsWith('/search')) {
      return <SearchResultsView />;
    }
    if (currentRoute.startsWith('/product/')) {
      return <ProductDetailView />;
    }
    if (currentRoute.startsWith('/checkout')) {
      return <CheckoutView />;
    }
    if (currentRoute.startsWith('/order-tracking')) {
      return <OrderTrackingView />;
    }
    if (currentRoute === '/profile') {
      return <ProfileView />;
    }
    if (currentRoute === '/orders') {
      return <OrdersHistoryView />;
    }
    if (currentRoute === '/addresses') {
      return <SavedAddressesView />;
    }
    if (currentRoute === '/wishlist') {
      return <WishlistView />;
    }
    if (currentRoute === '/offers') {
      return <OffersCouponsView />;
    }
    if (currentRoute === '/support') {
      return <SupportView />;
    }
    if (currentRoute === '/faq') {
      return <FAQView />;
    }
    if (currentRoute === '/about') {
      return <AboutUsView />;
    }

    return <StorefrontView />;
  };

  const allScreens = [
    { title: '1. Storefront Home', path: '/', isModal: false },
    { title: '2. Category Listing (Dairy, Bread & Eggs)', path: '/category/dairy-bread-eggs', isModal: false },
    { title: '3. Category Listing (Vegetables & Fruits)', path: '/category/vegetables-fruits', isModal: false },
    { title: '4. Category Listing (Munchies & Snacks)', path: '/category/munchies', isModal: false },
    { title: '5. Search Results ("Amul Milk")', path: '/search?q=amul+milk', isModal: false },
    { title: '6. Product Details (Amul Taaza Milk)', path: '/product/amul-taaza-milk-500', isModal: false },
    { title: '7. Cart Drawer (4 Items & Bill)', action: () => setIsCartDrawerOpen(true), isModal: true },
    { title: '8. Checkout & Payment', path: '/checkout', isModal: false },
    { title: '9. Live Order Tracking (10-min ETA)', path: '/order-tracking/ord-101', isModal: false },
    { title: '10. Login & OTP Modal', action: () => setIsLoginModalOpen(true), isModal: true },
    { title: '11. My Customer Profile', path: '/profile', isModal: false },
    { title: '12. My Orders History', path: '/orders', isModal: false },
    { title: '13. Saved Addresses', path: '/addresses', isModal: false },
    { title: '14. Wishlist & Saved Products', path: '/wishlist', isModal: false },
    { title: '15. Frequently Asked Questions (FAQ)', path: '/faq', isModal: false },
    { title: '16. 24x7 Customer Support & Chat', path: '/support', isModal: false },
    { title: '17. Offers & Coupons', path: '/offers', isModal: false },
    { title: '18. About Blinkit', path: '/about', isModal: false },
    { title: '19. Location Selection Modal', action: () => setIsLocationModalOpen(true), isModal: true },
    { title: '20. Filter & Sort Drawer', action: () => setIsFilterDrawerOpen(true), isModal: true },
    {
      title: '21. Quick Product View Modal',
      action: () => setQuickViewProduct({
        id: 'amul-taaza-milk-500',
        name: 'Amul Taaza Toned Fresh Milk',
        category: 'dairy-bread-eggs',
        subcategory: 'Milk',
        brand: 'Amul',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBroYrcwDQ7BlSDEWn8Yoikh-_m_j9lRsYq0R0HPZmbEXcTQN38wE3xoqxWON36qUCEZyz60j4XKNTb7PMBdZLVg4mb1P14kMsEE5CIKZKvKlhUDB8gjAngYMS0RsINWNspb1R-fXHAx8nl1J7DMNPqO7O0OiMyzP5F8qPvURIKHOQnPkAoKwT566CwABpDCCBfwZnXVsydCTg0cqd7Sybv_rzJZU-GyHw0kxDLiCPb',
        packWeight: '500 ml pouch',
        price: 28,
        mrp: 30,
        discount: '6% OFF',
        rating: 4.8,
        ratingCount: 14200,
        eta: '10 MINS',
        description: 'Pasteurised toned milk with 3.0% fat and 8.5% SNF. Excellent source of natural calcium and high-quality protein for daily vitality.',
        shelfLife: '2 days from packing',
        countryOfOrigin: 'India',
        manufacturer: 'Amul',
        inStock: true
      }),
      isModal: true
    },
    { title: '22. Add / Edit Address Modal', action: () => setIsAddAddressModalOpen(true), isModal: true },
    { title: '23. Apply Coupon Modal', action: () => setIsApplyCouponModalOpen(true), isModal: true },
    { title: '24. Cancel Order Confirmation Modal', action: () => setCancelOrderModalOrderId(orders[0]?.id || 'ord-101'), isModal: true },
    { title: '25. Rate Order Experience Modal', action: () => setRateOrderModalOrderId('ord-102'), isModal: true }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB] text-[#1C1C1C]">
      
      {/* Top Experience Switcher Bar */}
      <div className="bg-[#1C1C1C] text-white px-4 py-2 flex items-center justify-between text-[12px] z-50">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#F8CB46] hidden sm:inline">Blinkit App Experience:</span>
          
          <div className="flex items-center bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'desktop' ? 'bg-[#0C831F] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🖥️ Desktop Web</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'mobile' ? 'bg-[#0C831F] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📱 Mobile App View</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="bg-[#F8CB46] hover:bg-[#edd068] text-slate-900 px-3 py-1 rounded-lg font-black text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>⚡ React Native Code</span>
          </button>
        </div>
      </div>

      {viewMode === 'desktop' ? (
        <>
          {/* Primary Sticky Header */}
          <Header />

          {/* Main View Router */}
          <main className="flex-1 w-full">
            {renderCurrentView()}
          </main>
        </>
      ) : (
        /* Mobile App View with iPhone 16 Mockup Frame */
        <div className="flex-1 flex items-center justify-center py-6 sm:py-8 bg-slate-900/90 px-2 sm:px-4">
          <div className="w-full max-w-[390px] h-[844px] bg-black rounded-[52px] p-3 shadow-[0_24px_64px_rgba(0,0,0,0.6)] border-[4px] border-slate-700 relative overflow-hidden flex flex-col">
            
            {/* Screen Inner Viewport */}
            <div className="w-full h-full bg-[#F4F6FB] rounded-[42px] overflow-hidden flex flex-col relative">
              <MobileAppView />

              {/* Home Bar Indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/40 rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Overlays & Modals */}
      <CartDrawer />
      <LocationModal />
      <LoginOtpModal />
      <QuickProductModal />
      <AddEditAddressModal />
      <ApplyCouponModal />
      <CancelOrderModal />
      <RateOrderModal />
      <ReactNativeExporterModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />

      {/* Interactive Screen Navigator Floater for instant preview of all 25 screens */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isScreenNavOpen ? (
          <button
            onClick={() => setIsScreenNavOpen(true)}
            className="flex items-center gap-2 bg-[#1C1C1C] hover:bg-black text-[#F8CB46] px-4 py-2.5 rounded-full shadow-2xl border border-white/20 font-bold text-[12px] transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Jump to any screen or modal"
          >
            <span className="material-symbols-outlined text-[18px]">layers</span>
            <span>All 25+ Screens Navigator</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-[320px] sm:w-[360px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 bg-[#1C1C1C] text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#F8CB46] text-[18px]">grid_view</span>
                <span className="font-extrabold text-[13px]">Blinkit Screen Explorer</span>
              </div>
              <button
                onClick={() => setIsScreenNavOpen(false)}
                className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-2 overflow-y-auto divide-y divide-slate-100 max-h-[70vh]">
              {allScreens.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (s.action) {
                      s.action();
                    } else if (s.path) {
                      navigate(s.path);
                    }
                    setIsScreenNavOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-[12px] font-semibold text-slate-700 hover:text-[#0C831F] hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{s.title}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-[#0C831F]">
                    {s.isModal ? 'Modal' : 'Page'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
