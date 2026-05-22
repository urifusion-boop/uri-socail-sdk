/**
 * URI Social SDK Types
 */

export interface URISocialConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  /**
   * Default workspace ID for all operations
   * If not provided, uses the API key's default workspace
   * @since 2.0.0 - Multi-tenant support
   */
  workspaceId?: string;
}

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';

export interface ContentGenerationRequest {
  seedContent: string;
  platforms: Platform[];
  referenceImage?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'playful';
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  /**
   * Override default workspace for this request
   * @since 2.0.0 - Multi-tenant support
   */
  workspaceId?: string;
}

export interface PlatformContent {
  platform: Platform;
  text: string;
  hashtags: string[];
  character_count: number;
}

export interface GeneratedContent {
  id: string;
  platforms: PlatformContent[];
  image_url?: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  workspace_id?: string;
}

export interface Draft {
  id: string;
  user_id: string;
  text_content: PlatformContent[];
  image_url?: string;
  reference_image?: string;
  created_at: string;
  updated_at: string;
  workspace_id?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  referenceImage?: string;
  style?: 'immersive' | 'standard' | 'minimalist';
  aspectRatio?: '1:1' | '4:5' | '16:9';
  /**
   * Override default workspace for this request
   * @since 2.0.0 - Multi-tenant support
   */
  workspaceId?: string;
}

export interface ImageGenerationResult {
  image_url: string;
  revised_prompt?: string;
}

export interface Connection {
  platform: Platform;
  account_name: string;
  account_id: string;
  connected_at: string;
  status: 'active' | 'expired' | 'error';
  workspace_id?: string;
}

export interface PublishRequest {
  draftId: string;
  platforms: Platform[];
  scheduleTime?: string;
  /**
   * Override default workspace for this request
   * @since 2.0.0 - Multi-tenant support
   */
  workspaceId?: string;
}

export interface PublishResult {
  platform: Platform;
  status: 'success' | 'failed';
  post_id?: string;
  error?: string;
}

export interface BillingInfo {
  credits_remaining: number;
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise';
  billing_cycle_end: string;
}

export interface APIError {
  error: string;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// ============================================================================
// Multi-Tenant Types (v2.0.0)
// ============================================================================

export interface Client {
  id: string;
  client_id: string;
  name: string;
  slug: string;
  description?: string;
  owner_user_id: string;
  subscription: ClientSubscription;
  usage_stats: ClientUsageStats;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface ClientSubscription {
  tier: 'starter' | 'professional' | 'enterprise';
  total_credits: number;
  used_credits: number;
  max_workspaces: number;
}

export interface ClientUsageStats {
  total_content_generated: number;
  total_images_generated: number;
  total_posts_published: number;
  content_generated_this_month: number;
  images_generated_this_month: number;
  posts_published_this_month: number;
}

export interface Workspace {
  id: string;
  workspace_id: string;
  client_id: string;
  name: string;
  slug: string;
  description?: string;
  avatar_url?: string;
  created_by_user_id: string;
  settings: WorkspaceSettings;
  usage_stats: WorkspaceUsageStats;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface WorkspaceSettings {
  timezone: string;
  default_auto_publish: boolean;
  require_approval: boolean;
  allowed_platforms: Platform[];
}

export interface WorkspaceUsageStats {
  total_content_generated: number;
  total_images_generated: number;
  total_posts_published: number;
  total_drafts_created: number;
  content_generated_this_month: number;
  images_generated_this_month: number;
  posts_published_this_month: number;
  last_activity_at?: string;
}

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  permissions: WorkspacePermissions;
  status: 'active' | 'invited' | 'suspended' | 'removed';
  invited_by_user_id?: string;
  invited_at: string;
  joined_at?: string;
  last_activity_at?: string;
}

export interface WorkspacePermissions {
  can_create_content: boolean;
  can_edit_own_content: boolean;
  can_edit_all_content: boolean;
  can_delete_own_content: boolean;
  can_delete_all_content: boolean;
  can_publish_content: boolean;
  can_schedule_content: boolean;
  can_generate_images: boolean;
  can_manage_connections: boolean;
  can_invite_members: boolean;
  can_manage_members: boolean;
  can_edit_workspace_settings: boolean;
  can_view_analytics: boolean;
  can_export_data: boolean;
  can_manage_billing: boolean;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  settings?: Partial<WorkspaceSettings>;
}

export interface InviteMemberRequest {
  email: string;
  role: WorkspaceRole;
}

export interface WorkspaceWithRole {
  workspace: Workspace;
  role: WorkspaceRole;
  permissions: WorkspacePermissions;
}
