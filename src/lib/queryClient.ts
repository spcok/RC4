import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { get, set, del } from 'idb-keyval';

// 14 Days in milliseconds for compliance
const FOURTEEN_DAYS = 1000 * 60 * 60 * 24 * 14;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: FOURTEEN_DAYS, 
      refetchOnWindowFocus: true, 
      refetchOnReconnect: true, 
      retry: 2, 
    },
  },
});

const idbStorage = {
  setItem: (key: string, value: string) => set(key, value),
  getItem: async (key: string) => {
    const value = await get(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => del(key),
};

export const persister = createSyncStoragePersister({
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  storage: idbStorage as any,
  key: 'koa-offline-cache',
});
