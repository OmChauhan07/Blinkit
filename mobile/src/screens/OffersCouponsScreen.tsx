import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Zap, Ticket } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

export const OffersCouponsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { coupons, appliedCoupon, applyCoupon, removeCoupon } = useStore();

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      Alert.alert('Coupon Applied', res.message, [
        { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') },
        { text: 'OK' }
      ]);
    } else {
      Alert.alert('Cannot Apply', res.message);
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
          <Text style={styles.headerTitle}>Offers &amp; Coupons</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <Zap size={12} color="#0C831F" fill="#0C831F" />
            <Text style={styles.promoTag}>BLINKIT SUPER SAVER</Text>
          </View>
          <Text style={styles.promoTitle}>Save up to ₹200 on every order</Text>
          <Text style={styles.promoSub}>Instant discounts applied directly at checkout on daily grocery essentials.</Text>
        </View>

        {/* Coupons List */}
        <Text style={styles.sectionTitle}>AVAILABLE COUPONS</Text>

        {coupons.map((coupon) => {
          const isApplied = appliedCoupon?.code === coupon.code;

          return (
            <View key={coupon.code} style={[styles.couponCard, isApplied && styles.couponCardApplied]}>
              <View style={styles.couponHeader}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{coupon.code}</Text>
                </View>

                {isApplied ? (
                  <TouchableOpacity style={styles.removeBtn} onPress={removeCoupon}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => handleApply(coupon.code)}
                  >
                    <Text style={styles.applyBtnText}>APPLY</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.couponTitle}>{coupon.title}</Text>
              <Text style={styles.couponDesc}>{coupon.description}</Text>

              <View style={styles.couponFooter}>
                <Text style={styles.minOrder}>Min order: ₹{coupon.minOrderValue}</Text>
                <Text style={styles.expiry}>{coupon.expiryDate}</Text>
              </View>
            </View>
          );
        })}

        {/* Bank Partner Offers */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>BANK &amp; PAYMENT OFFERS</Text>

        <View style={styles.bankCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <CreditCard size={15} color="#1E40AF" />
            <Text style={styles.bankName}>HDFC Bank Credit Cards</Text>
          </View>
          <Text style={styles.bankDesc}>Flat ₹100 instant cashback on orders above ₹799 using HDFC Bank Credit Cards.</Text>
        </View>

        <View style={styles.bankCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Zap size={15} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.bankName}>CRED UPI</Text>
          </View>
          <Text style={styles.bankDesc}>Get up to ₹50 cashback directly into your CRED account on first UPI transaction.</Text>
        </View>
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
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center'
  },
  backBtn: { padding: 4, marginRight: 12, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  promoBanner: {
    backgroundColor: '#0C831F',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  promoTag: { fontSize: 10, fontWeight: '900', color: '#F8CB46', marginBottom: 4 },
  promoTitle: { fontSize: 16, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  promoSub: { fontSize: 11, color: 'rgba(255,255,255,0.9)', lineHeight: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#828282', marginBottom: 10, letterSpacing: 0.5 },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  couponCardApplied: { borderColor: '#0C831F', backgroundColor: '#F8FFF9' },
  couponHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  codeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed'
  },
  codeText: { fontSize: 13, fontWeight: '900', color: '#0C831F', letterSpacing: 0.5 },
  applyBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, backgroundColor: '#0C831F' },
  applyBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 },
  removeBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  removeBtnText: { color: '#EF4444', fontWeight: '800', fontSize: 11 },
  couponTitle: { fontSize: 14, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  couponDesc: { fontSize: 12, color: '#666666', lineHeight: 18, marginBottom: 10 },
  couponFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F4F6FB', paddingTop: 8 },
  minOrder: { fontSize: 11, color: '#828282', fontWeight: '600' },
  expiry: { fontSize: 11, color: '#F59E0B', fontWeight: '700' },
  bankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  bankName: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  bankDesc: { fontSize: 11, color: '#666666', lineHeight: 16 }
});
