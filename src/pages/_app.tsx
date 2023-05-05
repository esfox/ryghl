import '@/styles/globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="h-full">
        <Component {...pageProps} />
        <Toaster />
      </main>
    </QueryClientProvider>
  );
}
