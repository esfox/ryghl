/* eslint-disable no-console */
import { SUPABASE_BUCKET_NAME, SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY } from '@/constants';
import { EventType, SaveEventType } from '@/types';
import { nanoid } from '@/utils/nanoid.util';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY);

const eventsJsonFilename = 'events.json';

function bucket() {
  return supabase.storage.from(SUPABASE_BUCKET_NAME);
}

export const eventsService = {
  async list() {
    const { data, error } = await bucket().download(eventsJsonFilename);
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
      if (!eventToEditIndex) {
        return events;
      }

      events[eventToEditIndex] = {
        id,
        name,
        date,
      };
    }

    /* Save the events JSON file */
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
