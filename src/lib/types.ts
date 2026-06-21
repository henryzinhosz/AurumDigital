export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  promoPrice?: number;
  categoryId: string;
  isMainCover: boolean;
  isHero: boolean;
  isPromo: boolean;
  hidePrice: boolean;
  material?: string;
  style?: string;
}