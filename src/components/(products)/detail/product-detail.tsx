'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Package, Truck, Shield, CreditCard } from 'lucide-react';
import { useProductDetail } from './useProductDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/cart-context';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoginDialog } from '@/components/(auth)/login-dialog';
import { formatPrice } from '@/lib/utils';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { product, isLoading } = useProductDetail(productId);
  const { addItem } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    if (product && quantity < productData.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: productData.id,
      name: productData.name,
      price: productData.amount / 100,
      imageUrl: productData.image_url,
      stock: productData.stock,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!session) {
      setShowLoginDialog(true);
      return;
    }

    proceedToCheckout();
  };

  const proceedToCheckout = () => {
    if (!product) return;

    addItem({
      productId: productData.id,
      name: productData.name,
      price: productData.amount / 100,
      imageUrl: productData.image_url,
      stock: productData.stock,
      quantity,
    });

    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
            <p className="text-muted-foreground">
              O produto que você está procurando não existe ou foi removido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const productData = product as any;

  const isOutOfStock = productData.stock <= 0;
  const isLowStock = productData.stock > 0 && productData.stock < 10;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-linear-to-br from-primary/5 via-primary/10 to-primary/5">
          {productData.image_url && !imageError ? (
            <Image
              src={productData.image_url}
              alt={productData.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <ShoppingCart className="w-32 h-32 relative text-primary/40" />
              </div>
              <span className="text-lg font-medium text-muted-foreground/60">
                {imageError ? 'Imagem indisponível' : 'Sem imagem'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
            {productData.code && (
              <p className="text-sm text-muted-foreground">
                Código: {productData.code}
              </p>
            )}
          </div>

          <div>
            <div className="text-4xl font-bold text-primary mb-2">
              {formatPrice(productData.amount)}
            </div>
            {isOutOfStock && (
              <p className="text-destructive font-medium">Produto esgotado</p>
            )}
            {isLowStock && (
              <p className="text-orange-600 font-medium">
                Apenas {productData.stock} unidades disponíveis
              </p>
            )}
            {!isOutOfStock && !isLowStock && (
              <p className="text-green-600 font-medium">Em estoque</p>
            )}
          </div>

          {productData.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground leading-relaxed">
                {productData.description}
              </p>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Quantidade
              </label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrement}
                  disabled={quantity >= productData.stock || isOutOfStock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar
              </Button>
              <Button
                size="lg"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Comprar Agora
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Entrega Rápida</h3>
                    <p className="text-sm text-muted-foreground">
                      Receba em até 7 dias úteis
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Compra Segura</h3>
                    <p className="text-sm text-muted-foreground">
                      Seus dados estão protegidos
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Garantia de Qualidade</h3>
                    <p className="text-sm text-muted-foreground">
                      Produtos originais e de qualidade
                    </p>
                  </div>
                </div>
              </div>
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
