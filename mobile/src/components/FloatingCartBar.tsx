import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

interface FloatingCartBarProps {
  bottomOffset?: number;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ bottomOffset = 12 }) => {
  const { cart, grandTotal, setIsCartDrawerOpen } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalCartCount === 0) return null;

  return (
    <View style={[styles.floatingCartContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.floatingCart}
        activeOpacity={0.9}
        onPress={() => setIsCartDrawerOpen(true)}
        accessible={true}
        accessibilityLabel={`View cart, ${totalCartCount} items, total ₹${grandTotal}`}
      >
        <View style={styles.cartInfoCol}>
          <Text style={styles.cartItemsCount} numberOfLines={1}>
            {totalCartCount} {totalCartCount === 1 ? 'ITEM' : 'ITEMS'}
          </Text>
          <Text style={styles.cartTotalText} numberOfLines={1}>
            ₹{grandTotal} <Text style={styles.plusTaxesText}>(plus taxes)</Text>
          </Text>
        </View>

        <View style={styles.viewCartButton}>
          <Text style={styles.viewCartText}>View Cart</Text>
          <ArrowRight size={15} color="#FFFFFF" style={{ marginLeft: 5 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingCartContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 99,
    elevation: 8
  },
  floatingCart: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#0C831F',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0C831F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  cartInfoCol: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center'
  },
  cartItemsCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    opacity: 0.95,
    marginBottom: 2
  },
  cartTotalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  plusTaxesText: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.85
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  viewCartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});

export default FloatingCartBar;

