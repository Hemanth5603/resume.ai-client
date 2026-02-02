"use client";

import styles from "../styles/HeroSection.module.css";
import FeaturesSection from "./FeaturesSection";
import ResumeComparisonSection from "./ResumeComparisonSection";
import ProcessFlowSection from "./ProcessFlowSection";

const HeroSection = () => {

  return (
    <>
    <div className={styles.heroSection}>
      <h1 className={styles.heroTitle}>
      CURATE YOUR PROFESSIONAL NARRATIVE
      <br />
      WITH SURGICAL PRECISION
      </h1>
      <FeaturesSection />
      <ProcessFlowSection />
      <ResumeComparisonSection />
      
    </div>
    </>
  )
}

export default HeroSection;