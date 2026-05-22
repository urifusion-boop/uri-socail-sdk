import { HTTPClient } from '../client/http';
import { Connection, Platform } from '../types';

export class ConnectionsResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get all connected social media accounts
   */
  async list(): Promise<{ connected_platforms: Connection[] }> {
    return this.http.get<{ connected_platforms: Connection[] }>('/api/v1/connections');
  }

  /**
   * Get OAuth URL to connect a platform
   */
  async getConnectUrl(platform: Platform, redirectUrl?: string): Promise<{ auth_url: string }> {
    const params = redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : '';
    return this.http.get<{ auth_url: string }>(`/api/v1/connections/${platform}/connect${params}`);
  }

  /**
   * Disconnect a platform
   */
  async disconnect(platform: Platform): Promise<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`/api/v1/connections/${platform}`);
  }

  /**
   * Check connection status for a platform
   */
  async getStatus(platform: Platform): Promise<Connection> {
    return this.http.get<Connection>(`/api/v1/connections/${platform}/status`);
  }
}
