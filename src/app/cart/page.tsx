'use client';

import { Navbar } from '@/components/(products)/home/navbar';
import { Footer } from '@/components/(products)/home/footer';
import { CartPage } from '@/components/(cart)/cart-page';

export default function Carrinho() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CartPage />
      </main>
      <Footer />
    </div>
  );
}
