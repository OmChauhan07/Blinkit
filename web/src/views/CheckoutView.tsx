import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const PAYMENT_METHODS = [
  { id: 'upi_gpay', name: 'Google Pay UPI', icon: 'account_balance_wallet', tag: 'Fastest' },
  { id: 'upi_phonepe', name: 'PhonePe UPI', icon: 'account_balance_wallet', tag: '' },
  { id: 'upi_paytm', name: 'Paytm UPI', icon: 'account_balance_wallet', tag: '' },
  { id: 'card_hdfc', name: 'HDFC Bank Credit Card (•• 4012)', icon: 'credit_card', tag: 'Saved' },
  { id: 'card_new', name: 'Add New Credit / Debit Card', icon: 'add_card', tag: '' },
  { id: 'netbanking', name: 'NetBanking (50+ Banks)', icon: 'account_balance', tag: '' },
  { id: 'cod', name: 'Cash on Delivery (Pay upon delivery)', icon: 'payments', tag: 'Zero Fee' }
];

export const CheckoutView: React.FC = () => {
  const {
    cart,
    billSummary,
    selectedAddress,
    setIsLocationModalOpen,
    setIsApplyCouponModalOpen,
    appliedCoupon,
    removeCoupon,
    placeOrder,
    navigate
  } = useStore();

  const [selectedPayment, setSelectedPayment] = useState('upi_gpay');
  const [deliveryInstruction, setDeliveryInstruction] = useState<'door' | 'bell' | 'call' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-[64px] text-slate-300 mb-3">shopping_cart</span>
        <h2 className="text-[20px] font-extrabold text-[#1C1C1C]">Your cart is empty</h2>
        <p className="text-[13px] text-slate-500 mt-1 mb-6">Add items to proceed to checkout.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[14px] px-6 py-2.5 rounded-xl shadow-sm transition-all"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const chosenMethod = PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.name || 'UPI';
      const orderId = placeOrder(chosenMethod);
      setIsProcessing(false);
      navigate(`/order-tracking/${orderId}`);
    }, 1200);
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Checkout Breadcrumb Header */}
      <div className="flex items-center gap-2 text-[12px] text-slate-500 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-slate-800 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="font-semibold text-[#1C1C1C]">Secure Checkout &amp; Payment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0C831F] text-white flex items-center justify-center text-[12px] font-bold">
                  1
                </span>
                <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Delivery Address</h3>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="text-[#0C831F] text-[12px] font-bold hover:underline cursor-pointer"
              >
                Change Address
              </button>
            </div>

            <div className="bg-[#F4F6FB] p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0C831F] text-[22px] mt-0.5">
                {selectedAddress.type === 'Home' ? 'home' : selectedAddress.type === 'Work' ? 'apartment' : 'pin_drop'}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-[#1C1C1C]">{selectedAddress.type}</span>
                  <span className="text-[11px] font-bold text-[#0C831F] bg-[#0C831F]/10 px-2 py-0.2 rounded">
                    ⚡ 10 Mins Delivery
                  </span>
                </div>
                <p className="text-[13px] text-slate-700 font-medium mt-1">
                  {selectedAddress.houseNo}, {selectedAddress.apartmentRoad}
                </p>
                <p className="text-[12px] text-slate-500">
                  {selectedAddress.city} - {selectedAddress.pincode}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Contact: {selectedAddress.name} ({selectedAddress.phone})
                </p>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[12px] font-bold text-slate-500 block mb-2">Delivery Instructions:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'door', label: 'Leave at door', icon: 'meeting_room' },
                  { id: 'bell', label: 'Avoid ringing bell', icon: 'notifications_off' },
                  { id: 'call', label: 'Do not call', icon: 'phone_disabled' }
                ].map((ins) => (
                  <button
                    key={ins.id}
                    onClick={() => setDeliveryInstruction((prev) => (prev === ins.id ? null : (ins.id as any)))}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      deliveryInstruction === ins.id
                        ? 'border-[#0C831F] bg-[#0C831F]/10 text-[#0C831F] font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[11px]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{ins.icon}</span>
                    <span className="text-[11px] leading-tight">{ins.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Payment Options */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#0C831F] text-white flex items-center justify-center text-[12px] font-bold">
                2
              </span>
              <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Select Payment Method</h3>
            </div>

            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0C831F] bg-[#0C831F]/5 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#0C831F] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">{method.icon}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[13px] text-[#1C1C1C] block leading-tight">
                          {method.name}
                        </span>
                        {method.tag && (
                          <span className="text-[10px] font-bold text-[#0C831F] bg-[#0C831F]/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            {method.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="payment_method"
                      checked={isSelected}
                      onChange={() => setSelectedPayment(method.id)}
                      className="accent-[#0C831F] w-4 h-4 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Order Summary & Pay CTA */}
        <div className="lg:col-span-5 space-y-5 sticky top-28">
          
          {/* Items Preview */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-[14px] text-[#1C1C1C]">
                Cart Items ({cart.length})
              </span>
              <span className="text-[12px] font-bold text-[#0C831F]">
                ⚡ 10 mins
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-[12px]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 object-contain rounded bg-slate-50 p-0.5 shrink-0"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 truncate block">{item.product.name}</span>
                      <span className="text-slate-400 text-[11px]">{item.quantity} × ₹{item.product.price}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Trigger in Checkout */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs">
            {appliedCoupon ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0C831F] text-[20px]">check_circle</span>
                  <div>
                    <span className="text-[13px] font-bold text-[#0C831F]">{appliedCoupon.code} Applied</span>
                    <p className="text-[11px] text-slate-500">Saved ₹{billSummary.discount}</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-[#E23744] text-[12px] font-bold hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsApplyCouponModalOpen(true)}
                className="w-full flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#936F00]">sell</span>
                  <span className="text-[13px] font-bold text-slate-800 group-hover:text-[#0C831F] transition-colors">
                    Apply Coupon Code
                  </span>
                </div>
                <span className="text-[#0C831F] text-[12px] font-bold">Select Offer</span>
              </button>
            )}
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2.5">
            <span className="text-[14px] font-bold text-[#1C1C1C] block">Payment Summary</span>
            
            <div className="flex justify-between text-[13px] text-slate-600">
              <span>Item Total</span>
              <span className="tabular-nums font-medium text-slate-800">₹{billSummary.itemTotal}</span>
            </div>

            <div className="flex justify-between text-[13px] text-slate-600">
              <span>Handling Fee</span>
              <span className="tabular-nums font-medium text-slate-800">₹{billSummary.handlingFee}</span>
            </div>

            <div className="flex justify-between text-[13px] text-slate-600">
              <span>Delivery Fee</span>
              {billSummary.deliveryFee === 0 ? (
                <span className="text-[#0C831F] font-bold uppercase text-[12px]">FREE</span>
              ) : (
                <span className="tabular-nums font-medium text-slate-800">₹{billSummary.deliveryFee}</span>
              )}
            </div>

            {billSummary.tip > 0 && (
              <div className="flex justify-between text-[13px] text-slate-600">
                <span>Delivery Partner Tip</span>
                <span className="tabular-nums font-medium text-slate-800">₹{billSummary.tip}</span>
              </div>
            )}

            {billSummary.discount > 0 && (
              <div className="flex justify-between text-[13px] text-[#0C831F] font-semibold">
                <span>Coupon Savings</span>
                <span className="tabular-nums">-₹{billSummary.discount}</span>
              </div>
            )}

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[16px] font-black text-[#1C1C1C]">
              <span>To Pay</span>
              <span className="tabular-nums text-[#0C831F] text-[18px]">₹{billSummary.grandTotal}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-[#0C831F] hover:bg-[#0a6d1a] disabled:opacity-75 text-white py-4 px-6 rounded-2xl font-black text-[15px] flex items-center justify-between shadow-[0_4px_16px_rgba(12,131,31,0.3)] transition-all cursor-pointer active:scale-98"
          >
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[17px] tabular-nums">₹{billSummary.grandTotal}</span>
              <span className="text-[11px] font-normal opacity-90">PLACE ORDER</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{isProcessing ? 'Confirming Order...' : 'Pay & Deliver'}</span>
              <span className="material-symbols-outlined text-[20px]">
                {isProcessing ? 'hourglass_top' : 'arrow_forward'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
