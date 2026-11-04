import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, X, Search, Crosshair, Home, Briefcase, Plus, Check } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';

const CITIES = [
  { name: 'Gurugram', state: 'Haryana' },
  { name: 'New Delhi', state: 'Delhi NCR' },
  { name: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Bengaluru', state: 'Karnataka' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Kolkata', state: 'West Bengal' }
];

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    addresses,
    selectedAddress,
    setSelectedAddress,
    setIsAddAddressModalOpen,
    setEditingAddress
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();
  const [searchLocation, setSearchLocation] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleDetectLocation = () => {
    setDetectingGps(true);
    setTimeout(() => {
      setDetectingGps(false);
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
      setIsLocationModalOpen(false);
    }, 800);
  };

  const handleSelectCity = (city: typeof CITIES[0]) => {
    const matched = addresses.find((a) => a.city.toLowerCase().includes(city.name.toLowerCase()));
    if (matched) {
      setSelectedAddress(matched);
    } else {
      setSelectedAddress({
        id: `city-${Date.now()}`,
        type: 'Home',
        name: 'Omkar Chauhan',
        phone: '+91 98765 43210',
        houseNo: 'Sector 29, Central Market',
        apartmentRoad: 'City Center Road',
        landmark: 'Near Metro Station',
        city: `${city.name}, ${city.state}`,
        pincode: '110001',
        isDefault: false
      });
    }
    setIsLocationModalOpen(false);
  };

  const handleOpenAddNew = () => {
    setEditingAddress(null);
    setIsLocationModalOpen(false);
    setIsAddAddressModalOpen(true);
  };

  const filteredAddresses = addresses.filter((a) => {
    if (!searchLocation.trim()) return true;
    const q = searchLocation.toLowerCase();
    return (
      a.houseNo.toLowerCase().includes(q) ||
      a.apartmentRoad.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q)
    );
  });

  return (
    <Modal
      visible={isLocationModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsLocationModalOpen(false)}
    >
      <Pressable style={styles.backdrop} onPress={() => setIsLocationModalOpen(false)}>
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
              <MapPin size={20} color="#0C831F" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Select Delivery Location</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsLocationModalOpen(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Search Input */}
            <View style={styles.searchBox}>
              <Search size={16} color="#0C831F" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search area, apartment, street or city..."
                placeholderTextColor="#9CA3AF"
                value={searchLocation}
                onChangeText={setSearchLocation}
              />
              {searchLocation.length > 0 && (
                <TouchableOpacity onPress={() => setSearchLocation('')} style={styles.clearSearchBtn}>
                  <X size={14} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* GPS Detection Button */}
            <TouchableOpacity
              style={styles.gpsBtn}
              onPress={handleDetectLocation}
              disabled={detectingGps}
            >
              <Crosshair size={20} color="#0C831F" style={{ marginRight: 12 }} />
              <View style={styles.gpsTextCol}>
                <Text style={styles.gpsTitle}>
                  {detectingGps ? 'Detecting current GPS location...' : 'Use Current Location'}
                </Text>
                <Text style={styles.gpsSub}>Enable device GPS for 10-minute dark store matching</Text>
              </View>
            </TouchableOpacity>

            {/* Saved Addresses Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>SAVED DELIVERY ADDRESSES</Text>
              <TouchableOpacity onPress={handleOpenAddNew}>
                <Text style={styles.addNewLink}>+ Add New</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addressesList}>
              {filteredAddresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <TouchableOpacity
                    key={addr.id}
                    onPress={() => {
                      setSelectedAddress(addr);
                      setIsLocationModalOpen(false);
                    }}
                    style={[styles.addrItem, isSelected && styles.addrItemActive]}
                  >
                    <View style={{ marginRight: 10, marginTop: 2 }}>
                      {addr.type === 'Home' ? (
                        <Home size={16} color="#0C831F" />
                      ) : addr.type === 'Work' ? (
                        <Briefcase size={16} color="#0C831F" />
                      ) : (
                        <MapPin size={16} color="#0C831F" />
                      )}
                    </View>
                    <View style={styles.addrInfo}>
                      <View style={styles.addrTypeRow}>
                        <Text style={styles.addrType}>{addr.type}</Text>
                        {addr.isDefault && (
                          <View style={styles.defaultPill}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text numberOfLines={1} style={styles.addrMain}>
                        {addr.houseNo}, {addr.apartmentRoad}
                      </Text>
                      <Text numberOfLines={1} style={styles.addrCity}>
                        {addr.city} - {addr.pincode}
                      </Text>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Major Cities Quick Chips */}
            <Text style={[styles.sectionTitle, { marginTop: 18, marginBottom: 8 }]}>
              DELIVER TO MAJOR CITIES (10-MIN ETA)
            </Text>
            <View style={styles.cityChipsRow}>
              {CITIES.map((c) => (
                <TouchableOpacity
                  key={c.name}
                  style={styles.cityChip}
                  onPress={() => handleSelectCity(c)}
                >
                  <Text style={styles.cityChipText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
    maxWidth: 500,
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1C1C1C'
  },
  clearSearchBtn: {
    padding: 4
  },
  clearSearchText: {
    color: '#9CA3AF',
    fontSize: 14
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0C831F',
    backgroundColor: '#F0FDF4',
    marginBottom: 16
  },
  gpsIcon: {
    fontSize: 22,
    marginRight: 10
  },
  gpsTextCol: {
    flex: 1
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0C831F'
  },
  gpsSub: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5
  },
  addNewLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C831F'
  },
  addressesList: {
    gap: 8
  },
  addrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  addrItemActive: {
    borderColor: '#0C831F',
    backgroundColor: '#F0FDF4'
  },
  addrTypeIcon: {
    fontSize: 20,
    marginRight: 10
  },
  addrInfo: {
    flex: 1
  },
  addrTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  addrType: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  defaultPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  defaultText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E'
  },
  addrMain: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2
  },
  addrCity: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1
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
  cityChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F6FB',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  cityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  }
});

