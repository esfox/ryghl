import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useRealtime } from '@/hooks/useRealtime';
import { pagesService } from '@/services/pages.service';
import { convertScrollPercent, debounce } from '@/utils';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';

interface PageContentProps {
  content: string;
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

  let content: string;
  try {
    const file = await pagesService.getContent(pageId);
    content = await file.text();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return redirect();
  }

  if (!content) {
    return redirect();
  }

  return {
    props: {
      content,
    },
  };
}

export default function PageContent({ content: pageContent }: PageContentProps) {
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
      <MarkdownRenderer>{pageContent}</MarkdownRenderer>
    </main>
  );
}
