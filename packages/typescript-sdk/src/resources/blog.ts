import { HTTPClient } from '../client/http';

export interface BlogGenerationRequest {
  topic: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'conversational';
  length?: 'short' | 'medium' | 'long'; // ~500, ~1000, ~2000 words
  include_images?: boolean;
  seo_optimize?: boolean;
}

export interface BlogDraft {
  id: string;
  user_id: string;
  title: string;
  content: string; // HTML or Markdown
  excerpt?: string;
  featured_image_url?: string;
  keywords: string[];
  meta_description?: string;
  status: 'draft' | 'published';
  word_count: number;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export class BlogResource {
  constructor(private http: HTTPClient) {}

  /**
   * Generate AI-powered blog post
   * @param request - Blog generation parameters
   */
  async generate(request: BlogGenerationRequest): Promise<{ draft: BlogDraft }> {
    return this.http.post<{ draft: BlogDraft }>('/social-media/generate-blog', request);
  }

  /**
   * List all blog drafts
   */
  async list(): Promise<{ drafts: BlogDraft[] }> {
    return this.http.get<{ drafts: BlogDraft[] }>('/social-media/blog-drafts');
  }

  /**
   * Get specific blog draft
   * @param draftId - Blog draft ID
   */
  async get(draftId: string): Promise<{ draft: BlogDraft }> {
    return this.http.get<{ draft: BlogDraft }>(`/social-media/blog-drafts/${draftId}`);
  }
}
