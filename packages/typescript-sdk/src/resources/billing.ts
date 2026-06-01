import { HTTPClient } from '../client/http';

/**
 * Usage information for SDK users
 * Provides visibility into API usage without exposing billing internals
 */
export interface UsageInfo {
  credits_remaining: number;
  api_calls_this_month: number;
  rate_limit_remaining?: number;
  rate_limit_reset?: string;
}

export interface UsageHistory {
  date: string;
  api_calls: number;
  operations: Array<{
    operation_type: string;
    count: number;
  }>;
}

/**
 * Billing/Usage Resource
 *
 * Provides read-only access to usage statistics and credit information.
 * Payment and subscription management should be done through your URI Social dashboard.
 */
export class BillingResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get current usage information
   * Shows credits remaining and API usage statistics
   */
  async getUsageInfo(): Promise<UsageInfo> {
    // This should call a public SDK endpoint that returns usage info
    // without exposing internal billing details
    return this.http.get<UsageInfo>('/api/v1/billing/info');
  }

  /**
   * Get usage history
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  async getUsageHistory(startDate?: string, endDate?: string): Promise<{
    usage: UsageHistory[];
    total_api_calls: number;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.http.get(`/api/v1/billing/usage${query}`);
  }
}
