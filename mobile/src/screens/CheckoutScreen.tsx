import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShoppingBag,
  Home,
  Briefcase,
  MapPin,
  DoorOpen,
  BellOff,
  PhoneCall,
  Ticket,
  Zap,
  Check
} from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

const PAYMENT_OPTIONS = [
  { id: 'upi_gpay', name: 'Google Pay UPI', desc: 'Instant UPI Payment', tag: 'Fastest' },
  { id: 'upi_phonepe', name: 'PhonePe UPI', desc: 'Scan & Pay', tag: '' },
  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', tag: 'Saved' },
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay at your doorstep', tag: 'Zero Fee' }
];

const DELIVERY_INSTRUCTIONS = [
  { id: 'door', label: 'Leave at door', Icon: DoorOpen },
  { id: 'bell', label: 'Avoid ringing bell', Icon: BellOff },
  { id: 'call', label: 'Call before delivery', Icon: PhoneCall }
];

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    cart,
    billSummary,
    selectedAddress,
    setIsLocationModalOpen,
    setIsApplyCouponModalOpen,
    appliedCoupon,
    placeOrder
  } = useStore();

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const [selectedPay, setSelectedPay] = useState('upi_gpay');
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
            <Text style={styles.headerTitle}>Checkout</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={56} color="#9CA3AF" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add grocery essentials to proceed to checkout.</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.browseBtnText}>Return to Store</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const chosen = PAYMENT_OPTIONS.find((p) => p.id === selectedPay)?.name || 'UPI';
      const orderId = placeOrder(chosen);
      setIsProcessing(false);
      navigation.replace('OrderTracking', { orderId });
    }, 900);
  };

  const getAddressIcon = (type: string) => {
    if (type === 'Home') return <Home size={18} color="#0C831F" />;
    if (type === 'Work') return <Briefcase size={18} color="#0C831F" />;
    return <MapPin size={18} color="#0C831F" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => (navigation.canGoBack?.() ? navigation.goBack() : navigation.navigate('HomeTab'))}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Checkout & Payment</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Delivery Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.stepTitleRow}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.cardTitle}>Delivery Address</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsLocationModalOpen(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.changeAddressText}>Change Address ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <View style={{ marginRight: 12, marginTop: 2 }}>
              {getAddressIcon(selectedAddress.type)}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.addrTypeRow}>
                <Text style={styles.addrType}>{selectedAddress.type}</Text>
                <View style={styles.etaPill}>
                  <Zap size={10} color="#0C831F" fill="#0C831F" />
                  <Text style={styles.etaPillText}>10 MINS</Text>
                </View>
              </View>
              <Text style={styles.addrMain}>
                {selectedAddress.houseNo}, {selectedAddress.apartmentRoad}
              </Text>
              <Text style={styles.addrSub}>
                {selectedAddress.city} - {selectedAddress.pincode}
              </Text>
              <Text style={styles.addrPhone}>
                Receiver: {selectedAddress.name} ({selectedAddress.phone})
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Instructions</Text>
          <View style={styles.instructionsRow}>
            {DELIVERY_INSTRUCTIONS.map((inst) => {
              const isSelected = selectedInstruction === inst.id;
              const InstIcon = inst.Icon;
              return (
                <TouchableOpacity
                  key={inst.id}
                  style={[styles.instChip, isSelected && styles.instChipActive]}
                  onPress={() => setSelectedInstruction(isSelected ? null : inst.id)}
                >
                  <InstIcon size={14} color={isSelected ? '#0C831F' : '#6B7280'} style={{ marginRight: 6 }} />
                  <Text style={[styles.instLabel, isSelected && styles.instLabelActive]}>
                    {inst.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Payment Methods */}
        <View style={styles.card}>
          <View style={styles.stepTitleRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentList}>
            {PAYMENT_OPTIONS.map((opt) => {
              const isSelected = selectedPay === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSelectedPay(opt.id)}
                  style={[styles.payOption, isSelected && styles.payOptionActive]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.payNameRow}>
                      <Text style={[styles.payName, isSelected && styles.payNameActive]}>
                        {opt.name}
                      </Text>
                      {opt.tag.length > 0 && (
                        <View style={styles.payTagPill}>
                          <Text style={styles.payTagText}>{opt.tag}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.payDesc}>{opt.desc}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Coupons Card */}
        <TouchableOpacity
          style={styles.couponCard}
          onPress={() => setIsApplyCouponModalOpen(true)}
        >
          <Ticket size={20} color="#0C831F" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.couponTitle}>
              {appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Apply Coupon'}
            </Text>
            <Text style={styles.couponSub}>
              {appliedCoupon
                ? `You save ₹${billSummary.discount} on this order!`
                : 'Select from available coupon discounts'}
            </Text>
          </View>
          <Text style={styles.couponAction}>{appliedCoupon ? 'CHANGE ›' : 'VIEW ›'}</Text>
        </TouchableOpacity>

        {/* Order Items Review */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items ({cart.length})</Text>
          <View style={styles.itemsReviewList}>
            {cart.map((item) => (
              <View key={item.product.id} style={styles.itemReviewRow}>
                <Image source={{ uri: item.product.image }} style={styles.itemImg} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.selectedWeight || item.product.packWeight} • Qty: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bill Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Details</Text>
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
                Coupon Discount ({appliedCoupon?.code})
              </Text>
              <Text style={[styles.billValue, styles.discountText]}>
                −₹{billSummary.discount}
              </Text>
            </View>
          )}

          <View style={[styles.billRow, styles.totalRow]}>
            <View>
              <Text style={styles.totalLabel}>Total Payable</Text>
              {billSummary.totalSavings > 0 && (
                <Text style={styles.savingsTag}>
                  Total savings ₹{billSummary.totalSavings}
                </Text>
              )}
            </View>
            <Text style={styles.totalValue}>₹{billSummary.grandTotal}</Text>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>Cancellation Policy</Text>
          <Text style={styles.policyDesc}>
            Orders are dispatched within 2 minutes. Free cancellation is permitted before the store finishes packing.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Confirm Bar */}
      <View style={[styles.footerBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.footerInner}>
          <View>
            <Text style={styles.footerPrice}>₹{billSummary.grandTotal}</Text>
            <Text style={styles.footerLabel}>TOTAL PAYABLE</Text>
          </View>

          <TouchableOpacity
            style={[styles.confirmBtn, isProcessing && styles.confirmBtnDisabled]}
            disabled={isProcessing}
            activeOpacity={0.9}
            onPress={handlePay}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.confirmBtnText}>Pay & Place Order</Text>
                <Zap size={14} color="#FFFFFF" fill="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#ECEFF1' },
  headerInner: { flexDirection: 'row', alignItems: 'center', padding: 14, maxWidth: 700, width: '100%', alignSelf: 'center' },
  backBtn: { padding: 4, marginRight: 12, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#ECEFF1' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0C831F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepNumberText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1C1C1C' },
  changeAddressText: { fontSize: 12, fontWeight: '800', color: '#0C831F' },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    alignItems: 'flex-start'
  },
  addressTypeIcon: { fontSize: 22, marginRight: 10, marginTop: 2 },
  addrTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addrType: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  etaPill: { backgroundColor: '#E8F8E7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  etaPillText: { fontSize: 9, fontWeight: '800', color: '#0C831F' },
  addrMain: { fontSize: 12, color: '#374151', marginTop: 3 },
  addrSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  addrPhone: { fontSize: 11, color: '#9CA3AF', marginTop: 3 },
  instructionsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  instChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  instChipActive: { borderColor: '#0C831F', backgroundColor: '#F0FDF4' },
  instIcon: { fontSize: 18, marginBottom: 4 },
  instLabel: { fontSize: 10, fontWeight: '700', color: '#4B5563', textAlign: 'center' },
  instLabelActive: { color: '#0C831F' },
  paymentList: { marginTop: 12, gap: 8 },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    backgroundColor: '#FFFFFF'
  },
  payOptionActive: { borderColor: '#0C831F', backgroundColor: '#F0FDF4' },
  payNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  payName: { fontSize: 13, fontWeight: '700', color: '#1C1C1C' },
  payNameActive: { color: '#0C831F', fontWeight: '800' },
  payTagPill: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  payTagText: { fontSize: 9, fontWeight: '800', color: '#92400E' },
  payDesc: { fontSize: 11, color: '#666666', marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioActive: { borderColor: '#0C831F' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0C831F' },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    marginBottom: 14,
    gap: 10
  },
  couponIcon: { fontSize: 22 },
  couponTitle: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  couponSub: { fontSize: 11, color: '#0C831F', fontWeight: '600', marginTop: 1 },
  couponAction: { fontSize: 12, fontWeight: '800', color: '#0C831F' },
  itemsReviewList: { marginTop: 10, gap: 10 },
  itemReviewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemImg: { width: 40, height: 40 },
  itemName: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  itemMeta: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  itemPrice: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 12, color: '#4B5563' },
  billValue: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  freeText: { color: '#0C831F' },
  discountText: { color: '#0C831F' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#ECEFF1', paddingTop: 10, marginTop: 4, alignItems: 'center' },
  totalLabel: { fontSize: 14, fontWeight: '900', color: '#1C1C1C' },
  savingsTag: { fontSize: 10, fontWeight: '800', color: '#0C831F' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#0C831F' },
  policyCard: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ECEFF1' },
  policyTitle: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  policyDesc: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  footerBar: {
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
  footerPrice: { fontSize: 19, fontWeight: '900', color: '#1C1C1C' },
  footerLabel: { fontSize: 9, fontWeight: '800', color: '#9CA3AF' },
  confirmBtn: { backgroundColor: '#0C831F', paddingHorizontal: 22, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 60, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#666666', textAlign: 'center', marginBottom: 20 },
  browseBtn: { backgroundColor: '#0C831F', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  browseBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' }
});
