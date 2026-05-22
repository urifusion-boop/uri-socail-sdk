"""
URI Social Python SDK

Official Python SDK for URI Social API - AI-powered social media content generation.

Example:
    >>> from urisocial import URISocial
    >>> client = URISocial(api_key='your-api-key')
    >>> content = client.content.generate(
    ...     seed_content='Launch our new perfume line',
    ...     platforms=['instagram', 'facebook'],
    ...     reference_image='https://example.com/product.jpg'
    ... )
"""

from .client import URISocial
from .types import (
    Platform,
    ContentGenerationRequest,
    GeneratedContent,
    PlatformContent,
    Draft,
    ImageGenerationRequest,
    ImageGenerationResult,
    Connection,
    PublishRequest,
    PublishResult,
    BillingInfo,
    PaginatedResponse,
)
from .exceptions import (
    URISocialError,
    AuthenticationError,
    RateLimitError,
    InsufficientCreditsError,
    ValidationError,
)

__version__ = "1.0.0"
__all__ = [
    "URISocial",
    "Platform",
    "ContentGenerationRequest",
    "GeneratedContent",
    "PlatformContent",
    "Draft",
    "ImageGenerationRequest",
    "ImageGenerationResult",
    "Connection",
    "PublishRequest",
    "PublishResult",
    "BillingInfo",
    "PaginatedResponse",
    "URISocialError",
    "AuthenticationError",
    "RateLimitError",
    "InsufficientCreditsError",
    "ValidationError",
]
