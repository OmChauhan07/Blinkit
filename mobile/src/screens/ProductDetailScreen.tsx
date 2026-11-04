import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, ShoppingCart, Zap } from 'lucide-react-native';

import { PRODUCTS } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export const ProductDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const productId = route?.params?.productId;
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const { getItemQuantity, addToCart, updateQuantity, isInWishlist, toggleWishlist, cart } = useStore();

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [{ weight: product.packWeight, price: product.price, mrp: product.mrp }];
  const activeVariant = variants[selectedVariantIdx] || variants[0];

  const quantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: headerTopPadding }]}>
        <View style={styles.topBarInner}>
          <TouchableOpacity
            onPress={() => (navigation.canGoBack?.() ? navigation.goBack() : navigation.navigate('HomeTab'))}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.topBarTitle}>{product.name}</Text>
          <View style={styles.topBarActions}>
            <TouchableOpacity
              onPress={() => toggleWishlist(product.id)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessible={true}
              accessibilityLabel="Toggle wishlist"
            >
              <Heart
                size={18}
                color={inWishlist ? '#E23744' : '#666666'}
                fill={inWishlist ? '#E23744' : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CartTab')}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessible={true}
              accessibilityLabel="View cart"
            >
              <ShoppingCart size={18} color="#1C1C1C" />
              {totalCartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image Box */}
        <View style={styles.imageBox}>
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}</Text>
            </View>
          )}
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Details Meta */}
        <View style={styles.metaBox}>
          <View style={styles.etaBadge}>
            <Zap size={11} color="#0C831F" fill="#0C831F" />
            <Text style={styles.etaText}>10 MINS DELIVERY</Text>
          </View>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.name}</Text>

          {/* Price Block */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{activeVariant.price}</Text>
            {activeVariant.mrp > activeVariant.price && (
              <Text style={styles.mrp}>MRP ₹{activeVariant.mrp}</Text>
            )}
            {product.discount && (
              <Text style={styles.discountTag}>({product.discount})</Text>
            )}
          </View>

          {/* Pack Weight / Variant Selector */}
          {variants.length > 1 && (
            <View style={styles.variantsSection}>
              <Text style={styles.variantsLabel}>Select Pack Size:</Text>
              <View style={styles.variantsRow}>
                {variants.map((v, i) => (
                  <TouchableOpacity
                    key={v.weight}
                    onPress={() => setSelectedVariantIdx(i)}
                    style={[
                      styles.variantChip,
                      selectedVariantIdx === i && styles.variantChipActive
                    ]}
                  >
                    <Text
                      style={[
                        styles.variantChipText,
                        selectedVariantIdx === i && styles.variantChipTextActive
                      ]}
                    >
                      {v.weight}
                    </Text>
                    <Text style={styles.variantPrice}>₹{v.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Description & Specs */}
        <View style={styles.specBox}>
          <Text style={styles.specHeading}>Product Details</Text>
          <Text style={styles.specDesc}>{product.description}</Text>

          <View style={styles.specTable}>
            {product.shelfLife && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Shelf Life</Text>
                <Text style={styles.specValue}>{product.shelfLife}</Text>
              </View>
            )}
            {product.manufacturer && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Manufacturer</Text>
                <Text style={styles.specValue}>{product.manufacturer}</Text>
              </View>
            )}
            {product.countryOfOrigin && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Country of Origin</Text>
                <Text style={styles.specValue}>{product.countryOfOrigin}</Text>
              </View>
            )}
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Category</Text>
              <Text style={styles.specValue}>{product.category} ({product.subcategory})</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomBarInner}>
          <View>
            <Text style={styles.bottomPrice}>₹{activeVariant.price}</Text>
            <Text style={styles.bottomPack}>{activeVariant.weight}</Text>
          </View>

          {quantity === 0 ? (
            <TouchableOpacity
              style={styles.addCta}
              onPress={() => addToCart(product, activeVariant.weight)}
              activeOpacity={0.8}
            >
              <Text style={styles.addCtaText}>ADD TO CART</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.bottomStepper}>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, -1)}
                style={styles.bottomStepBtn}
              >
                <Text style={styles.bottomStepText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.bottomQtyText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, 1)}
                style={styles.bottomStepBtn}
              >
                <Text style={styles.bottomStepText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  topBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  backBtn: {
    padding: 6,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBarTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#0C831F',
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900'
  },
  content: {
    padding: 16,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  imageBox: {
    width: '100%',
    height: 240,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative'
  },
  image: {
    width: 180,
    height: 180
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#E23744',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  metaBox: {
    marginBottom: 20
  },
  etaBadge: {
    backgroundColor: '#E8F8E7',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8
  },
  etaText: {
    color: '#0C831F',
    fontSize: 10,
    fontWeight: '800'
  },
  brand: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1C1C1C',
    marginVertical: 4,
    lineHeight: 24
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 6,
    marginBottom: 14
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1C1C1C'
  },
  mrp: {
    fontSize: 14,
    color: '#828282',
    textDecorationLine: 'line-through'
  },
  discountTag: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0C831F'
  },
  variantsSection: {
    marginTop: 8
  },
  variantsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 8
  },
  variantsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  variantChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    backgroundColor: '#FFFFFF'
  },
  variantChipActive: {
    borderColor: '#0C831F',
    backgroundColor: '#F7FCF8'
  },
  variantChipText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600'
  },
  variantChipTextActive: {
    color: '#0C831F',
    fontWeight: '800'
  },
  variantPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1C',
    marginTop: 2
  },
  specBox: {
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingTop: 16
  },
  specHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 8
  },
  specDesc: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 14
  },
  specTable: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    gap: 8
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDED'
  },
  specLabel: {
    fontSize: 12,
    color: '#828282',
    fontWeight: '600'
  },
  specValue: {
    fontSize: 12,
    color: '#1C1C1C',
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingTop: 10
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1C1C1C'
  },
  bottomPack: {
    fontSize: 11,
    color: '#828282'
  },
  addCta: {
    backgroundColor: '#0C831F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10
  },
  addCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  bottomStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C831F',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 44
  },
  bottomStepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomStepText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  bottomQtyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    paddingHorizontal: 12
  }
});
