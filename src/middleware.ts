import { checkSession } from '@/utils/sessions.util';

import { verifyJwt } from './utils/jwt.util';

import { errors } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('auth')?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const redirectToLogin = () => NextResponse.redirect(new URL('/login', request.url));

  let sessionTokenPayload;
  try {
    sessionTokenPayload = await verifyJwt(sessionToken);
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return redirectToLogin();
    }
  }

  const { sessionId } = sessionTokenPayload as { sessionId: string };
  const session = await checkSession(sessionId);
  if (!session) {
    return redirectToLogin();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/login).*)'],
};
