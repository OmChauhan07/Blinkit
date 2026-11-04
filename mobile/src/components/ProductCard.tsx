import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, Heart, Zap } from 'lucide-react-native';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style }) => {
  const {
    getItemQuantity,
    addToCart,
    updateQuantity,
    isInWishlist,
    toggleWishlist,
    setQuickViewProduct
  } = useStore();

  const quantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, style]}>
      {/* Product Image & Badges */}
      <View style={styles.imageContainer}>
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        )}
        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.actionCircle}
            onPress={(e) => {
              e.stopPropagation?.();
              setQuickViewProduct(product);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityLabel="Quick view"
          >
            <Eye size={13} color="#4A5568" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCircle}
            onPress={(e) => {
              e.stopPropagation?.();
              toggleWishlist(product.id);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityLabel="Toggle wishlist"
          >
            <Heart
              size={13}
              color={inWishlist ? '#E23744' : '#718096'}
              fill={inWishlist ? '#E23744' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>

      {/* Meta */}
      <View style={styles.content}>
        <View style={styles.etaBadge}>
          <Zap size={9} color="#0C831F" fill="#0C831F" />
          <Text style={styles.etaText}>{product.eta || '10 MINS'}</Text>
        </View>

        <Text numberOfLines={2} style={styles.title}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={styles.weight}>{product.packWeight}</Text>

        {/* Price & Stepper */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.mrp > product.price && (
              <Text style={styles.mrp}>₹{product.mrp}</Text>
            )}
          </View>

          {quantity === 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => addToCart(product)}
              style={styles.addButton}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessible={true}
              accessibilityLabel={`Add ${product.name} to cart`}
            >
              <Text style={styles.addText}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, -1)}
                style={styles.stepBtn}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessible={true}
                accessibilityLabel="Decrease quantity"
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, 1)}
                style={styles.stepBtn}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessible={true}
                accessibilityLabel="Increase quantity"
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    padding: 10,
    width: '48.5%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  imageContainer: {
    width: '100%',
    height: 105,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6
  },
  image: {
    width: 85,
    height: 85
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#E23744',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  topActionsRow: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    gap: 4,
    zIndex: 10
  },
  actionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    paddingTop: 2
  },
  etaBadge: {
    backgroundColor: '#F4F6FB',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4
  },
  etaText: {
    color: '#0C831F',
    fontSize: 9,
    fontWeight: '800'
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1C',
    lineHeight: 16,
    height: 32,
    marginBottom: 2
  },
  weight: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0EDED'
  },
  priceContainer: {
    flexDirection: 'column'
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  mrp: {
    fontSize: 10,
    color: '#828282',
    textDecorationLine: 'line-through'
  },
  addButton: {
    width: 64,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0C831F',
    backgroundColor: '#F7FCF8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addText: {
    color: '#0C831F',
    fontSize: 12,
    fontWeight: '800'
  },
  stepper: {
    width: 68,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#0C831F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  stepBtn: {
    width: 20,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  }
});
