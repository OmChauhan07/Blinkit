import React from 'react';
import { useStore } from '../context/StoreContext';

export const SavedAddressesView: React.FC = () => {
  const { addresses, selectedAddress, setSelectedAddress, deleteAddress, setIsAddAddressModalOpen, navigate } = useStore();

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1C1C1C]">Saved Addresses</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Manage your delivery locations for 10-minute doorstep drops</p>
        </div>

        <button
          onClick={() => setIsAddAddressModalOpen(true)}
          className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[13px] px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const isSelected = selectedAddress.id === addr.id;
          return (
            <div
              key={addr.id}
              className={`bg-white rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                isSelected ? 'border-[#0C831F] shadow-sm ring-1 ring-[#0C831F]' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0C831F] text-[20px]">
                      {addr.type === 'Home' ? 'home' : addr.type === 'Work' ? 'apartment' : 'pin_drop'}
                    </span>
                    <span className="font-extrabold text-[15px] text-[#1C1C1C]">{addr.type}</span>
                  </div>

                  {isSelected && (
                    <span className="text-[11px] font-bold text-[#0C831F] bg-[#0C831F]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      Default
                    </span>
                  )}
                </div>

                <p className="text-[13px] text-slate-700 font-semibold leading-snug">
                  {addr.houseNo}, {addr.apartmentRoad}
                </p>
                {addr.landmark && (
                  <p className="text-[12px] text-slate-500 mt-0.5">Landmark: {addr.landmark}</p>
                )}
                <p className="text-[12px] text-slate-500">
                  {addr.city} - {addr.pincode}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Contact: {addr.name} ({addr.phone})
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {!isSelected ? (
                  <button
                    onClick={() => setSelectedAddress(addr)}
                    className="text-[#0C831F] text-[12px] font-bold hover:underline cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-[#0C831F] font-semibold">Active Selection</span>
                )}

                <div className="flex items-center gap-3">
                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-[#E23744] text-[12px] font-bold hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
