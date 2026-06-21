
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // Log no console para debug técnico detalhado
      console.error('Erro de Permissão Firestore:', error);
      
      // Lança um erro que o Next.js captura na overlay de desenvolvimento
      // Isso ajuda a ver exatamente qual regra de segurança bloqueou a ação
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }

      toast({
        variant: 'destructive',
        title: 'Erro de Permissão',
        description: 'Você não tem autorização para realizar esta operação no banco de dados.',
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => errorEmitter.off('permission-error', handlePermissionError);
  }, [toast]);

  return null;
}
