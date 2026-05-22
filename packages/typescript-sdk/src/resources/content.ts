import { HTTPClient } from '../client/http';
import {
  ContentGenerationRequest,
  GeneratedContent,
  PaginatedResponse,
} from '../types';

export class ContentResource {
  constructor(private http: HTTPClient) {}

  /**
   * Generate social media content for multiple platforms
   */
  async generate(request: ContentGenerationRequest): Promise<GeneratedContent> {
    return this.http.post<GeneratedContent>('/api/v1/content/generate', request);
  }

  /**
   * Get generated content by ID
   */
  async get(contentId: string): Promise<GeneratedContent> {
    return this.http.get<GeneratedContent>(`/api/v1/content/${contentId}`);
  }

  /**
   * List all generated content with pagination
   */
  async list(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<GeneratedContent>> {
    return this.http.get<PaginatedResponse<GeneratedContent>>(
      `/api/v1/content?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * Delete generated content
   */
  async delete(contentId: string): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`/api/v1/content/${contentId}`);
  }
}
