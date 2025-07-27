import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/nextjs"

class ApiClient{
    async request(endpoint: string, options: RequestInit={}) {
        const headers = {
            "Content-Type" : "application/json",
            ...options.headers,
        }

        const response = await fetch(endpoint, {
            ...options,
            headers
        })

        if (!response.ok) {
            let errorMessage = "An unexpected error occured"
            const contentType = response.headers.get("Content-type")
            if (response.status === 404) {
                errorMessage = "Cannot process your request";
            } else if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json().catch(() => ({}));
                errorMessage = errorData.error || errorData.message || errorMessage;
            }

            throw {
                "status_code" : response.status,
                "message" : errorMessage || "An unexpected error occured"
            }
        }
        const contentType = response.headers.get("Content-type")
        if(contentType && contentType.includes("application/json")) {
            return await response.json()
        }
        else {
            return await response.text()
        }
    }

    async getWithToken(endpoint: string, token: string, options: RequestInit = {}) {
        return this.request(endpoint, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            }
        })
    }

    async getWithoutToken(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, options)
    }

    async postWithToken(endpoint: string, token: string, data: object, options: RequestInit = {}) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
    }

    async postWithoutToken(endpoint: string, data: object, options: RequestInit = {}) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    async postWithTokenFormData(endpoint:string, token: string, formData:BodyInit, options:RequestInit = {}){
        return this.request(
            endpoint,
            {
                ...options,
                method:'POST',
                headers:{
                    ...options.headers,
                    Authorization:`Bearer ${token}`
                },
                body:formData,
            });
    }
}

export default new ApiClient