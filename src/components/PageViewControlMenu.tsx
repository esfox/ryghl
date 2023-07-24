import classNames from 'classnames';
import { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { useEffectOnce } from 'react-use';

type PageViewControlMenuProps = {
  isOpen: boolean;
  isFullWidth: boolean;
  isSyncedScrolling: boolean;
  isIncomingScrollSyncDisabled: boolean;
  onOpen: (isOpen: boolean) => void;
  onToggleFullWidth: () => void;
  onToggleSyncedScrolling: () => void;
  onToggleIncomingScrollSync: () => void;
};

export const PageViewControlMenu: React.FC<PageViewControlMenuProps> = ({
  isOpen,
  isFullWidth,
  isSyncedScrolling,
  isIncomingScrollSyncDisabled,
  onOpen,
  onToggleFullWidth,
  onToggleSyncedScrolling,
  onToggleIncomingScrollSync,
}) => {
  const controlMenuRef = useRef<HTMLDetailsElement>(null);

  const toggleControlMenu = (toOpen?: boolean) => {
    if (!controlMenuRef.current) {
      return;
    }

    onOpen(toOpen ?? controlMenuRef.current.open ?? false);
  };

  const closeMenu = () => toggleControlMenu(false);

  const toggleSyncedScrolling = () => {
    closeMenu();
    onToggleSyncedScrolling();
  };

  const toggleFullWidth = () => {
    closeMenu();
    onToggleFullWidth();
  };

  const toggleIncomingScrollSync = () => {
    closeMenu();
    onToggleIncomingScrollSync();
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
          !isMobile && !isOpen && 'translate-y-[88px]',
        )}
        open={isOpen}
      >
        <summary
          className={classNames(
            'btn btn-circle bg-base-100 border border-neutral-300 shadow-lg m-5',
            isMobile && '!min-h-0 w-10 h-10',
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
          {[
            {
              label: `${isFullWidth ? 'Disable' : 'Enable'} Full Width`,
              icon: 'arrows-left-right',
              onClick: toggleFullWidth,
            },
            {
              label: `${isSyncedScrolling ? 'Disable' : 'Enable'} synced scrolling`,
              icon: 'computer-mouse',
              onClick: toggleSyncedScrolling,
            },
            {
              label: `${isIncomingScrollSyncDisabled ? 'Enable' : 'Disable'} incoming scroll sync`,
              icon: 'square-arrow-up-right fa-flip-vertical',
              onClick: toggleIncomingScrollSync,
            },
          ].map(({ label, icon, onClick }, i) => (
            <li key={`control-menu-option-${i}`} role="button" onClick={onClick}>
              <a>
                <i className={`fa-solid fa-${icon} w-4 mr-1 py-2`} />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};
