"""URI Social Python SDK Client"""

from typing import Optional
from .http_client import HTTPClient
from .resources import (
    ContentResource,
    DraftsResource,
    ImagesResource,
    ConnectionsResource,
    PublishingResource,
    BillingResource,
)


class URISocial:
    """
    URI Social SDK Client

    Main entry point for interacting with URI Social API.

    Args:
        api_key: Your URI Social API key
        base_url: API base URL (default: https://api.urisocial.com)
        timeout: Request timeout in seconds (default: 60)

    Example:
        >>> from urisocial import URISocial
        >>>
        >>> client = URISocial(api_key='your-api-key')
        >>>
        >>> # Generate content
        >>> content = client.content.generate(
        ...     seed_content='Launch our new perfume line',
        ...     platforms=['instagram', 'facebook'],
        ...     reference_image='https://example.com/product.jpg'
        ... )
        >>>
        >>> # Get drafts
        >>> drafts = client.drafts.list()
        >>>
        >>> # Publish content
        >>> result = client.publishing.publish(
        ...     draft_id='draft-123',
        ...     platforms=['instagram']
        ... )
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.urisocial.com",
        timeout: int = 60,
    ):
        if not api_key:
            raise ValueError(
                "API key is required. Get yours at https://urisocial.com/dashboard/api-keys"
            )

        self._http = HTTPClient(api_key=api_key, base_url=base_url, timeout=timeout)

        # Initialize resource modules
        self.content = ContentResource(self._http)
        self.drafts = DraftsResource(self._http)
        self.images = ImagesResource(self._http)
        self.connections = ConnectionsResource(self._http)
        self.publishing = PublishingResource(self._http)
        self.billing = BillingResource(self._http)

    def set_api_key(self, api_key: str) -> None:
        """
        Update API key after initialization

        Args:
            api_key: New API key
        """
        self._http.set_api_key(api_key)

    def close(self) -> None:
        """Close the HTTP session"""
        self._http.close()

    def __enter__(self):
        """Context manager entry"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()
