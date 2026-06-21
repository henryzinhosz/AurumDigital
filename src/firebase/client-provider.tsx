'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';

export function FirebaseClientProvider({
  children,
  firebaseConfig,
}: {
  children: ReactNode;
  firebaseConfig: any;
}) {
  const { app, firestore, auth } = useMemo(() => {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    return { app, firestore, auth };
  }, [firebaseConfig]);

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
