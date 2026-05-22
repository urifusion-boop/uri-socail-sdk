import { HTTPClient } from '../client/http';
import {
  Workspace,
  WorkspaceWithRole,
  WorkspaceMember,
  CreateWorkspaceRequest,
  InviteMemberRequest,
  WorkspaceRole,
  WorkspacePermissions,
  PaginatedResponse,
} from '../types';

/**
 * Workspaces Resource - Multi-tenant workspace management
 *
 * @since 2.0.0 - Multi-tenant support
 *
 * @example
 * ```typescript
 * // List all workspaces
 * const workspaces = await client.workspaces.list();
 *
 * // Get workspace details
 * const workspace = await client.workspaces.get('wsp_abc123');
 *
 * // Create new workspace
 * const newWorkspace = await client.workspaces.create({
 *   name: 'Client A - Campaign',
 *   description: 'Social media campaign for Client A'
 * }, 'cli_xyz789');
 *
 * // Invite member to workspace
 * await client.workspaces.inviteMember('wsp_abc123', {
 *   email: 'team@example.com',
 *   role: 'member'
 * });
 *
 * // Switch active workspace
 * client.workspaces.switch('wsp_abc123');
 * ```
 */
export class WorkspacesResource {
  constructor(private http: HTTPClient) {}

  /**
   * List all workspaces accessible by current user
   *
   * @param clientId - Optional: Filter by client ID
   * @returns List of workspaces with user's role
   */
  async list(clientId?: string): Promise<WorkspaceWithRole[]> {
    const url = clientId
      ? `/social-media/workspaces?client_id=${clientId}`
      : '/social-media/workspaces';

    const response = await this.http.get<{ success: boolean; data: WorkspaceWithRole[] }>(url);
    return response.data;
  }

  /**
   * Get workspace details
   *
   * @param workspaceId - Workspace ID (wsp_xxxxx)
   * @returns Workspace details with user's role
   */
  async get(workspaceId: string): Promise<WorkspaceWithRole> {
    const response = await this.http.get<{ success: boolean; data: WorkspaceWithRole }>(
      `/social-media/workspaces/${workspaceId}`
    );
    return response.data;
  }

  /**
   * Create a new workspace
   *
   * @param data - Workspace creation data
   * @param clientId - Client ID to create workspace under
   * @returns Created workspace
   */
  async create(data: CreateWorkspaceRequest, clientId: string): Promise<Workspace> {
    const response = await this.http.post<{ success: boolean; data: Workspace }>(
      `/social-media/workspaces?client_id=${clientId}`,
      data
    );
    return response.data;
  }

  /**
   * Update workspace details
   *
   * @param workspaceId - Workspace ID
   * @param data - Fields to update
   * @returns Updated workspace
   */
  async update(
    workspaceId: string,
    data: Partial<CreateWorkspaceRequest>
  ): Promise<Workspace> {
    const response = await this.http.patch<{ success: boolean; data: Workspace }>(
      `/social-media/workspaces/${workspaceId}`,
      data
    );
    return response.data;
  }

  /**
   * Archive a workspace
   *
   * @param workspaceId - Workspace ID
   */
  async archive(workspaceId: string): Promise<void> {
    await this.http.post(`/social-media/workspaces/${workspaceId}/archive`);
  }

  /**
   * Unarchive a workspace
   *
   * @param workspaceId - Workspace ID
   */
  async unarchive(workspaceId: string): Promise<void> {
    await this.http.post(`/social-media/workspaces/${workspaceId}/unarchive`);
  }

  /**
   * Delete a workspace
   *
   * @param workspaceId - Workspace ID
   * @param hardDelete - Permanently delete (default: false)
   */
  async delete(workspaceId: string, hardDelete: boolean = false): Promise<void> {
    const url = hardDelete
      ? `/social-media/workspaces/${workspaceId}?hard_delete=true`
      : `/social-media/workspaces/${workspaceId}`;

    await this.http.delete(url);
  }

