"""Drafts resource"""

from typing import TYPE_CHECKING, List, Optional
from ..types import Draft, PaginatedResponse, PlatformContent

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class DraftsResource:
    """Resource for draft management operations"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def list(self, page: int = 1, per_page: int = 20) -> PaginatedResponse:
        """
        Get all drafts with pagination

        Args:
            page: Page number (default: 1)
            per_page: Items per page (default: 20)

        Returns:
            Paginated list of drafts
        """
        return self._http.get(
            "/api/v1/drafts",
            params={"page": page, "per_page": per_page},
        )

    def get(self, draft_id: str) -> Draft:
        """
        Get a specific draft by ID

        Args:
            draft_id: ID of the draft

        Returns:
            Draft details
        """
        return self._http.get(f"/api/v1/drafts/{draft_id}")

    def update(
        self,
        draft_id: str,
        text_content: Optional[List[PlatformContent]] = None,
        image_url: Optional[str] = None,
    ) -> Draft:
        """
        Update draft content

        Args:
            draft_id: ID of the draft to update
            text_content: Updated platform-specific text content
            image_url: Updated image URL

        Returns:
            Updated draft
        """
        updates = {}
        if text_content is not None:
            updates["text_content"] = text_content
        if image_url is not None:
            updates["image_url"] = image_url

        return self._http.patch(f"/api/v1/drafts/{draft_id}", json=updates)

    def delete(self, draft_id: str) -> dict:
        """
        Delete a draft

        Args:
            draft_id: ID of the draft to delete

        Returns:
            Success confirmation
        """
        return self._http.delete(f"/api/v1/drafts/{draft_id}")

    def create(
        self,
        text_content: List[PlatformContent],
        image_url: Optional[str] = None,
        reference_image: Optional[str] = None,
    ) -> Draft:
        """
        Create a new draft manually

        Args:
            text_content: Platform-specific text content
            image_url: Optional generated image URL
            reference_image: Optional reference/product image URL

        Returns:
            Created draft
        """
        return self._http.post(
            "/api/v1/drafts",
            json={
                "text_content": text_content,
                "image_url": image_url,
                "reference_image": reference_image,
            },
        )
