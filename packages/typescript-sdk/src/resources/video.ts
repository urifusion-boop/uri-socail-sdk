import { HTTPClient } from '../client/http';

// ── Shared Billing Types ─────────────────────────────────────────────────
// Video Editing Billing PRD: produce/submagic/zapcap jobs are billed at
// `ceil(duration_seconds / 60) * credits_per_minute`, charged before the
// job is submitted for processing and refunded automatically if the job
// later fails. Every one of those three "produce" calls below returns this
// summary so you can show the user exactly what they were charged.

export interface VideoBillingSummary {
  duration_seconds: number;
  billable_minutes: number;
  credits_charged: number;
  is_trial: boolean;
}

export interface VideoEditingPricing {
  credits_per_minute: number;
}

const MULTIPART_HEADERS = { headers: { 'Content-Type': 'multipart/form-data' } };

function appendIfDefined(form: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null) return;
  if (typeof value === 'boolean') {
    form.append(key, value ? 'true' : 'false');
  } else if (value instanceof File || value instanceof Blob) {
    form.append(key, value);
  } else {
    form.append(key, String(value));
  }
}

// ── Storyboard / Veo Generation Pipeline ─────────────────────────────────

export interface StoryboardRequest {
  /** 1-5 base64 image data URLs */
  brand_images: string[];
  /** Optional creative direction, max 1000 chars */
  optional_text?: string;
  target_platform?: 'instagram_reels' | 'facebook_reels' | 'tiktok';
  /** 5-30 seconds */
  target_duration_seconds?: number;
  video_style?: string;
}

export interface Scene {
  scene_number: number;
  duration: number;
  description: string;
  visual_elements: string[];
  transition?: string;
  [key: string]: any;
}

export interface Storyboard {
  scenes: Scene[];
  total_duration: number;
  platform: string;
  style: string;
  [key: string]: any;
}

export interface VideoFromStoryboardRequest {
  storyboard: Storyboard | Record<string, any>;
  brand_images?: string[];
  /** default: 'veo-3.1-generate-preview' */
  model?: string;
}

export interface StoryboardFramesRequest {
  scenes: Scene[] | Record<string, any>[];
  brand_images?: string[];
}

export interface VideoGenerationJob {
  job_id: string;
  status: 'queued' | 'generating' | 'complete' | 'failed';
  current_scene: number;
  clips: Array<{ video_url?: string; [key: string]: any }>;
  error?: string;
  [key: string]: any;
}

export interface StoryboardFrameJob {
  job_id: string;
  status: string;
  total_scenes: number;
  frames?: Array<{ scene_number: number; image_url: string }>;
  [key: string]: any;
}

export interface GenerateVideoCaptionRequest {
  storyboard: Record<string, any>;
  platform?: 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
}

// ── Video Drafts & Publishing ─────────────────────────────────────────────

export interface SaveVideoDraftRequest {
  merged_video_url: string;
  caption?: string;
  /** Saves one draft per platform; defaults to ['instagram'] server-side. */
  platforms?: string[];
}

export interface VideoDraft {
  id: string;
  draft_id: string;
  request_id: string;
  platform: string;
  platforms: string[];
  user_id: string;
  media_type: 'video';
  video_url: string;
  content: string;
  status: 'draft' | 'published';
  post_type: string;
  created_at: string;
  [key: string]: any;
}

export interface PublishVideoDraftRequest {
  draft_id: string;
  platform: 'instagram_reels' | 'facebook_reels' | 'tiktok';
  caption?: string;
}

export interface VideoPublishJob {
  job_id: string;
  status: string;
  post_id?: string;
  error?: string;
  [key: string]: any;
}

// ── Video Production Pipeline (produce-video) — billed ────────────────────

