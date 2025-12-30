"use client";

import { useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import styles from "../styles/PDFUploadForm.module.css";
import useResumeParser from "../hooks/useResumeParser";
import { RxMagicWand } from "react-icons/rx";
import MultiSelectJobRoles from "./MultiSelectJobRoles";
import { ErrorModal } from "@/components/ui/error-modal";
import type { ApiError } from "@/lib/api/types/resume.types";

export default function PDFUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const { parseResume, loading, error, data } = useResumeParser();
  const success = !!data;

  const getErrorFromStatusCode = (statusCode: number) => {
    const defaultError = {
      title: "Internal Server Error!!",
      message: "Failed to generate resume for you..",
      details: "Unexpected Error occured while we processing your request."
    }
    switch(statusCode) {
      case 402:
        return {
          title: "Payment Required",
          message: "Failed to generate resume for you..",
          details: "You are trying to access a paid resource."
        }
      case 420:
        return {
          title: "Format Not Supported",
          message: "The Requested Resume Format is not supported yet",
          details: "Please try again with a different file format."
        }
      case 401:
        return {
          title: "Unauthorized",
          message: "You are not authorized to access this resource.",
          details: "Please login to your account to access this resource."
        }
      case 403:
        return {
          title: "Forbidden",
          message: "You are not allowed to access this resource.",
          details: "Please contact support to access this resource."
        }
      case 404:
        return {
          title: "Not Found",
          message: "The requested resource was not found.",
          details: "Please check the URL and try again."
        }
      case 405:
        return {
          title: "Method Not Allowed",
          message: "The requested method is not allowed.",
          details: "Please use a different method to access this resource."
        }
      case 406:
        return {
          title: "Not Acceptable",
          message: "The requested resource is not acceptable.",
          details: "Please use a different resource to access this resource."
        }
      case 500: 
        return {
          title: "Internal Server Error",
          message: "An unexpected error occurred while processing your request.",
          details: "Please try again later or contact support."
        }
      case 502:
        return {
          title: "Bad Gateway",
          message: "The server is not responding to the request.",
          details: "Please try again later or contact support."
        }
      case 503:
        return {
          title: "Service Unavailable",
          message: "The server is currently unavailable.",
          details: "Please try again later or contact support."
        }
      case 504:
        return {
          title: "Gateway Timeout",
          message: "The server timed out while processing your request.",
          details: "Please try again later or contact support."
        }
      case 505:
        return {
          title: "HTTP Version Not Supported",
          message: "The server does not support the HTTP version used in the request.",
          details: "Please use a different HTTP version to access this resource."
        }
      default:
        return defaultError;
    }
  }; 

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
        message:
          "Please select a PDF or DOCX file and enter a job description.",
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
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Resume Parser API Error:", err);

      const { title, message, details } = getErrorFromStatusCode(err?.status_code ?? err?.error_code);

      setErrorModal({
        isOpen: true,
        title,
        message,
        details,
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
