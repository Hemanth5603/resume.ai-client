import { useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import styles from "../styles/PDFUploadForm.module.css";
import useResumeParser from "../hooks/useResumeParser";
import { RxMagicWand } from "react-icons/rx";
import MultiSelectJobRoles from "./MultiSelectJobRoles";

export default function PDFUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const { parseResume, loading, error, data } = useResumeParser();
  const success = !!data;

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
      alert("Only PDF and DOCX files are allowed.");
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
      alert("Please select a PDF or DOCX file and enter a job description.");
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
    } catch (err) {
      console.error("Resume Parser API Error:", err);
    }

    clearInterval(simulateProcess);
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
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
            placeholder="Write Your Job Description..."
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

        {success && data?.data?.download_url ? (
          <a
            href={data.data.download_url}
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
    </div>
  );
}