export interface ProduceVideoRequest {
  /** Raw video file. Provide this OR sourceUrl, not both. */
  video?: File;
  /** URL to fetch the source video from instead of uploading bytes directly. */
  sourceUrl?: string;
  videoType?: 'founder' | 'product' | 'tiktok';
  templateId?: string;
  enableMusic?: boolean;
  muteOriginalAudio?: boolean;
  enableSfx?: boolean;
  enableCaptions?: boolean;
  /** Optional background music track to mix in. */
  customMusic?: File;
  transitionStyle?: string;
}

export interface ProduceVideoResult {
  job_id: string;
  status: string;
  billing: VideoBillingSummary;
}

export interface ProductionJob {
  job_id: string;
  status: 'processing' | 'awaiting_review' | 'ready' | 'completed' | 'failed';
  status_message: string;
  progress: number;
  output_url: string | null;
  video_type: string;
  template_id: string;
  cuts: Array<{ remove_start: number; remove_end: number; reason: string }>;
  zooms: Array<{ at: number; type: string; intensity: string; reason: string }>;
  pacing_note: string;
  srt: string;
  ai_decisions?: Record<string, any>;
  created_at: string;
  completed_at: string | null;
  billing_duration_seconds?: number;
  billing_billable_minutes?: number;
  billing_credits_charged?: number;
  billing_is_trial?: boolean;
  billing_status?: 'charged' | 'refunded';
  [key: string]: any;
}

export interface StartProductionRenderRequest {
  /** Approved AI decisions — omit to render with the AI's original decisions as-is. */
  decisions?: Record<string, any>;
}

export interface AdjustProductionRequest {
  captionColor?: string;
  captionFont?: string;
  captionTextEdits?: Array<{ index: number; text: string }>;
  hookText?: string;
  hookTextColor?: string;
  hookTextSize?: number;
}

// ── Submagic Pipeline (submagic-produce) — billed ──────────────────────────

export interface SubmagicProduceRequest {
  video: File;
  templateName?: string;
  language?: string;
  removeSilencePace?: 'slow' | 'medium' | 'aggressive' | string;
  magicZooms?: boolean;
  magicBrolls?: boolean;
  cleanAudio?: boolean;
  removeBadTakes?: boolean;
  enableMusic?: boolean;
  /** Only used when enableMusic is true. */
  customMusic?: File;
}

export interface SubmagicProduceResult {
  job_id: string;
  billing: VideoBillingSummary;
}

export interface VideoJobStatus {
  status: string;
  output_url: string | null;
  failure_reason: string | null;
}

// ── ZapCap Pipeline (zapcap-produce) — billed ──────────────────────────────

export interface ZapCapTemplate {
  id: string;
  name: string;
  previews?: { previewGif?: string; previewMp4?: string };
  [key: string]: any;
}

export interface ZapCapBrollPlacement {
  clipIndex: number;
  startTime: number;
  duration: number;
}

export interface ZapCapProduceRequest {
  /** Provide this OR sourceUrl, not both. */
  video?: File;
  sourceUrl?: string;
  templateId?: string;
  language?: string;
  outputMode?: 'composited' | 'transparent' | 'greenScreen';
  quality?: 'standard' | string;
  enableBroll?: boolean;
  enableMusic?: boolean;
  captionStyle?: 'bold' | 'minimal' | 'animated' | string;
  customMusic?: File;
  /** Mutually exclusive with enableBroll's auto b-roll. */
  customBrollClips?: File[];
  /** Explicit placements for customBrollClips — auto-spread evenly if omitted. */
  customBrollPlacements?: ZapCapBrollPlacement[];
  customBrollEstimatedDuration?: number;
}

export interface ZapCapProduceResult {
  job_id: string;
  billing: VideoBillingSummary;
}

export interface ZapCapTranscriptWord {
  id: string;
  text: string;
  type?: string;
  confidence?: number;
  start_time: number;
  end_time: number;
  [key: string]: any;
}

export interface ZapCapRerenderRequest {
  wordEdits?: Array<{ id: string; text: string }>;
  templateId?: string;
  enableBroll?: boolean;
  captionStyle?: string;
}

