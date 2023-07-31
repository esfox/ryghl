import { EventAddModal, EventAddModalOnSave } from '@/components/EventAddModal';
import { EventsTableRow } from '@/components/EventsTableRow';
import { apiService } from '@/services/api.service';
import { eventsService } from '@/services/events.service';
import { EventType, SaveEventType } from '@/types';

import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

interface EventsProps {
  data: EventType[];
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<EventsProps> | undefined
> {
  const redirect = () => ({
    redirect: {
      permanent: false,
      destination: '/404',
    },
  });

  let data: EventType[];
  try {
    data = await eventsService.list();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return redirect();
  }

  if (!data) {
    return redirect();
  }

  return {
    props: {
      data,
    },
  };
}

export default function Events({ data }: EventsProps) {
  const router = useRouter();

  const { mutateAsync: saveEvent } = useMutation({
    mutationFn: (payload: SaveEventType) => apiService.saveEvent(payload),
    onSuccess: () => router.replace(router.asPath),
  });

  const eventAddModal = useRef<HTMLDialogElement>(null);

  const [isSaving, setIsSaving] = useState(false);

  const onAddEvent = () => eventAddModal.current?.showModal();
  const onAddEventCancel = () => eventAddModal.current?.close();
  const onAddEventSave: EventAddModalOnSave = async (event) => {
    setIsSaving(true);
    await saveEvent(event);
    setIsSaving(false);
    eventAddModal.current?.close();
    toast.success('Event saved successfully', {
      duration: 4000,
    });
  };

  const background = 'hsl(var(--b1) / 1';
  return (
    <>
      <div className="w-[40rem] grid place-items-center mx-auto">
        <div className="sticky top-0 w-full flex flex-row-reverse pt-4 z-50" style={{ background }}>
          <button className="btn btn-primary btn-sm" onClick={onAddEvent}>
            <i className="fa-solid fa-plus"></i>
            Add
          </button>
        </div>
        <table className="table table-zebra table-auto">
          <thead>
            <tr className="sticky top-12" style={{ background }}>
              <th>Date</th>
              <th>Event</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((event, i) => (
              <EventsTableRow
                key={`event-${Date.now()}-${i}`}
                date={event.date}
                name={event.name}
              />
            ))}
          </tbody>
        </table>
      </div>
      <EventAddModal
        ref={eventAddModal}
        onSave={onAddEventSave}
        onCancel={onAddEventCancel}
        loading={isSaving}
      />
    </>
  );
}
