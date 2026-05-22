import { HTTPClient } from '../client/http';
import { BillingInfo } from '../types';

export class BillingResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get current billing information and credits
   */
  async getInfo(): Promise<BillingInfo> {
    return this.http.get<BillingInfo>('/api/v1/billing/info');
  }

  /**
   * Get usage history
   */
  async getUsage(startDate?: string, endDate?: string): Promise<{
    usage: Array<{
      date: string;
      credits_used: number;
      operation_type: string;
    }>;
    total_credits_used: number;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.http.get(`/api/v1/billing/usage${query}`);
  }

  /**
   * Purchase additional credits
   */
  async purchaseCredits(amount: number): Promise<{
    checkout_url: string;
    credits_amount: number;
  }> {
    return this.http.post('/api/v1/billing/purchase-credits', { amount });
  }
}
