'use client';

import { usePaymentControllerGetOrders } from '@/gen/api';

export const listOrdersKey = ['orders', 'list'] as const;

export function useListOrders() {
  const query = usePaymentControllerGetOrders({
    query: {
      queryKey: listOrdersKey,
    },
  });

  return {
    data: Array.isArray(query.data) ? query.data : [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
