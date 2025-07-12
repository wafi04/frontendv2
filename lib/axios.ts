import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { BACKEND_URL } from "../constants";
import { API_RESPONSE } from "@/types/response";

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface RequestConfig {
  isMultipart?: boolean;
  headers?: Record<string, string>;
}

export class Api {
  private instance: AxiosInstance;
 private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: BACKEND_URL,
      withCredentials: true,
    });

  

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 errors with refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (!this.isRefreshing) {
              this.isRefreshing = true;
              this.refreshPromise = this.instance.post('/auth/refresh');
            }

            await this.refreshPromise;
            
            this.isRefreshing = false;
            this.refreshPromise = null;

            // Retry original request
            return this.instance(originalRequest);
          } catch (refreshError) {            
            // Reset refresh state
            this.isRefreshing = false;
            this.refreshPromise = null;
            
            // Redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            
            return Promise.reject(refreshError);
          }
        }}
        )
  }

  private formatData(data: unknown, isMultipart: boolean = false): unknown {
    if (!isMultipart) return data;

    const formData = new FormData();
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[${index}]`, item);
            } else {
              formData.append(`${key}[${index}]`, String(item));
            }
          });
        } else {
          formData.append(key, String(value));
        }
      });
    }
    return formData;
  }
  private getHeaders(config?: RequestConfig) {
    if (config?.isMultipart) {
      return {
        ...config?.headers,
      };
    }

    return {
      "Content-Type": "application/json",
      ...config?.headers,
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<API_RESPONSE<T>> {
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, {
        headers: this.getHeaders(config),
      });
      return {
                success : response.success,
        data: response.data,
        code: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<API_RESPONSE<T>> {
    try {
      // Jika data adalah FormData, gunakan langsung
      const formattedData =
        data instanceof FormData
          ? data
          : this.formatData(data, config?.isMultipart);

      const response: AxiosResponse<T> = await this.instance.post(
        url,
        formattedData,
        {
          headers: this.getHeaders(config),
        }
      );
      return {
                success : response.success,
        data: response.data,
        code: response.status,
        message: response.statusText,
      };
    } catch (error) {
      console.error("API Error:", error);
      throw this.handleError(error as AxiosError);
    }
  }
  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<API_RESPONSE<T>> {
    try {
      const formattedData =
        data instanceof FormData
          ? data
          : this.formatData(data, config?.isMultipart);

      const response: AxiosResponse<T> = await this.instance.put(
        url,
        formattedData,
        {
          headers: this.getHeaders(config),
        }
      );
      return {
        success : response.success,
        data: response.data,
        code: response.status,
        message: response.statusText,
      };
    } catch (error) {
      console.error("API Error:", error);
      throw this.handleError(error as AxiosError);
    }
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<API_RESPONSE<T>> {
    try {
      const formattedData = this.formatData(data, config?.isMultipart);
      const response: AxiosResponse<T> = await this.instance.patch(
        url,
        formattedData,
        {
          headers: this.getHeaders(config),
        }
      );
      return {
                success : response.success,

        data: response.data,
        code: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async delete<T>(
    url: string,
    config?: RequestConfig
  ): Promise<API_RESPONSE<T>> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(url, {
        headers: this.getHeaders(config),
      });
      return {
                success : response.success,

        data: response.data,
        code: response.status,
        message: response.statusText,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  private handleError(error: AxiosError): ApiError {
    return {
      message: error.message,
      status: error.response?.status,
      code: error.code,
    };
  }
}

export const api = new Api();