import { useState, useCallback } from 'react';
import { useURISocial } from '../context/URISocialContext';
import type { ContentGenerationRequest, GeneratedContent } from '@urisocial/sdk';

interface UseContentGenerationResult {
  content: GeneratedContent | null;
  isGenerating: boolean;
  error: Error | null;
  generate: (request: ContentGenerationRequest) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for content generation functionality
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { content, isGenerating, error, generate } = useContentGeneration();
 *
 *   const handleGenerate = () => {
 *     generate({
 *       seedContent: 'Product launch',
 *       platforms: ['instagram', 'facebook']
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleGenerate} disabled={isGenerating}>
 *         {isGenerating ? 'Generating...' : 'Generate'}
 *       </button>
 *       {error && <p>Error: {error.message}</p>}
 *       {content && <pre>{JSON.stringify(content, null, 2)}</pre>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useContentGeneration(): UseContentGenerationResult {
  const { client } = useURISocial();
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(
    async (request: ContentGenerationRequest) => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await client.content.generate(request);
        setContent(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [client]
  );

  const reset = useCallback(() => {
    setContent(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  return {
    content,
    isGenerating,
    error,
    generate,
    reset,
  };
}
