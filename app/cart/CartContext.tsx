"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartProduct = {
  id: string;
  name: string;
  price: number; // USD
  imageUrl: string;
};

export type CartLine = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number; // total quantity
  subtotal: number;

  addItem: (product: CartProduct, qty?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;

  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mayas_cake_cafe_cart_v1";

function isCartLine(x: any): x is CartLine {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    typeof x.price === "number" &&
    typeof x.imageUrl === "string" &&
    typeof x.quantity === "number"
  );
}

function safeParseLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(safeParseLines(localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  // Persist on change (post-hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage quota / private mode issues
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: CartProduct, qty: number = 1) => {
    const q = Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === product.id);
      if (i === -1) return [...prev, { ...product, quantity: q }];
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + q };
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    const q = Number.isFinite(quantity) ? Math.floor(quantity) : 0;
    setItems((prev) => {
      if (q <= 0) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, quantity: q } : x));
    });
  }, []);

  const increment = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity: x.quantity + 1 } : x))
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, quantity: x.quantity - 1 } : x))
        .filter((x) => x.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, x) => sum + x.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.quantity, 0),
    [items]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clear,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clear,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider />");
  return ctx;
}
