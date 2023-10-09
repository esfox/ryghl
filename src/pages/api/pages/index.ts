import { defaultCountPerPage } from '@/constants/pages';
import { pagesService } from '@/services/pages.service';
import { mapPageRecords } from '@/utils/mapper.util';

import { NextRequest, NextResponse } from 'next/server';

const defaults = {
  page: 1,
  countPerPage: defaultCountPerPage,
};

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const page = Number(query.get('page') ?? defaults.page);
  const countPerPage = Number(query.get('countPerPage') ?? defaults.countPerPage);
  const search = query.get('search') ?? '';
  const pageRecords = await pagesService.list({ page, countPerPage, search });
  const pages = mapPageRecords(pageRecords);
  return NextResponse.json(pages);
}
