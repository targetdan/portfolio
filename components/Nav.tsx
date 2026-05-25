"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { openEmail } from "@/lib/contact";
import styles from "./Nav.module.css";

const links = [
  // { href: "/woodworking", label: "Woodworking" },
  { href: "/computational-geometry", label: "Computational Geometry" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""} animate-fade-in`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            Dan <span>Church-Wilsher</span>
          </Link>

          {/* Desktop links */}
          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`${styles.link} ${pathname === l.href ? styles.active : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <button onClick={openEmail} className={styles.cta}>
            Get in touch
          </button>

          {/* Hamburger button — visible below 1080px */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul className={styles.drawerLinks}>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`${styles.drawerLink} ${pathname === l.href ? styles.active : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={() => { openEmail(); setMenuOpen(false); }} className={styles.drawerCta}>
          Get in touch
        </button>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-hidden />
      )}
    </>
  );
}
