import { verifyJwt } from './utils/jwt.util';

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('auth')?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await verifyJwt(sessionToken);
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/login).*)'],
};
