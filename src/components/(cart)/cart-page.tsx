'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoginDialog } from '@/components/(auth)/login-dialog';

export function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleCheckout = () => {
    if (!session) {
      setShowLoginDialog(true);
      return;
    }
    proceedToCheckout();
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-24 h-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione produtos para continuar comprando
            </p>
            <Button asChild>
              <Link href="/">Ver Produtos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Carrinho de Compras</h1>
            <Button variant="outline" size="sm" onClick={clearCart}>
              Limpar Carrinho
            </Button>
          </div>

          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-md overflow-hidden bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 shrink-0">
                    {item.imageUrl && !imageErrors[item.productId] ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [item.productId]: true }))}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                          <ShoppingCart className="w-10 h-10 relative text-primary/40" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-primary font-bold text-sm sm:text-base">{formatPrice(item.price)}</p>
                      </div>
                      <p className="font-bold text-base sm:text-lg shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                        className="sm:ml-auto"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" onClick={handleCheckout}>
                Finalizar Compra
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button variant="outline" className="w-full mt-3" asChild>
                <Link href="/">Continuar Comprando</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={proceedToCheckout}
      />
    </div>
  );
}
