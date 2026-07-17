'use client';

import { ListingError } from '@/types/listing';

/**
 * Утилиты для работы с API
 * Обработка ошибок, timeout, retry логика
 */

const DEFAULT_TIMEOUT = 10000; // 10 секунд
const DEFAULT_RETRIES = 3;

export interface FetchOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

/**
 * Обёртка для fetch с timeout и retry логикой
 */
export async function fetchWithTimeout<T>(
  url: string,
  options: FetchOptions & RequestInit = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = handleHttpError(response);
          throw error;
        }

        const data = await response.json();
        return data as T;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      lastError = error as Error;

      // Не повторяем на 4xx ошибках (кроме 408, 429)
      if (error instanceof Error && error.name === 'AbortError') {
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }

      // Для 5xx ошибок пробуем снова
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError || new Error('Unknown error');
}

/**
 * Обработка HTTP ошибок
 */
function handleHttpError(response: Response): ListingError {
  const status = response.status;
  let message = response.statusText;

  switch (status) {
    case 400:
      message = 'Неверный запрос';
      break;
    case 401:
      message = 'Требуется авторизация';
      break;
    case 403:
      message = 'Доступ запрещён';
      break;
    case 404:
      message = 'Объявление не найдено';
      break;
    case 408:
      message = 'Время ожидания истекло';
      break;
    case 429:
      message = 'Слишком много запросов';
      break;
    case 500:
      message = 'Ошибка сервера';
      break;
    case 502:
      message = 'Плохой шлюз';
      break;
    case 503:
      message = 'Сервис недоступен';
      break;
    default:
      message = `Ошибка: ${status}`;
  }

  const error: ListingError = {
    status,
    message,
  };

  throw error;
}

/**
 * Валидация ответа API
 */
export function validateListingsResponse(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return Array.isArray(obj.items) && typeof obj.total === 'number';
}

/**
 * Безопасное получение значения из localStorage
 */
export function getFromStorage<T>(key: string, fallback?: T): T | null {
  try {
    if (typeof window === 'undefined') return fallback || null;
    const item = localStorage.getItem(key);
    if (!item) return fallback || null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return fallback || null;
  }
}

/**
 * Безопасное сохранение в localStorage
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
    return false;
  }
}
