'use client';

import { useAddressControllerCreate } from '@/gen/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const createAddressKey = ['addresses', 'create'] as const;

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useAddressControllerCreate({
    mutation: {
      onSuccess: () => {
        // Invalida queries de endereços para atualizar lista e endereço padrão
        queryClient.invalidateQueries({ queryKey: ['addresses'] });
        toast.success('Endereço criado com sucesso!');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Erro ao criar endereço');
      },
    },
  });
}
