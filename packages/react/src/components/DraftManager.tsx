import React from 'react';
import { useDrafts } from '../hooks/useDrafts';
import type { DraftManagerProps } from '../types';
import type { Draft } from '@urisocial/sdk';

/**
 * DraftManager Component
 *
 * Displays a list of content drafts with pagination,
 * delete, and selection actions.
 *
 * @example
 * ```tsx
 * import { URISocialProvider, DraftManager } from '@urisocial/react';
 *
 * function App() {
 *   return (
 *     <URISocialProvider apiKey="your-api-key">
 *       <DraftManager
 *         onDraftSelect={(id) => console.log('Selected:', id)}
 *         onDraftDelete={(id) => console.log('Deleted:', id)}
 *       />
 *     </URISocialProvider>
 *   );
 * }
 * ```
 */
export function DraftManager({
  onDraftSelect,
  onDraftDelete,
  onDraftPublish,
  pageSize = 20,
  className = '',
  theme,
}: DraftManagerProps) {
  const { drafts, isLoading, error, total, hasMore, loadMore, deleteDraft } = useDrafts(pageSize);

  const themeStyles = {
    primaryColor: theme?.primaryColor || '#CD1B78',
    backgroundColor: theme?.backgroundColor || '#FFFFFF',
    borderColor: theme?.borderColor || '#E5E7EB',
    borderRadius: theme?.borderRadius || '8px',
    fontFamily: theme?.fontFamily || 'Inter, system-ui, sans-serif',
    errorColor: theme?.errorColor || '#EF4444',
  };

  const handleDelete = async (draftId: string) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      await deleteDraft(draftId);
      if (onDraftDelete) onDraftDelete(draftId);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      linkedin: '💼',
      tiktok: '🎵',
    };
    return icons[platform.toLowerCase()] || '📱';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`urisocial-draft-manager ${className}`}
      style={{
        fontFamily: themeStyles.fontFamily,
        backgroundColor: themeStyles.backgroundColor,
        borderRadius: themeStyles.borderRadius,
        padding: '24px',
        border: `1px solid ${themeStyles.borderColor}`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px 0', color: '#1F2937' }}>
            Content Drafts
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            {total} {total === 1 ? 'draft' : 'drafts'} total
          </p>
        </div>
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
      {isLoading && drafts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Loading drafts...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && drafts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#374151', margin: '0 0 8px 0' }}>
            No drafts yet
          </p>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            Generated content will appear here
          </p>
        </div>
      )}

      {/* Draft List */}
      {drafts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onSelect={onDraftSelect}
              onDelete={() => handleDelete(draft.id)}
              onPublish={onDraftPublish}
              theme={themeStyles}
              getPlatformIcon={getPlatformIcon}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 500,
            color: themeStyles.primaryColor,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: themeStyles.borderRadius,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isLoading ? '⏳ Loading...' : '⬇️ Load More'}
        </button>
      )}
    </div>
  );
}

// Draft Card Component
function DraftCard({
  draft,
  onSelect,
  onDelete,
  onPublish,
  theme,
  getPlatformIcon,
  formatDate,
}: {
  draft: Draft;
  onSelect?: (id: string) => void;
  onDelete: () => void;
  onPublish?: (id: string) => void;
  theme: any;
  getPlatformIcon: (platform: string) => string;
  formatDate: (date: string) => string;
}) {
  const firstContent = draft.text_content[0];
  const previewText = firstContent?.text || 'No content';

  return (
    <div
      style={{
        padding: '16px',
        border: `1px solid ${theme.borderColor}`,
        borderRadius: theme.borderRadius,
        backgroundColor: '#FFFFFF',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.primaryColor;
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.borderColor;
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={() => onSelect && onSelect(draft.id)}
    >
      {/* Draft Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          {/* Platforms */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {draft.text_content.map((content, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{getPlatformIcon(content.platform)}</span>
                <span style={{ textTransform: 'capitalize', color: '#6B7280' }}>
                  {content.platform}
                </span>
              </span>
            ))}
          </div>

          {/* Preview Text */}
          <p
            style={{
              fontSize: '14px',
              color: '#374151',
              margin: 0,
              lineHeight: '1.5',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {previewText}
          </p>
        </div>

        {/* Image Thumbnail */}
        {draft.image_url && (
          <img
            src={draft.image_url}
            alt="Draft"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '6px',
              marginLeft: '12px',
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Draft Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
          {formatDate(draft.created_at)}
        </span>

        <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          {onPublish && (
            <button
              onClick={() => onPublish(draft.id)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#FFFFFF',
                backgroundColor: theme.primaryColor,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Publish
            </button>
          )}
          <button
            onClick={onDelete}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 500,
              color: theme.errorColor,
              backgroundColor: `${theme.errorColor}10`,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
