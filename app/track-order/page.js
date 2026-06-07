"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  FiChevronRight,
  FiCheck,
  FiClipboard,
  FiGrid,
  FiHome,
  FiMenu,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiX
} from "react-icons/fi";
import { FaWhatsapp, FaBoxOpen, FaHome, FaShippingFast } from "react-icons/fa";
import { categories as menuCategories } from "../data/categories";
import SiteFooter from "../components/SiteFooter";

const STEPS = [
  { key: "Pending", label: "Order Placed", desc: "We have received your order.", icon: FiClipboard },
  { key: "Packed", label: "Packed", desc: "Your plants are carefully packed.", icon: FaBoxOpen },
  { key: "Shipped", label: "Shipped", desc: "On the way to your address.", icon: FaShippingFast },
  { key: "Delivered", label: "Delivered", desc: "Enjoy your new green friends!", icon: FaHome }
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const lookup = (id) => {
    if (!id) return;
    try {
      const orders = JSON.parse(localStorage.getItem("admin-orders") || "[]");
      const found = orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
      setOrder(found || null);
    } catch {
      setOrder(null);
    }
    setSearched(true);
  };

  useEffect(() => {
    if (initialId) lookup(initialId);
  }, [initialId]);

  const currentStep = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <>
      <div className="track-hero">
        <span className="track-hero-icon">
          <FiTruck />
        </span>
        <h1>Track Your Order</h1>
        <p>Enter your order ID to see the latest delivery status.</p>
        <div className="track-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup(query)}
            placeholder="e.g. KN-123456"
            aria-label="Order ID"
          />
          <button type="button" onClick={() => lookup(query)}>
            Track
          </button>
        </div>
      </div>

      <section className="track-body">
        {!searched && (
          <div className="track-placeholder">
            <FiPackage />
            <p>Your order journey will appear here.</p>
          </div>
        )}

        {searched && !order && (
          <div className="track-notfound">
            <p>No order found for "{query}".</p>
            <span>Double-check the ID, or place an order to start tracking.</span>
            <Link href="/" className="add-btn">
              Continue Shopping
            </Link>
          </div>
        )}

        {order && (
          <>
            <div className="track-summary-card">
              <div className="track-summary-head">
                <div>
                  <span className="track-label">Order ID</span>
                  <strong>{order.id}</strong>
                </div>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="track-summary-meta">
                <p>
                  <span>Customer</span>
                  <strong>{order.customer}</strong>
                </p>
                <p>
                  <span>Total</span>
                  <strong>{order.total}</strong>
                </p>
                {order.placedAt && (
                  <p>
                    <span>Placed on</span>
                    <strong>{new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="track-timeline">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const done = index < currentStep;
                const active = index === currentStep;
                return (
                  <div key={step.key} className={`track-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                    <div className="track-step-marker">
                      <span className="track-step-dot">{done ? <FiCheck /> : <Icon />}</span>
                      {index < STEPS.length - 1 && <span className="track-step-line" />}
                    </div>
                    <div className="track-step-info">
                      <strong>{step.label}</strong>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {order.items && order.items.length > 0 && (
              <div className="track-items-card">
                <h3>Items in this order</h3>
                {order.items.map((item, idx) => (
                  <div className="track-item" key={`${item.title}-${idx}`}>
                    <span>
                      {item.title} × {item.qty}
                    </span>
                    <strong>{item.price}</strong>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default function TrackOrderPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main className="mobile-page product-page">
      <div className="top-strip">Free Delivery Above ₹4999 | Shop Now</div>

      <header className="header">
        <button className="icon-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <FiMenu />
        </button>
        <Link href="/" className="header-center" aria-label="Blooming Partners Nursery home" style={{ textDecoration: 'none', color: '#1f6b2c', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.2' }}>
          Blooming Partners Nursery
        </Link>
        <div className="header-actions">
          <Link href="/cart" className="icon-btn" aria-label="Shopping bag">
            <FiShoppingBag />
          </Link>
        </div>
      </header>

      <div className="search-wrap">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search plants, pots..." aria-label="Search" />
        </div>
      </div>

      <Suspense fallback={<div className="track-body"><div className="track-placeholder"><FiPackage /><p>Loading…</p></div></div>}>
        <TrackOrderContent />
      </Suspense>

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
          <Link href="/track-order" onClick={() => setMenuOpen(false)}>
            Track Order <FiChevronRight />
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
        <Link href="/track-order" className="bottom-item" aria-label="Track order">
          <span className="bottom-icon">
            <FiTruck />
          </span>
          <span>Track Order</span>
        </Link>
      </nav>
    </main>
  );
}
