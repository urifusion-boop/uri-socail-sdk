import { useState, useEffect, useCallback } from 'react';
import { useURISocial } from '../context/URISocialContext';
import type { Connection, Platform } from '@urisocial/sdk';

interface UseConnectionsResult {
  connections: Connection[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  disconnect: (platform: Platform) => Promise<void>;
  getConnectUrl: (platform: Platform, redirectUrl?: string) => Promise<string>;
}

/**
 * Hook for managing social media connections
 *
 * @example
 * ```tsx
 * function ConnectionManager() {
 *   const { connections, disconnect, getConnectUrl } = useConnections();
 *
 *   const handleConnect = async (platform) => {
 *     const authUrl = await getConnectUrl(platform);
 *     window.location.href = authUrl;
 *   };
 *
 *   return (
 *     <div>
 *       {connections.map(conn => (
 *         <div key={conn.platform}>
 *           {conn.platform}: {conn.account_name}
 *           <button onClick={() => disconnect(conn.platform)}>Disconnect</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useConnections(): UseConnectionsResult {
  const { client } = useURISocial();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConnections = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await client.connections.list();
      setConnections(response.connected_platforms || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load connections');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const disconnect = useCallback(
    async (platform: Platform) => {
      await client.connections.disconnect(platform);
      setConnections((prev) => prev.filter((c) => c.platform !== platform));
    },
    [client]
  );

  const getConnectUrl = useCallback(
    async (platform: Platform, redirectUrl?: string): Promise<string> => {
      const response = await client.connections.getConnectUrl(platform, redirectUrl);
      return response.auth_url;
    },
    [client]
  );

  return {
    connections,
    isLoading,
    error,
    refresh: fetchConnections,
    disconnect,
    getConnectUrl,
  };
}
