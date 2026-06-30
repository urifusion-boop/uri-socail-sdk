import { HTTPClient } from '../client/http';

// ── Types ──────────────────────────────────────────────────────────────

export interface Agency {
  agency_id: string;
  name: string;
  plan_tier?: string;
  wallet_credits: number;
  per_brand_caps_enabled: boolean;
  max_brands?: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  brand_id: string;
  agency_id?: string;
  name: string;
  industry?: string;
  logo_url?: string;
  monthly_credit_cap?: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgencyMember {
  agency_member_id: string;
  agency_id: string;
  user_id?: string;
  email?: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending' | 'conflicted';
  assigned_brand_ids?: string[];
  created_at: string;
}

export interface RosterCard extends Brand {
  pending_approvals: number;
  scheduled_today: number;
  credits_consumed_this_month: number;
  last_activity?: string;
}

// ── Request Types ──────────────────────────────────────────────────────

export interface CreateAgencyRequest {
  name: string;
  plan_tier?: string;
}

export interface UpdateAgencyRequest {
  name: string;
}

export interface CreateBrandRequest {
  name: string;
  industry?: string;
  logo_url?: string;
  monthly_credit_cap?: number;
}

export interface DuplicateBrandRequest {
  template_brand_id: string;
  name: string;
  industry?: string;
}

export interface UpdateBrandRequest {
  name?: string;
  industry?: string;
  logo_url?: string;
  monthly_credit_cap?: number;
}

export interface InviteMemberRequest {
  email: string;
  role?: 'admin' | 'member';
}

export interface TopUpWalletRequest {
  credits: number;
}

// ── Resource ───────────────────────────────────────────────────────────

export class AgencyResource {
  constructor(private http: HTTPClient) {}

  // ── Agency ──────────────────────────────────────────────────────────

  /**
   * Create a new agency (caller becomes admin)
   */
  async create(request: CreateAgencyRequest): Promise<{ agency: Agency }> {
    return this.http.post<{ agency: Agency }>('/agency', request);
  }

  /**
   * Get caller's agency
   */
  async get(): Promise<{ agency: Agency | null }> {
    return this.http.get<{ agency: Agency | null }>('/agency');
  }

  /**
   * Update agency name (admin only)
   */
  async update(request: UpdateAgencyRequest): Promise<{ agency: Agency }> {
    return this.http.patch<{ agency: Agency }>('/agency', request);
  }

  /**
   * Upgrade solo SME to agency, bringing existing brand in
   */
  async upgradeSoloToAgency(request: CreateAgencyRequest): Promise<{ agency: Agency & { migrated_brand_id: string } }> {
    return this.http.post<{ agency: Agency & { migrated_brand_id: string } }>('/agency/upgrade', request);
  }

  /**
   * Toggle per-brand credit caps (admin only)
   */
  async updateSettings(perBrandCapsEnabled: boolean): Promise<{ agency: { per_brand_caps_enabled: boolean } }> {
    return this.http.patch<{ agency: { per_brand_caps_enabled: boolean } }>(
      '/agency/settings',
      null,
      { params: { per_brand_caps_enabled: perBrandCapsEnabled } }
    );
  }

  // ── Brands ──────────────────────────────────────────────────────────

  /**
   * List all brands accessible to caller (brand-switcher list)
   */
  async listBrands(): Promise<{ brand: Brand[] }> {
    return this.http.get<{ brand: Brand[] }>('/agency/brands');
  }

  /**
   * Add a new brand to agency (admin only)
   */
  async createBrand(request: CreateBrandRequest): Promise<{ brand: Brand }> {
    return this.http.post<{ brand: Brand }>('/agency/brands', request);
  }

  /**
   * Duplicate brand from existing template (admin only)
   */
  async duplicateBrand(request: DuplicateBrandRequest): Promise<{ brand: Brand }> {
    return this.http.post<{ brand: Brand }>('/agency/brands/duplicate', request);
  }