export interface ZapCapCustomBrollPlacement {
  clip_index: number;
  start_time: number;
  end_time: number;
}

// ── Video Editing (Level 1 FFmpeg pipeline, edit-video) — not billed ──────

export interface EditVideoRequest {
  video: File;
  platform?: 'instagram_reels' | 'facebook_reels' | 'tiktok';
  enhancements?: Record<string, any>;
}

export interface EditVideoJob {
  job_id: string;
  user_id: string;
  status: string;
  output_url?: string;
  platform: string;
  [key: string]: any;
}

// ── Video Polish (Reap pipeline, polish-video) — not billed via VideoBillingService ──

export interface PolishVideoRequest {
  video: File;
  stylePreset?: string;
  language?: string;
  captionsPreset?: string;
}

export interface PolishStyle {
  id: string;
  name: string;
  [key: string]: any;
}

export interface CaptionPreset {
  id: string;
  name: string;
  [key: string]: any;
}

export interface PolishVideoJob {
  job_id: string;
  status: string;
  [key: string]: any;
}

export interface ClipActionRequest {
  jobId: string;
  clipIdx: number;
  action: 'reframe' | 'dub';
  orientation?: 'landscape' | 'portrait';
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface ClipActionJob {
  action_job_id: string;
  status: string;
  result_video_url?: string;
  error?: string;
  [key: string]: any;
}

// ── Resource ────────────────────────────────────────────────────────────

export class VideoResource {
  constructor(private http: HTTPClient) {}

  // ── Billing ──────────────────────────────────────────────────────────

  /**
   * Current video-editing credit rate (credits per billable minute).
   * The rate is admin-configurable server-side — fetch it instead of
   * hard-coding it so your cost previews stay accurate.
   */
  async getPricing(): Promise<VideoEditingPricing> {
    const response = await this.http.get<{ responseData: VideoEditingPricing }>(
      '/social-media/video-editing/pricing'
    );
    return response.responseData;
  }

  /**
   * Admin-only: change the live video-editing credit rate. Requires the
   * caller's JWT email to be on the server's billing-admin allowlist.
   */
  async updatePricing(creditsPerMinute: number): Promise<VideoEditingPricing> {
    const response = await this.http.patch<{ responseData: VideoEditingPricing }>(
      '/social-media/video-editing/pricing',
      { credits_per_minute: creditsPerMinute }
    );
    return response.responseData;
  }

  // ── Video Production Pipeline (billed) ──────────────────────────────

