"""Clients resource for URI Social SDK"""

from typing import Dict, Any
from ..http_client import HTTPClient


class ClientsResource:
    """Client/organization management"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def list(self) -> Dict[str, Any]:
        """List all clients"""
        return self._http.get("/social-media/clients")

    def get(self, client_id: str) -> Dict[str, Any]:
        """Get client details"""
        return self._http.get(f"/social-media/clients/{client_id}")

    def get_usage(self, client_id: str) -> Dict[str, Any]:
        """Get client usage summary"""
        return self._http.get(f"/social-media/clients/{client_id}/usage")

    def add_credits(self, client_id: str, credits: int) -> Dict[str, Any]:
        """Add credits to a client account. Only the client owner may add credits.

        Args:
            client_id: Client ID
            credits: Number of credits to add (1-1,000,000)
        """
        return self._http.post(
            f"/social-media/clients/{client_id}/credits/add?amount={credits}"
        )