  /**
   * Update brand details (admin only)
   */
  async updateBrand(brandId: string, updates: UpdateBrandRequest): Promise<{ brand: Brand }> {
    return this.http.patch<{ brand: Brand }>(`/agency/brands/${brandId}`, updates);
  }

  /**
   * Archive a brand (admin only)
   */
  async archiveBrand(brandId: string): Promise<{ brand: { brand_id: string; archived: boolean } }> {
    return this.http.delete<{ brand: { brand_id: string; archived: boolean } }>(`/agency/brands/${brandId}`);
  }

  /**
   * Get agency roster - all accessible brands with at-a-glance status
   */
  async getRoster(): Promise<{ roster_brand: RosterCard[] }> {
    return this.http.get<{ roster_brand: RosterCard[] }>('/agency/roster');
  }

  // ── Members ─────────────────────────────────────────────────────────

  /**
   * List agency members (admin only)
   */
  async listMembers(): Promise<{ agency_member: AgencyMember[] }> {
    return this.http.get<{ agency_member: AgencyMember[] }>('/agency/members');
  }

  /**
   * Invite member to agency (admin only)
   */
  async inviteMember(request: InviteMemberRequest): Promise<{ agency_member: AgencyMember & { message: string } }> {
    return this.http.post<{ agency_member: AgencyMember & { message: string } }>('/agency/members', request);
  }

  /**
   * Remove member from agency (admin only)
   */
  async removeMember(memberId: string): Promise<{ agency_member: { agency_member_id: string; removed: boolean } }> {
    return this.http.delete<{ agency_member: { agency_member_id: string; removed: boolean } }>(
      `/agency/members/${memberId}`
    );
  }

  /**
   * Assign brand access to member (admin only)
   */
  async assignBrandToMember(
    memberId: string,
    brandId: string
  ): Promise<{ member_brand_access: { agency_member_id: string; brand_id: string; assigned: boolean } }> {
    return this.http.post<{ member_brand_access: { agency_member_id: string; brand_id: string; assigned: boolean } }>(
      `/agency/members/${memberId}/brands/${brandId}`
    );
  }

  /**
   * Remove brand access from member (admin only)
   */
  async unassignBrandFromMember(
    memberId: string,
    brandId: string
  ): Promise<{ member_brand_access: { agency_member_id: string; brand_id: string; unassigned: boolean } }> {
    return this.http.delete<{ member_brand_access: { agency_member_id: string; brand_id: string; unassigned: boolean } }>(
      `/agency/members/${memberId}/brands/${brandId}`
    );
  }

  // ── Wallet ──────────────────────────────────────────────────────────

  /**
   * Top up agency wallet (admin only)
   */
  async topupWallet(request: TopUpWalletRequest): Promise<{ agency_wallet: { wallet_credits: number } }> {
    return this.http.post<{ agency_wallet: { wallet_credits: number } }>('/agency/wallet/topup', request);
  }

  // ── Reports ─────────────────────────────────────────────────────────

  /**
   * Get portfolio dashboard - agency-wide metrics (admin only)
   */
  async getPortfolioReport(): Promise<{
    portfolio_report: {
      agency_id: string;
      wallet_credits: number;
      total_credits_consumed_this_month: number;
      total_posts_published: number;
      brand_count: number;
      per_brand: Array<{
        brand_id: string;
        name: string;
        credits_consumed_this_month: number;
        posts_published: number;
        pending_approvals: number;
        needs_attention: boolean;
      }>;
    };
  }> {
    return this.http.get('/agency/reports/portfolio');
  }

  /**
   * Get per-brand client report
   */
  async getBrandReport(brandId: string): Promise<{
    brand_report: {
      brand_id: string;
      name: string;
      posts_published: number;
      credits_consumed_this_month: number;
      top_posts: Array<{ generated_title: string; primary_keyword: string }>;
    };
  }> {
    return this.http.get(`/agency/reports/brand/${brandId}`);
  }
}
