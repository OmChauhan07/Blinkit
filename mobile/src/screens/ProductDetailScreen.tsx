import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { PRODUCTS } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export const ProductDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { productId } = route.params;
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const { getItemQuantity, addToCart, updateQuantity } = useStore();

  const quantity = getItemQuantity(product.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.topBarTitle}>{product.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Image */}
        <View style={styles.imageBox}>
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}</Text>
            </View>
          )}
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Details */}
        <View style={styles.metaBox}>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>⚡ 10 MINS DELIVERY</Text>
          </View>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.weight}>{product.packWeight}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.mrp > product.price && (
              <Text style={styles.mrp}>MRP ₹{product.mrp}</Text>
            )}
            {product.discount && (
              <Text style={styles.discountTag}>({product.discount})</Text>
            )}
          </View>
        </View>

        {/* Description & Specs */}
        <View style={styles.specBox}>
          <Text style={styles.specHeading}>Product Details</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Shelf Life</Text>
            <Text style={styles.specValue}>{product.shelfLife || 'Check pack'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Manufacturer</Text>
            <Text style={styles.specValue}>{product.manufacturer || 'Certified'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Origin</Text>
            <Text style={styles.specValue}>{product.countryOfOrigin || 'India'}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Buy Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>₹{product.price}</Text>
          <Text style={styles.bottomTax}>(Incl. of all taxes)</Text>
        </View>

        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(product)}
          >
            <Text style={styles.addText}>ADD TO CART</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => updateQuantity(product.id, -1)} style={styles.stepBtn}>
              <Text style={styles.stepText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepQty}>{quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(product.id, 1)} style={styles.stepBtn}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ECEFF1' },
  backBtn: { padding: 4 },
  backText: { fontSize: 20, fontWeight: '800' },
  topBarTitle: { flex: 1, fontSize: 14, fontWeight: '700', marginHorizontal: 12 },
  cartIcon: { fontSize: 20 },
  content: { padding: 16 },
  imageBox: { height: 260, backgroundColor: '#F8F9FA', borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 16 },
  image: { width: 200, height: 200 },
  discountBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#E23744', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  metaBox: { borderBottomWidth: 1, borderBottomColor: '#ECEFF1', paddingBottom: 16, marginBottom: 16 },
  etaBadge: { backgroundColor: '#F4F6FB', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginBottom: 6 },
  etaText: { color: '#0C831F', fontSize: 10, fontWeight: '800' },
  brand: { fontSize: 11, color: '#828282', fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 18, fontWeight: '900', color: '#1C1C1C', marginTop: 2, marginBottom: 4 },
  weight: { fontSize: 13, color: '#666666', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { fontSize: 22, fontWeight: '900', color: '#1C1C1C' },
  mrp: { fontSize: 13, color: '#828282', textDecorationLine: 'line-through' },
  discountTag: { fontSize: 13, color: '#E23744', fontWeight: '700' },
  specBox: { backgroundColor: '#F8F9FA', padding: 14, borderRadius: 12 },
  specHeading: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  description: { fontSize: 12, color: '#555555', lineHeight: 18, marginBottom: 12 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#ECEFF1' },
  specLabel: { fontSize: 12, color: '#666666' },
  specValue: { fontSize: 12, fontWeight: '700', color: '#1C1C1C' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#ECEFF1', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 10 },
  bottomPrice: { fontSize: 20, fontWeight: '900', color: '#1C1C1C' },
  bottomTax: { fontSize: 10, color: '#828282' },
  addButton: { backgroundColor: '#0C831F', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
  addText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  stepper: { backgroundColor: '#0C831F', borderRadius: 10, flexDirection: 'row', alignItems: 'center', width: 110, height: 42, justifyContent: 'space-between', paddingHorizontal: 10 },
  stepBtn: { padding: 4 },
  stepText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  stepQty: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' }
});
