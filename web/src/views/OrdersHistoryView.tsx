import React from 'react';
import { useStore } from '../context/StoreContext';

export const OrdersHistoryView: React.FC = () => {
  const { orders, navigate, addToCart, setIsCartDrawerOpen, setRateOrderModalOrderId } = useStore();

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.selectedWeight);
    });
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1C1C1C]">Your Orders</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Track active deliveries and reorder your grocery favorites</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-[#0C831F] text-[13px] font-bold hover:underline cursor-pointer"
        >
          Browse Products
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">receipt_long</span>
          <h3 className="text-[16px] font-bold text-slate-700">No orders yet</h3>
          <p className="text-[12px] text-slate-400 mt-1 mb-4">Start shopping to get groceries delivered in 10 minutes!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#0C831F] text-white px-5 py-2 rounded-xl text-[13px] font-bold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isActive = order.status === 'placed' || order.status === 'packing' || order.status === 'on_the_way';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 bg-[#F4F6FB] border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[14px] text-[#1C1C1C]">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[12px] text-slate-400">• {order.date}</span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCancelled ? (
                      <span className="bg-red-50 text-[#E23744] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Cancelled
                      </span>
                    ) : isActive ? (
                      <span className="bg-[#0C831F]/15 text-[#0C831F] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        Arriving in {order.etaMinutes} mins
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#0C831F]">check_circle</span>
                        Delivered
                      </span>
                    )}
                  </div>
                </div>

                {/* Items List Preview */}
                <div className="p-4 divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-[13px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-contain rounded bg-slate-50 p-1 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {item.selectedWeight || item.product.packWeight} • Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#1C1C1C] tabular-nums shrink-0">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Actions */}
                <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wide block">Total Paid</span>
                    <span className="text-[16px] font-extrabold text-[#0C831F] tabular-nums">
                      ₹{order.grandTotal}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                        className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white text-[12px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">electric_moped</span>
                        <span>Track Live Delivery</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setRateOrderModalOrderId(order.id)}
                          className="border border-slate-200 text-slate-700 hover:bg-slate-50 text-[12px] font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#F8CB46]">star</span>
                          <span>{order.rating ? `${order.rating}★ Rated` : 'Rate'}</span>
                        </button>

                        <button
                          onClick={() => handleReorder(order)}
                          className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white text-[12px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          <span>Reorder All</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
