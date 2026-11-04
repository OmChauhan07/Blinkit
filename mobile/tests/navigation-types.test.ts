/**
 * Compile-time verification of navigation routes & screen props for all 15 screens
 */
import type {
  RootStackParamList,
  MainTabParamList,
  RootNavigationProp,
  HomeScreenProps,
  CategoriesTabScreenProps,
  PrintTabScreenProps,
  CategoryScreenProps,
  ProductDetailScreenProps,
  CartScreenProps,
  CheckoutScreenProps,
  OrderTrackingScreenProps,
  SearchResultsScreenProps,
  OrdersHistoryScreenProps,
  ProfileScreenProps,
  SavedAddressesScreenProps,
  WishlistScreenProps,
  OffersCouponsScreenProps,
  SupportScreenProps,
  FAQScreenProps,
  AboutUsScreenProps,
} from '../src/navigation/types';

// Assert each screen prop type has route and navigation
type AssertScreenProps<T extends { navigation: any; route: any }> = true;

type T1 = AssertScreenProps<HomeScreenProps>;
type T2 = AssertScreenProps<CategoriesTabScreenProps>;
type T3 = AssertScreenProps<PrintTabScreenProps>;
type T4 = AssertScreenProps<CategoryScreenProps>;
type T5 = AssertScreenProps<ProductDetailScreenProps>;
type T6 = AssertScreenProps<CartScreenProps>;
type T7 = AssertScreenProps<CheckoutScreenProps>;
type T8 = AssertScreenProps<OrderTrackingScreenProps>;
type T9 = AssertScreenProps<SearchResultsScreenProps>;
type T10 = AssertScreenProps<OrdersHistoryScreenProps>;
type T11 = AssertScreenProps<ProfileScreenProps>;
type T12 = AssertScreenProps<SavedAddressesScreenProps>;
type T13 = AssertScreenProps<WishlistScreenProps>;
type T14 = AssertScreenProps<OffersCouponsScreenProps>;
type T15 = AssertScreenProps<SupportScreenProps>;
type T16 = AssertScreenProps<FAQScreenProps>;
type T17 = AssertScreenProps<AboutUsScreenProps>;

// Route name verification in RootStackParamList
type RequiredRoutes = [
  'MainTabs',
  'Category',
  'ProductDetail',
  'Cart',
  'Checkout',
  'OrderTracking',
  'Search',
  'SearchResults',
  'OrdersHistory',
  'Profile',
  'SavedAddresses',
  'Wishlist',
  'OffersCoupons',
  'Support',
  'FAQ',
  'AboutUs',
  'HomeTab',
  'CategoriesTab',
  'PrintTab',
  'OrdersTab',
  'ProfileTab'
];

type CheckRoutes<T extends (keyof RootStackParamList)[]> = true;
type RoutesValid = CheckRoutes<RequiredRoutes>;

export const compileCheckPassed: boolean = true;
