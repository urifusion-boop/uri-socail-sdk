import React from 'react';
import { useBilling } from '../hooks/useBilling';
import type { CreditBadgeProps } from '../types';

/**
 * CreditBadge Component
 *
 * Displays current credit balance with optional upgrade link.
 *
 * @example
 * ```tsx
 * import { URISocialProvider, CreditBadge } from '@urisocial/react';
 *
 * function App() {
 *   return (
 *     <URISocialProvider apiKey="your-api-key">
 *       <CreditBadge
 *         showUpgradeLink
 *         onUpgradeClick={() => window.location.href = '/pricing'}
 *       />
 *     </URISocialProvider>
 *   );
 * }
 * ```
 */
export function CreditBadge({
  showUpgradeLink = false,
  onUpgradeClick,
  className = '',
  theme,
}: CreditBadgeProps) {
  const { billingInfo, isLoading, error } = useBilling();

  const themeStyles = {
    primaryColor: theme?.primaryColor || '#CD1B78',
    backgroundColor: theme?.backgroundColor || '#FFFFFF',
    borderColor: theme?.borderColor || '#E5E7EB',
    borderRadius: theme?.borderRadius || '8px',
    fontFamily: theme?.fontFamily || 'Inter, system-ui, sans-serif',
    errorColor: theme?.errorColor || '#EF4444',
    successColor: theme?.successColor || '#10B981',
  };

  if (isLoading) {
    return (
      <div
        className={`urisocial-credit-badge ${className}`}
        style={{
          fontFamily: themeStyles.fontFamily,
          padding: '12px 16px',
          backgroundColor: '#F9FAFB',
          borderRadius: themeStyles.borderRadius,
          border: `1px solid ${themeStyles.borderColor}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#6B7280' }}>Loading...</span>
      </div>
    );
  }

  if (error || !billingInfo) {
    return (
      <div
        className={`urisocial-credit-badge ${className}`}
        style={{
          fontFamily: themeStyles.fontFamily,
          padding: '12px 16px',
          backgroundColor: `${themeStyles.errorColor}10`,
          borderRadius: themeStyles.borderRadius,
          border: `1px solid ${themeStyles.errorColor}30`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '14px', color: themeStyles.errorColor }}>
          Failed to load credits
        </span>
      </div>
    );
  }

  const { credits_remaining, subscription_tier } = billingInfo;
  const isLowCredits = credits_remaining < 100;

  const tierDisplay = {
    free: 'Free',
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  }[subscription_tier] || subscription_tier;

  return (
    <div
      className={`urisocial-credit-badge ${className}`}
      style={{
        fontFamily: themeStyles.fontFamily,
        padding: '12px 16px',
        backgroundColor: isLowCredits ? `${themeStyles.errorColor}10` : '#F9FAFB',
        borderRadius: themeStyles.borderRadius,
        border: `1px solid ${isLowCredits ? themeStyles.errorColor + '30' : themeStyles.borderColor}`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {/* Credits Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>⭐</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
            {credits_remaining.toLocaleString()} Credits
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'capitalize' }}>
            {tierDisplay} Plan
          </div>
        </div>
      </div>

      {/* Low Credits Warning */}
      {isLowCredits && (
        <div
          style={{
            padding: '4px 8px',
            backgroundColor: `${themeStyles.errorColor}15`,
            borderRadius: '4px',
            fontSize: '12px',
            color: themeStyles.errorColor,
            fontWeight: 500,
          }}
        >
          ⚠️ Low credits
        </div>
      )}

      {/* Upgrade Link */}
      {showUpgradeLink && (
        <button
          onClick={onUpgradeClick}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#FFFFFF',
            backgroundColor: themeStyles.primaryColor,
            border: 'none',
            borderRadius: themeStyles.borderRadius,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ⬆️ Upgrade
        </button>
      )}
    </div>
  );
}