  /**
   * Start a full video production job — cuts, zooms, sound effects,
   * captions, hook text — composed by AI and rendered with Shotstack.
   * Charged before submission per the billing rate above; refunded
   * automatically if the job fails. Poll getProductionJob() for status.
   */
  async produceVideo(request: ProduceVideoRequest): Promise<ProduceVideoResult> {
    const form = new FormData();
    if (request.video) form.append('video', request.video);
    appendIfDefined(form, 'source_url', request.sourceUrl);
    appendIfDefined(form, 'video_type', request.videoType);
    appendIfDefined(form, 'template_id', request.templateId);
    appendIfDefined(form, 'enable_music', request.enableMusic);
    appendIfDefined(form, 'mute_original_audio', request.muteOriginalAudio);
    appendIfDefined(form, 'enable_sfx', request.enableSfx);
    appendIfDefined(form, 'enable_captions', request.enableCaptions);
    if (request.customMusic) form.append('custom_music', request.customMusic);
    appendIfDefined(form, 'transition_style', request.transitionStyle);

    const response = await this.http.post<{ responseData: ProduceVideoResult }>(
      '/social-media/produce-video',
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  /** Poll a produce-video job for status, progress, and output_url. */
  async getProductionJob(jobId: string): Promise<ProductionJob> {
    const response = await this.http.get<{ responseData: ProductionJob }>(
      `/social-media/produce-video-job/${jobId}`
    );
    return response.responseData;
  }

  /**
   * Extract a JPEG frame at time `atSeconds` from a completed production
   * job's output video. Returns raw JPEG bytes as an ArrayBuffer.
   */
  async captureProductionFrame(jobId: string, atSeconds: number = 0): Promise<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(
      `/social-media/produce-video-job/${jobId}/capture-frame`,
      { params: { t: atSeconds }, responseType: 'arraybuffer' }
    );
  }

  /**
   * Approve (optionally edited) AI decisions and start the final render.
   * Call after getProductionJob() returns status "awaiting_review".
   */
  async startProductionRender(
    jobId: string,
    request?: StartProductionRenderRequest
  ): Promise<{ job_id: string; status: string }> {
    const response = await this.http.post<{ responseData: { job_id: string; status: string } }>(
      `/social-media/produce-video-job/${jobId}/start-render`,
      request?.decisions ? { decisions: request.decisions } : {}
    );
    return response.responseData;
  }

  /**
   * Re-render a completed production video with light adjustments
   * (caption color/font/text, hook text). Poll getProductionJob() again
   * for the updated output_url.
   */
  async adjustProduction(
    jobId: string,
    request: AdjustProductionRequest
  ): Promise<{ job_id: string; status: string }> {
    const body: Record<string, unknown> = {};
    if (request.captionColor !== undefined) body.caption_color = request.captionColor;
    if (request.captionFont !== undefined) body.caption_font = request.captionFont;
    if (request.captionTextEdits) body.caption_text_edits = request.captionTextEdits;
    if (request.hookText !== undefined) body.hook_text = request.hookText;
    if (request.hookTextColor !== undefined) body.hook_text_color = request.hookTextColor;
    if (request.hookTextSize !== undefined) body.hook_text_size = request.hookTextSize;

    const response = await this.http.post<{ responseData: { job_id: string; status: string } }>(
      `/social-media/produce-video-job/${jobId}/adjust`,
      body
    );
    return response.responseData;
  }

  // ── Submagic Pipeline (billed) ──────────────────────────────────────

  /**
   * Upload a video to Submagic for AI-powered captioning and editing
   * (magic zooms, magic b-roll, silence removal, bad-take removal).
   * Charged before submission; refunded automatically if the job fails.
   */
  async submagicProduce(request: SubmagicProduceRequest): Promise<SubmagicProduceResult> {
    const form = new FormData();
    form.append('video', request.video);
    appendIfDefined(form, 'template_name', request.templateName);
    appendIfDefined(form, 'language', request.language);
    appendIfDefined(form, 'remove_silence_pace', request.removeSilencePace);
    appendIfDefined(form, 'magic_zooms', request.magicZooms);
    appendIfDefined(form, 'magic_brolls', request.magicBrolls);
    appendIfDefined(form, 'clean_audio', request.cleanAudio);
    appendIfDefined(form, 'remove_bad_takes', request.removeBadTakes);
    appendIfDefined(form, 'enable_music', request.enableMusic);
    if (request.customMusic) form.append('custom_music', request.customMusic);

    const response = await this.http.post<{ responseData: SubmagicProduceResult }>(
      '/social-media/submagic-produce',
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  /** Poll a Submagic job for status and output_url. */
  async getSubmagicJob(jobId: string): Promise<VideoJobStatus> {
    const response = await this.http.get<{ responseData: VideoJobStatus }>(
      `/social-media/submagic-job/${jobId}`
    );
    return response.responseData;
  }

  // ── ZapCap Pipeline (billed) ─────────────────────────────────────────

  /** List available ZapCap caption templates. */
  async listZapCapTemplates(): Promise<ZapCapTemplate[]> {
    const response = await this.http.get<{ responseData: { templates: ZapCapTemplate[] } }>(
      '/social-media/zapcap-templates'
    );
    return response.responseData.templates;
  }

  /**
   * Upload a video to ZapCap for AI captions, with optional b-roll and
   * background music. Charged before submission; refunded automatically
   * if the job fails.
   */
  async zapcapProduce(request: ZapCapProduceRequest): Promise<ZapCapProduceResult> {
    const form = new FormData();
    if (request.video) form.append('video', request.video);
    appendIfDefined(form, 'source_url', request.sourceUrl);
    appendIfDefined(form, 'template_id', request.templateId);
    appendIfDefined(form, 'language', request.language);
    appendIfDefined(form, 'output_mode', request.outputMode);
    appendIfDefined(form, 'quality', request.quality);
    appendIfDefined(form, 'enable_broll', request.enableBroll);
    appendIfDefined(form, 'enable_music', request.enableMusic);
    appendIfDefined(form, 'caption_style', request.captionStyle);
    if (request.customMusic) form.append('custom_music', request.customMusic);
    if (request.customBrollClips) {
      for (const clip of request.customBrollClips) form.append('custom_broll_clips', clip);
    }
    if (request.customBrollPlacements) {
      form.append(
        'custom_broll_placements',
        JSON.stringify(
          request.customBrollPlacements.map((p) => ({
            clipIndex: p.clipIndex,
            startTime: p.startTime,
            duration: p.duration,
          }))
        )
      );
    }
    appendIfDefined(form, 'custom_broll_estimated_duration', request.customBrollEstimatedDuration);

    const response = await this.http.post<{ responseData: ZapCapProduceResult }>(
      '/social-media/zapcap-produce',
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  /** Poll a ZapCap job for status and output_url. */
  async getZapCapJob(jobId: string): Promise<VideoJobStatus> {
    const response = await this.http.get<{ responseData: VideoJobStatus }>(
      `/social-media/zapcap-job/${jobId}`
    );
    return response.responseData;
  }

  /** Fetch the word-level transcript for a ZapCap job (for caption editing). */
  async getZapCapTranscript(jobId: string): Promise<ZapCapTranscriptWord[]> {
    const response = await this.http.get<{ responseData: { words: ZapCapTranscriptWord[] } }>(
      `/social-media/zapcap-job/${jobId}/transcript`
    );
    return response.responseData.words;
  }

  /**
   * Re-render a ZapCap job with a different template, caption edits, or
   * b-roll toggle. Returns a new job_id — poll it via getZapCapJob().
   * This does not re-charge credits.
   */
  async rerenderZapCapJob(jobId: string, request: ZapCapRerenderRequest = {}): Promise<{ job_id: string }> {
    const response = await this.http.post<{ responseData: { job_id: string } }>(
      `/social-media/zapcap-job/${jobId}/rerender`,
      {
        word_edits: request.wordEdits,
        template_id: request.templateId,
        enable_broll: request.enableBroll,
        caption_style: request.captionStyle,
      }
    );
    return response.responseData;
  }

  /**
   * Re-render a ZapCap job with your own b-roll clips at specific
   * timestamps (uses ZapCap's native customBrolls API). Returns a new
   * job_id — poll it via getZapCapJob(). Does not re-charge credits.
   */
  async zapcapCustomBroll(
    jobId: string,
    clips: File[],
    placements: ZapCapCustomBrollPlacement[]
  ): Promise<{ job_id: string }> {
    const form = new FormData();
    for (const clip of clips) form.append('clips', clip);
    form.append('placements', JSON.stringify(placements));

    const response = await this.http.post<{ responseData: { job_id: string } }>(
      `/social-media/zapcap-job/${jobId}/custom-broll`,
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  // ── Video Editing — Level 1 FFmpeg pipeline (not billed) ─────────────

  /**
   * Run the Level 1 FFmpeg editing pipeline on a raw upload — crop to
   * 9:16, colour grade, trim, brand text overlays — and save the result
   * as a reel draft. Poll getEditVideoJob() for status.
   */
  async editVideo(request: EditVideoRequest): Promise<{ job_id: string; status: string }> {
    const form = new FormData();
    form.append('video', request.video);
    appendIfDefined(form, 'platform', request.platform);
    if (request.enhancements) form.append('enhancements', JSON.stringify(request.enhancements));

    const response = await this.http.post<{ responseData: { job_id: string; status: string } }>(
      '/social-media/edit-video',
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  /** Poll an edit-video job for status and output. */
  async getEditVideoJob(jobId: string): Promise<EditVideoJob> {
    const response = await this.http.get<{ responseData: EditVideoJob }>(
      `/social-media/edit-video-job/${jobId}`
    );
    return response.responseData;
  }

  // ── Video Polish — Reap pipeline (not billed via VideoBillingService) ──

  /** List available Video Polish style presets. */
  async listPolishStyles(): Promise<PolishStyle[]> {
    const response = await this.http.get<{ responseData: PolishStyle[] }>(
      '/social-media/video-polish-styles'
    );
    return response.responseData;
  }

  /** List caption style presets available for Video Polish. */
  async listCaptionPresets(): Promise<CaptionPreset[]> {
    const response = await this.http.get<{ responseData: CaptionPreset[] }>(
      '/social-media/video-polish-caption-presets'
    );
    return response.responseData;
  }

  /**
   * Run the Video Polish clipping pipeline (ingest + quality check +
   * Reap) on a raw upload. Poll getPolishJob() for status and clips.
   */
  async polishVideo(request: PolishVideoRequest): Promise<{ job_id: string; status: string }> {
    const form = new FormData();
    form.append('video', request.video);
    appendIfDefined(form, 'style_preset', request.stylePreset);
    appendIfDefined(form, 'language', request.language);
    appendIfDefined(form, 'captions_preset', request.captionsPreset);

    const response = await this.http.post<{ responseData: { job_id: string; status: string } }>(
      '/social-media/polish-video',
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  /** Poll a Video Polish job for status and output clips. */
  async getPolishJob(jobId: string): Promise<PolishVideoJob> {
    const response = await this.http.get<{ responseData: PolishVideoJob }>(
      `/social-media/polish-video-job/${jobId}`
    );
    return response.responseData;
  }

  /**
   * Re-polish an already-processed video with a different style preset,
   * reusing the same source video (no re-upload).
   */
  async restylePolishVideo(
    originalJobId: string,
    newStylePreset: string,
    language: string = 'en-NG'
  ): Promise<{ job_id: string; status: string }> {
    const form = new FormData();
    form.append('original_job_id', originalJobId);
    form.append('new_style_preset', newStylePreset);
    form.append('language', language);

    const response = await this.http.post<{ responseData: { job_id: string; status: string } }>(
      '/social-media/polish-video-restyle',
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  /**
   * Trigger a secondary action (reframe or dub) on a specific Video
   * Polish clip. Long-running — poll getClipActionStatus() for the result.
   */
  async applyClipAction(request: ClipActionRequest): Promise<{ action_job_id: string; status: string }> {
    const form = new FormData();
    form.append('job_id', request.jobId);
    form.append('clip_idx', String(request.clipIdx));
    form.append('action', request.action);
    appendIfDefined(form, 'orientation', request.orientation);
    appendIfDefined(form, 'source_language', request.sourceLanguage);
    appendIfDefined(form, 'target_language', request.targetLanguage);

    const response = await this.http.post<{ responseData: { action_job_id: string; status: string } }>(
      '/social-media/polish-video-clip-action',
      form,
      MULTIPART_HEADERS
    );
    return response.responseData;
  }

  /** Poll a clip action (reframe/dub) job by its action_job_id. */
  async getClipActionStatus(actionJobId: string): Promise<ClipActionJob> {
    const response = await this.http.get<{ responseData: ClipActionJob }>(
      `/social-media/polish-video-clip-action/${actionJobId}`
    );
    return response.responseData;
  }

  // ── AI Storyboard + Veo Generation Pipeline ──────────────────────────

  /** Generate a GPT-4o Vision video storyboard from 1-5 brand images. */
  async generateStoryboard(request: StoryboardRequest): Promise<Storyboard> {
    const response = await this.http.post<{ responseData: Storyboard }>(
      '/social-media/generate-storyboard',
      request
    );
    return response.responseData;
  }

  /**
   * Start Veo 3.1 video generation for every scene in a storyboard.
   * Poll getVideoJob() for progress; clips arrive incrementally.
   */
  async generateVideoFromStoryboard(request: VideoFromStoryboardRequest): Promise<{
    job_id: string;
    status: string;
    total_scenes: number;
  }> {
    const response = await this.http.post<{
      responseData: { job_id: string; status: string; total_scenes: number };
    }>('/social-media/generate-video-from-storyboard', request);
    return response.responseData;
  }

  /** Poll a Veo video-generation job. clips grows as each scene finishes. */
  async getVideoJob(jobId: string): Promise<VideoGenerationJob> {
    const response = await this.http.get<{ responseData: VideoGenerationJob }>(
      `/social-media/video-job/${jobId}`
    );
    return response.responseData;
  }

  /** Generate a preview frame image for each storyboard scene. */
  async generateStoryboardFrames(request: StoryboardFramesRequest): Promise<{
    job_id: string;
    status: string;
    total_scenes: number;
  }> {
    const response = await this.http.post<{
      responseData: { job_id: string; status: string; total_scenes: number };
    }>('/social-media/generate-storyboard-frames', request);
    return response.responseData;
  }

  /** Poll a storyboard frame-generation job. */
  async getStoryboardFrameJob(jobId: string): Promise<StoryboardFrameJob> {
    const response = await this.http.get<{ responseData: StoryboardFrameJob }>(
      `/social-media/storyboard-frame-job/${jobId}`
    );
    return response.responseData;
  }

  /** Merge all completed clips from a finished Veo job into one video. */
  async mergeVideoJob(jobId: string): Promise<{ merged_video_url: string }> {
    const response = await this.http.post<{ responseData: { merged_video_url: string } }>(
      `/social-media/merge-video-job/${jobId}`
    );
    return response.responseData;
  }

  /** Generate a platform-optimised caption for a merged storyboard video. */
  async generateVideoCaption(request: GenerateVideoCaptionRequest): Promise<{ caption: string }> {
    const response = await this.http.post<{ responseData: { caption: string } }>(
      '/social-media/generate-video-caption',
      request
    );
    return response.responseData;
  }

  // ── Video Drafts & Publishing ─────────────────────────────────────────

  /** Save a merged video as a draft for later posting (one per platform). */
  async saveVideoDraft(request: SaveVideoDraftRequest): Promise<VideoDraft> {
    const response = await this.http.post<{ responseData: VideoDraft }>(
      '/social-media/video-drafts',
      request
    );
    return response.responseData;
  }

  /** List saved video drafts for the current user. */
  async listVideoDrafts(): Promise<VideoDraft[]> {
    const response = await this.http.get<{ responseData: VideoDraft[] }>('/social-media/video-drafts');
    return response.responseData;
  }

  /**
   * Publish a saved video draft to Instagram Reels, Facebook, or TikTok.
   * Poll getVideoPublishJob() for status.
   */
  async publishVideoDraft(request: PublishVideoDraftRequest): Promise<{ job_id: string }> {
    const response = await this.http.post<{ responseData: { job_id: string } }>(
      '/social-media/publish-video-draft',
      request
    );
    return response.responseData;
  }

  /** Poll a video publish job for status. */
  async getVideoPublishJob(jobId: string): Promise<VideoPublishJob> {
    const response = await this.http.get<{ responseData: VideoPublishJob }>(
      `/social-media/video-publish-job/${jobId}`
    );
    return response.responseData;
  }
}
