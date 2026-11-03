import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useStore } from '../context/StoreContext';

export const OrderTrackingScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { orderId } = route.params || { orderId: 'ord-101' };
  const { orders } = useStore();
  const order = orders.find((o) => o.id === orderId) || orders[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeTab')} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order?.orderNumber || 'BLK-98214'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Live ETA Card */}
        <View style={styles.etaCard}>
          <View style={styles.etaPill}>
            <Text style={styles.etaPillText}>⚡ LIVE DELIVERY TRACKING</Text>
          </View>
          <Text style={styles.etaTime}>Arriving in 8 mins</Text>
          <Text style={styles.etaDesc}>
            Your rider {order?.driverName || 'Ramesh Kumar'} is on the way from the dark store!
          </Text>
        </View>

        {/* Timeline Stepper */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Status</Text>
          
          <View style={styles.step}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Text style={styles.checkText}>✓</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Order Placed</Text>
              <Text style={styles.stepSub}>Payment confirmed</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Text style={styles.checkText}>✓</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Packed at Dark Store</Text>
              <Text style={styles.stepSub}>Quality &amp; temperature checked</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.checkText}>🛵</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={[styles.stepTitle, { color: '#0C831F' }]}>Out for Delivery</Text>
              <Text style={styles.stepSub}>Partner on electric vehicle (~8 mins away)</Text>
            </View>
          </View>

          <View style={[styles.step, { borderLeftWidth: 0 }]}>
            <View style={styles.stepDot}>
              <Text style={styles.checkText}>○</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Delivered</Text>
              <Text style={styles.stepSub}>At your doorstep safely</Text>
            </View>
          </View>
        </View>

        {/* Delivery Partner */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>R</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverRole}>Delivery Partner</Text>
            <Text style={styles.driverName}>{order?.driverName || 'Ramesh Kumar'}</Text>
            <Text style={styles.driverRating}>4.9 ★ (2,400+ deliveries)</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Home */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={styles.doneBtnText}>Continue Shopping</Text>
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
  etaCard: { backgroundColor: '#0C831F', borderRadius: 16, padding: 20, marginBottom: 16 },
  etaPill: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  etaPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  etaTime: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  etaDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#ECEFF1' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1C1C1C', marginBottom: 14 },
  step: { flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 16, borderLeftWidth: 2, borderLeftColor: '#0C831F', marginLeft: 14, paddingLeft: 16 },
  stepDot: { position: 'absolute', left: -11, top: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: '#CFD8DC', alignItems: 'center', justifyContent: 'center' },
  stepDotDone: { backgroundColor: '#0C831F' },
  stepDotActive: { backgroundColor: '#F8CB46' },
  checkText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  stepInfo: { marginTop: -2 },
  stepTitle: { fontSize: 13, fontWeight: '800', color: '#1C1C1C' },
  stepSub: { fontSize: 11, color: '#828282', marginTop: 1 },
  driverCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#ECEFF1' },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F4F6FB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  driverAvatarText: { fontSize: 18, fontWeight: '800', color: '#0C831F' },
  driverRole: { fontSize: 10, color: '#828282', textTransform: 'uppercase', fontWeight: '700' },
  driverName: { fontSize: 14, fontWeight: '800', color: '#1C1C1C' },
  driverRating: { fontSize: 11, color: '#0C831F', fontWeight: '600' },
  callBtn: { backgroundColor: '#F4F6FB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#ECEFF1' },
  callBtnText: { color: '#0C831F', fontSize: 12, fontWeight: '800' },
  doneBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECEFF1', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  doneBtnText: { color: '#1C1C1C', fontSize: 14, fontWeight: '800' }
});
