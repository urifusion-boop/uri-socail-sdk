"""Workspaces resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class WorkspacesResource:
    """Multi-tenant workspace management"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def list(self, client_id: Optional[str] = None) -> Dict[str, Any]:
        """List all workspaces"""
        params = {}
        if client_id:
            params["client_id"] = client_id
        return self._http.get("/social-media/workspaces", params=params)

    def get(self, workspace_id: str) -> Dict[str, Any]:
        """Get workspace details"""
        return self._http.get(f"/social-media/workspaces/{workspace_id}")

    def create(self, name: str, client_id: str, description: Optional[str] = None) -> Dict[str, Any]:
        """Create a new workspace"""
        return self._http.post(
            f"/social-media/workspaces?client_id={client_id}",
            json={"name": name, "description": description},
        )

    def update(self, workspace_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update workspace details"""
        return self._http.patch(f"/social-media/workspaces/{workspace_id}", json=updates)

    def delete(self, workspace_id: str) -> Dict[str, Any]:
        """Delete workspace"""
        return self._http.delete(f"/social-media/workspaces/{workspace_id}")

    def get_members(self, workspace_id: str) -> Dict[str, Any]:
        """Get workspace members"""
        return self._http.get(f"/social-media/workspaces/{workspace_id}/members")

    def invite_member(
        self, workspace_id: str, email: str, role: str = "member"
    ) -> Dict[str, Any]:
        """Invite member to workspace"""
        return self._http.post(
            f"/social-media/workspaces/{workspace_id}/members/invite",
            json={"email": email, "role": role},
        )

    def update_member_role(
        self, workspace_id: str, user_id: str, role: str
    ) -> Dict[str, Any]:
        """Update member role"""
        return self._http.patch(
            f"/social-media/workspaces/{workspace_id}/members/{user_id}/role",
            json={"role": role},
        )

    def remove_member(self, workspace_id: str, user_id: str) -> Dict[str, Any]:
        """Remove member from workspace"""
        return self._http.delete(f"/social-media/workspaces/{workspace_id}/members/{user_id}")

    def switch(self, workspace_id: str) -> None:
        """Switch active workspace"""
        self._http.set_workspace_id(workspace_id)
