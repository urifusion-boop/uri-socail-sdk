# URI Social SDK - Frontend Architecture

## Overview

The frontend provides drop-in UI components and widgets that developers can embed into their applications without building UI from scratch.

## 3-Layer Frontend Strategy

```
┌─────────────────────────────────────────────────────────┐
│                   Layer 3: Pre-built Apps                │
│  WordPress Plugin | Shopify App | Chrome Extension      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Layer 2: Framework Components               │
│    React Components | Vue Components | Web Components   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Layer 1: Headless TypeScript SDK            │
│                     @urisocial/sdk                       │
└─────────────────────────────────────────────────────────┘
```

---

## Layer 1: Headless SDK (✅ DONE)

**Package**: `@urisocial/sdk`
- Pure TypeScript/JavaScript SDK
- No UI dependencies
- Works in Node.js and browsers
- Handles all API communication

---

## Layer 2: UI Components (TO BUILD)

### Option A: React Components (Priority 1)

**Package**: `@urisocial/react`

**Components to Build**:
1. `<ContentGenerator />` - Full content generation form
2. `<DraftManager />` - Draft list and management
3. `<ImageEditor />` - AI image editing interface
4. `<ConnectionManager />` - Social account connection UI
5. `<PublishingPanel />` - Publishing and scheduling UI
6. `<CreditBadge />` - Display credits remaining

**Example Usage**:
```tsx
import { URISocialProvider, ContentGenerator } from '@urisocial/react';

function App() {
  return (
    <URISocialProvider apiKey="your-api-key">
      <ContentGenerator
        onContentGenerated={(content) => console.log(content)}
        platforms={['instagram', 'facebook']}
        theme="light"
      />
    </URISocialProvider>
  );
}
```

---

### Option B: Vue Components (Priority 2)

**Package**: `@urisocial/vue`

Same components as React, but Vue 3 composition API.

**Example Usage**:
```vue
<template>
  <URISocialProvider :apiKey="apiKey">
    <ContentGenerator
      :platforms="['instagram']"
      @content-generated="handleGenerated"
    />
  </URISocialProvider>
</template>

<script setup>
import { URISocialProvider, ContentGenerator } from '@urisocial/vue';
</script>
```

---

### Option C: Web Components (Priority 3)

**Package**: `@urisocial/web-components`

Framework-agnostic, works everywhere.

**Example Usage**:
```html
<script src="https://cdn.urisocial.com/web-components/latest.js"></script>

<uri-social-generator
  api-key="your-api-key"
  platforms="instagram,facebook"
  theme="light"
></uri-social-generator>

<script>
  document.querySelector('uri-social-generator')
    .addEventListener('content-generated', (e) => {
      console.log(e.detail.content);
    });
</script>
```

---

### Option D: Vanilla JavaScript Widget (Priority 4)

**Package**: `@urisocial/widget`

Simple script tag embed for no-code solutions.

**Example Usage**:
```html
<div id="urisocial-widget"></div>
<script src="https://cdn.urisocial.com/widget.js"></script>
<script>
  URISocial.init({
    apiKey: 'your-api-key',
    container: '#urisocial-widget',
    platforms: ['instagram', 'facebook'],
    theme: 'light'
  });
</script>
```

---

## Layer 3: Pre-built Integrations (TO BUILD)

### WordPress Plugin
- Admin panel with settings
- Gutenberg block for content generator
- Meta box on post editor
- Shortcode support: `[urisocial_generator]`

### Shopify App
- Product page integration
- Bulk product content generation
- Embedded app in Shopify admin

### Chrome Extension
- Generate content from any web page
- Right-click context menu
- Popup interface

---

## Component Features Matrix

| Component | Description | Inputs | Outputs | Complexity |
|-----------|-------------|--------|---------|------------|
| **ContentGenerator** | Full generation form | seedContent, platforms, referenceImage, tone | Generated content object | High |
| **DraftManager** | List/edit/delete drafts | userId (optional) | Draft actions (edit, delete, publish) | Medium |
| **ImageEditor** | Edit AI images | imageUrl, prompt | Edited image URL | High |
| **ConnectionManager** | Connect social accounts | onConnect callback | Connection status | Medium |
| **PublishingPanel** | Publish/schedule UI | draftId, platforms | Publish result | Medium |
| **CreditBadge** | Show remaining credits | - | Credits count | Low |
| **PlatformSelector** | Multi-select platforms | availablePlatforms | Selected platforms array | Low |
| **ImageUpload** | Drag & drop image | accept, maxSize | File/URL | Low |

---

## Technical Stack Recommendations

### React Components (`@urisocial/react`)
```json
{
  "dependencies": {
    "@urisocial/sdk": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "vite": "^5.0.0"
  }
}
```

**Features**:
- TypeScript for type safety
- Tailwind CSS for styling (customizable theme)
- React hooks for state management
- Context API for API key injection

---

### Build System
- **Vite** for fast builds
- **Rollup** for library bundling
- **tsup** for TypeScript compilation
- **Storybook** for component documentation

---

## Styling Strategy

### 1. CSS-in-JS with Theme Support
```tsx
<ContentGenerator
  theme={{
    primaryColor: '#CD1B78',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif'
  }}
/>
```

### 2. CSS Variables (Recommended)
```css
:root {
  --urisocial-primary: #CD1B78;
  --urisocial-border-radius: 8px;
  --urisocial-font-family: Inter, sans-serif;
}
```

### 3. Tailwind Plugin
```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@urisocial/tailwind-plugin')
  ]
}
```

---

## Authentication in Frontend Components

