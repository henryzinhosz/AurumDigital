
"use client"

import { useState } from 'react';
import Link from 'next/link';
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
import { ChevronDown, SearchX, ArrowRight } from 'lucide-react';

export default function Home() {
  const { products, categories, isInitialized } = useAurumStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-headline tracking-widest text-primary uppercase">Th Acessórios</p>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSearching = searchTerm.length > 0;
  const carouselProducts = filteredProducts.filter(p => p.isHero);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        categories={categories} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <main className="flex-grow">
        {!isSearching ? (
          <>
            <section className="relative w-full h-[45vh] min-h-[300px] flex flex-col items-center justify-center bg-accent/30 overflow-hidden border-b border-primary/5">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] rounded-full bg-primary blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-secondary blur-[100px]" />
              </div>
              
              <div className="z-10 text-center px-4 animate-fade-in">
                <h1 className="text-7xl md:text-9xl font-script text-primary mb-0 leading-none drop-shadow-sm">Th</h1>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-body font-bold text-primary/70 mb-8 mt-2">Acessórios</p>
                <div className="w-12 h-[1px] bg-secondary mx-auto mb-8" />
                <p className="font-headline italic text-lg text-muted-foreground/80 max-w-md mx-auto">
                  Curadoria de joias finas, autênticas e delicadas.
                </p>
              </div>

              <div className="absolute bottom-8 animate-bounce opacity-40">
                <ChevronDown className="w-6 h-6 text-primary" />
              </div>
            </section>

            {carouselProducts.length > 0 && (
              <section className="container py-20 px-12 md:px-16">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-headline text-primary mb-4">Favoritos da Estação</h2>
                  <div className="w-16 h-[1px] bg-secondary mx-auto mb-6" />
                  <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] font-body font-medium">Peças essenciais para o seu brilho</p>
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
                      {carouselProducts.map(p => (
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

            {categories.map(cat => {
              const categoryProducts = filteredProducts.filter(p => p.categoryId === cat.id && p.isMainCover);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={cat.id} className="container mb-24">
                  <div className="flex items-end justify-between mb-10 border-b border-primary/10 pb-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-headline text-primary">{cat.name}</h2>
                      <div className="w-8 h-[1px] bg-secondary mt-2" />
                    </div>
                    <Link 
                      href={`/categoria/${cat.id}`} 
                      className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary/60 hover:text-primary font-body font-bold transition-all"
                    >
                      Coleção Completa
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
                    {categoryProducts.map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        ) : (
          <section className="container py-20 min-h-[60vh]">
            <div className="flex flex-col items-center justify-center mb-16 text-center">
              <h2 className="text-3xl font-headline text-primary mb-2">Resultados para &quot;{searchTerm}&quot;</h2>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{filteredProducts.length} peças encontradas</p>
              <div className="w-12 h-[1px] bg-secondary mt-6" />
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/60">
                <SearchX className="w-16 h-16 mb-4 stroke-[1px]" />
                <p className="font-headline text-xl italic">Nenhuma joia encontrada com este nome...</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 text-xs uppercase tracking-widest text-primary font-bold hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
