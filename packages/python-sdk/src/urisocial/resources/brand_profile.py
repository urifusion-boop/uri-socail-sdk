"""Brand profile resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient, UploadFile, normalize_upload_file


class BrandProfileResource:
    """Brand identity and profile management"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def get(self) -> Dict[str, Any]:
        """Get brand profile"""
        return self._http.get("/social-media/brand-profile")

    def update(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Update brand profile"""
        return self._http.post("/social-media/brand-profile", json=profile)

    def upload_logo(self, logo_file: UploadFile, logo_position: Optional[str] = None) -> Dict[str, Any]:
        """Upload brand logo.

        Args:
            logo_file: A file path, raw bytes, or open binary file object.
            logo_position: Where the logo is placed on generated images.
        """
        filename, content = normalize_upload_file(logo_file, default_filename="logo.png")
        data = {"logo_position": logo_position} if logo_position else None
        return self._http.post_multipart(
            "/social-media/brand-profile/logo",
            files=[("logo_file", (filename, content))],
            data=data,
        )

    def upload_sample_template(self, template_file: UploadFile) -> Dict[str, Any]:
        """Upload a sample template image for style reference.

        Args:
            template_file: A file path, raw bytes, or open binary file object.
        """
        filename, content = normalize_upload_file(template_file, default_filename="template.png")
        return self._http.post_multipart(
            "/social-media/brand-profile/sample-template",
            files=[("template_file", (filename, content))],
        )

    def analyze_voice_samples(self, voice_samples: List[str]) -> Dict[str, Any]:
        """Analyze voice samples to derive brand voice"""
        return self._http.post(
            "/social-media/brand-profile/analyze-voice-samples",
            json={"voice_samples": voice_samples},
        )
