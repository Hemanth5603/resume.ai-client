import apiClient from "../client";
import { routes } from "@/lib/routes/router";
import type {
  ParseResumeRequest,
  ParseResumeResponse,
  JobRolesResponse,
} from "../types/resume.types";

class ResumeService {
  async parseResume(
    request: ParseResumeRequest,
    token?: string
  ): Promise<ParseResumeResponse> {
    const formData = new FormData();

    // Append file with the key "file"
    formData.append("file", request.file);

    // Append job_description
    formData.append("job_description", request.job_description);

    // Append job_roles as JSON string or individual items
    // Depending on API expectation, you might need to adjust this
    formData.append("job_roles", JSON.stringify(request.job_roles));

    // If the API expects individual items, use this instead:
    // request.job_roles.forEach(role => {
    //     formData.append('job_roles', role);
    // });

    try {
      if (token) {
        return await apiClient.postWithTokenFormData(
          routes.PARSE_RESUME,
          token,
          formData
        );
      } else {
        return await apiClient.postWithoutTokenFormData(
          routes.PARSE_RESUME,
          formData
        );
      }
    } catch (error) {
      // Re-throw with better error handling
      throw error;
    }
  }

  /**
   * Get list of unique job roles
   * @param token - Optional authentication token
   * @returns List of job roles
   */
  async getJobRoles(token?: string): Promise<JobRolesResponse> {
    try {
      if (token) {
        return await apiClient.getWithToken(routes.GET_JOB_ROLES, token);
      } else {
        return await apiClient.getWithoutToken(routes.GET_JOB_ROLES);
      }
    } catch (error) {
      // Re-throw with better error handling
      throw error;
    }
  }
}

const resumeService = new ResumeService();
export default resumeService;
