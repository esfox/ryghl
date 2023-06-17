import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRealtime } from '@/hooks/useRealtime';
import { pagesService } from '@/services/pages.service';
import { convertScrollPercent, debounce } from '@/utils';

import classNames from 'classnames';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useEffectOnce } from 'react-use';

interface PageContentProps {
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
      content,
    },
  };
}

function useControlMenu() {
  const [isControlMenuOpen, setIsControlMenuOpen] = useState(false);
  const controlMenuRef = useRef<HTMLDetailsElement>(null);

  /* A ref is used for the synced scrolling state since it is used in functions
    that might not get this value's actual current state. */
  const isSyncedScrollingDisabledRef = useRef(false);

  const closeControlMenu = () => {
    if (!controlMenuRef.current) {
      return;
    }

    controlMenuRef.current.open = false;
  };

  const onDisableSyncedScrolling = () => {
    closeControlMenu();

    isSyncedScrollingDisabledRef.current = !isSyncedScrollingDisabledRef.current;
    toast.success(
      `Synced scrolling ${isSyncedScrollingDisabledRef.current ? 'disabled' : 'enabled'}`,
      {
        position: 'bottom-center',
      },
    );
  };

  useEffectOnce(() => {
    if (!controlMenuRef.current) {
      return;
    }

    controlMenuRef.current.addEventListener('toggle', () =>
      setIsControlMenuOpen(controlMenuRef.current?.open ?? false),
    );
  });

  return {
    controlMenuRef,
    isControlMenuOpen,
    isSyncedScrollingDisabledRef,
    closeControlMenu,
    onDisableSyncedScrolling,
  };
}

export default function PageContent({ content: pageContent }: PageContentProps) {
  const [isControlledScrolling, setIsControlledScrolling] = useState(false);

  const { isMobile } = useIsMobile();
  const {
    isControlMenuOpen,
    controlMenuRef,
    isSyncedScrollingDisabledRef,
    closeControlMenu,
    onDisableSyncedScrolling,
  } = useControlMenu();

  const { sendMessage: sendRealtimeMessage } = useRealtime({
    channelName: 'scroll',
    onMessage: (data) => {
      if (isSyncedScrollingDisabledRef.current) {
        return;
      }

      setIsControlledScrolling(true);
      const { scrollPercent } = data;
      const toScrollY = convertScrollPercent({ fromPercent: scrollPercent });
      window.scrollTo({ top: toScrollY, behavior: 'smooth' });
    },
  });

  useEffect(() => {
    const dispatchRealtimeScroll = debounce((scrollPercent: number) => {
      if (isSyncedScrollingDisabledRef.current) {
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
  }, [sendRealtimeMessage, isControlledScrolling, isSyncedScrollingDisabledRef]);

  return (
    <>
      <div
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onClick={closeControlMenu}
      >
        <MarkdownRenderer>{pageContent}</MarkdownRenderer>
      </div>
      <div className={classNames('fixed bottom-0 right-0', !isMobile && 'group')}>
        <details
          ref={controlMenuRef}
          className={classNames(
            'dropdown dropdown-top dropdown-end',
            !isMobile && 'translate-y-[88px] transition-transform group-hover:translate-y-0',
            isControlMenuOpen && 'translate-y-0',
          )}
          open={false}
        >
          <summary
            className={classNames(
              'btn btn-circle bg-base-100 border border-neutral-300 shadow-lg',
              isMobile ? 'btn-sm m-3' : 'm-5',
            )}
          >
            <i
              className={classNames(
                'fa-solid fa-ellipsis-vertical color text-neutral-400',
                !isMobile && 'fa-lg',
              )}
            />
          </summary>
          <ul
            tabIndex={0}
            className="shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64"
          >
            <li role="button" onClick={onDisableSyncedScrolling}>
              <a>
                <i className="fa-solid fa-computer-mouse mr-1" />
                {isSyncedScrollingDisabledRef.current ? 'Enable' : 'Disable'} synced scrolling
              </a>
            </li>
          </ul>
        </details>
      </div>
    </>
  );
}
