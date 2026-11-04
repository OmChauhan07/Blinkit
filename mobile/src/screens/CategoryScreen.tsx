import React, { useState, useMemo, useEffect } from 'react';
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
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Zap,
  ArrowUpDown
} from 'lucide-react-native';

import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { useStore } from '../context/StoreContext';

export const CategoryScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const slug = route.params?.slug || 'dairy-bread-eggs';
  const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[1];
  const { sortBy, selectedBrands, setIsFilterDrawerOpen } = useStore();

  const [activeSubcategory, setActiveSubcategory] = useState(category.subcategories[0]);

  useEffect(() => {
    setActiveSubcategory(category.subcategories[0]);
  }, [category.slug]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.category === category.slug);

    if (activeSubcategory && activeSubcategory !== 'All' && !activeSubcategory.startsWith('All ')) {
      list = list.filter((p) =>
        p.subcategory.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
        activeSubcategory.toLowerCase().includes(p.subcategory.toLowerCase())
      );
    }

    if (selectedBrands && selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    const sorted = [...list];
    if (sortBy === 'price_low_high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high_low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_high') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'discount_high') {
      sorted.sort((a, b) => {
        const da = parseInt(a.discount?.replace(/\D/g, '') || '0', 10);
        const db = parseInt(b.discount?.replace(/\D/g, '') || '0', 10);
        return db - da;
      });
    }

    return sorted;
  }, [category.slug, activeSubcategory, selectedBrands, sortBy]);

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Category Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => (navigation.canGoBack?.() ? navigation.goBack() : navigation.navigate('HomeTab'))}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text numberOfLines={1} style={styles.headerTitle}>{category.name}</Text>
            <View style={styles.etaRow}>
              <Zap size={11} color="#0C831F" fill="#0C831F" />
              <Text style={styles.headerSub}>10-12 mins to your location</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setIsFilterDrawerOpen(true)}
              style={styles.filterBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessible={true}
              accessibilityLabel="Filter and sort"
            >
              <SlidersHorizontal size={18} color="#1C1C1C" />
              {(selectedBrands.length > 0 || sortBy !== 'relevance') && (
                <View style={styles.filterBadgeDot} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('SearchTab')}
              style={styles.searchBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessible={true}
              accessibilityLabel="Search"
            >
              <Search size={18} color="#1C1C1C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Categories Pills Bar */}
      <View style={styles.categoryPillsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPillsRow}>
          {CATEGORIES.map((cat) => {
            const isCatActive = cat.slug === category.slug;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  navigation.setParams({ slug: cat.slug });
                  setActiveSubcategory(cat.subcategories[0]);
                }}
                style={[styles.catPill, isCatActive && styles.catPillActive]}
              >
                <Text style={[styles.catPillText, isCatActive && styles.catPillTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Subcategory Filter Chips Bar (Like Search Section) */}
      <View style={styles.subcategoriesBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subcategoriesRow}>
          {category.subcategories.map((sub) => {
            const isActive = activeSubcategory === sub;
            return (
              <TouchableOpacity
                key={sub}
                onPress={() => setActiveSubcategory(sub)}
                style={[styles.subChip, isActive && styles.subChipActive]}
              >
                <Text style={[styles.subChipText, isActive && styles.subChipTextActive]}>
                  {sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Full-Width Product Grid (Proper 2-column layout like Search) */}
      <ScrollView style={styles.productFeed} contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        <View style={styles.feedHeader}>
          <View>
            <Text style={styles.feedTitle}>{activeSubcategory}</Text>
            <Text style={styles.itemCount}>{filtered.length} products</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsFilterDrawerOpen(true)}
            style={styles.sortIndicatorPill}
          >
            <ArrowUpDown size={12} color="#374151" style={{ marginRight: 4 }} />
            <Text style={styles.sortIndicatorText}>
              {sortBy === 'relevance' ? 'Sort' : sortBy.replace(/_/g, ' ')}
            </Text>
          </TouchableOpacity>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>Try clearing active brand filters or sorting</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
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
    backgroundColor: '#FFFFFF'
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  headerInner: {
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
    marginRight: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitleBox: {
    flex: 1,
    marginRight: 8
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2
  },
  headerSub: {
    fontSize: 11,
    color: '#0C831F',
    fontWeight: '700'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6FB',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterBadgeDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#0C831F'
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryPillsBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 8
  },
  categoryPillsRow: {
    paddingHorizontal: 16,
    gap: 8
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F4F6FB',
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  catPillActive: {
    backgroundColor: '#0C831F',
    borderColor: '#0C831F'
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563'
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  subcategoriesBar: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    paddingVertical: 8
  },
  subcategoriesRow: {
    paddingHorizontal: 16,
    gap: 8
  },
  subChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  subChipActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#0C831F'
  },
  subChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280'
  },
  subChipTextActive: {
    color: '#0C831F',
    fontWeight: '800'
  },
  productFeed: {
    flex: 1,
    backgroundColor: '#F4F6FB'
  },
  feedContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  itemCount: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2
  },
  sortIndicatorPill: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  sortIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'capitalize'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 6
  },
  emptySub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center'
  }
});
