'use client';

import { use } from 'react';
import { usePaymentControllerGetOrder } from '@/gen/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, MapPin, CreditCard, QrCode, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200'
  },
  processing: {
    label: 'Processando',
    icon: Package,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200'
  },
  paid: {
    label: 'Pago',
    icon: CheckCircle2,
    color: 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200'
  },
  failed: {
    label: 'Falhou',
    icon: XCircle,
    color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200'
  },
  canceled: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-gray-600 bg-gray-50 dark:bg-gray-950/20 border-gray-200'
  },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: order, isLoading } = usePaymentControllerGetOrder(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-7xl">
        <div className="flex items-center justify-center">
          <div className="text-center space-y-3">
            <Package className="w-12 h-12 text-muted-foreground mx-auto animate-pulse" />
            <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pedido não encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Não foi possível encontrar este pedido
            </p>
            <Button onClick={() => router.push('/orders')}>
              Ver Meus Pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Type assertion for order
  const orderData = order as any;
  const status = statusConfig[orderData.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
      <Button
        variant="ghost"
        className="mb-6 -ml-2"
        onClick={() => router.push('/orders')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Meus Pedidos
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`border-2 ${status.color}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">
                      Pedido #{orderData.id.slice(0, 8).toUpperCase()}
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    Realizado em {formatDate(orderData.created_at)} às {formatTime(orderData.created_at)}
                  </p>
                </div>
                <Badge className={`${status.color} border-0`}>
                  {status.label}
                </Badge>
              </div>

              {orderData.updated_at && orderData.updated_at !== orderData.created_at && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Última atualização: {formatDate(orderData.updated_at)} às {formatTime(orderData.updated_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.items?.map((item: any, index: number) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.description || 'Produto'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          {item.description || 'Produto: ' + item.product.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Quantidade: {item.quantity}</span>
                          <span>•</span>
                          <span>{formatPrice(item.amount / item.quantity)} cada</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatPrice(item.amount)}</p>
                      </div>
                    </div>
                    {index < (orderData.items?.length || 0) - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(orderData.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span>Grátis</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(orderData.amount)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {orderData.payment_method === 'credit_card' ? (
                  <>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Cartão de Crédito</p>
                      <p className="text-sm text-muted-foreground">
                        Pagamento processado
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <QrCode className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">PIX</p>
                      <p className="text-sm text-muted-foreground">
                        Pagamento instantâneo
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {orderData.customer?.addresses?.[0] && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{orderData.customer.addresses[0].line_1}</p>
                  {orderData.customer.addresses[0].line_2 && (
                    <p>{orderData.customer.addresses[0].line_2}</p>
                  )}
                  <p>
                    {orderData.customer.addresses[0].city} - {orderData.customer.addresses[0].state}
                  </p>
                  <p className="text-muted-foreground">
                    CEP: {orderData.customer.addresses[0].zip_code}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
