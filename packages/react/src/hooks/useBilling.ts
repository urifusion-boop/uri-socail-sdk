import { useState, useEffect, useCallback } from 'react';
import { useURISocial } from '../context/URISocialContext';
import type { UsageInfo } from '@urisocial/sdk';

interface UseBillingResult {
  billingInfo: UsageInfo | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook for billing and usage information (read-only)
 *
 * @example
 * ```tsx
 * function UsageDisplay() {
 *   const { billingInfo, isLoading } = useBilling();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <p>Credits: {billingInfo?.credits_remaining}</p>
 *       <p>Tier: {billingInfo?.subscription_tier}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBilling(): UseBillingResult {
  const { client } = useURISocial();
  const [billingInfo, setBillingInfo] = useState<UsageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBillingInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const info = await client.billing.getUsageInfo();
      setBillingInfo(info);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load billing info');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchBillingInfo();
  }, [fetchBillingInfo]);

  return {
    billingInfo,
    isLoading,
    error,
    refresh: fetchBillingInfo,
  };
}
