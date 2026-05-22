import React, { useState } from 'react';
import { useConnections } from '../hooks/useConnections';
import type { ConnectionManagerProps } from '../types';
import type { Platform } from '@urisocial/sdk';

const AVAILABLE_PLATFORMS: Array<{
  key: Platform;
  label: string;
  icon: string;
  color: string;
  description: string;
}> = [
  { key: 'facebook', label: 'Facebook', icon: '📘', color: '#1877F2', description: 'Connect your Facebook Page' },
  { key: 'instagram', label: 'Instagram', icon: '📷', color: '#E1306C', description: 'Connect your Instagram Business account' },
  { key: 'twitter', label: 'Twitter / X', icon: '🐦', color: '#1DA1F2', description: 'Connect your X account' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2', description: 'Connect your LinkedIn profile or page' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000000', description: 'Connect your TikTok account' },
];

/**
 * ConnectionManager Component
 *
 * Displays connected social media accounts and allows users
 * to connect or disconnect platforms.
 *
 * @example
 * ```tsx
 * import { URISocialProvider, ConnectionManager } from '@urisocial/react';
 *
 * function App() {
 *   return (
 *     <URISocialProvider apiKey="your-api-key">
 *       <ConnectionManager
 *         redirectUrl="https://yourapp.com/oauth/callback"
 *         onConnectionAdded={(platform) => console.log('Connected:', platform)}
 *       />
 *     </URISocialProvider>
 *   );
 * }
 * ```
 */
export function ConnectionManager({
  onConnectionAdded,
  onConnectionRemoved,
  redirectUrl,
  className = '',
  theme,
}: ConnectionManagerProps) {
  const { connections, isLoading, error, disconnect, getConnectUrl } = useConnections();
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);

  const themeStyles = {
    primaryColor: theme?.primaryColor || '#CD1B78',
    backgroundColor: theme?.backgroundColor || '#FFFFFF',
    borderColor: theme?.borderColor || '#E5E7EB',
    borderRadius: theme?.borderRadius || '8px',
    fontFamily: theme?.fontFamily || 'Inter, system-ui, sans-serif',
    errorColor: theme?.errorColor || '#EF4444',
    successColor: theme?.successColor || '#10B981',
  };

  const handleConnect = async (platform: Platform) => {
    try {
      setConnectingPlatform(platform);
      const authUrl = await getConnectUrl(platform, redirectUrl);
      window.location.href = authUrl;
      if (onConnectionAdded) onConnectionAdded(platform);
    } catch (err) {
      console.error('Failed to get connect URL:', err);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (platform: Platform) => {
    if (window.confirm(`Are you sure you want to disconnect ${platform}?`)) {
      await disconnect(platform);
      if (onConnectionRemoved) onConnectionRemoved(platform);
    }
  };

  const getPlatformInfo = (platform: Platform) => {
    return AVAILABLE_PLATFORMS.find((p) => p.key === platform);
  };

  const isConnected = (platform: Platform) => {
    return connections.some((c) => c.platform === platform);
  };

  const getConnection = (platform: Platform) => {
    return connections.find((c) => c.platform === platform);
  };

  return (
    <div
      className={`urisocial-connection-manager ${className}`}
      style={{
        fontFamily: themeStyles.fontFamily,
        backgroundColor: themeStyles.backgroundColor,
        borderRadius: themeStyles.borderRadius,
        padding: '24px',
        border: `1px solid ${themeStyles.borderColor}`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px 0', color: '#1F2937' }}>
          Social Media Connections
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
          Connect your social media accounts to publish content
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: '16px',
            backgroundColor: `${themeStyles.errorColor}10`,
            borderRadius: themeStyles.borderRadius,
            border: `1px solid ${themeStyles.errorColor}`,
            marginBottom: '20px',
          }}
        >
          <p style={{ fontSize: '14px', color: themeStyles.errorColor, margin: 0 }}>
            {error.message}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Loading connections...</p>
        </div>
      )}

      {/* Platform Cards */}
      {!isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {AVAILABLE_PLATFORMS.map((platform) => {
            const connected = isConnected(platform.key);
            const connection = getConnection(platform.key);
            const isConnecting = connectingPlatform === platform.key;

            return (
              <div
                key={platform.key}
                style={{
                  padding: '20px',
                  border: `1px solid ${themeStyles.borderColor}`,
                  borderRadius: themeStyles.borderRadius,
                  backgroundColor: connected ? `${themeStyles.successColor}05` : '#FFFFFF',
                  borderLeft: connected ? `4px solid ${themeStyles.successColor}` : `4px solid transparent`,
                }}
              >
                {/* Platform Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '28px',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '8px',
                    }}
                  >
                    {platform.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#1F2937' }}>
                      {platform.label}
                    </h3>
                    {connected && connection && (
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                        {connection.account_name}
                      </p>
                    )}
                  </div>
                  {connected && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: themeStyles.successColor,
                      }}
                    />
                  )}
                </div>

                {/* Platform Description */}
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                  {platform.description}
                </p>

                {/* Action Button */}
                {connected ? (
                  <button
                    onClick={() => handleDisconnect(platform.key)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: themeStyles.errorColor,
                      backgroundColor: `${themeStyles.errorColor}10`,
                      border: `1px solid ${themeStyles.errorColor}30`,
                      borderRadius: themeStyles.borderRadius,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.key)}
                    disabled={isConnecting}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      backgroundColor: isConnecting ? '#9CA3AF' : themeStyles.primaryColor,
                      border: 'none',
                      borderRadius: themeStyles.borderRadius,
                      cursor: isConnecting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isConnecting ? '⏳ Connecting...' : '🔗 Connect'}
                  </button>
                )}

                {/* Connection Status */}
                {connected && connection && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${themeStyles.borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
                      <span>Status:</span>
                      <span
                        style={{
                          color: connection.status === 'active' ? themeStyles.successColor : themeStyles.errorColor,
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      >
                        {connection.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {!isLoading && connections.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#F9FAFB',
            borderRadius: themeStyles.borderRadius,
          }}
        >
          <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
            ✅ <strong>{connections.length}</strong> platform{connections.length !== 1 ? 's' : ''} connected
          </p>
        </div>
      )}
    </div>
  );
}
