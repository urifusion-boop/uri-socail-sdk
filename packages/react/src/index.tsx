/**
 * URI Social React SDK
 *
 * React components and hooks for integrating URI Social's
 * AI-powered content generation into your application.
 *
 * @packageDocumentation
 */

// Context & Provider
export { URISocialProvider, useURISocial } from './context/URISocialContext';

// Hooks
export { useContentGeneration } from './hooks/useContentGeneration';
export { useDrafts } from './hooks/useDrafts';
export { useConnections } from './hooks/useConnections';

// Components
export { ContentGenerator } from './components/ContentGenerator';
export { DraftManager } from './components/DraftManager';
export { ConnectionManager } from './components/ConnectionManager';

// Types
export type {
  URISocialTheme,
  BaseComponentProps,
  ContentGeneratorProps,
  DraftManagerProps,
  ConnectionManagerProps,
} from './types';

// Re-export core SDK types for convenience
export type {
  Platform,
  ContentGenerationRequest,
  ContentGenerationResponse,
  PlatformContent,
  Draft,
  ImageGenerationRequest,
  ImageGenerationResult,
  Connection,
} from '@urisocial/sdk';
