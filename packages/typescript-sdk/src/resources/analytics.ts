import { HTTPClient } from '../client/http';

export interface PerformanceMetrics {
  total_posts: number;
  total_impressions: number;
  total_engagements: number;
  total_reach: number;
  engagement_rate: number;
  best_performing_platform?: string;
  best_performing_post?: {
    platform: string;
    content: string;
    engagement_rate: number;
    post_id: string;
  };
}

export interface PlatformAnalytics {
  platform: string;
  posts_count: number;
  impressions: number;
  engagements: number;
  reach: number;
  engagement_rate: number;
  follower_count?: number;
  follower_growth?: number;
}

export interface AccountMetrics {
  platform: string;
  account_name: string;
  account_id: string;
  follower_count: number;
  follower_growth: number;
  engagement_rate: number;
  posts_count: number;
  total_impressions: number;
  total_engagements: number;
}

export interface TrendData {
  trending_topics: Array<{
    topic: string;
    volume: number;
    growth_rate: number;
  }>;
  recommended_hashtags: Array<{
    hashtag: string;
    volume: number;
    engagement_potential: number;
  }>;
  industry_insights?: string[];
}

export class AnalyticsResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get overall performance analytics
   * @param startDate - Start date for analytics (YYYY-MM-DD)
   * @param endDate - End date for analytics (YYYY-MM-DD)
   */
  async getPerformance(startDate?: string, endDate?: string): Promise<PerformanceMetrics> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    return this.http.get<PerformanceMetrics>(`/social-media/performance${query}`);
  }

  /**
   * Get analytics breakdown by platform
   * @param startDate - Start date for analytics (YYYY-MM-DD)
   * @param endDate - End date for analytics (YYYY-MM-DD)
   */
  async getByPlatform(startDate?: string, endDate?: string): Promise<{
    platforms: PlatformAnalytics[];
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    return this.http.get<{ platforms: PlatformAnalytics[] }>(`/social-media/analytics${query}`);
  }

  /**
   * Get metrics for connected accounts
   */
  async getAccountMetrics(): Promise<{ accounts: AccountMetrics[] }> {
    return this.http.get<{ accounts: AccountMetrics[] }>('/social-media/account-metrics');
  }

  /**
   * Get trending topics and recommendations
   * @param industry - Industry for trend data
   * @param region - Geographic region for trends
   */
  async getTrends(industry?: string, region?: string): Promise<TrendData> {
    const params = new URLSearchParams();
    if (industry) params.append('industry', industry);
    if (region) params.append('region', region);
    const query = params.toString() ? `?${params.toString()}` : '';

    return this.http.get<TrendData>(`/social-media/content-calendar/trends${query}`);
  }
}
