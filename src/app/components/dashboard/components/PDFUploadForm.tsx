"use client";

import { useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import styles from "../styles/PDFUploadForm.module.css";
import useResumeParser from "../hooks/useResumeParser";
import { RxMagicWand } from "react-icons/rx";
import MultiSelectJobRoles from "./MultiSelectJobRoles";
import { ErrorModal } from "@/components/ui/error-modal";

export default function PDFUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const { parseResume, loading, error, data } = useResumeParser();
  const success = !!data;

  // Error modal state
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    details: undefined,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc (legacy)
    ];

    if (selected && allowedTypes.includes(selected.type)) {
      setFile(selected);
    } else {
      setErrorModal({
        isOpen: true,
        title: "Invalid File Type",
        message: "Only PDF and DOCX files are allowed.",
        details: selected ? `Selected file type: ${selected.type}` : undefined,
      });
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!file || !description.trim()) {
      setErrorModal({
        isOpen: true,
        title: "Missing Information",
        message: "Please select a PDF or DOCX file and enter a job description.",
        details: !file ? "No file selected" : "Job description is empty",
      });
      return;
    }
    setProgress(0);

    const simulateProcess = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(simulateProcess);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    // Call the new Resume Parser API with selected job roles
    try {
      const response = await parseResume(file, description, selectedJobRoles);
      console.log("Resume Parser API Response:", response);
    } catch (err: any) {
      console.error("Resume Parser API Error:", err);
      setErrorModal({
        isOpen: true,
        title: "API Error",
        message: err?.message || "An unexpected error occurred while processing your resume.",
        details: err?.status_code ? `Error Code: ${err.status_code}` : undefined,
      });
    }

    clearInterval(simulateProcess);
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
  };

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      title: "",
      message: "",
      details: undefined,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.uploadSection}>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => inputRef.current?.click()}
          >
            UPLOAD RESUME
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/msword,.doc"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          {/* <div className={styles.iconGroup}>
            <button className={styles.iconButton} title="Google Drive">
              <FaGoogleDrive className={styles.reactIcon} />
            </button>
            <button className={styles.iconButton} title="Cloud Storage">
              <FaCloudUploadAlt className={styles.reactIcon} />
            </button>
          </div> */}
        </div>

        {file && (
          <div className={styles.selectedFileContainer}>
            <span className={styles.fileName}>{file.name}</span>
            <button
              type="button"
              className={styles.clearFileButton}
              onClick={handleClearFile}
              title="Remove file"
            >
              <IoMdClose />
            </button>
          </div>
        )}

        {loading && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className={styles.textareaSection}>
          <textarea
            className={styles.textarea}
            placeholder="Give Your Job Description and Key Responsibilities."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={styles.textareaFooter}>
            <span className={styles.upgradeText}>
              Upgrade to pro subscription for advanced models
            </span>
            <button className={styles.aiButton} title="AI Assistant">
              <FaRobot className={styles.reactIcon} />
            </button>
          </div>
        </div>

        <MultiSelectJobRoles
          selectedRoles={selectedJobRoles}
          onChange={setSelectedJobRoles}
        />

        {success && data?.gcs_url ? (
          <a
            href={data.gcs_url}
            className={styles.getResumeButton}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            DOWNLOAD RESUME
            <RxMagicWand scale={4} />
          </a>
        ) : (
          <button
            className={styles.getResumeButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "PROCESSING..." : "GET RESUME"}
            <RxMagicWand scale={4} />
          </button>
        )}

        {success && <p className={styles.success}>Upload successful!</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </div>
  );
}
