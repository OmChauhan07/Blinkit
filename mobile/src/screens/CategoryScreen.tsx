import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const CategoryScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const slug = route.params?.slug || 'dairy-bread-eggs';
  const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[1];

  const [activeSubcategory, setActiveSubcategory] = useState(category.subcategories[0]);

  let filtered = PRODUCTS.filter((p) => p.category === category.slug);
  if (activeSubcategory && activeSubcategory !== 'All') {
    filtered = filtered.filter((p) =>
      p.subcategory.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
      activeSubcategory.toLowerCase().includes(p.subcategory.toLowerCase())
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Category Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>{category.name}</Text>
          <Text style={styles.headerSub}>⚡ 10-12 mins to your location</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainLayout}>
        {/* Left Subcategory Rail */}
        <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
          {category.subcategories.map((sub) => {
            const isActive = activeSubcategory === sub;
            return (
              <TouchableOpacity
                key={sub}
                onPress={() => setActiveSubcategory(sub)}
                style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
              >
                <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
                  {sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Right Product Grid */}
        <ScrollView style={styles.productFeed} contentContainerStyle={styles.feedContent}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>{activeSubcategory}</Text>
            <Text style={styles.itemCount}>{filtered.length} products</Text>
          </View>

          <View style={styles.grid}>
            {filtered.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 20, fontWeight: '700', color: '#1C1C1C' },
  headerTitleBox: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  headerSub: { fontSize: 11, color: '#0C831F', fontWeight: '600' },
  searchIcon: { fontSize: 18 },
  mainLayout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 90, backgroundColor: '#F8F9FA', borderRightWidth: 1, borderRightColor: '#ECEFF1' },
  sidebarItem: { paddingVertical: 14, paddingHorizontal: 8, borderLeftWidth: 3, borderLeftColor: 'transparent' },
  sidebarItemActive: { backgroundColor: '#FFFFFF', borderLeftColor: '#0C831F' },
  sidebarText: { fontSize: 11, color: '#666666', fontWeight: '600', textAlign: 'center' },
  sidebarTextActive: { color: '#0C831F', fontWeight: '800' },
  productFeed: { flex: 1, backgroundColor: '#F4F6FB' },
  feedContent: { padding: 12 },
  feedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  feedTitle: { fontSize: 14, fontWeight: '800', color: '#1C1C1C' },
  itemCount: { fontSize: 11, color: '#828282' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});
