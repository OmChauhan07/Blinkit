import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingBag, ShoppingCart, Zap, Sparkles, Ticket, Bike, X } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';

const TIP_OPTIONS = [10, 20, 30, 50];

export const CartDrawer: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateQuantity,
    billSummary,
    tipAmount,
    setTipAmount,
    appliedCoupon,
    removeCoupon,
    setIsApplyCouponModalOpen,
    selectedAddress
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();

  if (!isCartDrawerOpen) return null;

  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleProceedToPay = () => {
    setIsCartDrawerOpen(false);
    if (navigation?.navigate) {
      navigation.navigate('Checkout');
    }
  };

  const handleOpenCoupons = () => {
    setIsApplyCouponModalOpen(true);
  };

  const handleClose = () => {
    setIsCartDrawerOpen(false);
  };

  return (
    <Modal
      visible={isCartDrawerOpen}
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
              <ShoppingBag size={20} color="#0C831F" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>My Cart</Text>
              <Text style={styles.headerCount}>({totalCount} items)</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingCart size={54} color="#9CA3AF" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySub}>
                Add fresh fruits, veggies, milk, snacks and essentials for instant 10-minute delivery.
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => {
                  handleClose();
                  navigation?.navigate?.('HomeTab');
                }}
              >
                <Text style={styles.browseBtnText}>Browse Catalogue</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* 10-Min ETA & Free Delivery Progress Bar */}
                <View style={styles.freeDelCard}>
                  <View style={styles.freeDelTop}>
                    <Zap size={14} color="#0C831F" fill="#0C831F" style={{ marginRight: 6 }} />
                    <Text style={styles.freeDelTitle}>Delivery in 10 minutes</Text>
                  </View>
                  {billSummary.itemTotal >= 149 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={14} color="#0C831F" />
                      <Text style={styles.freeDelUnlocked}>
                        Yay! You saved ₹25 on delivery fee!
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.progressRow}>
                        <Text style={styles.progressLabel}>
                          Add ₹{149 - billSummary.itemTotal} more for FREE delivery
                        </Text>
                        <Text style={styles.progressValue}>₹{billSummary.itemTotal}/149</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${Math.min(100, (billSummary.itemTotal / 149) * 100)}%` }
                          ]}
                        />
                      </View>
                    </View>
                  )}
                </View>

                {/* Items List */}
                <View style={styles.itemsList}>
                  {cart.map((item) => (
                    <View key={item.product.id} style={styles.itemRow}>
                      <Image
                        source={{ uri: item.product.image }}
                        style={styles.itemImg}
                        resizeMode="contain"
                      />
                      <View style={styles.itemInfo}>
                        <Text numberOfLines={1} style={styles.itemName}>
                          {item.product.name}
                        </Text>
                        <Text style={styles.itemWeight}>{item.selectedWeight || item.product.packWeight}</Text>
                        <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
                      </View>

                      {/* Stepper */}
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateQuantity(item.product.id, -1)}
                        >
                          <Text style={styles.stepBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateQuantity(item.product.id, 1)}
                        >
                          <Text style={styles.stepBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Coupon Shortcut Banner */}
                <TouchableOpacity style={styles.couponBanner} onPress={handleOpenCoupons}>
                  <Ticket size={20} color="#0C831F" style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.couponTitle}>
                      {appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Avail Coupons & Offers'}
                    </Text>
                    <Text style={styles.couponSub}>
                      {appliedCoupon
                        ? `You are saving ₹${billSummary.discount} on this order!`
                        : 'Tap to view and apply discount promo codes'}
                    </Text>
                  </View>
                  <Text style={styles.couponAction}>
                    {appliedCoupon ? 'CHANGE ›' : 'VIEW ›'}
                  </Text>
                </TouchableOpacity>

                {/* Delivery Tip Selector */}
                <View style={styles.tipCard}>
                  <View style={styles.tipHeader}>
                    <Bike size={18} color="#0C831F" style={{ marginRight: 6 }} />
                    <Text style={styles.tipTitle}>Tip your delivery partner</Text>
                  </View>
                  <Text style={styles.tipSub}>
                    100% of the tip goes directly to your partner for their 10-minute sprint.
                  </Text>
                  <View style={styles.tipChipsRow}>
                    {TIP_OPTIONS.map((amt) => {
                      const isSelected = tipAmount === amt;
                      return (
                        <TouchableOpacity
                          key={amt}
                          onPress={() => setTipAmount(isSelected ? 0 : amt)}
                          style={[styles.tipChip, isSelected && styles.tipChipActive]}
                        >
                          <Text style={[styles.tipChipText, isSelected && styles.tipChipTextActive]}>
                            ₹{amt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Bill Breakdown */}
                <View style={styles.billCard}>
                  <Text style={styles.billTitle}>Bill Summary</Text>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Item Total</Text>
                    <Text style={styles.billValue}>₹{billSummary.itemTotal}</Text>
                  </View>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Handling Fee</Text>
                    <Text style={styles.billValue}>₹{billSummary.handlingFee}</Text>
                  </View>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <Text style={[styles.billValue, billSummary.deliveryFee === 0 && styles.freeText]}>
                      {billSummary.deliveryFee === 0 ? 'FREE' : `₹${billSummary.deliveryFee}`}
                    </Text>
                  </View>
                  {billSummary.tip > 0 && (
                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>Delivery Partner Tip</Text>
                      <Text style={styles.billValue}>₹{billSummary.tip}</Text>
                    </View>
                  )}
                  {billSummary.discount > 0 && (
                    <View style={styles.billRow}>
                      <Text style={[styles.billLabel, styles.discountText]}>Coupon Discount</Text>
                      <Text style={[styles.billValue, styles.discountText]}>
                        −₹{billSummary.discount}
                      </Text>
                    </View>
                  )}

                  <View style={[styles.billRow, styles.grandTotalRow]}>
                    <View>
                      <Text style={styles.grandTotalLabel}>Grand Total</Text>
                      {billSummary.totalSavings > 0 && (
                        <Text style={styles.savingsTag}>
                          Total savings ₹{billSummary.totalSavings}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.grandTotalValue}>₹{billSummary.grandTotal}</Text>
                  </View>
                </View>

                {/* Cancellation Policy Note */}
                <View style={styles.policyBox}>
                  <Text style={styles.policyTitle}>Cancellation Policy</Text>
                  <Text style={styles.policyDesc}>
                    Orders cannot be cancelled once packed by dark store partner to prevent food wastage.
                  </Text>
                </View>
              </ScrollView>

              {/* Sticky Checkout Bar */}
              <View style={styles.footerCheckoutBar}>
                <View style={styles.addressPill}>
                  <Text style={styles.deliveringToLabel}>Delivering to {selectedAddress.type}:</Text>
                  <Text numberOfLines={1} style={styles.deliveringAddress}>
                    {selectedAddress.houseNo}, {selectedAddress.city}
                  </Text>
                </View>

                <TouchableOpacity style={styles.proceedBtn} onPress={handleProceedToPay}>
                  <View>
                    <Text style={styles.proceedPrice}>₹{billSummary.grandTotal}</Text>
                    <Text style={styles.proceedTotalLabel}>TOTAL</Text>
                  </View>
                  <Text style={styles.proceedBtnText}>Proceed to Pay ›</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    maxHeight: '90%',
    backgroundColor: '#F4F6FB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10
  },
  tabletDialog: {
    maxWidth: 520,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingTop: 16
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  headerIcon: {
    fontSize: 20
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  headerCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600'
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
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF'
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 6
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  browseBtn: {
    backgroundColor: '#0C831F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24
  },
  freeDelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  freeDelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  freeDelIcon: {
    fontSize: 16,
    color: '#0C831F'
  },
  freeDelTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0C831F'
  },
  freeDelUnlocked: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0C831F'
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  progressLabel: {
    fontSize: 11,
    color: '#4B5563'
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1C'
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0C831F',
    borderRadius: 3
  },
  itemsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImg: {
    width: 48,
    height: 48,
    marginRight: 12
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1C'
  },
  itemWeight: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C',
    marginTop: 2
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C831F',
    borderRadius: 8,
    paddingHorizontal: 4,
    height: 32
  },
  stepBtn: {
    width: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 4
  },
  couponBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    gap: 10
  },
  couponIcon: {
    fontSize: 22
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  couponSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2
  },
  couponAction: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C831F'
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  tipIcon: {
    fontSize: 16
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  tipSub: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 10
  },
  tipChipsRow: {
    flexDirection: 'row',
    gap: 10
  },
  tipChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  tipChipActive: {
    borderColor: '#0C831F',
    backgroundColor: '#F0FDF4'
  },
  tipChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151'
  },
  tipChipTextActive: {
    color: '#0C831F'
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  billTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 10
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  billLabel: {
    fontSize: 12,
    color: '#4B5563'
  },
  billValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1C'
  },
  freeText: {
    color: '#0C831F'
  },
  discountText: {
    color: '#0C831F'
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    marginTop: 4,
    alignItems: 'center'
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  savingsTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0C831F'
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1C1C1C'
  },
  policyBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  policyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280'
  },
  policyDesc: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2
  },
  footerCheckoutBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 14
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  deliveringToLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 4
  },
  deliveringAddress: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1C',
    flex: 1
  },
  proceedBtn: {
    backgroundColor: '#0C831F',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  proceedPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  proceedTotalLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '800'
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});

