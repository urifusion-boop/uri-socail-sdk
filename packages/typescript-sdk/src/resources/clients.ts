import { HTTPClient } from '../client/http';
import { Client } from '../types';

/**
 * Clients Resource - Multi-tenant client/organization management
 *
 * @since 2.0.0 - Multi-tenant support
 *
 * @example
 * ```typescript
 * // List all clients
 * const clients = await client.clients.list();
 *
 * // Get client details
 * const client = await client.clients.get('cli_abc123');
 *
 * // Get usage summary
 * const usage = await client.clients.getUsage('cli_abc123');
 * ```
 */
export class ClientsResource {
  constructor(private http: HTTPClient) {}

  /**
   * List all clients owned by current user
   *
   * @returns List of clients
   */
  async list(): Promise<Client[]> {
    const response = await this.http.get<{ success: boolean; data: Client[] }>(
      '/social-media/clients'
    );
    return response.data;
  }

  /**
   * Get client details
   *
   * @param clientId - Client ID (cli_xxxxx)
   * @returns Client details
   */
  async get(clientId: string): Promise<Client> {
    const response = await this.http.get<{ success: boolean; data: Client }>(
      `/social-media/clients/${clientId}`
    );
    return response.data;
  }

  /**
   * Get client usage summary
   *
   * @param clientId - Client ID
   * @returns Usage summary with credits, workspaces, and statistics
   */
  async getUsage(clientId: string): Promise<any> {
    const response = await this.http.get<{ success: boolean; data: any }>(
      `/social-media/clients/${clientId}/usage`
    );
    return response.data;
  }

  /**
   * Add credits to client
   *
   * Note: This may require special permissions
   *
   * @param clientId - Client ID
   * @param credits - Number of credits to add
   */
  async addCredits(clientId: string, credits: number): Promise<void> {
    await this.http.post(`/social-media/clients/${clientId}/credits/add`, { credits });
  }
}
