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
      <div className="container h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-center group">
          <span className="text-2xl md:text-3xl font-headline tracking-[0.2em] text-primary uppercase transition-colors group-hover:text-secondary">Th</span>
          <span className="text-[9px] uppercase tracking-[0.4em] -mt-1 font-body font-bold opacity-60">Acessórios</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/#${cat.name.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.2em] font-body font-bold hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-primary hover:after:w-full after:transition-all"
            >
              {cat.name}
            </Link>
          ))}
          <Button variant="ghost" size="icon" className="ml-4 hover:bg-accent/50">
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
