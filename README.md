# URI Social SDK

Official SDKs for integrating URI Social's AI-powered social media content generation into your platform.

[![npm version](https://img.shields.io/npm/v/@urisocial/sdk)](https://www.npmjs.com/package/@urisocial/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🎨 **AI Content Generation** - Generate platform-optimized social media content
- 🖼️ **Image Generation** - Create immersive product images with AI
- 📝 **Draft Management** - Edit and manage content drafts
- 🔗 **Social Connections** - Connect Instagram, Facebook, Twitter, LinkedIn, TikTok
- 📅 **Scheduling** - Schedule content for future publishing
- 💳 **Billing** - Monitor credits and usage

---

## 📦 Available Packages

### Backend SDKs

| Package | Platform | Installation | Documentation |
|---------|----------|--------------|---------------|
| [@urisocial/sdk](./packages/typescript-sdk) | TypeScript/JavaScript | `npm install @urisocial/sdk` | [Docs](./packages/typescript-sdk/README.md) |
| [urisocial](./packages/python-sdk) | Python | `pip install urisocial` | [Docs](./packages/python-sdk/README.md) |

### Frontend Components

| Package | Framework | Installation | Documentation |
|---------|-----------|--------------|---------------|
| [@urisocial/react](./packages/react) | React | `npm install @urisocial/react` | [Docs](./packages/react/README.md) |

---

## 🚀 Quick Start

### For Clients (Using the SDK)

**👉 [Complete Setup Guide for Clients](./SETUP_FOR_CLIENTS.md)**

This guide includes:
- Step-by-step installation
- API key setup
- Code examples
- Error handling
- Customization options

### React Components (5 minutes)

```bash
npm install @urisocial/react @urisocial/sdk
```

```tsx
import { URISocialProvider, ContentGenerator } from '@urisocial/react';

function App() {
  return (
    <URISocialProvider apiKey="your-api-key">
      <ContentGenerator
        platforms={['instagram', 'facebook']}
        onContentGenerated={(content) => console.log(content)}
      />
    </URISocialProvider>
  );
}
```

### TypeScript SDK (3 minutes)

```bash
npm install @urisocial/sdk
```

```typescript
import { URISocial } from '@urisocial/sdk';

const client = new URISocial({ apiKey: 'your-api-key' });

const content = await client.content.generate({
  seedContent: 'Launch our new perfume line',
  platforms: ['instagram', 'facebook'],
  referenceImage: 'https://example.com/product.jpg'
});
```

### Python SDK (3 minutes)

```bash
pip install urisocial
```

```python
from urisocial import URISocial

client = URISocial(api_key='your-api-key')

content = client.content.generate(
    seed_content='Launch our new perfume line',
    platforms=['instagram', 'facebook'],
    reference_image='https://example.com/product.jpg'
)
```

---

## 🔑 Get Your API Key

1. Sign up at [urisocial.com](https://urisocial.com/signup)
2. Go to [Dashboard → API Keys](https://urisocial.com/dashboard/api-keys)
3. Create a new API key
4. Copy and use in your code

---

## 📖 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get running in 5 minutes
- **[Complete Client Setup](./SETUP_FOR_CLIENTS.md)** - Full integration guide
- **[API Coverage Analysis](./SDK_API_COVERAGE_ANALYSIS.md)** - What APIs are available
- **[Frontend Architecture](./FRONTEND_ARCHITECTURE.md)** - Component design
- **[Getting Started](./docs/getting-started.md)** - Detailed walkthrough

---

## 💡 Examples

### React Example App

```bash
cd examples/react-example
cp .env.example .env
# Add your API key to .env
npm install
npm run dev
```

Open http://localhost:3000

### TypeScript Example

```bash
cd examples/typescript
cp .env.example .env
# Add your API key to .env
npm install
npm start
```

### Python Example

```bash
cd examples/python
cp .env.example .env
# Add your API key to .env
pip install urisocial
python basic_usage.py
```

---

## 🎨 React Components

### Available Components

| Component | Description |
|-----------|-------------|
| `<ContentGenerator />` | Full content generation form with image upload |
| `<DraftManager />` | List and manage drafts with pagination |
| `<ConnectionManager />` | Connect and manage social media accounts |
| `<CreditBadge />` | Display credit balance and subscription tier |

### Available Hooks

| Hook | Description |
|------|-------------|
| `useContentGeneration()` | Generate content programmatically |
| `useDrafts()` | Manage drafts with pagination |
| `useConnections()` | Handle social connections |
| `useBilling()` | Monitor credits and usage |

See [React SDK Documentation](./packages/react/README.md) for details.

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Python 3.8+ (for Python SDK)
- npm or yarn

### Install Dependencies

```bash
# Install root dependencies
npm install

# Build all packages
npm run build
```

### Run Example App

```bash
cd examples/react-example
npm install
npm run dev
```

---

## 📁 Project Structure

```
urisocial-sdk/
├── packages/
│   ├── typescript-sdk/    # @urisocial/sdk
│   ├── python-sdk/        # urisocial (PyPI)
│   └── react/             # @urisocial/react
├── examples/
│   ├── typescript/        # TypeScript usage examples
│   ├── python/            # Python usage examples
│   └── react-example/     # Full React demo app
├── docs/                  # Documentation
├── QUICKSTART.md          # 5-minute quick start
├── SETUP_FOR_CLIENTS.md   # Complete client setup guide
└── README.md              # This file
```

---

## 🔐 Security

### API Key Best Practices

- ✅ **DO**: Store API keys in environment variables
- ✅ **DO**: Use `.gitignore` to exclude `.env` files
- ✅ **DO**: Rotate keys regularly
- ❌ **DON'T**: Commit API keys to version control
- ❌ **DON'T**: Expose keys in client-side code
- ❌ **DON'T**: Share keys in public repositories

### Rate Limiting

- Content Generation: 100 requests/hour
- Image Generation: 50 requests/hour
- Draft Operations: 1000 requests/hour

Upgrade your plan for higher limits.

---

## 🐛 Troubleshooting

### Common Issues

**"Invalid API Key"**
- Check your API key is active in the dashboard
- Ensure it starts with `uri_`

**"Insufficient Credits"**
- Purchase credits at https://urisocial.com/pricing
- Check balance with `client.billing.getInfo()`

**"Rate Limit Exceeded"**
- Wait a few minutes before retrying
- Upgrade plan for higher limits

**"CORS Error"**
- Use backend proxy for API calls
- Enable CORS in API settings

See [Setup Guide](./SETUP_FOR_CLIENTS.md#common-issues--solutions) for more solutions.

---

## 📊 Supported Platforms

- ✅ Instagram
- ✅ Facebook
- ✅ Twitter / X
- ✅ LinkedIn
- ✅ TikTok

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 💬 Support

- 📧 **Email**: support@urisocial.com
- 💬 **Discord**: [Join community](https://discord.gg/urisocial)
- 📖 **Docs**: [docs.urisocial.com](https://docs.urisocial.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/uri-social/urisocial-sdk/issues)

---

**Built with ❤️ by URI Social**

[Website](https://urisocial.com) • [Dashboard](https://urisocial.com/dashboard) • [API Docs](https://docs.urisocial.com) • [Pricing](https://urisocial.com/pricing)
# uri-socail-sdk
