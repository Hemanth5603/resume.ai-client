"use client";

import { useState, useEffect } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { RxMagicWand } from "react-icons/rx";
import styles from "../styles/ResumeWizard.module.css";
import JobDescriptionStep from "./wizard-steps/JobDescriptionStep";
import JobRolesStep from "./wizard-steps/JobRolesStep";
import ResumeUploadStep from "./wizard-steps/ResumeUploadStep";
import ProcessingStep from "./wizard-steps/ProcessingStep";
import PreviewStep from "./wizard-steps/PreviewStep";
import useResumeParser from "../hooks/useResumeParser";
import { ErrorModal } from "@/components/ui/error-modal";
import type { ApiError } from "@/lib/api/types/resume.types";

export default function ResumeWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const { parseResume, loading, error, data } = useResumeParser();
  
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

  // Auto-advance to processing step when generating
  useEffect(() => {
    if (loading && currentStep === 3) {
      setCurrentStep(4);
    }
  }, [loading, currentStep]);

  // Auto-advance to preview step when complete
  useEffect(() => {
    if (data?.gcs_url && currentStep === 4) {
      setCurrentStep(5);
    }
  }, [data?.gcs_url, currentStep]);

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return jobDescription.trim().length > 0;
      case 2:
        return selectedJobRoles.length > 0;
      case 3:
        return file !== null;
      case 4:
        return false; // Can't manually proceed from processing
      case 5:
        return false; // Final step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep !== 4) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    if (!file || !jobDescription.trim() || selectedJobRoles.length === 0) {
      setErrorModal({
        isOpen: true,
        title: "Missing Information",
        message: "Please complete all steps before generating your resume.",
        details: "Make sure you've added a job description, selected roles, and uploaded a file.",
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

    try {
      const response = await parseResume(file, jobDescription, selectedJobRoles);
      console.log("Resume Parser API Response:", response);
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Resume Parser API Error:", err);

      const errorInfo = getErrorFromStatusCode(err?.status_code ?? err?.error_code);
      setErrorModal({
        isOpen: true,
        ...errorInfo,
      });
      
      // Go back to upload step on error
      setCurrentStep(3);
    }

    clearInterval(simulateProcess);
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
  };

  const getErrorFromStatusCode = (statusCode: number) => {
    const defaultError = {
      title: "Internal Server Error!!",
      message: "Failed to generate resume for you..",
      details: "Unexpected Error occurred while we processing your request.",
    };
    
    const errorMap: Record<number, typeof defaultError> = {
      402: {
        title: "Payment Required",
        message: "Failed to generate resume for you..",
        details: "You are trying to access a paid resource.",
      },
      420: {
        title: "Format Not Supported",
        message: "The Requested Resume Format is not supported yet",
        details: "Please try again with a different file format.",
      },
      401: {
        title: "Unauthorized",
        message: "You are not authorized to access this resource.",
        details: "Please login to your account to access this resource.",
      },
      500: {
        title: "Hold On!",
        message: "We are trying hard to bring support for more resume formats",
        details: "Please try again later or contact support.",
      },
    };

    return errorMap[statusCode] || defaultError;
  };

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      title: "",
      message: "",
      details: undefined,
    });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setJobDescription("");
    setSelectedJobRoles([]);
    setFile(null);
    setProgress(0);
  };

  return (
    <div className={styles.wizardContainer}>
      {/* Step Content */}
      <div className={styles.stepContent}>
        {currentStep === 1 && (
          <JobDescriptionStep
            value={jobDescription}
            onChange={setJobDescription}
          />
        )}
        {currentStep === 2 && (
          <JobRolesStep
            selectedRoles={selectedJobRoles}
            onChange={setSelectedJobRoles}
          />
        )}
        {currentStep === 3 && (
          <ResumeUploadStep file={file} onChange={setFile} />
        )}
        {currentStep === 4 && <ProcessingStep progress={progress} />}
        {currentStep === 5 && data?.gcs_url && (
          <PreviewStep downloadUrl={data.gcs_url} onReset={handleReset} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationContainer}>
        {currentStep > 1 && currentStep < 4 && (
          <button
            className={styles.backButton}
            onClick={handleBack}
          >
            <IoChevronBack />
            Back
          </button>
        )}

        <div className={styles.spacer} />

        {currentStep < 3 && (
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
          >
            Next
            <IoChevronForward />
          </button>
        )}

        {currentStep === 3 && (
          <button
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={!canProceedToNextStep() || loading}
          >
            <RxMagicWand />
            Generate Resume
          </button>
        )}
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
