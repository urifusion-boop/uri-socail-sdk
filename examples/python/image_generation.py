"""
Advanced Image Generation Example
"""

import os
from urisocial import URISocial

def main():
    client = URISocial(api_key=os.getenv('URISOCIAL_API_KEY'))

    try:
        # 1. Analyze product image first
        print('Analyzing product image...')
        product_url = 'https://example.com/perfume-bottle.jpg'

        analysis = client.images.analyze_product(product_url)
        print(f"Product Type: {analysis['product_type']}")
        print(f"Colors: {', '.join(analysis['colors'])}")
        print(f"Materials: {', '.join(analysis['materials'])}")

        # 2. Remove background from product
        print('\nRemoving background...')
        cutout = client.images.remove_background(product_url)
        print(f"Cutout URL: {cutout['cutout_url']}")

        # 3. Generate immersive image with product preservation
        print('\nGenerating immersive image...')
        image = client.images.generate(
            prompt='Luxury perfume bottle on marble pedestal, surrounded by fresh jasmine flowers, golden hour lighting, professional product photography',
            reference_image=product_url,
            style='immersive',
            aspect_ratio='1:1'
        )
        print(f"Generated Image: {image['image_url']}")

        if image.get('revised_prompt'):
            print(f"Revised Prompt: {image['revised_prompt']}")

        # 4. Create draft with generated image
        print('\nCreating draft...')
        draft = client.drafts.create(
            text_content=[
                {
                    'platform': 'instagram',
                    'text': 'Introducing our new signature scent ✨',
                    'hashtags': ['#LuxuryPerfume', '#NewFragrance'],
                    'character_count': 45
                }
            ],
            image_url=image['image_url'],
            reference_image=product_url
        )
        print(f"Draft created: {draft['id']}")

    except Exception as error:
        print(f'Error: {error}')
    finally:
        client.close()

if __name__ == '__main__':
    main()
