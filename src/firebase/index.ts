'use client';

import { firebaseConfig } from '@/firebase/config';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export type FirebaseServices = {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

/**
 * Inert initialization for a "Simple Run" site.
 * This returns null for all services to avoid API key errors.
 */
export function initializeFirebase(): FirebaseServices {
  return {
    firebaseApp: null,
    auth: null,
    firestore: null
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
