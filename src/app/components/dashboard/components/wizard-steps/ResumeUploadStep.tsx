"use client";

import { useRef } from "react";
import { FaFileUpload, FaCheckCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import styles from "../../styles/wizard-steps/ResumeUploadStep.module.css";

interface ResumeUploadStepProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function ResumeUploadStep({
  file,
  onChange,
}: ResumeUploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (selected && allowedTypes.includes(selected.type)) {
      onChange(selected);
    } else if (selected) {
      alert("Only PDF and DOCX files are allowed.");
    }
  };

  const handleClearFile = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      onChange(droppedFile);
    } else if (droppedFile) {
      alert("Only PDF and DOCX files are allowed.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Upload Your Resume</h2>
        <p className={styles.subtitle}>
          Upload your current resume in PDF or DOCX format. We&apos;ll enhance it
          based on the job description and roles you&apos;ve selected.
        </p>
      </div>

      {!file ? (
        <div
          className={styles.uploadArea}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FaFileUpload className={styles.uploadIcon} />
          <h3 className={styles.uploadTitle}>Drop your resume here</h3>
          <p className={styles.uploadText}>or click to browse</p>
          <p className={styles.uploadHint}>Supports PDF and DOCX (Max 10MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/msword,.doc"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className={styles.fileDisplay}>
          <div className={styles.fileInfo}>
            <FaCheckCircle className={styles.fileCheckIcon} />
            <div className={styles.fileDetails}>
              <div className={styles.fileName}>{file.name}</div>
              <div className={styles.fileSize}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
          <button
            className={styles.removeButton}
            onClick={handleClearFile}
            title="Remove file"
          >
            <IoMdClose />
          </button>
        </div>
      )}
    </div>
  );
}
