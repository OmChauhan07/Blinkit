import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useStore } from '../context/StoreContext';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cart, updateQuantity, itemTotal, grandTotal, selectedAddress } = useStore();

  const handlingFee = itemTotal > 0 ? 4 : 0;
  const deliveryFee = itemTotal >= 149 ? 0 : 25;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add fresh groceries to start your 10-minute delivery!</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('HomeTab')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({cart.length} items)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Delivery ETA Milestone */}
        <View style={styles.etaCard}>
          <Text style={styles.etaHeading}>⚡ Delivery in 10 minutes</Text>
          <Text style={styles.etaSub}>
            {deliveryFee === 0 ? '🎉 Free delivery unlocked on this order!' : `Add ₹${149 - itemTotal} more for FREE delivery`}
          </Text>
        </View>

        {/* Cart Items List */}
        <View style={styles.itemsCard}>
          {cart.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <Image source={{ uri: item.product.image }} style={styles.itemImg} resizeMode="contain" />
              <View style={styles.itemInfo}>
                <Text numberOfLines={1} style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemWeight}>{item.product.packWeight}</Text>
                <Text style={styles.itemPrice}>₹{item.product.price * item.quantity}</Text>
              </View>

              {/* Stepper */}
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => updateQuantity(item.product.id, -1)} style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.product.id, 1)} style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Bill Breakdown */}
        <View style={styles.billCard}>
          <Text style={styles.billHeading}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{itemTotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Handling Charge</Text>
            <Text style={styles.billValue}>₹{handlingFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalValue}>₹{grandTotal}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerAddress}>Deliver to: {selectedAddress.type} ({selectedAddress.houseNo})</Text>
          <Text style={styles.footerTotal}>₹{grandTotal}</Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.payBtnText}>Proceed to Pay →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ECEFF1' },
  backBtn: { padding: 4, marginRight: 12 },
  backText: { fontSize: 20, fontWeight: '800' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16 },
  etaCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#ECEFF1' },
  etaHeading: { color: '#0C831F', fontSize: 13, fontWeight: '800', marginBottom: 2 },
  etaSub: { color: '#666666', fontSize: 11 },
  itemsCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#ECEFF1', marginBottom: 14, overflow: 'hidden' },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F4F6FB' },
  itemImg: { width: 50, height: 50, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  itemWeight: { fontSize: 11, color: '#828282', marginTop: 1 },
  itemPrice: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', marginTop: 2 },
  stepper: { backgroundColor: '#0C831F', borderRadius: 8, flexDirection: 'row', alignItems: 'center', width: 68, height: 30, justifyContent: 'space-between', paddingHorizontal: 4 },
  stepBtn: { width: 20, height: '100%', alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  qtyText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  billCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#ECEFF1' },
  billHeading: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', marginBottom: 10 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 12, color: '#666666' },
  billValue: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#ECEFF1', paddingTop: 8, marginTop: 4 },
  totalLabel: { fontSize: 14, fontWeight: '900', color: '#1C1C1C' },
  totalValue: { fontSize: 16, fontWeight: '900', color: '#0C831F' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#ECEFF1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerAddress: { fontSize: 10, color: '#666666', maxWidth: 170 },
  footerTotal: { fontSize: 18, fontWeight: '900', color: '#1C1C1C' },
  payBtn: { backgroundColor: '#0C831F', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  payBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  emptySub: { fontSize: 12, color: '#666666', textAlign: 'center', marginBottom: 20 },
  shopBtn: { backgroundColor: '#0C831F', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  shopBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' }
});
