import { cv } from "@/lib/cv-data";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Interests from "@/components/Interests";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles.navWrap}>
        <Nav />
      </div>
      <div className={styles.pageWrap}>
        <Hero cv={cv} />
        <div className={styles.body}>
          <div className={styles.bodyGrid}>
            <div className={styles.mainCol}>
              <Experience jobs={cv.experience} />
            </div>
            <aside className={styles.sideCol}>
              <Skills skills={cv.skills} />
              <Education education={cv.education} />
              <Interests text={cv.interests} />
            </aside>
          </div>
          <div className={styles.contactWrap}>
            <Contact contact={cv.contact} location={cv.location} />
          </div>
        </div>
      </div>
      <Footer name={`${cv.name.first} ${cv.name.last}`} />
    </main>
  );
}
