"use client";

import styles from "../styles/CustomAuth.module.css";

const AuthLeftPanel = () => {
  return (
    <div className={styles.leftPanel}>
      <div className={styles.leftPanelContent}>
        {/* Background Pattern */}
        <div className={styles.patternOverlay}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 400"
            className={styles.patternSvg}
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Main Illustration */}
        <div className={styles.illustrationContainer}>
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            className={styles.mainIllustration}
          >
            {/* Document/Resume Icon */}
            <rect
              x="80"
              y="60"
              width="140"
              height="180"
              rx="4"
              fill="#ffffff"
              stroke="#1a1a1a"
              strokeWidth="3"
            />
            
            {/* Document Lines */}
            <line
              x1="100"
              y1="100"
              x2="200"
              y2="100"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="130"
              x2="190"
              y2="130"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="160"
              x2="180"
              y2="160"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="190"
              x2="200"
              y2="190"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="220"
              x2="170"
              y2="220"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Sparkle/AI Icon */}
            <g transform="translate(210, 80)">
              <circle cx="0" cy="0" r="15" fill="#8b5cf6" opacity="0.2" />
              <path
                d="M0,-8 L2,-2 L8,-2 L3,1 L5,7 L0,4 L-5,7 L-3,1 L-8,-2 L-2,-2 Z"
                fill="#8b5cf6"
              />
            </g>

            {/* Checkmark */}
            <path
              d="M100 250 L120 270 L180 200"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Decorative Circles */}
            <circle cx="60" cy="80" r="8" fill="#3b82f6" opacity="0.3" />
            <circle cx="240" cy="200" r="10" fill="#8b5cf6" opacity="0.3" />
            <circle cx="50" cy="220" r="6" fill="#10b981" opacity="0.3" />
            <circle cx="250" cy="100" r="7" fill="#f59e0b" opacity="0.3" />
          </svg>
        </div>

        {/* Text Content */}
        <div className={styles.leftPanelText}>
          <h2 className={styles.leftPanelTitle}>Resume.ai</h2>
          <p className={styles.leftPanelSubtitle}>
            Transform your resume with AI-powered optimization
          </p>
        </div>

        {/* Floating Elements */}
        <div className={styles.floatingElements}>
          <div className={styles.floatingCircle1}></div>
          <div className={styles.floatingCircle2}></div>
          <div className={styles.floatingCircle3}></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLeftPanel;

