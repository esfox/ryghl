import dayjs from 'dayjs';
import { ChangeEvent, useState } from 'react';

type EventsTableRowProps = {
  date: string;
  name: string;
};

export const EventsTableRow: React.FC<EventsTableRowProps> = ({ date, name }) => {
  const [eventName, setEventName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const onToggleEdit = () => setIsEditing(!isEditing);

  const onSave = () => {
    setIsEditing(false);
  };

  const onEditName = (event: ChangeEvent<HTMLInputElement>) => setEventName(event.target.value);

  return (
    <tr>
      <td className="w-40">{dayjs(date).format('MMMM D')}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            placeholder="Type here"
            className="input input-ghost w-full h-6 px-2 max-w-xs"
            value={eventName}
            onChange={onEditName}
          />
        ) : (
          <strong>{eventName}</strong>
        )}
      </td>
      <td className="w-[1%] whitespace-nowrap">
        {isEditing ? (
          <button className="btn btn-xs btn-circle btn-ghost" onClick={onSave}>
            <i className="fa-solid fa-save" />
          </button>
        ) : (
          <button className="btn btn-xs btn-circle btn-ghost" onClick={onToggleEdit}>
            <i className="fa-solid fa-pen text-neutral-600" />
          </button>
        )}
      </td>
    </tr>
  );
};
