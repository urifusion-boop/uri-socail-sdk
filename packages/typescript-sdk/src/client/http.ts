import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { URISocialConfig, APIError } from '../types';
import {
  AuthenticationError,
  AuthorizationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  InsufficientCreditsError,
  NetworkError,
  ServerError,
  URISocialError,
} from '../types/errors';
import { defaultRetryConfig, calculateBackoffDelay, shouldRetry, RetryConfig } from './retry';

export class HTTPClient {
  private client: AxiosInstance;
  private apiKey: string;
  private defaultWorkspaceId?: string;
  private defaultEndUserId?: string;
  private retryConfig: RetryConfig;

  constructor(config: URISocialConfig) {
    this.apiKey = config.apiKey;
    this.defaultWorkspaceId = config.workspaceId;
    this.defaultEndUserId = config.endUserId;
    this.retryConfig = { ...defaultRetryConfig, ...config.retryConfig };

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.urisocial.com',
      timeout: config.timeout || 60000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `urisocial-sdk-typescript/3.0.0`,
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

      // Add end-user context if available (multi-tenant mode)
      if (this.defaultEndUserId) {
        config.headers['X-End-User-ID'] = this.defaultEndUserId;
      }

      return config;
    });

    // Response interceptor - handle errors with proper error classes
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<any>) => {
        throw this.handleError(error);
      }
    );
  }

  private getSDKVersion(): string {
    // This will be replaced during build process
    return '1.0.0';
  }

  private handleError(error: AxiosError<any>): URISocialError {
    // Network errors (no response from server)
    if (!error.response) {
      return new NetworkError(error.message, {
        code: error.code,
        originalError: error.message,
      });
    }

    const status = error.response.status;
    const data = error.response.data;
    const message = data?.detail || data?.message || data?.responseMessage || error.message;

    // Map HTTP status codes to appropriate error classes
    switch (status) {
      case 401:
        return new AuthenticationError(message, data);

      case 403:
        return new AuthorizationError(message, data);

      case 404:
        return new NotFoundError(message, data);

      case 400:
        return new ValidationError(message, data);

      case 402:
        // Insufficient credits
        return new InsufficientCreditsError(
          data?.responseData?.credits_remaining || 0,
          data?.responseData?.upgrade_url
        );

      case 429:
        // Rate limit exceeded
        const retryAfter = error.response.headers['retry-after']
          ? parseInt(error.response.headers['retry-after']) * 1000
          : undefined;
        return new RateLimitError(message, retryAfter, data);

      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message, status, data);

      default:
        return new URISocialError(message, status, 'UNKNOWN_ERROR', data);
    }
  }

  private async requestWithRetry<T>(
    requestFn: () => Promise<any>,
    attempt: number = 0
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error: any) {
      // Check if we should retry
      if (shouldRetry(error, attempt, this.retryConfig)) {
        const delay = calculateBackoffDelay(attempt, this.retryConfig.retryDelay);

        // Log retry attempt (in production, you might want to use a proper logger)
        if (typeof console !== 'undefined') {
          console.warn(
            `[URISocial SDK] Retrying request (attempt ${attempt + 1}/${this.retryConfig.maxRetries}) after ${delay}ms...`
          );
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry the request
        return this.requestWithRetry<T>(requestFn, attempt + 1);
      }

      // No more retries, throw the error
      throw error;
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.get<T>(url, config));
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.post<T>(url, data, config));
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.put<T>(url, data, config));
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.patch<T>(url, data, config));
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.delete<T>(url, config));
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

  /**
   * Set default end-user ID for all requests (multi-tenant mode)
   * @since 3.0.0 - Multi-tenant end-user support
   */
  setEndUserId(endUserId: string | undefined): void {
    this.defaultEndUserId = endUserId;
  }

  /**
   * Get current default end-user ID
   * @since 3.0.0 - Multi-tenant end-user support
   */
  getEndUserId(): string | undefined {
    return this.defaultEndUserId;
  }

  /**
   * Get the underlying Axios instance for advanced use cases
   * @internal
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}
