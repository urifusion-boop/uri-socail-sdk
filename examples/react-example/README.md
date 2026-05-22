# React SDK Example

Complete example application demonstrating all URI Social React components.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
VITE_URISOCIAL_API_KEY=your-api-key
```

3. Run development server:
```bash
npm run dev
```

## Features Demonstrated

- **ContentGenerator**: Full content generation form
- **DraftManager**: List and manage drafts
- **ConnectionManager**: Social media connections
- **CreditBadge**: Display credit balance
- **Custom theming**: URI Social brand colors
- **Error handling**: User-friendly error messages
- **Tab navigation**: Multi-page application layout

## File Structure

```
react-example/
├── App.tsx           # Main application with tabs
├── package.json      # Dependencies
├── vite.config.ts    # Vite configuration
└── README.md         # This file
```

## Customization

### Theme
Edit the `theme` object in `App.tsx`:
```tsx
const theme = {
  primaryColor: '#CD1B78',
  borderRadius: '8px',
  fontFamily: 'Inter, sans-serif',
};
```

### Components
Import and use individual components:
```tsx
import { ContentGenerator, DraftManager } from '@urisocial/react';

<ContentGenerator
  platforms={['instagram']}
  onContentGenerated={(content) => console.log(content)}
/>
```

## Next Steps

- Customize styling to match your brand
- Add authentication flow
- Integrate with your backend
- Deploy to production
