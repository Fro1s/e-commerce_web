'use client';

import Link from 'next/link';
import { IconHome, IconArrowLeft, IconError404 } from '@tabler/icons-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative bg-primary/10 rounded-full p-8 border-2 border-primary/20">
              <IconError404 className="w-24 h-24 text-primary" stroke={1.5} />
            </div>
          </div>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Página não encontrada
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Ops! A página que você está procurando não existe ou foi movida para outro lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            <IconHome className="w-5 h-5" />
            Voltar para Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all font-semibold"
          >
            <IconArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">Links úteis:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/login" className="text-primary hover:text-primary/80 hover:underline transition-colors">
              Login
            </Link>
            <Link href="/signup" className="text-primary hover:text-primary/80 hover:underline transition-colors">
              Cadastro
            </Link>
            <Link href="/" className="text-primary hover:text-primary/80 hover:underline transition-colors">
              Produtos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
