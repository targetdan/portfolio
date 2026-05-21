"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { openEmail } from "@/lib/contact";
import styles from "./Nav.module.css";

const links = [
  { href: "/woodworking", label: "Woodworking" },
  { href: "/computational-geometry", label: "Computational Geometry" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""} animate-fade-in`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>Dan <span>Church-Wilsher</span></Link>
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
        <button onClick={openEmail} className={styles.cta}>
          Get in touch
        </button>
      </div>
    </nav>
  );
}
