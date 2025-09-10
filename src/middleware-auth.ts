import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// المسارات المحمية التي تتطلب تسجيل دخول
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // استخراج اللغة من المسار
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
  
  // التحقق من وجود token في cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // إذا كان المسار محمي ولا يوجد token
  if (protectedRoutes.some(route => pathWithoutLocale.startsWith(route)) && !token) {
    // إعادة توجيه إلى صفحة تسجيل الدخول
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // إذا كان المستخدم مسجل دخول ويحاول الوصول إلى Login
  if (token && pathWithoutLocale === '/login') {
    // إعادة توجيه إلى Dashboard
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
