import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance (Popularity)' },
  { id: 'price_low_high', label: 'Price: Low to High' },
  { id: 'price_high_low', label: 'Price: High to Low' },
  { id: 'discount_high', label: 'Discount: High to Low' },
  { id: 'rating_high', label: 'Top Customer Rated' }
];

const BRANDS_LIST = [
  'Amul',
  'Mother Dairy',
  'Harvest Gold',
  "Lay's",
  "Haldiram's",
  'Cadbury',
  'Coca-Cola',
  'Real',
  'Pringles'
];

export const FilterSortDrawer: React.FC = () => {
  const {
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    sortBy,
    setSortBy,
    selectedBrands,
    setSelectedBrands
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();
  const [localSort, setLocalSort] = useState(sortBy);
  const [localBrands, setLocalBrands] = useState<string[]>(selectedBrands);

  useEffect(() => {
    setLocalSort(sortBy);
    setLocalBrands(selectedBrands);
  }, [isFilterDrawerOpen, sortBy, selectedBrands]);

  if (!isFilterDrawerOpen) return null;

  const toggleBrand = (b: string) => {
    setLocalBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const handleApply = () => {
    setSortBy(localSort);
    setSelectedBrands(localBrands);
    setIsFilterDrawerOpen(false);
  };

  const handleReset = () => {
    setLocalSort('relevance');
    setLocalBrands([]);
    setSortBy('relevance');
    setSelectedBrands([]);
    setIsFilterDrawerOpen(false);
  };

  const handleClose = () => {
    setIsFilterDrawerOpen(false);
  };

  return (
    <Modal
      visible={isFilterDrawerOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            isTablet && styles.tabletDialog,
            { paddingBottom: Math.max(insets.bottom, 16) }
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <SlidersHorizontal size={20} color="#0C831F" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Filter & Sort</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Sort Section */}
            <Text style={styles.sectionTitle}>SORT PRODUCTS BY</Text>
            <View style={styles.optionsList}>
              {SORT_OPTIONS.map((opt) => {
                const isSelected = localSort === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setLocalSort(opt.id)}
                    style={[styles.sortItem, isSelected && styles.sortItemActive]}
                  >
                    <Text style={[styles.sortItemText, isSelected && styles.sortItemTextActive]}>
                      {opt.label}
                    </Text>
                    <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Brands Filter Section */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>FILTER BY BRAND</Text>
            <View style={styles.brandsGrid}>
              {BRANDS_LIST.map((b) => {
                const isChecked = localBrands.includes(b);
                return (
                  <TouchableOpacity
                    key={b}
                    onPress={() => toggleBrand(b)}
                    style={[styles.brandChip, isChecked && styles.brandChipActive]}
                  >
                    <Text style={[styles.brandChipText, isChecked && styles.brandChipTextActive]}>
                      {isChecked ? `✓ ${b}` : b}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10
  },
  tabletDialog: {
    maxWidth: 460,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerIcon: {
    fontSize: 20
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280'
  },
  scrollContent: {
    paddingBottom: 16
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  optionsList: {
    gap: 8
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  sortItemActive: {
    borderColor: '#0C831F',
    backgroundColor: '#F0FDF4'
  },
  sortItemText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600'
  },
  sortItemTextActive: {
    color: '#0C831F',
    fontWeight: '800'
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioActive: {
    borderColor: '#0C831F'
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0C831F'
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  brandChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB'
  },
  brandChipActive: {
    borderColor: '#0C831F',
    backgroundColor: '#F0FDF4'
  },
  brandChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  },
  brandChipTextActive: {
    color: '#0C831F',
    fontWeight: '800'
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8
  },
  resetBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151'
  },
  applyBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#0C831F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

