import { PageEditor } from '@/components/PageEditor';
import { pagesService } from '@/services/pages.service';
import { PageType } from '@/types';
import { mapPageRecords } from '@/utils/mapper.util';

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

interface EditPageProps {
  data: PageType;
  content: string;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<EditPageProps> | undefined> {
  const pageId = context.query.id as string;

  const redirect = () => ({
    redirect: {
      permanent: false,
      destination: '/404',
    },
  });

  let data: PageType;
  try {
    const [pageRecord] = await pagesService.get(pageId);
    [data] = mapPageRecords([pageRecord]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return redirect();
  }

  let content: string;
  try {
    const file = await pagesService.getContent(data.id);
    content = await file.text();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return redirect();
  }

  if (!content) {
    return redirect();
  }

  return {
    props: {
      data,
      content,
    },
  };
}
export default function EditPage({ data, content }: EditPageProps) {
  return <PageEditor initialTitle={data.title} initialContent={content} />;
}
