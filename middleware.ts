import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifyAdminSession } from './lib/admin-session';

// /admin/** ve /api/admin/** rotalarını koruyor.
// Public istisnalar: login sayfası ve auth endpoint'leri.

const PUBLIC_PATHS = new Set<string>([
  '/admin/login',
  '/api/admin/auth',
  '/api/admin/logout',
]);

// Sprint 22.5 borç temizliği: H6 modülleri sadece /[locale]/{module}/...
// altında üretiliyor; locale-eksik URL'leri default locale'a redirect.
// Yalnızca **H6-spesifik** modüller — CA 5. sayfa olarak üretebileceği
// `services/news/team/projects` LİSTEDE DEĞİL (legacy CA pages bozulmasın).
// Ambiguous slug'lar üzerinde redirect yapmıyoruz; legacy `[slug]/page.tsx`
// veya 404 doğal olarak döner.
const MODULE_SLUGS = [
  'products', 'references', 'certificates', 'gallery', 'career',
  'newsletter', 'video',
];
const DEFAULT_LOCALE = 'tr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // (1) Locale-eksik modül URL → default locale (308 permanent redirect)
  const firstSeg = pathname.slice(1).split('/')[0] ?? '';
  if (MODULE_SLUGS.includes(firstSeg)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  // (2) Admin auth (mevcut davranış)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (PUBLIC_PATHS.has(pathname)) {
      return NextResponse.next();
    }

    const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const authed = await verifyAdminSession(cookieValue);

    if (!authed) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    // Sprint 22.5: H6-only modül path'leri (locale-eksik) redirect için.
    // services/news/team/projects redirect yapmıyor; legacy CA 5. sayfa
    // çakışmasın diye dışarıda.
    '/products/:path*',
    '/references/:path*',
    '/certificates/:path*',
    '/gallery/:path*',
    '/career/:path*',
    '/newsletter/:path*',
    '/video/:path*',
  ],
};
