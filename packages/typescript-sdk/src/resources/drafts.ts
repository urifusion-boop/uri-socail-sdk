import { HTTPClient } from '../client/http';
import { Draft, PaginatedResponse, PlatformContent } from '../types';

export class DraftsResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get all drafts with pagination
   */
  async list(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Draft>> {
    return this.http.get<PaginatedResponse<Draft>>(
      `/api/v1/drafts?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * Get a specific draft by ID
   */
  async get(draftId: string): Promise<Draft> {
    return this.http.get<Draft>(`/api/v1/drafts/${draftId}`);
  }

  /**
   * Update draft content
   */
  async update(
    draftId: string,
    updates: {
      text_content?: PlatformContent[];
      image_url?: string;
    }
  ): Promise<Draft> {
    return this.http.patch<Draft>(`/api/v1/drafts/${draftId}`, updates);
  }

  /**
   * Delete a draft
   */
  async delete(draftId: string): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`/api/v1/drafts/${draftId}`);
  }

  /**
   * Create a new draft manually
   */
  async create(draft: {
    text_content: PlatformContent[];
    image_url?: string;
    reference_image?: string;
  }): Promise<Draft> {
    return this.http.post<Draft>('/api/v1/drafts', draft);
  }
}
