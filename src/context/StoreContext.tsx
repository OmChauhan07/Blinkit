import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Address, Order, Coupon } from '../types';
import {
  PRODUCTS,
  INITIAL_SAVED_ADDRESSES,
  INITIAL_COUPONS,
  INITIAL_ORDERS
} from '../data/mockData';

interface BillSummary {
  itemTotal: number;
  handlingFee: number;
  deliveryFee: number;
  tip: number;
  discount: number;
  grandTotal: number;
  totalSavings: number;
}

interface StoreContextType {
  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, selectedWeight?: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  billSummary: BillSummary;

  // Address
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  editAddress: (addr: Address) => void;
  deleteAddress: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: string) => string;
  cancelOrder: (orderId: string, reason: string) => void;
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

  // User / OTP Simulation
  user: {
    name: string;
    phone: string;
    email: string;
    isLoggedIn: boolean;
  };
  loginWithPhone: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  logout: () => void;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Modals & Drawers state
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isAddAddressModalOpen: boolean;
  setIsAddAddressModalOpen: (open: boolean) => void;
  isApplyCouponModalOpen: boolean;
  setIsApplyCouponModalOpen: (open: boolean) => void;
  cancelOrderModalOrderId: string | null;
  setCancelOrderModalOrderId: (orderId: string | null) => void;
  rateOrderModalOrderId: string | null;
  setRateOrderModalOrderId: (orderId: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation: simple client side routing
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Pre-populated cart items (Amul Taaza, Bread, Eggs, Dahi) as requested in Phase 1
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('blinkit_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      { product: PRODUCTS[0], quantity: 2, selectedWeight: '500 ml pouch' },
      { product: PRODUCTS[3], quantity: 1, selectedWeight: '400 g loaf' },
      { product: PRODUCTS[5], quantity: 1, selectedWeight: '6 pieces tray' },
      { product: PRODUCTS[2], quantity: 1, selectedWeight: '400 g tub' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('blinkit_cart', JSON.stringify(cart));
  }, [cart]);

  // Delivery tip amount
  const [tipAmount, setTipAmount] = useState<number>(20);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('blinkit_addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SAVED_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<Address>(addresses[0]);

  useEffect(() => {
    localStorage.setItem('blinkit_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const addr: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setAddresses((prev) => [addr, ...prev]);
    setSelectedAddress(addr);
  };

  const editAddress = (updated: Address) => {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (selectedAddress.id === updated.id) {
      setSelectedAddress(updated);
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  // Coupons
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('blinkit_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('blinkit_orders', JSON.stringify(orders));
  }, [orders]);

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('blinkit_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return ['cadbury-silk-150', 'lays-magic-masala-50', 'amul-salted-butter-100'];
  });

  useEffect(() => {
    localStorage.setItem('blinkit_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  // User Authentication Simulation
  const [user, setUser] = useState({
    name: 'Omkar Chauhan',
    phone: '9876543210',
    email: 'odchauhan0702@gmail.com',
    isLoggedIn: true
  });

  const [pendingPhone, setPendingPhone] = useState<string>('9876543210');

  const loginWithPhone = (phone: string) => {
    setPendingPhone(phone);
  };

  const verifyOtp = (_otp: string) => {
    // Simulated OTP verification: Accepts 1234 or any 4 digit code as confirmed in Q3
    setUser((prev) => ({
      ...prev,
      phone: pendingPhone || prev.phone,
      isLoggedIn: true
    }));
    setIsLoginModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
  };

  // Cart operations
  const addToCart = (product: Product, selectedWeight?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1
        };
        return next;
      }
      return [...prev, { product, quantity: 1, selectedWeight: selectedWeight || product.packWeight }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Bill Calculations
  const itemTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const originalTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const handlingFee = itemTotal > 0 ? 4 : 0;
  const deliveryFee = itemTotal === 0 ? 0 : itemTotal >= 149 ? 0 : 25;

  let discount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.min((itemTotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, itemTotal + handlingFee + deliveryFee + tipAmount - discount);
  const totalSavings = originalTotal - itemTotal + discount;

  const billSummary: BillSummary = {
    itemTotal,
    handlingFee,
    deliveryFee,
    tip: tipAmount,
    discount,
    grandTotal,
    totalSavings
  };

  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
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

  // Orders creation
  const placeOrder = (paymentMethod: string): string => {
    const newOrderId = `ord-${Date.now()}`;
    const newOrder: Order = {
      id: newOrderId,
      orderNumber: `BLK-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      items: [...cart],
      address: selectedAddress,
      paymentMethod,
      itemTotal,
      handlingFee,
      deliveryFee,
      tip: tipAmount,
      discount,
      grandTotal,
      status: 'placed',
      etaMinutes: 10,
      driverName: 'Sanjay Rawat',
      driverPhone: '+91 98722 55432'
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Simulate order progress
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrderId ? { ...o, status: 'packing' } : o))
      );
    }, 4000);

    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrderId ? { ...o, status: 'on_the_way' } : o))
      );
    }, 9000);

    return newOrderId;
  };

  const cancelOrder = (orderId: string, _reason: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );
  };

  const rateOrder = (orderId: string, rating: number, review?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating, review } : o))
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isApplyCouponModalOpen, setIsApplyCouponModalOpen] = useState(false);
  const [cancelOrderModalOrderId, setCancelOrderModalOrderId] = useState<string | null>(null);
  const [rateOrderModalOrderId, setRateOrderModalOrderId] = useState<string | null>(null);

  return (
    <StoreContext.Provider
      value={{
        currentRoute,
        navigate,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        tipAmount,
        setTipAmount,
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
        user,
        loginWithPhone,
        verifyOtp,
        logout,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
        isAddAddressModalOpen,
        setIsAddAddressModalOpen,
        isApplyCouponModalOpen,
        setIsApplyCouponModalOpen,
        cancelOrderModalOrderId,
        setCancelOrderModalOrderId,
        rateOrderModalOrderId,
        setRateOrderModalOrderId
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
