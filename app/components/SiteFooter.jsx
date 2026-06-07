import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <p>Contact Us</p>
        <p>Terms & Conditions</p>
        <p>Privacy Policy</p>
        <p>Shipping Policy</p>
        <p>Refund Policy</p>
        <Link href="/track-order" className="footer-link">Track Your Order</Link>
      </div>

      <p className="footer-note">Blooming Partners Nursery © {new Date().getFullYear()}</p>
    </footer>
  );
}
