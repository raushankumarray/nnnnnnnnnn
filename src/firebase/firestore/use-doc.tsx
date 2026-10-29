'use client';
    
import { useState, useEffect } from 'react';
import type {
  DocumentReference,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';

type WithId<T> = T & { id: string };

export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * Stubbed hook that returns null data.
 * Used for running the site without a live Firebase database.
 */
export function useDoc<T = any>(
  memoizedDocRef: any | null | undefined,
): UseDocResult<T> {
  return { data: null, isLoading: false, error: null };
}
