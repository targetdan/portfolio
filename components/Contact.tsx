import sectionStyles from "./Section.module.css";
import styles from "./Contact.module.css";

type Props = { contact: { email: string }; location: string };

export default function Contact({ contact, location }: Props) {
  return (
    <section id="contact">
      <p className={`${sectionStyles.label} animate-fade-up`}>Contact</p>
      <div className={`${styles.links} animate-fade-up delay-100`}>
        <a href={`mailto:${contact.email}`} className={styles.link}>
          <i className="ti ti-mail" aria-hidden="true" />{contact.email}
        </a>
        <span className={styles.link}>
          <i className="ti ti-map-pin" aria-hidden="true" />{location}
        </span>
      </div>
    </section>
  );
}
