# @urisocial/sdk

Official TypeScript/JavaScript SDK for URI Social API - AI-powered social media content generation.

## Installation

```bash
npm install @urisocial/sdk
# or
yarn add @urisocial/sdk
# or
pnpm add @urisocial/sdk
```

## Quick Start

```typescript
import { URISocial } from '@urisocial/sdk';

const client = new URISocial({
  apiKey: 'your-api-key'
});

// Generate content for multiple platforms
const content = await client.content.generate({
  seedContent: 'Launch our new luxury perfume collection',
  platforms: ['instagram', 'facebook', 'twitter'],
  referenceImage: 'https://example.com/perfume.jpg',
  tone: 'professional',
  includeHashtags: true
});

console.log(content.platforms); // Array of platform-specific content
console.log(content.image_url); // Generated image URL
```

## Core Features

### 1. Content Generation

Generate platform-optimized social media content:

```typescript
const content = await client.content.generate({
  seedContent: 'Introducing our eco-friendly water bottle',
  platforms: ['instagram', 'linkedin'],
  referenceImage: 'https://example.com/bottle.jpg',
  tone: 'friendly',
  includeHashtags: true,
  includeEmojis: false
});

// Access platform-specific content
content.platforms.forEach(platform => {
  console.log(`${platform.platform}: ${platform.text}`);
  console.log(`Hashtags: ${platform.hashtags.join(' ')}`);
});
```

### 2. Draft Management

Work with drafts before publishing:

```typescript
// List all drafts
const drafts = await client.drafts.list(1, 20);

// Get specific draft
const draft = await client.drafts.get('draft-id');

// Update draft
await client.drafts.update('draft-id', {
  text_content: [{
    platform: 'instagram',
    text: 'Updated caption',
    hashtags: ['#NewProduct'],
    character_count: 50
  }]
});

// Delete draft
await client.drafts.delete('draft-id');
```

### 3. Image Generation

Generate and edit images with AI:

```typescript
// Generate new image
const image = await client.images.generate({
  prompt: 'Luxury perfume bottle on marble surface, golden hour lighting',
  referenceImage: 'https://example.com/product.jpg',
  style: 'immersive',
  aspectRatio: '1:1'
});

// Remove background from product image
const cutout = await client.images.removeBackground(
  'https://example.com/product.jpg'
);

// Analyze product forensically
const analysis = await client.images.analyzeProduct(
  'https://example.com/product.jpg'
);
console.log(analysis.product_type);
console.log(analysis.colors);
```

### 4. Social Media Connections

Manage platform connections:

```typescript
// List connected platforms
const connections = await client.connections.list();

// Get OAuth URL for connecting platform
const { auth_url } = await client.connections.getConnectUrl(
  'instagram',
  'https://yourapp.com/callback'
);

// Disconnect platform
await client.connections.disconnect('facebook');

// Check connection status
const status = await client.connections.getStatus('instagram');
console.log(status.status); // 'active' | 'expired' | 'error'
```

### 5. Publishing

Publish or schedule content:

```typescript
// Publish immediately
const result = await client.publishing.publish({
  draftId: 'draft-123',
  platforms: ['instagram', 'facebook']
});

result.results.forEach(r => {
  console.log(`${r.platform}: ${r.status}`);
  if (r.post_id) console.log(`Post ID: ${r.post_id}`);
});

// Schedule for later
const scheduled = await client.publishing.schedule({
  draftId: 'draft-123',
  platforms: ['instagram'],
  scheduleTime: '2024-12-25T10:00:00Z'
});

// List scheduled posts
const scheduledPosts = await client.publishing.listScheduled();

// Cancel scheduled post
await client.publishing.cancelScheduled('scheduled-id');
```

### 6. Billing & Credits

Monitor usage and credits:

```typescript
// Get billing info
const billing = await client.billing.getInfo();
console.log(`Credits remaining: ${billing.credits_remaining}`);
console.log(`Tier: ${billing.subscription_tier}`);

// Get usage history
const usage = await client.billing.getUsage(
  '2024-01-01',
  '2024-01-31'
);
console.log(`Total credits used: ${usage.total_credits_used}`);

// Purchase credits
const checkout = await client.billing.purchaseCredits(100);
window.location.href = checkout.checkout_url;
```

## Configuration

```typescript
const client = new URISocial({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.urisocial.com', // Optional, defaults to production
  timeout: 60000 // Optional, request timeout in ms
});

// Update API key after initialization
client.setApiKey('new-api-key');
```

## Error Handling

```typescript
import { URISocial, APIError } from '@urisocial/sdk';

try {
  const content = await client.content.generate({
    seedContent: 'Test',
    platforms: ['instagram']
  });
} catch (error) {
  const apiError = error as APIError;
  console.error(`Error ${apiError.status}: ${apiError.message}`);

  if (apiError.status === 401) {
    console.error('Invalid API key');
  } else if (apiError.status === 429) {
    console.error('Rate limit exceeded');
  } else if (apiError.status === 402) {
    console.error('Insufficient credits');
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import {
  URISocial,
  Platform,
  ContentGenerationRequest,
  GeneratedContent,
  Draft
} from '@urisocial/sdk';

const platforms: Platform[] = ['instagram', 'facebook'];

const request: ContentGenerationRequest = {
  seedContent: 'Product launch',
  platforms,
  tone: 'professional'
};

const content: GeneratedContent = await client.content.generate(request);
```

## Platform Support

Supported platforms:
- Instagram
- Facebook
- Twitter
- LinkedIn
- TikTok

## API Reference

Full API documentation: [https://docs.urisocial.com/api](https://docs.urisocial.com/api)

## License

MIT
