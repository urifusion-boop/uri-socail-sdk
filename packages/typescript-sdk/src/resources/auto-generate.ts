import { HTTPClient } from '../client/http';
import { Platform } from '../types';

export interface AutoGenerateSettings {
  enabled: boolean;
  platforms: Platform[];
  frequency: 'daily' | 'weekly' | 'biweekly';
  posting_times?: string[]; // e.g., ['09:00', '15:00']
  include_images: boolean;
  content_types?: Array<'feed' | 'story' | 'carousel'>;
  topics?: string[];
  brand_context?: Record<string, any>;
}

export interface ConnectInsightsRequest {
  influencer_id: string;
  platform: 'instagram' | 'facebook' | 'linkedin';
  social_user_id?: string;
  insights: Record<string, any>; // AiMediaReportDto payload
}

export class AutoGenerateResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get auto-generate settings
   */
  async getSettings(): Promise<{ settings: AutoGenerateSettings }> {
    return this.http.get<{ settings: AutoGenerateSettings }>(
      '/social-media/auto-generate/settings'
    );
  }

  /**
   * Update auto-generate settings
   * @param settings - Updated settings
   */
  async updateSettings(
    settings: Partial<AutoGenerateSettings>
  ): Promise<{ settings: AutoGenerateSettings }> {
    return this.http.put<{ settings: AutoGenerateSettings }>(
      '/social-media/auto-generate/settings',
      settings
    );
  }

  /**
   * Connect platform insights for auto-generation
   * Used to provide analytics data that informs auto-generated content
   * @param request - Insights connection data
   */
  async connectInsights(request: ConnectInsightsRequest): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      '/social-media/auto-generate/connect-insights',
      request
    );
  }

  /**
   * Manually trigger auto-generation
   * Useful for testing or generating content on-demand
   */
  async trigger(): Promise<{
    success: boolean;
    drafts_created: number;
    draft_ids: string[];
  }> {
    return this.http.post('/social-media/auto-generate/trigger');
  }
}
