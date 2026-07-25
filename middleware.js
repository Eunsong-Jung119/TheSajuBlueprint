// middleware.js — Vercel Edge Middleware (프로젝트 루트)
import { rewrite, next } from '@vercel/edge';

export const config = { matcher: '/' };

export default function middleware(request) {
  const host = (request.headers.get('host') || '').toLowerCase();
  if (host === 'fatelab.co' || host === 'www.fatelab.co') {
    return rewrite(new URL('/rate/index.html', request.url));
  }
  return next();
}
