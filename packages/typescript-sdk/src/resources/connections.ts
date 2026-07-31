import { HTTPClient } from '../client/http';
import { Platform } from '../types';

export interface ConnectionInitiateRequest {
  platforms: Platform[];
  source?: 'onboarding' | 'settings';
}

export interface ConnectionInitiateResult {
  user_id: string;
  /** Platform -> OAuth URL to send the user's browser to. */
  auth_urls: Record<string, string>;
  platforms: string[];
  unsupported_platforms: string[];
  failed_platforms: Array<{ platform: string; error: string }>;
  instructions: string;
}

export interface FinalizeConnectionRequest {
  session_token: string;
  selected_page_ids: string[];
}

export interface PendingConnection {
  session_token: string;
  network: string;
  expires_at: string;
  available_pages: any[];
}

export interface FinalizeConnectionResult {
  user_id: string;
  accounts_connected: Array<{
    outstand_account_id: string;
    platform: string;
    username?: string;
    account_name?: string;
  }>;
  total: number;
  connected_at: string;
}

export interface ConnectedAccount {
  outstand_account_id: string;
  platform: string;
  username?: string;
  account_name?: string;
  profile_picture_url?: string;
  account_type?: string;
  is_active: boolean;
  connected_at?: string;
}

export interface ListConnectionsResult {
  user_id: string;
  connected_platforms: ConnectedAccount[];
  connections: Record<string, ConnectedAccount[]>;
  total_connections: number;
}

export interface DisconnectResult {
  outstand_account_id: string;
  platform?: string;
  username?: string;
  status: 'disconnected';
  disconnected_at: string;
}

export class ConnectionsResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get all connected social media accounts for the current user/end-user.
   */
  async list(): Promise<ListConnectionsResult> {
    const response = await this.http.get<{ responseData: ListConnectionsResult }>(
      '/social-media/connections'
    );
    return response.responseData;
  }

  /**
   * Initiate connection process for one or more platforms via Outstand.
   * Open response.auth_urls[platform] in the browser for the user to
   * authorise — after that, Outstand redirects to the callback URL, then
   * call getPending() and finalize() to complete the connection.
   *
   * A platform can fail independently of the others — check
   * unsupported_platforms/failed_platforms if a requested platform's URL
   * is missing from auth_urls.
   */
  async initiate(request: ConnectionInitiateRequest): Promise<ConnectionInitiateResult> {
    const response = await this.http.post<{ responseData: ConnectionInitiateResult }>(
      '/social-media/connect/initiate',
      request
    );
    return response.responseData;
  }

  /**
   * After the user completes the Outstand OAuth redirect, retrieve the
   * pages/accounts available for them to choose from before finalizing.
   * @param sessionToken - Extracted from the auth_url returned by initiate()
   */
  async getPending(sessionToken: string): Promise<PendingConnection> {
    const response = await this.http.get<{ responseData: PendingConnection }>(
      `/social-media/connect/pending/${sessionToken}`
    );
    return response.responseData;
  }

  /**
   * Finalize connection after OAuth callback — selects which page(s)/account(s)
   * to keep connected.
   */
  async finalize(request: FinalizeConnectionRequest): Promise<FinalizeConnectionResult> {
    const response = await this.http.post<{ responseData: FinalizeConnectionResult }>(
      '/social-media/connect/finalize',
      request
    );
    return response.responseData;
  }

  /**
   * @deprecated Not functional — the backend returns a placeholder, non-working
   * OAuth URL for this legacy endpoint. Use initiate() instead, which drives
   * the real, working OAuth flow.
   */
  async getConnectUrl(_platform: Platform, _redirectUrl?: string): Promise<{ auth_url: string }> {
    throw new Error(
      'connections.getConnectUrl() is not functional — use connections.initiate() instead.'
    );
  }

  /**
   * Disconnect a platform account (Outstand-managed connections).
   * @param accountId - Outstand account ID to disconnect (from list()'s
   * connected_platforms[].outstand_account_id)
   */
  async disconnect(accountId: string): Promise<DisconnectResult> {
    const response = await this.http.delete<{ responseData: DisconnectResult }>(
      `/social-media/connections/account/${accountId}`
    );
    return response.responseData;
  }

  /**
   * Disconnect Instagram Direct (Meta Business) connection.
   * @param igUserId - Instagram User ID
   */
  async disconnectInstagram(igUserId: string): Promise<{ status: boolean; responseMessage: string }> {
    return this.http.delete<{ status: boolean; responseMessage: string }>(
      `/social-media/connections/instagram-direct/${igUserId}`
    );
  }

  /**
   * Disconnect Facebook Direct (Meta Business) connection.
   */
  async disconnectFacebook(): Promise<{ status: boolean; responseMessage: string }> {
    return this.http.delete<{ status: boolean; responseMessage: string }>(
      '/social-media/connections/facebook-direct'
    );
  }

  /**
   * @deprecated Not functional — this legacy endpoint does not exist on the
   * backend. Use list() instead.
   */
  async getStatus(_platform: Platform): Promise<ConnectedAccount> {
    throw new Error('connections.getStatus() is not functional — use connections.list() instead.');
  }

  // ============================================================================
  // Direct Platform Connections (Facebook & Instagram via Meta Business)
  //
  // KNOWN BROKEN — do not use yet. The backend's initiate endpoints return an
  // HTTP redirect (a 302 to Facebook's OAuth page) meant for direct browser
  // navigation, not a fetch()/XHR call — calling these methods gets you
  // Facebook's login page HTML, not a URL string. The finalize endpoints
  // additionally expect a completely different request shape than what's
  // implemented here (fb_page_id/ig_user_id selected from the callback's
  // available pages, not an OAuth code) — the whole page-selection step this
  // flow depends on isn't wired up on the SDK side at all yet. Use the
  // generic initiate()/getPending()/finalize() flow above instead, which is
  // real and working.
  // ============================================================================

  /** @deprecated See the "KNOWN BROKEN" note above — not functional yet. */
  async initiateFacebookDirect(_redirectUri: string): Promise<{ auth_url: string }> {
    throw new Error(
      'connections.initiateFacebookDirect() is not functional yet — use connections.initiate() instead.'
    );
  }

  /** @deprecated See the "KNOWN BROKEN" note above — not functional yet. */
  async finalizeFacebookDirect(_code: string, _redirectUri: string): Promise<{ fb_page_id: string }> {
    throw new Error(
      'connections.finalizeFacebookDirect() is not functional yet — use connections.finalize() instead.'
    );
  }

  /** @deprecated See the "KNOWN BROKEN" note above — not functional yet. */
  async initiateInstagramDirect(_redirectUri: string): Promise<{ auth_url: string }> {
    throw new Error(
      'connections.initiateInstagramDirect() is not functional yet — use connections.initiate() instead.'
    );
  }

  /** @deprecated See the "KNOWN BROKEN" note above — not functional yet. */
  async finalizeInstagramDirect(_code: string, _redirectUri: string): Promise<{ ig_user_id: string }> {
    throw new Error(
      'connections.finalizeInstagramDirect() is not functional yet — use connections.finalize() instead.'
    );
  }
}
