import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { JOB_ROLES } from "@/app/constants/job_roles";
import resumeService from "@/lib/api/services/resumeService";
import type { JobRolesResponse } from "@/lib/api/types/resume.types";

// Cache for job roles - stored at module level
let cachedJobRoles: string[] | null = null;
let isFetching = false;
let fetchPromise: Promise<string[]> | null = null;

/**
 * Custom hook for fetching unique job roles with caching
 */
const useJobRoles = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobRoles, setJobRoles] = useState<string[]>(() => {
    // Initialize with cached data if available
    return cachedJobRoles || [];
  });

  /**
   * Fetch job roles from API
   */
  const fetchJobRoles = async () => {
    // If already cached, return cached data
    if (cachedJobRoles) {
      setJobRoles(cachedJobRoles);
      return cachedJobRoles;
    }

    // If already fetching, wait for that promise
    if (isFetching && fetchPromise) {
      const result = await fetchPromise;
      setJobRoles(result);
      return result;
    }

    setLoading(true);
    setError(null);
    isFetching = true;

    fetchPromise = (async () => {
      try {
        // Get authentication token (optional based on your API requirements)
        const token = await getToken();

        // Fetch job roles from API
        const response: JobRolesResponse = await resumeService.getJobRoles(
          token || undefined
        );

        // Extract job roles from API response
        if (response && response.job_roles && Array.isArray(response.job_roles)) {
          cachedJobRoles = response.job_roles;
          setJobRoles(response.job_roles);
          return response.job_roles;
        } else {
          // If response structure is unexpected, fallback to constants
          console.warn("Unexpected API response structure, using fallback data");
          cachedJobRoles = JOB_ROLES;
          setJobRoles(JOB_ROLES);
          return JOB_ROLES;
        }
      } catch (err: unknown) {
        console.error("Error fetching job roles:", err);
        // Fallback to hardcoded constants when API is down
        cachedJobRoles = JOB_ROLES;
        setJobRoles(JOB_ROLES);
        setError(
          "Failed to load job roles from server. Using cached data."
        );
        return JOB_ROLES;
      } finally {
        setLoading(false);
        isFetching = false;
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  };

  /**
   * Fetch job roles on component mount (only if not cached)
   */
  useEffect(() => {
    if (!cachedJobRoles) {
      fetchJobRoles();
    }
  }, []);

  /**
   * Reset the hook state and clear cache
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setJobRoles([]);
    cachedJobRoles = null;
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
