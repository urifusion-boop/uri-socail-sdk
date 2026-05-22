# 🚀 URI Social SDK - Complete Setup Guide for Clients

This guide will help you integrate URI Social's AI-powered content generation into your application in minutes.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **URI Social Account** - [Sign up here](https://urisocial.com/signup)
- ✅ **API Key** - Get it from [your dashboard](https://urisocial.com/dashboard/api-keys)
- ✅ **Node.js 18+** (for JavaScript/TypeScript) or **Python 3.8+** (for Python)
- ✅ **Credits** - Ensure you have credits in your account

---

## 🎯 Choose Your Integration

### Option 1: React Components (Easiest - Full UI)
✅ Best for: Web apps, dashboards, admin panels
⏱️ Setup time: **5 minutes**

### Option 2: TypeScript/JavaScript SDK (Flexible)
✅ Best for: Custom integrations, backend services, Node.js apps
⏱️ Setup time: **3 minutes**

### Option 3: Python SDK (Backend)
✅ Best for: Python backends, data pipelines, automation
⏱️ Setup time: **3 minutes**

---

## 🎨 Option 1: React Components (Full UI - Recommended)

### Step 1: Install Packages

```bash
npm install @urisocial/react @urisocial/sdk react react-dom
# or
yarn add @urisocial/react @urisocial/sdk react react-dom
```

### Step 2: Get Your API Key

1. Go to [https://urisocial.com/dashboard/api-keys](https://urisocial.com/dashboard/api-keys)
2. Click **"Create API Key"**
3. Copy your key (starts with `uri_`)
4. Keep it secure!

### Step 3: Setup Environment Variable

Create a `.env` file in your project root:

```bash
# For Create React App
REACT_APP_URISOCIAL_API_KEY=uri_xxxxxxxxxxxxx

# For Vite
VITE_URISOCIAL_API_KEY=uri_xxxxxxxxxxxxx

# For Next.js
NEXT_PUBLIC_URISOCIAL_API_KEY=uri_xxxxxxxxxxxxx
```

⚠️ **Security Note**: Never commit your `.env` file to version control!

### Step 4: Add to Your App

```tsx
import { URISocialProvider, ContentGenerator } from '@urisocial/react';

function App() {
  return (
    <URISocialProvider apiKey={process.env.REACT_APP_URISOCIAL_API_KEY}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Generate Social Media Content</h1>

        <ContentGenerator
          platforms={['instagram', 'facebook']}
          onContentGenerated={(content) => {
            console.log('✅ Generated:', content);
            alert('Content generated successfully!');
          }}
          onError={(error) => {
            console.error('❌ Error:', error);
            alert(`Error: ${error.message}`);
          }}
        />
      </div>
    </URISocialProvider>
  );
}

export default App;
```

### Step 5: Run Your App

```bash
npm start
# or
yarn dev
```

### ✅ Done! Your users can now:
- Enter content descriptions
- Select social platforms
- Upload product images
- Generate AI content
- View and manage drafts

---

## 💻 Option 2: TypeScript/JavaScript SDK

### Step 1: Install Package

```bash
npm install @urisocial/sdk
# or
yarn add @urisocial/sdk
```

### Step 2: Setup Environment

```bash
# .env
URISOCIAL_API_KEY=uri_xxxxxxxxxxxxx
```

### Step 3: Use in Your Code

```typescript
import { URISocial } from '@urisocial/sdk';

// Initialize client
const client = new URISocial({
  apiKey: process.env.URISOCIAL_API_KEY
});

// Generate content
async function generateContent() {
  try {
    const content = await client.content.generate({
      seedContent: 'Launch our new luxury perfume with jasmine notes',
      platforms: ['instagram', 'facebook'],
      referenceImage: 'https://example.com/perfume.jpg',
      tone: 'professional',
      includeHashtags: true,
      includeEmojis: true
    });

    console.log('Generated content:', content);
    console.log('Instagram caption:', content.platforms[0].text);
    console.log('Generated image:', content.image_url);

    return content;
  } catch (error) {
    console.error('Error:', error);
  }
}

generateContent();
```

### ✅ Done! You can now:
- Generate content programmatically
- Manage drafts
- Connect social accounts
- Publish content
- Monitor credits

---

## 🐍 Option 3: Python SDK

### Step 1: Install Package

```bash
pip install urisocial
```

### Step 2: Setup Environment

```bash
# .env
URISOCIAL_API_KEY=uri_xxxxxxxxxxxxx
```

### Step 3: Use in Your Code

```python
import os
from urisocial import URISocial

# Initialize client
client = URISocial(api_key=os.getenv('URISOCIAL_API_KEY'))

# Generate content
def generate_content():
    try:
        content = client.content.generate(
            seed_content='Launch our new luxury perfume with jasmine notes',
            platforms=['instagram', 'facebook'],
            reference_image='https://example.com/perfume.jpg',
            tone='professional',
            include_hashtags=True,
            include_emojis=True
        )

        print('Generated content:', content)
        print('Instagram caption:', content['platforms'][0]['text'])
        print('Generated image:', content['image_url'])

        return content
    except Exception as error:
        print(f'Error: {error}')

if __name__ == '__main__':
    generate_content()
```

### ✅ Done! Your Python app can now:
- Generate content
- Manage drafts
- Integrate with your backend
- Automate social posting

---

## 🔥 Advanced Features

### 1. Draft Management

```typescript
// List all drafts
const drafts = await client.drafts.list(1, 20);

// Get specific draft
const draft = await client.drafts.get('draft-id');

// Update draft
await client.drafts.update('draft-id', {
  text_content: [{ platform: 'instagram', text: 'New text' }]
});

// Delete draft
await client.drafts.delete('draft-id');
```

### 2. Social Media Connections

```typescript
// Get connected platforms
const connections = await client.connections.list();

// Get OAuth URL for connecting Instagram
const { auth_url } = await client.connections.getConnectUrl('instagram');
window.location.href = auth_url; // Redirect user to connect

// Disconnect platform
await client.connections.disconnect('facebook');
```

### 3. Publishing Content

```typescript
// Publish immediately
const result = await client.publishing.publish({
  draftId: 'draft-123',
  platforms: ['instagram', 'facebook']
});

// Schedule for later
await client.publishing.schedule({
  draftId: 'draft-123',
  platforms: ['instagram'],
  scheduleTime: '2024-12-25T10:00:00Z'
});
```

### 4. Check Credits

```typescript
const billing = await client.billing.getInfo();
console.log(`Credits remaining: ${billing.credits_remaining}`);
console.log(`Subscription tier: ${billing.subscription_tier}`);
```

---

## 🎨 React Components Reference

### ContentGenerator
Full content generation form with image upload.

```tsx
<ContentGenerator
  platforms={['instagram', 'facebook']}
  defaultTone="professional"
  includeHashtags={true}
  includeEmojis={true}
  showImageUpload={true}
  onContentGenerated={(content) => console.log(content)}
  onError={(error) => alert(error.message)}
  onCreditsLow={(remaining) => alert(`Low credits: ${remaining}`)}
  theme={{
    primaryColor: '#CD1B78',
    borderRadius: '8px'
  }}
/>
```

### DraftManager
List and manage all drafts with pagination.

```tsx
<DraftManager
  pageSize={20}
  onDraftSelect={(id) => console.log('Selected:', id)}
  onDraftDelete={(id) => console.log('Deleted:', id)}
  onDraftPublish={(id) => console.log('Publishing:', id)}
/>
```

### ConnectionManager
Manage social media account connections.

```tsx
<ConnectionManager
  redirectUrl={window.location.origin + '/oauth/callback'}
  onConnectionAdded={(platform) => console.log('Connected:', platform)}
  onConnectionRemoved={(platform) => console.log('Disconnected:', platform)}
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

## 🎣 React Hooks Reference

### useContentGeneration

```tsx
import { useContentGeneration } from '@urisocial/react';

function MyComponent() {
  const { content, isGenerating, error, generate, reset } = useContentGeneration();

  const handleGenerate = () => {
    generate({
      seedContent: 'Product launch',
      platforms: ['instagram', 'facebook']
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

```tsx
import { useDrafts } from '@urisocial/react';

function DraftList() {
  const { drafts, isLoading, hasMore, loadMore, deleteDraft } = useDrafts(20);

  if (isLoading) return <p>Loading...</p>;

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

```tsx
import { useConnections } from '@urisocial/react';

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
      <button onClick={() => handleConnect('instagram')}>+ Connect Instagram</button>
    </div>
  );
}
```

### useBilling

```tsx
import { useBilling } from '@urisocial/react';

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

---

## ⚠️ Error Handling

### TypeScript

```typescript
import { URISocial } from '@urisocial/sdk';

try {
  const content = await client.content.generate({...});
} catch (error: any) {
  if (error.status === 401) {
    console.error('❌ Invalid API key');
  } else if (error.status === 429) {
    console.error('⏱️ Rate limit exceeded - wait and retry');
  } else if (error.status === 402) {
    console.error('💳 Insufficient credits - upgrade plan');
  } else {
    console.error('🔥 Error:', error.message);
  }
}
```

### Python

```python
from urisocial import URISocial, AuthenticationError, RateLimitError, InsufficientCreditsError

try:
    content = client.content.generate(...)
except AuthenticationError:
    print('❌ Invalid API key')
except RateLimitError:
    print('⏱️ Rate limit exceeded')
except InsufficientCreditsError:
    print('💳 Insufficient credits')
except Exception as e:
    print(f'🔥 Error: {e}')
```

---

## 🎨 Customization

### Custom Theme

```tsx
const theme = {
  primaryColor: '#CD1B78',        // Brand color
  backgroundColor: '#FFFFFF',      // Component background
  borderColor: '#E5E7EB',         // Border color
  borderRadius: '8px',            // Corner radius
  fontFamily: 'Inter, sans-serif', // Font
  errorColor: '#EF4444',          // Error color
  successColor: '#10B981'         // Success color
};

<ContentGenerator theme={theme} />
<DraftManager theme={theme} />
<ConnectionManager theme={theme} />
```

### Custom API URL (Self-hosted)

```typescript
const client = new URISocial({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-api.example.com', // Custom URL
  timeout: 120000 // 2 minutes timeout
});
```

---

## 🧪 Testing Your Integration

### Test API Key

```bash
curl -X POST https://api.urisocial.com/api/v1/billing/info \
  -H "X-API-Key: your-api-key"
```

If you get `200 OK`, your API key works!

### Test Content Generation

```typescript
const testContent = await client.content.generate({
  seedContent: 'Test post',
  platforms: ['instagram']
});

console.log('Test successful:', testContent);
```

---

## 📊 Monitoring & Limits

### Check Usage

```typescript
const usage = await client.billing.getUsage('2024-01-01', '2024-01-31');
console.log(`Total credits used: ${usage.total_credits_used}`);
```

### Rate Limits

- **Content Generation**: 100 requests/hour
- **Image Generation**: 50 requests/hour
- **Draft Operations**: 1000 requests/hour
- **Connection Checks**: 500 requests/hour

Upgrade your plan for higher limits!

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid API Key"
✅ **Solution**: Check that your API key starts with `uri_` and is active in your dashboard

### Issue: "Insufficient Credits"
✅ **Solution**: Purchase more credits at https://urisocial.com/pricing

### Issue: "Rate Limit Exceeded"
✅ **Solution**: Wait a few minutes or upgrade your plan

### Issue: "Image Too Large"
✅ **Solution**: Resize images to under 10MB before upload

### Issue: "CORS Error in Browser"
✅ **Solution**: Use backend proxy or enable CORS in your API settings

---

## 📚 Resources

- 📖 [Full Documentation](./docs/getting-started.md)
- 💡 [Code Examples](./examples/)
- 🔑 [Get API Key](https://urisocial.com/dashboard/api-keys)
- 💬 [Support](mailto:support@urisocial.com)
- 🐛 [Report Issues](https://github.com/uri-social/urisocial-sdk/issues)
- 💳 [Pricing](https://urisocial.com/pricing)

---

## 🎯 Next Steps

1. ✅ Choose your integration (React/TypeScript/Python)
2. ✅ Get your API key
3. ✅ Install packages
4. ✅ Copy example code
5. ✅ Test in development
6. ✅ Deploy to production
7. ✅ Monitor usage
8. ✅ Share feedback!

---

## 💬 Need Help?

We're here to help you succeed:

- 📧 **Email**: support@urisocial.com
- 💬 **Discord**: [Join community](https://discord.gg/urisocial)
- 📖 **Docs**: [docs.urisocial.com](https://docs.urisocial.com)
- 🎥 **Videos**: [YouTube tutorials](https://youtube.com/@urisocial)

---

**Happy coding! 🎉**

*Built with ❤️ by URI Social*
