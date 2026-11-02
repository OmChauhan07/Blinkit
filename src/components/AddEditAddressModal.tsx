import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const AddEditAddressModal: React.FC = () => {
  const { isAddAddressModalOpen, setIsAddAddressModalOpen, addAddress } = useStore();

  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [houseNo, setHouseNo] = useState('');
  const [apartmentRoad, setApartmentRoad] = useState('');
  const [landmark, setLandmark] = useState('');
  const [name, setName] = useState('Omkar Chauhan');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [city, setCity] = useState('Gurugram, Haryana');
  const [pincode, setPincode] = useState('122018');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAddAddressModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseNo.trim() || !apartmentRoad.trim()) {
      setErrorMsg('Please fill in Flat/House number and Area details');
      return;
    }
    addAddress({
      type,
      name,
      phone,
      houseNo,
      apartmentRoad,
      landmark,
      city,
      pincode,
      isDefault: false
    });
    setIsAddAddressModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAddAddressModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0C831F]">add_location</span>
            <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Add Delivery Address</h3>
          </div>
          <button
            onClick={() => setIsAddAddressModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Address Tag Selector */}
          <div>
            <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Save Address As
            </label>
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setType(tag)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    type === tag
                      ? 'bg-[#0C831F]/10 border-[#0C831F] text-[#0C831F]'
                      : 'bg-[#F4F6FB] border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {tag === 'Home' ? 'home' : tag === 'Work' ? 'apartment' : 'pin_drop'}
                  </span>
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Flat / House / Floor / Building <span className="text-[#E23744]">*</span>
            </label>
            <input
              type="text"
              required
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="e.g. Flat 304, Tower 2, DLF Phase 5"
              className="w-full px-3.5 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Area / Sector / Locality <span className="text-[#E23744]">*</span>
            </label>
            <input
              type="text"
              required
              value={apartmentRoad}
              onChange={(e) => setApartmentRoad(e.target.value)}
              placeholder="e.g. Golf Course Extension Road"
              className="w-full px-3.5 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near HDFC Bank"
                className="w-full px-3.5 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="122018"
                className="w-full px-3.5 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Receiver Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Receiver Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && <p className="text-[12px] text-[#E23744] font-medium">{errorMsg}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[14px] py-3 rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
            >
              Save Address &amp; Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
