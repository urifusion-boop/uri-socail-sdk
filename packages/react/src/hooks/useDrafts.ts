import { useState, useEffect, useCallback } from 'react';
import { useURISocial } from '../context/URISocialContext';
import type { Draft, PaginatedResponse } from '@urisocial/sdk';

interface UseDraftsResult {
  drafts: Draft[];
  isLoading: boolean;
  error: Error | null;
  total: number;
  page: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  deleteDraft: (draftId: string) => Promise<void>;
}

/**
 * Hook for managing drafts with pagination
 *
 * @example
 * ```tsx
 * function DraftList() {
 *   const { drafts, isLoading, loadMore, hasMore, deleteDraft } = useDrafts();
 *
 *   return (
 *     <div>
 *       {drafts.map(draft => (
 *         <div key={draft.id}>
 *           <h3>{draft.text_content[0]?.text}</h3>
 *           <button onClick={() => deleteDraft(draft.id)}>Delete</button>
 *         </div>
 *       ))}
 *       {hasMore && <button onClick={loadMore}>Load More</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDrafts(pageSize: number = 20): UseDraftsResult {
  const { client } = useURISocial();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchDrafts = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await client.drafts.list(pageNum, pageSize);
        const typedResponse = response as PaginatedResponse<Draft>;

        if (append) {
          setDrafts((prev) => [...prev, ...typedResponse.data]);
        } else {
          setDrafts(typedResponse.data);
        }

        setTotal(typedResponse.total);
        setHasMore(typedResponse.has_more);
        setPage(pageNum);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load drafts');
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [client, pageSize]
  );

  useEffect(() => {
    fetchDrafts(1);
  }, [fetchDrafts]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      fetchDrafts(page + 1, true);
    }
  }, [hasMore, isLoading, page, fetchDrafts]);

  const refresh = useCallback(() => {
    fetchDrafts(1);
  }, [fetchDrafts]);

  const deleteDraft = useCallback(
    async (draftId: string) => {
      await client.drafts.delete(draftId);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      setTotal((prev) => prev - 1);
    },
    [client]
  );

  return {
    drafts,
    isLoading,
    error,
    total,
    page,
    hasMore,
    loadMore,
    refresh,
    deleteDraft,
  };
}
