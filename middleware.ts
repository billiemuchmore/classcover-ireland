import { next } from '@vercel/edge';

// Skip static assets — only run on HTML routes.
export const config = {
  matcher:
    '/((?!.*\\.(?:ico|png|jpg|jpeg|svg|webp|avif|gif|woff|woff2|ttf|otf|eot|js|css|map|json|txt|xml|webmanifest)$).*)',
};

export default function middleware(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'XX';
  return next({
    headers: {
      'Set-Cookie': `visitor-country=${country}; Path=/; Max-Age=86400; SameSite=Lax`,
    },
  });
}
