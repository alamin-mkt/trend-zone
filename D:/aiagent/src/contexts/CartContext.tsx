// ====================================================================
// TREND ZONE CART CONTEXT
// ====================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'trend_zone_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
      const existing = prev.find((item) => item.id === cartItemId);

      const unitPrice = variant
        ? (variant.sale_price ?? variant.price)
        : (product.sale_price ?? product.base_price);

      const maxStock = variant ? variant.stock_quantity : product.stock_quantity;

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: newQty,
                totalPrice: newQty * unitPrice,
              }
            : item
        );
      } else {
        const initialQty = Math.min(quantity, maxStock > 0 ? maxStock : 1);
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          product,
          variantId: variant?.id,
          variant,
          quantity: initialQty,
          unitPrice,
          totalPrice: initialQty * unitPrice,
        };
        return [...prev, newItem];
      }
    });

    // Auto open drawer when adding to cart (standard boutique e-commerce UX)
    setIsDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.variant ? item.variant.stock_quantity : item.product.stock_quantity;
          const safeQty = Math.min(quantity, maxStock > 0 ? maxStock : 99);
          return {
            ...item,
            quantity: safeQty,
            totalPrice: safeQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
