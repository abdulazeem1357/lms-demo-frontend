import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient configuration aligned with API client settings:
 * - staleTime: 5 minutes (cache considered fresh)
 * - gcTime: 10 minutes (cache deleted after)
 * - retry: 1 (matches API client retry configuration)
 * - Disabled window focus refetching (handled by manual invalidation)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1, // Matches API client retry setting
      refetchOnWindowFocus: false,
    },
  },
});