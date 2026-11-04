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
import { ArrowLeft, Heart } from 'lucide-react-native';

import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { FloatingCartBar } from '../components/FloatingCartBar';

export const WishlistScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { wishlistIds } = useStore();

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wishlist ({wishlistProducts.length})</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {wishlistProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={48} color="#E23744" fill="#E23744" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySub}>
              Save items you love so you can quickly add them to your 10-minute grocery cart anytime!
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <Text style={styles.browseBtnText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {wishlistProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
              />
            ))}
          </View>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Bottom Cart Checkout Bar */}
      <FloatingCartBar bottomOffset={12} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB'
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  content: {
    padding: 16,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 8
  },
  emptySub: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24
  },
  browseBtn: {
    backgroundColor: '#0C831F',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  }
});
