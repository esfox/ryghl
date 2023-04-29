import { useAuth } from '@/hooks/useAuth';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const loginRoute = '/login';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { checkLoggedIn } = useAuth();
  const { replace, route } = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const loggedIn = await checkLoggedIn();
        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error(error);
        replace(loginRoute);
      }
    };

    if (route !== loginRoute) {
      check();
    } else {
      setIsLoggedIn(true);
    }
  }, [checkLoggedIn, isLoggedIn, replace, route]);

  return (
    isLoggedIn && (
      <QueryClientProvider client={queryClient}>
        <main className="h-full">
          <Component {...pageProps} />
          <Toaster />
        </main>
      </QueryClientProvider>
    )
  );
}
