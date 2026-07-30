"""Social media connections resource"""

from typing import TYPE_CHECKING, Any, Dict, List, Optional
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
        return self._http.get("/social-media/connections")

    def initiate(
        self,
        platforms: List[Platform],
        source: Optional[str] = None,
    ) -> dict:
        """
        Initiate the OAuth connection flow for one or more platforms.

        Args:
            platforms: Platforms to connect (instagram, facebook, etc.)
            source: Optional flow context, e.g. 'onboarding' or 'settings'

        Returns:
            Dictionary with session_token, auth_urls, and expires_at

        Example:
            >>> result = client.connections.initiate(['instagram', 'facebook'])
            >>> print(result['auth_urls'])
        """
        body: Dict[str, Any] = {"platforms": platforms}
        if source is not None:
            body["source"] = source
        return self._http.post("/social-media/connect/initiate", json=body)

    def get_pending(self, session_token: str) -> dict:
        """
        Get pending connection status for a session started by initiate().

        Args:
            session_token: Session token returned by initiate()
        """
        return self._http.get(f"/social-media/connect/pending/{session_token}")

    def finalize(self, session_token: str, selected_page_ids: List[str]) -> dict:
        """
        Finalize a connection after the user completes the OAuth callback.

        Args:
            session_token: Session token returned by initiate()
            selected_page_ids: IDs of the pages/accounts the user selected
        """
        return self._http.post(
            "/social-media/connect/finalize",
            json={
                "session_token": session_token,
                "selected_page_ids": selected_page_ids,
            },
        )

    def get_connect_url(
        self,
        platform: Platform,
        redirect_url: Optional[str] = None,
    ) -> dict:
        """
        DEPRECATED: Not functional — the backend returns a placeholder,
        non-working OAuth URL for this legacy endpoint. Use initiate()
        instead, which drives the real, working OAuth flow.
        """
        raise NotImplementedError(
            "connections.get_connect_url() is not functional — use "
            "connections.initiate() instead."
        )

    def disconnect(self, account_id: str) -> dict:
        """
        Disconnect a platform account.

        Args:
            account_id: Outstand account ID to disconnect (see Connection['id']
                from list())

        Example:
            >>> client.connections.disconnect('acct_abc123')
        """
        return self._http.delete(f"/social-media/connections/account/{account_id}")

    def disconnect_instagram(self, ig_user_id: str) -> dict:
        """Disconnect an Instagram Direct (Meta Business) connection."""
        return self._http.delete(f"/social-media/connections/instagram-direct/{ig_user_id}")

    def disconnect_facebook(self) -> dict:
        """Disconnect the Facebook Direct (Meta Business) connection."""
        return self._http.delete("/social-media/connections/facebook-direct")

    def get_status(self, platform: Platform) -> Connection:
        """
        DEPRECATED: Not functional — this legacy endpoint does not exist on
        the backend. Use list() instead.
        """
        raise NotImplementedError(
            "connections.get_status() is not functional — use connections.list() instead."
        )

    # ------------------------------------------------------------------
    # Direct Platform Connections (Facebook & Instagram via Meta Business)
    # ------------------------------------------------------------------

    def initiate_facebook_direct(self, redirect_uri: str) -> dict:
        """Initiate the Facebook Direct (Meta Business) OAuth flow.

        Args:
            redirect_uri: Your application's callback URL
        """
        return self._http.get(
            f"/social-media/connect/facebook-direct/initiate?redirect_uri={redirect_uri}"
        )

    def finalize_facebook_direct(self, code: str, redirect_uri: str) -> dict:
        """Finalize a Facebook Direct connection after the OAuth callback.

        Args:
            code: OAuth authorization code from the callback
            redirect_uri: Same redirect URI used in initiate_facebook_direct()
        """
        return self._http.post(
            "/social-media/connect/facebook-direct/finalize",
            json={"code": code, "redirect_uri": redirect_uri},
        )

    def initiate_instagram_direct(self, redirect_uri: str) -> dict:
        """Initiate the Instagram Direct (Meta Business) OAuth flow.

        Args:
            redirect_uri: Your application's callback URL
        """
        return self._http.get(
            f"/social-media/connect/instagram-direct/initiate?redirect_uri={redirect_uri}"
        )

    def finalize_instagram_direct(self, code: str, redirect_uri: str) -> dict:
        """Finalize an Instagram Direct connection after the OAuth callback.

        Args:
            code: OAuth authorization code from the callback
            redirect_uri: Same redirect URI used in initiate_instagram_direct()
        """
        return self._http.post(
            "/social-media/connect/instagram-direct/finalize",
            json={"code": code, "redirect_uri": redirect_uri},
        )
