/**
 * SDK Error Types
 */

export class URISocialError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(message: string, statusCode?: number, code?: string, details?: any) {
    super(message);
    this.name = 'URISocialError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, URISocialError);
    }
  }
}

export class AuthenticationError extends URISocialError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends URISocialError {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
    this.name = 'AuthorizationError';
  }
}

export class RateLimitError extends URISocialError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, details?: any) {
    super(message, 429, 'RATE_LIMIT_ERROR', details);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ValidationError extends URISocialError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends URISocialError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
    this.name = 'NotFoundError';
  }
}

export class InsufficientCreditsError extends URISocialError {
  public readonly creditsRemaining: number;
  public readonly upgradeUrl?: string;

  constructor(creditsRemaining: number = 0, upgradeUrl?: string) {
    super('Insufficient credits. Please upgrade your plan.', 402, 'INSUFFICIENT_CREDITS', {
      creditsRemaining,
      upgradeUrl,
    });
    this.name = 'InsufficientCreditsError';
    this.creditsRemaining = creditsRemaining;
    this.upgradeUrl = upgradeUrl;
  }
}

export class NetworkError extends URISocialError {
  constructor(message: string = 'Network request failed', details?: any) {
    super(message, undefined, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ServerError extends URISocialError {
  constructor(message: string = 'Internal server error', statusCode: number = 500, details?: any) {
    super(message, statusCode, 'SERVER_ERROR', details);
    this.name = 'ServerError';
  }
}
