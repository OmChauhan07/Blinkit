import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useStore } from '../context/StoreContext';

const PAYMENT_OPTIONS = [
  { id: 'upi_gpay', name: 'Google Pay UPI', desc: 'Instant UPI Payment' },
  { id: 'upi_phonepe', name: 'PhonePe UPI', desc: 'Scan & Pay' },
  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay at your doorstep' }
];

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { selectedAddress, grandTotal, placeOrder } = useStore();
  const [selectedPay, setSelectedPay] = useState('upi_gpay');

  const handlePay = () => {
    const orderId = placeOrder(selectedPay);
    navigation.replace('OrderTracking', { orderId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout &amp; Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <Text style={styles.etaPill}>⚡ 10 mins</Text>
          </View>
          <Text style={styles.addrType}>{selectedAddress.type}: {selectedAddress.houseNo}</Text>
          <Text style={styles.addrSub}>{selectedAddress.apartmentRoad}, {selectedAddress.city} - {selectedAddress.pincode}</Text>
          <Text style={styles.addrPhone}>Receiver: {selectedAddress.name} ({selectedAddress.phone})</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Choose Payment Mode</Text>
          <View style={styles.paymentList}>
            {PAYMENT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setSelectedPay(opt.id)}
                style={[styles.payOption, selectedPay === opt.id && styles.payOptionActive]}
              >
                <View>
                  <Text style={[styles.payName, selectedPay === opt.id && styles.payNameActive]}>
                    {opt.name}
                  </Text>
                  <Text style={styles.payDesc}>{opt.desc}</Text>
                </View>
                <View style={[styles.radio, selectedPay === opt.id && styles.radioActive]}>
                  {selectedPay === opt.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.9} onPress={handlePay}>
          <Text style={styles.confirmBtnText}>Pay ₹{grandTotal} &amp; Deliver</Text>
        </TouchableOpacity>
      </ScrollView>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#ECEFF1' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1C1C1C' },
  etaPill: { fontSize: 10, fontWeight: '800', color: '#0C831F', backgroundColor: '#F4F6FB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  addrType: { fontSize: 13, fontWeight: '700', color: '#1C1C1C', marginTop: 4 },
  addrSub: { fontSize: 12, color: '#666666', marginTop: 2 },
  addrPhone: { fontSize: 11, color: '#828282', marginTop: 4 },
  paymentList: { marginTop: 12 },
  payOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ECEFF1', marginBottom: 8 },
  payOptionActive: { borderColor: '#0C831F', backgroundColor: '#F7FCF8' },
  payName: { fontSize: 13, fontWeight: '700', color: '#1C1C1C' },
  payNameActive: { color: '#0C831F' },
  payDesc: { fontSize: 11, color: '#828282', marginTop: 1 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#B0BEC5', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#0C831F' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0C831F' },
  confirmBtn: { backgroundColor: '#0C831F', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' }
});
