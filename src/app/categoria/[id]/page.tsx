
"use client"

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAurumStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { ChevronLeft, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { products, categories, isInitialized } = useAurumStore();

  const category = useMemo(() => 
    categories.find(c => c.id === id), 
  [categories, id]);

  const categoryProducts = useMemo(() => 
    products.filter(p => p.categoryId === id), 
  [products, id]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-headline tracking-widest text-primary uppercase">Carregando Categoria...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <PackageSearch className="w-16 h-16 text-muted-foreground/40 mb-4 stroke-[1px]" />
        <h2 className="text-2xl font-headline text-primary mb-2">Categoria não encontrada</h2>
        <p className="text-muted-foreground mb-6">Parece que esta coleção não está mais disponível.</p>
        <Button onClick={() => router.push('/')} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
          Voltar para Início
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        categories={categories} 
        searchTerm="" 
        onSearchChange={() => router.push('/')} 
      />

      <main className="flex-grow container py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="p-2 rounded-full bg-accent/30 text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-60">Início</span>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-headline text-primary mb-2">{category.name}</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-bold">Coleção Completa</p>
            <div className="w-12 h-[1px] bg-secondary mx-auto mt-6" />
          </div>

          <div className="hidden md:block w-[100px]" /> {/* Spacer for centering */}
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
            {categoryProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/60">
            <PackageSearch className="w-16 h-16 mb-4 stroke-[1px]" />
            <p className="font-headline text-xl italic">Ainda não há peças nesta coleção...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
