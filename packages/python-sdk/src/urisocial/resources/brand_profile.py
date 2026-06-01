"""Brand profile resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


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

    def upload_logo(self, logo_file: Any, logo_position: Optional[str] = None) -> Dict[str, Any]:
        """Upload brand logo (multipart/form-data not fully supported yet)"""
        # TODO: Implement file upload with requests
        raise NotImplementedError("File upload support coming soon")

    def upload_sample_template(self, template_file: Any) -> Dict[str, Any]:
        """Upload sample template (multipart/form-data not fully supported yet)"""
        # TODO: Implement file upload with requests
        raise NotImplementedError("File upload support coming soon")

    def analyze_voice_samples(self, voice_samples: List[str]) -> Dict[str, Any]:
        """Analyze voice samples to derive brand voice"""
        return self._http.post(
            "/social-media/brand-profile/analyze-voice-samples",
            json={"voice_samples": voice_samples},
        )
