"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiChevronRight,
  FiChevronDown,
  FiGrid,
  FiHome,
  FiMenu,
  FiMinus,
  FiPackage,
  FiPlus,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiUser,
  FiX
} from "react-icons/fi";
import { FaWhatsapp, FaLeaf } from "react-icons/fa";
import { categories as menuCategories } from "../../data/categories";
import { useCart } from "../../context/CartContext";
import SiteFooter from "../../components/SiteFooter";

const accordionData = [
  {
    title: "Product Description",
    body: "A lush, hand-picked plant nurtured in our Kolkata nursery. Each plant is healthy, well-rooted and ready to thrive in your home or balcony garden with minimal care."
  },
  {
    title: "Plant Care Tips",
    body: "Place in bright, indirect sunlight. Water when the top inch of soil feels dry, roughly twice a week. Avoid overwatering and ensure the pot has good drainage."
  },
  {
    title: "Delivery & Returns",
    body: "Dispatched within 24 hours with safe, breathable packaging. One-day delivery across Kolkata and a 14-day replacement guarantee on every order."
  }
];

const highlights = [
  "Healthy, well-rooted live plant",
  "Air-purifying & easy to maintain",
  "Ships in protective eco packaging",
  "14-day replacement guarantee"
];

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const [menuOpen, setMenuOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(0);
  const { addItem, products, productsLoading } = useCart();
  const product = products.find((item) => item.slug === slug);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (productsLoading) {
    return (
      <main className="mobile-page product-page">
        <div className="top-strip">Loading...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mobile-page product-page">
        <div className="top-strip">Product not found</div>
      </main>
    );
  }

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const ratingValue = Math.round(parseFloat(product.rating));

  return (
    <main className="mobile-page product-page">

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

      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Best Sellers</span>
        <span>/</span>
        <span className="crumb-muted">{product.title}</span>
      </div>

      <section className="product-hero-image">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span className="hero-badge">{product.offer}</span>
          <span className="hero-leaf"><FaLeaf /> Live Plant</span>
        </div>
      </section>

      <section className="product-detail-body">
        <p className="brand-eyebrow">Blooming Partners Nursery · Best Seller</p>
        <h1>{product.title}</h1>

        <div className="rating-line">
          <span className="stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <FiStar key={n} className={n <= ratingValue ? "star filled" : "star"} />
            ))}
          </span>
          <strong>{product.rating}</strong>
          <span className="rating-count">({product.reviews} reviews)</span>
        </div>

        <p className="urgent-pill">🔥 36 sold in the last 24 hours</p>

        <div className="price-row">
          <strong>₹{product.price}</strong>
          {product.oldPrice && <span>₹{product.oldPrice}</span>}
          <em className="offer-pill inline">{product.offer}</em>
        </div>
        <p className="tax-note">Inclusive of all taxes · Free delivery above ₹4999</p>
        <p className="viewing-now">👀 12 people are viewing this right now</p>

        <ul className="highlight-list">
          {highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="delivery-box">
          <p>Check delivery & availability</p>
          <div className="pin-row">
            <input placeholder="Enter Pincode" aria-label="Enter pincode" />
            <button type="button">Check</button>
          </div>
        </div>

        <div className="qty-row">
          <span>Qty:</span>
          <div className="qty-box">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <FiMinus />
            </button>
            <strong>{qty}</strong>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
              <FiPlus />
            </button>
          </div>
        </div>

        <div className="cta-row">
          <Link href="/cart" className="add-btn ghost" onClick={() => addItem(product.slug, qty)}>
            Add to Cart
          </Link>
          <Link href="/checkout" className="add-btn" onClick={() => addItem(product.slug, qty)}>
            Buy It Now
          </Link>
        </div>

        <div className="trust-row">
          <div className="trust-item">
            <FiTruck />
            <span>1-Day Delivery</span>
          </div>
          <div className="trust-item">
            <FiShield />
            <span>14-Day Replacement</span>
          </div>
          <div className="trust-item">
            <FaLeaf />
            <span>Expert Guidance</span>
          </div>
        </div>
      </section>

      <section className="accordion-block">
        {accordionData.map((item, index) => {
          const isOpen = openAccordion === index;
          return (
            <div key={item.title} className={`accordion-item ${isOpen ? "open" : ""}`}>
              <button type="button" onClick={() => setOpenAccordion(isOpen ? -1 : index)}>
                {item.title}
                <FiChevronDown className="accordion-caret" />
              </button>
              {isOpen && <p className="accordion-body">{item.body}</p>}
            </div>
          );
        })}
      </section>

      <section className="recommend-wrap">
        <h3>You May Also Like</h3>
        <div className="recommend-row">
          {related.map((item) => (
            <article key={item.slug} className="recommend-card">
              <span className="offer-pill">{item.offer}</span>
              <Link href={`/product/${item.slug}`} className={`product-image ${item.imageClass}`} />
              <div className="product-info">
                <p className="product-title">{item.title}</p>
                <div className="price-row">
                  <strong>{item.price}</strong>
                  <span>{item.oldPrice}</span>
                </div>
                <Link href={`/product/${item.slug}`} className="add-btn">View</Link>
              </div>
            </article>
          ))}
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
