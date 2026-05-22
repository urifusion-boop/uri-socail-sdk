"""Publishing resource"""

from typing import TYPE_CHECKING, List, Optional
from ..types import Platform

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class PublishingResource:
    """Resource for publishing content to social media"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def publish(
        self,
        draft_id: str,
        platforms: List[Platform],
    ) -> dict:
        """
        Publish a draft to social media platforms

        Args:
            draft_id: ID of draft to publish
            platforms: List of platforms to publish to

        Returns:
            Publishing results for each platform

        Example:
            >>> result = client.publishing.publish(
            ...     draft_id='draft-123',
            ...     platforms=['instagram', 'facebook']
            ... )
            >>> for r in result['results']:
            ...     print(f"{r['platform']}: {r['status']}")
        """
        return self._http.post(
            "/api/v1/publish",
            json={
                "draft_id": draft_id,
                "platforms": platforms,
            },
        )

    def schedule(
        self,
        draft_id: str,
        platforms: List[Platform],
        schedule_time: str,
    ) -> dict:
        """
        Schedule a draft for future publishing

        Args:
            draft_id: ID of draft to schedule
            platforms: List of platforms to publish to
            schedule_time: ISO 8601 datetime string for publishing

        Returns:
            Scheduled post details

        Example:
            >>> result = client.publishing.schedule(
            ...     draft_id='draft-123',
            ...     platforms=['instagram'],
            ...     schedule_time='2024-12-25T10:00:00Z'
            ... )
            >>> print(result['scheduled_id'])
        """
        return self._http.post(
            "/api/v1/publish/schedule",
            json={
                "draft_id": draft_id,
                "platforms": platforms,
                "schedule_time": schedule_time,
            },
        )

    def list_scheduled(self) -> dict:
        """
        Get scheduled posts

        Returns:
            List of scheduled posts

        Example:
            >>> scheduled = client.publishing.list_scheduled()
            >>> for post in scheduled['scheduled_posts']:
            ...     print(f"{post['id']}: {post['scheduled_for']}")
        """
        return self._http.get("/api/v1/publish/scheduled")

    def cancel_scheduled(self, scheduled_id: str) -> dict:
        """
        Cancel a scheduled post

        Args:
            scheduled_id: ID of scheduled post to cancel

        Returns:
            Success confirmation

        Example:
            >>> client.publishing.cancel_scheduled('scheduled-123')
        """
        return self._http.delete(f"/api/v1/publish/scheduled/{scheduled_id}")
