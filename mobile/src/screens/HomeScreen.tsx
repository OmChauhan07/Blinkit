import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Zap,
  Search,
  Mic,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  User
} from 'lucide-react-native';

import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    selectedAddress,
    cart,
    grandTotal,
    user,
    setIsLocationModalOpen,
    setIsLoginModalOpen,
    setIsCartDrawerOpen
  } = useStore();

  const dairyProducts = PRODUCTS.filter((p) => p.category === 'dairy-bread-eggs');
  const munchiesProducts = PRODUCTS.filter((p) => p.category === 'munchies');
  const drinksProducts = PRODUCTS.filter((p) => p.category === 'cold-drinks-juices');

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Status bar inset padding to prevent overlapping network/carrier/battery info bar
  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Mobile Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandBlink}>blink</Text>
              <Text style={styles.brandIt}>it</Text>
            </View>

            <TouchableOpacity
              style={styles.locationSelector}
              onPress={() => setIsLocationModalOpen(true)}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Select delivery location"
            >
              <View style={styles.etaRow}>
                <Zap size={12} color="#F8CB46" fill="#F8CB46" />
                <Text style={styles.etaText}>10 MINUTES</Text>
              </View>
              <View style={styles.addressRow}>
                <Text numberOfLines={1} style={styles.addressText}>
                  {selectedAddress.houseNo || selectedAddress.apartmentRoad || 'Deliver to'}, {selectedAddress.city}
                </Text>
                <ChevronDown size={13} color="#666666" style={{ marginLeft: 3 }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => (user.isLoggedIn ? navigation.navigate('Profile') : setIsLoginModalOpen(true))}
              accessible={true}
              accessibilityLabel="User profile"
            >
              {user.isLoggedIn && user.name ? (
                <Text style={styles.profileText}>{user.name[0].toUpperCase()}</Text>
              ) : (
                <User size={16} color="#1C1C1C" />
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('SearchTab')}
            style={styles.searchBar}
            accessible={true}
            accessibilityLabel="Search products"
          >
            <Search size={17} color="#0C831F" style={{ marginRight: 8 }} />
            <Text style={styles.searchPlaceholder}>Search "milk", "chips", "curd"...</Text>
            <Mic size={17} color="#0C831F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Promotional Campaign Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerBadge}>
            <Zap size={10} color="#0C831F" fill="#0C831F" />
            <Text style={styles.bannerBadgeText}>10 MINUTE DELIVERY</Text>
          </View>
          <Text style={styles.bannerTitle}>Pharmacy & Daily Groceries at your Doorstep</Text>
          <Text style={styles.bannerSubtitle}>Fresh fruits, farm dairy & snacks in 10-12 mins</Text>
          <TouchableOpacity
            style={styles.bannerCta}
            onPress={() => navigation.navigate('Category', { slug: 'dairy-bread-eggs' })}
          >
            <Text style={styles.bannerCtaText}>Shop Now</Text>
            <ArrowRight size={13} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Categories Horizontal Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('CategoriesTab')}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color="#0C831F" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => navigation.navigate('Category', { slug: cat.slug })}
            >
              <View style={styles.categoryIconCircle}>
                <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="contain" />
              </View>
              <Text numberOfLines={1} style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Shelf: Dairy, Bread & Eggs */}
        <View style={styles.shelfHeader}>
          <View>
            <Text style={styles.shelfTitle}>Dairy, Bread & Eggs</Text>
            <Text style={styles.shelfSubtitle}>Fresh milk, butter & breakfast items</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Category', { slug: 'dairy-bread-eggs' })}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color="#0C831F" />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {dairyProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
            />
          ))}
        </View>

        {/* Shelf: Munchies & Chips */}
        <View style={styles.shelfHeader}>
          <View>
            <Text style={styles.shelfTitle}>Munchies & Snacks</Text>
            <Text style={styles.shelfSubtitle}>Crispy chips, namkeen & late night cravings</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Category', { slug: 'munchies' })}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color="#0C831F" />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {munchiesProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
            />
          ))}
        </View>

        {/* Shelf: Cold Drinks */}
        <View style={styles.shelfHeader}>
          <View>
            <Text style={styles.shelfTitle}>Cold Drinks & Juices</Text>
            <Text style={styles.shelfSubtitle}>Chilled sodas, fruit juices & thirst quenchers</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Category', { slug: 'cold-drinks-juices' })}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color="#0C831F" />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {drinksProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
            />
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Bottom Cart Checkout Bar */}
      {totalCartCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity
            style={styles.floatingCart}
            activeOpacity={0.9}
            onPress={() => setIsCartDrawerOpen(true)}
          >
            <View>
              <Text style={styles.cartItemsCount}>
                {totalCartCount} {totalCartCount === 1 ? 'ITEM' : 'ITEMS'}
              </Text>
              <Text style={styles.cartTotalText}>₹{grandTotal} (plus taxes)</Text>
            </View>
            <View style={styles.viewCartButton}>
              <Text style={styles.viewCartText}>View Cart</Text>
              <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  headerInner: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandBlink: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8CB46'
  },
  brandIt: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0C831F'
  },
  locationSelector: {
    flex: 1,
    marginHorizontal: 12
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  etaText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1C1C1C'
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1
  },
  addressText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
    maxWidth: 180
  },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8CB46',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileText: {
    fontWeight: '800',
    fontSize: 14,
    color: '#1C1C1C'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#828282'
  },
  scrollContent: {
    padding: 16,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  bannerContainer: {
    backgroundColor: '#F8CB46',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18
  },
  bannerBadge: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8
  },
  bannerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0C831F'
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1C1C1C',
    lineHeight: 22,
    marginBottom: 4
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 12
  },
  bannerCta: {
    backgroundColor: '#0C831F',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  bannerCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0C831F'
  },
  categoriesScroll: {
    marginBottom: 18
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 68
  },
  categoryIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    padding: 6
  },
  categoryImage: {
    width: '100%',
    height: '100%'
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1C1C1C',
    textAlign: 'center'
  },
  shelfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  shelfTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  shelfSubtitle: {
    fontSize: 11,
    color: '#666666',
    marginTop: 1
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
    zIndex: 50
  },
  floatingCart: {
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
  cartItemsCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.9
  },
  cartTotalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  viewCartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
