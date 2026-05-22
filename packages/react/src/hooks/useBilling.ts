import { useState, useEffect, useCallback } from 'react';
import { useURISocial } from '../context/URISocialContext';
import type { BillingInfo } from '@urisocial/sdk';

interface UseBillingResult {
  billingInfo: BillingInfo | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  purchaseCredits: (amount: number) => Promise<string>;
}

/**
 * Hook for billing and credits management
 *
 * @example
 * ```tsx
 * function CreditDisplay() {
 *   const { billingInfo, purchaseCredits } = useBilling();
 *
 *   const handlePurchase = async () => {
 *     const checkoutUrl = await purchaseCredits(100);
 *     window.location.href = checkoutUrl;
 *   };
 *
 *   return (
 *     <div>
 *       <p>Credits: {billingInfo?.credits_remaining}</p>
 *       <button onClick={handlePurchase}>Buy 100 Credits</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBilling(): UseBillingResult {
  const { client } = useURISocial();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBillingInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const info = await client.billing.getInfo();
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

  const purchaseCredits = useCallback(
    async (amount: number): Promise<string> => {
      const response = await client.billing.purchaseCredits(amount);
      return response.checkout_url;
    },
    [client]
  );

  return {
    billingInfo,
    isLoading,
    error,
    refresh: fetchBillingInfo,
    purchaseCredits,
  };
}
