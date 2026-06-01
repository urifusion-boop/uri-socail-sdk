import { HTTPClient } from '../client/http';
import { PublishRequest, PublishResult, Platform } from '../types';

export interface ScheduleRequest {
  draft_ids: string[];
  scheduled_datetime: string; // ISO 8601 format
  timezone?: string;
}

export interface ScheduledPost {
  id: string;
  draft_id: string;
  platforms: Platform[];
  scheduled_for: string;
  status: 'pending' | 'published' | 'failed';
  created_at: string;
}

export interface ApprovalRequest {
  draft_ids: string[];
  schedule_option: 'save_draft' | 'immediate' | 'schedule';
  scheduled_datetime?: string;
  approval_notes?: string;
}

export interface DenialRequest {
  draft_ids: string[];
  denial_reason: string;
  request_regeneration?: boolean;
}

export interface RefinementRequest {
  draft_id: string;
  refinements: Record<string, any>; // Specific changes to make
}

export class PublishingResource {
  constructor(private http: HTTPClient) {}

  /**
   * Publish approved drafts immediately
   * Approves and publishes selected drafts to their respective platforms
   * @param request - Approval request with draft IDs and scheduling options
   */
  async approve(request: ApprovalRequest): Promise<{
    success: boolean;
    published_drafts: any[];
    scheduled_drafts?: any[];
  }> {
    return this.http.post('/social-media/approve', request);
  }

  /**
   * Publish a draft to social media platforms
   * @deprecated Use approve() for better approval workflow support
   */
  async publish(request: PublishRequest): Promise<{
    results: PublishResult[];
    overall_status: 'success' | 'partial' | 'failed';
  }> {
    return this.http.post('/api/v1/publish', request);
  }

  /**
   * Schedule drafts for future publishing
   * @param request - Schedule configuration
   */
  async schedule(request: ScheduleRequest): Promise<{
    success: boolean;
    scheduled_posts: ScheduledPost[];
  }> {
    return this.http.post('/social-media/schedule', request);
  }

  /**
   * Get all scheduled posts
   */
  async listScheduled(): Promise<{
    scheduled_posts: ScheduledPost[];
  }> {
    return this.http.get('/social-media/scheduled');
  }

  /**
   * Publish scheduled posts manually (trigger scheduled posts immediately)
   * @param draftIds - Array of draft IDs to publish
   */
  async publishScheduled(draftIds: string[]): Promise<{
    success: boolean;
    results: PublishResult[];
  }> {
    return this.http.post('/social-media/publish-scheduled', { draft_ids: draftIds });
  }

  /**
   * Deny/reject drafts in approval workflow
   * @param request - Denial request with reason
   */
  async deny(request: DenialRequest): Promise<{
    success: boolean;
    denied_drafts: string[];
  }> {
    return this.http.post('/social-media/deny', request);
  }

  /**
   * Request refinements to a draft
   * @param request - Refinement request with specific changes
   */
  async refine(request: RefinementRequest): Promise<{
    success: boolean;
    refined_draft: any;
  }> {
    return this.http.put('/social-media/refine', request);
  }

  /**
   * Cancel a scheduled post
   * @deprecated Use drafts.unschedule() instead
   */
  async cancelScheduled(scheduledId: string): Promise<{ success: boolean }> {
    return this.http.delete(`/api/v1/publish/scheduled/${scheduledId}`);
  }
}
