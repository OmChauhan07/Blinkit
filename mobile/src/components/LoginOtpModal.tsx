import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ArrowRight } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';

export const LoginOtpModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithPhone, verifyOtp } = useStore();
  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [countdown, setCountdown] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');

  const input1Ref = useRef<any>(null);
  const input2Ref = useRef<any>(null);
  const input3Ref = useRef<any>(null);
  const input4Ref = useRef<any>(null);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isLoginModalOpen) return null;

  const handlePhoneSubmit = () => {
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    loginWithPhone(clean);
    setStep('otp');
    setCountdown(30);
  };

  const handleOtpChange = (index: number, val: string) => {
    const nextOtp = [...otp];
    nextOtp[index] = val ? val.slice(-1) : '';
    setOtp(nextOtp);

    if (val && index === 0) input2Ref.current?.focus();
    else if (val && index === 1) input3Ref.current?.focus();
    else if (val && index === 2) input4Ref.current?.focus();
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setErrorMsg('Please enter all 4 digits of the OTP');
      return;
    }
    verifyOtp(code);
    handleClose();
  };

  const handleAutoFill = () => {
    setOtp(['1', '2', '3', '4']);
    setErrorMsg('');
    verifyOtp('1234');
    handleClose();
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setStep('phone');
    setErrorMsg('');
  };

  return (
    <Modal
      visible={isLoginModalOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <Pressable
            style={[
              styles.sheetContainer,
              isTablet && styles.tabletDialog,
              { paddingBottom: Math.max(insets.bottom, 20) }
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <View style={styles.topBanner}>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <X size={20} color="#1C1C1C" />
              </TouchableOpacity>
              <View style={styles.brandIconBadge}>
                <Text style={styles.blinkYellow}>blink</Text>
                <Text style={styles.itGreen}>it</Text>
              </View>
              <Text style={styles.bannerTitle}>India's Last Minute App</Text>
              <Text style={styles.bannerSub}>Log in or sign up for 10-minute instant delivery</Text>
            </View>

            {/* Body */}
            <View style={styles.bodyContent}>
              {errorMsg.length > 0 && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {step === 'phone' ? (
                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>Enter Mobile Number</Text>
                  <View style={styles.phoneInputRow}>
                    <View style={styles.countryCodeBox}>
                      <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="10-digit number"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <TouchableOpacity style={styles.submitBtn} onPress={handlePhoneSubmit}>
                    <Text style={styles.submitBtnText}>Continue</Text>
                    <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>

                  <Text style={styles.termsText}>
                    By continuing, you agree to our Terms of Service & Privacy Policy.
                  </Text>
                </View>
              ) : (
                <View style={styles.formSection}>
                  <View style={styles.otpHeader}>
                    <Text style={styles.otpSentTo}>OTP sent to +91 {phoneNumber}</Text>
                    <TouchableOpacity onPress={() => setStep('phone')}>
                      <Text style={styles.editPhoneLink}>Change</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 4 Digit Boxes */}
                  <View style={styles.otpBoxesRow}>
                    <TextInput
                      ref={input1Ref}
                      style={styles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otp[0]}
                      onChangeText={(v) => handleOtpChange(0, v)}
                    />
                    <TextInput
                      ref={input2Ref}
                      style={styles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otp[1]}
                      onChangeText={(v) => handleOtpChange(1, v)}
                    />
                    <TextInput
                      ref={input3Ref}
                      style={styles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otp[2]}
                      onChangeText={(v) => handleOtpChange(2, v)}
                    />
                    <TextInput
                      ref={input4Ref}
                      style={styles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otp[3]}
                      onChangeText={(v) => handleOtpChange(3, v)}
                    />
                  </View>

                  {/* 1-Tap Auto Fill Demo Button */}
                  <TouchableOpacity style={styles.autoFillBtn} onPress={handleAutoFill}>
                    <Text style={styles.autoFillText}>⚡ Auto-fill Demo OTP (1234)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.submitBtn} onPress={handleVerifyOtp}>
                    <Text style={styles.submitBtnText}>Verify OTP & Continue</Text>
                  </TouchableOpacity>

                  <View style={styles.resendRow}>
                    {countdown > 0 ? (
                      <Text style={styles.resendTimerText}>Resend code in {countdown}s</Text>
                    ) : (
                      <TouchableOpacity onPress={() => setCountdown(30)}>
                        <Text style={styles.resendActiveText}>Resend OTP via SMS</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  keyboardWrap: {
    width: '100%',
    alignItems: 'center'
  },
  sheetContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10
  },
  tabletDialog: {
    maxWidth: 420,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  topBanner: {
    backgroundColor: '#F8CB46',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1C'
  },
  brandIconBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2
  },
  blinkYellow: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F59E0B'
  },
  itGreen: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0C831F'
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1C1C1C',
    marginTop: 2
  },
  bannerSub: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
    textAlign: 'center'
  },
  bodyContent: {
    padding: 20
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  formSection: {
    width: '100%'
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 14
  },
  countryCodeBox: {
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB'
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1C'
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1C'
  },
  submitBtn: {
    backgroundColor: '#0C831F',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 12
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  termsText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  otpSentTo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563'
  },
  editPhoneLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C831F'
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16
  },
  otpBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  autoFillBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  autoFillText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '800'
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 8
  },
  resendTimerText: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  resendActiveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C831F'
  }
});
