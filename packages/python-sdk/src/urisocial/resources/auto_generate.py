"""Auto-generation resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class AutoGenerateResource:
    """Automated content generation settings"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def get_settings(self) -> Dict[str, Any]:
        """Get auto-generate settings"""
        return self._http.get("/social-media/auto-generate/settings")

    def update_settings(self, settings: Dict[str, Any]) -> Dict[str, Any]:
        """Update auto-generate settings"""
        return self._http.put("/social-media/auto-generate/settings", json=settings)

    def connect_insights(
        self,
        influencer_id: str,
        platform: str,
        insights: Dict[str, Any],
        social_user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Connect platform insights for auto-generation"""
        return self._http.post(
            "/social-media/auto-generate/connect-insights",
            json={
                "influencer_id": influencer_id,
                "platform": platform,
                "social_user_id": social_user_id,
                "insights": insights,
            },
        )

    def trigger(self) -> Dict[str, Any]:
        """Manually trigger auto-generation"""
        return self._http.post("/social-media/auto-generate/trigger")
