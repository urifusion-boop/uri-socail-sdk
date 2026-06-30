import { HTTPClient } from '../client/http';

// ── Types ──────────────────────────────────────────────────────────────

export interface LayeredDocument {
  draft_id: string;
  layers: Layer[];
  canvas_width: number;
  canvas_height: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Layer {
  layer_id: string;
  type: 'text' | 'image' | 'shape' | 'background';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  z_index: number;
  properties: Record<string, any>;
}

export interface UpdateLayerRequest {
  layer_id: string;
  updates: Partial<Layer>;
}

export interface RenderDocumentRequest {
  aspect_ratio?: string;
  output_format?: 'png' | 'jpg';
  quality?: number;
}

export interface ReorderLayersRequest {
  layer_order: string[];
}

export interface EditHistoryEntry {
  operation: string;
  timestamp: string;
  user_id: string;
  changes: Record<string, any>;
}

// ── Resource ───────────────────────────────────────────────────────────

export class CanvasEditorResource {
  constructor(private http: HTTPClient) {}

  /**
   * Get layered document for a draft
   *
   * Returns complete layered JSON document with all layers,
   * ready for canvas editor rendering.
   */
  async getDraftDocument(draftId: string): Promise<{ document: LayeredDocument }> {
    return this.http.get<{ document: LayeredDocument }>(`/canvas-editor/drafts/${draftId}/document`);
  }

  /**
   * Update individual layer properties
   */
  async updateLayer(draftId: string, layerId: string, updates: Partial<Layer>): Promise<{ document: LayeredDocument }> {
    return this.http.post<{ document: LayeredDocument }>(`/canvas-editor/drafts/${draftId}/layers/${layerId}/update`, {
      layer_id: layerId,
      updates,
    });
  }

  /**
   * Undo last edit operation
   */
  async undo(draftId: string): Promise<{ document: LayeredDocument }> {
    return this.http.post<{ document: LayeredDocument }>(`/canvas-editor/drafts/${draftId}/undo`);
  }

  /**
   * Redo previously undone operation
   */
  async redo(draftId: string): Promise<{ document: LayeredDocument }> {
    return this.http.post<{ document: LayeredDocument }>(`/canvas-editor/drafts/${draftId}/redo`);
  }

  /**
   * Render layered document to image
   */
  async renderDocument(draftId: string, request?: RenderDocumentRequest): Promise<{ image_url: string }> {
    return this.http.post<{ image_url: string }>(`/canvas-editor/drafts/${draftId}/render`, request || {});
  }

  /**
   * Reorder layers (z-index)
   */
  async reorderLayers(draftId: string, layerOrder: string[]): Promise<{ document: LayeredDocument }> {
    return this.http.post<{ document: LayeredDocument }>(`/canvas-editor/drafts/${draftId}/layers/reorder`, {
      layer_order: layerOrder,
    });
  }

  /**
   * Delete layer from document
   */
  async deleteLayer(draftId: string, layerId: string): Promise<{ document: LayeredDocument }> {
    return this.http.delete<{ document: LayeredDocument }>(`/canvas-editor/drafts/${draftId}/layers/${layerId}`);
  }

  /**
   * Get edit history for draft
   *
   * Returns chronological list of all edit operations.
   */
  async getEditHistory(draftId: string): Promise<{ history: EditHistoryEntry[] }> {
    return this.http.get<{ history: EditHistoryEntry[] }>(`/canvas-editor/drafts/${draftId}/edit-history`);
  }
}
