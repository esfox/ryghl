import { apiService } from '@/services/api.service';

import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ChangeEvent, KeyboardEventHandler, useRef, useState } from 'react';

type EventsTableRowProps = {
  id: string;
  date: string;
  name: string;
  onDeleteSuccess?: () => void;
};

export const EventsTableRow: React.FC<EventsTableRowProps> = ({
  date,
  id,
  name,
  onDeleteSuccess,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);

  const [eventName, setEventName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: deleteEvent } = useMutation({
    mutationFn: (eventId: string) => apiService.deleteEvent(eventId),
    onSuccess: () => {
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
  });

  const onCloseMenu = () => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  };

  const onToggleEdit = () => {
    onCloseMenu();
    setIsEditing(!isEditing);
    if (!isEditing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };

  const onClickDelete = async () => {
    setIsLoading(true);
    await deleteEvent(id);
    setIsLoading(false);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setEventName(name);
  };

  const onEditName = (event: ChangeEvent<HTMLInputElement>) => setEventName(event.target.value);

  const onSave = () => {
    setIsEditing(false);
  };

  const onInputEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      onSave();
    }
  };

  return (
    <tr className={classNames('h-12', isLoading && 'opacity-50')}>
      <td className="w-32 py-0">{dayjs(date).format('MMMM D')}</td>
      <td className="py-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            placeholder="Type here"
            className="input input-ghost w-full h-6 px-2 max-w-xs"
            value={eventName}
            onChange={onEditName}
            onKeyUp={onInputEnter}
          />
        ) : (
          <strong className={classNames(isLoading && 'opacity-50')}>{eventName}</strong>
        )}
      </td>
      <td className="w-[1%] whitespace-nowrap py-0">
        {isEditing && (
          <>
            <button className="btn btn-xs btn-circle btn-ghost" onClick={onSave}>
              <i className="fa-solid fa-save" />
            </button>
            <button className="btn btn-xs btn-circle btn-ghost" onClick={onCancelEdit}>
              <i className="fa-solid fa-xmark" />
            </button>
          </>
        )}
        {!isEditing && !isLoading && (
          <details ref={menuRef} className="dropdown dropdown-left dropdown-bottom">
            <summary
              className={classNames('btn btn-circle btn-xs btn-ghost', isLoading && 'btn-disabled')}
            >
              <i className="fa-solid fa-ellipsis-vertical" />
            </summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
              <li>
                <a onClick={onToggleEdit}>
                  <i className="fa-solid fa-pen fa-sm mr-1 py-2" />
                  Edit
                </a>
              </li>
              <li role="button" onClick={onClickDelete}>
                <a className="text-red-500">
                  <i className="fa-solid fa-trash fa-sm mr-1 py-2" />
                  Delete
                </a>
              </li>
            </ul>
          </details>
        )}

        {!isEditing && isLoading && <span className="loading loading-dots loading-xs"></span>}
      </td>
    </tr>
  );
};
