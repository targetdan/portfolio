import Nav from "@/components/Nav";
import styles from "../page.module.css";

export const metadata = { title: "Woodworking - Dan Church-Wilsher" };

export default function WoodworkingPage() {
  return (
    <main>
      <div className={styles.navWrap}>
        <Nav />
      </div>
      <div className={styles.pageWrap}>
        <div className={styles.body}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
            Woodworking
          </h1>
          <p style={{ color: "var(--slate-500)", lineHeight: 1.8 }}>Coming soon.</p>
        </div>
      </div>
    </main>
  );
}
