'use client';

import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import type {
  DocumentData,
  FirestoreError,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { useAuth } from '@/firebase/provider';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

export function useCollection<T = any>(
  memoizedTargetRefOrQuery: (Query<DocumentData> | CollectionReference<DocumentData>) | null | undefined,
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot) => {
        const results: WithId<T>[] = [];
        snapshot.forEach((doc) => {
          results.push({
            ...(doc.data() as T),
            id: doc.id,
          });
        });
        setData(results);
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore useCollection error:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
