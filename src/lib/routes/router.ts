const host = process.env.SERVER_HOST;
const resumeApiHost =
  process.env.NEXT_PUBLIC_RESUME_API_HOST || "https://www.nexuretech.in";

// Use proxy endpoints to avoid CORS issues
const useProxy = typeof window !== "undefined"; // Use proxy only on client-side

export const routes = {
  UPLOAD: `${host}/upload`,
  SAVE_USER_DATA: `${host}/save_user`,
  PARSE_RESUME: useProxy
    ? "/api/proxy/generate_resume"
    : `${resumeApiHost}/api/v1/generate_resume`,
  GET_JOB_ROLES: useProxy
    ? "/api/proxy/get_job_roles"
    : `${resumeApiHost}/api/v1/get_job_roles`,
};
