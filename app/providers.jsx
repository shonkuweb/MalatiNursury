"use client";

import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
      <CartSidebar />
    </CartProvider>
  );
}
