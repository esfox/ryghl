import React from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';

type MarkdownRendererProps = {
  children: string;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => (
  <ReactMarkdown className="prose mx-auto break-words p-8" rehypePlugins={[rehypeRaw]}>
    {children}
  </ReactMarkdown>
);
