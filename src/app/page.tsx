'use client';

import { Navbar } from '@/components/(products)/home/navbar';
import { ProductGrid } from '@/components/(products)/home/product-grid';
import { Footer } from '@/components/(products)/home/footer';
import { FeaturedCarousel } from '@/components/(products)/home/featured-carousel';
import { useListProducts } from '@/components/(products)/list/useListProducts';

export default function Home() {
  const {
    products,
    isLoading,
    page,
    totalPages,
    handlePageChange,
    handleSearchChange,
  } = useListProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearchChange} />

      <main className="flex-1">
        <section className="py-12">
          <FeaturedCarousel />
        </section>

        <section className="container py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Nossos Produtos</h2>
            <p className="text-muted-foreground">
              Confira nossa seleção de produtos disponíveis
            </p>
          </div>

          <ProductGrid
            products={products}
            isLoading={isLoading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
