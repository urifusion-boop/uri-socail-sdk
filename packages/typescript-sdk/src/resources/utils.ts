import { HTTPClient } from '../client/http';

export interface OnboardingStatus {
  completed: boolean;
  steps_completed: string[];
  steps_remaining: string[];
  completion_percentage: number;
}

export interface PlatformRequirements {
  platform: string;
  character_limits: {
    caption?: number;
    bio?: number;
    hashtags?: number;
  };
  media_requirements: {
    image_formats: string[];
    image_sizes: string[];
    video_formats?: string[];
    video_max_duration?: number;
  };
  supported_features: string[];
}

export interface ImageTextExtraction {
  text: string;
  confidence: number;
  language?: string;
}

export class UtilsResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get user's onboarding status
   */
  async getOnboardingStatus(): Promise<OnboardingStatus> {
    return this.http.get<OnboardingStatus>('/social-media/onboarding/status');
  }

  /**
   * Get platform-specific requirements and limits
   * @param platform - Social media platform
   */
  async getPlatformRequirements(platform: string): Promise<PlatformRequirements> {
    return this.http.get<PlatformRequirements>(
      `/social-media/platform-requirements/${platform}`
    );
  }

  /**
   * Extract text from image using OCR
   * @param imageUrl - Image URL to extract text from
   */
  async extractImageText(imageUrl: string): Promise<ImageTextExtraction> {
    return this.http.post<ImageTextExtraction>('/social-media/extract-image-text', {
      image_url: imageUrl,
    });
  }

  /**
   * Upload custom font for image generation
   * @param file - Font file
   * @param fontName - Name for the font
   */
  async uploadCustomFont(file: File | string, fontName: string): Promise<{ font_id: string }> {
    const formData = new FormData();

    if (typeof file === 'string') {
      formData.append('font_file', file);
    } else {
      formData.append('font_file', file);
    }

    formData.append('font_name', fontName);

    return this.http.post<{ font_id: string }>('/social-media/upload-custom-font', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Analyze custom font characteristics
   * @param fontId - Uploaded font ID
   */
  async analyzeCustomFont(fontId: string): Promise<{
    font_family: string;
    style: string;
    weight: string;
    characteristics: string[];
  }> {
    return this.http.post('/social-media/analyze-custom-font', { font_id: fontId });
  }

  /**
   * Sync image to draft (internal utility)
   * @param draftId - Draft ID
   * @param imageUrl - Image URL to sync
   */
  async syncImage(draftId: string, imageUrl: string): Promise<{ success: boolean }> {
    return this.http.post('/social-media/image-sync', {
      draft_id: draftId,
      image_url: imageUrl,
    });
  }
}
