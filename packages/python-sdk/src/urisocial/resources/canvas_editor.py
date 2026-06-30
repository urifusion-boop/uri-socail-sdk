"""Canvas editor resource for URI Social SDK"""

from typing import Dict, Any, List, Optional
from ..http_client import HTTPClient


class CanvasEditorResource:
    """Canvas editor operations - layered document editing"""

    def __init__(self, http: HTTPClient):
        self._http = http

    def get_draft_document(self, draft_id: str) -> Dict[str, Any]:
        """
        Get layered document for a draft

        Returns complete layered JSON document with all layers,
        ready for canvas editor rendering.

        Args:
            draft_id: Draft ID

        Returns:
            Layered document object
        """
        return self._http.get(f"/canvas-editor/drafts/{draft_id}/document")

    def update_layer(
        self,
        draft_id: str,
        layer_id: str,
        updates: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Update individual layer properties

        Args:
            draft_id: Draft ID
            layer_id: Layer ID
            updates: Dictionary of properties to update (x, y, width, height, rotation, opacity, etc.)

        Returns:
            Updated document object
        """
        return self._http.post(
            f"/canvas-editor/drafts/{draft_id}/layers/{layer_id}/update",
            json={"layer_id": layer_id, "updates": updates},
        )

    def undo(self, draft_id: str) -> Dict[str, Any]:
        """
        Undo last edit operation

        Args:
            draft_id: Draft ID

        Returns:
            Document state after undo
        """
        return self._http.post(f"/canvas-editor/drafts/{draft_id}/undo")

    def redo(self, draft_id: str) -> Dict[str, Any]:
        """
        Redo previously undone operation

        Args:
            draft_id: Draft ID

        Returns:
            Document state after redo
        """
        return self._http.post(f"/canvas-editor/drafts/{draft_id}/redo")

    def render_document(
        self,
        draft_id: str,
        aspect_ratio: str = "1:1",
        output_format: str = "png",
        quality: int = 95,
    ) -> Dict[str, Any]:
        """
        Render layered document to image

        Args:
            draft_id: Draft ID
            aspect_ratio: Target aspect ratio (default: '1:1')
            output_format: Output format ('png' or 'jpg', default: 'png')
            quality: Image quality 1-100 (default: 95)

        Returns:
            Rendered image URL
        """
        return self._http.post(
            f"/canvas-editor/drafts/{draft_id}/render",
            json={
                "aspect_ratio": aspect_ratio,
                "output_format": output_format,
                "quality": quality,
            },
        )

    def reorder_layers(self, draft_id: str, layer_order: List[str]) -> Dict[str, Any]:
        """
        Reorder layers (z-index)

        Args:
            draft_id: Draft ID
            layer_order: List of layer IDs in desired order (bottom to top)

        Returns:
            Updated document object
        """
        return self._http.post(
            f"/canvas-editor/drafts/{draft_id}/layers/reorder",
            json={"layer_order": layer_order},
        )

    def delete_layer(self, draft_id: str, layer_id: str) -> Dict[str, Any]:
        """
        Delete layer from document

        Args:
            draft_id: Draft ID
            layer_id: Layer ID to delete

        Returns:
            Updated document object
        """
        return self._http.delete(f"/canvas-editor/drafts/{draft_id}/layers/{layer_id}")

    def get_edit_history(self, draft_id: str) -> Dict[str, Any]:
        """
        Get edit history for draft

        Returns chronological list of all edit operations.

        Args:
            draft_id: Draft ID

        Returns:
            Edit history with operations, timestamps, and user info
        """
        return self._http.get(f"/canvas-editor/drafts/{draft_id}/edit-history")
