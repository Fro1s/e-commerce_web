'use client';

import { useProductControllerFindById } from '@/gen/api';

export const productDetailKey = ['products', 'detail'] as const;

export function useProductDetail(id: string) {
  const query = useProductControllerFindById(id, {
    query: {
      queryKey: [...productDetailKey, id],
      enabled: !!id,
    },
  });

  return {
    product: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
