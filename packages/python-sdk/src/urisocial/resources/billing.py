"""Billing and credits resource"""

from typing import TYPE_CHECKING, Optional
from ..types import BillingInfo

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class BillingResource:
    """Resource for billing and credit management"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def get_info(self) -> BillingInfo:
        """
        Get current billing information and credits

        Returns:
            Billing info with credits remaining and subscription tier

        Example:
            >>> billing = client.billing.get_info()
            >>> print(f"Credits: {billing['credits_remaining']}")
            >>> print(f"Tier: {billing['subscription_tier']}")
        """
        return self._http.get("/api/v1/billing/info")

    def get_usage(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> dict:
        """
        Get usage history

        Args:
            start_date: Optional start date (ISO format)
            end_date: Optional end date (ISO format)

        Returns:
            Usage history with daily breakdown

        Example:
            >>> usage = client.billing.get_usage(
            ...     start_date='2024-01-01',
            ...     end_date='2024-01-31'
            ... )
            >>> print(f"Total API calls: {usage['total_api_calls']}")
        """
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date

        return self._http.get(
            "/api/v1/billing/usage",
            params=params if params else None,
        )
