import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { selectedAddress, cart, grandTotal } = useStore();

  const dairyProducts = PRODUCTS.filter((p) => p.category === 'dairy-bread-eggs');
  const munchiesProducts = PRODUCTS.filter((p) => p.category === 'munchies');
  const drinksProducts = PRODUCTS.filter((p) => p.category === 'cold-drinks-juices');

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Mobile Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandBlink}>blink</Text>
            <Text style={styles.brandIt}>it</Text>
          </View>

          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => navigation.navigate('LocationSheet')}
          >
            <View style={styles.etaRow}>
              <Text style={styles.etaLightning}>⚡</Text>
              <Text style={styles.etaText}>10 MINUTES</Text>
            </View>
            <Text numberOfLines={1} style={styles.addressText}>
              {selectedAddress.houseNo}, {selectedAddress.city} ▼
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileText}>O</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Search')}
          style={styles.searchBar}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search "milk", "chips", "curd"...</Text>
          <Text style={styles.micIcon}>🎙️</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Promotional Campaign Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>⚡ 10 MINUTE DELIVERY</Text>
          </View>
          <Text style={styles.bannerTitle}>Pharmacy & Daily Groceries at your Doorstep</Text>
          <Text style={styles.bannerSubtitle}>Fresh fruits, farm dairy & snacks in 10-12 mins</Text>
          <TouchableOpacity
            style={styles.bannerCta}
            onPress={() => navigation.navigate('Category', { slug: 'dairy-bread-eggs' })}
          >
            <Text style={styles.bannerCtaText}>Shop Now →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Horizontal Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}>
            <Text style={styles.seeAllText}>See all →</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('Category', { slug: 'dairy-bread-eggs' })}>
            <Text style={styles.seeAllText}>See all</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('Category', { slug: 'munchies' })}>
            <Text style={styles.seeAllText}>See all</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('Category', { slug: 'cold-drinks-juices' })}>
            <Text style={styles.seeAllText}>See all</Text>
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
            onPress={() => navigation.navigate('Cart')}
          >
            <View>
              <Text style={styles.cartItemsCount}>
                {totalCartCount} {totalCartCount === 1 ? 'ITEM' : 'ITEMS'}
              </Text>
              <Text style={styles.cartTotalText}>₹{grandTotal} (plus taxes)</Text>
            </View>
            <View style={styles.viewCartButton}>
              <Text style={styles.viewCartText}>View Cart →</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
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
    gap: 2
  },
  etaLightning: {
    fontSize: 12,
    color: '#F8CB46'
  },
  etaText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1C1C1C'
  },
  addressText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500'
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#828282'
  },
  micIcon: {
    fontSize: 16
  },
  scrollContent: {
    padding: 16
  },
  bannerContainer: {
    backgroundColor: '#F8CB46',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20
  },
  bannerBadge: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
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
    fontSize: 18,
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
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0C831F'
  },
  categoriesScroll: {
    marginBottom: 20
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 68
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
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
