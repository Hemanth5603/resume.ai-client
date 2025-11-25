const host = process.env.SERVER_HOST
const resumeApiHost = process.env.NEXT_PUBLIC_RESUME_API_HOST || 'http://34.130.75.211:8000'

export const routes = {
    UPLOAD: `${host}/upload`,
    SAVE_USER_DATA: `${host}/save_user`,
    PARSE_RESUME: `${resumeApiHost}/api/v1/parse_resume`,
    GET_JOB_ROLES: `${resumeApiHost}/api/v1/get_unique_job_roles`
}