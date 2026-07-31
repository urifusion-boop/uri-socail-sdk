"""Brand profile resource for URI Social SDK"""

from typing import Dict, Any, List
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

    def upload_logo(self, logo_file: UploadFile) -> Dict[str, Any]:
        """Upload brand logo. To set where it's placed on generated images,
        call update({"logo_position": ..., "logo_size": ...}) separately —
        the upload endpoint itself doesn't accept a position (there's
        nowhere on the backend for it to go; it's read from the profile at
        generation time).

        Args:
            logo_file: A file path, raw bytes, or open binary file object.

        Returns:
            {"logo_url": ...}
        """
        filename, content, content_type = normalize_upload_file(logo_file, default_filename="logo.png")
        response = self._http.post_multipart(
            "/social-media/brand-profile/logo",
            files=[("file", (filename, content, content_type))],
        )
        return response["responseData"]

    def upload_sample_template(self, template_file: UploadFile) -> Dict[str, Any]:
        """Upload a sample template image for style reference.

        Args:
            template_file: A file path, raw bytes, or open binary file object.

        Returns:
            {"file_url": ...}
        """
        filename, content, content_type = normalize_upload_file(template_file, default_filename="template.png")
        response = self._http.post_multipart(
            "/social-media/brand-profile/sample-template",
            files=[("file", (filename, content, content_type))],
        )
        return response["responseData"]

    def analyze_voice_samples(self, voice_samples: List[str], merge_with_profile: bool = True) -> Dict[str, Any]:
        """Analyze up to 5 sample captions to derive brand voice. By default,
        merges the result into the brand profile — pass
        merge_with_profile=False to just preview the analysis without saving it.

        Returns:
            {"analysis": {...}, "updated_voice_profile": {...} (if merged), "merged": bool}
        """
        response = self._http.post(
            "/social-media/brand-profile/analyze-voice-samples",
            json={"sample_captions": voice_samples, "merge_with_profile": merge_with_profile},
        )
        return response["responseData"]
