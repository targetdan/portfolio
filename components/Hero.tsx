import styles from "./Hero.module.css";

type Props = { cv: any };

export default function Hero({ cv }: Props) {
  return (
    <header className={styles.hero}>
      <div className={styles.grid}>
        <div>
          <div className={`${styles.badge} animate-fade-up`}>
            <span className={styles.badgeDot} />
            Available for hire
          </div>
          <h1 className={`${styles.name} animate-fade-up delay-100`}>
            {cv.name.first} <span>{cv.name.last.split("-")[0]}-</span>{cv.name.last.split("-")[1]}
          </h1>
          <p className={`${styles.role} animate-fade-up delay-200`}>{cv.role}</p>
          <p className={`${styles.summary} animate-fade-up delay-300`}>{cv.summary}</p>
          <div className={`${styles.tags} animate-fade-up delay-400`}>
            <span className={styles.tag}>{cv.location}</span>
            <span className={styles.tag}>{cv.availability}</span>
            <span className={styles.tag}>{cv.yearsExp} yrs experience</span>
          </div>
        </div>
        <div className={`${styles.card} animate-fade-in delay-300`}>
          <div className={styles.avatar}>DW</div>
          <div className={styles.divider} />
          <div className={styles.contactList}>
            <a href={`mailto:${cv.contact.email}`} className={styles.contactItem}>
              <i className="ti ti-mail" aria-hidden="true" />
              {cv.contact.email}
            </a>
            <a href={`tel:${cv.contact.phone.replace(/\s/g, "")}`} className={styles.contactItem}>
              <i className="ti ti-phone" aria-hidden="true" />
              {cv.contact.phone}
            </a>
            <span className={styles.contactItem}>
              <i className="ti ti-brand-github" aria-hidden="true" />
              {cv.contact.github}
            </span>
          </div>
          <div className={styles.divider} />
          <span className={styles.contactItem} style={{ fontSize: "11px", lineHeight: "1.65", color: "rgba(148,163,184,0.7)" }}>
            1st Class BSc<br />Maths &amp; Computing<br />Univ. of Hertfordshire
          </span>
        </div>
      </div>
    </header>
  );
}
