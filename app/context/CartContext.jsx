"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setProductsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setProductsLoading(false);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("blooming-partners-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("blooming-partners-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (slug, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug);
      if (found) {
        return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { slug, qty }];
    });
  };

  const updateQty = (slug, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
      return;
    }
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty } : i)));
  };

  const removeItem = (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug));
  const clear = () => setItems([]);

  const detailedItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.slug === item.slug);
          if (!product) return null;
          return { ...product, qty: item.qty };
        })
        .filter(Boolean),
    [items]
  );

  return (
    <CartContext.Provider value={{ items: detailedItems, addItem, updateQty, removeItem, clear, products, productsLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
