import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "../styles/FeaturesSection.module.css";

const AIRefactoringIllustration = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.illustration}
  >
    <circle cx="60" cy="60" r="50" fill="#EFF6FF" />
    <path
      d="M40 50L50 60L40 70M80 50L70 60L80 70"
      stroke="#3B82F6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="50" y="45" width="20" height="30" rx="4" fill="#3B82F6" opacity="0.2" />
    <path
      d="M55 55H65M55 60H65M55 65H65"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="60" cy="30" r="8" fill="#8B5CF6" />
    <path
      d="M60 22V26M60 34V38M52 30H48M72 30H76M56.343 23.657L58.828 26.142M58.828 33.858L56.343 36.343M63.657 23.657L61.172 26.142M61.172 33.858L63.657 36.343"
      stroke="#8B5CF6"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SmartRegenerationIllustration = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.illustration}
  >
    <circle cx="60" cy="60" r="50" fill="#F0FDF4" />
    <path
      d="M35 60C35 46.1929 46.1929 35 60 35C73.8071 35 85 46.1929 85 60C85 73.8071 73.8071 85 60 85C46.1929 85 35 73.8071 35 60Z"
      stroke="#10B981"
      strokeWidth="3"
      strokeDasharray="4 4"
    />
    <circle cx="60" cy="60" r="25" fill="#10B981" opacity="0.2" />
    <path
      d="M50 60L58 68L70 52"
      stroke="#10B981"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 30L35 35M85 30L80 35M30 90L35 85M85 90L80 85"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="25" cy="25" r="3" fill="#10B981" />
    <circle cx="95" cy="25" r="3" fill="#10B981" />
    <circle cx="25" cy="95" r="3" fill="#10B981" />
    <circle cx="95" cy="95" r="3" fill="#10B981" />
  </svg>
);

const PrecisionTuningIllustration = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.illustration}
  >
    <circle cx="60" cy="60" r="50" fill="#FEF3C7" />
    <rect x="45" y="40" width="30" height="40" rx="4" fill="#F59E0B" opacity="0.2" />
    <path
      d="M50 50H70M50 55H70M50 60H70M50 65H70M50 70H65"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="55" cy="50" r="2" fill="#F59E0B" />
    <circle cx="55" cy="60" r="2" fill="#F59E0B" />
    <circle cx="55" cy="70" r="2" fill="#F59E0B" />
    <path
      d="M35 45L40 50L35 55M85 45L80 50L85 55M35 75L40 70L35 65M85 75L80 70L85 65"
      stroke="#F59E0B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 60H35M85 60H90"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const features = [
  {
    illustration: <AIRefactoringIllustration />,
    title: "AI Refactoring",
    description: "Analyze and restructure your resume for maximum impact.",
  },
  {
    illustration: <SmartRegenerationIllustration />,
    title: "Smart Re-generation",
    description:
      "Generate tailored content based on your target job description.",
  },
  {
    illustration: <PrecisionTuningIllustration />,
    title: "Precision Fine-tuning",
    description: "Polish every detail to match industry standards.",
  },
];

const FeaturesSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.illustrationWrapper}>
                  {feature.illustration}
                </div>
                <div className={styles.plusIcon}>
                  <FaPlus />
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.title}>{feature.title}</h3>
                <p className={styles.description}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
