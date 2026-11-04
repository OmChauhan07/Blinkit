import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Package, Bike, Phone, MessageCircle, Star } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

export const OrderTrackingScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const orderId = route?.params?.orderId || 'ord-101';
  const { orders, setCancelOrderModalOrderId, setRateOrderModalOrderId } = useStore();
  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId) || orders[0];

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const [etaSeconds, setEtaSeconds] = useState(8 * 60 + 24);

  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;
    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [order?.status]);

  if (!order) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Package size={56} color="#9CA3AF" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>Order Not Found</Text>
          <Text style={styles.emptySub}>We couldn't locate this order.</Text>
          <TouchableOpacity
            style={styles.ordersBtn}
            onPress={() => navigation.navigate('OrdersHistory')}
          >
            <Text style={styles.ordersBtnText}>View All Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const isPacking = order.status === 'packing';
  const isPlaced = order.status === 'placed';

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
          <Text style={styles.headerTitle}>Order #{order.orderNumber}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live ETA Hero Banner */}
        <View
          style={[
            styles.etaCard,
            isCancelled && styles.etaCardCancelled,
            isDelivered && styles.etaCardDelivered
          ]}
        >
          <View style={styles.etaPill}>
            <Text style={styles.etaPillText}>
              {isCancelled ? '❌ CANCELLED' : isDelivered ? '✅ DELIVERED' : '⚡ LIVE TRACKING'}
            </Text>
          </View>
          <Text style={styles.etaTime}>
            {isCancelled
              ? 'Order Cancelled'
              : isDelivered
              ? 'Order Delivered'
              : `Arriving in ${minutes}m ${seconds < 10 ? `0${seconds}` : seconds}s`}
          </Text>
          <Text style={styles.etaDesc}>
            {isCancelled
              ? `Refund of ₹${order.grandTotal} has been credited to your payment method.`
              : isDelivered
              ? 'Enjoy your groceries! Tap below to rate your delivery experience.'
              : `Your rider ${order.driverName || 'Ramesh Kumar'} is on the way from your local dark store!`}
          </Text>
        </View>

        {/* Timeline Stepper */}
        {!isCancelled && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Status</Text>

            <View style={styles.step}>
              <View style={[styles.stepDot, styles.stepDotDone]}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Order Placed</Text>
                <Text style={styles.stepSub}>Payment confirmed via {order.paymentMethod}</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View
                style={[
                  styles.stepDot,
                  (isPacking || order.status === 'on_the_way' || isDelivered)
                    ? styles.stepDotDone
                    : styles.stepDotPending
                ]}
              >
                <Text style={styles.checkText}>✓</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Packed at Dark Store</Text>
                <Text style={styles.stepSub}>Temperature-controlled cold packing</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View
                style={[
                  styles.stepDot,
                  order.status === 'on_the_way'
                    ? styles.stepDotActive
                    : isDelivered
                    ? styles.stepDotDone
                    : styles.stepDotPending
                ]}
              >
                <Bike size={14} color="#FFFFFF" />
              </View>
              <View style={styles.stepInfo}>
                <Text
                  style={[
                    styles.stepTitle,
                    order.status === 'on_the_way' && { color: '#0C831F' }
                  ]}
                >
                  Out for Delivery
                </Text>
                <Text style={styles.stepSub}>Partner on electric vehicle</Text>
              </View>
            </View>

            <View style={[styles.step, { borderLeftWidth: 0 }]}>
              <View style={[styles.stepDot, isDelivered ? styles.stepDotDone : styles.stepDotPending]}>
                <Text style={styles.checkText}>○</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Delivered</Text>
                <Text style={styles.stepSub}>Contactless doorstep delivery</Text>
              </View>
            </View>
          </View>
        )}

        {/* Delivery Partner Card */}
        {!isCancelled && (
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>
                {order.driverName ? order.driverName[0] : 'R'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverRole}>Delivery Partner</Text>
              <Text style={styles.driverName}>{order.driverName || 'Ramesh Kumar'}</Text>
              <Text style={styles.driverRating}>4.9 ★ (2,400+ deliveries)</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Phone size={13} color="#0C831F" style={{ marginRight: 4 }} />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Order Items List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items ({order.items.length})</Text>
          <View style={styles.itemsList}>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
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

          {/* Bill Breakdown */}
          <View style={styles.billBox}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Subtotal</Text>
              <Text style={styles.billValue}>₹{order.itemTotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Handling & Delivery Fee</Text>
              <Text style={styles.billValue}>₹{order.handlingFee + order.deliveryFee}</Text>
            </View>
            {order.tip > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Partner Tip</Text>
                <Text style={styles.billValue}>₹{order.tip}</Text>
              </View>
            )}
            {order.discount > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, styles.discountText]}>Discount</Text>
                <Text style={[styles.billValue, styles.discountText]}>−₹{order.discount}</Text>
              </View>
            )}
            <View style={[styles.billRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total Paid</Text>
              <Text style={styles.grandTotalValue}>₹{order.grandTotal}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons: Cancel, Rate, Need Help */}
        <View style={styles.actionButtonsCol}>
          {(!isCancelled && !isDelivered) && (
            <TouchableOpacity
              style={styles.cancelActionBtn}
              onPress={() => setCancelOrderModalOrderId(order.id)}
            >
              <Text style={styles.cancelActionText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {isDelivered && (
            <TouchableOpacity
              style={styles.rateActionBtn}
              onPress={() => setRateOrderModalOrderId(order.id)}
            >
              <Star size={14} color="#D97706" fill="#D97706" style={{ marginRight: 6 }} />
              <Text style={styles.rateActionText}>
                {order.rating ? `Rated ${order.rating} Stars` : 'Rate Order Experience'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.supportActionBtn}
            onPress={() => navigation.navigate('Support')}
          >
            <MessageCircle size={15} color="#374151" style={{ marginRight: 6 }} />
            <Text style={styles.supportActionText}>Need Help with this Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.continueBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#ECEFF1' },
  headerInner: { flexDirection: 'row', alignItems: 'center', padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  backBtn: { padding: 4, marginRight: 12, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  etaCard: { backgroundColor: '#0C831F', borderRadius: 16, padding: 20, marginBottom: 16 },
  etaCardCancelled: { backgroundColor: '#E23744' },
  etaCardDelivered: { backgroundColor: '#0C831F' },
  etaPill: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  etaPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  etaTime: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  etaDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#ECEFF1' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1C1C1C', marginBottom: 14 },
  step: { flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 16, borderLeftWidth: 2, borderLeftColor: '#0C831F', marginLeft: 14, paddingLeft: 16 },
  stepDot: { position: 'absolute', left: -11, top: 0, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepDotDone: { backgroundColor: '#0C831F' },
  stepDotActive: { backgroundColor: '#F8CB46' },
  stepDotPending: { backgroundColor: '#D1D5DB' },
  checkText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  stepInfo: { marginTop: -2 },
  stepTitle: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  stepSub: { fontSize: 11, color: '#828282', marginTop: 1 },
  driverCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#ECEFF1' },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F8E7', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  driverAvatarText: { fontSize: 18, fontWeight: '800', color: '#0C831F' },
  driverRole: { fontSize: 10, color: '#828282', textTransform: 'uppercase', fontWeight: '700' },
  driverName: { fontSize: 14, fontWeight: '800', color: '#1C1C1C' },
  driverRating: { fontSize: 11, color: '#0C831F', fontWeight: '600' },
  callBtn: { backgroundColor: '#F4F6FB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#ECEFF1', flexDirection: 'row', alignItems: 'center' },
  callBtnText: { color: '#0C831F', fontSize: 12, fontWeight: '800' },
  itemsList: { gap: 10, marginBottom: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemImg: { width: 44, height: 44 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#1C1C1C' },
  itemMeta: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  itemPrice: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  billBox: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12, gap: 6 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between' },
  billLabel: { fontSize: 12, color: '#4B5563' },
  billValue: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  discountText: { color: '#0C831F' },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8, marginTop: 4 },
  grandTotalLabel: { fontSize: 14, fontWeight: '900', color: '#1C1C1C' },
  grandTotalValue: { fontSize: 16, fontWeight: '900', color: '#0C831F' },
  actionButtonsCol: { gap: 10 },
  cancelActionBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelActionText: { color: '#E23744', fontSize: 13, fontWeight: '800' },
  rateActionBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rateActionText: { color: '#B45309', fontSize: 13, fontWeight: '800' },
  supportActionBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  supportActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  continueBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueBtnText: { color: '#374151', fontSize: 13, fontWeight: '700' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#666666', marginBottom: 20 },
  ordersBtn: { backgroundColor: '#0C831F', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  ordersBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' }
});
