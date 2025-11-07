'use client';

import { useListOrders } from './useListOrders';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Package, Clock, CheckCircle2, XCircle, CreditCard, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

const statusConfig = {
  pending: {
    label: 'Pendente',
    variant: 'default' as const,
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
  },
  processing: {
    label: 'Processando',
    variant: 'default' as const,
    icon: Package,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
  },
  paid: {
    label: 'Pago',
    variant: 'default' as const,
    icon: CheckCircle2,
    color: 'text-green-600 bg-green-50 dark:bg-green-950/20'
  },
  failed: {
    label: 'Falhou',
    variant: 'destructive' as const,
    icon: XCircle,
    color: 'text-red-600 bg-red-50 dark:bg-red-950/20'
  },
  canceled: {
    label: 'Cancelado',
    variant: 'secondary' as const,
    icon: XCircle,
    color: 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
  },
};

export function OrdersList() {
  const router = useRouter();
  const { data: orders, isLoading } = useListOrders();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Package className="w-12 h-12 text-muted-foreground mx-auto animate-pulse" />
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            Você ainda não realizou nenhum pedido. Que tal começar agora?
          </p>
          <Button onClick={() => router.push('/')} size="lg">
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    );
  }

  const ordersList = orders as any[];

  return (
    <div className="space-y-6">
      {ordersList.map((order: any) => {
        const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
        const StatusIcon = status.icon;
        const itemCount = order.items?.length || 0;

        return (
          <Card
            key={order.id}
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            <CardContent className="p-0">
              <div className={`px-6 py-4 flex items-center justify-between ${status.color} border-b`}>
                <div className="flex items-center gap-3">
                  <StatusIcon className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm opacity-80">
                      {formatDate(order.created_at)} às {formatTime(order.created_at)}
                    </p>
                  </div>
                </div>
                <Badge variant={status.variant} className="font-medium">
                  {status.label}
                </Badge>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">
                      {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {order.payment_method === 'credit_card' ? (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">Cartão de Crédito</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4" />
                        <span className="text-sm">PIX</span>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(order.amount)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="group-hover:bg-primary/10 group-hover:text-primary"
                  >
                    Ver Detalhes
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
