'use client';

import { Navbar } from '@/components/(products)/home/navbar';
import { Footer } from '@/components/(products)/home/footer';
import { ProductDetail } from '@/components/(products)/detail/product-detail';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <ProductDetail productId={productId} />
      </main>

      <Footer />
    </div>
  );
}
