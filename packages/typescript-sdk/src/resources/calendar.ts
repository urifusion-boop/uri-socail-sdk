import { HTTPClient } from '../client/http';
import { Draft } from '../types';

export interface ContentPlan {
  id: string;
  user_id: string;
  days: DayPlan[];
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
}

export interface DayPlan {
  date: string;
  theme: string;
  content_ideas: ContentIdea[];
  posts: Draft[];
}

export interface ContentIdea {
  theme: string;
  caption_preview: string;
  platforms: string[];
  content_type: 'feed' | 'story' | 'carousel' | 'reel';
}

export interface GeneratePlanRequest {
  days: number;
  platforms: string[];
  themes?: string[];
  posting_frequency?: number; // posts per day
}

export interface TodayOverview {
  scheduled_posts: Draft[];
  draft_posts: Draft[];
  published_posts: Draft[];
  upcoming_key_dates: Array<{ date: string; label: string }>;
}

export class CalendarResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get all content (drafts) for calendar view
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  async getContent(startDate?: string, endDate?: string): Promise<{
    drafts: Draft[];
    total: number;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    return this.http.get<{ drafts: Draft[]; total: number }>(
      `/social-media/content-calendar${query}`
    );
  }

  /**
   * Get today's content overview
   */
  async getToday(): Promise<TodayOverview> {
    return this.http.get<TodayOverview>('/social-media/content-calendar/today');
  }

  /**
   * Get active content plan
   */
  async getPlan(): Promise<{ plan: ContentPlan | null }> {
    return this.http.get<{ plan: ContentPlan | null }>('/social-media/content-calendar/plan');
  }

  /**
   * Generate a new content plan
   * @param request - Plan generation parameters
   */
  async generatePlan(request: GeneratePlanRequest): Promise<{ plan: ContentPlan }> {
    return this.http.post<{ plan: ContentPlan }>(
      '/social-media/content-calendar/plan/generate',
      request
    );
  }

  /**
   * Regenerate content ideas for a specific day
   * @param planId - Content plan ID
   * @param dayIndex - Day index (0-based)
   */
  async regenerateDay(planId: string, dayIndex: number): Promise<{ day: DayPlan }> {
    return this.http.post<{ day: DayPlan }>(
      `/social-media/content-calendar/plan/${planId}/day/${dayIndex}/regenerate`
    );
  }

  /**
   * Create draft from content idea
   * @param planId - Content plan ID
   * @param dayIndex - Day index (0-based)
   * @param ideaIndex - Content idea index
   */
  async createDraftFromIdea(
    planId: string,
    dayIndex: number,
    ideaIndex: number
  ): Promise<{ draft: Draft }> {
    return this.http.post<{ draft: Draft }>(
      `/social-media/content-calendar/plan/${planId}/day/${dayIndex}/create-draft`,
      { idea_index: ideaIndex }
    );
  }
}
