import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useStore();
  const quantity = getItemQuantity(product.id);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      {/* Product Image & Badges */}
      <View style={styles.imageContainer}>
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        )}
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>

      {/* Meta */}
      <View style={styles.content}>
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>⚡ {product.eta || '10 MINS'}</Text>
        </View>

        <Text numberOfLines={2} style={styles.title}>
          {product.name}
        </Text>
        <Text style={styles.weight}>{product.packWeight}</Text>

        {/* Price & Stepper */}
        <View style={styles.footer}>
          <View>
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
            >
              <Text style={styles.addText}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => updateQuantity(product.id, -1)} style={styles.stepBtn}>
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(product.id, 1)} style={styles.stepBtn}>
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
    width: '48%',
    marginBottom: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8
  },
  image: {
    width: 100,
    height: 100
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
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  etaBadge: {
    backgroundColor: '#F4F6FB',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
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
    minHeight: 32
  },
  weight: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
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
    width: 64,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#0C831F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  stepBtn: {
    width: 18,
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
