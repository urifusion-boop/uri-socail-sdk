/**
 * React SDK Types
 */

import { Platform } from '@urisocial/sdk';

export interface URISocialTheme {
  primaryColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  errorColor?: string;
  successColor?: string;
}

export interface BaseComponentProps {
  className?: string;
  theme?: URISocialTheme;
}

export interface ContentGeneratorProps extends BaseComponentProps {
  platforms?: Platform[];
  defaultSeedContent?: string;
  defaultTone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'playful';
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  showImageUpload?: boolean;
  onGenerating?: (progress: number) => void;
  onContentGenerated?: (content: any) => void;
  onError?: (error: Error) => void;
  onCreditsLow?: (remaining: number) => void;
}

export interface DraftManagerProps extends BaseComponentProps {
  onDraftSelect?: (draftId: string) => void;
  onDraftDelete?: (draftId: string) => void;
  onDraftPublish?: (draftId: string) => void;
  pageSize?: number;
}

export interface ConnectionManagerProps extends BaseComponentProps {
  onConnectionAdded?: (platform: Platform) => void;
  onConnectionRemoved?: (platform: Platform) => void;
  redirectUrl?: string;
}

export interface PublishingPanelProps extends BaseComponentProps {
  draftId: string;
  availablePlatforms?: Platform[];
  onPublishSuccess?: (results: any[]) => void;
  onPublishError?: (error: Error) => void;
}


export interface ImageUploadProps extends BaseComponentProps {
  accept?: string;
  maxSize?: number;
  onUpload?: (file: File | string) => void;
  onError?: (error: string) => void;
}
