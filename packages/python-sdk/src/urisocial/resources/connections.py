"""Social media connections resource"""

from typing import TYPE_CHECKING, Any, Dict, List, Optional
from ..types import Platform

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class ConnectionsResource:
    """Resource for managing social media platform connections"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def list(self) -> dict:
        """
        Get all connected social media accounts for the current user/end-user.

        Returns:
            {"user_id", "connected_platforms": [...], "connections": {...},
             "total_connections"}

        Example:
            >>> connections = client.connections.list()
            >>> for conn in connections['connected_platforms']:
            ...     print(f"{conn['platform']}: {conn['account_name']}")
        """
        response = self._http.get("/social-media/connections")
        return response["responseData"]

    def initiate(
        self,
        platforms: List[Platform],
        source: Optional[str] = None,
    ) -> dict:
        """
        Initiate the OAuth connection flow for one or more platforms via
        Outstand. Open response['auth_urls'][platform] in the browser for
        the user to authorise — after that, Outstand redirects to the
        callback URL, then call get_pending() and finalize() to complete
        the connection.

        A platform can fail independently of the others — check
        unsupported_platforms/failed_platforms if a requested platform's
        URL is missing from auth_urls.

        Args:
            platforms: Platforms to connect (instagram, facebook, etc.)
            source: Optional flow context, e.g. 'onboarding' or 'settings'

        Returns:
            {"user_id", "auth_urls", "platforms", "unsupported_platforms",
             "failed_platforms", "instructions"}

        Example:
            >>> result = client.connections.initiate(['instagram', 'facebook'])
            >>> print(result['auth_urls'])
        """
        body: Dict[str, Any] = {"platforms": platforms}
        if source is not None:
            body["source"] = source
        response = self._http.post("/social-media/connect/initiate", json=body)
        return response["responseData"]

    def get_pending(self, session_token: str) -> dict:
        """
        After the user completes the Outstand OAuth redirect, retrieve the
        pages/accounts available for them to choose from before finalizing.

        Args:
            session_token: Extracted from the auth_url returned by initiate()

        Returns:
            {"session_token", "network", "expires_at", "available_pages"}
        """
        response = self._http.get(f"/social-media/connect/pending/{session_token}")
        return response["responseData"]

    def finalize(self, session_token: str, selected_page_ids: List[str]) -> dict:
        """
        Finalize a connection after the user completes the OAuth callback —
        selects which page(s)/account(s) to keep connected.

        Args:
            session_token: Session token returned by initiate()
            selected_page_ids: IDs of the pages/accounts the user selected

        Returns:
            {"user_id", "accounts_connected", "total", "connected_at"}
        """
        response = self._http.post(
            "/social-media/connect/finalize",
            json={
                "session_token": session_token,
                "selected_page_ids": selected_page_ids,
            },
        )
        return response["responseData"]

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
        Disconnect a platform account (Outstand-managed connections).

        Args:
            account_id: Outstand account ID to disconnect (from list()'s
                connected_platforms[]['outstand_account_id'])

        Returns:
            {"outstand_account_id", "platform", "username", "status",
             "disconnected_at"}

        Example:
            >>> client.connections.disconnect('acct_abc123')
        """
        response = self._http.delete(f"/social-media/connections/account/{account_id}")
        return response["responseData"]

    def disconnect_instagram(self, ig_user_id: str) -> dict:
        """Disconnect an Instagram Direct (Meta Business) connection.

        Returns: {"status", "responseMessage"} — not envelope-wrapped like
        the other methods on this resource, this endpoint returns a flat body.
        """
        return self._http.delete(f"/social-media/connections/instagram-direct/{ig_user_id}")

    def disconnect_facebook(self) -> dict:
        """Disconnect the Facebook Direct (Meta Business) connection.

        Returns: {"status", "responseMessage"} — not envelope-wrapped like
        the other methods on this resource, this endpoint returns a flat body.
        """
        return self._http.delete("/social-media/connections/facebook-direct")

    def get_status(self, platform: Platform) -> dict:
        """
        DEPRECATED: Not functional — this legacy endpoint does not exist on
        the backend. Use list() instead.
        """
        raise NotImplementedError(
            "connections.get_status() is not functional — use connections.list() instead."
        )

    # ------------------------------------------------------------------
    # Direct Platform Connections (Facebook & Instagram via Meta Business)
    #
    # KNOWN BROKEN — do not use yet. The backend's initiate endpoints return
    # an HTTP redirect (a 302 to Facebook's OAuth page) meant for direct
    # browser navigation, not a fetch/request call — calling these methods
    # gets you Facebook's login page HTML, not a URL string. The finalize
    # endpoints additionally expect a completely different request shape
    # than what's implemented here (fb_page_id/ig_user_id selected from the
    # callback's available pages, not an OAuth code) — the whole
    # page-selection step this flow depends on isn't wired up on the SDK
    # side at all yet. Use the generic initiate()/get_pending()/finalize()
    # flow above instead, which is real and working.
    # ------------------------------------------------------------------

    def initiate_facebook_direct(self, redirect_uri: str) -> dict:
        """DEPRECATED: See the "KNOWN BROKEN" note above — not functional yet."""
        raise NotImplementedError(
            "connections.initiate_facebook_direct() is not functional yet — "
            "use connections.initiate() instead."
        )

    def finalize_facebook_direct(self, code: str, redirect_uri: str) -> dict:
        """DEPRECATED: See the "KNOWN BROKEN" note above — not functional yet."""
        raise NotImplementedError(
            "connections.finalize_facebook_direct() is not functional yet — "
            "use connections.finalize() instead."
        )

    def initiate_instagram_direct(self, redirect_uri: str) -> dict:
        """DEPRECATED: See the "KNOWN BROKEN" note above — not functional yet."""
        raise NotImplementedError(
            "connections.initiate_instagram_direct() is not functional yet — "
            "use connections.initiate() instead."
        )

    def finalize_instagram_direct(self, code: str, redirect_uri: str) -> dict:
        """DEPRECATED: See the "KNOWN BROKEN" note above — not functional yet."""
        raise NotImplementedError(
            "connections.finalize_instagram_direct() is not functional yet — "
            "use connections.finalize() instead."
        )
