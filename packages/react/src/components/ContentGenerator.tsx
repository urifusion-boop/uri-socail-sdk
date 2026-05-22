import React, { useState, useRef } from 'react';
import { useContentGeneration } from '../hooks/useContentGeneration';
import { useBilling } from '../hooks/useBilling';
import type { ContentGeneratorProps } from '../types';
import type { Platform } from '@urisocial/sdk';

const PLATFORMS: Array<{ key: Platform; label: string; icon: string; color: string }> = [
  { key: 'facebook', label: 'Facebook', icon: '📘', color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', icon: '📷', color: '#E1306C' },
  { key: 'twitter', label: 'Twitter / X', icon: '🐦', color: '#1DA1F2' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000000' },
];

const TONES = [
  { value: 'professional', label: 'Professional', emoji: '👔' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'friendly', label: 'Friendly', emoji: '🤝' },
  { value: 'formal', label: 'Formal', emoji: '🎩' },
  { value: 'playful', label: 'Playful', emoji: '🎉' },
] as const;

/**
 * ContentGenerator Component
 *
 * Full-featured content generation form with image upload,
 * platform selection, and tone customization.
 *
 * @example
 * ```tsx
 * import { URISocialProvider, ContentGenerator } from '@urisocial/react';
 *
 * function App() {
 *   return (
 *     <URISocialProvider apiKey="your-api-key">
 *       <ContentGenerator
 *         platforms={['instagram', 'facebook']}
 *         onContentGenerated={(content) => console.log(content)}
 *       />
 *     </URISocialProvider>
 *   );
 * }
 * ```
 */
export function ContentGenerator({
  platforms = ['instagram', 'facebook'],
  defaultSeedContent = '',
  defaultTone = 'professional',
  includeHashtags = true,
  includeEmojis = true,
  showImageUpload = true,
  onGenerating,
  onContentGenerated,
  onError,
  onCreditsLow,
  className = '',
  theme,
}: ContentGeneratorProps) {
  const { generate, isGenerating, error } = useContentGeneration();
  const { billingInfo } = useBilling();

  const [seedContent, setSeedContent] = useState(defaultSeedContent);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(platforms);
  const [tone, setTone] = useState<typeof defaultTone>(defaultTone);
  const [includeHashtagsState, setIncludeHashtagsState] = useState(includeHashtags);
  const [includeEmojisState, setIncludeEmojisState] = useState(includeEmojis);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceImageName, setReferenceImageName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeStyles = {
    primaryColor: theme?.primaryColor || '#CD1B78',
    backgroundColor: theme?.backgroundColor || '#FFFFFF',
    borderColor: theme?.borderColor || '#E5E7EB',
    borderRadius: theme?.borderRadius || '8px',
    fontFamily: theme?.fontFamily || 'Inter, system-ui, sans-serif',
    errorColor: theme?.errorColor || '#EF4444',
    successColor: theme?.successColor || '#10B981',
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      if (onError) onError(new Error('Please upload an image file'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      if (onError) onError(new Error('Image must be under 10MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
      setReferenceImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processImageFile(files[0]);
  };

  const handleGenerate = async () => {
    if (!seedContent.trim()) {
      if (onError) onError(new Error('Please enter content description'));
      return;
    }

    if (selectedPlatforms.length === 0) {
      if (onError) onError(new Error('Please select at least one platform'));
      return;
    }

    // Check credits
    if (billingInfo && billingInfo.credits_remaining < 10) {
      if (onCreditsLow) onCreditsLow(billingInfo.credits_remaining);
    }

    try {
      if (onGenerating) onGenerating(0);

      await generate({
        seedContent,
        platforms: selectedPlatforms,
        referenceImage: referenceImage || undefined,
        tone,
        includeHashtags: includeHashtagsState,
        includeEmojis: includeEmojisState,
      });

      if (onGenerating) onGenerating(100);
      if (onContentGenerated) {
        // Will be called via useContentGeneration hook
      }
    } catch (err) {
      if (onError && err instanceof Error) onError(err);
    }
  };

  return (
    <div
      className={`urisocial-content-generator ${className}`}
      style={{
        fontFamily: themeStyles.fontFamily,
        backgroundColor: themeStyles.backgroundColor,
        borderRadius: themeStyles.borderRadius,
        padding: '24px',
        border: `1px solid ${themeStyles.borderColor}`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px 0', color: '#1F2937' }}>
          Generate Content
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
          Describe your content and select platforms to generate AI-powered social media posts
        </p>
      </div>

      {/* Seed Content Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
          Content Description *
        </label>
        <textarea
          value={seedContent}
          onChange={(e) => setSeedContent(e.target.value)}
          placeholder="E.g., Launch our new luxury perfume collection with notes of jasmine and vanilla"
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            fontSize: '14px',
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: themeStyles.borderRadius,
            fontFamily: themeStyles.fontFamily,
            resize: 'vertical',
          }}
          disabled={isGenerating}
        />
      </div>

      {/* Platform Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
          Select Platforms *
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PLATFORMS.map((platform) => (
            <button
              key={platform.key}
              onClick={() => togglePlatform(platform.key)}
              disabled={isGenerating}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                border: selectedPlatforms.includes(platform.key)
                  ? `2px solid ${themeStyles.primaryColor}`
                  : `1px solid ${themeStyles.borderColor}`,
                borderRadius: themeStyles.borderRadius,
                backgroundColor: selectedPlatforms.includes(platform.key) ? `${themeStyles.primaryColor}10` : '#FFFFFF',
                color: selectedPlatforms.includes(platform.key) ? themeStyles.primaryColor : '#374151',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontWeight: selectedPlatforms.includes(platform.key) ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span>{platform.icon}</span>
              <span>{platform.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
          Tone
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              disabled={isGenerating}
              style={{
                padding: '8px 14px',
                fontSize: '13px',
                border: tone === t.value ? `2px solid ${themeStyles.primaryColor}` : `1px solid ${themeStyles.borderColor}`,
                borderRadius: themeStyles.borderRadius,
                backgroundColor: tone === t.value ? `${themeStyles.primaryColor}10` : '#FFFFFF',
                color: tone === t.value ? themeStyles.primaryColor : '#6B7280',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontWeight: tone === t.value ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeHashtagsState}
            onChange={(e) => setIncludeHashtagsState(e.target.checked)}
            disabled={isGenerating}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span style={{ color: '#374151' }}>Include hashtags</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeEmojisState}
            onChange={(e) => setIncludeEmojisState(e.target.checked)}
            disabled={isGenerating}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span style={{ color: '#374151' }}>Include emojis</span>
        </label>
      </div>

      {/* Image Upload */}
      {showImageUpload && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
            Reference Image (Optional)
          </label>
          {referenceImage ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={referenceImage}
                alt="Reference"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: themeStyles.borderRadius,
                  border: `1px solid ${themeStyles.borderColor}`,
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>{referenceImageName}</p>
                <button
                  onClick={() => {
                    setReferenceImage(null);
                    setReferenceImageName('');
                  }}
                  disabled={isGenerating}
                  style={{
                    fontSize: '13px',
                    color: themeStyles.errorColor,
                    background: 'none',
                    border: 'none',
                    padding: '4px 0',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isGenerating && fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: isDragging ? `2px solid ${themeStyles.primaryColor}` : `1.5px dashed ${themeStyles.borderColor}`,
                borderRadius: themeStyles.borderRadius,
                padding: '24px',
                textAlign: 'center',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                backgroundColor: isDragging ? `${themeStyles.primaryColor}05` : '#FAFAFA',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📤</div>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                {isDragging ? 'Drop image here' : 'Click, drag, or paste image'}
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>PNG, JPG up to 10MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Credits Display */}
      {billingInfo && (
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: themeStyles.borderRadius }}>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            Credits remaining: <strong style={{ color: '#374151' }}>{billingInfo.credits_remaining}</strong>
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: `${themeStyles.errorColor}10`,
            borderRadius: themeStyles.borderRadius,
            border: `1px solid ${themeStyles.errorColor}`,
          }}
        >
          <p style={{ fontSize: '14px', color: themeStyles.errorColor, margin: 0 }}>{error.message}</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !seedContent.trim() || selectedPlatforms.length === 0}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#FFFFFF',
          backgroundColor: isGenerating || !seedContent.trim() || selectedPlatforms.length === 0 ? '#9CA3AF' : themeStyles.primaryColor,
          border: 'none',
          borderRadius: themeStyles.borderRadius,
          cursor: isGenerating || !seedContent.trim() || selectedPlatforms.length === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {isGenerating ? '⏳ Generating...' : '✨ Generate Content'}
      </button>
    </div>
  );
}
