/**
 * Basic TypeScript SDK Usage Example
 */

import { URISocial } from '@urisocial/sdk';

async function main() {
  // Initialize client
  const client = new URISocial({
    apiKey: process.env.URISOCIAL_API_KEY || 'your-api-key',
  });

  try {
    // 1. Generate content for multiple platforms
    console.log('Generating content...');
    const content = await client.content.generate({
      seedContent: 'Launching our new luxury perfume collection - Notes of jasmine, vanilla, and amber',
      platforms: ['instagram', 'facebook', 'twitter'],
      referenceImage: 'https://example.com/perfume-bottle.jpg',
      tone: 'professional',
      includeHashtags: true,
    });

    console.log('Generated Content ID:', content.id);
    console.log('Image URL:', content.image_url);

    content.platforms.forEach(platform => {
      console.log(`\n${platform.platform.toUpperCase()}:`);
      console.log(platform.text);
      console.log('Hashtags:', platform.hashtags.join(' '));
    });

    // 2. Get billing info
    const billing = await client.billing.getInfo();
    console.log(`\nCredits remaining: ${billing.credits_remaining}`);

    // 3. List all drafts
    const drafts = await client.drafts.list(1, 10);
    console.log(`\nTotal drafts: ${drafts.total}`);

    // 4. Get connected platforms
    const connections = await client.connections.list();
    console.log('\nConnected platforms:',
      connections.connected_platforms.map(c => c.platform).join(', ')
    );

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
