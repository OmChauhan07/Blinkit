import React from 'react';
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
import { ArrowLeft, Package } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

export const OrdersHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { orders, addToCart, setCancelOrderModalOrderId, setRateOrderModalOrderId } = useStore();

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const handleReorder = (items: any[]) => {
    items.forEach((item) => {
      addToCart(item.product, item.selectedWeight);
    });
    navigation.navigate('Cart');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#0C831F';
      case 'on_the_way':
        return '#F59E0B';
      case 'placed':
      case 'packing':
        return '#2563EB';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#666666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'on_the_way':
        return 'Out for Delivery (ETA 8m)';
      case 'placed':
        return 'Order Placed';
      case 'packing':
        return 'Packing at Dark Store';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

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
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={56} color="#9CA3AF" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySub}>
              You haven't placed any 10-minute grocery orders yet. Start exploring our catalogue!
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <Text style={styles.startBtnText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => {
            const statusColor = getStatusColor(order.status);
            const statusLabel = getStatusLabel(order.status);
            const canCancel = order.status === 'placed' || order.status === 'packing';
            const isDelivered = order.status === 'delivered';

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Top Bar */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                  </View>
                </View>

                {/* Items Preview */}
                <View style={styles.itemsList}>
                  {order.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Image
                        source={{ uri: item.product.image }}
                        style={styles.itemImg}
                        resizeMode="contain"
                      />
                      <View style={styles.itemInfo}>
                        <Text numberOfLines={1} style={styles.itemName}>
                          {item.product.name}
                        </Text>
                        <Text style={styles.itemMeta}>
                          Qty: {item.quantity} • ₹{item.product.price}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Bill Summary Row */}
                <View style={styles.billRow}>
                  <Text style={styles.paymentMethod}>Paid via {order.paymentMethod}</Text>
                  <Text style={styles.grandTotal}>₹{order.grandTotal}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                  {order.status === 'on_the_way' || canCancel ? (
                    <>
                      <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                      >
                        <Text style={styles.primaryBtnText}>Track Live Order ⚡</Text>
                      </TouchableOpacity>

                      {canCancel && (
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          onPress={() => setCancelOrderModalOrderId(order.id)}
                        >
                          <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.reorderBtn}
                        onPress={() => handleReorder(order.items)}
                      >
                        <Text style={styles.reorderBtnText}>Repeat Order ↻</Text>
                      </TouchableOpacity>

                      {isDelivered && (
                        <TouchableOpacity
                          style={styles.rateBtn}
                          onPress={() => setRateOrderModalOrderId(order.id)}
                        >
                          <Text style={styles.rateBtnText}>
                            {order.rating ? `⭐ Rated ${order.rating}★` : '⭐ Rate Experience'}
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.detailsBtn}
                        onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                      >
                        <Text style={styles.detailsBtnText}>View Receipt</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center'
  },
  backBtn: { padding: 4, marginRight: 12, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 760, width: '100%', alignSelf: 'center' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1C', marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#666666', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  startBtn: { backgroundColor: '#0C831F', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  startBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FB'
  },
  orderNumber: { fontSize: 14, fontWeight: '800', color: '#1C1C1C' },
  orderDate: { fontSize: 11, color: '#828282', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  itemsList: { gap: 8, marginBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemImg: { width: 36, height: 36 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  itemMeta: { fontSize: 11, color: '#828282', marginTop: 1 },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4F6FB',
    marginBottom: 10
  },
  paymentMethod: { fontSize: 11, color: '#666666' },
  grandTotal: { fontSize: 15, fontWeight: '900', color: '#1C1C1C' },
  actionsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  primaryBtn: {
    flex: 2,
    backgroundColor: '#0C831F',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E23744',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  cancelBtnText: { color: '#E23744', fontSize: 12, fontWeight: '800' },
  reorderBtn: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#0C831F',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  reorderBtnText: { color: '#0C831F', fontSize: 12, fontWeight: '800' },
  rateBtn: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  rateBtnText: { color: '#92400E', fontSize: 12, fontWeight: '800' },
  detailsBtn: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  detailsBtnText: { color: '#374151', fontSize: 12, fontWeight: '700' }
});
