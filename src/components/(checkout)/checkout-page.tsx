'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, QrCode, ShoppingCart, MapPin } from 'lucide-react';
import { CardSelector } from '@/components/(cards)/card-selector';
import { AddressSelector } from '@/components/(enderecos)/address-selector';
import { usePaymentControllerCreateOrder, useAddressControllerFindDefault } from '@/gen/api';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [cardId, setCardId] = useState<string>('');
  const [addressId, setAddressId] = useState<string>('');

  const { data: defaultAddress } = useAddressControllerFindDefault();

  // Set default address when loaded
  useEffect(() => {
    if (defaultAddress?.id && !addressId) {
      setAddressId(defaultAddress.id);
    }
  }, [defaultAddress, addressId]);

  const createOrder = usePaymentControllerCreateOrder({
    mutation: {
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Erro ao criar pedido');
      },
    },
  });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    if (!handleCheckoutValidation()) {
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: Math.round(item.price * 100), // Convert to cents
      })),
      payment_method: (paymentMethod === 'card' ? 'credit_card' : 'pix') as 'credit_card' | 'pix',
      ...(paymentMethod === 'card' && { card_id: cardId }),
    };

    try {
      const result = await createOrder.mutateAsync({ data: orderData });

      // Backend retorna o pedido criado
      const order = result as any;

      clearCart();
      toast.success('Pedido criado com sucesso!');

      // Redirecionar baseado no método de pagamento
      if (paymentMethod === 'pix') {
        router.push(`/pix/${order.id}`);
      } else {
        router.push(`/orders/${order.id}`);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCheckoutValidation = () => {
    if (!addressId) {
      toast.error('Selecione um endereço de entrega');
      return false;
    }
    if (paymentMethod === 'card' && !cardId) {
      toast.error('Selecione um cartão para pagamento');
      return false;
    }
    return true;
  };

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-24 h-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Carrinho vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione produtos para finalizar a compra
            </p>
            <Button onClick={() => router.push('/')}>Ver Produtos</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddressSelector
                selectedAddressId={addressId}
                onAddressSelect={setAddressId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'pix' | 'card')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pix">
                    <QrCode className="w-4 h-4 mr-2" />
                    PIX
                  </TabsTrigger>
                  <TabsTrigger value="card">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Cartão
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pix" className="space-y-4 mt-4">
                  <div className="border rounded-lg p-6 text-center">
                    <QrCode className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Pagamento via PIX</h3>
                    <p className="text-sm text-muted-foreground">
                      Após confirmar, você receberá o QR Code para pagamento
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-4">
                  <CardSelector
                    selectedCardId={cardId}
                    onCardSelect={setCardId}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={createOrder.isPending || !addressId || (paymentMethod === 'card' && !cardId)}
              >
                {createOrder.isPending ? 'Processando...' : 'Confirmar Pedido'}
              </Button>

              <Button variant="outline" className="w-full" onClick={() => router.push('/cart')}>
                Voltar ao Carrinho
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
