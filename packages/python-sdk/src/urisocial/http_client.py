"""HTTP client for URI Social API"""

import requests
import time
from typing import Optional, Dict, Any, Callable
from .exceptions import (
    URISocialError,
    AuthenticationError,
    AuthorizationError,
    RateLimitError,
    InsufficientCreditsError,
    ValidationError,
    NotFoundError,
    NetworkError,
    ServerError,
)


class HTTPClient:
    """HTTP client for making API requests with automatic retry logic"""

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.urisocial.com",
        timeout: int = 60,
        workspace_id: Optional[str] = None,
        max_retries: int = 3,
        retry_delay: float = 1.0,
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.workspace_id = workspace_id
        self.max_retries = max_retries
        self.retry_delay = retry_delay

        self.session = requests.Session()
        self._update_headers()

    def _update_headers(self) -> None:
        """Update session headers"""
        headers = {
            "Content-Type": "application/json",
            "X-API-Key": self.api_key,
            "User-Agent": "urisocial-python-sdk/2.0.0",
        }

        if self.workspace_id:
            headers["X-Workspace-ID"] = self.workspace_id

        self.session.headers.update(headers)

    def _handle_error(self, response: requests.Response) -> None:
        """Handle HTTP errors and raise appropriate exceptions"""
        try:
            error_data = response.json()
            error_message = (
                error_data.get("detail")
                or error_data.get("message")
                or error_data.get("responseMessage")
                or response.text
            )
        except ValueError:
            error_data = {}
            error_message = response.text or f"HTTP {response.status_code} error"

        status_code = response.status_code

        if status_code == 401:
            raise AuthenticationError(error_message, status=status_code, response=error_data)
        elif status_code == 403:
            raise AuthorizationError(error_message, status=status_code, response=error_data)
        elif status_code == 402:
            raise InsufficientCreditsError(error_message, status=status_code, response=error_data)
        elif status_code == 404:
            raise NotFoundError(error_message, status=status_code, response=error_data)
        elif status_code == 400 or status_code == 422:
            raise ValidationError(error_message, status=status_code, response=error_data)
        elif status_code == 429:
            retry_after = response.headers.get("Retry-After")
            raise RateLimitError(
                error_message,
                status=status_code,
                response=error_data,
                retry_after=int(retry_after) if retry_after else None
            )
        elif status_code >= 500:
            raise ServerError(error_message, status=status_code, response=error_data)
        else:
            raise URISocialError(error_message, status=status_code, response=error_data)

    def _should_retry(self, error: Exception, attempt: int) -> bool:
        """Determine if request should be retried"""
        if attempt >= self.max_retries:
            return False

        # Retry on rate limits, server errors, and network errors
        if isinstance(error, (RateLimitError, ServerError, NetworkError)):
            return True

        # Retry on specific request exceptions
        if isinstance(error, requests.exceptions.RequestException):
            if isinstance(error, (
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.HTTPError
            )):
                return True

        return False

    def _calculate_backoff(self, attempt: int) -> float:
        """Calculate exponential backoff with jitter"""
        import random
        exponential_delay = self.retry_delay * (2 ** attempt)
        jitter = random.uniform(0, 1)
        return min(exponential_delay + jitter, 60)  # Max 60 seconds

    def _request_with_retry(self, method: Callable, *args, **kwargs) -> Dict[str, Any]:
        """Execute request with automatic retry logic"""
        attempt = 0

        while True:
            try:
                response = method(*args, **kwargs)

                if not response.ok:
                    self._handle_error(response)

                return response.json()

            except requests.exceptions.RequestException as e:
                if not self._should_retry(e, attempt):
                    raise NetworkError(str(e), status=0, response={})

                attempt += 1
                delay = self._calculate_backoff(attempt)
                time.sleep(delay)

            except (RateLimitError, ServerError) as e:
                if not self._should_retry(e, attempt):
                    raise

                attempt += 1

                # Use Retry-After header if available
                if isinstance(e, RateLimitError) and hasattr(e, 'retry_after') and e.retry_after:
                    delay = e.retry_after
                else:
                    delay = self._calculate_backoff(attempt)

                time.sleep(delay)

    def get(self, path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Make GET request with automatic retry"""
        url = f"{self.base_url}{path}"
        return self._request_with_retry(
            self.session.get, url, params=params, timeout=self.timeout
        )

    def post(
        self,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make POST request with automatic retry"""
        url = f"{self.base_url}{path}"
        return self._request_with_retry(
            self.session.post, url, data=data, json=json, timeout=self.timeout
        )

    def put(
        self,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make PUT request with automatic retry"""
        url = f"{self.base_url}{path}"
        return self._request_with_retry(
            self.session.put, url, data=data, json=json, timeout=self.timeout
        )

    def patch(
        self,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make PATCH request with automatic retry"""
        url = f"{self.base_url}{path}"
        return self._request_with_retry(
            self.session.patch, url, data=data, json=json, timeout=self.timeout
        )

    def delete(self, path: str) -> Dict[str, Any]:
        """Make DELETE request with automatic retry"""
        url = f"{self.base_url}{path}"
        return self._request_with_retry(
            self.session.delete, url, timeout=self.timeout
        )

    def set_api_key(self, api_key: str) -> None:
        """Update API key"""
        self.api_key = api_key
        self._update_headers()

    def set_workspace_id(self, workspace_id: Optional[str]) -> None:
        """Set workspace ID for all requests"""
        self.workspace_id = workspace_id
        self._update_headers()

    def get_workspace_id(self) -> Optional[str]:
        """Get current workspace ID"""
        return self.workspace_id

    def close(self) -> None:
        """Close the session"""
        self.session.close()

    def __enter__(self):
        """Context manager entry"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()
