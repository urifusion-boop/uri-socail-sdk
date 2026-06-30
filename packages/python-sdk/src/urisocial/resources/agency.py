"""Agency management resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class AgencyResource:
    """Agency account management - multi-brand agencies"""

    def __init__(self, http: HTTPClient):
        self._http = http

    # ── Agency ──────────────────────────────────────────────────────────

    def create(self, name: str, plan_tier: Optional[str] = None) -> Dict[str, Any]:
        """
        Create a new agency (caller becomes admin)

        Args:
            name: Agency name
            plan_tier: Optional plan tier (e.g., 'starter', 'growth', 'enterprise')

        Returns:
            Created agency object
        """
        payload = {"name": name}
        if plan_tier:
            payload["plan_tier"] = plan_tier
        return self._http.post("/agency", json=payload)

    def get(self) -> Dict[str, Any]:
        """
        Get caller's agency

        Returns:
            Agency object or None if user doesn't belong to an agency
        """
        return self._http.get("/agency")

    def update(self, name: str) -> Dict[str, Any]:
        """
        Update agency name (admin only)

        Args:
            name: New agency name

        Returns:
            Updated agency object
        """
        return self._http.patch("/agency", json={"name": name})

    def upgrade_solo_to_agency(self, name: str, plan_tier: Optional[str] = None) -> Dict[str, Any]:
        """
        Upgrade solo SME to agency, bringing existing brand in

        Args:
            name: Agency name
            plan_tier: Optional plan tier

        Returns:
            Created agency object with migrated_brand_id
        """
        payload = {"name": name}
        if plan_tier:
            payload["plan_tier"] = plan_tier
        return self._http.post("/agency/upgrade", json=payload)

    def update_settings(self, per_brand_caps_enabled: bool) -> Dict[str, Any]:
        """
        Toggle per-brand credit caps (admin only)

        Args:
            per_brand_caps_enabled: Enable/disable per-brand caps

        Returns:
            Updated settings
        """
        return self._http.patch("/agency/settings", params={"per_brand_caps_enabled": per_brand_caps_enabled})

    # ── Brands ──────────────────────────────────────────────────────────

    def list_brands(self) -> Dict[str, Any]:
        """
        List all brands accessible to caller (brand-switcher list)

        Returns:
            List of brand objects
        """
        return self._http.get("/agency/brands")

    def create_brand(
        self,
        name: str,
        industry: Optional[str] = None,
        logo_url: Optional[str] = None,
        monthly_credit_cap: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Add a new brand to agency (admin only)

        Args:
            name: Brand name
            industry: Optional industry
            logo_url: Optional logo URL
            monthly_credit_cap: Optional monthly credit cap

        Returns:
            Created brand object
        """
        payload = {"name": name}
        if industry:
            payload["industry"] = industry
        if logo_url:
            payload["logo_url"] = logo_url
        if monthly_credit_cap is not None:
            payload["monthly_credit_cap"] = monthly_credit_cap
        return self._http.post("/agency/brands", json=payload)

    def duplicate_brand(
        self,
        template_brand_id: str,
        name: str,
        industry: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Duplicate brand from existing template (admin only)

        Args:
            template_brand_id: ID of brand to duplicate from
            name: New brand name
            industry: Optional industry

        Returns:
            Created brand object
        """
        payload = {"template_brand_id": template_brand_id, "name": name}
        if industry:
            payload["industry"] = industry
        return self._http.post("/agency/brands/duplicate", json=payload)

    def update_brand(self, brand_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update brand details (admin only)

        Args:
            brand_id: Brand ID
            updates: Dictionary of fields to update (name, industry, logo_url, monthly_credit_cap, etc.)

        Returns:
            Updated brand object
        """
        return self._http.patch(f"/agency/brands/{brand_id}", json=updates)

    def archive_brand(self, brand_id: str) -> Dict[str, Any]:
        """
        Archive a brand (admin only)

        Args:
            brand_id: Brand ID to archive

        Returns:
            Archive confirmation
        """
        return self._http.delete(f"/agency/brands/{brand_id}")

    def get_roster(self) -> Dict[str, Any]:
        """
        Get agency roster - all accessible brands with at-a-glance status

        Returns:
            List of roster cards with pending_approvals, scheduled_today, credits_consumed_this_month, etc.
        """
        return self._http.get("/agency/roster")

    # ── Members ─────────────────────────────────────────────────────────

    def list_members(self) -> Dict[str, Any]:
        """
        List agency members (admin only)

        Returns:
            List of agency members with assigned brand IDs
        """
        return self._http.get("/agency/members")

    def invite_member(self, email: str, role: str = "member") -> Dict[str, Any]:
        """
        Invite member to agency (admin only)

        Args:
            email: Email address to invite
            role: Role ('admin' or 'member', default: 'member')

        Returns:
            Created member object with invite status
        """
        return self._http.post("/agency/members", json={"email": email, "role": role})

    def remove_member(self, member_id: str) -> Dict[str, Any]:
        """
        Remove member from agency (admin only)

        Args:
            member_id: Agency member ID

        Returns:
            Removal confirmation
        """
        return self._http.delete(f"/agency/members/{member_id}")

    def assign_brand_to_member(self, member_id: str, brand_id: str) -> Dict[str, Any]:
        """
        Assign brand access to member (admin only)

        Args:
            member_id: Agency member ID
            brand_id: Brand ID to assign

        Returns:
            Assignment confirmation
        """
        return self._http.post(f"/agency/members/{member_id}/brands/{brand_id}")

    def unassign_brand_from_member(self, member_id: str, brand_id: str) -> Dict[str, Any]:
        """
        Remove brand access from member (admin only)

        Args:
            member_id: Agency member ID
            brand_id: Brand ID to unassign

        Returns:
            Unassignment confirmation
        """
        return self._http.delete(f"/agency/members/{member_id}/brands/{brand_id}")

    # ── Wallet ──────────────────────────────────────────────────────────

    def topup_wallet(self, credits: float) -> Dict[str, Any]:
        """
        Top up agency wallet (admin only)

        Args:
            credits: Number of credits to add

        Returns:
            Updated wallet balance
        """
        return self._http.post("/agency/wallet/topup", json={"credits": credits})

    # ── Reports ─────────────────────────────────────────────────────────

    def get_portfolio_report(self) -> Dict[str, Any]:
        """
        Get portfolio dashboard - agency-wide metrics (admin only)

        Returns:
            Portfolio report with wallet_credits, total_credits_consumed_this_month, per_brand breakdown, etc.
        """
        return self._http.get("/agency/reports/portfolio")

    def get_brand_report(self, brand_id: str) -> Dict[str, Any]:
        """
        Get per-brand client report

        Args:
            brand_id: Brand ID

        Returns:
            Brand report with posts_published, credits_consumed_this_month, top_posts, etc.
        """
        return self._http.get(f"/agency/reports/brand/{brand_id}")
