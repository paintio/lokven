import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userStr = request.cookies.get('user')?.value;
  const adminToken = request.cookies.get('adminToken')?.value;

  // Защита админ-панели
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 1. Проверка наличия админ-токена (с флешки)
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    // 2. Проверка обычного токена и роли
    if (!token || !userStr) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Защита страницы входа с флешкой (если уже есть токен)
  if (request.nextUrl.pathname === '/admin-login') {
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
};