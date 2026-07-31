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
  logo_size?: 'small' | 'medium' | 'large';
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
  /** Custom Visual Guide V1 ids selected for this brand — generation rotates through these automatically when set (see customGuides resource). */
  selected_custom_guides?: string[];
  /** Custom Visual Guide V2 ids selected for this brand — same rotation behavior as V1, richer style extraction. */
  selected_custom_guides_v2?: string[];

  // Typography
  font_style?: string;
  font_style_prompt?: string;
}

export interface UploadLogoResponse {
  logo_url: string;
}

export interface UploadSampleTemplateResponse {
  file_url: string;
}

export interface VoiceAnalysisResponse {
  analysis: Record<string, any>;
  updated_voice_profile?: Record<string, any>;
  merged: boolean;
}

/** Accepts either a raw base64 string or a data URL (data:image/png;base64,...). */
function base64ToBlob(base64: string): Blob {
  const match = base64.match(/^data:([^;]+);base64,(.*)$/);
  const mimeType = match ? match[1] : 'application/octet-stream';
  const data = match ? match[2] : base64;
  const byteChars = atob(data);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
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
   * Upload brand logo. To set where it's placed on generated images, use
   * update({ logo_position, logo_size }) as a separate call — the upload
   * endpoint itself doesn't accept a position (there's nowhere on the
   * backend for it to go; it's read from the profile at generation time).
   * @param file - Logo image file (base64/data URL string, or a File object)
   */
  async uploadLogo(file: string | File): Promise<UploadLogoResponse> {
    const formData = new FormData();
    const filePart = typeof file === 'string' ? base64ToBlob(file) : file;
    formData.append('file', filePart, typeof file === 'string' ? 'logo.png' : file.name);

    const response = await this.http.post<{ responseData: UploadLogoResponse }>(
      '/social-media/brand-profile/logo',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.responseData;
  }

  /**
   * Upload sample template for style reference
   * @param file - Template image file (base64/data URL string, or a File object)
   */
  async uploadSampleTemplate(file: string | File): Promise<UploadSampleTemplateResponse> {
    const formData = new FormData();
    const filePart = typeof file === 'string' ? base64ToBlob(file) : file;
    formData.append('file', filePart, typeof file === 'string' ? 'template.png' : file.name);

    const response = await this.http.post<{ responseData: UploadSampleTemplateResponse }>(
      '/social-media/brand-profile/sample-template',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.responseData;
  }

  /**
   * Analyze voice samples (max 5) to derive brand voice. By default, merges
   * the result into the brand profile — pass mergeWithProfile: false to
   * just preview the analysis without saving it.
   * @param samples - Sample captions/text representing the brand's voice
   */
  async analyzeVoiceSamples(
    samples: string[],
    mergeWithProfile: boolean = true
  ): Promise<VoiceAnalysisResponse> {
    const response = await this.http.post<{ responseData: VoiceAnalysisResponse }>(
      '/social-media/brand-profile/analyze-voice-samples',
      { sample_captions: samples, merge_with_profile: mergeWithProfile }
    );
    return response.responseData;
  }
}
