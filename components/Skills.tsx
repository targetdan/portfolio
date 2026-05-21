import sectionStyles from "./Section.module.css";
import styles from "./Skills.module.css";

type Props = { skills: { core: string[]; secondary: string[] } };

export default function Skills({ skills }: Props) {
  return (
    <section id="skills">
      <p className={`${sectionStyles.label} animate-fade-up`}>Skills</p>
      <div className={`${styles.group} animate-fade-up delay-100`}>
        <p className={styles.groupLabel}>Core</p>
        <div className={styles.list}>
          {skills.core.map((s) => (
            <span key={s} className={`${styles.skill} ${styles.core}`}>{s}</span>
          ))}
        </div>
      </div>
      <div className={`${styles.group} animate-fade-up delay-200`}>
        <p className={styles.groupLabel}>Also</p>
        <div className={styles.list}>
          {skills.secondary.map((s) => (
            <span key={s} className={styles.skill}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
