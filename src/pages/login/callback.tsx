import { supabasePublic } from '@/supabase-public';

import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffectOnce } from 'react-use';

export default function Login() {
  const { replace } = useRouter();
  useEffectOnce(() => {
    const checkSession = async () => {
      const { data } = await supabasePublic.auth.getSession();
      const { session } = data;
      if (!session) {
        return replace('/login');
      }

      const { access_token, expires_in } = session;
      Cookies.set('auth', access_token, { expires: expires_in });
      replace('/pages');
    };

    checkSession();
  });

  return (
    <main className="grid place-items-center h-full">
      <span className="w-12 h-12 loading loading-dots"></span>
    </main>
  );
}
