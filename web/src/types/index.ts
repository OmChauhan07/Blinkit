export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  packWeight: string;
  price: number;
  mrp: number;
  discount?: string;
  rating?: number;
  ratingCount?: number;
  eta: string;
  description?: string;
  shelfLife?: string;
  countryOfOrigin?: string;
  manufacturer?: string;
  inStock: boolean;
  variants?: {
    weight: string;
    price: number;
    mrp: number;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight?: string;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  houseNo: string;
  apartmentRoad: string;
  landmark: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  address: Address;
  paymentMethod: string;
  itemTotal: number;
  handlingFee: number;
  deliveryFee: number;
  tip: number;
  discount: number;
  grandTotal: number;
  status: 'placed' | 'packing' | 'on_the_way' | 'delivered' | 'cancelled';
  etaMinutes: number;
  driverName?: string;
  driverPhone?: string;
  rating?: number;
  review?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  itemCount: number;
  subcategories: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
