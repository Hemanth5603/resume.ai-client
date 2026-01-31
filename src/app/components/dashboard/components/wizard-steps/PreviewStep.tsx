"use client";

import { useState, useMemo, useEffect } from "react";
import { FaDownload, FaCheckCircle } from "react-icons/fa";
import { RxMagicWand } from "react-icons/rx";
import styles from "../../styles/wizard-steps/PreviewStep.module.css";

export type EditMode = "ai" | null;

interface PreviewStepProps {
  downloadUrl: string;
  onReset: () => void;
  onEditModeChange?: (mode: EditMode) => void;
}

export default function PreviewStep({ downloadUrl, onEditModeChange }: PreviewStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Determine file type and preview URL
  const fileInfo = useMemo(() => {
    if (!downloadUrl) {
      console.warn('PreviewStep: No download URL provided');
      return { fileType: 'unknown' as const, previewUrl: '', canPreview: false };
    }

    const url = downloadUrl.toLowerCase();
    // More robust file type detection - check URL patterns
    const isPDF = url.includes('.pdf') || url.match(/\.pdf(\?|$|#)/) || url.includes('pdf');
    const isDOCX = url.includes('.docx') || url.match(/\.docx(\?|$|#)/) || url.includes('docx');
    
    let previewUrl = downloadUrl;
    let fileType: 'pdf' | 'docx' | 'unknown' = 'unknown';
    
    if (isPDF) {
      fileType = 'pdf';
      // For PDF, use the URL directly - browsers handle PDFs natively
      previewUrl = downloadUrl;
      console.log('PreviewStep: Detected PDF, URL:', downloadUrl);
    } else if (isDOCX) {
      fileType = 'docx';
      // Use Microsoft Office Online viewer for DOCX files (more reliable than Google Docs)
      previewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(downloadUrl)}`;
      console.log('PreviewStep: Detected DOCX, using Office viewer, URL:', previewUrl);
    } else {
      console.warn('PreviewStep: Unknown file type, URL:', downloadUrl);
    }
    
    return { fileType, previewUrl, canPreview: isPDF || isDOCX };
  }, [downloadUrl]);

  useEffect(() => {
    // Reset error when URL changes
    setIframeError(false);
  }, [downloadUrl]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileInfo.fileType === 'pdf' ? 'resume.pdf' : 'resume.docx';
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleEditWithAI = () => {
    if (onEditModeChange) {
      onEditModeChange("ai");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.successBanner}>
        <FaCheckCircle className={styles.successIcon} />
        <div className={styles.successContent}>
          <h2 className={styles.successTitle}>Your Resume is Ready!</h2>
          <p className={styles.successSubtitle}>
            We&apos;ve optimized your resume for the job you&apos;re applying to
          </p>
        </div>
      </div>

      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <h3 className={styles.previewTitle}>Resume Preview</h3>
          <p className={styles.previewSubtitle}>
            {fileInfo.canPreview 
              ? "Review your optimized resume below" 
              : "Preview not available - Click download to view"}
          </p>
        </div>

        {fileInfo.canPreview && !iframeError ? (
          <div className={styles.iframeContainer}>
            {fileInfo.fileType === 'pdf' ? (
              // Use object tag for PDFs - more reliable than iframe
              <object
                data={fileInfo.previewUrl}
                type="application/pdf"
                className={styles.iframe}
                title="Resume Preview"
              >
                <iframe
                  src={fileInfo.previewUrl}
                  className={styles.iframe}
                  title="Resume Preview"
                  onError={() => setIframeError(true)}
                />
              </object>
            ) : (
              <iframe
                src={fileInfo.previewUrl}
                className={styles.iframe}
                title="Resume Preview"
                onError={() => setIframeError(true)}
              />
            )}
          </div>
        ) : (
          <div className={styles.noPreview}>
            <div className={styles.noPreviewContent}>
              <FaCheckCircle className={styles.noPreviewIcon} />
              <p className={styles.noPreviewText}>
                {iframeError 
                  ? "Preview couldn't load - Click download to view" 
                  : "Your resume is ready for download"}
              </p>
              <p className={styles.noPreviewSubtext}>
                {iframeError 
                  ? "The file may require authentication or have CORS restrictions"
                  : fileInfo.canPreview 
                    ? "Preview is loading..." 
                    : "Preview is not available for this file format"}
              </p>
              {iframeError && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewLink}
                >
                  View Resume in New Tab
                </a>
              )}
            </div>
          </div>
        )}

        <div className={styles.actionButtons}>
          <button
            className={styles.editButton}
            onClick={handleEditWithAI}
          >
            <RxMagicWand />
            Edit with AI
          </button>
          
          <button
            className={styles.downloadButton}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <FaDownload />
            {isDownloading ? "Downloading..." : "Download Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}
