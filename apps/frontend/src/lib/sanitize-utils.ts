'use client';

/**
 * Утилиты для санитизации HTML и текста
 * Защита от XSS атак
 */

/**
 * Простая санитизация текста (удаление HTML тегов)
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';
  
  // Удаляем HTML теги
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Экранирование специальных символов
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Валидация и санитизация URL
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    // Разрешаем только http и https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
}

/**
 * Проверка безопасности текста
 */
export function isTextSafe(text: string): boolean {
  if (!text) return true;
  
  // Проверяем на наличие скриптов и опасных тегов
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick=, onerror=, и т.д.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(text));
}
