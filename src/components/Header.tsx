
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/types';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

interface HeaderProps {
  categories: Category[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ categories, searchTerm, onSearchChange }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-center group">
          <span className="text-2xl md:text-3xl font-headline tracking-[0.2em] text-primary uppercase transition-colors group-hover:text-secondary">Th</span>
          <span className="text-[9px] uppercase tracking-[0.4em] -mt-1 font-body font-bold opacity-60">Acessórios</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!isSearchOpen ? (
            <>
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/#${cat.name.toLowerCase()}`}
                  className="text-[11px] uppercase tracking-[0.2em] font-body font-bold hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-primary hover:after:w-full after:transition-all"
                >
                  {cat.name}
                </Link>
              ))}
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-4 hover:bg-accent/50 text-primary"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="relative">
                <Input
                  autoFocus
                  placeholder="Buscar joias..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-[300px] h-9 rounded-full border-primary/20 bg-accent/30 text-xs focus-visible:ring-primary/30"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  setIsSearchOpen(false);
                  onSearchChange('');
                }}
              >
                <X className="w-4 h-4 text-primary" />
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Search className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-[200px] bg-background border-b border-primary/10">
              <SheetHeader>
                <SheetTitle className="font-headline text-lg text-primary">O que você procura?</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="relative">
                  <Input
                    placeholder="Ex: Colar, Brinco, Ouro..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-12 rounded-xl border-primary/20 bg-accent/20"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <SheetHeader>
                <SheetTitle className="font-headline text-2xl text-primary border-b pb-4">Categorias</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8 mt-12">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/#${cat.name.toLowerCase()}`}
                    className="text-sm font-body uppercase tracking-[0.3em] font-bold hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
