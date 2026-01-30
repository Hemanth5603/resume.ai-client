"use client";

import MultiSelectJobRoles from "../MultiSelectJobRoles";
import styles from "../../styles/wizard-steps/JobRolesStep.module.css";

interface JobRolesStepProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
}

export default function JobRolesStep({
  selectedRoles,
  onChange,
}: JobRolesStepProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Select Related Job Roles</h2>
        <p className={styles.subtitle}>
          Choose job roles similar to the position you&apos;re applying for. This
          helps our AI understand the context and tailor your resume better.
        </p>
      </div>

      <MultiSelectJobRoles selectedRoles={selectedRoles} onChange={onChange} />
    </div>
  );
}