### Option 1: API Key (Simple)
```tsx
<URISocialProvider apiKey="uri_pk_...">
  <ContentGenerator />
</URISocialProvider>
```

**Use Case**: Server-side rendered apps, trusted environments

---

### Option 2: Token Exchange (Secure)
```tsx
// Backend generates temporary token for frontend
const token = await generateClientToken(userId);

// Frontend uses token
<URISocialProvider token={token}>
  <ContentGenerator />
</URISocialProvider>
```

**Use Case**: Public-facing embeds, user-specific content

---

### Option 3: Backend Proxy (Most Secure)
```tsx
// Frontend calls your backend, your backend calls URI Social
<URISocialProvider apiUrl="https://yourapp.com/api/urisocial">
  <ContentGenerator />
</URISocialProvider>
```

**Use Case**: Maximum security, you control rate limiting

---

## Event-Driven Architecture

All components emit events for integration:

```tsx
<ContentGenerator
  onGenerating={(progress) => console.log('Progress:', progress)}
  onContentGenerated={(content) => saveToDatabase(content)}
  onError={(error) => showNotification(error)}
  onCreditsLow={(remaining) => showUpgradePrompt()}
/>
```

---

## Responsive Design

All components must be:
- **Mobile-first**: Work on phones, tablets, desktops
- **Responsive breakpoints**: sm, md, lg, xl
- **Touch-friendly**: Large tap targets (44px minimum)
- **Accessible**: WCAG 2.1 AA compliance

---

## Internationalization (i18n)

```tsx
<URISocialProvider
  apiKey="..."
  locale="en"
  translations={{
    'generate.button': 'Generate Content',
    'credits.remaining': 'Credits: {count}'
  }}
>
  <ContentGenerator />
</URISocialProvider>
```

Default languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)

---

## Component Composition

### Simple (Batteries Included)
```tsx
// One component does everything
<ContentGenerator apiKey="..." />
```

### Advanced (Composable)
```tsx
// Mix and match components
<URISocialProvider apiKey="...">
  <PlatformSelector value={platforms} onChange={setPlatforms} />
  <ImageUpload onUpload={setImage} />
  <ContentForm
    platforms={platforms}
    referenceImage={image}
    onGenerate={handleGenerate}
  />
  <DraftList userId={userId} />
</URISocialProvider>
```

---

## Bundle Size Targets

| Package | Minified | Gzipped | Notes |
|---------|----------|---------|-------|
| `@urisocial/sdk` | 15kb | 5kb | Core SDK only |
| `@urisocial/react` | 80kb | 25kb | All React components |
| `@urisocial/vue` | 75kb | 23kb | All Vue components |
| `@urisocial/web-components` | 120kb | 35kb | Framework-agnostic |
| `@urisocial/widget` | 150kb | 40kb | Includes all dependencies |

**Optimization**:
- Tree-shaking for unused components
- Code splitting for lazy loading
- CDN hosting for caching

---

## Development Workflow

```bash
# Monorepo structure
urisocial-sdk/
├── packages/
│   ├── typescript-sdk/        # ✅ DONE
│   ├── python-sdk/            # ✅ DONE
│   ├── react/                 # TODO
│   ├── vue/                   # TODO
│   ├── web-components/        # TODO
│   └── widget/                # TODO
├── apps/
│   ├── storybook/             # Component showcase
│   ├── docs-site/             # Documentation site
│   └── demo-app/              # Interactive demo
└── examples/
    ├── react-example/
    ├── vue-example/
    ├── nextjs-example/
    └── vanilla-example/
```

---

## Priority Roadmap

### Phase 1: React Components (Weeks 1-4)
**Why First**: Largest ecosystem, highest demand
- [x] Setup monorepo for frontend packages
- [ ] Create `@urisocial/react` package
- [ ] Build `<ContentGenerator />` component
- [ ] Build `<DraftManager />` component
- [ ] Build `<ConnectionManager />` component
- [ ] Setup Storybook for component docs
- [ ] Write unit tests with React Testing Library

### Phase 2: Vanilla Widget (Week 5-6)
**Why Second**: Enables no-code integrations
- [ ] Create `@urisocial/widget` package
- [ ] Build vanilla JS wrapper
- [ ] CDN deployment setup
- [ ] Embed code generator

### Phase 3: Pre-built Apps (Weeks 7-10)
**Why Third**: High-value integrations
- [ ] WordPress plugin MVP
- [ ] Shopify app MVP
- [ ] Chrome extension MVP

### Phase 4: Additional Frameworks (Weeks 11-14)
**Why Last**: Nice-to-have after React proven
- [ ] Vue 3 components
- [ ] Web Components (framework-agnostic)
- [ ] Svelte components (if demand exists)

---

## Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- API mocking
- Error handling

### Integration Tests
- Full user flows
- API communication
- State management
- Event emissions

### Visual Regression
- Chromatic for Storybook
- Screenshot comparison
- Theme variations

### Accessibility Tests
- axe-core for a11y
- Keyboard navigation
- Screen reader compatibility

---

## Documentation Requirements

### For Each Component:
1. **Live demo** in Storybook
2. **API reference** (props, events, types)
3. **Code examples** (basic, advanced, customized)
4. **Styling guide** (CSS variables, theme overrides)
5. **Accessibility notes**
6. **Browser compatibility**

---

## Next Steps

**Immediate**:
1. ✅ Backend SDK complete (TypeScript + Python)
2. Create React component package structure
3. Build first component: `<ContentGenerator />`
4. Setup Storybook for live component preview

**Question for you**:
- Do you want to start with React components first?
- Should we build a simple demo app to showcase the SDK?
- Any specific design system requirements (Material UI, Chakra, custom)?
