import { PageContentDataType } from '@/types';
import { notion } from '@/utils/notion.utils';

import { APIResponseError } from '@notionhq/client';
import { ResponseCodes } from 'http-constants-ts';
import { convert2img } from 'mdimg';
import { NotionToMarkdown } from 'notion-to-md';

import type { NextApiRequest, NextApiResponse } from 'next';

const notionToMarkdown = new NotionToMarkdown({ notionClient: notion.client });

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  const pageId = query.id;
  if (!pageId || typeof pageId !== 'string') {
    return response.status(ResponseCodes.BAD_REQUEST).send('Bad Request');
  }

  let content;
  try {
    const markdownBlocks = await notionToMarkdown.pageToMarkdown(pageId);
    content = notionToMarkdown.toMarkdownString(markdownBlocks);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    const notionError = error as APIResponseError;
    return response
      .status(notionError.status ?? 500)
      .send(notionError.message ?? 'Internal Server Error');
  }

  const { withPreview } = query;
  const responseData: PageContentDataType = {
    pageId,
    content,
  };

  if (withPreview !== undefined) {
    const { data } = await convert2img({
      mdText: content || '‍',
      width: 300,
      height: 500,
      encoding: 'base64',
      cssTemplate: 'empty',
    });

    responseData.preview = `data:image/png;base64, ${data}`;
  }

  response.send(responseData);
}