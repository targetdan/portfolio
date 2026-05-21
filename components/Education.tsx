import sectionStyles from "./Section.module.css";
import styles from "./Education.module.css";

type Props = {
  education: {
    degree: string;
    institution: string;
    period: string;
    modules: string[];
  };
};

export default function Education({ education }: Props) {
  return (
    <section id="education">
      <p className={`${sectionStyles.label} animate-fade-up`}>Education</p>
      <div className="animate-fade-up delay-100">
        <p className={styles.degree}>{education.degree}</p>
        <p className={styles.institution}>{education.institution}</p>
        <p className={styles.period}>{education.period}</p>
        <p className={styles.modulesLabel}>Modules included</p>
        {education.modules.map((m) => (
          <span key={m} className={styles.module}>{m}</span>
        ))}
      </div>
    </section>
  );
}
