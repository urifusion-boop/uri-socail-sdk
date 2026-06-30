import { HTTPClient } from '../client/http';

// ── Video Generation Types ─────────────────────────────────────────────

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
  clips?: Array<{ video_url?: string }>;
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

// ── Video Editing Types ────────────────────────────────────────────────

export interface EditVideoRequest {
  video_url: string;
  edits: Record<string, any>;
}

// ── Video Polish Types ─────────────────────────────────────────────────

export interface PolishVideoRequest {
  video_url: string;
  style: string;
  caption_preset?: string;
  custom_captions?: Array<Record<string, any>>;
}

export interface RestylePolishedVideoRequest {
  job_id: string;
  new_style: string;
}

export interface ClipActionRequest {
  video_url: string;
  action: string;
  params?: Record<string, any>;
}

// ── Video Production Types ─────────────────────────────────────────────

export interface ProduceVideoRequest {
  script: string;
  assets: string[];
  production_settings?: Record<string, any>;
}

// ── Resource ───────────────────────────────────────────────────────────

export class VideoResource {
  constructor(private http: HTTPClient) {}

  // ── Video Generation Pipeline ───────────────────────────────────────

  /**
   * Generate AI-powered video storyboard
   */
  async generateStoryboard(request: StoryboardRequest): Promise<{ storyboard: Storyboard }> {
    return this.http.post<{ storyboard: Storyboard }>('/social-media/generate-storyboard', request);
  }

  /**
   * Generate video from storyboard using AI model
   */
  async generateFromStoryboard(request: VideoFromStoryboardRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/social-media/generate-video-from-storyboard', request);
  }

  /**
   * Get video generation job status
   *
   * Poll this endpoint to check video generation progress.
   */
  async getJobStatus(jobId: string): Promise<VideoJob> {
    return this.http.get<VideoJob>(`/social-media/video-job/${jobId}`);
  }

  /**
   * Generate storyboard frames (preview images for each scene)
   */
  async generateStoryboardFrames(request: StoryboardFramesRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/social-media/generate-storyboard-frames', request);
  }

  /**
   * Get storyboard frame generation job status
   */
  async getFrameJobStatus(jobId: string): Promise<{
    status: string;
    frames?: Array<{ scene_number: number; image_url: string }>;
  }> {
    return this.http.get(`/social-media/storyboard-frame-job/${jobId}`);
  }

  /**
   * Merge video clips into single video
   *
   * Combines all completed clips from a finished video job.
   */
  async mergeVideo(jobId: string): Promise<{ merge_job_id: string; merged_video_url?: string }> {
    return this.http.post<{ merge_job_id: string; merged_video_url?: string }>(
      `/social-media/merge-video-job/${jobId}`
    );
  }

  // ── Video Drafts & Publishing ────────────────────────────────────────

  /**
   * Create video draft
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
   */
  async publishDraft(request: PublishVideoDraftRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/social-media/publish-video-draft', request);
  }

  /**
   * Get video publish job status
   */
  async getPublishJobStatus(jobId: string): Promise<{
    status: string;
    post_id?: string;
    error?: string;
  }> {
    return this.http.get(`/social-media/video-publish-job/${jobId}`);
  }

  // ── Video Editing Pipeline ───────────────────────────────────────────

  /**
   * Edit existing video (Reap clipping pipeline)
   */
  async editVideo(request: EditVideoRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/social-media/edit-video', request);
  }

  /**
   * Get video edit job status
   */
  async getEditJobStatus(jobId: string): Promise<{
    status: string;
    edited_video_url?: string;
    error?: string;
  }> {
    return this.http.get(`/social-media/edit-video-job/${jobId}`);
  }

  // ── Video Polish Pipeline ────────────────────────────────────────────

  /**
   * Get available video polish styles
   */
  async getPolishStyles(): Promise<{ styles: Array<Record<string, any>> }> {
    return this.http.get<{ styles: Array<Record<string, any>> }>('/social-media/video-polish-styles');
  }

  /**
   * Get caption style presets for video polish
   */
  async getCaptionPresets(): Promise<{ presets: Array<Record<string, any>> }> {
    return this.http.get<{ presets: Array<Record<string, any>> }>('/social-media/video-polish-caption-presets');
  }

  /**
   * Polish video with style, captions, effects (Shotstack pipeline)
   */
  async polishVideo(request: PolishVideoRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/social-media/polish-video', request);
  }

  /**
   * Get video polish job status
   */
  async getPolishJobStatus(jobId: string): Promise<{
    status: string;
    polished_video_url?: string;
    error?: string;
  }> {
    return this.http.get(`/social-media/polish-video-job/${jobId}`);
  }

  /**
   * Re-apply different style to polished video
   */
  async restylePolishedVideo(request: RestylePolishedVideoRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/social-media/polish-video-restyle', request);
  }

  /**
   * Apply action to video clip (trim, crop, speed, etc.)
   */
  async applyClipAction(request: ClipActionRequest): Promise<{ action_job_id: string }> {
    return this.http.post<{ action_job_id: string }>('/social-media/polish-video-clip-action', request);
  }

  /**
   * Get clip action job status
   */
  async getClipActionStatus(actionJobId: string): Promise<{
    status: string;
    result_video_url?: string;
    error?: string;
  }> {
    return this.http.get(`/social-media/polish-video-clip-action/${actionJobId}`);
  }

  // ── Video Production Pipeline ────────────────────────────────────────

  /**
   * Produce video from script and assets (GPT-5 analysis + Shotstack)
   */
  async produceVideo(request: ProduceVideoRequest): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/social-media/produce-video', request);
  }

  /**
   * Get video production job status
   */
  async getProductionJobStatus(jobId: string): Promise<{
    status: string;
    preview_url?: string;
    final_video_url?: string;
    error?: string;
  }> {
    return this.http.get(`/social-media/produce-video-job/${jobId}`);
  }

  /**
   * Start final render for production job
   *
   * Call after reviewing preview to start final high-quality render.
   */
  async startProductionRender(jobId: string): Promise<{
    status: string;
    message?: string;
  }> {
    return this.http.post<{ status: string; message?: string }>(
      `/social-media/produce-video-job/${jobId}/start-render`
    );
  }
}
