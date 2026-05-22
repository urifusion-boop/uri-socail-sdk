# Getting Started with URI Social SDK

## Prerequisites

- **TypeScript/JavaScript**: Node.js 18+ and npm/yarn/pnpm
- **Python**: Python 3.8+ and pip

## Installation

### TypeScript/JavaScript

```bash
npm install @urisocial/sdk
# or
yarn add @urisocial/sdk
# or
pnpm add @urisocial/sdk
```

### Python

```bash
pip install urisocial
```

## Get Your API Key

1. Sign up at [urisocial.com](https://urisocial.com)
2. Navigate to Dashboard → API Keys
3. Create a new API key with appropriate scopes
4. Copy your API key securely

## First Request

### TypeScript

```typescript
import { URISocial } from '@urisocial/sdk';

const client = new URISocial({ apiKey: 'your-api-key' });

const content = await client.content.generate({
  seedContent: 'Launching our new product',
  platforms: ['instagram', 'facebook'],
});

console.log(content.platforms[0].text);
```

### Python

```python
from urisocial import URISocial

client = URISocial(api_key='your-api-key')

content = client.content.generate(
    seed_content='Launching our new product',
    platforms=['instagram', 'facebook']
)

print(content['platforms'][0]['text'])
```

## Environment Variables

Store your API key in environment variables:

```bash
# .env
URISOCIAL_API_KEY=your-api-key
```

**TypeScript:**
```typescript
const client = new URISocial({
  apiKey: process.env.URISOCIAL_API_KEY
});
```

**Python:**
```python
import os
client = URISocial(api_key=os.getenv('URISOCIAL_API_KEY'))
```

## What's Next?

- Read the [API Reference](./api-reference.md)
- Explore [Examples](../examples/)
- Learn about [Content Generation](./content-generation.md)
- Understand [Image Generation](./image-generation.md)
- Set up [Platform Connections](./platform-connections.md)

## Support

- Documentation: [docs.urisocial.com](https://docs.urisocial.com)
- GitHub Issues: [github.com/uri-social/urisocial-sdk/issues](https://github.com/uri-social/urisocial-sdk/issues)
- Email: support@urisocial.com
