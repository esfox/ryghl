import { Modal } from '@/components/Modal';

import dayjs from 'dayjs';
import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  MouseEventHandler,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from 'react';

export type EventAddModalOnSave = (data: { name: string; date: string }) => Promise<void>;

type EventAddModalProps = {
  onSave: EventAddModalOnSave;
  onCancel: () => void;
  loading?: boolean;
};

const monthOptions = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

export const EventAddModal = forwardRef<HTMLDialogElement, EventAddModalProps>(
  ({ onSave, onCancel, loading }, ref) => {
    const [data, setData] = useState({
      name: '',
      month: monthOptions[0].value,
      day: 1,
    });

    const formRef = useRef<HTMLFormElement>(null);

    const dayOptions = useMemo(() => {
      const daysInMonth = dayjs().month(data.month).daysInMonth();
      return Array(daysInMonth)
        .fill(1)
        .map((_, i) => i + 1);
    }, [data.month]);

    const onFormChange = (event: ChangeEvent<HTMLFormElement>) => {
      const formData = new FormData(event.currentTarget);
      setData({
        name: formData.get('name') as string,
        month: Number(formData.get('month')),
        day: Number(formData.get('day')),
      });
    };

    const onSaveEvent = (event: FormEvent) => {
      const isValid = formRef.current?.reportValidity();
      if (!isValid) {
        return;
      }

      event.preventDefault();

      const date = dayjs().month(data.month).date(data.day).format('MM-DD');
      onSave({ name: data.name, date });
    };

    const onSubmitForm: FormEventHandler = (event) => onSaveEvent(event);
    const onClickSave: MouseEventHandler = (event) => onSaveEvent(event);
    const onClickCancel: MouseEventHandler = (event) => {
      event.preventDefault();
      onCancel();
    };

    return (
      <Modal ref={ref}>
        <form ref={formRef} onChange={onFormChange} onSubmit={onSubmitForm}>
          <h3 className="font-bold text-lg mb-3">Add New Event</h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Event Name</span>
            </label>
            <input
              value={data.name}
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="John's Birthday"
              disabled={loading}
              onChange={() => {}}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Month</span>
              </label>
              <select
                value={data.month}
                name="month"
                className="select select-bordered w-full"
                disabled={loading}
                onChange={() => {}}
                required
              >
                <option disabled selected>
                  Select Month
                </option>
                {monthOptions.map(({ value, label }) => (
                  <option key={`month-${value}`} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Day</span>
              </label>
              <select
                value={data.day}
                name="day"
                className="select select-bordered w-full"
                disabled={loading}
                onChange={() => {}}
                required
              >
                {dayOptions.map((day) => (
                  <option key={`day-${day}`}>{day}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={onClickCancel} disabled={loading}>
              <i className="fa-solid fa-xmark"></i>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onClickSave} disabled={loading}>
              {loading ? (
                <>
                  <i className="loading loading-dots loading-xs"></i>
                  Saving
                </>
              ) : (
                <>
                  <i className="fa-solid fa-save"></i>
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    );
  },
);

EventAddModal.displayName = 'EventAddModal';
