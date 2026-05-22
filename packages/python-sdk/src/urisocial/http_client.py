"""HTTP client for URI Social API"""

import requests
from typing import Optional, Dict, Any
from .exceptions import (
    URISocialError,
    AuthenticationError,
    RateLimitError,
    InsufficientCreditsError,
    ValidationError,
    NotFoundError,
    ServerError,
)


class HTTPClient:
    """HTTP client for making API requests"""

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.urisocial.com",
        timeout: int = 60,
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Content-Type": "application/json",
                "X-API-Key": api_key,
            }
        )

    def _handle_error(self, response: requests.Response) -> None:
        """Handle HTTP errors and raise appropriate exceptions"""
        try:
            error_data = response.json()
            error_message = error_data.get("message", response.text)
        except ValueError:
            error_message = response.text or f"HTTP {response.status_code} error"

        if response.status_code == 401:
            raise AuthenticationError(
                error_message,
                status=response.status_code,
                response=error_data if "error_data" in locals() else {},
            )
        elif response.status_code == 402:
            raise InsufficientCreditsError(
                error_message,
                status=response.status_code,
                response=error_data if "error_data" in locals() else {},
            )
        elif response.status_code == 404:
            raise NotFoundError(
                error_message,
                status=response.status_code,
                response=error_data if "error_data" in locals() else {},
            )
        elif response.status_code == 422:
            raise ValidationError(
                error_message,
                status=response.status_code,
                response=error_data if "error_data" in locals() else {},
            )
        elif response.status_code == 429:
            raise RateLimitError(
                error_message,
                status=response.status_code,
                response=error_data if "error_data" in locals() else {},
            )
        elif response.status_code >= 500:
            raise ServerError(
                error_message,
                status=response.status_code,
                response=error_data if "error_data" in locals() else {},
            )
        else:
            raise URISocialError(
                error_message,
                status=response.status_code,
                response=error_data if "error_data" in locals() else {},
            )

    def get(self, path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Make GET request"""
        url = f"{self.base_url}{path}"
        response = self.session.get(url, params=params, timeout=self.timeout)

        if not response.ok:
            self._handle_error(response)

        return response.json()

    def post(
        self,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make POST request"""
        url = f"{self.base_url}{path}"
        response = self.session.post(url, data=data, json=json, timeout=self.timeout)

        if not response.ok:
            self._handle_error(response)

        return response.json()

    def put(
        self,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make PUT request"""
        url = f"{self.base_url}{path}"
        response = self.session.put(url, data=data, json=json, timeout=self.timeout)

        if not response.ok:
            self._handle_error(response)

        return response.json()

    def patch(
        self,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make PATCH request"""
        url = f"{self.base_url}{path}"
        response = self.session.patch(url, data=data, json=json, timeout=self.timeout)

        if not response.ok:
            self._handle_error(response)

        return response.json()

    def delete(self, path: str) -> Dict[str, Any]:
        """Make DELETE request"""
        url = f"{self.base_url}{path}"
        response = self.session.delete(url, timeout=self.timeout)

        if not response.ok:
            self._handle_error(response)

        return response.json()

    def set_api_key(self, api_key: str) -> None:
        """Update API key"""
        self.api_key = api_key
        self.session.headers.update({"X-API-Key": api_key})

    def close(self) -> None:
        """Close the session"""
        self.session.close()

    def __enter__(self):
        """Context manager entry"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()
