import styles from "./Footer.module.css";

type Props = { name: string };

export default function Footer({ name }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>© {new Date().getFullYear()} {name}</span>
      </div>
    </footer>
  );
}
