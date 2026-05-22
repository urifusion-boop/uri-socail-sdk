import React, { useState } from 'react';
import {
  URISocialProvider,
  ContentGenerator,
  DraftManager,
  ConnectionManager,
  CreditBadge,
} from '@urisocial/react';
import type { GeneratedContent } from '@urisocial/react';

/**
 * Example React Application using URI Social SDK
 *
 * This demonstrates all available components and hooks.
 */
function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'drafts' | 'connections'>('generate');
  const [lastGenerated, setLastGenerated] = useState<GeneratedContent | null>(null);

  // Custom theme matching URI Social brand
  const theme = {
    primaryColor: '#CD1B78',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: '8px',
    fontFamily: 'Inter, system-ui, sans-serif',
    errorColor: '#EF4444',
    successColor: '#10B981',
  };

  const handleContentGenerated = (content: GeneratedContent) => {
    console.log('Content generated:', content);
    setLastGenerated(content);
    alert('Content generated successfully! Check the Drafts tab.');
    setActiveTab('drafts');
  };

  const handleError = (error: Error) => {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  };

  const handleCreditsLow = (remaining: number) => {
    if (remaining < 50) {
      alert(`Warning: Only ${remaining} credits remaining. Consider upgrading your plan.`);
    }
  };

  return (
    <URISocialProvider
      apiKey={import.meta.env.VITE_URISOCIAL_API_KEY || 'your-api-key'}
      baseUrl="https://api.urisocial.com"
    >
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '24px' }}>
        {/* Header */}
        <header style={{ maxWidth: '1200px', margin: '0 auto 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#1F2937' }}>
                🎨 URI Social Demo
              </h1>
              <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
                AI-powered social media content generation
              </p>
            </div>
            <CreditBadge
              showUpgradeLink
              onUpgradeClick={() => {
                window.open('https://urisocial.com/pricing', '_blank');
              }}
              theme={theme}
            />
          </div>
        </header>

        {/* Navigation Tabs */}
        <div style={{ maxWidth: '1200px', margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E5E7EB' }}>
            <button
              onClick={() => setActiveTab('generate')}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 500,
                color: activeTab === 'generate' ? '#CD1B78' : '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'generate' ? '3px solid #CD1B78' : 'none',
                cursor: 'pointer',
                marginBottom: '-2px',
              }}
            >
              ✨ Generate
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 500,
                color: activeTab === 'drafts' ? '#CD1B78' : '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'drafts' ? '3px solid #CD1B78' : 'none',
                cursor: 'pointer',
                marginBottom: '-2px',
              }}
            >
              📝 Drafts
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 500,
                color: activeTab === 'connections' ? '#CD1B78' : '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'connections' ? '3px solid #CD1B78' : 'none',
                cursor: 'pointer',
                marginBottom: '-2px',
              }}
            >
              🔗 Connections
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'generate' && (
            <ContentGenerator
              platforms={['instagram', 'facebook']}
              defaultTone="professional"
              includeHashtags={true}
              includeEmojis={true}
              showImageUpload={true}
              onContentGenerated={handleContentGenerated}
              onError={handleError}
              onCreditsLow={handleCreditsLow}
              theme={theme}
            />
          )}

          {activeTab === 'drafts' && (
            <DraftManager
              pageSize={20}
              onDraftSelect={(id) => {
                console.log('Draft selected:', id);
                alert(`Draft ${id} selected. You can now edit or publish it.`);
              }}
              onDraftDelete={(id) => {
                console.log('Draft deleted:', id);
              }}
              onDraftPublish={(id) => {
                console.log('Publishing draft:', id);
                alert(`Publishing draft ${id}...`);
              }}
              theme={theme}
            />
          )}

          {activeTab === 'connections' && (
            <ConnectionManager
              redirectUrl={window.location.origin + '/oauth/callback'}
              onConnectionAdded={(platform) => {
                console.log('Connected:', platform);
              }}
              onConnectionRemoved={(platform) => {
                console.log('Disconnected:', platform);
              }}
              theme={theme}
            />
          )}
        </main>

        {/* Footer */}
        <footer style={{ maxWidth: '1200px', margin: '48px auto 0', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
            Powered by{' '}
            <a
              href="https://urisocial.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#CD1B78', textDecoration: 'none', fontWeight: 500 }}
            >
              URI Social
            </a>
          </p>
        </footer>
      </div>
    </URISocialProvider>
  );
}

export default App;
