
"use client"

import Image from 'next/image';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  const formattedPromoPrice = product.promoPrice ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.promoPrice) : null;

  return (
    <div className="group animate-fade-in flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted mb-4">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            data-ai-hint="jewelry photo"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            Sem Imagem
          </div>
        )}
        {product.isPromo && !product.hidePrice && (
          <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">
            Oferta
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-headline text-lg group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="min-h-[1.5rem] flex items-center">
          {product.hidePrice ? (
            <Button variant="link" className="p-0 h-auto text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary">
              Consultar Preço
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {product.isPromo && product.promoPrice ? (
                <>
                  <span className="text-xs text-muted-foreground line-through opacity-60">
                    {formattedPrice}
                  </span>
                  <span className="text-sm font-bold text-secondary">
                    {formattedPromoPrice}
                  </span>
                </>
              ) : (
                <span className="text-sm text-primary font-medium">
                  {formattedPrice}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
