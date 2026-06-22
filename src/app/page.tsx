
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

export default function Home() {
  const { products, categories, isInitialized } = useAurumStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-headline tracking-widest text-primary uppercase">Th Acessórios</p>
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
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {heroProducts.map((p) => (
                  <CarouselItem key={p.id}>
                    <div className="relative h-[400px] md:h-[650px] w-full flex items-center overflow-hidden bg-muted">
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="container relative z-10 text-white">
                        <div className="max-w-2xl animate-fade-in">
                          <span className="text-xs uppercase tracking-[0.4em] font-body mb-4 block">Destaque da Coleção</span>
                          <h2 className="text-4xl md:text-7xl font-headline mb-8 leading-tight">{p.name}</h2>
                          <Button className="rounded-none bg-white text-primary hover:bg-primary hover:text-white transition-all px-10 py-7 uppercase tracking-widest text-xs font-bold shadow-xl">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="container absolute inset-0 pointer-events-none flex items-center">
                <div className="w-full flex justify-between pointer-events-auto">
                  <CarouselPrevious className="relative left-0 md:flex bg-white/20 hover:bg-white/40 border-none text-white" />
                  <CarouselNext className="relative right-0 md:flex bg-white/20 hover:bg-white/40 border-none text-white" />
                </div>
              </div>
            </Carousel>
          </section>
        )}

        {/* Main Cover Section - NOW A CAROUSEL */}
        {mainCoverProducts.length > 0 && (
          <section className="container mb-24 px-12 md:px-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-headline text-primary mb-4">Favoritos da Estação</h2>
              <div className="w-16 h-[1px] bg-secondary mx-auto mb-6" />
              <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] font-body">Peças essenciais para o seu brilho</p>
            </div>
            
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 md:-ml-8">
                  {mainCoverProducts.map(p => (
                    <CarouselItem key={p.id} className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/4">
                      <ProductCard product={p} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-12 lg:-left-16 border-primary/20 text-primary hover:bg-primary hover:text-white" />
                <CarouselNext className="-right-12 lg:-right-16 border-primary/20 text-primary hover:bg-primary hover:text-white" />
              </Carousel>
            </div>
          </section>
        )}

        {/* Full Grid by Category */}
        {categories.map(cat => {
          const categoryProducts = products.filter(p => p.categoryId === cat.id);
          if (categoryProducts.length === 0) return null;

          return (
            <section key={cat.id} id={cat.name.toLowerCase()} className="container mb-24">
              <div className="flex items-end justify-between mb-10 border-b border-primary/10 pb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-headline text-primary">{cat.name}</h2>
                  <div className="w-8 h-[1px] bg-secondary mt-2" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-body font-bold">Coleção Completa</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
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
