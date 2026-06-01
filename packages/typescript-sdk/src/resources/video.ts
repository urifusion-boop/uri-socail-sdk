import { HTTPClient } from '../client/http';

export interface StoryboardRequest {
  brand_images: string[]; // 1-5 images
  optional_text?: string; // max 1000 chars
  target_platform?: 'instagram_reels' | 'facebook_reels' | 'tiktok';
  target_duration_seconds?: number; // 5-30 seconds
  video_style?: string; // e.g., 'clean_commercial'
}

export interface Storyboard {
  scenes: Scene[];
  total_duration: number;
  platform: string;
  style: string;
}

export interface Scene {
  scene_number: number;
  duration: number;
  description: string;
  visual_elements: string[];
  transition?: string;
}

export interface VideoFromStoryboardRequest {
  storyboard: Storyboard;
  brand_images: string[];
  model?: string; // e.g., 'veo-3.1-generate-preview'
}

export interface StoryboardFramesRequest {
  scenes: Scene[];
  brand_images?: string[];
}

export interface VideoJob {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  error?: string;
  progress?: number;
}

export interface VideoDraft {
  id: string;
  user_id: string;
  storyboard: Storyboard;
  video_url?: string;
  thumbnail_url?: string;
  platform: string;
  caption?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface PublishVideoDraftRequest {
  draft_id: string;
  platform: 'instagram_reels' | 'facebook_reels';
  caption?: string;
}

export class VideoResource {
  constructor(private http: HTTPClient) {}

  /**
   * Generate AI-powered video storyboard
   * @param request - Storyboard generation parameters
   */
  async generateStoryboard(request: StoryboardRequest): Promise<{ storyboard: Storyboard }> {
    return this.http.post<{ storyboard: Storyboard }>(
      '/social-media/generate-storyboard',
      request
    );
  }

  /**
   * Generate video from storyboard
   * @param request - Video generation parameters
   */
  async generateFromStoryboard(
    request: VideoFromStoryboardRequest
  ): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>(
      '/social-media/generate-video-from-storyboard',
      request
    );
  }

  /**
   * Get video generation job status
   * @param jobId - Video generation job ID
   */
  async getJobStatus(jobId: string): Promise<VideoJob> {
    return this.http.get<VideoJob>(`/social-media/video-job/${jobId}`);
  }

  /**
   * Generate storyboard frames (images for each scene)
   * @param request - Storyboard frames generation parameters
   */
  async generateStoryboardFrames(
    request: StoryboardFramesRequest
  ): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>(
      '/social-media/generate-storyboard-frames',
      request
    );
  }

  /**
   * Get storyboard frame generation job status
   * @param jobId - Frame generation job ID
   */
  async getFrameJobStatus(jobId: string): Promise<{
    status: string;
    frames?: Array<{ scene_number: number; image_url: string }>;
  }> {
    return this.http.get(`/social-media/storyboard-frame-job/${jobId}`);
  }

  /**
   * Merge video job (combine generated scenes)
   * @param jobId - Video job ID to merge
   */
  async mergeVideo(jobId: string): Promise<{ merge_job_id: string }> {
    return this.http.post<{ merge_job_id: string }>(
      `/social-media/merge-video-job/${jobId}`
    );
  }

  /**
   * Create video draft
   * @param draft - Video draft data
   */
  async createDraft(draft: {
    storyboard: Storyboard;
    video_url?: string;
    thumbnail_url?: string;
    platform: string;
    caption?: string;
  }): Promise<{ draft: VideoDraft }> {
    return this.http.post<{ draft: VideoDraft }>('/social-media/video-drafts', draft);
  }

  /**
   * List all video drafts
   */
  async listDrafts(): Promise<{ drafts: VideoDraft[] }> {
    return this.http.get<{ drafts: VideoDraft[] }>('/social-media/video-drafts');
  }

  /**
   * Publish video draft to social platform
   * @param request - Publish request
   */
  async publishDraft(request: PublishVideoDraftRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>(
      '/social-media/publish-video-draft',
      request
    );
  }

  /**
   * Get video publish job status
   * @param jobId - Publish job ID
   */
  async getPublishJobStatus(jobId: string): Promise<{
    status: string;
    post_id?: string;
    error?: string;
  }> {
    return this.http.get(`/social-media/video-publish-job/${jobId}`);
  }
}
