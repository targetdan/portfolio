import sectionStyles from "./Section.module.css";
import styles from "./Interests.module.css";

type Props = { text: string };

export default function Interests({ text }: Props) {
  return (
    <section id="interests">
      <p className={`${sectionStyles.label} animate-fade-up`}>Hobbies &amp; Interests</p>
      <p className={`${styles.text} animate-fade-up delay-100`}>{text}</p>
    </section>
  );
}
