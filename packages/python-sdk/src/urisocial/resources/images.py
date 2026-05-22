"""Images resource"""

from typing import TYPE_CHECKING, Optional
from ..types import ImageGenerationRequest, ImageGenerationResult

if TYPE_CHECKING:
    from ..http_client import HTTPClient


class ImagesResource:
    """Resource for AI image generation and editing"""

    def __init__(self, http: "HTTPClient"):
        self._http = http

    def generate(self, **kwargs: ImageGenerationRequest) -> ImageGenerationResult:
        """
        Generate an image using AI

        Args:
            prompt: Image generation prompt
            reference_image: Optional product/reference image for preservation
            style: Image style (immersive, standard, minimalist)
            aspect_ratio: Image aspect ratio (1:1, 4:5, 16:9)

        Returns:
            Generated image URL and revised prompt

        Example:
            >>> image = client.images.generate(
            ...     prompt='Luxury perfume bottle on marble surface',
            ...     reference_image='https://example.com/product.jpg',
            ...     style='immersive',
            ...     aspect_ratio='1:1'
            ... )
        """
        return self._http.post("/api/v1/images/generate", json=kwargs)

    def edit(
        self,
        image_url: str,
        prompt: str,
        mask_url: Optional[str] = None,
    ) -> ImageGenerationResult:
        """
        Edit an existing image

        Args:
            image_url: URL of image to edit
            prompt: Edit instruction prompt
            mask_url: Optional mask image URL for targeted edits

        Returns:
            Edited image URL
        """
        return self._http.post(
            "/api/v1/images/edit",
            json={
                "image_url": image_url,
                "prompt": prompt,
                "mask_url": mask_url,
            },
        )

    def remove_background(self, image_url: str) -> dict:
        """
        Remove background from product image

        Args:
            image_url: URL of product image

        Returns:
            Dictionary with cutout_url

        Example:
            >>> result = client.images.remove_background(
            ...     'https://example.com/product.jpg'
            ... )
            >>> print(result['cutout_url'])
        """
        return self._http.post(
            "/api/v1/images/remove-background",
            json={"image_url": image_url},
        )

    def analyze_product(self, image_url: str) -> dict:
        """
        Analyze product in image (forensic analysis)

        Args:
            image_url: URL of product image

        Returns:
            Product analysis with type, shape, colors, materials, labels

        Example:
            >>> analysis = client.images.analyze_product(
            ...     'https://example.com/perfume.jpg'
            ... )
            >>> print(analysis['product_type'])
            >>> print(analysis['colors'])
        """
        return self._http.post(
            "/api/v1/images/analyze-product",
            json={"image_url": image_url},
        )
