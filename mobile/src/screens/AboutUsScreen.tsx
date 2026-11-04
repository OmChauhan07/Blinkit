import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Zap, ShieldCheck, Bike, Tag } from 'lucide-react-native';

export const AboutUsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const pillars = [
    {
      Icon: Zap,
      title: '10-Minute Delivery',
      desc: 'Our network of high-density local dark stores enables picking, packing, and doorstep delivery in under 10 minutes.'
    },
    {
      Icon: ShieldCheck,
      title: 'Farm Fresh & Cold Chain',
      desc: 'Milk, bread, and fruits maintained at strict 4°C temperatures from dairy farms right to your refrigerator.'
    },
    {
      Icon: Bike,
      title: '100% Electric Fleet',
      desc: 'Committed to green urban logistics with zero-emission electric two-wheelers for every neighborhood delivery.'
    },
    {
      Icon: Tag,
      title: 'Best Prices Every Day',
      desc: 'Everyday low prices on 5,000+ daily grocery staples with transparent bill breakdowns and zero hidden surge fees.'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Blinkit</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Hero */}
        <View style={styles.heroCard}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBlink}>blink</Text>
            <Text style={styles.brandIt}>it</Text>
          </View>
          <Text style={styles.heroHeading}>India's Pioneer in Quick Commerce</Text>
          <Text style={styles.heroDesc}>
            Blinkit transforms daily grocery shopping by delivering thousands of essentials to your doorstep in 10 minutes.
          </Text>
        </View>

        {/* Pillars */}
        <Text style={styles.sectionHeading}>HOW WE DELIVER IN 10 MINUTES</Text>
        {pillars.map((p, idx) => {
          const PillarIcon = p.Icon;
          return (
            <View key={idx} style={styles.pillarCard}>
              <View style={styles.pillarIconBox}>
                <PillarIcon size={20} color="#0C831F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pillarTitle}>{p.title}</Text>
                <Text style={styles.pillarDesc}>{p.desc}</Text>
              </View>
            </View>
          );
        })}

        {/* Company Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Corporate Office</Text>
          <Text style={styles.infoText}>Blinkit Commerce Private Limited</Text>
          <Text style={styles.infoSub}>DLF Cyber City, Phase 2, Gurugram, Haryana - 122002</Text>
          <Text style={styles.infoSub}>CIN: U74999HR2013PTC051010</Text>
          <Text style={styles.infoContact}>Contact: info@blinkit.com • 1800-208-8888</Text>
        </View>

        {/* App Version Tag */}
        <Text style={styles.footerNote}>© 2026 Blinkit. All rights reserved.</Text>
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
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  heroCard: {
    backgroundColor: '#F8CB46',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },
  brandBadge: { flexDirection: 'row', marginBottom: 8 },
  brandBlink: { fontSize: 28, fontWeight: '900', color: '#1C1C1C' },
  brandIt: { fontSize: 28, fontWeight: '900', color: '#0C831F' },
  heroHeading: { fontSize: 16, fontWeight: '900', color: '#1C1C1C', marginBottom: 6 },
  heroDesc: { fontSize: 12, color: '#333333', lineHeight: 18 },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#828282', marginBottom: 12, letterSpacing: 0.5 },
  pillarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    gap: 12
  },
  pillarIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pillarTitle: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', marginBottom: 2 },
  pillarDesc: { fontSize: 11, color: '#666666', lineHeight: 16 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  infoTitle: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  infoText: { fontSize: 12, fontWeight: '700', color: '#333333', marginBottom: 2 },
  infoSub: { fontSize: 11, color: '#828282', marginBottom: 2 },
  infoContact: { fontSize: 11, color: '#0C831F', fontWeight: '700', marginTop: 6 },
  footerNote: { textAlign: 'center', fontSize: 11, color: '#9E9E9E', marginTop: 20, marginBottom: 16 }
});
