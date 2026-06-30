"""Blog generation resource for URI Social SDK - Writing DNA System"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class BlogResource:
    """AI blog post generation with Writing DNA personalization"""

    def __init__(self, http: HTTPClient):
        self._http = http

    # ── Writing DNA ─────────────────────────────────────────────────────

    def submit_writing_dna_quiz(
        self,
        quiz_answers: Dict[str, str],
        writing_sample: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Submit Writing DNA quiz to generate personalized writing profile

        Args:
            quiz_answers: Dictionary with q1-q16 answers (A/B/C/D)
            writing_sample: Optional writing sample (max 3000 chars)

        Returns:
            Generated Writing DNA profile
        """
        return self._http.post(
            "/blog/writing-dna/quiz",
            json={
                "quiz_answers": quiz_answers,
                "writing_sample": writing_sample,
            },
        )

    def get_writing_dna(self) -> Dict[str, Any]:
        """
        Get current Writing DNA profile

        Returns:
            Writing DNA profile or None if not yet created
        """
        return self._http.get("/blog/writing-dna")

    # ── Blog Generation ─────────────────────────────────────────────────

    def generate(
        self,
        topic: str,
        primary_keyword: str,
        secondary_keywords: Optional[List[str]] = None,
        word_count: int = 800,
    ) -> Dict[str, Any]:
        """
        Generate AI-powered blog post using Writing DNA

        Args:
            topic: Blog post topic (5-200 chars)
            primary_keyword: Primary SEO keyword (2-100 chars)
            secondary_keywords: Optional list of secondary keywords (max 10)
            word_count: Target word count (300-3000, default: 800)

        Returns:
            Generated blog post object
        """
        payload = {
            "topic": topic,
            "primary_keyword": primary_keyword,
            "word_count": word_count,
        }
        if secondary_keywords:
            payload["secondary_keywords"] = secondary_keywords
        return self._http.post("/blog/generate", json=payload)

    # ── Blog Management ─────────────────────────────────────────────────

    def list_posts(self) -> Dict[str, Any]:
        """
        List all blog posts

        Returns:
            List of blog post objects
        """
        return self._http.get("/blog/posts")

    def get_post(self, blog_id: str) -> Dict[str, Any]:
        """
        Get specific blog post

        Args:
            blog_id: Blog post ID

        Returns:
            Blog post object
        """
        return self._http.get(f"/blog/posts/{blog_id}")

    def update_post(
        self,
        blog_id: str,
        content: str,
        title: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Update blog post (triggers voice learning)

        User edits are analyzed to improve future Writing DNA matching.

        Args:
            blog_id: Blog post ID
            content: Updated content (min 50 chars)
            title: Optional updated title (max 200 chars)

        Returns:
            Updated blog post object
        """
        payload = {"content": content}
        if title:
            payload["title"] = title
        return self._http.patch(f"/blog/posts/{blog_id}", json=payload)

    def submit_feedback(
        self,
        blog_id: str,
        rating: str,
        issues: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Submit thumbs-up/down feedback on blog post

        Args:
            blog_id: Blog post ID
            rating: 'up' or 'down'
            issues: Optional list of issues if rating=down
                   ('too_formal', 'too_casual', 'too_generic', 'not_my_style')

        Returns:
            Feedback confirmation
        """
        payload = {"rating": rating}
        if issues:
            payload["issues"] = issues
        return self._http.post(f"/blog/posts/{blog_id}/feedback", json=payload)

    def publish_post(
        self,
        blog_id: str,
        published_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Mark blog post as published

        Args:
            blog_id: Blog post ID
            published_url: Optional URL where post was published (max 500 chars)

        Returns:
            Publish confirmation
        """
        payload = {}
        if published_url:
            payload["published_url"] = published_url
        return self._http.post(f"/blog/posts/{blog_id}/publish", json=payload)
