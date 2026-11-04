import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Zap, ArrowRight, X } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme';

export const QuickProductModal: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    getItemQuantity,
    addToCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet, width } = useResponsive();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  if (!quickViewProduct) return null;

  const quantity = getItemQuantity(quickViewProduct.id);
  const inWishlist = isInWishlist(quickViewProduct.id);
  const variants = quickViewProduct.variants && quickViewProduct.variants.length > 0
    ? quickViewProduct.variants
    : [{ weight: quickViewProduct.packWeight, price: quickViewProduct.price, mrp: quickViewProduct.mrp }];
  const activeVariant = variants[selectedVariantIdx] || variants[0];

  const handleOpenDetails = () => {
    const pId = quickViewProduct.id;
    setQuickViewProduct(null);
    if (navigation?.navigate) {
      navigation.navigate('ProductDetail', { productId: pId });
    }
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setQuickViewProduct(null)}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => setQuickViewProduct(null)} />

        <View
          style={[
            styles.sheetContainer,
            isTablet && styles.tabletDialog,
            { paddingBottom: Math.max(insets.bottom, 16) }
          ]}
        >
          {/* Header Bar */}
          <View style={styles.topHandleBar}>
            <View style={styles.dragPill} />
            <TouchableOpacity
              onPress={() => setQuickViewProduct(null)}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessible={true}
              accessibilityLabel="Close modal"
            >
              <X size={18} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Image Preview Box */}
            <View style={styles.imageBox}>
              {quickViewProduct.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{quickViewProduct.discount}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.wishlistBtn}
                onPress={() => toggleWishlist(quickViewProduct.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessible={true}
                accessibilityLabel="Toggle wishlist"
              >
                <Heart
                  size={16}
                  color={inWishlist ? '#E23744' : '#718096'}
                  fill={inWishlist ? '#E23744' : 'transparent'}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: quickViewProduct.image }}
                style={styles.productImg}
                resizeMode="contain"
              />
            </View>

            {/* Product Meta */}
            <View style={styles.metaBox}>
              <View style={styles.etaPill}>
                <Zap size={11} color="#0C831F" fill="#0C831F" />
                <Text style={styles.etaText}>{quickViewProduct.eta || '10 MINS'} DELIVERY</Text>
              </View>
              <Text style={styles.brandText}>{quickViewProduct.brand}</Text>
              <Text style={styles.nameText}>{quickViewProduct.name}</Text>

              {/* Price Row */}
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{activeVariant.price}</Text>
                {activeVariant.mrp > activeVariant.price && (
                  <Text style={styles.mrp}>₹{activeVariant.mrp}</Text>
                )}
                {quickViewProduct.discount && (
                  <Text style={styles.discountHighlight}>({quickViewProduct.discount})</Text>
                )}
              </View>

              {/* Pack Sizes / Variants */}
              {variants.length > 1 && (
                <View style={styles.variantsBox}>
                  <Text style={styles.variantHeading}>Select Pack Size:</Text>
                  <View style={styles.variantChipsRow}>
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
                        <Text style={styles.variantChipPrice}>₹{v.price}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Description */}
              {quickViewProduct.description && (
                <Text style={styles.descText} numberOfLines={3}>
                  {quickViewProduct.description}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Bottom Actions Footer */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.detailsBtn} onPress={handleOpenDetails}>
              <Text style={styles.detailsBtnText}>View Full Details</Text>
              <ArrowRight size={13} color="#0C831F" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {quantity === 0 ? (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => addToCart(quickViewProduct, activeVariant.weight)}
              >
                <Text style={styles.addBtnText}>ADD TO CART</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(quickViewProduct.id, -1)}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(quickViewProduct.id, 1)}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 16
  },
  tabletDialog: {
    maxWidth: 520,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  topHandleBar: {
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative'
  },
  dragPill: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DDE2E5'
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 6,
    padding: 6
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  imageBox: {
    width: '100%',
    height: 180,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16
  },
  productImg: {
    width: 140,
    height: 140
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
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
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  metaBox: {
    paddingHorizontal: 4
  },
  etaPill: {
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
  brandText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  nameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1C1C',
    marginVertical: 4
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
    marginBottom: 12
  },
  price: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1C1C1C'
  },
  mrp: {
    fontSize: 13,
    color: '#828282',
    textDecorationLine: 'line-through'
  },
  discountHighlight: {
    fontSize: 12,
    color: '#0C831F',
    fontWeight: '700'
  },
  variantsBox: {
    marginVertical: 10
  },
  variantHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 8
  },
  variantChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  variantChip: {
    borderWidth: 1,
    borderColor: '#ECEFF1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  variantChipPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1C',
    marginTop: 2
  },
  descText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginTop: 8
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    backgroundColor: '#FFFFFF',
    gap: 12
  },
  detailsBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0C831F'
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#0C831F',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  stepper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0C831F',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 44
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  qtyText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14
  }
});
