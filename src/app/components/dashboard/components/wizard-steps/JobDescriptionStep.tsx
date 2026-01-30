"use client";

import { useRef, useEffect } from "react";
import styles from "../../styles/wizard-steps/JobDescriptionStep.module.css";

interface JobDescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionStep({
  value,
  onChange,
}: JobDescriptionStepProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 400);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Paste Your Job Description</h2>
        <p className={styles.subtitle}>
          Copy the job posting from any website and paste it here. Our AI will
          analyze the requirements and optimize your resume accordingly.
        </p>
      </div>

      <div className={styles.textareaWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Paste the complete job description here...

Example:
• Job title and company
• Required qualifications
• Key responsibilities
• Skills and experience needed"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
        />
        {value.trim().length > 0 && (
          <div className={styles.characterCount}>
            {value.trim().length} characters
          </div>
        )}
      </div>
    </div>
  );
}
