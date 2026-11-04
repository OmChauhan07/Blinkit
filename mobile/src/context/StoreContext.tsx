import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem, Address, Order, Coupon } from '../types';
import {
  PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_COUPONS,
  INITIAL_ORDERS
} from '../data/mockData';

export interface BillSummary {
  itemTotal: number;
  handlingFee: number;
  deliveryFee: number;
  tip: number;
  discount: number;
  grandTotal: number;
  totalSavings: number;
}

export interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, selectedWeight?: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  itemTotal: number;
  handlingFee: number;
  deliveryFee: number;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  discountAmount: number;
  grandTotal: number;
  billSummary: BillSummary;

  // Addresses
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  editAddress: (addr: Address) => void;
  deleteAddress: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: string) => string;
  cancelOrder: (orderId: string, reason?: string) => void;
  rateOrder: (orderId: string, rating: number, review?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;

  // User & Auth
  user: {
    name: string;
    phone: string;
    email: string;
    isLoggedIn: boolean;
  };
  loginWithPhone: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  logout: () => void;

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isAddAddressModalOpen: boolean;
  setIsAddAddressModalOpen: (open: boolean) => void;
  editingAddress: Address | null;
  setEditingAddress: (addr: Address | null) => void;
  isApplyCouponModalOpen: boolean;
  setIsApplyCouponModalOpen: (open: boolean) => void;
  cancelOrderModalOrderId: string | null;
  setCancelOrderModalOrderId: (orderId: string | null) => void;
  rateOrderModalOrderId: string | null;
  setRateOrderModalOrderId: (orderId: string | null) => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: '@blinkit_cart',
  ADDRESSES: '@blinkit_addresses',
  ORDERS: '@blinkit_orders',
  WISHLIST: '@blinkit_wishlist',
  USER: '@blinkit_user'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 2, selectedWeight: '500 ml pouch' },
    { product: PRODUCTS[3], quantity: 1, selectedWeight: '400 g loaf' },
    { product: PRODUCTS[5], quantity: 1, selectedWeight: '6 pieces tray' },
    { product: PRODUCTS[2], quantity: 1, selectedWeight: '400 g tub' }
  ]);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(INITIAL_ADDRESSES[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    PRODUCTS[0].id,
    PRODUCTS[6]?.id || 'lays-magic-masala-50',
    PRODUCTS[13]?.id || 'cadbury-silk-150'
  ]);

  // Coupons
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Delivery Tip
  const [tipAmount, setTipAmount] = useState<number>(20);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // User Auth
  const [user, setUser] = useState({
    name: 'Omkar Chauhan',
    phone: '9876543210',
    email: 'odchauhan0702@gmail.com',
    isLoggedIn: true
  });
  const [pendingPhone, setPendingPhone] = useState<string>('9876543210');

  // Modals & Drawers Visibility
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isApplyCouponModalOpen, setIsApplyCouponModalOpen] = useState(false);
  const [cancelOrderModalOrderId, setCancelOrderModalOrderId] = useState<string | null>(null);
  const [rateOrderModalOrderId, setRateOrderModalOrderId] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const [savedCart, savedAddresses, savedOrders, savedWishlist, savedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CART),
          AsyncStorage.getItem(STORAGE_KEYS.ADDRESSES),
          AsyncStorage.getItem(STORAGE_KEYS.ORDERS),
          AsyncStorage.getItem(STORAGE_KEYS.WISHLIST),
          AsyncStorage.getItem(STORAGE_KEYS.USER)
        ]);

        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed) && parsed.length > 0) setCart(parsed);
        }
        if (savedAddresses) {
          const parsed = JSON.parse(savedAddresses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
            setSelectedAddress(parsed[0]);
          }
        }
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
        }
        if (savedWishlist) {
          const parsed = JSON.parse(savedWishlist);
          if (Array.isArray(parsed)) setWishlistIds(parsed);
        }
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && typeof parsed === 'object') setUser(parsed);
        }
      } catch {
        // Fallback to initial mock data on parse or storage failure
      }
    };
    loadStorage();
  }, []);

  // Save changes to storage
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)).catch(() => {});
  }, [cart]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses)).catch(() => {});
  }, [addresses]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)).catch(() => {});
  }, [orders]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds)).catch(() => {});
  }, [wishlistIds]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)).catch(() => {});
  }, [user]);

  // Cart Operations
  const addToCart = (product: Product, selectedWeight?: string) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, quantity: 1, selectedWeight: selectedWeight || product.packWeight }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const getItemQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Pricing & Bill Calculations
  const itemTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const originalTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const deliveryFee = itemTotal >= 149 || itemTotal === 0 ? 0 : 25;
  const handlingFee = itemTotal > 0 ? 4 : 0;

  let discountAmount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'flat') {
      discountAmount = appliedCoupon.discountValue;
    } else {
      discountAmount = Math.min((itemTotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || 9999);
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + handlingFee + tipAmount - discountAmount);
  const totalSavings = originalTotal - itemTotal + discountAmount;

  const billSummary: BillSummary = {
    itemTotal,
    handlingFee,
    deliveryFee,
    tip: tipAmount,
    discount: discountAmount,
    grandTotal,
    totalSavings
  };

  // Address Operations
  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const fullAddr: Address = { ...newAddr, id };
    setAddresses((prev) => [fullAddr, ...prev]);
    setSelectedAddress(fullAddr);
  };

  const editAddress = (updated: Address) => {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (selectedAddress.id === updated.id) {
      setSelectedAddress(updated);
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (selectedAddress.id === id && filtered.length > 0) {
        setSelectedAddress(filtered[0]);
      }
      return filtered;
    });
  };

  // Wishlist Operations
  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  // Coupon Operations
  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try BLINKIT50 or FREEDEL.' };
    }
    if (itemTotal < found.minOrderValue) {
      return { success: false, message: `Minimum order value for ${found.code} is ₹${found.minOrderValue}` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Orders Operations
  const placeOrder = (paymentMethod: string) => {
    const id = `ord-${Date.now()}`;
    const newOrder: Order = {
      id,
      orderNumber: `BLK-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      items: [...cart],
      address: selectedAddress,
      paymentMethod,
      itemTotal,
      handlingFee,
      deliveryFee,
      tip: tipAmount,
      discount: discountAmount,
      grandTotal,
      status: 'placed',
      etaMinutes: 10,
      driverName: 'Ramesh Kumar',
      driverPhone: '+91 98112 34567'
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Simulate order progress
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id && o.status === 'placed' ? { ...o, status: 'packing' } : o))
      );
    }, 4000);

    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id && o.status === 'packing' ? { ...o, status: 'on_the_way' } : o))
      );
    }, 9000);

    return id;
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'cancelled' as const, review: reason } : ord))
    );
  };

  const rateOrder = (orderId: string, rating: number, review?: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, rating, review } : ord))
    );
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  // Auth Operations
  const loginWithPhone = (phone: string) => {
    setPendingPhone(phone);
  };

  const verifyOtp = (_otp: string) => {
    setUser({
      name: 'Omkar Chauhan',
      phone: pendingPhone || '9876543210',
      email: 'odchauhan0702@gmail.com',
      isLoggedIn: true
    });
    setIsLoginModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser({
      name: 'Guest User',
      phone: '',
      email: '',
      isLoggedIn: false
    });
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        itemTotal,
        handlingFee,
        deliveryFee,
        tipAmount,
        setTipAmount,
        discountAmount,
        grandTotal,
        billSummary,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        editAddress,
        deleteAddress,
        orders,
        placeOrder,
        cancelOrder,
        rateOrder,
        getOrderById,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedBrands,
        setSelectedBrands,
        user,
        loginWithPhone,
        verifyOtp,
        logout,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        isAddAddressModalOpen,
        setIsAddAddressModalOpen,
        editingAddress,
        setEditingAddress,
        isApplyCouponModalOpen,
        setIsApplyCouponModalOpen,
        cancelOrderModalOrderId,
        setCancelOrderModalOrderId,
        rateOrderModalOrderId,
        setRateOrderModalOrderId,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
