import React from 'react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    billSummary,
    tipAmount,
    setTipAmount,
    appliedCoupon,
    removeCoupon,
    setIsApplyCouponModalOpen,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    setIsLocationModalOpen,
    selectedAddress,
    navigate
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToPay = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-[420px] bg-[#F4F6FB] flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="bg-white px-4 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[16px] text-[#1C1C1C]">My Cart</span>
              <span className="text-[13px] font-semibold text-slate-500">
                ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-[#F8CB46]/20 flex items-center justify-center text-[#0C831F] mb-4">
                <span className="material-symbols-outlined text-[48px]">shopping_bag</span>
              </div>
              <h3 className="font-bold text-[18px] text-[#1C1C1C] mb-1">Your cart is empty</h3>
              <p className="text-[13px] text-slate-500 mb-6 max-w-[240px]">
                Add fresh fruits, veggies, milk, snacks, and essentials to start shopping!
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/');
                }}
                className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[14px] px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Delivery ETA & Free Delivery Progress Banner */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 text-[#0C831F] font-bold text-[13px] mb-1">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Delivery in 10 minutes</span>
                </div>
                {billSummary.itemTotal >= 149 ? (
                  <p className="text-[12px] text-[#0C831F] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    You saved ₹25 on delivery fee!
                  </p>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <span>Add ₹{149 - billSummary.itemTotal} more for FREE delivery</span>
                      <span className="font-bold">₹{billSummary.itemTotal}/149</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#0C831F] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (billSummary.itemTotal / 149) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-semibold text-[#1C1C1C] truncate leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.selectedWeight || item.product.packWeight}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[13px] font-bold text-[#1C1C1C] tabular-nums">
                          ₹{item.product.price * item.quantity}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-[11px] text-slate-400 line-through tabular-nums">
                            ₹{item.product.mrp * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="w-[72px] h-[30px] rounded-lg bg-[#0C831F] text-white flex items-center justify-between px-1.5 font-bold text-[12px] shrink-0 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-5 h-full flex items-center justify-center hover:scale-120 transition-transform cursor-pointer"
                        title="Decrease"
                      >
                        −
                      </button>
                      <span className="tabular-nums font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-5 h-full flex items-center justify-center hover:scale-120 transition-transform cursor-pointer"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Trigger Box */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#0C831F]">check_circle</span>
                      <div>
                        <span className="text-[13px] font-bold text-[#0C831F]">{appliedCoupon.code} applied!</span>
                        <p className="text-[11px] text-slate-500">You saved ₹{billSummary.discount}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#E23744] text-[12px] font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsApplyCouponModalOpen(true)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F8CB46]/20 flex items-center justify-center text-[#936F00]">
                        <span className="material-symbols-outlined text-[18px]">sell</span>
                      </div>
                      <div>
                        <span className="text-[13px] font-bold text-[#1C1C1C] group-hover:text-[#0C831F] transition-colors">
                          Avail Offers and Coupons
                        </span>
                        <p className="text-[11px] text-slate-500">Apply BLINKIT50 for flat 50% discount</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-700 text-[18px]">
                      chevron_right
                    </span>
                  </button>
                )}
              </div>

              {/* Delivery Partner Tip Selection */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#F8CB46] text-[18px]">volunteer_activism</span>
                    <span className="text-[13px] font-bold text-[#1C1C1C]">Delivery Partner Tip</span>
                  </div>
                  <span className="text-[11px] text-slate-400">100% goes to partner</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 20, 30].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount)}
                      className={`py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer border ${
                        tipAmount === amount
                          ? 'bg-[#0C831F]/10 border-[#0C831F] text-[#0C831F]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {amount === 0 ? 'No tip' : `₹${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details Breakdown Card */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
                <span className="text-[13px] font-bold text-[#1C1C1C] block">Bill Details</span>
                
                <div className="flex justify-between text-[13px] text-slate-600">
                  <span>Items total</span>
                  <span className="tabular-nums font-medium text-slate-800">₹{billSummary.itemTotal}</span>
                </div>

                <div className="flex justify-between text-[13px] text-slate-600">
                  <span className="flex items-center gap-1">
                    Handling charge
                    <span className="text-[11px] bg-slate-100 text-slate-500 px-1 rounded">Fee</span>
                  </span>
                  <span className="tabular-nums font-medium text-slate-800">₹{billSummary.handlingFee}</span>
                </div>

                <div className="flex justify-between text-[13px] text-slate-600">
                  <span>Delivery fee</span>
                  {billSummary.deliveryFee === 0 ? (
                    <span className="text-[#0C831F] font-bold uppercase text-[12px]">FREE</span>
                  ) : (
                    <span className="tabular-nums font-medium text-slate-800">₹{billSummary.deliveryFee}</span>
                  )}
                </div>

                {billSummary.tip > 0 && (
                  <div className="flex justify-between text-[13px] text-slate-600">
                    <span>Delivery tip</span>
                    <span className="tabular-nums font-medium text-slate-800">₹{billSummary.tip}</span>
                  </div>
                )}

                {billSummary.discount > 0 && (
                  <div className="flex justify-between text-[13px] text-[#0C831F] font-semibold">
                    <span>Coupon discount</span>
                    <span className="tabular-nums">-₹{billSummary.discount}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[15px] font-extrabold text-[#1C1C1C]">
                  <span>Grand Total</span>
                  <span className="tabular-nums text-[#0C831F] text-[16px]">₹{billSummary.grandTotal}</span>
                </div>

                {billSummary.totalSavings > 0 && (
                  <div className="bg-[#0C831F]/10 text-[#0C831F] p-2 rounded-lg text-[12px] font-bold text-center">
                    🎉 You saved ₹{billSummary.totalSavings} on this order!
                  </div>
                )}
              </div>

              {/* Cancellation Policy Note */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                <span className="font-bold text-slate-700 block mb-0.5">Cancellation Policy</span>
                Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a full refund is immediately credited to your source payment mode.
              </div>
            </div>
          )}

          {/* Sticky Bottom Action Drawer Bar */}
          {cart.length > 0 && (
            <div className="bg-white p-4 border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] shrink-0">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-[12px] text-slate-600 truncate max-w-[240px]">
                  <span className="material-symbols-outlined text-[16px] text-[#0C831F]">location_on</span>
                  <span className="truncate font-medium">{selectedAddress.type}: {selectedAddress.houseNo}</span>
                </div>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-[#0C831F] text-[11px] font-bold hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <button
                onClick={handleProceedToPay}
                className="w-full bg-[#0C831F] hover:bg-[#0a6d1a] text-white py-3.5 px-4 rounded-xl font-bold text-[14px] flex items-center justify-between shadow-[0_4px_12px_rgba(12,131,31,0.25)] transition-all active:scale-98 cursor-pointer"
              >
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[15px] tabular-nums">₹{billSummary.grandTotal}</span>
                  <span className="text-[11px] opacity-90 font-normal">TOTAL BILL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Proceed to Pay</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
