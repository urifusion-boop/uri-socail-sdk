import { HTTPClient } from './client/http';
import { ContentResource } from './resources/content';
import { DraftsResource } from './resources/drafts';
import { ImagesResource } from './resources/images';
import { ConnectionsResource } from './resources/connections';
import { PublishingResource } from './resources/publishing';
import { BillingResource } from './resources/billing';
import { WorkspacesResource } from './resources/workspaces';
import { ClientsResource } from './resources/clients';
import { BrandProfileResource } from './resources/brand-profile';
import { AnalyticsResource } from './resources/analytics';
import { CalendarResource } from './resources/calendar';
import { VideoResource } from './resources/video';
import { BlogResource } from './resources/blog';
import { AutoGenerateResource } from './resources/auto-generate';
import { UtilsResource } from './resources/utils';
import { AgencyResource } from './resources/agency';
import { CustomGuidesResource } from './resources/custom-guides';
import { CanvasEditorResource } from './resources/canvas-editor';
import { URISocialConfig } from './types';

export * from './types';
export * from './types/errors';
export type { UsageInfo, UsageHistory } from './resources/billing';

/**
 * URI Social SDK Client
 *
 * @example
 * ```typescript
 * import { URISocial } from '@urisocial/sdk';
 *
 * // Simple usage (single-tenant)
 * const client = new URISocial({ apiKey: 'your-api-key' });
 *
 * const content = await client.content.generate({
 *   seedContent: 'Launch our new perfume line',
 *   platforms: ['instagram', 'facebook'],
 *   referenceImage: 'https://example.com/product.jpg'
 * });
 *
 * // Multi-tenant SaaS usage with end-users
 * const client = new URISocial({
 *   apiKey: 'your-api-key',
 *   endUserId: 'user-123'  // Your user's ID from your system
 * });
 *
 * // Each end-user gets isolated brand profiles
 * await client.brandProfile.update({ brandName: 'User's Brand' });
 * await client.content.generate({ ... }); // Uses user-123's profile
 *
 * // Switch end-users dynamically
 * client.setEndUserId('user-456');
 * await client.content.generate({ ... }); // Now uses user-456's profile
 * ```
 */
export class URISocial {
  private http: HTTPClient;

  // Core resources
  public readonly content: ContentResource;
  public readonly drafts: DraftsResource;
  public readonly images: ImagesResource;
  public readonly connections: ConnectionsResource;
  public readonly publishing: PublishingResource;
  public readonly billing: BillingResource;

  // Brand & Profile
  public readonly brandProfile: BrandProfileResource;

  // Analytics & Insights
  public readonly analytics: AnalyticsResource;

  // Content Planning
  public readonly calendar: CalendarResource;

  // Advanced Content Generation
  public readonly video: VideoResource;
  public readonly blog: BlogResource;
  public readonly autoGenerate: AutoGenerateResource;

  // Utilities
  public readonly utils: UtilsResource;

  /**
   * Workspaces resource - Multi-tenant workspace management
   * @since 2.0.0
   */
  public readonly workspaces: WorkspacesResource;

  /**
   * Clients resource - Multi-tenant client/organization management
   * @since 2.0.0
   */
  public readonly clients: ClientsResource;

  /**
   * Agency resource - Multi-brand agency management
   * @since 3.0.0
   */
  public readonly agency: AgencyResource;

  /**
   * Custom Guides resource - Visual guide management
   * @since 3.0.0
   */
  public readonly customGuides: CustomGuidesResource;

  /**
   * Canvas Editor resource - Layered document editing
   * @since 3.0.0
   */
  public readonly canvasEditor: CanvasEditorResource;

  constructor(config: URISocialConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required. Get yours at https://urisocial.com/dashboard/api-keys');
    }

    this.http = new HTTPClient(config);

    // Initialize core resource modules
    this.content = new ContentResource(this.http);
    this.drafts = new DraftsResource(this.http);
    this.images = new ImagesResource(this.http);
    this.connections = new ConnectionsResource(this.http);
    this.publishing = new PublishingResource(this.http);
    this.billing = new BillingResource(this.http);

    // Initialize brand & profile resources
    this.brandProfile = new BrandProfileResource(this.http);

    // Initialize analytics resources
    this.analytics = new AnalyticsResource(this.http);

    // Initialize content planning resources
    this.calendar = new CalendarResource(this.http);

    // Initialize advanced content generation resources
    this.video = new VideoResource(this.http);
    this.blog = new BlogResource(this.http);
    this.autoGenerate = new AutoGenerateResource(this.http);

    // Initialize utilities
    this.utils = new UtilsResource(this.http);

    // Initialize multi-tenant resources (v2.0.0)
    this.workspaces = new WorkspacesResource(this.http);
    this.clients = new ClientsResource(this.http);

    // Initialize agency & advanced resources (v3.0.0)
    this.agency = new AgencyResource(this.http);
    this.customGuides = new CustomGuidesResource(this.http);
    this.canvasEditor = new CanvasEditorResource(this.http);
  }

  /**
   * Update API key after initialization
   */
  setApiKey(apiKey: string): void {
    this.http.setApiKey(apiKey);
  }

  /**
   * Set default workspace ID for all operations
   *
   * @param workspaceId - Workspace ID or undefined to use API key default
   * @since 2.0.0 - Multi-tenant support
   *
   * @example
   * ```typescript
   * client.setWorkspaceId('wsp_abc123');
   * // All operations now use wsp_abc123
   * ```
   */
  setWorkspaceId(workspaceId: string | undefined): void {
    this.http.setWorkspaceId(workspaceId);
  }

  /**
   * Get current workspace ID
   *
   * @returns Current workspace ID or undefined
   * @since 2.0.0 - Multi-tenant support
   */
  getWorkspaceId(): string | undefined {
    return this.http.getWorkspaceId();
  }

  /**
   * Set end-user ID for multi-tenant SaaS applications
   *
   * Use this to isolate brand profiles per end-user when building
   * a SaaS platform on top of URISocial.
   *
   * @param endUserId - Your user's ID from your system, or undefined to disable
   * @since 3.0.0 - Multi-tenant end-user support
   *
   * @example
   * ```typescript
   * // Set end-user context
   * client.setEndUserId('user-123');
   * await client.brandProfile.update({ brandName: 'User 123 Brand' });
   *
   * // Switch to another end-user
   * client.setEndUserId('user-456');
   * await client.content.generate({ ... }); // Uses user-456's profile
   * ```
   */
  setEndUserId(endUserId: string | undefined): void {
    this.http.setEndUserId(endUserId);
  }

  /**
   * Get current end-user ID
   *
   * @returns Current end-user ID or undefined
   * @since 3.0.0 - Multi-tenant end-user support
   */
  getEndUserId(): string | undefined {
    return this.http.getEndUserId();
  }
}

export default URISocial;
