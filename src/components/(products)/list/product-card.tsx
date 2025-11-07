'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  stock,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      price,
      imageUrl,
      stock,
      quantity: 1,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-square w-full bg-linear-to-br from-primary/5 via-primary/10 to-primary/5">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <ShoppingCart className="w-20 h-20 relative text-primary/40" />
              </div>
              <span className="text-sm font-medium text-muted-foreground/60">
                {imageError ? 'Imagem indisponível' : 'Sem imagem'}
              </span>
            </div>
          )}
        </div>
      </Link>

      <Link href={`/products/${id}`} className="block">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
          <div className="mt-3">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(price * 100)}
            </span>
          </div>
          {stock <= 0 && (
            <p className="text-sm text-destructive mt-2">Produto esgotado</p>
          )}
          {stock > 0 && stock < 10 && (
            <p className="text-sm text-orange-600 mt-2">
              Apenas {stock} unidades disponíveis
            </p>
          )}
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={stock <= 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {stock <= 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
        </Button>
      </CardFooter>
    </Card>
  );
}
