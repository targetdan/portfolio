"use client";
import { useState, useEffect } from "react";
import styles from "./Nav.module.css";

const links = [
  { href: "#employment", label: "Employment" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#interests", label: "Interests" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""} animate-fade-in`}>
      <div className={styles.inner}>
        <span className={styles.logo}>Dan <span>Church-Wilsher</span></span>
        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`${styles.link} ${active === l.href ? styles.active : ""}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="mailto:danielwilsher@hotmail.co.uk" className={styles.cta}>
          Get in touch
        </a>
      </div>
    </nav>
  );
}
