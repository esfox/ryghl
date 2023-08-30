/* eslint-disable no-console */
import { SUPABASE_BUCKET_NAME } from '@/constants';
import { supabase } from '@/supabase';
import { EventType, SaveEventType } from '@/types';
import { nanoid } from '@/utils/nanoid.util';

const eventsJsonFilename = 'events.json';

function bucket() {
  return supabase.storage.from(SUPABASE_BUCKET_NAME);
}

export const eventsService = {
  async list() {
    /* Add a timestamp to the query string to avoid cached downloading */
    const timestampedFilename = `${eventsJsonFilename}?=${Date.now()}`;
    const { data, error } = await bucket().download(timestampedFilename);
    if (error) {
      throw error;
    }

    const dataString = await data.text();
    const events: EventType[] = JSON.parse(dataString);
    return events;
  },

  async save(params: SaveEventType) {
    const { id, date, name } = params;

    /* Get the events JSON file content */
    const events = await this.list();
    if (!id) {
      events.push({
        id: nanoid(16),
        name,
        date,
      });
    } else {
      const eventToEditIndex = events.findIndex((event) => event.id === id);
      if (eventToEditIndex < 0) {
        return events;
      }

      events[eventToEditIndex] = {
        id,
        name,
        date,
      };
    }

    /* Save the events JSON file */
    await this.upload(events);
    return events;
  },

  async remove(eventId: string) {
    const events = await this.list();
    const eventToEditIndex = events.findIndex((event) => event.id === eventId);
    if (eventToEditIndex < 0) {
      return;
    }

    events.splice(eventToEditIndex, 1);
    await this.upload(events);
    return events;
  },

  async upload(events: EventType[]) {
    const eventsJson = JSON.stringify(events);
    const uploadResult = await bucket().upload(eventsJsonFilename, eventsJson, {
      contentType: 'application/json;charset=UTF-8',
      upsert: true,
    });

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    return events;
  },
};
