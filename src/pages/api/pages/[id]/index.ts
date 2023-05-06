import { PageContentDataType } from '@/types';
import { notion } from '@/utils/notion.util';

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

  let markdownBlocks;
  try {
    markdownBlocks = await notionToMarkdown.pageToMarkdown(pageId);
  } catch (error) {
    // eslint-disable-next-line no-console
    const notionError = error as APIResponseError;
    return response
      .status(notionError.status ?? 500)
      .send(notionError.message ?? 'Internal Server Error');
  }

  if (markdownBlocks.length === 0) {
    return response.status(ResponseCodes.NOT_FOUND).send('Not Found');
  }

  const content = notionToMarkdown.toMarkdownString(markdownBlocks);

  const { withPreview } = query;
  const responseData: PageContentDataType = {
    pageId,
    content,
  };

  if (withPreview !== undefined && withPreview !== 'false') {
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
