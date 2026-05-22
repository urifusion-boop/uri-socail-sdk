import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { URISocialConfig, APIError } from '../types';

export class HTTPClient {
  private client: AxiosInstance;
  private apiKey: string;
  private defaultWorkspaceId?: string;

  constructor(config: URISocialConfig) {
    this.apiKey = config.apiKey;
    this.defaultWorkspaceId = config.workspaceId;

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.urisocial.com',
      timeout: config.timeout || 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add API key and workspace context
    this.client.interceptors.request.use((config) => {
      if (this.apiKey) {
        config.headers['X-API-Key'] = this.apiKey;
      }

      // Add workspace context if available
      if (this.defaultWorkspaceId) {
        config.headers['X-Workspace-ID'] = this.defaultWorkspaceId;
      }

      return config;
    });

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<APIError>) => {
        if (error.response) {
          const apiError: APIError = {
            error: error.response.data?.error || 'API Error',
            message: error.response.data?.message || error.message,
            status: error.response.status,
          };
          throw apiError;
        }
        throw error;
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Set default workspace ID for all requests
   * @since 2.0.0 - Multi-tenant support
   */
  setWorkspaceId(workspaceId: string | undefined): void {
    this.defaultWorkspaceId = workspaceId;
  }

  /**
   * Get current default workspace ID
   * @since 2.0.0 - Multi-tenant support
   */
  getWorkspaceId(): string | undefined {
    return this.defaultWorkspaceId;
  }
}
