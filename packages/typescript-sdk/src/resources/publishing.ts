import { HTTPClient } from '../client/http';
import { PublishRequest, PublishResult } from '../types';

export class PublishingResource {
  constructor(private http: HTTPClient) {}

  /**
   * Publish a draft to social media platforms
   */
  async publish(request: PublishRequest): Promise<{
    results: PublishResult[];
    overall_status: 'success' | 'partial' | 'failed';
  }> {
    return this.http.post('/api/v1/publish', request);
  }

  /**
   * Schedule a draft for future publishing
   */
  async schedule(request: PublishRequest & { scheduleTime: string }): Promise<{
    scheduled_id: string;
    scheduled_for: string;
  }> {
    return this.http.post('/api/v1/publish/schedule', request);
  }

  /**
   * Get scheduled posts
   */
  async listScheduled(): Promise<{
    scheduled_posts: Array<{
      id: string;
      draft_id: string;
      platforms: string[];
      scheduled_for: string;
      status: 'pending' | 'published' | 'failed';
    }>;
  }> {
    return this.http.get('/api/v1/publish/scheduled');
  }

  /**
   * Cancel a scheduled post
   */
  async cancelScheduled(scheduledId: string): Promise<{ success: boolean }> {
    return this.http.delete(`/api/v1/publish/scheduled/${scheduledId}`);
  }
}
