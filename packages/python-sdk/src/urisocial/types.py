"""Type definitions for URI Social SDK"""

from typing import List, Optional, Literal, TypedDict, Dict, Any
from enum import Enum


class Platform(str, Enum):
    """Supported social media platforms"""

    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    TIKTOK = "tiktok"


class Tone(str, Enum):
    """Content tone options"""

    PROFESSIONAL = "professional"
    CASUAL = "casual"
    FRIENDLY = "friendly"
    FORMAL = "formal"
    PLAYFUL = "playful"


class ImageStyle(str, Enum):
    """Image generation styles"""

    IMMERSIVE = "immersive"
    STANDARD = "standard"
    MINIMALIST = "minimalist"


class AspectRatio(str, Enum):
    """Image aspect ratios"""

    SQUARE = "1:1"
    PORTRAIT = "4:5"
    LANDSCAPE = "16:9"


class ContentStatus(str, Enum):
    """Content generation status"""

    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class ConnectionStatus(str, Enum):
    """Platform connection status"""

    ACTIVE = "active"
    EXPIRED = "expired"
    ERROR = "error"


class SubscriptionTier(str, Enum):
    """Subscription tiers"""

    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class ContentGenerationRequest(TypedDict, total=False):
    """Request for content generation"""

    seed_content: str
    platforms: List[Platform]
    reference_image: Optional[str]
    tone: Optional[Tone]
    include_hashtags: Optional[bool]
    include_emojis: Optional[bool]


class PlatformContent(TypedDict):
    """Content for a specific platform"""

    platform: Platform
    text: str
    hashtags: List[str]
    character_count: int


class GeneratedContent(TypedDict):
    """Generated content response"""

    id: str
    platforms: List[PlatformContent]
    image_url: Optional[str]
    created_at: str
    status: ContentStatus


class Draft(TypedDict):
    """Content draft"""

    id: str
    user_id: str
    text_content: List[PlatformContent]
    image_url: Optional[str]
    reference_image: Optional[str]
    created_at: str
    updated_at: str


class ImageGenerationRequest(TypedDict, total=False):
    """Request for image generation"""

    prompt: str
    reference_image: Optional[str]
    style: Optional[ImageStyle]
    aspect_ratio: Optional[AspectRatio]


class ImageGenerationResult(TypedDict):
    """Image generation result"""

    image_url: str
    revised_prompt: Optional[str]


class Connection(TypedDict):
    """Social media connection"""

    platform: Platform
    account_name: str
    account_id: str
    connected_at: str
    status: ConnectionStatus


class PublishRequest(TypedDict, total=False):
    """Request to publish content"""

    draft_id: str
    platforms: List[Platform]
    schedule_time: Optional[str]


class PublishResult(TypedDict):
    """Result of publishing to a platform"""

    platform: Platform
    status: Literal["success", "failed"]
    post_id: Optional[str]
    error: Optional[str]


class BillingInfo(TypedDict):
    """Billing information"""

    credits_remaining: int
    subscription_tier: SubscriptionTier
    billing_cycle_end: str


class PaginatedResponse(TypedDict):
    """Paginated API response"""

    data: List[Any]
    total: int
    page: int
    per_page: int
    has_more: bool
