"""Utilities resource for URI Social SDK"""

from typing import Dict, Any
from ..http_client import HTTPClient


class UtilsResource:
    """Utility methods and helpers"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def get_onboarding_status(self) -> Dict[str, Any]:
        """Get user's onboarding status"""
        return self._http.get("/social-media/onboarding/status")

    def get_platform_requirements(self, platform: str) -> Dict[str, Any]:
        """Get platform-specific requirements and limits"""
        return self._http.get(f"/social-media/platform-requirements/{platform}")

    def extract_image_text(self, image_url: str) -> Dict[str, Any]:
        """Extract text from image using OCR"""
        return self._http.post("/social-media/extract-image-text", json={"image_url": image_url})

    def upload_custom_font(self, font_file: Any, font_name: str) -> Dict[str, Any]:
        """Upload custom font (multipart/form-data not fully supported yet)"""
        # TODO: Implement file upload with requests
        raise NotImplementedError("File upload support coming soon")

    def analyze_custom_font(self, font_id: str) -> Dict[str, Any]:
        """Analyze custom font characteristics"""
        return self._http.post("/social-media/analyze-custom-font", json={"font_id": font_id})

    def sync_image(self, draft_id: str, image_url: str) -> Dict[str, Any]:
        """Sync image to draft"""
        return self._http.post(
            "/social-media/image-sync",
            json={"draft_id": draft_id, "image_url": image_url},
        )
