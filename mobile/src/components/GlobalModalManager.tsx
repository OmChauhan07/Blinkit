import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { QuickProductModal } from './QuickProductModal';
import { LocationModal } from './LocationModal';
import { LoginOtpModal } from './LoginOtpModal';
import { AddEditAddressModal } from './AddEditAddressModal';
import { ApplyCouponModal } from './ApplyCouponModal';
import { CancelOrderModal } from './CancelOrderModal';
import { RateOrderModal } from './RateOrderModal';
import { FilterSortDrawer } from './FilterSortDrawer';
import { CartDrawer } from './CartDrawer';

export const GlobalModalManager: React.FC = () => {
  let navigation: any;
  try {
    navigation = useNavigation();
  } catch {
    navigation = undefined;
  }

  return (
    <>
      <QuickProductModal navigation={navigation} />
      <LocationModal />
      <LoginOtpModal />
      <AddEditAddressModal />
      <ApplyCouponModal />
      <CancelOrderModal />
      <RateOrderModal />
      <FilterSortDrawer />
      <CartDrawer navigation={navigation} />
    </>
  );
};

