"use client"

import { useAurumStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { products, categories, isInitialized } = useAurumStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-headline tracking-widest text-primary uppercase">Aurum</p>
      </div>
    );
  }

  const heroProducts = products.filter(p => p.isHero);
  const mainCoverProducts = products.filter(p => p.isMainCover);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />

      <main className="flex-grow">
        {/* Hero Carousel */}
        {heroProducts.length > 0 && (
          <section className="mb-20">
            <Carousel className="w-full">
              <CarouselContent>
                {heroProducts.map((p) => (
                  <CarouselItem key={p.id}>
                    <div className="relative h-[400px] md:h-[600px] w-full flex items-center overflow-hidden">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="container mx-auto px-4 relative z-10 text-white">
                        <div className="max-w-xl animate-fade-in">
                          <span className="text-xs uppercase tracking-[0.4em] font-body mb-4 block">Destaque da Coleção</span>
                          <h2 className="text-4xl md:text-6xl font-headline mb-6">{p.name}</h2>
                          <Button className="rounded-none bg-white text-primary hover:bg-primary hover:text-white transition-all px-8 py-6 uppercase tracking-widest text-xs">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 hidden md:flex" />
              <CarouselNext className="right-4 hidden md:flex" />
            </Carousel>
          </section>
        )}

        {/* Main Cover Section */}
        {mainCoverProducts.length > 0 && (
          <section className="container mx-auto px-4 mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline text-primary mb-2">Favoritos da Estação</h2>
              <div className="w-12 h-[1px] bg-secondary mx-auto mb-4" />
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-body">Peças essenciais para o seu brilho</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {mainCoverProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Full Grid by Category */}
        {categories.map(cat => {
          const categoryProducts = products.filter(p => p.categoryId === cat.id);
          if (categoryProducts.length === 0) return null;

          return (
            <section key={cat.id} id={cat.name.toLowerCase()} className="container mx-auto px-4 mb-24">
              <div className="flex items-end justify-between mb-8 border-b pb-4">
                <h2 className="text-2xl font-headline text-primary">{cat.name}</h2>
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-body">Explorar</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
                {categoryProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}