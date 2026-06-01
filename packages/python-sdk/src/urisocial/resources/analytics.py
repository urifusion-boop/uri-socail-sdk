"""Analytics resource for URI Social SDK"""

from typing import Dict, Any, Optional
from ..http_client import HTTPClient


class AnalyticsResource:
    """Performance analytics and insights"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def get_performance(
        self, start_date: Optional[str] = None, end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get overall performance metrics"""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        return self._http.get("/social-media/performance", params=params)

    def get_by_platform(
        self, start_date: Optional[str] = None, end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get analytics breakdown by platform"""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        return self._http.get("/social-media/analytics", params=params)

    def get_account_metrics(self) -> Dict[str, Any]:
        """Get metrics for connected accounts"""
        return self._http.get("/social-media/account-metrics")

    def get_trends(self, industry: Optional[str] = None, region: Optional[str] = None) -> Dict[str, Any]:
        """Get trending topics and recommendations"""
        params = {}
        if industry:
            params["industry"] = industry
        if region:
            params["region"] = region
        return self._http.get("/social-media/content-calendar/trends", params=params)
