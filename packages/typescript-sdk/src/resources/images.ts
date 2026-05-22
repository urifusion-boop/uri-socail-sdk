import { HTTPClient } from '../client/http';
import { ImageGenerationRequest, ImageGenerationResult } from '../types';

export class ImagesResource {
  constructor(private http: HTTPClient) {}

  /**
   * Generate an image using AI
   */
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    return this.http.post<ImageGenerationResult>('/api/v1/images/generate', request);
  }

  /**
   * Edit an existing image
   */
  async edit(request: {
    imageUrl: string;
    prompt: string;
    maskUrl?: string;
  }): Promise<ImageGenerationResult> {
    return this.http.post<ImageGenerationResult>('/api/v1/images/edit', request);
  }

  /**
   * Remove background from product image
   */
  async removeBackground(imageUrl: string): Promise<{ cutout_url: string }> {
    return this.http.post<{ cutout_url: string }>('/api/v1/images/remove-background', {
      image_url: imageUrl,
    });
  }

  /**
   * Analyze product in image (forensic analysis)
   */
  async analyzeProduct(imageUrl: string): Promise<{
    product_type: string;
    shape: string;
    colors: string[];
    materials: string[];
    labels: string[];
  }> {
    return this.http.post('/api/v1/images/analyze-product', {
      image_url: imageUrl,
    });
  }
}
