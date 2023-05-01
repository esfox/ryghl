import { apiService } from '@/services/api.service';
import { PageContentDataType } from '@/types';
import { debounce } from '@/utils';

import { configureAbly, useChannel } from '@ably-labs/react-hooks';
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
  configureAbly({ key: apiKey, clientId });

  const [realtimeChannel] = useChannel('control', 'scroll', (message) => {
    if (message.clientId === clientId) {
      return;
    }

    const toScrollY: number = message.data.scrollY;
    window.scrollTo({ top: toScrollY, behavior: 'smooth' });
  });

  useEffect(() => {
    const handleScroll = debounce(() => {
      realtimeChannel.publish('scroll', { scrollY: window.scrollY });
    }, 200);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [realtimeChannel]);

  return <ReactMarkdown className="prose mx-auto py-12">{page.content}</ReactMarkdown>;
}
