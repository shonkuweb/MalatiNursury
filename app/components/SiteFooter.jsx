import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <p>Contact Us</p>
        <Link href="/track-order" className="footer-link">Track Your Order</Link>
      </div>

      <p className="footer-note">Malati Nursury © {new Date().getFullYear()}</p>
    </footer>
  );
}
