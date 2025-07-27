import Cookies from "js-cookie"

class ApiClient{
    async getToken() {
        const accessToken = Cookies.get("access_token")
        if (!accessToken) {
            window.location.href = "auth/login"
            return
        }
        const accessTokenExpiryTime = new Date(Cookies.get("access_token_expiry")??"")
        const currentDate = new Date()
        if(accessTokenExpiryTime <= currentDate && accessToken){
            Cookies.remove("access_token")
            Cookies.remove("access_token_expiry")
            window.location.href = "auth/login"
            return
        }

        return accessToken
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

    async postWithToken(endpoint: string, options: RequestInit = {}, data: object) {
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

    async postWithoutToken(endpoint: string, options: RequestInit = {}, data: object) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    async postWithTokenFormData(endpoint:string,formData:BodyInit,options:RequestInit = {}){
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