"""Content calendar resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class CalendarResource:
    """Content calendar and planning"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def get_content(
        self, start_date: Optional[str] = None, end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get calendar content"""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        return self._http.get("/social-media/content-calendar", params=params)

    def get_today(self) -> Dict[str, Any]:
        """Get today's content overview"""
        return self._http.get("/social-media/content-calendar/today")

    def get_plan(self) -> Dict[str, Any]:
        """Get active content plan"""
        return self._http.get("/social-media/content-calendar/plan")

    def generate_plan(
        self,
        days: int,
        platforms: List[str],
        themes: Optional[List[str]] = None,
        posting_frequency: int = 1,
    ) -> Dict[str, Any]:
        """Generate a new content plan"""
        return self._http.post(
            "/social-media/content-calendar/plan/generate",
            json={
                "days": days,
                "platforms": platforms,
                "themes": themes,
                "posting_frequency": posting_frequency,
            },
        )

    def regenerate_day(self, plan_id: str, day_index: int) -> Dict[str, Any]:
        """Regenerate content ideas for a specific day"""
        return self._http.post(
            f"/social-media/content-calendar/plan/{plan_id}/day/{day_index}/regenerate"
        )

    def create_draft_from_idea(
        self, plan_id: str, day_index: int, idea_index: int
    ) -> Dict[str, Any]:
        """Create draft from content idea"""
        return self._http.post(
            f"/social-media/content-calendar/plan/{plan_id}/day/{day_index}/create-draft",
            json={"idea_index": idea_index},
        )
