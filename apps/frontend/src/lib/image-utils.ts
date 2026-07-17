'use client';

/**
 * Утилиты для работы с изображениями
 * Оптимизация, fallback, валидация
 */

const DEFAULT_PLACEHOLDER = '/images/placeholder-listing.svg';
const CLOUDINARY_DOMAIN = 'res.cloudinary.com';

/**
 * Получение оптимизированного URL изображения
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return DEFAULT_PLACEHOLDER;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return `${apiUrl}${path}`;
  }
  return DEFAULT_PLACEHOLDER;
}

/**
 * Получение URL с параметрами оптимизации для Cloudinary
 */
export function getOptimizedImageUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const baseUrl = getImageUrl(url);

  if (!baseUrl.includes(CLOUDINARY_DOMAIN)) {
    return baseUrl;
  }

  const { width = 400, height = 300, quality = 'auto' } = options;

  // Cloudinary URL transformation
  // https://cloudinary.com/documentation/url_gen_upload_transformations
  return baseUrl.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/`
  );
}

/**
 * Проверка валидности URL изображения
 */
export async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok || response.status === 0; // 0 for CORS
  } catch {
    return false;
  }
}

/**
 * Обработчик ошибки при загрузке изображения
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget as HTMLImageElement;
  if (img.src !== DEFAULT_PLACEHOLDER) {
    img.src = DEFAULT_PLACEHOLDER;
  }
}
