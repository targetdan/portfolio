import Nav from "@/components/Nav";
import ConvexHullDemo from "./ConvexHullDemo";
import styles from "../page.module.css";

export const metadata = { title: "Computational Geometry - Dan Church-Wilsher" };

export default function ComputationalGeometryPage() {
  return (
    <main>
      <div className={styles.navWrap}>
        <Nav />
      </div>
      <div className={styles.pageWrap}>
        <div className={styles.body}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 800,
            color: "var(--slate-900)",
            letterSpacing: "-0.5px",
            marginBottom: "0.35rem",
          }}>
            Computational Geometry
          </h1>
          <p style={{ fontSize: "13px", color: "var(--slate-500)", marginBottom: "0.25rem" }}>
            Interactive algorithm visualisation · 3D Convex Hull
          </p>
          <ConvexHullDemo />
        </div>
      </div>
    </main>
  );
}