  /**
   * Get workspace members
   *
   * @param workspaceId - Workspace ID
   * @returns List of workspace members
   */
  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const response = await this.http.get<{ success: boolean; data: WorkspaceMember[] }>(
      `/social-media/workspaces/${workspaceId}/members`
    );
    return response.data;
  }

  /**
   * Get member details
   *
   * @param workspaceId - Workspace ID
   * @param userId - User ID
   * @returns Member details
   */
  async getMember(workspaceId: string, userId: string): Promise<WorkspaceMember> {
    const response = await this.http.get<{ success: boolean; data: WorkspaceMember }>(
      `/social-media/workspaces/${workspaceId}/members/${userId}`
    );
    return response.data;
  }

  /**
   * Invite member to workspace
   *
   * @param workspaceId - Workspace ID
   * @param data - Member invitation data
   * @returns Created member
   */
  async inviteMember(
    workspaceId: string,
    data: InviteMemberRequest
  ): Promise<WorkspaceMember> {
    const response = await this.http.post<{ success: boolean; data: WorkspaceMember }>(
      `/social-media/workspaces/${workspaceId}/members/invite`,
      data
    );
    return response.data;
  }

  /**
   * Update member role
   *
   * @param workspaceId - Workspace ID
   * @param userId - User ID
   * @param role - New role
   * @returns Updated member
   */
  async updateMemberRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole
  ): Promise<WorkspaceMember> {
    const response = await this.http.patch<{ success: boolean; data: WorkspaceMember }>(
      `/social-media/workspaces/${workspaceId}/members/${userId}/role`,
      { new_role: role }
    );
    return response.data;
  }

  /**
   * Update member permissions
   *
   * @param workspaceId - Workspace ID
   * @param userId - User ID
   * @param permissions - Custom permissions
   * @returns Updated member
   */
  async updateMemberPermissions(
    workspaceId: string,
    userId: string,
    permissions: Partial<WorkspacePermissions>
  ): Promise<WorkspaceMember> {
    const response = await this.http.patch<{ success: boolean; data: WorkspaceMember }>(
      `/social-media/workspaces/${workspaceId}/members/${userId}/permissions`,
      { permissions }
    );
    return response.data;
  }

  /**
   * Remove member from workspace
   *
   * @param workspaceId - Workspace ID
   * @param userId - User ID
   */
  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await this.http.delete(`/social-media/workspaces/${workspaceId}/members/${userId}`);
  }

  /**
   * Suspend workspace member
   *
   * @param workspaceId - Workspace ID
   * @param userId - User ID
   * @param reason - Optional reason for suspension
   */
  async suspendMember(
    workspaceId: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    const url = reason
      ? `/social-media/workspaces/${workspaceId}/members/${userId}/suspend?reason=${encodeURIComponent(reason)}`
      : `/social-media/workspaces/${workspaceId}/members/${userId}/suspend`;

    await this.http.post(url);
  }

  /**
   * Reactivate suspended member
   *
   * @param workspaceId - Workspace ID
   * @param userId - User ID
   */
  async reactivateMember(workspaceId: string, userId: string): Promise<void> {
    await this.http.post(
      `/social-media/workspaces/${workspaceId}/members/${userId}/reactivate`
    );
  }

  /**
   * Transfer workspace ownership
   *
   * @param workspaceId - Workspace ID
   * @param newOwnerUserId - User ID of new owner
   */
  async transferOwnership(workspaceId: string, newOwnerUserId: string): Promise<void> {
    await this.http.post(
      `/social-media/workspaces/${workspaceId}/members/${newOwnerUserId}/transfer-ownership`
    );
  }

  /**
   * Get workspace usage statistics
   *
   * @param workspaceId - Workspace ID
   * @returns Usage statistics
   */
  async getUsage(workspaceId: string): Promise<any> {
    const response = await this.http.get<{ success: boolean; data: any }>(
      `/social-media/workspaces/${workspaceId}/usage`
    );
    return response.data;
  }

  /**
   * Switch active workspace for SDK operations
   *
   * This changes the default workspace context for all subsequent operations
   *
   * @param workspaceId - Workspace ID to switch to (or undefined for no default)
   *
   * @example
   * ```typescript
   * // Switch to different workspace
   * client.workspaces.switch('wsp_abc123');
   *
   * // Now all operations use this workspace
   * await client.content.generate({ ... }); // Uses wsp_abc123
   *
   * // Clear workspace context (use API key default)
   * client.workspaces.switch(undefined);
   * ```
   */
  switch(workspaceId: string | undefined): void {
    this.http.setWorkspaceId(workspaceId);
  }

  /**
   * Get current active workspace ID
   *
   * @returns Current workspace ID or undefined
   */
  getCurrent(): string | undefined {
    return this.http.getWorkspaceId();
  }
}
