"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { RxMagicWand } from "react-icons/rx";
import styles from "../styles/ResumeWizard.module.css";
import JobDescriptionStep from "./wizard-steps/JobDescriptionStep";
import JobRolesStep from "./wizard-steps/JobRolesStep";
import ResumeUploadStep from "./wizard-steps/ResumeUploadStep";
import ProcessingStep from "./wizard-steps/ProcessingStep";
import PreviewStep, { EditMode } from "./wizard-steps/PreviewStep";
import EditWithAIStep from "./wizard-steps/EditWithAIStep";
import useResumeParser from "../hooks/useResumeParser";
import { ErrorModal } from "@/components/ui/error-modal";
import type { ApiError } from "@/lib/api/types/resume.types";
import resumeService from "@/lib/api/services/resumeService";

export default function ResumeWizard() {
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResumeUrl, setEditedResumeUrl] = useState<string | null>(null);
  const { parseResume, loading, data } = useResumeParser();
  
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
      await parseResume(file, jobDescription, selectedJobRoles);
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
    setEditMode(null);
    setEditedResumeUrl(null);
  };

  const handleEditModeChange = (mode: EditMode) => {
    setEditMode(mode);
  };

  const handleBackFromEdit = () => {
    setEditMode(null);
    setEditedResumeUrl(null);
  };

  // Helper to clean URL (remove cache-busting params)
  const cleanResumeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.delete('_t');
      const cleanUrl = urlObj.origin + urlObj.pathname;
      const searchParams = urlObj.searchParams.toString();
      return searchParams ? `${cleanUrl}?${searchParams}` : cleanUrl;
    } catch {
      // If URL parsing fails, remove _t parameter manually
      return url.split('#')[0].replace(/[?&]_t=\d+/g, '').replace(/\?$/, '');
    }
  };

  const handleEditWithAI = async (userInstruction: string): Promise<string | void> => {
    // Always use the latest edited resume URL (editedResumeUrl takes precedence over original)
    // This ensures we're always editing the most recent version
    const rawResumeUrl = editedResumeUrl || data?.gcs_url;
    if (!rawResumeUrl) {
      throw new Error("No resume URL available. Please generate a resume first.");
    }

    // Clean the URL to remove any cache-busting parameters before sending to backend
    const resumeUrl = cleanResumeUrl(rawResumeUrl);

    console.log('Sending edit request:', {
      cleanedUrl: resumeUrl,
      rawUrl: rawResumeUrl,
      editedResumeUrl: editedResumeUrl,
      originalGcsUrl: data?.gcs_url
    });

    setIsEditing(true);
    try {
      // Get authentication token
      const token = await getToken();
      
      const response = await resumeService.editResume(
        {
          resume_url: resumeUrl,
          user_instruction: userInstruction,
        },
        token || undefined
      );
      
      console.log("Edit resume API response:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", response ? Object.keys(response) : "null/undefined");
      
      // Check if response has gcs_url (success case) - prioritize this check
      const responseAny = response as unknown as Record<string, unknown>;
      const hasGcsUrl = 'gcs_url' in responseAny && typeof responseAny.gcs_url === 'string' && responseAny.gcs_url;
      
      // If we have gcs_url, it's a success - return it immediately
      if (hasGcsUrl) {
        const updatedUrl = responseAny.gcs_url as string;
        setEditedResumeUrl(updatedUrl);
        return updatedUrl;
      }
      
      // No gcs_url - check for error indicators
      // When postWithoutTokenFormData catches an error, it returns { status_code, message, ... }
      // Check for status_code first (most reliable indicator from API client)
      const statusCode = ('status_code' in responseAny && typeof responseAny.status_code === 'number') 
                        ? responseAny.status_code 
                        : null;
      
      // If status_code exists and is >= 400, it's definitely an error
      if (statusCode !== null && statusCode >= 400) {
        // Extract error message - prioritize message, then error, then details
        let errorMessage = 'Failed to edit resume. Please try again.';
        if (responseAny.message && typeof responseAny.message === 'string') {
          errorMessage = responseAny.message;
        } else if (responseAny.error && typeof responseAny.error === 'string') {
          errorMessage = responseAny.error;
        } else if (responseAny.details && typeof responseAny.details === 'string') {
          errorMessage = responseAny.details;
        }
        throw new Error(errorMessage);
      }
      
      // Check for error_code (API-level error) - must be non-zero number
      if ('error_code' in responseAny && 
          typeof responseAny.error_code === 'number' &&
          responseAny.error_code !== 0) {
        const errorMessage = (responseAny.error as string) || 
                           (responseAny.message as string) || 
                           (responseAny.data_error as string) ||
                           'Failed to edit resume. Please try again.';
        throw new Error(errorMessage);
      }
      
      // Check for error field from proxy (when backend fails, proxy returns { error: "Backend API error", status: ... })
      // Only treat as error if status field also indicates error (>= 400)
      const proxyStatus = ('status' in responseAny && typeof responseAny.status === 'number') 
                         ? responseAny.status 
                         : null;
      if (proxyStatus !== null && proxyStatus >= 400 && 'error' in responseAny) {
        const errorMessage = (responseAny.error as string) || 
                           (responseAny.message as string) || 
                           (responseAny.details as string) ||
                           'Failed to edit resume. Please try again.';
        throw new Error(errorMessage);
      }
      
      // No gcs_url and no error indicators - this shouldn't happen normally
      throw new Error("The server response was missing the updated resume URL. Please try again.");
    } catch (error: unknown) {
      console.error("Edit error:", error);
      
      // Extract error details
      let errorMessage = "Failed to edit resume. Please try again.";
      if (error && typeof error === 'object') {
        const apiError = error as { 
          status_code?: number; 
          message?: string; 
          error_code?: number;
          response?: { data?: { message?: string } } 
        };
        
        // Re-throw with better error message
        if (apiError.status_code && apiError.message) {
          errorMessage = `Error ${apiError.status_code}: ${apiError.message}`;
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsEditing(false);
    }
  };

  // Get the current resume URL (edited or original)
  const currentResumeUrl = editedResumeUrl || data?.gcs_url || "";

  return (
    <div className={styles.wizardContainer}>
      {/* Step Content */}
      <div className={styles.stepContent}>
        {editMode === "ai" && currentResumeUrl ? (
          <EditWithAIStep
            downloadUrl={currentResumeUrl}
            onBack={handleBackFromEdit}
            onEdit={handleEditWithAI}
            isEditing={isEditing}
            onReset={handleReset}
          />
        ) : (
          <>
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
              <PreviewStep
                downloadUrl={data.gcs_url}
                onReset={handleReset}
                onEditModeChange={handleEditModeChange}
              />
            )}
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      {!editMode && (
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
      )}

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
