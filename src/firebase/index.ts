
'use client';

import { firebaseConfig } from './config';
import { getApps, initializeApp, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function initializeFirebase() {
  if (typeof window === 'undefined') return null;
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  return { firebaseApp: app, firestore, auth, firebaseConfig };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
