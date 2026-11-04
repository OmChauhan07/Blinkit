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
import { Star, X } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { useResponsive } from '../hooks/useResponsive';

export const RateOrderModal: React.FC = () => {
  const {
    rateOrderModalOrderId,
    setRateOrderModalOrderId,
    rateOrder,
    getOrderById
  } = useStore();

  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  if (!rateOrderModalOrderId) return null;

  const order = getOrderById(rateOrderModalOrderId);

  const handleSubmit = () => {
    if (rateOrderModalOrderId) {
      rateOrder(rateOrderModalOrderId, rating, review);
      setRateOrderModalOrderId(null);
      setReview('');
    }
  };

  const handleClose = () => {
    setRateOrderModalOrderId(null);
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Excellent • 5 Stars';
      case 4:
        return 'Very Good • 4 Stars';
      case 3:
        return 'Average • 3 Stars';
      case 2:
        return 'Poor • 2 Stars';
      case 1:
        return 'Terrible • 1 Star';
      default:
        return 'Rate Experience';
    }
  };

  return (
    <Modal
      visible={!!rateOrderModalOrderId}
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
              <Star size={20} color="#D97706" fill="#D97706" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Rate Your Delivery Experience</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Delivery Partner Meta */}
            <View style={styles.orderSummaryBox}>
              <Text style={styles.orderNum}>Order #{order?.orderNumber || 'BLK-98214'}</Text>
              <Text style={styles.driverSub}>
                Delivered by {order?.driverName || 'Ramesh Kumar'} in 9 mins
              </Text>
            </View>

            {/* Stars Row */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starBtn}
                >
                  <Star
                    size={32}
                    color="#D97706"
                    fill={rating >= star ? '#D97706' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingLabelText}>{getRatingLabel(rating)}</Text>

            {/* Feedback Review TextInput */}
            <Text style={styles.reviewHeading}>Share feedback or delivery comments:</Text>
            <TextInput
              style={styles.reviewInput}
              value={review}
              onChangeText={setReview}
              placeholder="Tell us what you liked (packaging, speed, rider politeness)..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Feedback</Text>
            </TouchableOpacity>
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
    paddingBottom: 16,
    alignItems: 'center'
  },
  orderSummaryBox: {
    alignItems: 'center',
    marginBottom: 16
  },
  orderNum: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1C'
  },
  driverSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12
  },
  starBtn: {
    padding: 6
  },
  starIcon: {
    fontSize: 40,
    color: '#E5E7EB'
  },
  starActive: {
    color: '#F59E0B'
  },
  ratingLabelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 16
  },
  reviewHeading: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8
  },
  reviewInput: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 12,
    fontSize: 13,
    color: '#1C1C1C',
    textAlignVertical: 'top',
    marginBottom: 16
  },
  submitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0C831F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

