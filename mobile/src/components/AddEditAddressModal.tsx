import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Briefcase, MapPin, X } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';
import { Address } from '../types';

export const AddEditAddressModal: React.FC = () => {
  const {
    isAddAddressModalOpen,
    setIsAddAddressModalOpen,
    editingAddress,
    setEditingAddress,
    addAddress,
    editAddress
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();

  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [houseNo, setHouseNo] = useState('');
  const [apartmentRoad, setApartmentRoad] = useState('');
  const [landmark, setLandmark] = useState('');
  const [name, setName] = useState('Omkar Chauhan');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [city, setCity] = useState('Gurugram, Haryana');
  const [pincode, setPincode] = useState('122018');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingAddress) {
      setType(editingAddress.type);
      setHouseNo(editingAddress.houseNo);
      setApartmentRoad(editingAddress.apartmentRoad);
      setLandmark(editingAddress.landmark || '');
      setName(editingAddress.name);
      setPhone(editingAddress.phone);
      setCity(editingAddress.city);
      setPincode(editingAddress.pincode);
    } else {
      setType('Home');
      setHouseNo('');
      setApartmentRoad('');
      setLandmark('');
      setName('Omkar Chauhan');
      setPhone('+91 98765 43210');
      setCity('Gurugram, Haryana');
      setPincode('122018');
    }
    setErrorMsg('');
  }, [editingAddress, isAddAddressModalOpen]);

  if (!isAddAddressModalOpen) return null;

  const handleSave = () => {
    if (!houseNo.trim() || !apartmentRoad.trim()) {
      setErrorMsg('Please enter flat/house number and area road details.');
      return;
    }

    if (editingAddress) {
      const updated: Address = {
        ...editingAddress,
        type,
        name,
        phone,
        houseNo,
        apartmentRoad,
        landmark,
        city,
        pincode
      };
      editAddress(updated);
    } else {
      addAddress({
        type,
        name,
        phone,
        houseNo,
        apartmentRoad,
        landmark,
        city,
        pincode,
        isDefault: false
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setIsAddAddressModalOpen(false);
    setEditingAddress(null);
    setErrorMsg('');
  };

  return (
    <Modal
      visible={isAddAddressModalOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
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
                <Home size={20} color="#0C831F" style={{ marginRight: 8 }} />
                <Text style={styles.headerTitle}>
                  {editingAddress ? 'Edit Delivery Address' : 'Add Delivery Address'}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {errorMsg.length > 0 && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* Tag Selector */}
              <Text style={styles.label}>SAVE ADDRESS AS</Text>
              <View style={styles.tagsRow}>
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tagBtn, type === t && styles.tagBtnActive]}
                    onPress={() => setType(t)}
                  >
                    <View style={{ marginRight: 6 }}>
                      {t === 'Home' ? (
                        <Home size={14} color={type === t ? '#0C831F' : '#6B7280'} />
                      ) : t === 'Work' ? (
                        <Briefcase size={14} color={type === t ? '#0C831F' : '#6B7280'} />
                      ) : (
                        <MapPin size={14} color={type === t ? '#0C831F' : '#6B7280'} />
                      )}
                    </View>
                    <Text style={[styles.tagText, type === t && styles.tagTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* House / Flat No */}
              <Text style={styles.inputLabel}>
                Flat / House / Floor / Building <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={houseNo}
                onChangeText={setHouseNo}
                placeholder="e.g. Flat 402, Tower B, Green Meadows"
                placeholderTextColor="#9CA3AF"
              />

              {/* Apartment / Road / Area */}
              <Text style={styles.inputLabel}>
                Area / Street / Sector <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={apartmentRoad}
                onChangeText={setApartmentRoad}
                placeholder="e.g. Sector 48, Sohna Road"
                placeholderTextColor="#9CA3AF"
              />

              {/* Landmark */}
              <Text style={styles.inputLabel}>Nearby Landmark (Optional)</Text>
              <TextInput
                style={styles.input}
                value={landmark}
                onChangeText={setLandmark}
                placeholder="e.g. Opposite Central Park Plaza"
                placeholderTextColor="#9CA3AF"
              />

              {/* City and Pincode Row */}
              <View style={styles.row}>
                <View style={{ flex: 2, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>City & State</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City, State"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="122018"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Receiver Info */}
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Receiver Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {editingAddress ? 'Update Delivery Address' : 'Save & Deliver Here'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
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
  keyboardWrap: {
    width: '100%',
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
    maxWidth: 520,
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
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  tagBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 6
  },
  tagBtnActive: {
    borderColor: '#0C831F',
    backgroundColor: '#F0FDF4'
  },
  tagIcon: {
    fontSize: 16
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563'
  },
  tagTextActive: {
    color: '#0C831F'
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
    marginTop: 8
  },
  requiredStar: {
    color: '#E23744'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#1C1C1C',
    backgroundColor: '#F9FAFB'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  saveBtn: {
    backgroundColor: '#0C831F',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});

