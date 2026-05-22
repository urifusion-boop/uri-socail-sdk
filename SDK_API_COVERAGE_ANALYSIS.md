# URI Social SDK API Coverage Analysis

## Executive Summary

**Backend APIs Available**: 120+ endpoints
**SDK APIs Exposed**: 27 endpoints (22.5% coverage)
**Recommendation**: Phase 1 implementation - Core features only

---

## What APIs Are Exposed in the SDK?

### ✅ Currently Exposed (27 endpoints)

#### 1. **Content Generation** (2 endpoints)
- `POST /api/v1/content/generate` - Generate multi-platform content
- `GET /api/v1/content/{content_id}` - Get content by ID

**Why Exposed**: Core product feature - primary SDK use case

#### 2. **Draft Management** (5 endpoints)
- `GET /api/v1/drafts` - List all drafts (paginated)
- `GET /api/v1/drafts/{draft_id}` - Get single draft
- `PATCH /api/v1/drafts/{draft_id}` - Update draft
- `DELETE /api/v1/drafts/{draft_id}` - Delete draft
- `POST /api/v1/drafts` - Create manual draft

**Why Exposed**: Essential for content workflow before publishing

#### 3. **Image Generation** (4 endpoints)
- `POST /api/v1/images/generate` - Generate AI image
- `POST /api/v1/images/edit` - Edit existing image
- `POST /api/v1/images/remove-background` - Remove product background
- `POST /api/v1/images/analyze-product` - Forensic product analysis

**Why Exposed**: Critical for product preservation pipeline & immersive compositions

#### 4. **Social Connections** (4 endpoints)
- `GET /api/v1/connections` - List connected platforms
- `GET /api/v1/connections/{platform}/connect` - Get OAuth URL
- `DELETE /api/v1/connections/{platform}` - Disconnect platform
- `GET /api/v1/connections/{platform}/status` - Check connection status

**Why Exposed**: Required for publishing capabilities

#### 5. **Publishing** (4 endpoints)
- `POST /api/v1/publish` - Publish immediately
- `POST /api/v1/publish/schedule` - Schedule for later
- `GET /api/v1/publish/scheduled` - List scheduled posts
- `DELETE /api/v1/publish/scheduled/{scheduled_id}` - Cancel scheduled

**Why Exposed**: Core publishing workflow

#### 6. **Billing & Credits** (3 endpoints)
- `GET /api/v1/billing/info` - Get credits & subscription info
- `GET /api/v1/billing/usage` - Get usage history
- `POST /api/v1/billing/purchase-credits` - Purchase credits

**Why Exposed**: Essential for usage tracking & credit management

#### 7. **Basic Operations** (5 endpoints)
- `GET /api/v1/content` - List content (paginated)
- `DELETE /api/v1/content/{content_id}` - Delete content

**Why Exposed**: CRUD completion

---

## ❌ NOT Exposed in SDK (93+ endpoints)

