import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/nextjs"

class ApiClient{
    async getToken() {
        const {isSignedIn} = useUser()
        const {getToken} = useAuth()
        const token = await getToken({template: "default"})
        if (!isSignedIn) {
            window.location.href = "auth/login"
            return
        }
        

        return token
    }
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
            const errorData = await response.json()
            throw {
                "status_code" : response.status,
                "message" : errorData.error || "An unexpected error occured"
            }
        }
        const res = await response.json()
        return res
    }

    async getWithToken(endpoint: string, options: RequestInit = {}) {
        const token = await this.getToken();
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

    async postWithToken(endpoint: string, data: object, options: RequestInit = {}) {
        const token = await this.getToken()
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

    async postWithTokenFormData(endpoint:string, formData:BodyInit, options:RequestInit = {}){
        const token = await this.getToken();
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