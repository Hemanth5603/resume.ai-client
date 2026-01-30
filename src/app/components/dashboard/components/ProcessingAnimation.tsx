"use client";

import { useState, useEffect } from "react";
import styles from "../styles/ProcessingAnimation.module.css";
import { FaFileAlt, FaBrain, FaMagic, FaCheckCircle } from "react-icons/fa";
import { MdOutlineRadar } from "react-icons/md";

interface ProcessingAnimationProps {
  progress: number;
}

const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
  progress,
}) => {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    {
      icon: <FaFileAlt />,
      text: "Reading your resume",
      color: "#3b82f6",
      range: [0, 25],
    },
    {
      icon: <MdOutlineRadar />,
      text: "Scanning content",
      color: "#8b5cf6",
      range: [25, 50],
    },
    {
      icon: <FaBrain />,
      text: "Analyzing skills & experience",
      color: "#ec4899",
      range: [50, 75],
    },
    {
      icon: <FaMagic />,
      text: "Generating optimized resume",
      color: "#f59e0b",
      range: [75, 95],
    },
    {
      icon: <FaCheckCircle />,
      text: "Finalizing your resume",
      color: "#10b981",
      range: [95, 100],
    },
  ];

  useEffect(() => {
    const stage = stages.findIndex(
      (s) => progress >= s.range[0] && progress <= s.range[1]
    );
    if (stage !== -1) {
      setCurrentStage(stage);
    }
  }, [progress]);

  return (
    <div className={styles.container}>
      {/* Scanning animation */}
      <div className={styles.scannerWrapper}>
        <div className={styles.scannerContainer}>
          <div
            className={styles.scanLine}
            style={{
              animationDuration: `${2 - progress / 100}s`,
            }}
          />
          <div className={styles.scanGlow} />
        </div>
      </div>

      {/* Progress info */}
      <div className={styles.stageInfo}>
        <div
          className={styles.stageIcon}
          style={{
            color: stages[currentStage]?.color || "#3b82f6",
          }}
        >
          {stages[currentStage]?.icon}
        </div>
        <p className={styles.stageText}>{stages[currentStage]?.text}</p>
      </div>

      {/* Progress bar with percentage */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${progress}%`,
              background: stages[currentStage]?.color || "#3b82f6",
            }}
          >
            <div className={styles.progressGlow} />
          </div>
        </div>
        <span className={styles.progressText}>{Math.round(progress)}%</span>
      </div>

      {/* Stage indicators */}
      <div className={styles.stagesContainer}>
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`${styles.stageIndicator} ${
              index === currentStage
                ? styles.activeStage
                : index < currentStage
                ? styles.completedStage
                : ""
            }`}
            style={{
              borderColor:
                index <= currentStage ? stage.color : "rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              className={styles.stageIndicatorInner}
              style={{
                background: index <= currentStage ? stage.color : "transparent",
              }}
            />
          </div>
        ))}
      </div>

      {/* Floating particles */}
      <div className={styles.particlesContainer}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessingAnimation;
