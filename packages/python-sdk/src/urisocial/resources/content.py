"""Content generation resource"""

from typing import TYPE_CHECKING
from ..types import ContentGenerationRequest, GeneratedContent, PaginatedResponse

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class ContentResource:
    """Resource for content generation operations"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def generate(self, **kwargs: ContentGenerationRequest) -> GeneratedContent:
        """
        Generate social media content for multiple platforms

        Args:
            seed_content: Description of content to generate
            platforms: List of platforms to generate for
            reference_image: Optional product/reference image URL
            tone: Content tone (professional, casual, etc.)
            include_hashtags: Whether to include hashtags
            include_emojis: Whether to include emojis

        Returns:
            Generated content with platform-specific text and image

        Example:
            >>> content = client.content.generate(
            ...     seed_content='Launch our new perfume line',
            ...     platforms=['instagram', 'facebook'],
            ...     reference_image='https://example.com/product.jpg',
            ...     tone='professional'
            ... )
        """
        return self._http.post("/api/v1/content/generate", json=kwargs)

    def get(self, content_id: str) -> GeneratedContent:
        """
        Get generated content by ID

        Args:
            content_id: ID of the content

        Returns:
            Generated content details
        """
        return self._http.get(f"/api/v1/content/{content_id}")

    def list(self, page: int = 1, per_page: int = 20) -> PaginatedResponse:
        """
        List all generated content with pagination

        Args:
            page: Page number (default: 1)
            per_page: Items per page (default: 20)

        Returns:
            Paginated list of generated content
        """
        return self._http.get(
            "/api/v1/content",
            params={"page": page, "per_page": per_page},
        )

    def delete(self, content_id: str) -> dict:
        """
        Delete generated content

        Args:
            content_id: ID of the content to delete

        Returns:
            Success confirmation
        """
        return self._http.delete(f"/api/v1/content/{content_id}")
