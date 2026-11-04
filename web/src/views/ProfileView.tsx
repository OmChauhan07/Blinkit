import React from 'react';
import { useStore } from '../context/StoreContext';

export const ProfileView: React.FC = () => {
  const { user, orders, addresses, wishlistIds, navigate, logout, setIsLoginModalOpen } = useStore();

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-[500px] mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F8CB46]/20 flex items-center justify-center text-[#936F00] mx-auto mb-4">
          <span className="material-symbols-outlined text-[40px]">person</span>
        </div>
        <h2 className="text-[20px] font-extrabold text-[#1C1C1C]">You are not logged in</h2>
        <p className="text-[13px] text-slate-500 mt-1 mb-6">Log in to view your orders, addresses, and wishlist.</p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[14px] px-8 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          Login with Phone
        </button>
      </div>
    );
  }

  const menuItems = [
    { label: 'My Orders & History', icon: 'receipt_long', desc: `${orders.length} orders placed`, path: '/orders', color: 'text-blue-600' },
    { label: 'Saved Addresses', icon: 'location_on', desc: `${addresses.length} delivery locations`, path: '/addresses', color: 'text-[#0C831F]' },
    { label: 'My Wishlist', icon: 'favorite', desc: `${wishlistIds.length} saved products`, path: '/wishlist', color: 'text-[#E23744]' },
    { label: 'Coupons & Offers', icon: 'sell', desc: 'Discounts up to 50% OFF', path: '/offers', color: 'text-[#F8CB46]' },
    { label: '24x7 Customer Support', icon: 'support_agent', desc: 'Instant chat for order issues', path: '/support', color: 'text-purple-600' },
    { label: 'Frequently Asked Questions', icon: 'help_outline', desc: 'Delivery, cancellation & refund queries', path: '/faq', color: 'text-slate-600' },
    { label: 'About Blinkit', icon: 'info', desc: '10-minute quick-commerce journey', path: '/about', color: 'text-emerald-700' }
  ];

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-[#F8CB46] text-[#1C1C1C] flex items-center justify-center font-black text-[24px] shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[20px] font-black text-[#1C1C1C]">{user.name}</h1>
            <p className="text-[13px] font-semibold text-slate-600">+91 {user.phone}</p>
            <p className="text-[12px] text-slate-400">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 text-[13px] font-bold text-[#E23744] hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div
          onClick={() => navigate('/orders')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0C831F]/40 cursor-pointer transition-all text-center"
        >
          <span className="text-[22px] font-black text-[#0C831F] block">{orders.length}</span>
          <span className="text-[12px] font-bold text-slate-600">Past Orders</span>
        </div>
        <div
          onClick={() => navigate('/addresses')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0C831F]/40 cursor-pointer transition-all text-center"
        >
          <span className="text-[22px] font-black text-[#1C1C1C] block">{addresses.length}</span>
          <span className="text-[12px] font-bold text-slate-600">Saved Addresses</span>
        </div>
        <div
          onClick={() => navigate('/wishlist')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0C831F]/40 cursor-pointer transition-all text-center"
        >
          <span className="text-[22px] font-black text-[#E23744] block">{wishlistIds.length}</span>
          <span className="text-[12px] font-bold text-slate-600">Wishlist Items</span>
        </div>
      </div>

      {/* Navigation Options Menu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <span className={`material-symbols-outlined text-[24px] ${item.color}`}>
                {item.icon}
              </span>
              <div>
                <span className="text-[14px] font-bold text-[#1C1C1C] group-hover:text-[#0C831F] transition-colors">
                  {item.label}
                </span>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-700 text-[20px]">
              chevron_right
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
