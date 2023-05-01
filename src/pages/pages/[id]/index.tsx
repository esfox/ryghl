import { apiService } from '@/services/api.service';
import { PageContentDataType } from '@/types';
import { debounce } from '@/utils';

import { configureAbly, useChannel } from '@ably-labs/react-hooks';
import { GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import { randomUUID } from 'crypto';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const pageId = context.query.id as string;
  const pageContentResponse = await apiService.getPageContent(pageId);

  const realtimeApiKey = await apiService.getRealtimeApiKey();

  /* Generate a unique client ID for this instance, which is used to determine
    which client is which in handling realtime */
  const clientId = randomUUID();
  return {
    props: {
      page: pageContentResponse,
      realtimeApiKey,
      clientId,
    },
  };
}

export default function PageContent({
  page,
  realtimeApiKey,
  clientId,
}: {
  page: PageContentDataType;
  realtimeApiKey: string;
  clientId: string;
}) {
  configureAbly({ key: realtimeApiKey, clientId });

  const [realtimeChannel] = useChannel('control', 'scroll', (message) => {
    if (message.clientId === clientId) {
      return;
    }

    const toScrollY: number = message.data.scrollY;
    window.scrollTo({ top: toScrollY, behavior: 'smooth' });
  });

  useEffect(() => {
    const handleScroll = debounce(() => {
      realtimeChannel.publish('scroll', {
        scrollY: window.scrollY,
      });
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [realtimeChannel]);

  return <ReactMarkdown className="prose mx-auto py-12">{page.content}</ReactMarkdown>;
}
