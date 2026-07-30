import { HTTPClient } from '../client/http';
import { Draft, PaginatedResponse, PlatformContent } from '../types';

export interface RegenerateImageRequest {
  prompt?: string;
  style?: string;
}

export interface EditImageRequest {
  prompt: string;
  mask_url?: string;
}

export interface UpdateSlideRequest {
  headline?: string;
  body?: string;
  image_url?: string;
}

export class DraftsResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get all drafts with pagination
   *
   * @remarks Backed by /social-media/content-calendar, brand-scoped under
   * multi-tenant mode — the legacy /api/v1/drafts endpoint this used to call
   * only ever scoped by the developer's shared account, so every end-user
   * saw every other end-user's drafts.
   */
  async list(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Draft>> {
    const skip = (page - 1) * perPage;
    const response = await this.http.get<{
      responseData: {
        drafts: Draft[];
        total_count: number;
        pagination: { skip: number; limit: number; has_more: boolean };
      };
    }>(`/social-media/content-calendar?skip=${skip}&limit=${perPage}`);

    const { drafts, total_count, pagination } = response.responseData;
    return {
      data: drafts,
      total: total_count,
      page,
      per_page: perPage,
      has_more: pagination.has_more,
    } as PaginatedResponse<Draft>;
  }

  /**
   * Get a specific draft by ID
   */
  async get(draftId: string): Promise<Draft> {
    return this.http.get<Draft>(`/social-media/drafts/${draftId}`);
  }

  /**
   * Get draft image URL (for streaming/progressive loading)
   */
  async getImage(draftId: string): Promise<{ image_url?: string; status: string }> {
    return this.http.get<{ image_url?: string; status: string }>(
      `/social-media/draft-image/${draftId}`
    );
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
    const response = await this.http.patch<{ responseData: Draft }>(
      `/social-media/drafts/${draftId}`,
      updates
    );
    return response.responseData;
  }

  /**
   * Delete a draft
   */
  async delete(draftId: string): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`/social-media/drafts/${draftId}`);
  }

  /**
   * Create a new draft manually
   *
   * @remarks Not currently supported — no brand-scoped equivalent of the
   * legacy /api/v1/drafts create endpoint exists yet. That legacy endpoint
   * is not brand-isolated under multi-tenant mode, so it's intentionally
   * not called here. Use content.generate() to create drafts instead.
   */
  async create(_draft: {
    text_content: PlatformContent[];
    image_url?: string;
    reference_image?: string;
  }): Promise<Draft> {
    throw new Error(
      'drafts.create() is not currently supported for SDK/multi-tenant use — use content.generate() instead.'
    );
  }

  /**
   * Regenerate image for a draft
   * @param draftId - Draft ID
   * @param request - Image regeneration parameters
   */
  async regenerateImage(
    draftId: string,
    request?: RegenerateImageRequest
  ): Promise<{ image_url: string }> {
    return this.http.post<{ image_url: string }>(
      `/social-media/drafts/${draftId}/regenerate-image`,
      request || {}
    );
  }

  /**
   * Edit draft image with AI
   * @param draftId - Draft ID
   * @param request - Image edit parameters
   */
  async editImage(draftId: string, request: EditImageRequest): Promise<{ image_url: string }> {
    return this.http.post<{ image_url: string }>(
      `/social-media/drafts/${draftId}/edit-image`,
      request
    );
  }

  /**
   * Undo last image edit
   * @param draftId - Draft ID
   */
  async undoImageEdit(draftId: string): Promise<{ image_url: string }> {
    return this.http.post<{ image_url: string }>(
      `/social-media/drafts/${draftId}/undo-image`
    );
  }

  /**
   * Unschedule a scheduled draft
   * @param draftId - Draft ID
   */
  async unschedule(draftId: string): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `/social-media/drafts/${draftId}/unschedule`
    );
  }

  // ============================================================================
  // Carousel-specific methods
  // ============================================================================

  /**
   * Update a specific slide in a carousel draft
   * @param draftId - Draft ID
   * @param slideIndex - Slide index (0-based)
   * @param updates - Slide updates
   */
  async updateSlide(
    draftId: string,
    slideIndex: number,
    updates: UpdateSlideRequest
  ): Promise<{ slide: any }> {
    return this.http.patch<{ slide: any }>(
      `/social-media/drafts/${draftId}/slides/${slideIndex}`,
      updates
    );
  }

  /**
   * Regenerate image for a specific slide
   * @param draftId - Draft ID
   * @param slideIndex - Slide index
   */
  async regenerateSlideImage(draftId: string, slideIndex: number): Promise<{ image_url: string }> {
    return this.http.post<{ image_url: string }>(
      `/social-media/drafts/${draftId}/slides/${slideIndex}/regenerate-image`
    );
  }

  /**
   * Delete a slide from carousel
   * @param draftId - Draft ID
   * @param slideIndex - Slide index
   */
  async deleteSlide(draftId: string, slideIndex: number): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `/social-media/drafts/${draftId}/slides/${slideIndex}`
    );
  }

  /**
   * Reorder slides in a carousel
   * @param draftId - Draft ID
   * @param newOrder - Array of slide indices in new order
   */
  async reorderSlides(draftId: string, newOrder: number[]): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `/social-media/drafts/${draftId}/slides/reorder`,
      { new_order: newOrder }
    );
  }
}
