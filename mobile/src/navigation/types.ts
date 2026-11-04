import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Route parameter contract for Bottom Tab Navigator
 * Consistent 5 tabs: Home, Categories, Search, Cart, Account
 */
export type MainTabParamList = {
  HomeTab: undefined;
  CategoriesTab: { slug?: string } | undefined;
  SearchTab: { query?: string } | undefined;
  CartTab: undefined;
  AccountTab: undefined;
  // Aliases for backwards compatibility
  PrintTab?: undefined;
  OrdersTab?: undefined;
  ProfileTab?: undefined;
};

/**
 * Route parameter contract for Root Native Stack Navigator
 * Encompasses all 15 mobile screens + MainTabs + direct Tab shortcuts
 */
export type RootStackParamList = {
  // Main Tab container
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;

  // Primary Stack Screens (15 screens total)
  Category: { slug?: string } | undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId?: string } | undefined;
  Search: { query?: string } | undefined;
  SearchResults: { query?: string } | undefined; // Compatibility alias
  OrdersHistory: undefined;
  Profile: undefined;
  SavedAddresses: undefined;
  Wishlist: undefined;
  OffersCoupons: undefined;
  Support: undefined;
  FAQ: undefined;
  AboutUs: undefined;

  // Direct tab screen shortcuts (enables navigation.navigate('HomeTab') from any screen)
  HomeTab: undefined;
  CategoriesTab: { slug?: string } | undefined;
  SearchTab: { query?: string } | undefined;
  CartTab: undefined;
  AccountTab: undefined;
  PrintTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

/**
 * Navigation Prop Types
 */
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Screen Props Type Helpers
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

/**
 * Individual Screen Prop Signatures for Clean Consumption
 */
export type HomeScreenProps = MainTabScreenProps<'HomeTab'>;
export type CategoriesTabScreenProps = MainTabScreenProps<'CategoriesTab'>;
export type SearchTabScreenProps = MainTabScreenProps<'SearchTab'>;
export type CartTabScreenProps = MainTabScreenProps<'CartTab'>;
export type AccountTabScreenProps = MainTabScreenProps<'AccountTab'>;
export type PrintTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, any>,
  NativeStackScreenProps<RootStackParamList>
>;
export type CategoryScreenProps = RootStackScreenProps<'Category'>;
export type ProductDetailScreenProps = RootStackScreenProps<'ProductDetail'>;
export type CartScreenProps = RootStackScreenProps<'Cart'>;
export type CheckoutScreenProps = RootStackScreenProps<'Checkout'>;
export type OrderTrackingScreenProps = RootStackScreenProps<'OrderTracking'>;
export type SearchResultsScreenProps = RootStackScreenProps<'Search'>;
export type OrdersHistoryScreenProps = RootStackScreenProps<'OrdersHistory'>;
export type ProfileScreenProps = RootStackScreenProps<'Profile'>;
export type SavedAddressesScreenProps = RootStackScreenProps<'SavedAddresses'>;
export type WishlistScreenProps = RootStackScreenProps<'Wishlist'>;
export type OffersCouponsScreenProps = RootStackScreenProps<'OffersCoupons'>;
export type SupportScreenProps = RootStackScreenProps<'Support'>;
export type FAQScreenProps = RootStackScreenProps<'FAQ'>;
export type AboutUsScreenProps = RootStackScreenProps<'AboutUs'>;

/**
 * Global React Navigation Type Augmentation
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
