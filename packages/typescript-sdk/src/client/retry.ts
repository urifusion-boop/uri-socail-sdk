/**
 * Retry configuration and utilities for HTTP requests
 */

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatusCodes: number[];
  retryableErrors: string[];
}

export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN'],
};

export function calculateBackoffDelay(attempt: number, baseDelay: number): number {
  // Exponential backoff with jitter: delay = baseDelay * (2^attempt) + random(0, 1000ms)
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay + jitter, 60000); // Max 60 seconds
}

export function shouldRetry(
  error: any,
  attempt: number,
  config: RetryConfig
): boolean {
  if (attempt >= config.maxRetries) {
    return false;
  }

  // Check for retryable HTTP status codes
  if (error.response?.status && config.retryableStatusCodes.includes(error.response.status)) {
    return true;
  }

  // Check for retryable network errors
  if (error.code && config.retryableErrors.includes(error.code)) {
    return true;
  }

  return false;
}
