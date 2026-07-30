"""SDK client admin resource — manage the end-users under your API key"""

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class EndUsersResource:
    """
    SDK client admin view — lists the end-users provisioned under your own
    API key, each with a summary of their brand setup. This is for the app
    built on the SDK to manage its own users (e.g. an internal team seeing
    every account on their platform) — an individual end-user never sees
    this themselves.
    """

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def list(self, limit: int = 50, skip: int = 0) -> dict:
        """
        List end-users provisioned under this API key

        Args:
            limit: Max number of results (default: 50)
            skip: Number of results to skip (default: 0)

        Returns:
            dict with sdk_client_id, company_name, total_end_users, and a
            "users" list — each entry has end_user_id, external_user_id,
            status, usage totals, and a "setup" dict of their brand profile.
        """
        response = self._http.get(
            "/social-media/sdk/end-users",
            params={"limit": limit, "skip": skip},
        )
        return response["responseData"]
