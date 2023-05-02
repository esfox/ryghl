import { useRealtime } from '@/hooks/useRealtime';
import { apiService } from '@/services/api.service';
import { PageContentDataType } from '@/types';
import { convertScrollPercent, debounce } from '@/utils';

import { GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';
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
  const { sendMessage: sendRealtimeMessage } = useRealtime({
    clientId,
    apiKey,
    channelName: 'scroll',
    onMessage: (message) => {
      if (message.clientId === clientId) {
        return;
      }

      const { scrollPercent } = message.data;
      const toScrollY = convertScrollPercent({ fromPercent: scrollPercent });
      window.scrollTo({ top: toScrollY, behavior: 'smooth' });
    },
  });

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollPercent = convertScrollPercent();
      sendRealtimeMessage({ scrollPercent });
    }, 200);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sendRealtimeMessage]);

  return <ReactMarkdown className="prose mx-auto break-words p-8">{page.content}</ReactMarkdown>;
}
