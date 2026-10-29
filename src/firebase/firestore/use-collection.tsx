'use client';

import { useState, useEffect } from 'react';
import type {
  DocumentData,
  FirestoreError,
  Query,
  CollectionReference,
} from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * Stubbed hook that returns empty data.
 * Used for running the site without a live Firebase database.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: any | null | undefined,
): UseCollectionResult<T> {
  // Always return empty data to prevent UI crashes in .map() calls
  return { data: [], isLoading: false, error: null };
}
