import classNames from 'classnames';
import React from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';

type MarkdownRendererProps = {
  children: string;
  fullWidth?: boolean;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children, fullWidth }) => (
  <ReactMarkdown
    className={classNames('prose mx-auto break-words p-8', fullWidth ? 'max-w-full' : '')}
    rehypePlugins={[rehypeRaw]}
  >
    {children}
  </ReactMarkdown>
);
