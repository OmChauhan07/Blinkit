import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ticket, X } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';

export const ApplyCouponModal: React.FC = () => {
  const {
    isApplyCouponModalOpen,
    setIsApplyCouponModalOpen,
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isApplyCouponModalOpen) return null;

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setIsApplyCouponModalOpen(false);
        setFeedback(null);
      }, 700);
    }
  };

  const handleClose = () => {
    setIsApplyCouponModalOpen(false);
    setFeedback(null);
  };

  return (
    <Modal
      visible={isApplyCouponModalOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            isTablet && styles.tabletDialog,
            { paddingBottom: Math.max(insets.bottom, 16) }
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ticket size={20} color="#0C831F" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Apply Coupon & Offers</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Promo Code Input */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={inputCode}
                onChangeText={(t) => setInputCode(t.toUpperCase())}
                placeholder="Enter coupon code (e.g. BLINKIT50)"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.applyBtn, !inputCode.trim() && styles.applyBtnDisabled]}
                onPress={() => handleApply(inputCode)}
                disabled={!inputCode.trim()}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Feedback message */}
            {feedback && (
              <View
                style={[
                  styles.feedbackBox,
                  feedback.success ? styles.feedbackSuccess : styles.feedbackError
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    feedback.success ? styles.feedbackTextSuccess : styles.feedbackTextError
                  ]}
                >
                  {feedback.message}
                </Text>
              </View>
            )}

            {/* Currently Active Coupon */}
            {appliedCoupon && (
              <View style={styles.activeCouponCard}>
                <View style={styles.activeCouponLeft}>
                  <Text style={styles.activeCouponTag}>APPLIED COUPON</Text>
                  <Text style={styles.activeCouponCode}>{appliedCoupon.code}</Text>
                  <Text style={styles.activeCouponDesc}>
                    Saving ₹{discountAmount} on this order!
                  </Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={removeCoupon}>
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Available Coupons List */}
            <Text style={styles.sectionTitle}>AVAILABLE PROMOS & COUPONS</Text>

            <View style={styles.couponsList}>
              {coupons.map((c) => {
                const isCurrent = appliedCoupon?.code === c.code;
                return (
                  <View
                    key={c.code}
                    style={[styles.couponCard, isCurrent && styles.couponCardActive]}
                  >
                    <View style={styles.couponTopRow}>
                      <View style={styles.codeBadge}>
                        <Text style={styles.codeBadgeText}>{c.code}</Text>
                      </View>
                      {isCurrent ? (
                        <TouchableOpacity onPress={removeCoupon} style={styles.actionBtn}>
                          <Text style={styles.removeActionText}>Remove</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleApply(c.code)}
                          style={[styles.actionBtn, styles.applyActionBtn]}
                        >
                          <Text style={styles.applyActionText}>APPLY</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={styles.couponTitle}>{c.title}</Text>
                    <Text style={styles.couponDesc}>{c.description}</Text>

                    <View style={styles.couponFooter}>
                      <Text style={styles.minOrderText}>Min order: ₹{c.minOrderValue}</Text>
                      <Text style={styles.expiryText}>{c.expiryDate}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </Pressable>
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
  sheetContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10
  },
  tabletDialog: {
    maxWidth: 480,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerIcon: {
    fontSize: 20
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280'
  },
  scrollContent: {
    paddingBottom: 16
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1C',
    backgroundColor: '#F9FAFB'
  },
  applyBtn: {
    backgroundColor: '#0C831F',
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnDisabled: {
    opacity: 0.5
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  feedbackBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7'
  },
  feedbackError: {
    backgroundColor: '#FEE2E2'
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center'
  },
  feedbackTextSuccess: {
    color: '#15803D'
  },
  feedbackTextError: {
    color: '#B91C1C'
  },
  activeCouponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginBottom: 16
  },
  activeCouponLeft: {
    flex: 1
  },
  activeCouponTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0C831F',
    letterSpacing: 0.5
  },
  activeCouponCode: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0C831F',
    marginTop: 1
  },
  activeCouponDesc: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  removeBtnText: {
    color: '#E23744',
    fontSize: 12,
    fontWeight: '800'
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  couponsList: {
    gap: 10
  },
  couponCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  couponCardActive: {
    borderColor: '#0C831F',
    backgroundColor: '#F0FDF4'
  },
  couponTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  codeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F59E0B'
  },
  codeBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400E'
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  applyActionBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#0C831F'
  },
  applyActionText: {
    color: '#0C831F',
    fontSize: 12,
    fontWeight: '800'
  },
  removeActionText: {
    color: '#E23744',
    fontSize: 12,
    fontWeight: '800'
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 2
  },
  couponDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 8
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8
  },
  minOrderText: {
    fontSize: 11,
    color: '#9CA3AF'
  },
  expiryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF'
  }
});

