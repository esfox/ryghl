import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useRealtime } from '@/hooks/useRealtime';
import { pagesService } from '@/services/pages.service';
import { PageContentDataType } from '@/types';
import { convertScrollPercent, debounce } from '@/utils';

import { HTTPError } from 'ky';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';

interface PageContentProps {
  page: PageContentDataType;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageContentProps> | undefined> {
  const pageId = context.query.id as string;

  const redirect = () => ({
    redirect: {
      permanent: false,
      destination: '/404',
    },
  });

  let pageContentData: PageContentDataType | undefined;
  try {
    const file = await pagesService.get(pageId);
    const content = await file.text();
    pageContentData = {
      pageId,
      content,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status === 404) {
        return redirect();
      }
    }

    // eslint-disable-next-line no-console
    console.error(error);
  }

  if (!pageContentData) {
    return redirect();
  }

  return {
    props: {
      page: pageContentData ?? {},
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
      <MarkdownRenderer>{page.content}</MarkdownRenderer>
    </main>
  );
}
