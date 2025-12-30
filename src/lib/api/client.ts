import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiErrorResponse {
  status_code: number;
  message: string;
  error?: string;
  [key: string]: unknown;
}

// Header constants
const HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
  FORM_DATA: {
    'Content-Type': 'multipart/form-data',
  },
  FORM_URLENCODED: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
} as const;

// Helper function to create auth headers
const createAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

class ApiClient {
  private axiosInstance: AxiosInstance;

  // Expose header constants for external use
  public readonly HEADERS = HEADERS;

  constructor() {
    // Create axios instance with default config
    this.axiosInstance = axios.create({
      headers: HEADERS.JSON,
      // Transform response to handle both JSON and text
      transformResponse: [(data, headers) => {
        const contentType = headers?.['content-type'];
        if (contentType && contentType.includes('application/json')) {
          try {
            return typeof data === 'string' ? JSON.parse(data) : data;
          } catch {
            return data;
          }
        }
        return data;
      }],
    });
  }

  private handleError(error: AxiosError): ApiErrorResponse {
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;
    let errorData: Record<string, unknown> = {};

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status;
      
      if (statusCode === 404) {
        errorMessage = 'Cannot process your request';
      } else if (error.response.data) {
        const responseData = error.response.data as Record<string, unknown>;
        errorMessage = (responseData.error as string) || 
                      (responseData.message as string) || 
                      errorMessage;
        errorData = responseData;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || errorMessage;
    }

    return {
      status_code: statusCode,
      message: errorMessage,
      ...errorData,
    };
  }

  /**
   * Check if response contains an API-level error (even with 200 status)
   * Throws error if error_code is present and not null
   */
  private checkResponseForErrors<T>(data: T): T {
    if (data && typeof data === 'object') {
      const responseData = data as Record<string, unknown>;
      
      // Check if error_code exists and is not null
      if (responseData.error_code !== undefined && responseData.error_code !== null) {
        const errorMessage = (responseData.error as string) || 
                           (responseData.message as string) || 
                           (responseData.data_error as string) || 
                           'API returned an error';
        
        throw {
          status_code: (responseData.error_code as number) || 
                      (responseData.status_code as number) || 
                      500,
          message: errorMessage,
          error_code: responseData.error_code,
          ...responseData,
        } as ApiErrorResponse;
      }
    }
    
    return data;
  }

  async request<T = unknown>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request({
        url: endpoint,
        ...config,
      });

      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getWithToken<T = unknown>(
    endpoint: string,
    token: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, {
        ...config,
        headers: {
          ...HEADERS.JSON,
          ...config.headers,
          ...createAuthHeaders(token),
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getWithoutToken<T = unknown>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, {
        ...config,
        headers: {
          ...HEADERS.JSON,
          ...config.headers,
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async postWithToken<T = unknown>(
    endpoint: string,
    token: string,
    data: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data, {
        ...config,
        headers: {
          ...HEADERS.JSON,
          ...config.headers,
          ...createAuthHeaders(token),
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async postWithoutToken<T = unknown>(
    endpoint: string,
    data: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data, {
        ...config,
        headers: {
          ...HEADERS.JSON,
          ...config.headers,
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async postWithTokenFormData<T = unknown>(
    endpoint: string,
    token: string,
    formData: FormData,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      // Axios automatically sets the correct Content-Type for FormData
      const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, formData, {
        ...config,
        headers: {
          ...HEADERS.FORM_DATA,
          ...config.headers,
          ...createAuthHeaders(token),
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async postWithoutTokenFormData<T = unknown>(
    endpoint: string,
    formData: FormData,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, formData, {
        ...config,
        headers: {
          ...HEADERS.FORM_DATA,
          ...config.headers,
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      const apiError = this.handleError(error as AxiosError);
      // Return error in expected format instead of throwing
      const errorResponse = {
        ...apiError,
        status_code: apiError.status_code || 500,
        message: apiError.message || 'An unexpected error occurred',
      };
      return errorResponse as T;
    }
  }

  // Additional utility methods
  async putWithToken<T = unknown>(
    endpoint: string,
    token: string,
    data: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data, {
        ...config,
        headers: {
          ...HEADERS.JSON,
          ...config.headers,
          ...createAuthHeaders(token),
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async deleteWithToken<T = unknown>(
    endpoint: string,
    token: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint, {
        ...config,
        headers: {
          ...HEADERS.JSON,
          ...config.headers,
          ...createAuthHeaders(token),
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async patchWithToken<T = unknown>(
    endpoint: string,
    token: string,
    data: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.patch(endpoint, data, {
        ...config,
        headers: {
          ...HEADERS.JSON,
          ...config.headers,
          ...createAuthHeaders(token),
        },
      });
      
      return this.checkResponseForErrors(response.data);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

const apiClient = new ApiClient();

// Export both the instance and header constants
export default apiClient;
export { HEADERS, createAuthHeaders };
