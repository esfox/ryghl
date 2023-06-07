import { PageEditor } from '@/components/PageEditor';
import { pagesService } from '@/services/pages.service';
import { PageContentDataType } from '@/types';

import { HTTPError } from 'ky';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

interface EditPageProps {
  page: PageContentDataType;
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

  let pageContentData: PageContentDataType | undefined;
  try {
    const file = await pagesService.get(pageId);
    const content = await file.text();
    pageContentData = {
      pageId,
      content,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status === 404) {
        return redirect();
      }
    }

    // eslint-disable-next-line no-console
    console.error(error);
  }

  if (!pageContentData) {
    return redirect();
  }

  return {
    props: {
      page: pageContentData ?? {},
    },
  };
}
export default function EditPage({ page }: EditPageProps) {
  return <PageEditor initialTitle={page.pageId} initialContent={page.content} />;
}
