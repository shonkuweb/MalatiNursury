"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiChevronRight,
  FiGrid,
  FiHome,
  FiMinus,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiTruck,
  FiX
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { categories as menuCategories } from "../data/categories";
import SiteFooter from "../components/SiteFooter";

export default function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items: cartItems, updateQty, removeItem } = useCart();

  const toAmount = (value) => {
    const match = String(value).replace(/,/g, "").match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + toAmount(i.price) * i.qty, 0);
  const savings = cartItems.reduce((sum, i) => sum + (toAmount(i.oldPrice) - toAmount(i.price)) * i.qty, 0);
  const deliveryCharge = subtotal >= 4999 ? 0 : 40;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main className="mobile-page product-page">
      <section className="cart-shell">
        <div className="cart-head">
          <h1>My Cart</h1>
          {cartItems.length > 0 && <span className="cart-count">{itemCount} item{itemCount > 1 ? "s" : ""}</span>}
        </div>
        {savings > 0 && (
          <div className="savings-banner">🎉 You're saving Rs. {savings.toFixed(0)} on this order!</div>
        )}
        {cartItems.length === 0 && (
          <div className="empty-block">
            <div className="empty-emoji">🪴</div>
            <p>Your cart is empty.</p>
            <Link className="add-btn" href="/">
              Continue Shopping
            </Link>
          </div>
        )}

        {cartItems.map((item) => (
          <article className="cart-item" key={item.slug}>
            <div className={`cart-thumb ${item.imageClass}`} />
            <div className="cart-meta">
              <p>{item.title}</p>
              <strong>{item.price}</strong>
              <span>{item.oldPrice}</span>
              <div className="qty-box">
                <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(item.slug, item.qty - 1)}>
                  <FiMinus />
                </button>
                <strong>{item.qty}</strong>
                <button type="button" aria-label="Increase quantity" onClick={() => updateQty(item.slug, item.qty + 1)}>
                  <FiPlus />
                </button>
              </div>
            </div>
            <button type="button" className="cart-remove" aria-label="Remove item" onClick={() => removeItem(item.slug)}>
              <FiTrash2 />
            </button>
          </article>
        ))}

        {cartItems.length > 0 && (
          <>
            <div className="bill-card">
              <h3>Bill Details</h3>
              <p>
                <span>Item Total</span>
                <strong>Rs. {subtotal.toFixed(2)}</strong>
              </p>
              {savings > 0 && (
                <p className="bill-savings">
                  <span>Discount</span>
                  <strong>− Rs. {savings.toFixed(2)}</strong>
                </p>
              )}
              <p>
                <span>Delivery Charge</span>
                <strong>{deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge.toFixed(2)}`}</strong>
              </p>
              <p className="bill-total">
                <span>To Pay</span>
                <strong>Rs. {(subtotal + deliveryCharge).toFixed(2)}</strong>
              </p>
            </div>

            <Link href="/checkout" className="add-btn cart-checkout-btn">
              Proceed to Checkout
            </Link>

            <div className="cart-trust-row">
              <div className="cart-trust-item">
                <FiShield />
                <span>Secure Payments</span>
              </div>
              <div className="cart-trust-item">
                <FiTruck />
                <span>Fast Delivery</span>
              </div>
              <div className="cart-trust-item">
                <FiRefreshCw />
                <span>14-Day Replace</span>
              </div>
            </div>
          </>
        )}
      </section>

      <SiteFooter />

      {menuOpen && <button className="menu-overlay" aria-label="Close menu overlay" onClick={() => setMenuOpen(false)} />}
      <aside className={`side-menu ${menuOpen ? "open" : ""}`} aria-label="Website menu">
        <div className="side-menu-head">
          <strong>Menu</strong>
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <FiX />
          </button>
        </div>
        <nav className="side-menu-links">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home <FiChevronRight />
          </Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            Cart <FiChevronRight />
          </Link>
          <Link href="/checkout" onClick={() => setMenuOpen(false)}>
            Checkout <FiChevronRight />
          </Link>

        </nav>
        <div className="menu-categories">
          <p>Categories</p>
          <div className="menu-category-grid">
            {menuCategories.map((item) => (
              <button key={item} type="button" className="menu-category-item" onClick={() => setMenuOpen(false)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <button className="whatsapp-fab" aria-label="WhatsApp">
        <FaWhatsapp />
      </button>

      <nav className="bottom-nav visible" aria-label="Primary navigation">
        <Link href="/" className="bottom-item" aria-label="Home">
          <span className="bottom-icon">
            <FiHome />
          </span>
          <span>Home</span>
        </Link>
        <button className="bottom-item" type="button" aria-label="Menu" onClick={() => setMenuOpen(true)}>
          <span className="bottom-icon">
            <FiGrid />
          </span>
          <span>Menu</span>
        </button>
        <Link href="/cart" className="bottom-item" aria-label="Cart">
          <span className="bottom-icon">
            <FiPackage />
          </span>
          <span>Cart</span>
        </Link>
        
      </nav>
    </main>
  );
}
