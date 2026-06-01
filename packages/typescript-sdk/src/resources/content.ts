import { HTTPClient } from '../client/http';
import {
  ContentGenerationRequest,
  ContentGenerationResponse,
  GeneratedContent,
  PaginatedResponse,
  Platform,
} from '../types';

export interface ExtendedContentGenerationRequest extends ContentGenerationRequest {
  seed_type?: 'text' | 'image' | 'url';
  include_images?: boolean;
  image_model?: string;
  brand_context?: Record<string, any>;
  post_type?: 'feed' | 'carousel' | 'story';
  num_slides?: number; // For carousel posts
  acknowledged_incomplete_profile?: boolean;
}

export class ContentResource {
  constructor(private http: HTTPClient) {}

  /**
   * Generate social media content for multiple platforms
   */
  async generate(request: ExtendedContentGenerationRequest): Promise<ContentGenerationResponse> {
    return this.http.post<ContentGenerationResponse>('/social-media/generate-content', {
      seed_content: request.seedContent,
      platforms: request.platforms,
      reference_image: request.referenceImage,
      seed_type: request.seed_type || 'text',
      include_images: request.include_images || false,
      image_model: request.image_model,
      brand_context: request.brand_context,
      post_type: request.post_type || 'feed',
      num_slides: request.num_slides || 3,
      acknowledged_incomplete_profile: request.acknowledged_incomplete_profile || false,
    });
  }

  /**
   * Regenerate content for a specific draft
   * @param draftId - Draft ID to regenerate
   */
  async regenerate(draftId: string): Promise<ContentGenerationResponse> {
    return this.http.post<ContentGenerationResponse>(
      `/social-media/regenerate-content/${draftId}`
    );
  }

  /**
   * Get generated content by ID
   * @deprecated Use drafts.get() instead
   */
  async get(contentId: string): Promise<GeneratedContent> {
    return this.http.get<GeneratedContent>(`/api/v1/content/${contentId}`);
  }

  /**
   * List all generated content with pagination
   * @deprecated Use drafts.list() instead
   */
  async list(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<GeneratedContent>> {
    return this.http.get<PaginatedResponse<GeneratedContent>>(
      `/api/v1/content?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * Delete generated content
   * @deprecated Use drafts.delete() instead
   */
  async delete(contentId: string): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`/api/v1/content/${contentId}`);
  }
}
