import { NOTION_INTEGRATION_SECRET } from '@/constants';

import { Client } from '@notionhq/client';

const client = new Client({
  auth: NOTION_INTEGRATION_SECRET,
});

export const notion = {
  client,
};
