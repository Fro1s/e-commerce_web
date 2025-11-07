'use client';

import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const featuredItems = [
  {
    id: 1,
    title: 'Novidades em Pet Shop',
    description: 'Confira os últimos lançamentos em produtos para seu pet',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80',
  },
  {
    id: 2,
    title: 'Promoção de Verão',
    description: 'Até 40% OFF em produtos selecionados',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80',
  },
  {
    id: 3,
    title: 'Ração Premium',
    description: 'As melhores marcas com preços especiais',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=1200&q=80',
  },
  {
    id: 4,
    title: 'Brinquedos e Acessórios',
    description: 'Diversão garantida para seu melhor amigo',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80',
  },
];

export function FeaturedCarousel() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <div className="w-full px-4">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {featuredItems.map((item) => (
            <CarouselItem key={item.id}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative min-h-[300px] md:min-h-[400px]">
                    {/* Background Image */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority={item.id === 1}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
                    {/* Content */}
                    <div className="relative z-10 p-12 md:p-16 flex flex-col items-start justify-center min-h-[300px] md:min-h-[400px]">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                        {item.title}
                      </h2>
                      <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow-md max-w-xl">
                        {item.description}
                      </p>
                      <Button size="lg" className="gap-2">
                        Ver produtos
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}
