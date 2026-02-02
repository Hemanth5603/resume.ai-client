import React from "react";
import Image from "next/image";
import styles from "../styles/ProcessFlowSection.module.css";

const ProcessFlowSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.flowCard}>
          <div className={styles.imageWrapper}>
            <Image
              src="/flow_diagram.png"
              alt="Resume AI Process Flow"
              width={900}
              height={900}
              className={styles.processImage}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlowSection;
