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

        Backed by /social-media/content-calendar, brand-scoped under
        multi-tenant mode. The legacy /api/v1/drafts endpoint this used to
        call only ever scoped by the developer's shared account, so every
        end-user saw every other end-user's drafts.

        Args:
            page: Page number (default: 1)
            per_page: Items per page (default: 20)

        Returns:
            Paginated list of drafts
        """
        skip = (page - 1) * per_page
        response = self._http.get(
            "/social-media/content-calendar",
            params={"skip": skip, "limit": per_page},
        )
        data = response["responseData"]
        return {
            "data": data["drafts"],
            "total": data["total_count"],
            "page": page,
            "per_page": per_page,
            "has_more": data["pagination"]["has_more"],
        }

    def get(self, draft_id: str) -> Draft:
        """
        Get a specific draft by ID

        Args:
            draft_id: ID of the draft

        Returns:
            Draft details
        """
        response = self._http.get(f"/social-media/drafts/{draft_id}")
        return response["responseData"]

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

        response = self._http.patch(f"/social-media/drafts/{draft_id}", json=updates)
        return response["responseData"]

    def delete(self, draft_id: str) -> dict:
        """
        Delete a draft

        Args:
            draft_id: ID of the draft to delete

        Returns:
            Success confirmation
        """
        return self._http.delete(f"/social-media/drafts/{draft_id}")

    def create(
        self,
        text_content: List[PlatformContent],
        image_url: Optional[str] = None,
        reference_image: Optional[str] = None,
    ) -> Draft:
        """
        Create a new draft manually

        Not currently supported — no brand-scoped equivalent of the legacy
        /api/v1/drafts create endpoint exists yet. That legacy endpoint is
        not brand-isolated under multi-tenant mode, so it's intentionally
        not called here. Use content.generate() to create drafts instead.
        """
        raise NotImplementedError(
            "drafts.create() is not currently supported for SDK/multi-tenant use — "
            "use content.generate() instead."
        )
