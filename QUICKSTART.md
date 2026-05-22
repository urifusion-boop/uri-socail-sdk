# URI Social SDK - Quick Start Guide

Get up and running with URI Social SDK in 5 minutes.

## Prerequisites

- Node.js 18+ (for TypeScript/React SDK)
- Python 3.8+ (for Python SDK)
- URI Social API key ([Get one here](https://urisocial.com/dashboard/api-keys))

---

## Option 1: TypeScript/JavaScript SDK

### 1. Install

```bash
npm install @urisocial/sdk
# or
yarn add @urisocial/sdk
# or
pnpm add @urisocial/sdk
```

### 2. Setup Environment Variables

Create a `.env` file:
```bash
URISOCIAL_API_KEY=your-api-key-here
```

### 3. Use in Your Code

```typescript
import { URISocial } from '@urisocial/sdk';

const client = new URISocial({
  apiKey: process.env.URISOCIAL_API_KEY || 'your-api-key'
});

// Generate content
const content = await client.content.generate({
  seedContent: 'Launch our new luxury perfume collection',
  platforms: ['instagram', 'facebook'],
  referenceImage: 'https://example.com/product.jpg',
  tone: 'professional',
  includeHashtags: true
});

console.log(content.platforms); // Platform-specific content
console.log(content.image_url); // Generated image URL
```

### ✅ That's it! You're ready to generate content.

---

## Option 2: React Components

### 1. Install

```bash
npm install @urisocial/react @urisocial/sdk react react-dom
```

### 2. Setup Provider

Wrap your app with `URISocialProvider`:

```tsx
import { URISocialProvider } from '@urisocial/react';

function App() {
  return (
    <URISocialProvider apiKey={process.env.REACT_APP_URISOCIAL_API_KEY}>
      <YourApp />
    </URISocialProvider>
  );
}
```

### 3. Use Components

```tsx
import { ContentGenerator } from '@urisocial/react';

function ContentPage() {
  return (
    <ContentGenerator
      platforms={['instagram', 'facebook']}
      onContentGenerated={(content) => {
        console.log('Generated:', content);
      }}
    />
  );
}
```

### ✅ That's it! Full UI with zero configuration.

---

## Option 3: Python SDK

### 1. Install

```bash
pip install urisocial
```

### 2. Setup Environment Variables

Create a `.env` file:
```bash
URISOCIAL_API_KEY=your-api-key-here
```

### 3. Use in Your Code

```python
import os
from urisocial import URISocial

client = URISocial(api_key=os.getenv('URISOCIAL_API_KEY'))

# Generate content
content = client.content.generate(
    seed_content='Launch our new luxury perfume collection',
    platforms=['instagram', 'facebook'],
    reference_image='https://example.com/product.jpg',
    tone='professional',
    include_hashtags=True
)

print(content['platforms'])  # Platform-specific content
print(content['image_url'])  # Generated image URL
```

### ✅ That's it! Python backend integration ready.

---

## Try the Example App

### 1. Clone the Repository

```bash
git clone https://github.com/uri-social/urisocial-sdk.git
cd urisocial-sdk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup API Key

```bash
cd examples/react-example
cp .env.example .env
# Edit .env and add your API key
```

### 4. Run the Example

```bash
npm run dev
```

Open http://localhost:3000 to see the demo app!

---

## What You Can Do

### Content Generation
```typescript
await client.content.generate({
  seedContent: 'Product launch announcement',
  platforms: ['instagram', 'facebook', 'twitter'],
  referenceImage: 'https://example.com/product.jpg'
});
```

### Draft Management
```typescript
const drafts = await client.drafts.list(1, 20);
await client.drafts.update(draftId, { text_content: [...] });
await client.drafts.delete(draftId);
```

### Image Generation
```typescript
const image = await client.images.generate({
  prompt: 'Luxury perfume on marble',
  referenceImage: 'https://example.com/product.jpg',
  style: 'immersive'
});
```

### Social Connections
```typescript
const connections = await client.connections.list();
const authUrl = await client.connections.getConnectUrl('instagram');
window.location.href = authUrl; // Redirect to OAuth
```

### Publishing
```typescript
await client.publishing.publish({
  draftId: 'draft-123',
  platforms: ['instagram', 'facebook']
});

// Or schedule for later
await client.publishing.schedule({
  draftId: 'draft-123',
  platforms: ['instagram'],
  scheduleTime: '2024-12-25T10:00:00Z'
});
```

### Billing & Credits
```typescript
const billing = await client.billing.getInfo();
console.log(`Credits: ${billing.credits_remaining}`);
console.log(`Plan: ${billing.subscription_tier}`);
```

---

## React Components Available

### ContentGenerator
Full content generation form with image upload.
```tsx
<ContentGenerator
  platforms={['instagram', 'facebook']}
  onContentGenerated={(content) => console.log(content)}
/>
```

### DraftManager
List and manage drafts with pagination.
```tsx
<DraftManager
  onDraftSelect={(id) => console.log(id)}
  pageSize={20}
/>
```

### ConnectionManager
Connect and manage social media accounts.
```tsx
<ConnectionManager
  onConnectionAdded={(platform) => console.log(platform)}
/>
```

### CreditBadge
Display credit balance.
```tsx
<CreditBadge
  showUpgradeLink
  onUpgradeClick={() => window.location.href = '/pricing'}
/>
```

---

## Custom Hooks Available

### useContentGeneration
```tsx
const { content, isGenerating, generate } = useContentGeneration();
```

### useDrafts
```tsx
const { drafts, loadMore, deleteDraft } = useDrafts(20);
```

### useConnections
```tsx
const { connections, disconnect, getConnectUrl } = useConnections();
```

### useBilling
```tsx
const { billingInfo, purchaseCredits } = useBilling();
```

---

## Customization

### Theme
All React components accept a `theme` prop:
```tsx
const theme = {
  primaryColor: '#CD1B78',
  borderRadius: '8px',
  fontFamily: 'Inter, sans-serif'
};

<ContentGenerator theme={theme} />
```

### API Configuration
```typescript
const client = new URISocial({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.urisocial.com', // Custom API URL
  timeout: 60000 // Request timeout in ms
});
```

---

## Error Handling

### TypeScript
```typescript
try {
  const content = await client.content.generate({...});
} catch (error) {
  if (error.status === 401) {
    console.error('Invalid API key');
  } else if (error.status === 429) {
    console.error('Rate limit exceeded');
  } else if (error.status === 402) {
    console.error('Insufficient credits');
  }
}
```

### Python
```python
from urisocial import URISocial, AuthenticationError, RateLimitError

try:
    content = client.content.generate(...)
except AuthenticationError:
    print('Invalid API key')
except RateLimitError:
    print('Rate limit exceeded')
```

### React Components
```tsx
<ContentGenerator
  onError={(error) => {
    alert(error.message);
  }}
  onCreditsLow={(remaining) => {
    if (remaining < 50) {
      alert('Low credits!');
    }
  }}
/>
```

---

## Next Steps

- 📖 [Full Documentation](./docs/getting-started.md)
- 💡 [Examples](./examples/)
- 🔑 [Get API Key](https://urisocial.com/dashboard/api-keys)
- 🐛 [Report Issues](https://github.com/uri-social/urisocial-sdk/issues)
- 💬 [Support](mailto:support@urisocial.com)

---

## Support

Need help? We're here for you:

- 📧 Email: support@urisocial.com
- 💬 Discord: [Join our community](https://discord.gg/urisocial)
- 📖 Docs: [docs.urisocial.com](https://docs.urisocial.com)
- 🐛 Issues: [GitHub Issues](https://github.com/uri-social/urisocial-sdk/issues)

---

## License

MIT © URI Social
