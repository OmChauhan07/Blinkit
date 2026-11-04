import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  Ticket,
  Bike,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

const TIP_OPTIONS = [10, 20, 30, 50];

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    cart,
    updateQuantity,
    billSummary,
    tipAmount,
    setTipAmount,
    appliedCoupon,
    removeCoupon,
    setIsApplyCouponModalOpen,
    setIsLocationModalOpen,
    selectedAddress
  } = useStore();

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={[styles.header, { paddingTop: headerTopPadding }]}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              onPress={() => (navigation.canGoBack?.() ? navigation.goBack() : navigation.navigate('HomeTab'))}
              style={styles.backBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={22} color="#1C1C1C" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Cart</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={56} color="#9CA3AF" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add fresh groceries to start your 10-minute delivery!</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('HomeTab')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => (navigation.canGoBack?.() ? navigation.goBack() : navigation.navigate('HomeTab'))}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart ({totalCount} items)</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery ETA Milestone & Free Delivery Threshold */}
        <View style={styles.etaCard}>
          <View style={styles.etaTopRow}>
            <Zap size={15} color="#0C831F" fill="#0C831F" />
            <Text style={styles.etaHeading}>Delivery in 10 minutes</Text>
          </View>
          {billSummary.itemTotal >= 149 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="#0C831F" />
              <Text style={styles.freeDelUnlocked}>
                Free delivery unlocked on this order!
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

        {/* Cart Items List */}
        <View style={styles.itemsCard}>
          {cart.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <Image source={{ uri: item.product.image }} style={styles.itemImg} resizeMode="contain" />
              <View style={styles.itemInfo}>
                <Text numberOfLines={1} style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemWeight}>{item.selectedWeight || item.product.packWeight}</Text>
                <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
              </View>

              {/* Stepper */}
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.product.id, -1)}
                  style={styles.stepBtn}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.product.id, 1)}
                  style={styles.stepBtn}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Coupons Banner */}
        <TouchableOpacity
          style={styles.couponBanner}
          onPress={() => setIsApplyCouponModalOpen(true)}
        >
          <Ticket size={20} color="#0C831F" />
          <View style={{ flex: 1 }}>
            <Text style={styles.couponBannerTitle}>
              {appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Avail Coupons & Offers'}
            </Text>
            <Text style={styles.couponBannerSub}>
              {appliedCoupon ? `You are saving ₹${billSummary.discount} on this order!` : 'Tap to view and apply discount coupons'}
            </Text>
          </View>
          <Text style={styles.couponBannerAction}>{appliedCoupon ? 'CHANGE ›' : 'VIEW ›'}</Text>
        </TouchableOpacity>

        {/* Delivery Partner Tip Selector */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Bike size={18} color="#0C831F" />
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
          <Text style={styles.billHeading}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{billSummary.itemTotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Handling Charge</Text>
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
              <Text style={[styles.billLabel, styles.discountText]}>
                Coupon Savings ({appliedCoupon?.code})
              </Text>
              <Text style={[styles.billValue, styles.discountText]}>
                −₹{billSummary.discount}
              </Text>
            </View>
          )}
          <View style={[styles.billRow, styles.totalRow]}>
            <View>
              <Text style={styles.totalLabel}>To Pay</Text>
              {billSummary.totalSavings > 0 && (
                <Text style={styles.savingsTag}>
                  Total savings ₹{billSummary.totalSavings}
                </Text>
              )}
            </View>
            <Text style={styles.totalValue}>₹{billSummary.grandTotal}</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.footerInner}>
          <TouchableOpacity
            style={{ flex: 1, marginRight: 12 }}
            onPress={() => setIsLocationModalOpen(true)}
          >
            <Text style={styles.footerAddress} numberOfLines={1}>
              Deliver to: {selectedAddress.type} ({selectedAddress.houseNo}) ▼
            </Text>
            <Text style={styles.footerTotal}>₹{billSummary.grandTotal}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.payBtn}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.payBtnText}>Proceed to Pay</Text>
            <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', maxWidth: 700, width: '100%', alignSelf: 'center' },
  backBtn: { padding: 4, marginRight: 12, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  etaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  etaTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  etaIcon: { fontSize: 16 },
  etaHeading: { color: '#0C831F', fontSize: 13, fontWeight: '800' },
  freeDelUnlocked: { color: '#0C831F', fontSize: 12, fontWeight: '700' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 11, color: '#4B5563' },
  progressValue: { fontSize: 11, fontWeight: '700', color: '#1C1C1C' },
  progressBarBg: { width: '100%', height: 6, borderRadius: 3, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0C831F', borderRadius: 3 },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    marginBottom: 14,
    overflow: 'hidden'
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F4F6FB' },
  itemImg: { width: 50, height: 50, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#1C1C1C' },
  itemWeight: { fontSize: 11, color: '#828282', marginTop: 1 },
  itemPrice: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', marginTop: 2 },
  stepper: {
    backgroundColor: '#0C831F',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: 68,
    height: 32,
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  stepBtn: { width: 22, height: '100%', alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  qtyText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  couponBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  couponBannerIcon: { fontSize: 22 },
  couponBannerTitle: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  couponBannerSub: { fontSize: 11, color: '#0C831F', fontWeight: '600', marginTop: 1 },
  couponBannerAction: { fontSize: 11, fontWeight: '900', color: '#0C831F' },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  tipIcon: { fontSize: 16 },
  tipTitle: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  tipSub: { fontSize: 11, color: '#6B7280', marginBottom: 10 },
  tipChipsRow: { flexDirection: 'row', gap: 10 },
  tipChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  tipChipActive: { borderColor: '#0C831F', backgroundColor: '#F0FDF4' },
  tipChipText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  tipChipTextActive: { color: '#0C831F' },
  billCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#ECEFF1' },
  billHeading: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', marginBottom: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 12, color: '#666666' },
  billValue: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  freeText: { color: '#0C831F' },
  discountText: { color: '#0C831F', fontWeight: '700' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#ECEFF1', paddingTop: 10, marginTop: 4, alignItems: 'center' },
  totalLabel: { fontSize: 14, fontWeight: '900', color: '#1C1C1C' },
  savingsTag: { fontSize: 10, fontWeight: '800', color: '#0C831F' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#0C831F' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingHorizontal: 16,
    paddingTop: 12
  },
  footerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 700, width: '100%', alignSelf: 'center' },
  footerAddress: { fontSize: 11, color: '#666666' },
  footerTotal: { fontSize: 18, fontWeight: '900', color: '#1C1C1C' },
  payBtn: { backgroundColor: '#0C831F', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  payBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  emptySub: { fontSize: 12, color: '#666666', textAlign: 'center', marginBottom: 20 },
  shopBtn: { backgroundColor: '#0C831F', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  shopBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' }
});
