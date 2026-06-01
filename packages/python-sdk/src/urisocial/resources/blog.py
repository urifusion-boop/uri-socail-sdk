"""Blog generation resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class BlogResource:
    """AI blog post generation"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def generate(
        self,
        topic: str,
        keywords: Optional[List[str]] = None,
        tone: str = "professional",
        length: str = "medium",
        include_images: bool = False,
        seo_optimize: bool = True,
    ) -> Dict[str, Any]:
        """Generate AI-powered blog post"""
        return self._http.post(
            "/social-media/generate-blog",
            json={
                "topic": topic,
                "keywords": keywords,
                "tone": tone,
                "length": length,
                "include_images": include_images,
                "seo_optimize": seo_optimize,
            },
        )

    def list(self) -> Dict[str, Any]:
        """List all blog drafts"""
        return self._http.get("/social-media/blog-drafts")

    def get(self, draft_id: str) -> Dict[str, Any]:
        """Get specific blog draft"""
        return self._http.get(f"/social-media/blog-drafts/{draft_id}")
