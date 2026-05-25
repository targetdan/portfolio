"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { generateSteps, DEMO_POINTS } from "@/lib/convexHull3D";
import styles from "./demo.module.css";
// Render unit-vector hat notation above the base letter via superscript
function renderFormula(line: string): string {
  const withHat = (c: string) =>
    `<span style="position:relative;display:inline-block;">${c}<span style="position:absolute;top:-0.0025em;left:50%;transform:translateX(-50%);font-size:0.65em;line-height:1;">^</span></span>`;
  return line
    .replace(/(.)̂/g, (_, c: string) => withHat(c))
    .replace(/ŷ/g, withHat('y'))
    .replace(/ẑ/g, withHat('z'));
}

const ConvexHullScene = dynamic(() => import("./ConvexHullScene"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#060d1a" }} />,
});

const PHASE_LABELS: Record<string, string> = {
  init: "Initialisation",
  tetrahedron: "Simplex",
  expand: "Expansion",
  complete: "Complete",
};

export default function ConvexHullDemo() {
  const steps = useMemo(() => generateSteps(DEMO_POINTS), []);
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const progress = ((current) / (steps.length - 1)) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.intro}>
        <p className={styles.introTitle}>QuickHull - 3D Convex Hull</p>
        <p className={styles.introText}>
          The following demonstration steps through the QuickHull algorithm applied to a synthetic
          LiDAR point cloud representing a building survey. QuickHull is the algorithm at the
          core of Qhull - the computational geometry library used in AutoCAD, MATLAB, SciPy, and
          many professional BIM toolchains. Click <em>Next</em> to advance through each stage.
          The model is interactive, feel free to rotate and zoom!
        </p>
      </div>

      <div className={styles.demo}>
        {/* 3D viewer */}
        <div className={styles.viewer}>
          <div className={styles.canvasWrap}>
            <ConvexHullScene step={step} points={DEMO_POINTS} />
          </div>

          <div className={styles.controls}>
            <button
              className={`${styles.btn} ${styles.btnReset}`}
              disabled={current === 0}
              onClick={() => setCurrent(0)}
              title="Reset to first step"
            >
              ↺
            </button>
            <button
              className={styles.btn}
              disabled={current === 0}
              onClick={() => setCurrent((s) => s - 1)}
            >
              ← Prev
            </button>
            <div className={styles.progress}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.stepCounter}>
              {current + 1} / {steps.length}
            </span>
            <button
              className={styles.btn}
              disabled={current === steps.length - 1}
              onClick={() => setCurrent((s) => s + 1)}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <div className={styles.phaseRow}>
              <span className={`${styles.phasePill} ${styles[`phase-${step.phase}`]}`}>
                {PHASE_LABELS[step.phase]}
              </span>
              <span className={styles.stepNum}>Step {current + 1}</span>
            </div>

            <h2 className={styles.stepTitle}>{step.title}</h2>

            <div className={styles.divider} />

            <div className={styles.stepContent}>
              {step.content.map((seg, i) =>
                seg.type === 'text' ? (
                  <p key={i} className={styles.stepDesc}>{seg.value}</p>
                ) : (
                  <div key={i} className={styles.formulaBlock}>
                    {seg.lines.map((line, j) => (
                      <div key={j} className={styles.formula} dangerouslySetInnerHTML={{ __html: renderFormula(line) }} />
                    ))}
                  </div>
                )
              )}
            </div>

            <div className={styles.divider} />

            <div className={styles.legend}>
              <p className={styles.legendTitle}>Colour Key</p>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ background: "#22d3ee" }} />
                Extreme / highlighted points
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ background: "#f97316" }} />
                Active point being added
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ background: "#475569" }} />
                Unprocessed survey points
              </div>
              <div className={styles.legendItem}>
                <span className={styles.swatch} style={{ background: "rgba(59,130,246,0.45)" }} />
                Confirmed hull faces
              </div>
              <div className={styles.legendItem}>
                <span className={styles.swatch} style={{ background: "rgba(239,68,68,0.55)" }} />
                Visible faces (to be removed)
              </div>
              <div className={styles.legendItem}>
                <span className={styles.swatch} style={{ background: "rgba(16,185,129,0.55)" }} />
                Newly created faces
              </div>
              <div className={styles.legendItem}>
                <span className={styles.swatch} style={{ background: "#fbbf24", height: "2px", borderRadius: "1px" }} />
                Horizon edges
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