### Authentication & User Management (3 endpoints)
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/google`

**Why NOT Exposed**:
- Designed for first-party web app only
- Third-party integrators use API keys, not user auth
- Security: Prevent SDK users from creating URI Social accounts programmatically

---

### Advanced Billing (8 endpoints)
- `POST /billing/initialize-payment`
- `POST /billing/verify-payment`
- `POST /billing/subscription/cancel`
- `GET /billing/subscription/tiers`
- Trial management endpoints (3)
- Payment webhook

**Why NOT Exposed**:
- Payment flow requires web UI (SQUAD checkout)
- Subscription management should be done in URI Social dashboard
- Trial system is first-party only

---

### Notifications (6 endpoints)
- Get notifications
- Mark as read/archive
- Update preferences

**Why NOT Exposed**:
- User-facing feature, not programmatic
- SDK users don't need notification UI
- Better handled in first-party dashboard

---

### Bug Reports (2 endpoints)
- Submit bug report
- List bug reports

**Why NOT Exposed**:
- Support feature, not API capability
- SDK users should report via GitHub issues

---

### Social Platform OAuth Callbacks (7 endpoints)
- Outstand OAuth callback
- Instagram callback
- X callback
- LinkedIn callback
- Pending status checks

**Why NOT Exposed**:
- Server-side OAuth flows only
- Callbacks require web redirect handling
- SDK users should use connection management endpoints instead

---

### Onboarding & Brand Setup (6 endpoints)
- `GET /onboarding/status`
- `POST /brand-profile`
- Upload logo/templates
- Analyze voice samples

**Why NOT Exposed**:
- First-time setup wizard feature
- Requires rich UI for brand questionnaire
- SDK assumes brand profile already exists
- Future: Could add "Brand Profile API" resource

---

### Draft Advanced Features (15 endpoints)
- Image streaming (`/image-stream`)
- Image regeneration with feedback
- Image editing/undo
- Carousel slide management (5 endpoints)
- Image sync across drafts

**Why NOT Exposed**:
- Complex UI-driven features
- Require real-time streaming (SSE)
- Better suited for first-party app
- Future: Could expose simplified versions

---

### Approval Workflow (3 endpoints)
- `POST /approve`
- `POST /deny`
- `PUT /refine`

**Why NOT Exposed**:
- Team collaboration feature
- Assumes multi-user workflow
- SDK is typically single-user context
- Future: Could add "Collaboration API" resource

---

### Content Calendar & Planning (10 endpoints)
- Get content calendar
- Generate 7-day plan
- Regenerate specific days
- Create draft from plan
- Performance metrics
- Trending topics

**Why NOT Exposed**:
- Advanced planning feature
- Requires complex UI for calendar visualization
- Future: High priority for SDK v2.0

---

### Analytics & Performance (4 endpoints)
- `GET /analytics`
- `GET /performance`
- `GET /account-metrics`
- Debug endpoints

**Why NOT Exposed**:
- Future Phase 2 feature
- Need to finalize analytics data model
- Complex aggregation logic

---

### Auto-Content Generation (4 endpoints)
- Get/update auto-generate settings
- Connect insights
- Trigger auto-generation

**Why NOT Exposed**:
- Automation feature for first-party app
- Requires cron setup
- Not typical SDK use case

---

### Platform-Specific Requirements (1 endpoint)
- `GET /platform-requirements/{platform}`

**Why NOT Exposed**:
- Should be in SDK documentation
- Static reference data
- Future: Could expose as utility method

---

### Video Generation (9 endpoints)
- Generate storyboard
- Generate video from storyboard
- Job status polling
- Frame generation
- Merge video segments
- Video drafts

**Why NOT Exposed**:
- Beta feature, not stable
- Complex job polling workflow
- High compute cost
- Future: Phase 3 after video API stabilizes

---

### WhatsApp Integration (5 endpoints)
- Webhook
- Connect/disconnect
- Status check
- Daily push (cron)

**Why NOT Exposed**:
- Platform-specific integration
- Requires Twilio setup
- Not relevant for most SDK users
- Future: "Messaging Channels" resource if demand exists

---

### X (Twitter) Integration (5 endpoints)
- OAuth flow
- Connect/disconnect
- Status check
- Publish
- Daily push

**Why NOT Exposed**:
- Already covered by generic `/connections` and `/publish`
- Platform-specific OAuth handled server-side
- SDK users use generic connection flow

---

### LinkedIn Integration (6 endpoints)
- OAuth flow
- Connect/disconnect
- Status check
- Company pages management
- Publish
- Daily push

**Why NOT Exposed**:
- Same as X reasoning
- Company pages require special UI
- Generic connection API sufficient

---

### Scheduled Publishing Cron (1 endpoint)
- `POST /publish-scheduled`

**Why NOT Exposed**:
- Internal cron job
- Requires secret header auth
- Not for external use

---

### Daily Push Cron Endpoints (3 endpoints)
- WhatsApp daily push
- X daily push
- LinkedIn daily push

**Why NOT Exposed**:
- Internal automation
- First-party feature only

---

### Test/Debug Endpoints (4 endpoints)
- `/test`
- Debug Outstand account metrics
- Debug post details

**Why NOT Exposed**:
- Development/debugging only
- Not production features

---

## Why This Approach?

### Phase 1: Core SDK (Current Implementation)
**Goal**: Enable third-party platforms to generate & publish content

**Included APIs**:
- Content generation
- Draft management (basic CRUD)
- Image generation & product preservation
- Connection management
- Publishing & scheduling
- Billing info

**Target Users**:
- E-commerce platforms (Shopify, WooCommerce)
- Marketing tools
- SaaS products wanting content generation

---

### Phase 2: Advanced SDK (Future)
**Potential Additions**:
- Content calendar & planning (10 endpoints)
- Analytics & performance (4 endpoints)
- Advanced draft features (simplified - 5 endpoints)
- Platform requirements (1 endpoint)

**Target Users**:
- Marketing agencies
- Social media management tools
- Content planning platforms

---

### Phase 3: Enterprise SDK (Future)
**Potential Additions**:
- Video generation (9 endpoints)
- Collaboration/approval workflow (3 endpoints)
- Brand profile management (6 endpoints)
- Auto-content automation (4 endpoints)

**Target Users**:
- Large enterprises
- Agency white-label solutions
- Video marketing platforms

---

## Authentication Strategy

### SDK Uses API Key Authentication
```typescript
const client = new URISocial({ apiKey: 'uri_sk_...' });
```

**Why API Keys**:
- Simple for developers
- Scoped permissions
- Rate limiting per client
- Revocable without affecting user accounts

### Backend Uses JWT for User Auth
- First-party web app uses JWT tokens
- OAuth flows managed server-side
- User sessions & cookies

**Separation Benefits**:
- SDK users can't hijack user accounts
- Clear separation of first-party vs third-party
- Billing tied to API key, not user

---

## API Endpoint Naming

### SDK Uses `/api/v1/*` Prefix
```
/api/v1/content/generate
/api/v1/drafts/{id}
/api/v1/images/generate
```

### Backend Uses Domain Prefixes
```
/social-media/generate-content
/social-media/drafts/{id}
/social-media/regenerate-image
```

**Why Different**:
- Backend routes grouped by feature domain
- SDK routes RESTful & resource-oriented
- SDK abstracts backend complexity
- Future: Backend might add `/api/v1` routes specifically for SDK

---

## Coverage by Feature Category

| Category | Backend Endpoints | SDK Endpoints | Coverage |
|----------|------------------|---------------|----------|
| Content Generation | 3 | 2 | 67% |
| Draft Management | 15 | 5 | 33% |
| Image Operations | 9 | 4 | 44% |
| Connections | 15 | 4 | 27% |
| Publishing | 7 | 4 | 57% |
| Billing | 14 | 3 | 21% |
| Analytics | 4 | 0 | 0% |
| Calendar | 10 | 0 | 0% |
| Video | 9 | 0 | 0% |
| Auth | 3 | 0 | 0% |
| Notifications | 6 | 0 | 0% |
| Brand Profile | 6 | 0 | 0% |
| Approval Workflow | 3 | 0 | 0% |
| Auto-Generate | 4 | 0 | 0% |
| Platform-Specific | 16 | 0 | 0% |
| Webhooks/Cron | 8 | 0 | 0% |
| **TOTAL** | **120+** | **27** | **22.5%** |

---

## Recommendations

### Immediate (Phase 1 - Current)
✅ **DONE**: Core 27 endpoints exposed
- [x] Content generation
- [x] Draft CRUD
- [x] Image generation
- [x] Basic connections
- [x] Publishing
- [x] Billing info

### Short Term (Phase 1.5 - Next 2 weeks)
- [ ] Add platform requirements endpoint
- [ ] Add content listing with filters
- [ ] Add draft update with platform-specific edits
- [ ] Improve error messages & validation

### Medium Term (Phase 2 - Next 2 months)
- [ ] Content calendar API (10 endpoints)
- [ ] Analytics API (4 endpoints)
- [ ] Advanced image editing (3 endpoints)
- [ ] Webhook subscriptions (for real-time updates)

### Long Term (Phase 3 - 6+ months)
- [ ] Video generation (stable API first)
- [ ] Collaboration/approval workflow
- [ ] Brand profile management
- [ ] Auto-content automation

---

## Security Considerations

### ✅ Properly Excluded
- User authentication (prevents account hijacking)
- Payment processing (PCI compliance)
- OAuth callbacks (server-side only)
- Cron jobs (internal automation)
- Webhooks (signature validation required)

### ⚠️ Rate Limiting Required
- All SDK endpoints need rate limiting per API key
- Prevent abuse of image generation (expensive)
- Credit system enforces usage limits

### 🔐 API Key Scopes (Future)
- `content:read` - Read content & drafts
- `content:write` - Generate & modify content
- `images:generate` - Image generation
- `publish:write` - Publishing capabilities
- `billing:read` - View credits & usage

---

## Conclusion

The SDK exposes **27 out of 120+ endpoints (22.5%)** - this is **intentional and correct**.

**Why selective exposure**:
1. **Focus**: SDK targets programmatic content generation use case
2. **Security**: Excludes user auth, payment flows, webhooks
3. **Simplicity**: Avoids complex UI-driven features
4. **Stability**: Only exposes production-ready APIs
5. **Maintenance**: Smaller API surface = easier to maintain

**Next steps**:
1. Connect SDK to actual backend endpoints (currently using placeholder `/api/v1/*` paths)
2. Implement API key authentication system in backend
3. Add rate limiting & credit deduction for SDK requests
4. Create API key dashboard for users
5. Add Phase 1.5 endpoints based on beta feedback
