import React, { createContext, useContext, useState } from 'react';
import { Product, CartItem, Address, Order, Coupon } from '../types';
import { PRODUCTS, INITIAL_ADDRESSES } from '../data/mockData';

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  itemTotal: number;
  grandTotal: number;
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  orders: Order[];
  placeOrder: (paymentMethod: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 2 },
    { product: PRODUCTS[3], quantity: 1 },
    { product: PRODUCTS[5], quantity: 1 }
  ]);

  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(addresses[0]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, quantity: 1 }];
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

  const itemTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = itemTotal >= 149 ? 0 : 25;
  const handlingFee = itemTotal > 0 ? 4 : 0;
  const grandTotal = itemTotal + deliveryFee + handlingFee;

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
      tip: 0,
      discount: 0,
      grandTotal,
      status: 'placed',
      etaMinutes: 10,
      driverName: 'Ramesh Kumar',
      driverPhone: '+91 98112 34567'
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return id;
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
        grandTotal,
        addresses,
        selectedAddress,
        setSelectedAddress,
        orders,
        placeOrder
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
