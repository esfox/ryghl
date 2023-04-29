import { Client } from '@notionhq/client';

const notionIntegrationSecret = process.env.NOTION_INTEGRATION_SECRET;
const client = new Client({
  auth: notionIntegrationSecret,
});

export const notion = {
  client,
};
