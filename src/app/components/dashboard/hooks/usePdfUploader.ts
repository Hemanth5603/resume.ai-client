import ApiClient from "@/lib/api/client"
import { routes } from "@/lib/routes/router"
import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react"

const usePdfUploader = () => {
    const { isSignedIn } = useUser();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    
    const handleUpload = async (file: File, description: string) => {
        if (!isSignedIn) {
            window.location.href = "/auth/login";
            return;
        }
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            const token = await getToken()
            if(!token) {
                throw new Error("Missing Token")
            }
            const formData = new FormData()
            formData.append('file',file)
            formData.append('description', description)

            const response = await ApiClient.postWithTokenFormData(routes.UPLOAD, token, formData)
            setSuccess(true)
            return response
        } catch (err : any) {
            setError(err.message || "Upload Failed")
        } finally {
            setLoading(false)
        }
    }

    return {handleUpload, loading, error, success}
}

export default usePdfUploader