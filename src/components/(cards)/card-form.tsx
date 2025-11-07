'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateCard } from './useCreateCard';
import { CreditCard, MapPin } from 'lucide-react';
import { useAddressControllerFindDefault } from '@/gen/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddressDialog } from '@/components/(enderecos)/address-dialog';

const cardSchema = z.object({
  number: z.string().min(16, 'Número do cartão inválido').max(19),
  holder_name: z.string().min(3, 'Nome muito curto'),
  exp_month: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Mês inválido'),
  exp_year: z.string().regex(/^\d{4}$/, 'Ano inválido'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
});

type CardFormData = z.infer<typeof cardSchema>;

export function CardForm({ onSuccess }: { onSuccess?: (cardId: string) => void }) {
  const createCard = useCreateCard();
  const { data: defaultAddress, isLoading: isLoadingAddress, refetch } = useAddressControllerFindDefault();

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      number: '',
      holder_name: '',
      exp_month: '',
      exp_year: '',
      cvv: '',
    },
  });

  const onSubmit = async (data: CardFormData) => {
    if (!defaultAddress?.id) {
      toast.error('Você precisa cadastrar um endereço antes de adicionar um cartão');
      return;
    }

    try {
      const result = await createCard.mutateAsync({
        data: {
          ...data,
          exp_month: parseInt(data.exp_month),
          exp_year: parseInt(data.exp_year),
          address_id: defaultAddress.id,
        },
      });
      form.reset();
      const cardId = (result as any)?.id || (result as any)?.card_id || '';
      onSuccess?.(cardId);
    } catch (error) {
    }
  };

  if (isLoadingAddress) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!defaultAddress ? (
          <Alert variant="destructive">
            <MapPin className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Você precisa cadastrar um endereço antes de adicionar um cartão.</span>
              <AddressDialog
                trigger={
                  <Button variant="outline" size="sm">
                    Cadastrar
                  </Button>
                }
                onSuccess={() => refetch()}
              />
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              Este cartão será vinculado ao endereço: <strong>{defaultAddress.label || 'Padrão'}</strong> -{' '}
              {defaultAddress.line_1}, {defaultAddress.city}/{defaultAddress.state}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Cartão</FormLabel>
              <FormControl>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="0000 0000 0000 0000"
                    className="pl-10"
                    maxLength={19}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="holder_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome no Cartão</FormLabel>
              <FormControl>
                <Input {...field} placeholder="NOME COMPLETO" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="exp_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="MM" maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exp_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="AAAA" maxLength={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123" maxLength={4} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createCard.isPending || !defaultAddress}
        >
          {createCard.isPending ? 'Cadastrando...' : 'Cadastrar Cartão'}
        </Button>
      </form>
    </Form>
  );
}
