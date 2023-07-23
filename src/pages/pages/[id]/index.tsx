import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { PageViewControlMenu } from '@/components/PageViewControlMenu';
import { useRealtime } from '@/hooks/useRealtime';
import { pagesService } from '@/services/pages.service';
import { convertScrollPercent, debounce } from '@/utils';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface PageContentProps {
  pageId: string;
  content: string;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
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
      pageId,
      content,
    },
  };
}

export default function PageContent({ pageId, content: pageContent }: PageContentProps) {
  const [isControlledScrolling, setIsControlledScrolling] = useState(false);
  const [isSyncedScrolling, setIsSyncedScrolling] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isControlMenuOpened, setIsControlMenuOpened] = useState(false);

  const { sendMessage: sendRealtimeMessage } = useRealtime({
    channelName: `scroll-${pageId}`,
    onMessage: (data) => {
      if (isSyncedScrolling) {
        return;
      }

      setIsControlledScrolling(true);
      const { scrollPercent } = data;
      const toScrollY = convertScrollPercent({ fromPercent: scrollPercent });
      window.scrollTo({ top: toScrollY, behavior: 'smooth' });
    },
  });

  const closeMenus = () => {
    setIsControlMenuOpened(false);
  };

  const onToggleControlMenu = (isOpen: boolean) => {
    setIsControlMenuOpened(isOpen);
  };

  const onToggleSyncedScrolling = () => {
    setIsSyncedScrolling(!isSyncedScrolling);
    toast.success(`Synced scrolling ${!isSyncedScrolling ? 'disabled' : 'enabled'}`, {
      position: 'bottom-center',
    });
  };

  const onToggleFullWidth = () => {
    setIsFullWidth(!isFullWidth);
  };

  useEffect(() => {
    const dispatchRealtimeScroll = debounce((scrollPercent: number) => {
      if (isSyncedScrolling) {
        return;
      }

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
  }, [sendRealtimeMessage, isControlledScrolling, isSyncedScrolling]);

  return (
    <>
      <div contentEditable suppressContentEditableWarning spellCheck={false} onClick={closeMenus}>
        <MarkdownRenderer fullWidth={isFullWidth}>{pageContent}</MarkdownRenderer>
      </div>
      <PageViewControlMenu
        isOpen={isControlMenuOpened}
        isFullWidth={isFullWidth}
        isSyncedScrolling={isSyncedScrolling}
        onOpen={onToggleControlMenu}
        onToggleSyncedScrolling={onToggleSyncedScrolling}
        onToggleFullWidth={onToggleFullWidth}
      />
    </>
  );
}
