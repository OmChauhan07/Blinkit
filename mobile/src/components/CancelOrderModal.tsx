import React, { useState } from 'react';
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
import { AlertTriangle, X } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';

const CANCEL_REASONS = [
  'Placed the order by mistake',
  'Forgot to add essential items',
  'Delivery time is too long',
  'Incorrect delivery address selected',
  'Payment or discount coupon issue',
  'Other reasons'
];

export const CancelOrderModal: React.FC = () => {
  const {
    cancelOrderModalOrderId,
    setCancelOrderModalOrderId,
    cancelOrder,
    getOrderById
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  if (!cancelOrderModalOrderId) return null;

  const order = getOrderById(cancelOrderModalOrderId);

  const handleConfirmCancel = () => {
    if (cancelOrderModalOrderId) {
      cancelOrder(cancelOrderModalOrderId, selectedReason);
      setCancelOrderModalOrderId(null);
    }
  };

  const handleClose = () => {
    setCancelOrderModalOrderId(null);
  };

  return (
    <Modal
      visible={!!cancelOrderModalOrderId}
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
              <AlertTriangle size={20} color="#DC2626" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Cancel Order</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Refund Info Banner */}
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Are you sure you want to cancel order{' '}
                <Text style={styles.boldText}>{order?.orderNumber || 'this order'}</Text>? An instant refund
                of <Text style={styles.boldText}>₹{order?.grandTotal || 0}</Text> will be initiated to your original payment method.
              </Text>
            </View>

            {/* Reasons List */}
            <Text style={styles.reasonsHeading}>Select Reason for Cancellation:</Text>

            <View style={styles.reasonsList}>
              {CANCEL_REASONS.map((r) => {
                const isSelected = selectedReason === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setSelectedReason(r)}
                    style={[styles.reasonItem, isSelected && styles.reasonItemActive]}
                  >
                    <Text style={[styles.reasonText, isSelected && styles.reasonTextActive]}>
                      {r}
                    </Text>
                    <View style={[styles.radio, isSelected && styles.radioActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.dismissBtn} onPress={handleClose}>
              <Text style={styles.dismissBtnText}>Don't Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmCancel}>
              <Text style={styles.confirmBtnText}>Cancel Order</Text>
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
    maxWidth: 440,
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
    color: '#E23744'
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
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18
  },
  boldText: {
    fontWeight: '800'
  },
  reasonsHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8
  },
  reasonsList: {
    gap: 8
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  reasonItemActive: {
    borderColor: '#E23744',
    backgroundColor: '#FFF1F2'
  },
  reasonText: {
    fontSize: 13,
    color: '#374151',
    flex: 1
  },
  reasonTextActive: {
    fontWeight: '700',
    color: '#E23744'
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  radioActive: {
    borderColor: '#E23744'
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E23744'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8
  },
  dismissBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dismissBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151'
  },
  confirmBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#E23744',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

