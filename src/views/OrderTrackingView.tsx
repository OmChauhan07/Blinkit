import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export const OrderTrackingView: React.FC = () => {
  const { currentRoute, navigate, getOrderById, setCancelOrderModalOrderId, setRateOrderModalOrderId } = useStore();

  const orderId = currentRoute.replace('/order-tracking/', '').split('/')[0] || 'ord-101';
  const order = getOrderById(orderId) || getOrderById('ord-101');

  const [etaSeconds, setEtaSeconds] = useState(8 * 60 + 24);

  // Live countdown timer
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;
    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-[64px] text-slate-300 mb-3">error</span>
        <h2 className="text-[20px] font-extrabold text-[#1C1C1C]">Order Not Found</h2>
        <p className="text-[13px] text-slate-500 mt-1 mb-6">Could not locate tracking details for this order.</p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-[#0C831F] text-white font-bold text-[14px] px-6 py-2.5 rounded-xl"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;

  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';

  return (
    <div className="max-w-[880px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-[13px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to All Orders</span>
        </button>

        <span className="text-[12px] font-bold text-slate-400">
          Order #{order.orderNumber}
        </span>
      </div>

      {/* Main ETA Hero Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg ${
        isCancelled
          ? 'bg-gradient-to-r from-red-600 to-red-800'
          : isDelivered
          ? 'bg-gradient-to-r from-[#0C831F] to-[#00530E]'
          : 'bg-gradient-to-r from-[#0C831F] via-[#006e16] to-[#00530e]'
      }`}>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[16px]">
              {isCancelled ? 'cancel' : isDelivered ? 'verified' : 'electric_moped'}
            </span>
            <span>
              {isCancelled ? 'Order Cancelled' : isDelivered ? 'Delivered' : 'Live Order Tracking'}
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[36px] font-black tracking-tight leading-tight">
            {isCancelled ? (
              'This order has been cancelled'
            ) : isDelivered ? (
              'Order Delivered Successfully!'
            ) : (
              <span>Arriving in {minutes} mins {seconds}s</span>
            )}
          </h1>

          <p className="text-[13px] sm:text-[14px] text-white/90 font-medium max-w-lg">
            {isCancelled
              ? `Refund of ₹${order.grandTotal} has been credited back to your original payment mode.`
              : isDelivered
              ? 'Enjoy your fresh groceries! Let us know how your delivery experience was.'
              : `Your delivery partner ${order.driverName || 'Ramesh'} is on the way from your local dark store.`}
          </p>
        </div>

        {/* Decorative Map / Delivery Graphic */}
        <div className="absolute right-4 -bottom-6 opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-[160px]">
            {isCancelled ? 'block' : 'two_wheeler'}
          </span>
        </div>
      </div>

      {/* Delivery Status Stepper Card */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
          <h3 className="font-extrabold text-[15px] text-[#1C1C1C] mb-6">
            Delivery Timeline
          </h3>

          <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
            {[
              {
                title: 'Order Placed',
                time: '11:42 AM',
                desc: 'Payment confirmed & inventory locked',
                done: true
              },
              {
                title: 'Packed at Dark Store',
                time: '11:44 AM',
                desc: 'Hygiene & freshness quality checked',
                done: order.status === 'packing' || order.status === 'on_the_way' || isDelivered
              },
              {
                title: 'Out for Delivery',
                time: '11:46 AM',
                desc: 'Delivery partner on electric vehicle',
                done: order.status === 'on_the_way' || isDelivered
              },
              {
                title: 'Delivered',
                time: isDelivered ? '11:51 AM' : 'ETA ~9 mins',
                desc: 'At your doorstep safely',
                done: isDelivered
              }
            ].map((step, idx) => (
              <div key={step.title} className="flex-1 flex items-start md:flex-col md:items-center text-left md:text-center gap-3 md:gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${
                  step.done
                    ? 'bg-[#0C831F] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {step.done ? 'check' : 'schedule'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-[#1C1C1C] leading-snug">{step.title}</h4>
                  <span className="text-[11px] font-bold text-[#0C831F] block mt-0.5">{step.time}</span>
                  <p className="text-[11px] text-slate-500 max-w-[160px] md:mx-auto mt-0.5 leading-tight">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Partner Card */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#0C831F]/10 text-[#0C831F] flex items-center justify-center font-black text-[18px]">
              {order.driverName?.charAt(0) || 'R'}
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Your Delivery Partner
              </span>
              <h4 className="text-[15px] font-extrabold text-[#1C1C1C]">{order.driverName || 'Ramesh Kumar'}</h4>
              <p className="text-[12px] text-slate-500">Vaccinated • 4.9 ★ Rating (2,400+ deliveries)</p>
            </div>
          </div>

          <a
            href={`tel:${order.driverPhone || '+919811234567'}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0C831F] hover:bg-[#0a6d1a] text-white rounded-xl font-bold text-[13px] shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span className="hidden sm:inline">Call Partner</span>
          </a>
        </div>
      )}

      {/* Order Items & Receipt Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-[15px] text-[#1C1C1C]">
            Order Items ({order.items.length})
          </h3>
          <span className="text-[12px] text-slate-500 font-medium">
            Paid via {order.paymentMethod}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3 text-[13px]">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1"
                />
                <div>
                  <h4 className="font-bold text-[#1C1C1C] leading-snug">{item.product.name}</h4>
                  <span className="text-[11px] text-slate-400">
                    {item.selectedWeight || item.product.packWeight} • Qty: {item.quantity}
                  </span>
                </div>
              </div>
              <span className="font-bold text-[#1C1C1C] tabular-nums">
                ₹{item.product.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Bill Total Summary */}
        <div className="border-t border-slate-100 pt-3 space-y-1.5 text-[12px] text-slate-600">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="tabular-nums font-semibold text-slate-800">₹{order.itemTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Handling &amp; Delivery Fee</span>
            <span className="tabular-nums font-semibold text-slate-800">₹{order.handlingFee + order.deliveryFee}</span>
          </div>
          {order.tip > 0 && (
            <div className="flex justify-between">
              <span>Delivery Partner Tip</span>
              <span className="tabular-nums font-semibold text-slate-800">₹{order.tip}</span>
            </div>
          )}
          {order.discount > 0 && (
            <div className="flex justify-between text-[#0C831F] font-semibold">
              <span>Discount</span>
              <span className="tabular-nums">-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-[15px] font-black text-[#1C1C1C] pt-2 border-t border-slate-100">
            <span>Total Paid</span>
            <span className="tabular-nums text-[#0C831F]">₹{order.grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Cancel, Rate, Support */}
      <div className="flex flex-wrap gap-3">
        {(!isCancelled && !isDelivered) && (
          <button
            onClick={() => setCancelOrderModalOrderId(order.id)}
            className="flex-1 py-3 px-4 rounded-xl border border-red-200 text-[#E23744] hover:bg-red-50 font-bold text-[13px] transition-colors cursor-pointer text-center"
          >
            Cancel Order
          </button>
        )}

        {isDelivered && (
          <button
            onClick={() => setRateOrderModalOrderId(order.id)}
            className="flex-1 py-3 px-4 rounded-xl border border-[#F8CB46] bg-[#F8CB46]/20 text-[#6e5600] hover:bg-[#F8CB46]/30 font-bold text-[13px] transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span>{order.rating ? `Rated ${order.rating} Stars` : 'Rate Order Experience'}</span>
          </button>
        )}

        <button
          onClick={() => navigate('/support')}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[13px] transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">support_agent</span>
          <span>Need Help with Order</span>
        </button>
      </div>
    </div>
  );
};
