import Cookies from 'js-cookie';
import ky from 'ky';

export function useAuth() {
  const login = async (password: string) => {
    const { sessionToken } = await ky
      .post('/api/login', { json: { password } })
      .json<{ sessionToken: string }>();

    Cookies.set('auth', sessionToken);
  };

  return { login };
}
