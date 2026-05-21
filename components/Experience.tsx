import sectionStyles from "./Section.module.css";
import styles from "./Experience.module.css";

type Job = {
  title: string;
  company: string;
  location: string;
  period: string;
  responsibilities: string[];
  achievements: string[];
  tools: string[];
};
type Props = { jobs: Job[] };

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <article
      className={`${styles.job} animate-fade-up`}
      style={{ animationDelay: `${index * 120 + 100}ms` }}
    >
      <div className={styles.jobHeader}>
        <h3 className={styles.jobTitle}>{job.title}</h3>
        <span className={styles.jobPeriod}>{job.period}</span>
      </div>
      <p className={styles.jobCompany}>{job.company} · {job.location}</p>

      <p className={styles.subLabel}>Responsibilities</p>
      <ul className={styles.bullets}>
        {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
      </ul>

      <p className={styles.subLabel}>Achievements</p>
      <ul className={styles.bullets}>
        {job.achievements.map((a, i) => <li key={i}>{a}</li>)}
      </ul>

      <div className={styles.toolsWrap}>
        <div className={styles.tools}>
          {job.tools.map((t) => <span key={t} className={styles.tool}>{t}</span>)}
        </div>
      </div>
    </article>
  );
}

export default function Experience({ jobs }: Props) {
  return (
    <section id="employment">
      <p className={`${sectionStyles.label} animate-fade-up`}>Employment</p>
      {jobs.map((job, i) => <JobCard key={i} job={job} index={i} />)}
    </section>
  );
}
