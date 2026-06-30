"""Custom visual guides resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class CustomGuidesResource:
    """Custom visual guide management - reference image analysis and font matching"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def upload_reference_image(
        self,
        image_url: str,
        name: str,
        brand_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Upload and process reference image to create custom visual guide

        Performs:
        - Safety, quality, copyright screening
        - Aesthetic extraction (GPT-4o-mini Vision)
        - Typography extraction and font matching
        - Prompt assembly
        - 11-dimension metadata tagging

        Args:
            image_url: Cloudinary URL of uploaded reference image
            name: Guide name (1-100 chars)
            brand_id: Optional brand ID

        Returns:
            Guide preview with match outcome for user confirmation
        """
        return self._http.post(
            "/social-media/custom-guides/upload",
            json={
                "image_url": image_url,
                "name": name,
                "brand_id": brand_id,
            },
        )

    def list_guides(
        self,
        brand_id: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """
        List custom visual guides

        Args:
            brand_id: Optional brand ID to filter by
            status: Optional status filter ('active', 'archived')
            limit: Max number of results (default: 50)
            offset: Pagination offset (default: 0)

        Returns:
            List of guide objects
        """
        params = {"limit": limit, "offset": offset}
        if brand_id:
            params["brand_id"] = brand_id
        if status:
            params["status"] = status
        return self._http.get("/social-media/custom-guides", params=params)

    def get_guide(self, guide_id: str) -> Dict[str, Any]:
        """
        Get specific custom visual guide

        Args:
            guide_id: Guide ID

        Returns:
            Guide object with full details
        """
        return self._http.get(f"/social-media/custom-guides/{guide_id}")

    def update_guide_font(self, guide_id: str, matched_font_id: str) -> Dict[str, Any]:
        """
        Update guide's matched font

        Args:
            guide_id: Guide ID
            matched_font_id: New font ID to use

        Returns:
            Updated guide object
        """
        return self._http.patch(
            f"/social-media/custom-guides/{guide_id}/font",
            json={"matched_font_id": matched_font_id},
        )

    def delete_guide(self, guide_id: str) -> Dict[str, Any]:
        """
        Delete (archive) custom visual guide

        Args:
            guide_id: Guide ID

        Returns:
            Deletion confirmation
        """
        return self._http.delete(f"/social-media/custom-guides/{guide_id}")

    def rematch_typography(self, guide_id: str) -> Dict[str, Any]:
        """
        Re-run typography matching for guide

        Useful when font library is updated or initial match was poor.

        Args:
            guide_id: Guide ID

        Returns:
            Updated guide object with new typography match
        """
        return self._http.post(f"/social-media/custom-guides/{guide_id}/rematch")

    def auto_rematch_all(
        self,
        brand_id: Optional[str] = None,
        min_confidence_threshold: float = 0.5,
    ) -> Dict[str, Any]:
        """
        Automatically re-match typography for all guides below confidence threshold

        Args:
            brand_id: Optional brand ID to filter by
            min_confidence_threshold: Only rematch guides below this confidence (0.0-1.0, default: 0.5)

        Returns:
            Summary of rematch operation
        """
        params = {"min_confidence_threshold": min_confidence_threshold}
        if brand_id:
            params["brand_id"] = brand_id
        return self._http.post("/social-media/custom-guides/auto-rematch", params=params)

    def track_usage(self, guide_id: str) -> Dict[str, Any]:
        """
        Track usage of custom visual guide

        Increments times_used counter for analytics.

        Args:
            guide_id: Guide ID

        Returns:
            Usage confirmation
        """
        return self._http.post(f"/social-media/custom-guides/{guide_id}/track-usage")

    def cleanup_archived(self, days_threshold: int = 90) -> Dict[str, Any]:
        """
        Cleanup archived guides older than threshold

        Args:
            days_threshold: Delete archived guides older than this many days (default: 90)

        Returns:
            Cleanup summary
        """
        return self._http.post(
            "/social-media/custom-guides/cleanup-archived",
            params={"days_threshold": days_threshold},
        )
