const host = process.env.SERVER_HOST;
const resumeApiHost =
  process.env.NEXT_PUBLIC_RESUME_API_HOST || "http://34.130.75.211:8000";

export const routes = {
  UPLOAD: `${host}/upload`,
  SAVE_USER_DATA: `${host}/save_user`,
  PARSE_RESUME: `/api/proxy/parse_resume`,
  GET_JOB_ROLES: `/api/proxy/get_job_roles`,
};
