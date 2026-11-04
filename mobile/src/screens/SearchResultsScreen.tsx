import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowUpDown
} from 'lucide-react-native';

import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

const RECENT_SEARCHES = ['Amul Milk', 'Harvest Bread', 'Farm Eggs', 'Lays Chips', 'Coca Cola', 'Cadbury', 'Butter', 'Curd'];

export const SearchResultsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { searchQuery, setSearchQuery, sortBy, selectedBrands, setIsFilterDrawerOpen } = useStore();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q);

      const matchesFilter =
        activeCategoryFilter === 'All' ||
        (activeCategoryFilter === 'Dairy' && p.category === 'dairy-bread-eggs') ||
        (activeCategoryFilter === 'Snacks' && p.category === 'munchies') ||
        (activeCategoryFilter === 'Drinks' && p.category === 'cold-drinks-juices') ||
        (activeCategoryFilter === 'Sweets' && p.category === 'sweet-tooth');

      const matchesBrand =
        !selectedBrands || selectedBrands.length === 0 || selectedBrands.includes(p.brand);

      return matchesQuery && matchesFilter && matchesBrand;
    });

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
  }, [searchQuery, activeCategoryFilter, selectedBrands, sortBy]);

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Search Bar */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack?.() ? navigation.goBack() : navigation.navigate('HomeTab'))}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#1C1C1C" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Search size={16} color="#0C831F" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search 'milk', 'chips', 'bread'..."
            placeholderTextColor="#828282"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessible={true}
              accessibilityLabel="Clear search"
            >
              <X size={14} color="#828282" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsFilterDrawerOpen(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessible={true}
          accessibilityLabel="Filter and sort"
        >
          <SlidersHorizontal size={18} color="#1C1C1C" />
          {(selectedBrands.length > 0 || sortBy !== 'relevance') && (
            <View style={styles.filterBadgeDot} />
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Chips Bar */}
      <View style={styles.filtersBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
          {['All', 'Dairy', 'Snacks', 'Drinks', 'Sweets'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveCategoryFilter(f)}
              style={[styles.filterChip, activeCategoryFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, activeCategoryFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trending Searches Tags */}
        {!searchQuery && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionHeading}>Trending Searches</Text>
            <View style={styles.tagsRow}>
              {RECENT_SEARCHES.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() => setSearchQuery(tag)}
                >
                  <ArrowUpRight size={13} color="#0C831F" />
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {searchQuery ? `Showing results for "${searchQuery}"` : 'Popular Products'}
          </Text>
          <TouchableOpacity
            style={styles.sortIndicator}
            onPress={() => setIsFilterDrawerOpen(true)}
          >
            <ArrowUpDown size={12} color="#374151" style={{ marginRight: 4 }} />
            <Text style={styles.sortIndicatorText}>
              {sortBy === 'relevance' ? 'Sort' : sortBy.replace(/_/g, ' ')}
            </Text>
          </TouchableOpacity>
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Search size={36} color="#9CA3AF" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No matching products</Text>
            <Text style={styles.emptySub}>
              We couldn't find anything matching "{searchQuery}". Try searching for milk, bread, chips, or eggs.
            </Text>
            <TouchableOpacity style={styles.clearSearchCta} onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchCtaText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    gap: 8
  },
  backBtn: {
    padding: 6,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1C1C1C'
  },
  clearBtn: {
    padding: 6,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  filterBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0C831F'
  },
  filtersBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    paddingVertical: 8
  },
  filterChipsRow: {
    paddingHorizontal: 16,
    gap: 8
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F4F6FB',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    minHeight: 36,
    justifyContent: 'center'
  },
  filterChipActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#0C831F'
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280'
  },
  filterChipTextActive: {
    color: '#0C831F',
    fontWeight: '800'
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  recentSection: {
    marginBottom: 16
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 10
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  sortIndicator: {
    backgroundColor: '#F4F6FB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1'
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
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  clearSearchCta: {
    backgroundColor: '#0C831F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },
  clearSearchCtaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  }
});
