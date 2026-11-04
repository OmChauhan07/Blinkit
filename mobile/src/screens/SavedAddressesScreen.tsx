import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Home, Briefcase, MapPin, Check, Pencil, Trash2 } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';

export const SavedAddressesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    deleteAddress,
    setIsAddAddressModalOpen,
    setEditingAddress
  } = useStore();

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsAddAddressModalOpen(true);
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setIsAddAddressModalOpen(true);
  };

  const handleDelete = (addr: Address) => {
    if (addresses.length <= 1) {
      Alert.alert('Cannot Delete', 'You must have at least one delivery address.');
      return;
    }
    Alert.alert('Delete Address', `Are you sure you want to delete ${addr.type} (${addr.houseNo})?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(addr.id) }
    ]);
  };

  const getAddressIcon = (type: string) => {
    if (type === 'Home') return <Home size={14} color="#0C831F" />;
    if (type === 'Work') return <Briefcase size={14} color="#0C831F" />;
    return <MapPin size={14} color="#0C831F" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => (navigation.canGoBack?.() ? navigation.goBack() : navigation.navigate('HomeTab'))}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Address CTA */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddNew}>
          <Plus size={18} color="#0C831F" style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>Add New Delivery Address</Text>
        </TouchableOpacity>

        {/* Addresses List */}
        {addresses.map((addr) => {
          const isSelected = selectedAddress.id === addr.id;

          return (
            <View key={addr.id} style={[styles.addrCard, isSelected && styles.addrCardActive]}>
              <View style={styles.cardTop}>
                <View style={styles.typeBadge}>
                  <View style={{ marginRight: 4 }}>{getAddressIcon(addr.type)}</View>
                  <Text style={styles.typeText}>{addr.type}</Text>
                </View>

                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedText}>Active Delivery Address</Text>
                  </View>
                )}
              </View>

              <Text style={styles.addrHouse}>{addr.houseNo}</Text>
              <Text style={styles.addrDetails}>
                {addr.apartmentRoad}, {addr.city} - {addr.pincode}
              </Text>
              {addr.landmark ? (
                <Text style={styles.landmarkText}>Landmark: {addr.landmark}</Text>
              ) : null}
              <Text style={styles.addrContact}>
                Contact: {addr.name} ({addr.phone})
              </Text>

              <View style={styles.cardActions}>
                {!isSelected ? (
                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => setSelectedAddress(addr)}
                  >
                    <Text style={styles.selectBtnText}>Deliver Here</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.defaultPill}>
                    <Check size={12} color="#0C831F" style={{ marginRight: 4 }} />
                    <Text style={styles.defaultPillText}>Currently Selected</Text>
                  </View>
                )}

                <View style={styles.editDeleteRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleEdit(addr)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(addr)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center'
  },
  backBtn: { padding: 4, marginRight: 12, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0C831F',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 8
  },
  addBtnIcon: { fontSize: 18, color: '#0C831F', fontWeight: '800' },
  addBtnText: { fontSize: 14, fontWeight: '800', color: '#0C831F' },
  addrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  addrCardActive: {
    borderColor: '#0C831F',
    backgroundColor: '#FFFFFF'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6
  },
  typeIcon: { fontSize: 14 },
  typeText: { fontSize: 12, fontWeight: '800', color: '#1C1C1C' },
  selectedBadge: {
    backgroundColor: '#E8F8E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  selectedText: { fontSize: 10, fontWeight: '800', color: '#0C831F' },
  addrHouse: { fontSize: 14, fontWeight: '800', color: '#1C1C1C', marginBottom: 2 },
  addrDetails: { fontSize: 12, color: '#555555', lineHeight: 18 },
  landmarkText: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  addrContact: { fontSize: 11, color: '#828282', marginTop: 4 },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F6FB'
  },
  selectBtn: {
    backgroundColor: '#0C831F',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  selectBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  defaultPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  defaultPillText: { fontSize: 11, fontWeight: '800', color: '#0C831F' },
  editDeleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  deleteBtnText: { fontSize: 12, fontWeight: '700', color: '#E23744' }
});
