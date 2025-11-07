'use client';

import { use } from 'react';
import { usePaymentControllerGetOrder } from '@/gen/api';
import { PixPayment } from '@/components/(checkout)/pix-payment';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PixPaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: order, isLoading } = usePaymentControllerGetOrder(resolvedParams.orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-2xl">
        <div className="text-center">Carregando pagamento...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-xl font-semibold mb-2">Pedido não encontrado</h3>
            <Button onClick={() => router.push('/')}>
              Voltar para Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get PIX data directly from order
  const orderData = order as any;

  // Check if QR Code data is available
  if (!orderData.qr_code || !orderData.qr_code_url) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-xl font-semibold mb-2">QR Code não disponível</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível gerar o QR Code para este pedido
            </p>
            <Button onClick={() => router.push('/orders')}>
              Ver Meus Pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PixPayment
      orderId={orderData.id}
      qrCodeData={orderData.qr_code}
      qrCodeImage={orderData.qr_code_url}
      amount={orderData.amount}
    />
  );
}
