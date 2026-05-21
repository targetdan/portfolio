"use client";
import sectionStyles from "./Section.module.css";
import styles from "./Contact.module.css";
import { openEmail } from "@/lib/contact";

export default function Contact() {
  return (
    <section id="contact">
      <p className={`${sectionStyles.label} animate-fade-up`}>Contact</p>
      <div className={`${styles.links} animate-fade-up delay-100`}>
        <button onClick={openEmail} className={styles.link}>
          <i className="ti ti-mail" aria-hidden="true" />Get in touch
        </button>
      </div>
    </section>
  );
}
