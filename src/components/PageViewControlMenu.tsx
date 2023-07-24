import classNames from 'classnames';
import { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { useEffectOnce } from 'react-use';

type PageViewControlMenuProps = {
  isOpen: boolean;
  isFullWidth: boolean;
  isSyncedScrolling: boolean;
  onOpen: (isOpen: boolean) => void;
  onToggleSyncedScrolling: () => void;
  onToggleFullWidth: () => void;
};

export const PageViewControlMenu: React.FC<PageViewControlMenuProps> = ({
  isOpen,
  isFullWidth,
  isSyncedScrolling,
  onOpen,
  onToggleSyncedScrolling,
  onToggleFullWidth,
}) => {
  const controlMenuRef = useRef<HTMLDetailsElement>(null);

  const toggleControlMenu = (toOpen?: boolean) => {
    if (!controlMenuRef.current) {
      return;
    }

    onOpen(toOpen ?? controlMenuRef.current.open ?? false);
  };

  const onDisableSyncedScrolling = () => {
    toggleControlMenu(false);
    onToggleSyncedScrolling();
  };

  const onFullWidth = () => {
    toggleControlMenu(false);
    onToggleFullWidth();
  };

  useEffectOnce(() => {
    if (!controlMenuRef.current) {
      return;
    }

    controlMenuRef.current.addEventListener('toggle', () => toggleControlMenu());
  });

  return (
    <div className={classNames('fixed bottom-0 right-0', !isMobile && 'group')}>
      <details
        ref={controlMenuRef}
        className={classNames(
          'dropdown dropdown-top dropdown-end',
          !isMobile && 'transition-transform group-hover:translate-y-0',
          isOpen ? 'translate-y-0' : 'translate-y-[88px]',
        )}
        open={isOpen}
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
              <i className="fa-solid fa-computer-mouse mr-1 py-2" />
              {isSyncedScrolling ? 'Disable' : 'Enable'} synced scrolling
            </a>
          </li>
          <li role="button" onClick={onFullWidth}>
            <a>
              <i className="fa-solid fa-arrows-left-right mr-1 py-2" />
              {isFullWidth ? 'Disable' : 'Enable'} Full Width
            </a>
          </li>
        </ul>
      </details>
    </div>
  );
};
