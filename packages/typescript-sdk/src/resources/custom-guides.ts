import { HTTPClient } from '../client/http';

// ── Types ──────────────────────────────────────────────────────────────

export interface CustomGuide {
  id: string;
  user_id: string;
  brand_id?: string;
  name: string;
  original_image_url: string;
  uploaded_at: string;
  aesthetic_summary: Record<string, any>;
  typography_match: Record<string, any>;
  match_outcome: string;
  metadata_tags: Record<string, any>;
  times_used: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface UploadReferenceImageRequest {
  image_url: string;
  name: string;
  brand_id?: string;
}

export interface UpdateGuideFontRequest {
  matched_font_id: string;
}

export interface ListGuidesParams {
  brand_id?: string;
  status?: 'active' | 'archived';
  limit?: number;
  offset?: number;
}

export interface AutoRematchParams {
  brand_id?: string;
  min_confidence_threshold?: number;
}

export interface CleanupArchivedParams {
  days_threshold?: number;
}

// ── Resource ───────────────────────────────────────────────────────────

export class CustomGuidesResource {
  constructor(private http: HTTPClient) {}

  /**
   * Upload and process reference image to create custom visual guide
   *
   * Performs:
   * - Safety, quality, copyright screening
   * - Aesthetic extraction (GPT-4o-mini Vision)
   * - Typography extraction and font matching
   * - Prompt assembly
   * - 11-dimension metadata tagging
   */
  async uploadReferenceImage(request: UploadReferenceImageRequest): Promise<{ guide: CustomGuide }> {
    return this.http.post<{ guide: CustomGuide }>('/social-media/custom-guides/upload', request);
  }

  /**
   * List custom visual guides
   */
  async listGuides(params?: ListGuidesParams): Promise<{ guides: CustomGuide[] }> {
    return this.http.get<{ guides: CustomGuide[] }>('/social-media/custom-guides', { params });
  }

  /**
   * Get specific custom visual guide
   */
  async getGuide(guideId: string): Promise<{ guide: CustomGuide }> {
    return this.http.get<{ guide: CustomGuide }>(`/social-media/custom-guides/${guideId}`);
  }

  /**
   * Update guide's matched font
   */
  async updateGuideFont(guideId: string, request: UpdateGuideFontRequest): Promise<{ guide: CustomGuide }> {
    return this.http.patch<{ guide: CustomGuide }>(`/social-media/custom-guides/${guideId}/font`, request);
  }

  /**
   * Delete (archive) custom visual guide
   */
  async deleteGuide(guideId: string): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`/social-media/custom-guides/${guideId}`);
  }

  /**
   * Re-run typography matching for guide
   *
   * Useful when font library is updated or initial match was poor.
   */
  async rematchTypography(guideId: string): Promise<{ guide: CustomGuide }> {
    return this.http.post<{ guide: CustomGuide }>(`/social-media/custom-guides/${guideId}/rematch`);
  }

  /**
   * Automatically re-match typography for all guides below confidence threshold
   */
  async autoRematchAll(params?: AutoRematchParams): Promise<{ summary: Record<string, any> }> {
    return this.http.post<{ summary: Record<string, any> }>('/social-media/custom-guides/auto-rematch', null, {
      params,
    });
  }

  /**
   * Track usage of custom visual guide
   *
   * Increments times_used counter for analytics.
   */
  async trackUsage(guideId: string): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`/social-media/custom-guides/${guideId}/track-usage`);
  }

  /**
   * Cleanup archived guides older than threshold
   */
  async cleanupArchived(params?: CleanupArchivedParams): Promise<{ summary: Record<string, any> }> {
    return this.http.post<{ summary: Record<string, any> }>('/social-media/custom-guides/cleanup-archived', null, {
      params,
    });
  }
}
