import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { URISocial } from '@urisocial/sdk';
import type { URISocialConfig } from '@urisocial/sdk';

interface URISocialContextValue {
  client: URISocial;
  apiKey: string;
}

const URISocialContext = createContext<URISocialContextValue | null>(null);

export interface URISocialProviderProps {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  children: ReactNode;
}

/**
 * Provider component that initializes the URI Social SDK client
 * and makes it available to all child components.
 *
 * @example
 * ```tsx
 * import { URISocialProvider } from '@urisocial/react';
 *
 * function App() {
 *   return (
 *     <URISocialProvider apiKey="your-api-key">
 *       <YourComponents />
 *     </URISocialProvider>
 *   );
 * }
 * ```
 */
export function URISocialProvider({
  apiKey,
  baseUrl,
  timeout,
  children,
}: URISocialProviderProps) {
  const client = useMemo(() => {
    const config: URISocialConfig = {
      apiKey,
      baseUrl,
      timeout,
    };
    return new URISocial(config);
  }, [apiKey, baseUrl, timeout]);

  const value = useMemo(
    () => ({
      client,
      apiKey,
    }),
    [client, apiKey]
  );

  return (
    <URISocialContext.Provider value={value}>
      {children}
    </URISocialContext.Provider>
  );
}

/**
 * Hook to access the URI Social SDK client from any component
 * within the URISocialProvider.
 *
 * @throws {Error} If used outside of URISocialProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client } = useURISocial();
 *
 *   const handleGenerate = async () => {
 *     const content = await client.content.generate({
 *       seedContent: 'Product launch',
 *       platforms: ['instagram']
 *     });
 *   };
 * }
 * ```
 */
export function useURISocial(): URISocialContextValue {
  const context = useContext(URISocialContext);

  if (!context) {
    throw new Error(
      'useURISocial must be used within a URISocialProvider. ' +
        'Wrap your component tree with <URISocialProvider apiKey="your-api-key">...</URISocialProvider>'
    );
  }

  return context;
}
