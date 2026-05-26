import styles from "./Hero.module.css";

type Props = { cv: any };

export default function Hero({ cv }: Props) {
  return (
    <header className={styles.hero}>
      <div className={styles.grid}>
        <div>
          <h1 className={`${styles.name} animate-fade-up delay-100`}>
            {cv.name.first} <span>{cv.name.last}</span>
          </h1>
          <p className={`${styles.role} animate-fade-up delay-200`}>
            {cv.role.split("|").map((part: string, i: number) => (
              <span key={i}>{part}</span>
            ))}
          </p>
          <p className={`${styles.summary} animate-fade-up delay-300`}>{cv.summary}</p>
          <div className={`${styles.tags} animate-fade-up delay-400`}>
            <span className={styles.tag}>{cv.location}</span>
            <span className={styles.tag}>{cv.availability}</span>
            <span className={styles.tag}>{cv.yearsExp} yrs experience</span>
          </div>
        </div>
        <div className={`${styles.card} animate-fade-in delay-300`}>
          <div className={styles.avatar}>DCW</div>
          <div className={styles.divider} />
          <div className={styles.degreeBlock}>
            <p className={styles.degreeHons}>First Class BSc (Hons)</p>
            <p className={styles.degreeTitle}>Mathematics &amp; Computing</p>
            <p className={styles.degreeInst}>University of Hertfordshire</p>
          </div>
        </div>
      </div>
    </header>
  );
}
