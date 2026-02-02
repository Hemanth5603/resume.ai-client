import React from "react";
import Image from "next/image";
import styles from "../styles/ResumeComparisonSection.module.css";

const ResumeComparisonSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.comparisonCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>Transform Your Resume</h2>
            <p className={styles.subtitle}>See the difference AI makes</p>
          </div>
          
          <div className={styles.comparisonGrid}>
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageLabel}>Before</div>
                <div className={styles.imageBorder}>
                  <Image
                    src="/resume_before.jpg"
                    alt="Resume before AI tailoring"
                    width={400}
                    height={600}
                    className={styles.resumeImage}
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.arrowContainer}>
              <div className={styles.arrow}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 20H25M25 20L20 15M25 20L20 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageLabel}>After</div>
                <div className={styles.imageBorder}>
                  <Image
                    src="/resume_after.jpg"
                    alt="Resume after AI tailoring"
                    width={400}
                    height={600}
                    className={styles.resumeImage}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeComparisonSection;
