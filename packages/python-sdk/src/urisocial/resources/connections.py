"""Social media connections resource"""

from typing import TYPE_CHECKING, Optional
from ..types import Connection, Platform

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class ConnectionsResource:
    """Resource for managing social media platform connections"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def list(self) -> dict:
        """
        Get all connected social media accounts

        Returns:
            Dictionary with connected_platforms list

        Example:
            >>> connections = client.connections.list()
            >>> for conn in connections['connected_platforms']:
            ...     print(f"{conn['platform']}: {conn['account_name']}")
        """
        return self._http.get("/api/v1/connections")

    def get_connect_url(
        self,
        platform: Platform,
        redirect_url: Optional[str] = None,
    ) -> dict:
        """
        Get OAuth URL to connect a platform

        Args:
            platform: Platform to connect (instagram, facebook, etc.)
            redirect_url: Optional callback URL after OAuth

        Returns:
            Dictionary with auth_url

        Example:
            >>> result = client.connections.get_connect_url(
            ...     'instagram',
            ...     'https://yourapp.com/callback'
            ... )
            >>> print(result['auth_url'])  # Redirect user here
        """
        params = {}
        if redirect_url:
            params["redirect_url"] = redirect_url

        return self._http.get(
            f"/api/v1/connections/{platform}/connect",
            params=params if params else None,
        )

    def disconnect(self, platform: Platform) -> dict:
        """
        Disconnect a platform

        Args:
            platform: Platform to disconnect

        Returns:
            Success confirmation

        Example:
            >>> client.connections.disconnect('facebook')
        """
        return self._http.delete(f"/api/v1/connections/{platform}")

    def get_status(self, platform: Platform) -> Connection:
        """
        Check connection status for a platform

        Args:
            platform: Platform to check

        Returns:
            Connection status details

        Example:
            >>> status = client.connections.get_status('instagram')
            >>> print(status['status'])  # 'active', 'expired', or 'error'
        """
        return self._http.get(f"/api/v1/connections/{platform}/status")
