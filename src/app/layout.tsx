'use client'

import { Roboto } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/react-query";
import { CartProvider } from "@/contexts/cart-context";

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});

const oneMonth = 60 * 24 * 30;

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="pt-br">
      <body className={`${roboto.variable} antialiased`}>
        <SessionProvider refetchInterval={oneMonth}>
          <QueryClientProvider client={queryClient}>
            <CartProvider>
              <ThemeProvider
                disableTransitionOnChange
                attribute="class"
                defaultTheme="light"
              >
                {children}
              </ThemeProvider>
            </CartProvider>
          </QueryClientProvider>
          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
