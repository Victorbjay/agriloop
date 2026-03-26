
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface CartItem extends Listing {
  quantity: number; 
}

interface CartContextType {
  items: CartItem[];
  addToCart: (listing: Listing, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('agriloop_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('agriloop_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (listing: Listing, quantity: number) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === listing.id);
      
      if (existingIndex > -1) {
        // If it exists, update the quantity
        const newItems = [...prev];
        newItems[existingIndex] = { ...newItems[existingIndex], quantity };
        toast({ title: "Cart Updated", description: `Quantity for ${listing.wasteTypeLabel} updated to ${quantity}kg.` });
        return newItems;
      }
      
      toast({ title: "Added to Cart", description: `${quantity}kg of ${listing.wasteTypeLabel} added to your selection.` });
      return [...prev, { ...listing, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((acc, item) => acc + (item.pricePerKg * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
