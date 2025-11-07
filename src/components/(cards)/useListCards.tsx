'use client';

import { usePaymentControllerGetCards } from '@/gen/api';

export const listCardsKey = ['cards', 'list'] as const;

export function useListCards() {
  const query = usePaymentControllerGetCards({
    query: {
      queryKey: listCardsKey,
    },
  });

  return {
    data: Array.isArray(query.data) ? query.data : [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
