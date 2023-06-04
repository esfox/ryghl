import { useRealtime } from '@/hooks/useRealtime';
import { apiService } from '@/services/api.service';
import { PageContentDataType } from '@/types';
import { convertScrollPercent, debounce } from '@/utils';

import { HTTPError } from 'ky';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';

interface PageContentProps {
  page: PageContentDataType;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageContentProps> | undefined> {
  const pageId = context.query.id as string;
  const cookies = context.req.cookies as Record<string, string>;

  const redirect = () => ({
    redirect: {
      permanent: false,
      destination: '/404',
    },
  });

  let pageContentResponse;
  try {
    pageContentResponse = await apiService.withCookies(cookies).getPageContent(pageId);
  } catch (error) {
    const httpError = error as HTTPError;
    if (httpError.response.status === 404) {
      return redirect();
    }
  }

  if (!pageContentResponse) {
    return redirect();
  }

  return {
    props: {
      page: pageContentResponse ?? {},
    },
  };
}

export default function PageContent({ page }: PageContentProps) {
  const [isControlledScrolling, setIsControlledScrolling] = useState(false);

  const { sendMessage: sendRealtimeMessage } = useRealtime({
    channelName: 'scroll',
    onMessage: (data) => {
      setIsControlledScrolling(true);
      const { scrollPercent } = data;
      const toScrollY = convertScrollPercent({ fromPercent: scrollPercent });
      window.scrollTo({ top: toScrollY, behavior: 'smooth' });
    },
  });

  useEffect(() => {
    const dispatchRealtimeScroll = debounce((scrollPercent: number) => {
      sendRealtimeMessage({ scrollPercent });
    }, 200);

    let scrollingTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      if (!isControlledScrolling) {
        const scrollPercent = convertScrollPercent();
        return dispatchRealtimeScroll(scrollPercent);
      }

      clearTimeout(scrollingTimeout);
      scrollingTimeout = setTimeout(() => setIsControlledScrolling(false), 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sendRealtimeMessage, isControlledScrolling]);

  return (
    <main contentEditable spellCheck={false}>
      <ReactMarkdown className="prose mx-auto break-words p-8" rehypePlugins={[rehypeRaw]}>
        {page.content}
      </ReactMarkdown>
    </main>
  );
}
