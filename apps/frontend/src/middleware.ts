import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function safeParseUser(value: string | undefined) {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

const PUBLIC_ROUTES = [
  '/',
  '/listings',
  '/help',
  '/auth/login',
  '/auth/register',
];

const PROTECTED_ROUTES = [
  '/profile',
  '/listings/create',
  '/listings/edit',
  '/orders',
  '/messages',
  '/cart',
  '/favorites',
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const userCookie = req.cookies.get('user')?.value;
  const { pathname } = req.nextUrl;

  const user = safeParseUser(userCookie);
  const isAuthenticated = !!token && !!user;

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (user.role !== 'admin' && user.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/auth/') && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|images|icons|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
};