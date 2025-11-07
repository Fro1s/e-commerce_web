'use client';

import { userControllerCreate } from '@/gen/api';
import { toast } from 'sonner';

export const createUserKey = ['users', 'create'] as const;

export function useCreateUser() {
  const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    document: string;
    phone: string;
  }) => {
    try {
      const response = await userControllerCreate({ ...data, description: "", birthdate: new Date().toISOString() });
      toast.success('Conta criada com sucesso!');
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Erro ao criar conta';
      toast.error(errorMessage);
      throw error;
    }
  };

  return { createUser };
}
