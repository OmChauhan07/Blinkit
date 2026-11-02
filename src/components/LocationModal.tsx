import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const CITIES = [
  { name: 'Gurugram', state: 'Haryana', active: true },
  { name: 'New Delhi', state: 'Delhi NCR', active: true },
  { name: 'Noida', state: 'Uttar Pradesh', active: true },
  { name: 'Bengaluru', state: 'Karnataka', active: true },
  { name: 'Mumbai', state: 'Maharashtra', active: true },
  { name: 'Hyderabad', state: 'Telangana', active: true },
  { name: 'Kolkata', state: 'West Bengal', active: true }
];

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    addresses,
    selectedAddress,
    setSelectedAddress,
    setIsAddAddressModalOpen
  } = useStore();

  const [searchLocation, setSearchLocation] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleDetectLocation = () => {
    setDetectingGps(true);
    setTimeout(() => {
      setDetectingGps(false);
      // Auto-select Home or first address
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
      setIsLocationModalOpen(false);
    }, 1000);
  };

  const handleSelectCity = (city: typeof CITIES[0]) => {
    const matchedAddr = addresses.find((a) => a.city.toLowerCase().includes(city.name.toLowerCase()));
    if (matchedAddr) {
      setSelectedAddress(matchedAddr);
    } else {
      setSelectedAddress({
        id: `city-${Date.now()}`,
        type: 'Home',
        name: 'Omkar Chauhan',
        phone: '+91 98765 43210',
        houseNo: 'Sector 29, Central Market',
        apartmentRoad: 'City Center Road',
        landmark: 'Near Metro Station',
        city: `${city.name}, ${city.state}`,
        pincode: '110001',
        isDefault: false
      });
    }
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsLocationModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0C831F] text-[22px]">location_on</span>
            <h3 className="font-extrabold text-[16px] text-[#1C1C1C]">Select Delivery Location</h3>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search & GPS Action */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search area, apartment, street or city..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#F4F6FB] rounded-xl text-[13px] border border-transparent focus:border-[#0C831F] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={detectingGps}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F]/5 font-bold text-[13px] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#0C831F]">
              {detectingGps ? 'refresh' : 'my_location'}
            </span>
            <span>{detectingGps ? 'Detecting current GPS location...' : 'Use current location'}</span>
          </button>

          {/* Saved Addresses List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                Saved Delivery Addresses
              </span>
              <button
                onClick={() => {
                  setIsLocationModalOpen(false);
                  setIsAddAddressModalOpen(true);
                }}
                className="text-[#0C831F] text-[12px] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>+ Add New</span>
              </button>
            </div>

            <div className="space-y-2">
              {addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsLocationModalOpen(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#0C831F] bg-[#0C831F]/5 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className={`material-symbols-outlined mt-0.5 text-[20px] ${
                      isSelected ? 'text-[#0C831F]' : 'text-slate-400'
                    }`}>
                      {addr.type === 'Home' ? 'home' : addr.type === 'Work' ? 'apartment' : 'pin_drop'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[#1C1C1C]">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-[#F8CB46]/30 text-[#6e5600] px-1.5 py-0.2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-600 truncate mt-0.5">
                        {addr.houseNo}, {addr.apartmentRoad}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {addr.city} - {addr.pincode}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[#0C831F] text-[20px]">
                        check_circle
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Cities Grid */}
          <div>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Deliver In 10 Mins To Major Cities
            </span>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSelectCity(c)}
                  className="px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#F4F6FB] hover:bg-[#0C831F]/10 hover:text-[#0C831F] text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
