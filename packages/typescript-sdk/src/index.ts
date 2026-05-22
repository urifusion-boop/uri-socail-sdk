import { HTTPClient } from './client/http';
import { ContentResource } from './resources/content';
import { DraftsResource } from './resources/drafts';
import { ImagesResource } from './resources/images';
import { ConnectionsResource } from './resources/connections';
import { PublishingResource } from './resources/publishing';
import { BillingResource } from './resources/billing';
import { WorkspacesResource } from './resources/workspaces';
import { ClientsResource } from './resources/clients';
import { URISocialConfig } from './types';

export * from './types';

/**
 * URI Social SDK Client
 *
 * @example
 * ```typescript
 * import { URISocial } from '@urisocial/sdk';
 *
 * // Simple usage (single-tenant or using API key's default workspace)
 * const client = new URISocial({ apiKey: 'your-api-key' });
 *
 * const content = await client.content.generate({
 *   seedContent: 'Launch our new perfume line',
 *   platforms: ['instagram', 'facebook'],
 *   referenceImage: 'https://example.com/product.jpg'
 * });
 *
 * // Multi-tenant usage with workspace context
 * const client = new URISocial({
 *   apiKey: 'your-api-key',
 *   workspaceId: 'wsp_abc123'  // All operations use this workspace
 * });
 *
 * // Switch workspaces dynamically
 * client.workspaces.switch('wsp_xyz789');
 * await client.content.generate({ ... }); // Uses wsp_xyz789
 * ```
 */
export class URISocial {
  private http: HTTPClient;

  public readonly content: ContentResource;
  public readonly drafts: DraftsResource;
  public readonly images: ImagesResource;
  public readonly connections: ConnectionsResource;
  public readonly publishing: PublishingResource;
  public readonly billing: BillingResource;

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

  constructor(config: URISocialConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required. Get yours at https://urisocial.com/dashboard/api-keys');
    }

    this.http = new HTTPClient(config);

    // Initialize resource modules
    this.content = new ContentResource(this.http);
    this.drafts = new DraftsResource(this.http);
    this.images = new ImagesResource(this.http);
    this.connections = new ConnectionsResource(this.http);
    this.publishing = new PublishingResource(this.http);
    this.billing = new BillingResource(this.http);

    // Initialize multi-tenant resources (v2.0.0)
    this.workspaces = new WorkspacesResource(this.http);
    this.clients = new ClientsResource(this.http);
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
}

export default URISocial;
