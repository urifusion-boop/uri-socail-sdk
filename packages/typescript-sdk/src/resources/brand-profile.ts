import { HTTPClient } from '../client/http';

export interface BrandProfile {
  // Basics
  brand_name?: string;
  industry?: string;
  website?: string;
  tagline?: string;
  product_description?: string;
  key_products_services?: string[];

  // Identity
  logo_url?: string;
  logo_position?: 'top_left' | 'top_center' | 'top_right' | 'bottom_left' | 'bottom_center' | 'bottom_right' | 'center';
  brand_colors?: string[];
  sample_template_urls?: string[];

  // Personality
  personality_quiz?: Record<string, string>;
  derived_voice?: string;
  voice_sample?: string;
  platform_tones?: Record<string, string>;
  same_tone_everywhere?: boolean;

  // Content strategy
  content_pillars?: string[];
  preferred_formats?: string[];
  guardrails?: {
    avoid_topics?: string;
    banned_words?: string;
    emoji_usage?: string;
    max_hashtags?: string;
    compliance_notes?: string;
  };
  cta_styles?: string[];
  default_link?: string;

  // Audience
  audience_age_range?: string;
  target_platforms?: string[];
  primary_goal?: string;

  // Competitors
  competitor_handles?: string[];

  // Scheduling
  key_dates?: Array<{ date: string; label: string }>;
  posting_cadence?: string;
  posting_time_mode?: string;
  posting_time_prefs?: Record<string, string>;

  // Approval
  approval_workflow?: string;
  approval_channels?: string[];
  notification_events?: string[];
  notification_channel?: string;

  // Team
  team_members?: Array<{ email: string; role: string }>;

  // Localisation
  languages?: string[];
  region?: string;

  // Meta
  onboarding_completed?: boolean;

  // Visual style
  style_selections?: string[];
  style_prompt_fragments?: string[];

  // Typography
  font_style?: string;
  font_style_prompt?: string;
}

export interface UploadLogoResponse {
  logo_url: string;
}

export interface VoiceAnalysisResponse {
  derived_voice: string;
  confidence_score?: number;
  voice_characteristics?: string[];
}

export class BrandProfileResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get current user's brand profile
   */
  async get(): Promise<{ status: boolean; responseData: BrandProfile }> {
    return this.http.get<{ status: boolean; responseData: BrandProfile }>('/social-media/brand-profile');
  }

  /**
   * Update brand profile
   */
  async update(profile: Partial<BrandProfile>): Promise<{ status: boolean; responseData: BrandProfile }> {
    return this.http.post<{ status: boolean; responseData: BrandProfile }>(
      '/social-media/brand-profile',
      profile
    );
  }

  /**
   * Upload brand logo
   * @param file - Logo image file (base64 or File object)
   * @param position - Logo position on generated images
   */
  async uploadLogo(file: string | File, position?: string): Promise<UploadLogoResponse> {
    const formData = new FormData();

    if (typeof file === 'string') {
      // Base64 string
      formData.append('logo_file', file);
    } else {
      // File object
      formData.append('logo_file', file);
    }

    if (position) {
      formData.append('logo_position', position);
    }

    return this.http.post<UploadLogoResponse>('/social-media/brand-profile/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Upload sample template for style reference
   * @param file - Template image file
   */
  async uploadSampleTemplate(file: string | File): Promise<{ template_url: string }> {
    const formData = new FormData();

    if (typeof file === 'string') {
      formData.append('template_file', file);
    } else {
      formData.append('template_file', file);
    }

    return this.http.post<{ template_url: string }>(
      '/social-media/brand-profile/sample-template',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Analyze voice samples to derive brand voice
   * @param samples - Array of sample text content representing brand voice
   */
  async analyzeVoiceSamples(samples: string[]): Promise<VoiceAnalysisResponse> {
    return this.http.post<VoiceAnalysisResponse>('/social-media/brand-profile/analyze-voice-samples', {
      voice_samples: samples,
    });
  }
}
