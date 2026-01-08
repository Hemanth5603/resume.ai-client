import { useState, useEffect } from "react";
//import { useAuth } from "@clerk/nextjs";
import { JOB_ROLES } from "@/app/constants/job_roles";
//import resumeService from "@/lib/api/services/resumeService";

/**
 * Custom hook for fetching unique job roles
 */
const useJobRoles = () => {
  //const { getToken } = useAuth();
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
      //const token = await getToken();

      //const response = await resumeService.getJobRoles(token || undefined);
      setJobRoles(JOB_ROLES); // Get job roles from constants
      return JOB_ROLES;
    } catch (err: unknown) {
      console.error("Error fetching job roles:", err);
      // Fallback mock data for development when API is down
      setJobRoles([
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Product Designer",
        "UI/UX Designer",
        "DevOps Engineer",
      ]);
      setError(null); // Clear error to show mock data
      // Do not re-throw, let the UI handle the error state
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
