import { supabasePublic } from '@/supabase-public';

import { useState } from 'react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithGoogle = async () => {
    setIsLoading(true);
    await supabasePublic.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login/callback`,
      },
    });
  };

  return (
    <main className="grid place-items-center h-full">
      <button
        className="btn bg-[#1a73e8] btn-lg text-white rounded-full mt-6 hover:bg-[#1a73e8]"
        onClick={loginWithGoogle}
        disabled={isLoading}
      >
        <i className="fa-brands fa-google"></i>
        Login with Google
      </button>
    </main>
  );
}
