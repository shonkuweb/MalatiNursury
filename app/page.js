"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiChevronRight,
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
import { FaLeaf, FaSeedling, FaTree, FaWhatsapp } from "react-icons/fa";
import { GiFlowerPot, GiFlowerTwirl } from "react-icons/gi";
import { products } from "./data/products";
import { categories as menuCategories } from "./data/categories";
import SiteFooter from "./components/SiteFooter";
import { useCart } from "./context/CartContext";

const categories = [
  { label: "Seed", tone: "tone-a", icon: FaSeedling },
  { label: "Indoor", tone: "tone-b", icon: GiFlowerPot },
  { label: "Bougainvillea", tone: "tone-c", active: true, icon: GiFlowerTwirl },
  { label: "Planters", tone: "tone-d", icon: GiFlowerPot }
];


export default function Home() {
  const heroEndRef = useRef(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const checkHero = () => {
      if (!heroEndRef.current) return;
      const heroEndTop = heroEndRef.current.getBoundingClientRect().top;
      const atTop = window.scrollY <= 4;

      // Show nav right after the hero block ends. Keep it visible while
      // scrolling upward, and hide only when the website top is visible.
      setShowBottomNav((prev) => {
        if (atTop) return false;
        if (heroEndTop <= 0) return true;
        return prev;
      });
    };

    checkHero();
    window.addEventListener("scroll", checkHero, { passive: true });
    window.addEventListener("resize", checkHero);

    return () => {
      window.removeEventListener("scroll", checkHero);
      window.removeEventListener("resize", checkHero);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main className="mobile-page">
      <div className="top-strip">Free Delivery Above ₹4999 | Shop Now</div>

      <header className="header">
        <button className="icon-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <FiMenu />
        </button>
        <Link href="/" className="header-center" aria-label="Blooming Partners Nursery home" style={{ textDecoration: 'none', color: '#1f6b2c', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.2' }}>
          Blooming Partners Nursery
        </Link>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Shopping bag">
            <FiShoppingBag />
          </button>
        </div>
      </header>

      <div className="search-wrap">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search plants, pots..." 
            aria-label="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="category-row" aria-label="Plant categories">
        {categories.map((category) => (
          <article key={category.label} className="category">
            <div className={`category-icon ${category.tone}`}>
              <category.icon />
            </div>
            <p className={category.active ? "active-category" : ""}>{category.label}</p>
          </article>
        ))}
      </section>

      <section className="hero">
        <div className="hero-overlay">
          <span className="badge">NEW ARRIVALS</span>
          <h2>Bring Life to Your Home</h2>
          <p>Explore our curated collection of indoor plants.</p>
          <button className="cta-btn">Shop Now</button>
        </div>
      </section>
      <div ref={heroEndRef} aria-hidden="true" />

      <div className="notice">
        <p className="notice-track">
          For product replacement, please record a continuous, single-shot video while opening the package.
        </p>
      </div>

      <section className="best-sellers">
        <div className="section-head">
          <h3>{searchQuery ? "Search Results" : "Best Sellers"}</h3>
          {!searchQuery && <a href="/">View all</a>}
        </div>
        <div className="product-row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article key={product.title} className="product-card">
                <span className="offer-pill">{product.offer}</span>
                <Link href={`/product/${product.slug}`} className="product-image-link">
                  <div className={`product-image ${product.imageClass}`} />
                </Link>
                <div className="product-info">
                  <p className="product-title">{product.title}</p>
                  <p className="product-rating">☆ ☆ ☆ ☆ ☆ {product.rating} | {product.reviews}</p>
                  <div className="price-row">
                    <strong>{product.price}</strong>
                    <span>{product.oldPrice}</span>
                  </div>
                  <button className="add-btn" onClick={() => addItem(product.slug, 1)}>
                    Add to Cart
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "#666" }}>
              No products found matching "{searchQuery}".
            </p>
          )}
        </div>
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
          <Link href="/product/buttercup" onClick={() => setMenuOpen(false)}>
            Product Details <FiChevronRight />
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

      <nav className={`bottom-nav ${showBottomNav ? "visible" : ""}`} aria-label="Primary navigation">
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
