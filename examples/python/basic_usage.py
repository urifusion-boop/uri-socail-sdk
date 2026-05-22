"""
Basic Python SDK Usage Example
"""

import os
from urisocial import URISocial

def main():
    # Initialize client
    client = URISocial(
        api_key=os.getenv('URISOCIAL_API_KEY', 'your-api-key')
    )

    try:
        # 1. Generate content for multiple platforms
        print('Generating content...')
        content = client.content.generate(
            seed_content='Launching our new luxury perfume collection - Notes of jasmine, vanilla, and amber',
            platforms=['instagram', 'facebook', 'twitter'],
            reference_image='https://example.com/perfume-bottle.jpg',
            tone='professional',
            include_hashtags=True
        )

        print(f"Generated Content ID: {content['id']}")
        print(f"Image URL: {content['image_url']}")

        for platform in content['platforms']:
            print(f"\n{platform['platform'].upper()}:")
            print(platform['text'])
            print('Hashtags:', ' '.join(platform['hashtags']))

        # 2. Get billing info
        billing = client.billing.get_info()
        print(f"\nCredits remaining: {billing['credits_remaining']}")

        # 3. List all drafts
        drafts = client.drafts.list(page=1, per_page=10)
        print(f"\nTotal drafts: {drafts['total']}")

        # 4. Get connected platforms
        connections = client.connections.list()
        connected = [c['platform'] for c in connections['connected_platforms']]
        print(f"\nConnected platforms: {', '.join(connected)}")

    except Exception as error:
        print(f'Error: {error}')
    finally:
        client.close()

if __name__ == '__main__':
    main()
