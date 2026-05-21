import sectionStyles from "./Section.module.css";
import styles from "./Contact.module.css";

type Props = { contact: { email: string; phone: string; github: string }; location: string };

export default function Contact({ contact, location }: Props) {
  return (
    <section id="contact">
      <p className={`${sectionStyles.label} animate-fade-up`}>Contact</p>
      <div className={`${styles.links} animate-fade-up delay-100`}>
        <a href={`mailto:${contact.email}`} className={styles.link}>
          <i className="ti ti-mail" aria-hidden="true" />{contact.email}
        </a>
        <a href={`tel:${contact.phone.replace(/\s/g,"")}`} className={styles.link}>
          <i className="ti ti-phone" aria-hidden="true" />{contact.phone}
        </a>
        <span className={styles.link}>
          <i className="ti ti-brand-github" aria-hidden="true" />{contact.github}
        </span>
        <span className={styles.link}>
          <i className="ti ti-map-pin" aria-hidden="true" />{location}
        </span>
      </div>
    </section>
  );
}
