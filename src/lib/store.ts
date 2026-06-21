
"use client"

import { useMemo } from 'react';
import { Product, Category } from './types';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function useAurumStore() {
  const db = useFirestore();

  const categoriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'categories'), orderBy('name'));
  }, [db]);

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('name'));
  }, [db]);

  const { data: categoriesData, loading: loadingCats } = useCollection<Category>(categoriesQuery);
  const { data: productsData, loading: loadingProds } = useCollection<Product>(productsQuery);

  const isInitialized = !loadingCats && !loadingProds;

  const addProduct = (p: Omit<Product, 'id'>) => {
    if (!db) return;
    addDoc(collection(db, 'products'), p).catch(async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'products',
        operation: 'create',
        requestResourceData: p
      } satisfies SecurityRuleContext));
    });
  };

  const updateProduct = (id: string, p: Partial<Product>) => {
    if (!db) return;
    const docRef = doc(db, 'products', id);
    // Removemos o ID dos dados para não tentar sobrescrever o campo reservado do Firestore
    const { id: _, ...dataToUpdate } = p as any;
    updateDoc(docRef, dataToUpdate).catch(async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: dataToUpdate
      } satisfies SecurityRuleContext));
    });
  };

  const deleteProduct = (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'products', id);
    deleteDoc(docRef).catch(async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      } satisfies SecurityRuleContext));
    });
  };

  const addCategory = (name: string) => {
    if (!db) return;
    addDoc(collection(db, 'categories'), { name }).catch(async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'categories',
        operation: 'create',
        requestResourceData: { name }
      } satisfies SecurityRuleContext));
    });
  };

  const deleteCategory = (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'categories', id);
    deleteDoc(docRef).catch(async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      } satisfies SecurityRuleContext));
    });
  };

  return {
    products: productsData || [],
    categories: categoriesData || [],
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    isInitialized
  };
}
