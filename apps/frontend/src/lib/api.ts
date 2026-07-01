export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Если путь начинается с /uploads/, добавляем URL бэкенда
  if (path.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  }
  return path;
};
