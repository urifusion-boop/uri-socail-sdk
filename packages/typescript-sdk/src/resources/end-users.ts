import { HTTPClient } from '../client/http';

/**
 * A snapshot of one end-user's brand setup, as far as it's been filled in.
 * Any field can be missing if that user hasn't completed onboarding yet.
 */
export interface EndUserSetup {
  brand_name?: string;
  industry?: string;
  region?: string;
  derived_voice?: string;
  brand_colors?: string[];
  logo_url?: string;
  onboarding_completed?: boolean;
}

export interface SdkEndUser {
  end_user_id: string;
  /** The ID you passed as X-End-User-ID / setEndUserId() for this person. */
  external_user_id: string;
  external_name?: string;
  external_email?: string;
  status: 'active' | 'suspended' | 'deleted';
  onboarding_completed: boolean;
  total_generations: number;
  total_images: number;
  total_api_calls: number;
  last_active_at?: string;
  created_at: string;
  setup: EndUserSetup | null;
}

export interface ListEndUsersResponse {
  sdk_client_id: string;
  company_name: string;
  total_end_users: number;
  users: SdkEndUser[];
}

/**
 * SDK client admin view — lists the end-users provisioned under your own
 * API key, each with a summary of their brand setup. This is for the app
 * built on the SDK to manage its own users (e.g. Feest's internal team
 * seeing every restaurant on their platform) — an individual end-user
 * never sees this themselves.
 */
export class EndUsersResource {
  constructor(private http: HTTPClient) {}

  async list(limit: number = 50, skip: number = 0): Promise<ListEndUsersResponse> {
    const response = await this.http.get<{ responseData: ListEndUsersResponse }>(
      `/social-media/sdk/end-users?limit=${limit}&skip=${skip}`
    );
    return response.responseData;
  }
}
