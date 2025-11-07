'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePaymentControllerGetOrder } from '@/gen/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Clock, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface PixPaymentProps {
  orderId: string;
  qrCodeData: string;
  qrCodeImage: string;
  amount: number;
}

export function PixPayment({ orderId, qrCodeData, qrCodeImage, amount }: PixPaymentProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Poll order status
  const { data: order, refetch } = usePaymentControllerGetOrder(orderId, {
    query: {
      refetchInterval: 3000, // Check every 3 seconds
      enabled: !isRedirecting, // Stop polling when redirecting
    },
  });

  const orderData = order as any;

  useEffect(() => {
    // Check if order is paid - only redirect if payment is confirmed
    if (!isRedirecting && orderData?.status === 'paid') {
      setIsRedirecting(true);
      toast.success('Pagamento confirmado!');
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 1500);
    }
  }, [orderData?.status, orderId, router, isRedirecting]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar código');
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <QrCode className="h-6 w-6" />
            Pagamento via PIX
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Aguardando pagamento...
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
            <p className="text-3xl font-bold">{formatPrice(amount)}</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative bg-white p-4 rounded-lg border-2 border-border">
              {qrCodeImage ? (
                <Image
                  src={qrCodeImage}
                  alt="QR Code PIX"
                  width={256}
                  height={256}
                  className="w-64 h-64"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-muted">
                  <QrCode className="w-32 h-32 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Escaneie o QR Code com o app do seu banco ou copie o código abaixo
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Código PIX (Copia e Cola)</p>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {qrCodeData}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="font-medium text-sm">Como pagar:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Escolha pagar via PIX</li>
              <li>Escaneie o QR Code ou cole o código</li>
              <li>Confirme o pagamento</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/cart')}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={() => refetch()}
            >
              Verificar Pagamento
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Pedido #{orderId.slice(0, 8)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
