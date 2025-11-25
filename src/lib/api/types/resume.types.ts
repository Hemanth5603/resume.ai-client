/**
 * Request payload for parsing resume
 */
export interface ParseResumeRequest {
  file: File;
  job_description: string;
  job_roles: string[];
}

/**
 * Response from parse resume API
 * Adjust this based on actual API response structure
 */
export interface ParseResumeResponse {
  success: boolean;
  data?: {
    parsed_resume?: Record<string, unknown>;
    optimized_resume?: Record<string, unknown>;
    match_score?: number;
    suggestions?: string[];
    download_url?: string;
  };
  message?: string;
  error?: string;
}

/**
 * API Error structure
 */
export interface ApiError {
  status_code: number;
  message: string;
}

/**
 * Response from get unique job roles API
 */
export interface JobRolesResponse {
  job_roles: string[];
}
