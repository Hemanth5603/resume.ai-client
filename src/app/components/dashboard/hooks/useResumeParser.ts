import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import resumeService from "@/lib/api/services/resumeService";
import type {
  ParseResumeResponse,
  ApiError,
} from "@/lib/api/types/resume.types";

/**
 * Custom hook for parsing resumes with job description and roles
 */
const useResumeParser = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ParseResumeResponse | null>(null);

  /**
   * Parse resume with job description and roles
   * @param file - PDF file to parse
   * @param jobDescription - Job description text
   * @param relatedJobs - Array of job roles (default: ["Data Scientist", "Data Engineer"])
   */
  const parseResume = async (
    file: File,
    jobDescription: string,
    relatedJobs: string[] = ["Data Scientist", "Data Engineer"]
  ) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Get authentication token (optional based on your API requirements)
      const token = await getToken();

      const response = await resumeService.parseResume(
        {
          file,
          job_description: jobDescription,
          related_jobs: relatedJobs,
        },
        token || undefined
      );

      setData(response);
      return response;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.message ||
        "An unexpected error occurred during resume parsing.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the hook state
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    parseResume,
    loading,
    error,
    data,
    reset,
  };
};

export default useResumeParser;
