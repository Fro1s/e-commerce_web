'use client';

import { usePaymentControllerCreateCard } from '@/gen/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const createCardKey = ['cards', 'create'] as const;

export function useCreateCard() {
  const queryClient = useQueryClient();

  return usePaymentControllerCreateCard({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cards'] });
        toast.success('Cartão cadastrado com sucesso!');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Erro ao cadastrar cartão');
      },
    },
  });
}
