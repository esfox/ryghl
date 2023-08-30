import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { PageViewControlMenu } from '@/components/PageViewControlMenu';
import { ZoomControls } from '@/components/ZoomControls';
import { useRealtime } from '@/hooks/useRealtime';
import { pagesService } from '@/services/pages.service';
import { SyncedScrollingPayload } from '@/types';
import { debounce, collectLeafNodes } from '@/utils';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useEffectOnce } from 'react-use';

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

const fontSizeDefault = 16;
const fontSizeStep = 1;

export default function PageContent({ pageId, content: pageContent }: PageContentProps) {
  /* Mounted state is used for avoiding SSR of the control menu and zoom controls. */
  const [isMounted, setIsMounted] = useState(false);

  const [isControlledScrolling, setIsControlledScrolling] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(true);
  const [isControlMenuOpened, setIsControlMenuOpened] = useState(false);
  const [fontSize, setFontSize] = useState(fontSizeDefault);

  /* A ref is used for the first line of the page
    content since it is only set one time anyway. */
  const contentFirstLine = useRef<string>();

  /* A ref is used for the synced scrolling state since it is used in
    an effect that might not get the actual value of this. */
  const isSyncedScrolling = useRef(true);
  const isIncomingScrollSyncDisabled = useRef(false);

  /* A ref is used for the first visible element ID since it is also
    used in an effect that might not get the actual value of this. */
  const firstVisibleChildId = useRef<string>();

  const pageContentWrapper = useRef<HTMLDivElement>(null);

  const { sendMessage: sendRealtimeMessage } = useRealtime({
    channelName: `scroll-${pageId}`,
    onMessage: (data: SyncedScrollingPayload) => {
      if (
        !isSyncedScrolling.current ||
        isIncomingScrollSyncDisabled.current ||
        !pageContentWrapper.current
      ) {
        return;
      }

      setIsControlledScrolling(true);
      const childToScrollTo = document.getElementById(data.firstVisibleChildId);
      if (!childToScrollTo) {
        return;
      }
      const offset = 10;
      window.scrollTo({ top: childToScrollTo.offsetTop - offset, behavior: 'smooth' });
    },
  });

  const closeMenus = () => {
    setIsControlMenuOpened(false);
  };

  const onToggleControlMenu = (isOpen: boolean) => {
    setIsControlMenuOpened(isOpen);
  };

  const onToggleFullWidth = () => {
    setIsFullWidth(!isFullWidth);
  };

  const onToggleSyncedScrolling = () => {
    isSyncedScrolling.current = !isSyncedScrolling.current;
    toast.success(`Synced scrolling ${!isSyncedScrolling.current ? 'disabled' : 'enabled'}`, {
      position: 'bottom-center',
    });
  };

  const onToggleIncomingScrollSync = () => {
    isIncomingScrollSyncDisabled.current = !isIncomingScrollSyncDisabled.current;
    toast.success(
      `Incoming scroll sync ${isIncomingScrollSyncDisabled.current ? 'disabled' : 'enabled'}`,
      {
        position: 'bottom-center',
      },
    );
  };

  const onZoomIn = () => setFontSize(fontSize + fontSizeStep);
  const onZoomOut = () => setFontSize(fontSize - fontSizeStep);
  const onZoomReset = () => setFontSize(fontSizeDefault);

  useEffect(() => {
    const dispatchRealtimeScroll = debounce(() => {
      if (!isSyncedScrolling.current || !firstVisibleChildId.current) {
        return;
      }

      const syncedScrollingPayload: SyncedScrollingPayload = {
        firstVisibleChildId: firstVisibleChildId.current,
      };

      sendRealtimeMessage(syncedScrollingPayload);
    }, 200);

    let scrollingTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      if (!isControlledScrolling) {
        return dispatchRealtimeScroll();
      }

      clearTimeout(scrollingTimeout);
      scrollingTimeout = setTimeout(() => setIsControlledScrolling(false), 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sendRealtimeMessage, isControlledScrolling]);

  /* On first render, all leaf nodes in the page content are collected and:
    - each is assigned an ID
    - an Intersection Observer observes each
    When one of the leaf nodes enters in view, the Intersection Observer callback
    assigns a data attribute to the leaf node indicating that it is in view.
    Then the ID of the first of those nodes in view is taken and sent to the realtime
    channel. That ID will then be the indicator of the element where to scroll to
    for the scroll syncing.
    Also, the first line of the page content is taken and set as the tab title. */
  useEffectOnce(() => {
    setIsMounted(true);

    const contentWrapper = pageContentWrapper.current;
    if (!contentWrapper) {
      return;
    }

    const pageContentElement = contentWrapper.firstChild as HTMLElement;
    const leafNodes = collectLeafNodes({
      parentNode: pageContentElement,
      excludedNodeNames: ['U', 'STRONG', 'EM'],
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const inViewDataName = 'inview';
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.dataset[inViewDataName] = 'true';
          } else {
            delete element.dataset[inViewDataName];
          }
        }

        const firstEntryInView = pageContentElement.querySelector(`[data-${inViewDataName}]`);
        firstVisibleChildId.current = firstEntryInView?.id;
      },
      { threshold: 1 },
    );

    for (let i = 0; i < leafNodes.length; i += 1) {
      /* Assign an ID to each leaf node */
      const child = leafNodes[i];
      child.id = `child-${i + 1}`;

      /* Observe each leaf node for intersection */
      observer.observe(child);
    }

    /* Get the first line of the content. */
    contentFirstLine.current = contentWrapper.textContent?.split('\n', 1)[0];

    return () => {
      observer.disconnect();
    };
  });

  return (
    <>
      <Head>
        <title>{contentFirstLine.current}</title>
      </Head>
      <div
        id="markdown-page-content"
        ref={pageContentWrapper}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onClick={closeMenus}
        style={{ '--markdown-renderer-font-size': fontSize } as CSSProperties}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      >
        <MarkdownRenderer fullWidth={isFullWidth}>{pageContent}</MarkdownRenderer>
      </div>
      {isMounted && (
        <>
          <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} onZoomReset={onZoomReset} />
          <PageViewControlMenu
            isOpen={isControlMenuOpened}
            isFullWidth={isFullWidth}
            isSyncedScrolling={isSyncedScrolling.current}
            isIncomingScrollSyncDisabled={isIncomingScrollSyncDisabled.current}
            onOpen={onToggleControlMenu}
            onToggleSyncedScrolling={onToggleSyncedScrolling}
            onToggleFullWidth={onToggleFullWidth}
            onToggleIncomingScrollSync={onToggleIncomingScrollSync}
          />
        </>
      )}
    </>
  );
}
