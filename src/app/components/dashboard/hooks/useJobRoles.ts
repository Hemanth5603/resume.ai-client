import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { JOB_ROLES } from "@/app/constants/job_roles";
import resumeService from "@/lib/api/services/resumeService";
import type { JobRolesResponse } from "@/lib/api/types/resume.types";

/**
 * Custom hook for fetching unique job roles
 */
const useJobRoles = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobRoles, setJobRoles] = useState<string[]>([]);

  /**
   * Fetch job roles from API
   */
  const fetchJobRoles = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get authentication token (optional based on your API requirements)
      const token = await getToken();

      // Fetch job roles from API
      const response: JobRolesResponse = await resumeService.getJobRoles(
        token || undefined
      );

      // Extract job roles from API response
      if (response && response.job_roles && Array.isArray(response.job_roles)) {
        setJobRoles(response.job_roles);
        return response.job_roles;
      } else {
        // If response structure is unexpected, fallback to constants
        console.warn("Unexpected API response structure, using fallback data");
        setJobRoles(JOB_ROLES);
        return JOB_ROLES;
      }
    } catch (err: unknown) {
      console.error("Error fetching job roles:", err);
      // Fallback to hardcoded constants when API is down
      setJobRoles(JOB_ROLES);
      setError(
        "Failed to load job roles from server. Using cached data."
      );
      return JOB_ROLES;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch job roles on component mount
   */
  useEffect(() => {
    fetchJobRoles();
  }, []);

  /**
   * Reset the hook state
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setJobRoles([]);
  };

  return {
    jobRoles,
    loading,
    error,
    fetchJobRoles,
    reset,
  };
};

export default useJobRoles;
