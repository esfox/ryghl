import { useRealtime } from '@/hooks/useRealtime';
import { apiService } from '@/services/api.service';
import { PageContentDataType } from '@/types';
import { convertScrollPercent, debounce } from '@/utils';

import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const pageId = context.query.id as string;

  const [pageContentResponse, realtimeConfig] = await Promise.all([
    apiService.getPageContent(pageId),
    apiService.getRealtimeConfig(),
  ]);

  return {
    props: {
      page: pageContentResponse,
      realtimeConfig,
    },
  };
}

export default function PageContent({
  page,
  realtimeConfig,
}: {
  page: PageContentDataType;
  realtimeConfig: {
    clientId: string;
    apiKey: string;
  };
}) {
  const { clientId, apiKey } = realtimeConfig;
  const [isControlledScrolling, setIsControlledScrolling] = useState(false);
  const { sendMessage: sendRealtimeMessage } = useRealtime({
    clientId,
    apiKey,
    channelName: 'scroll',
    onMessage: (message) => {
      if (message.clientId === clientId) {
        return;
      }

      setIsControlledScrolling(true);
      const { scrollPercent } = message.data;
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

  return <ReactMarkdown className="prose mx-auto break-words p-8">{page.content}</ReactMarkdown>;
}
