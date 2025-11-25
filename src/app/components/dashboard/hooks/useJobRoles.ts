import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import resumeService from '@/lib/api/services/resumeService';
import type { ApiError } from '@/lib/api/types/resume.types';

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

            const response = await resumeService.getJobRoles(token || undefined);
            setJobRoles(response.job_roles);
            return response.job_roles;
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || 'Failed to fetch job roles.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch job roles on component mount
     */
    useEffect(() => {
        fetchJobRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

