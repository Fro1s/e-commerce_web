'use client';

import { OrdersList } from './list';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Orders() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            Acompanhe o status e detalhes dos seus pedidos
          </p>
        </div>
        <Button onClick={() => router.push('/')} className="hidden sm:flex">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Continuar Comprando
        </Button>
      </div>

      <OrdersList />
    </div>
  );
}
