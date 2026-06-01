import { HTTPClient } from '../client/http';
import { Connection, Platform } from '../types';

export interface ConnectionInitiateRequest {
  platforms: Platform[];
  source?: 'onboarding' | 'settings';
}

export interface ConnectionInitiateResponse {
  session_token: string;
  auth_urls: Record<string, string>;
  expires_at: string;
}

export interface FinalizeConnectionRequest {
  session_token: string;
  selected_page_ids: string[];
}

export class ConnectionsResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get all connected social media accounts
   */
  async list(): Promise<{ connected_platforms: Connection[] }> {
    return this.http.get<{ connected_platforms: Connection[] }>('/social-media/connections');
  }

  /**
   * Initiate connection process for multiple platforms
   * @param request - Platforms to connect
   * @returns Session token and OAuth URLs
   */
  async initiate(request: ConnectionInitiateRequest): Promise<ConnectionInitiateResponse> {
    return this.http.post<ConnectionInitiateResponse>('/social-media/connect/initiate', request);
  }

  /**
   * Get pending connection status
   * @param sessionToken - Session token from initiate()
   */
  async getPending(sessionToken: string): Promise<{
    platforms: Record<string, { status: string; available_pages?: any[] }>;
  }> {
    return this.http.get(`/social-media/connect/pending/${sessionToken}`);
  }

  /**
   * Finalize connection after OAuth callback
   * @param request - Session token and selected pages
   */
  async finalize(request: FinalizeConnectionRequest): Promise<{
    success: boolean;
    connected_platforms: Connection[];
  }> {
    return this.http.post('/social-media/connect/finalize', request);
  }

  /**
   * Get OAuth URL to connect a platform (legacy method for single platform)
   * @deprecated Use initiate() instead for better multi-platform support
   */
  async getConnectUrl(platform: Platform, redirectUrl?: string): Promise<{ auth_url: string }> {
    const params = redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : '';
    return this.http.get<{ auth_url: string }>(`/api/v1/connections/${platform}/connect${params}`);
  }

  /**
   * Disconnect a platform account
   * @param accountId - Outstand account ID to disconnect
   */
  async disconnect(accountId: string): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `/social-media/connections/account/${accountId}`
    );
  }

  /**
   * Disconnect Instagram Direct (Meta Business) connection
   * @param igUserId - Instagram User ID
   */
  async disconnectInstagram(igUserId: string): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `/social-media/connections/instagram-direct/${igUserId}`
    );
  }

  /**
   * Disconnect Facebook Direct (Meta Business) connection
   */
  async disconnectFacebook(): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>('/social-media/connections/facebook-direct');
  }

  /**
   * Check connection status for a platform (legacy)
   * @deprecated Use list() instead
   */
  async getStatus(platform: Platform): Promise<Connection> {
    return this.http.get<Connection>(`/api/v1/connections/${platform}/status`);
  }

  // ============================================================================
  // Direct Platform Connections (Facebook & Instagram via Meta Business)
  // ============================================================================

  /**
   * Initiate Facebook Direct (Meta Business) OAuth flow
   * @param redirectUri - Your application's callback URL
   */
  async initiateFacebookDirect(redirectUri: string): Promise<{ auth_url: string }> {
    return this.http.get<{ auth_url: string }>(
      `/social-media/connect/facebook-direct/initiate?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  }

  /**
   * Finalize Facebook Direct connection after OAuth callback
   * @param code - OAuth authorization code from callback
   * @param redirectUri - Same redirect URI used in initiate
   */
  async finalizeFacebookDirect(
    code: string,
    redirectUri: string
  ): Promise<{ pages: any[]; session_token: string }> {
    return this.http.post('/social-media/connect/facebook-direct/finalize', {
      code,
      redirect_uri: redirectUri,
    });
  }

  /**
   * Initiate Instagram Direct (Meta Business) OAuth flow
   * @param redirectUri - Your application's callback URL
   */
  async initiateInstagramDirect(redirectUri: string): Promise<{ auth_url: string }> {
    return this.http.get<{ auth_url: string }>(
      `/social-media/connect/instagram-direct/initiate?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  }

  /**
   * Finalize Instagram Direct connection after OAuth callback
   * @param code - OAuth authorization code from callback
   * @param redirectUri - Same redirect URI used in initiate
   */
  async finalizeInstagramDirect(
    code: string,
    redirectUri: string
  ): Promise<{ accounts: any[]; session_token: string }> {
    return this.http.post('/social-media/connect/instagram-direct/finalize', {
      code,
      redirect_uri: redirectUri,
    });
  }
}
