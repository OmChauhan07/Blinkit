import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export const LoginOtpModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithPhone, verifyOtp } = useStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [countdown, setCountdown] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isLoginModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    loginWithPhone(phoneNumber);
    setStep('otp');
    setCountdown(30);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      setErrorMsg('Please enter all 4 digits of the OTP');
      return;
    }
    verifyOtp(fullOtp);
  };

  const handleAutoFillOtp = () => {
    setOtp(['1', '2', '3', '4']);
    setErrorMsg('');
    verifyOtp('1234');
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setStep('phone');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Banner Graphic */}
        <div className="bg-gradient-to-r from-[#F8CB46] to-[#FFE08F] p-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-full text-slate-800/60 hover:text-slate-900 hover:bg-black/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md mx-auto flex items-center justify-center mb-3">
            <span className="text-[24px] font-black tracking-tighter text-[#0C831F]">
              blink<span className="text-[#F8CB46]">it</span>
            </span>
          </div>

          <h3 className="font-extrabold text-[18px] text-[#1C1C1C]">
            India&#39;s Last Minute App
          </h3>
          <p className="text-[12px] text-slate-700 font-medium mt-0.5">
            Log in or sign up to access your cart, orders & addresses
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-[#0C831F] focus-within:shadow-[0_0_0_2px_rgba(12,131,31,0.1)] transition-all bg-[#F4F6FB] focus-within:bg-white overflow-hidden px-3 h-[46px]">
                  <span className="text-[14px] font-bold text-slate-700 border-r border-slate-200 pr-2.5 mr-2.5 flex items-center gap-1">
                    <span>🇮🇳</span> +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-transparent text-[14px] font-semibold text-[#1C1C1C] focus:outline-none"
                    autoFocus
                  />
                </div>
                {errorMsg && <p className="text-[11px] text-[#E23744] font-medium mt-1">{errorMsg}</p>}
              </div>

              {/* Demo Helper Button */}
              <button
                type="button"
                onClick={() => setPhoneNumber('9876543210')}
                className="w-full text-center text-[12px] text-[#0C831F] font-semibold hover:underline cursor-pointer py-1"
              >
                Use Demo Mobile: 9876543210
              </button>

              <button
                type="submit"
                className="w-full bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[14px] py-3 rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
              >
                Continue
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-tight">
                By continuing, you agree to our Terms of Service & Privacy Policy
              </p>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <span className="text-[13px] font-semibold text-slate-600">
                  Verification code sent to
                </span>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="text-[14px] font-bold text-[#1C1C1C]">+91 {phoneNumber}</span>
                  <button
                    onClick={() => setStep('phone')}
                    className="text-[12px] text-[#0C831F] font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* 4 Digit OTP Inputs */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-[20px] font-bold text-[#1C1C1C] bg-[#F4F6FB] rounded-xl border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none shadow-2xs"
                  />
                ))}
              </div>

              {errorMsg && <p className="text-[11px] text-[#E23744] font-medium text-center">{errorMsg}</p>}

              {/* Auto-fill Helper */}
              <div className="bg-[#0C831F]/10 rounded-xl p-3 flex items-center justify-between text-[12px]">
                <span className="text-[#0C831F] font-medium">Use simulated OTP (1234)</span>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="bg-[#0C831F] text-white px-2.5 py-1 rounded-lg font-bold text-[11px] hover:bg-[#0a6d1a] transition-all cursor-pointer"
                >
                  Auto Fill & Login
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                className="w-full bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[14px] py-3 rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
              >
                Verify & Submit
              </button>

              <div className="text-center text-[12px] text-slate-500">
                {countdown > 0 ? (
                  <span>Resend code in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCountdown(30)}
                    className="text-[#0C831F] font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
