'use client';

import { useState } from 'react';
import { useProductControllerFindAll } from '@/gen/api';

export const listProductsKey = ['products', 'list'] as const;

export function useListProducts() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [search, setSearch] = useState('');

  const query = useProductControllerFindAll(
    {
      page,
      perPage,
      search: search || '',
    },
    {
      query: {
        queryKey: [...listProductsKey, { page, perPage, search }],
        retry: false,
      },
    }
  );

  const responseData = query.data as any;
  const products = responseData?.data || [];
  const total = responseData?.meta?.total || 0;
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 1;

  return {
    products,
    totalPages,
    isLoading: query.isLoading,
    error: query.error,
    page,
    perPage,
    search,
    handlePageChange: setPage,
    handlePerPageChange: setPerPage,
    handleSearchChange: setSearch,
  };
}
