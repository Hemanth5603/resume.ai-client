import React from "react";
import { FaEdit, FaMagic, FaSlidersH, FaPlus } from "react-icons/fa";
import styles from "../styles/FeaturesSection.module.css";

const features = [
  {
    icon: <FaEdit className="w-8 h-8" />,
    title: "AI Refactoring",
    description: "Analyze and restructure your resume for maximum impact.",
  },
  {
    icon: <FaMagic className="w-8 h-8" />,
    title: "Smart Re-generation",
    description:
      "Generate tailored content based on your target job description.",
  },
  {
    icon: <FaSlidersH className="w-8 h-8" />,
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
                <div className={styles.iconWrapper}>{feature.icon}</div>
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
