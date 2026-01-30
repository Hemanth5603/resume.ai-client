"use client";

import ProcessingAnimation from "../ProcessingAnimation";
import styles from "../../styles/wizard-steps/ProcessingStep.module.css";

interface ProcessingStepProps {
  progress: number;
}

export default function ProcessingStep({ progress }: ProcessingStepProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Creating Your Optimized Resume</h2>
        <p className={styles.subtitle}>
          Our AI is analyzing your resume and tailoring it to match the job
          requirements. This usually takes 10-30 seconds.
        </p>
      </div>

      <ProcessingAnimation progress={progress} />

      <div className={styles.tips}>
        <h3 className={styles.tipsTitle}>💡 Did you know?</h3>
        <ul className={styles.tipsList}>
          <li>Tailored resumes get 60% more interview callbacks</li>
          <li>ATS systems scan for specific keywords from job descriptions</li>
          <li>Our AI optimizes your resume structure and content</li>
        </ul>
      </div>
    </div>
  );
}
