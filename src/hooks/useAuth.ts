import { localStorageUtil } from '@/utils/localStorage.util';
import { ResponseCodes } from 'http-constants-ts';
import ky from 'ky';

export function useAuth() {
  const login = async (password: string) => {
    const { sessionToken } = await ky
      .post('/api/login', { json: { password } })
      .json<{ sessionToken: string }>();

    localStorageUtil.sessionToken.set(sessionToken);
  };

  const checkLoggedIn = async () => {
    const sessionToken = localStorageUtil.sessionToken.get();
    if (!sessionToken) {
      throw new Error('No session token');
    }

    const response = await ky.post('/api/auth', {
      headers: {
        Authorization: sessionToken,
      },
    });

    if (response.status === ResponseCodes.UNAUTHORIZED) {
      throw new Error('Unauthorized');
    }

    return true;
  };

  return { login, checkLoggedIn };
}
