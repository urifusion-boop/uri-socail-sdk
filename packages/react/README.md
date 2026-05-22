# @urisocial/react

Official React components for URI Social SDK - AI-powered social media content generation.

## Installation

```bash
npm install @urisocial/react @urisocial/sdk
# or
yarn add @urisocial/react @urisocial/sdk
# or
pnpm add @urisocial/react @urisocial/sdk
```

## Quick Start

```tsx
import { URISocialProvider, ContentGenerator } from '@urisocial/react';

function App() {
  return (
    <URISocialProvider apiKey="your-api-key">
      <ContentGenerator
        platforms={['instagram', 'facebook']}
        onContentGenerated={(content) => {
          console.log('Generated:', content);
        }}
      />
    </URISocialProvider>
  );
}

export default App;
```

## Components

### URISocialProvider

Wraps your app and provides SDK context to all child components.

```tsx
<URISocialProvider
  apiKey="your-api-key"
  baseUrl="https://api.urisocial.com" // Optional
  timeout={60000} // Optional
>
  <YourApp />
</URISocialProvider>
```

### ContentGenerator

Full-featured content generation form with image upload and platform selection.

```tsx
<ContentGenerator
  platforms={['instagram', 'facebook', 'twitter']}
  defaultSeedContent="Launch new product"
  defaultTone="professional"
  includeHashtags={true}
  includeEmojis={true}
  showImageUpload={true}
  onGenerating={(progress) => console.log('Progress:', progress)}
  onContentGenerated={(content) => console.log('Done:', content)}
  onError={(error) => console.error('Error:', error)}
  onCreditsLow={(remaining) => alert(`Low credits: ${remaining}`)}
  theme={{
    primaryColor: '#CD1B78',
    borderRadius: '8px',
  }}
/>
```

### DraftManager

List and manage content drafts with pagination.

```tsx
<DraftManager
  onDraftSelect={(id) => console.log('Selected:', id)}
  onDraftDelete={(id) => console.log('Deleted:', id)}
  onDraftPublish={(id) => console.log('Publishing:', id)}
  pageSize={20}
  theme={{
    primaryColor: '#CD1B78',
  }}
/>
```

### ConnectionManager

Manage social media platform connections.

```tsx
<ConnectionManager
  redirectUrl="https://yourapp.com/oauth/callback"
  onConnectionAdded={(platform) => console.log('Connected:', platform)}
  onConnectionRemoved={(platform) => console.log('Disconnected:', platform)}
  theme={{
    primaryColor: '#CD1B78',
  }}
/>
```

### CreditBadge

Display credit balance with optional upgrade link.

```tsx
<CreditBadge
  showUpgradeLink
  onUpgradeClick={() => window.location.href = '/pricing'}
  theme={{
    primaryColor: '#CD1B78',
  }}
/>
```

## Hooks

### useContentGeneration

Hook for programmatic content generation.

```tsx
function MyComponent() {
  const { content, isGenerating, error, generate, reset } = useContentGeneration();

  const handleGenerate = () => {
    generate({
      seedContent: 'Product launch announcement',
      platforms: ['instagram', 'facebook'],
      tone: 'professional',
      includeHashtags: true,
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
      {content && <pre>{JSON.stringify(content, null, 2)}</pre>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### useDrafts

Hook for managing drafts with pagination.

```tsx
function DraftList() {
  const { drafts, isLoading, hasMore, loadMore, deleteDraft } = useDrafts(20);

  return (
    <div>
      {drafts.map(draft => (
        <div key={draft.id}>
          <p>{draft.text_content[0]?.text}</p>
          <button onClick={() => deleteDraft(draft.id)}>Delete</button>
        </div>
      ))}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

### useConnections

Hook for managing social media connections.

```tsx
function ConnectionList() {
  const { connections, disconnect, getConnectUrl } = useConnections();

  const handleConnect = async (platform) => {
    const authUrl = await getConnectUrl(platform);
    window.location.href = authUrl;
  };

  return (
    <div>
      {connections.map(conn => (
        <div key={conn.platform}>
          {conn.platform}: {conn.account_name}
          <button onClick={() => disconnect(conn.platform)}>Disconnect</button>
        </div>
      ))}
      <button onClick={() => handleConnect('instagram')}>Connect Instagram</button>
    </div>
  );
}
```

### useBilling

Hook for billing and credits management.

```tsx
function BillingInfo() {
  const { billingInfo, purchaseCredits } = useBilling();

  const handlePurchase = async () => {
    const checkoutUrl = await purchaseCredits(100);
    window.location.href = checkoutUrl;
  };

  return (
    <div>
      <p>Credits: {billingInfo?.credits_remaining}</p>
      <p>Plan: {billingInfo?.subscription_tier}</p>
      <button onClick={handlePurchase}>Buy 100 Credits</button>
    </div>
  );
}
```

## Theming

All components accept a `theme` prop for customization:

```tsx
const customTheme = {
  primaryColor: '#CD1B78',
  backgroundColor: '#FFFFFF',
  borderColor: '#E5E7EB',
  borderRadius: '8px',
  fontFamily: 'Inter, system-ui, sans-serif',
  errorColor: '#EF4444',
  successColor: '#10B981',
};

<ContentGenerator theme={customTheme} />
<DraftManager theme={customTheme} />
<ConnectionManager theme={customTheme} />
```

## Styling

Components use inline styles by default (no external CSS required), but you can override with custom classes:

```tsx
<ContentGenerator
  className="my-custom-class"
  theme={customTheme}
/>
```

Or use CSS variables:

```css
.urisocial-content-generator {
  --urisocial-primary: #CD1B78;
  --urisocial-border-radius: 8px;
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  ContentGeneratorProps,
  URISocialTheme,
  Platform,
  GeneratedContent
} from '@urisocial/react';

const theme: URISocialTheme = {
  primaryColor: '#CD1B78',
  borderRadius: '8px',
};

const handleGenerated = (content: GeneratedContent) => {
  console.log(content.platforms);
};
```

## Framework Support

Works with any React framework:
- ✅ Create React App
- ✅ Next.js
- ✅ Vite
- ✅ Remix
- ✅ Gatsby

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Examples

See the [examples directory](../../examples/react/) for complete examples:
- Basic usage
- Custom theming
- Advanced integration
- Error handling

## API Reference

Full API documentation: [https://docs.urisocial.com/react](https://docs.urisocial.com/react)

## License

MIT
