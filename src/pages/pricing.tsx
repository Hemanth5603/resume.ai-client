"use client";

import styles from "@/app/components/dashboard/styles/Pricing.module.css";

export default function PricingPage() {
  return (
    <div className={styles.pricingContainer}>
      <div className={styles.comingSoonCard}>
        <div className={styles.iconWrapper}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className={styles.comingSoonTitle}>Pricing Coming Soon</h1>
        <p className={styles.comingSoonText}>
          We&apos;re currently working on introducing flexible pricing plans to make our resume optimization service accessible to everyone.
        </p>
        <p className={styles.comingSoonSubtext}>
          Stay tuned! We&apos;ll announce our pricing structure soon. In the meantime, feel free to use our service and explore all the features.
        </p>
      </div>
    </div>
  );
}
