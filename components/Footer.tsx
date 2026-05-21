import styles from "./Footer.module.css";

type Props = { name: string };

export default function Footer({ name }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>© {new Date().getFullYear()} {name}</span>
        <span className={styles.built}>
          Built with <a href="https://nextjs.org" target="_blank" rel="noreferrer">Next.js</a>
        </span>
      </div>
    </footer>
  );
}
