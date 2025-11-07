import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">E-commerce</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sua loja online de confiança para produtos de qualidade.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/ajuda" className="hover:text-primary transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="hover:text-primary transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/entregas" className="hover:text-primary transition-colors">
                  Política de Entregas
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-primary transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contato@paymentflow.com</li>
              <li>(11) 9999-9999</li>
              <li>Segunda a Sexta</li>
              <li>9h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} E-commerce. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
