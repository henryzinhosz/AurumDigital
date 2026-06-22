"use client"

import Link from 'next/link';
import { ShoppingBag, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

export function Header({ categories }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-center group">
          <span className="text-2xl font-headline tracking-widest text-primary uppercase transition-colors group-hover:text-secondary">Th</span>
          <span className="text-[10px] uppercase tracking-[0.3em] -mt-1 font-body font-bold opacity-60">Acessórios</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/#${cat.name.toLowerCase()}`}
              className="text-sm uppercase tracking-wider font-body hover:text-primary transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Button variant="ghost" size="icon" className="ml-4">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ShoppingBag className="w-5 h-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <SheetHeader>
                <SheetTitle className="font-headline text-2xl text-primary">Categorias</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-12">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/#${cat.name.toLowerCase()}`}
                    className="text-lg font-body uppercase tracking-widest hover:text-primary"
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
