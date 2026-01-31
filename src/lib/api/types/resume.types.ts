/**
 * Request payload for parsing resume
 */
export interface ParseResumeRequest {
  file: File;
  job_description: string;
  related_jobs: string[];
}

/**
 * Response from parse resume API
 * Adjust this based on actual API response structure
 */
export interface ParseResumeResponse {
  gcs_url: string;
}

/**
 * API Error structure
 */
export interface ApiError {
  status_code: number;
  message: string;
  error_code?: number;
}

/**
 * Response from get unique job roles API
 */
export interface JobRolesResponse {
  job_roles: string[];
}

/**
 * Request payload for editing resume with AI
 */
export interface EditResumeRequest {
  resume_url: string;
  user_instruction: string;
}

/**
 * Response from edit resume API
 */
export interface EditResumeResponse {
  gcs_url: string;
  message?: string;
}
