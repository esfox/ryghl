import { apiService } from '@/services/api.service';

import { GetServerSidePropsContext } from 'next';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const pageId = context.query.id as string;
  const pageContentResponse = await apiService.getPageContent(pageId);
  return {
    props: pageContentResponse,
  };
}

export default function PageContent({ content }: { content: string }) {
  return <ReactMarkdown className="prose mx-auto py-12">{content}</ReactMarkdown>;
}
