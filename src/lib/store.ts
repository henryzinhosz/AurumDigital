"use client"

import { useState, useEffect } from 'react';
import { Product, Category } from './types';

const STORAGE_KEY_PRODUCTS = 'aurum_products';
const STORAGE_KEY_CATEGORIES = 'aurum_categories';

const initialCategories: Category[] = [
  { id: '1', name: 'Colares' },
  { id: '2', name: 'Brincos' },
  { id: '3', name: 'Anéis' },
  { id: '4', name: 'Pulseiras' },
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Colar Aura Dourada',
    description: 'Um colar minimalista banhado a ouro 18k, perfeito para o dia a dia.',
    imageUrl: 'https://picsum.photos/seed/j1/600/600',
    price: 129.90,
    categoryId: '1',
    isMainCover: true,
    isHero: true,
    isPromo: false,
    hidePrice: false,
    material: 'Ouro 18k',
    style: 'Minimalista'
  },
  {
    id: '2',
    name: 'Brincos Pérola Lunar',
    description: 'Pérolas naturais com acabamento em prata 925.',
    imageUrl: 'https://picsum.photos/seed/j2/600/600',
    price: 89.00,
    promoPrice: 69.90,
    categoryId: '2',
    isMainCover: true,
    isHero: false,
    isPromo: true,
    hidePrice: false,
    material: 'Prata e Pérola',
    style: 'Clássico'
  },
  {
    id: '3',
    name: 'Anel Constelação',
    description: 'Zircônias cravejadas em aro de ródio negro.',
    imageUrl: 'https://picsum.photos/seed/j3/600/600',
    price: 150.00,
    categoryId: '3',
    isMainCover: false,
    isHero: true,
    isPromo: false,
    hidePrice: true,
    material: 'Ródio Negro',
    style: 'Boho'
  }
];

export function useAurumStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    const savedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(initialCategories);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    }
  }, [products, categories, isInitialized]);

  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProduct = { ...p, id: Math.random().toString(36).substr(2, 9) };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, p: Partial<Product>) => {
    setProducts(products.map(item => item.id === id ? { ...item, ...p } : item));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(item => item.id !== id));
  };

  const addCategory = (name: string) => {
    const newCategory = { id: Math.random().toString(36).substr(2, 9), name };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(item => item.id !== id));
  };

  return {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    isInitialized
  };
}