'use client';

import { useState, useCallback, useEffect } from 'react';
import { Listing, ListingsResponse, ListingError } from '@/types/listing';
import { fetchWithTimeout, validateListingsResponse } from '@/lib/api-utils';

interface UseListingsOptions {
  limit?: number;
  initialPage?: number;
  apiUrl?: string;
}

interface UseListingsState {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
}

interface UseListingsActions {
  fetchListings: (page?: number) => Promise<void>;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  reset: () => void;
}

/**
 * Hook для управления списком объявлений
 * Включает обработку ошибок, timeout, retry логику
 */
export function useListings(options: UseListingsOptions = {}): UseListingsState & UseListingsActions {
  const {
    limit = 20,
    initialPage = 1,
    apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  } = options;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPageState] = useState(initialPage);

  const fetchListings = useCallback(
    async (pageNum = page) => {
      setLoading(true);
      setError(null);

      try {
        const url = `${apiUrl}/listings?page=${pageNum}&limit=${limit}`;
        
        const data = await fetchWithTimeout<ListingsResponse>(url, {
          timeout: 10000,
          retries: 3,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Валидируем ответ
        if (!validateListingsResponse(data)) {
          throw new Error('Invalid API response format');
        }

        setListings(data.items);
        setTotal(data.total);
      } catch (err) {
        const error = err as ListingError | Error;
        
        if ('status' in error) {
          // Это ListingError
          setError((error as ListingError).message);
        } else if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setError('Запрос истёк. Проверьте соединение с интернетом.');
          } else {
            setError(error.message || 'Ошибка загрузки объявлений');
          }
        } else {
          setError('Неизвестная ошибка');
        }

        setListings([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, apiUrl]
  );

  const refetch = useCallback(() => fetchListings(page), [fetchListings, page]);

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      fetchListings(newPage);
    },
    [fetchListings]
  );

  const reset = useCallback(() => {
    setListings([]);
    setError(null);
    setTotal(0);
    setPageState(initialPage);
  }, [initialPage]);

  // Загружаем объявления при изменении page
  useEffect(() => {
    fetchListings(page);
  }, [page, fetchListings]);

  return {
    listings,
    loading,
    error,
    total,
    page,
    fetchListings,
    refetch,
    setPage,
    reset,
  };
}
