import classNames from 'classnames';
import { isMobile } from 'react-device-detect';

type ZoomControlsProps = {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
};

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onZoomReset }) => (
  <div className={classNames('fixed bottom-0 left-0', !isMobile && 'group')}>
    <div
      className={classNames(
        'join py-5 px-8',
        !isMobile && 'transition-transform translate-y-[100%] group-hover:translate-y-0',
      )}
    >
      <button
        className={classNames('btn bg-base-100 join-item', isMobile && '!min-h-0 w-10 h-10')}
        onClick={onZoomOut}
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      <button
        className={classNames('btn bg-base-100 join-item', isMobile && '!min-h-0 w-10 h-10')}
        onClick={onZoomReset}
      >
        <i className="fa-solid fa-rotate-left"></i>
      </button>
      <button
        className={classNames('btn bg-base-100 join-item', isMobile && '!min-h-0 w-10 h-10')}
        onClick={onZoomIn}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>
);
