"""Video generation resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class VideoResource:
    """Video generation, editing, and polishing pipeline"""

    def __init__(self, http: HTTPClient):
        self._http = http

    # ── Video Generation Pipeline ───────────────────────────────────────

    def generate_storyboard(
        self,
        brand_images: List[str],
        optional_text: Optional[str] = None,
        target_platform: str = "instagram_reels",
        target_duration_seconds: int = 15,
        video_style: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate AI-powered video storyboard

        Args:
            brand_images: List of 1-5 brand images
            optional_text: Optional text (max 1000 chars)
            target_platform: Target platform (instagram_reels, facebook_reels, tiktok)
            target_duration_seconds: Duration in seconds (5-30)
            video_style: Video style (e.g., 'clean_commercial')

        Returns:
            Storyboard object with scenes
        """
        return self._http.post(
            "/social-media/generate-storyboard",
            json={
                "brand_images": brand_images,
                "optional_text": optional_text,
                "target_platform": target_platform,
                "target_duration_seconds": target_duration_seconds,
                "video_style": video_style,
            },
        )

    def generate_from_storyboard(
        self, storyboard: Dict[str, Any], brand_images: List[str], model: str = "veo-3.1-generate-preview"
    ) -> Dict[str, Any]:
        """
        Generate video from storyboard using AI model

        Args:
            storyboard: Storyboard object with scenes
            brand_images: List of brand images for context
            model: AI model to use (default: 'veo-3.1-generate-preview')

        Returns:
            Video job object with job_id for polling
        """
        return self._http.post(
            "/social-media/generate-video-from-storyboard",
            json={"storyboard": storyboard, "brand_images": brand_images, "model": model},
        )

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        """
        Get video generation job status

        Poll this endpoint to check video generation progress.

        Args:
            job_id: Video job ID

        Returns:
            Job status with clips, progress, errors
        """
        return self._http.get(f"/social-media/video-job/{job_id}")

    def generate_storyboard_frames(
        self, scenes: List[Dict[str, Any]], brand_images: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generate storyboard frames (preview images for each scene)

        Args:
            scenes: List of scene objects
            brand_images: Optional brand images for context

        Returns:
            Frame job object with job_id for polling
        """
        return self._http.post(
            "/social-media/generate-storyboard-frames",
            json={"scenes": scenes, "brand_images": brand_images},
        )

    def get_frame_job_status(self, job_id: str) -> Dict[str, Any]:
        """
        Get storyboard frame generation job status

        Args:
            job_id: Frame job ID

        Returns:
            Job status with frame URLs
        """
        return self._http.get(f"/social-media/storyboard-frame-job/{job_id}")

    def merge_video(self, job_id: str) -> Dict[str, Any]:
        """
        Merge video clips into single video

        Combines all completed clips from a finished video job.

        Args:
            job_id: Video job ID with completed clips

        Returns:
            Merged video URL
        """
        return self._http.post(f"/social-media/merge-video-job/{job_id}")

    # ── Video Drafts & Publishing ────────────────────────────────────────

    def create_draft(
        self,
        storyboard: Dict[str, Any],
        platform: str,
        video_url: Optional[str] = None,
        thumbnail_url: Optional[str] = None,
        caption: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Create video draft

        Args:
            storyboard: Storyboard object
            platform: Target platform
            video_url: Optional video URL
            thumbnail_url: Optional thumbnail URL
            caption: Optional caption

        Returns:
            Created video draft object
        """
        return self._http.post(
            "/social-media/video-drafts",
            json={
                "storyboard": storyboard,
                "platform": platform,
                "video_url": video_url,
                "thumbnail_url": thumbnail_url,
                "caption": caption,
            },
        )

    def list_drafts(self) -> Dict[str, Any]:
        """
        List all video drafts

        Returns:
            List of video draft objects
        """
        return self._http.get("/social-media/video-drafts")

    def publish_draft(self, draft_id: str, platform: str, caption: Optional[str] = None) -> Dict[str, Any]:
        """
        Publish video draft to social platform

        Args:
            draft_id: Video draft ID
            platform: Platform to publish to
            caption: Optional caption override

        Returns:
            Publish job object with job_id for polling
        """
        return self._http.post(
            "/social-media/publish-video-draft",
            json={"draft_id": draft_id, "platform": platform, "caption": caption},
        )

    def get_publish_job_status(self, job_id: str) -> Dict[str, Any]:
        """
        Get video publish job status

        Args:
            job_id: Publish job ID

        Returns:
            Job status with publish results
        """
        return self._http.get(f"/social-media/video-publish-job/{job_id}")

    # ── Video Editing Pipeline ───────────────────────────────────────────

    def edit_video(
        self,
        video_url: str,
        edits: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Edit existing video (Reap clipping pipeline)

        Args:
            video_url: Source video URL
            edits: Edit operations (clip selection, trimming, etc.)

        Returns:
            Edit job object with job_id for polling
        """
        return self._http.post(
            "/social-media/edit-video",
            json={"video_url": video_url, "edits": edits},
        )

    def get_edit_job_status(self, job_id: str) -> Dict[str, Any]:
        """
        Get video edit job status

        Args:
            job_id: Edit job ID

        Returns:
            Job status with edited video URL
        """
        return self._http.get(f"/social-media/edit-video-job/{job_id}")

    # ── Video Polish Pipeline ────────────────────────────────────────────

    def get_polish_styles(self) -> Dict[str, Any]:
        """
        Get available video polish styles

        Returns:
            List of available styles for video polishing
        """
        return self._http.get("/social-media/video-polish-styles")

    def get_caption_presets(self) -> Dict[str, Any]:
        """
        Get caption style presets for video polish

        Returns:
            List of caption presets (fonts, positions, animations)
        """
        return self._http.get("/social-media/video-polish-caption-presets")

    def polish_video(
        self,
        video_url: str,
        style: str,
        caption_preset: Optional[str] = None,
        custom_captions: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Polish video with style, captions, effects (Shotstack pipeline)

        Args:
            video_url: Source video URL
            style: Polish style name
            caption_preset: Optional caption preset name
            custom_captions: Optional custom caption specifications

        Returns:
            Polish job object with job_id for polling
        """
        payload = {"video_url": video_url, "style": style}
        if caption_preset:
            payload["caption_preset"] = caption_preset
        if custom_captions:
            payload["custom_captions"] = custom_captions
        return self._http.post("/social-media/polish-video", json=payload)

    def get_polish_job_status(self, job_id: str) -> Dict[str, Any]:
        """
        Get video polish job status

        Args:
            job_id: Polish job ID

        Returns:
            Job status with polished video URL
        """
        return self._http.get(f"/social-media/polish-video-job/{job_id}")

    def restyle_polished_video(
        self,
        job_id: str,
        new_style: str,
    ) -> Dict[str, Any]:
        """
        Re-apply different style to polished video

        Args:
            job_id: Original polish job ID
            new_style: New style name

        Returns:
            New polish job object
        """
        return self._http.post(
            "/social-media/polish-video-restyle",
            json={"job_id": job_id, "new_style": new_style},
        )

    def apply_clip_action(
        self,
        video_url: str,
        action: str,
        params: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Apply action to video clip (trim, crop, speed, etc.)

        Args:
            video_url: Video URL
            action: Action type ('trim', 'crop', 'speed', 'filter', etc.)
            params: Action parameters

        Returns:
            Action job object with job_id for polling
        """
        payload = {"video_url": video_url, "action": action}
        if params:
            payload["params"] = params
        return self._http.post("/social-media/polish-video-clip-action", json=payload)

    def get_clip_action_status(self, action_job_id: str) -> Dict[str, Any]:
        """
        Get clip action job status

        Args:
            action_job_id: Action job ID

        Returns:
            Job status with result video URL
        """
        return self._http.get(f"/social-media/polish-video-clip-action/{action_job_id}")

    # ── Video Production Pipeline ────────────────────────────────────────

    def produce_video(
        self,
        script: str,
        assets: List[str],
        production_settings: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Produce video from script and assets (GPT-5 analysis + Shotstack)

        Args:
            script: Video script/narration
            assets: List of asset URLs (images, video clips)
            production_settings: Optional production settings

        Returns:
            Production job object with job_id for polling
        """
        payload = {"script": script, "assets": assets}
        if production_settings:
            payload["production_settings"] = production_settings
        return self._http.post("/social-media/produce-video", json=payload)

    def get_production_job_status(self, job_id: str) -> Dict[str, Any]:
        """
        Get video production job status

        Args:
            job_id: Production job ID

        Returns:
            Job status with preview and render info
        """
        return self._http.get(f"/social-media/produce-video-job/{job_id}")

    def start_production_render(self, job_id: str) -> Dict[str, Any]:
        """
        Start final render for production job

        Call after reviewing preview to start final high-quality render.

        Args:
            job_id: Production job ID

        Returns:
            Updated job status with render progress
        """
        return self._http.post(f"/social-media/produce-video-job/{job_id}/start-render")
