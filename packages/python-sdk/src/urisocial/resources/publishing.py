"""Publishing resource"""

from typing import TYPE_CHECKING, Any, Dict, List, Optional

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class PublishingResource:
    """Resource for the content approval / scheduling / publishing workflow"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def approve(
        self,
        draft_ids: List[str],
        schedule_option: str = "save_draft",
        scheduled_datetime: Optional[str] = None,
        approval_notes: Optional[str] = None,
    ) -> dict:
        """
        Approve content drafts, optionally publishing or scheduling them.

        Args:
            draft_ids: IDs of drafts to approve
            schedule_option: One of 'immediate', 'schedule', 'save_draft'
            scheduled_datetime: ISO 8601 datetime string, required when schedule_option='schedule'
            approval_notes: Optional notes to attach to the approval

        Example:
            >>> result = client.publishing.approve(
            ...     draft_ids=['draft-123'],
            ...     schedule_option='immediate',
            ... )
        """
        body: Dict[str, Any] = {
            "draft_ids": draft_ids,
            "schedule_option": schedule_option,
        }
        if scheduled_datetime is not None:
            body["scheduled_datetime"] = scheduled_datetime
        if approval_notes is not None:
            body["approval_notes"] = approval_notes
        return self._http.post("/social-media/approve", json=body)

    def deny(
        self,
        draft_ids: List[str],
        denial_reason: str,
        request_regeneration: bool = False,
    ) -> dict:
        """
        Deny/reject drafts in the approval workflow.

        Args:
            draft_ids: IDs of drafts to deny
            denial_reason: Reason for denial
            request_regeneration: Whether to trigger regeneration of the denied drafts
        """
        return self._http.post(
            "/social-media/deny",
            json={
                "draft_ids": draft_ids,
                "denial_reason": denial_reason,
                "request_regeneration": request_regeneration,
            },
        )

    def refine(self, draft_id: str, refinements: Dict[str, Any]) -> dict:
        """
        Request refinements to a draft.

        Args:
            draft_id: ID of the draft to refine
            refinements: Specific changes to make
        """
        return self._http.put(
            "/social-media/refine",
            json={"draft_id": draft_id, "refinements": refinements},
        )

    def schedule(
        self,
        draft_ids: List[str],
        scheduled_datetime: str,
        timezone: str = "UTC",
    ) -> dict:
        """
        Schedule drafts for future publishing.

        Args:
            draft_ids: IDs of drafts to schedule
            scheduled_datetime: ISO 8601 datetime string for publishing
            timezone: IANA timezone name (default 'UTC')

        Example:
            >>> result = client.publishing.schedule(
            ...     draft_ids=['draft-123'],
            ...     scheduled_datetime='2026-12-25T10:00:00Z',
            ... )
        """
        return self._http.post(
            "/social-media/schedule",
            json={
                "draft_ids": draft_ids,
                "scheduled_datetime": scheduled_datetime,
                "timezone": timezone,
            },
        )

    def list_scheduled(self) -> dict:
        """
        Get scheduled posts.

        Example:
            >>> scheduled = client.publishing.list_scheduled()
        """
        return self._http.get("/social-media/scheduled")

    def publish_scheduled(self, draft_ids: List[str]) -> dict:
        """
        Manually trigger publishing of already-scheduled drafts.

        Args:
            draft_ids: IDs of scheduled drafts to publish immediately
        """
        return self._http.post(
            "/social-media/publish-scheduled", json={"draft_ids": draft_ids}
        )

    def cancel_scheduled(self, draft_id: str) -> dict:
        """
        Cancel a scheduled post.

        Args:
            draft_id: ID of the scheduled draft to cancel

        Example:
            >>> client.publishing.cancel_scheduled('draft-123')
        """
        return self._http.post(f"/social-media/drafts/{draft_id}/unschedule")
