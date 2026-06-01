"""Video generation resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class VideoResource:
    """Video generation and management"""

    def __init__(self, http: HTTPClient):
        self._http = http

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
        """Generate video from storyboard"""
        return self._http.post(
            "/social-media/generate-video-from-storyboard",
            json={"storyboard": storyboard, "brand_images": brand_images, "model": model},
        )

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        """Get video generation job status"""
        return self._http.get(f"/social-media/video-job/{job_id}")

    def generate_storyboard_frames(
        self, scenes: List[Dict[str, Any]], brand_images: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Generate storyboard frames (images for each scene)"""
        return self._http.post(
            "/social-media/generate-storyboard-frames",
            json={"scenes": scenes, "brand_images": brand_images},
        )

    def get_frame_job_status(self, job_id: str) -> Dict[str, Any]:
        """Get storyboard frame generation job status"""
        return self._http.get(f"/social-media/storyboard-frame-job/{job_id}")

    def merge_video(self, job_id: str) -> Dict[str, Any]:
        """Merge video job (combine generated scenes)"""
        return self._http.post(f"/social-media/merge-video-job/{job_id}")

    def create_draft(
        self,
        storyboard: Dict[str, Any],
        platform: str,
        video_url: Optional[str] = None,
        thumbnail_url: Optional[str] = None,
        caption: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create video draft"""
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
        """List all video drafts"""
        return self._http.get("/social-media/video-drafts")

    def publish_draft(self, draft_id: str, platform: str, caption: Optional[str] = None) -> Dict[str, Any]:
        """Publish video draft to social platform"""
        return self._http.post(
            "/social-media/publish-video-draft",
            json={"draft_id": draft_id, "platform": platform, "caption": caption},
        )

    def get_publish_job_status(self, job_id: str) -> Dict[str, Any]:
        """Get video publish job status"""
        return self._http.get(f"/social-media/video-publish-job/{job_id}")
