# urisocial

Official Python SDK for URI Social API - AI-powered social media content generation.

## Installation

```bash
pip install urisocial
```

## Quick Start

```python
from urisocial import URISocial

client = URISocial(api_key='your-api-key')

# Generate content for multiple platforms
content = client.content.generate(
    seed_content='Launch our new luxury perfume collection',
    platforms=['instagram', 'facebook', 'twitter'],
    reference_image='https://example.com/perfume.jpg',
    tone='professional',
    include_hashtags=True
)

print(content['platforms'])  # Platform-specific content
print(content['image_url'])  # Generated image URL
```

## Core Features

### 1. Content Generation

Generate platform-optimized social media content:

```python
content = client.content.generate(
    seed_content='Introducing our eco-friendly water bottle',
    platforms=['instagram', 'linkedin'],
    reference_image='https://example.com/bottle.jpg',
    tone='friendly',
    include_hashtags=True,
    include_emojis=False
)

# Access platform-specific content
for platform in content['platforms']:
    print(f"{platform['platform']}: {platform['text']}")
    print(f"Hashtags: {' '.join(platform['hashtags'])}")
```

### 2. Draft Management

Work with drafts before publishing:

```python
# List all drafts
drafts = client.drafts.list(page=1, per_page=20)

# Get specific draft
draft = client.drafts.get('draft-id')

# Update draft
updated = client.drafts.update(
    'draft-id',
    text_content=[{
        'platform': 'instagram',
        'text': 'Updated caption',
        'hashtags': ['#NewProduct'],
        'character_count': 50
    }]
)

# Delete draft
client.drafts.delete('draft-id')
```

### 3. Image Generation

Generate and edit images with AI:

```python
# Generate new image
image = client.images.generate(
    prompt='Luxury perfume bottle on marble surface, golden hour lighting',
    reference_image='https://example.com/product.jpg',
    style='immersive',
    aspect_ratio='1:1'
)

# Remove background from product image
cutout = client.images.remove_background('https://example.com/product.jpg')
print(cutout['cutout_url'])

# Analyze product forensically
analysis = client.images.analyze_product('https://example.com/product.jpg')
print(analysis['product_type'])
print(analysis['colors'])
```

### 4. Social Media Connections

Manage platform connections:

```python
# List connected platforms
connections = client.connections.list()
for conn in connections['connected_platforms']:
    print(f"{conn['platform']}: {conn['account_name']}")

# Get OAuth URL for connecting platform
result = client.connections.get_connect_url(
    'instagram',
    redirect_url='https://yourapp.com/callback'
)
print(result['auth_url'])  # Redirect user here

# Disconnect platform
client.connections.disconnect('facebook')

# Check connection status
status = client.connections.get_status('instagram')
print(status['status'])  # 'active', 'expired', or 'error'
```

### 5. Publishing

Publish or schedule content:

```python
# Publish immediately
result = client.publishing.publish(
    draft_id='draft-123',
    platforms=['instagram', 'facebook']
)

for r in result['results']:
    print(f"{r['platform']}: {r['status']}")
    if r.get('post_id'):
        print(f"Post ID: {r['post_id']}")

# Schedule for later
scheduled = client.publishing.schedule(
    draft_id='draft-123',
    platforms=['instagram'],
    schedule_time='2024-12-25T10:00:00Z'
)
print(f"Scheduled ID: {scheduled['scheduled_id']}")

# List scheduled posts
scheduled_posts = client.publishing.list_scheduled()

# Cancel scheduled post
client.publishing.cancel_scheduled('scheduled-id')
```

### 6. Billing & Credits

Monitor usage and credits:

```python
# Get billing info
billing = client.billing.get_info()
print(f"Credits remaining: {billing['credits_remaining']}")
print(f"Tier: {billing['subscription_tier']}")

# Get usage history
usage = client.billing.get_usage(
    start_date='2024-01-01',
    end_date='2024-01-31'
)
print(f"Total credits used: {usage['total_credits_used']}")

# Purchase credits
checkout = client.billing.purchase_credits(100)
print(checkout['checkout_url'])  # Redirect user here
```

## Configuration

```python
client = URISocial(
    api_key='your-api-key',
    base_url='https://api.urisocial.com',  # Optional
    timeout=60  # Optional, request timeout in seconds
)

# Update API key after initialization
client.set_api_key('new-api-key')
```

## Context Manager

Use as context manager for automatic cleanup:

```python
with URISocial(api_key='your-api-key') as client:
    content = client.content.generate(
        seed_content='Test',
        platforms=['instagram']
    )
    # Session automatically closed
```

## Error Handling

```python
from urisocial import (
    URISocial,
    AuthenticationError,
    RateLimitError,
    InsufficientCreditsError,
    ValidationError
)

try:
    content = client.content.generate(
        seed_content='Test',
        platforms=['instagram']
    )
except AuthenticationError as e:
    print(f"Invalid API key: {e.message}")
except RateLimitError as e:
    print(f"Rate limit exceeded: {e.message}")
except InsufficientCreditsError as e:
    print(f"Insufficient credits: {e.message}")
except ValidationError as e:
    print(f"Validation error: {e.message}")
```

## Type Hints

Full type hint support:

```python
from urisocial import (
    URISocial,
    Platform,
    ContentGenerationRequest,
    GeneratedContent,
    Draft
)

platforms: list[Platform] = ['instagram', 'facebook']

content: GeneratedContent = client.content.generate(
    seed_content='Product launch',
    platforms=platforms,
    tone='professional'
)
```

## Platform Support

Supported platforms:
- Instagram
- Facebook
- Twitter
- LinkedIn
- TikTok

## Requirements

- Python 3.8+
- requests >= 2.31.0

## API Reference

Full API documentation: [https://docs.urisocial.com/api](https://docs.urisocial.com/api)

## License

MIT
