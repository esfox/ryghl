import { apiService } from '@/services/api.service';

import { MarkdownRenderer } from './MarkdownRenderer';

import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { toPng } from 'html-to-image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ClientSideEditor = dynamic(() => import('./Editor'), { ssr: false });

const defaultTitle = `untitled_page_${new Date().toISOString().replace(/T/, '_').substring(0, 16)}`;
const previewImageMaxHeight = 1500;

type PageEditorProps = {
  pageId?: string;
  initialTitle?: string;
  initialContent?: string;
};

export const PageEditor: React.FC<PageEditorProps> = ({ pageId, initialTitle, initialContent }) => {
  const [content, setContent] = useState(initialContent ?? '');
  const [title, setTitle] = useState(initialTitle ?? defaultTitle);

  const markdownPreview = useRef<HTMLDivElement>(null);

  const [isSavingPage, setIsSavingPage] = useState(false);
  const { mutateAsync: savePage } = useMutation({
    mutationFn: (params: { id?: string; title: string; content: string; previewImage?: string }) =>
      apiService.savePage(params),
  });

  const onTitleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setTitle(target.value);
  };

  const onEditorChange = (editorContent: string) => {
    setContent(editorContent);
  };

  const onSave = async () => {
    setIsSavingPage(true);

    /* This is such a hack to create a preview image...
      The hidden markdown preview element is temporarily shown
      then an image is generated from its child elements, then
      it is again hidden after generating the image. */
    document.body.style.overflow = 'hidden';
    const markdownPreviewElement = markdownPreview.current;
    if (!markdownPreviewElement) {
      return;
    }

    markdownPreviewElement.style.display = 'block';
    const previewImage = await toPng(markdownPreviewElement.firstChild as HTMLElement, {
      style: { margin: '0' },
      height: previewImageMaxHeight,
    });

    markdownPreviewElement.style.display = 'none';
    document.body.style.overflow = 'initial';

    /* Save the actual page */
    await savePage({ id: pageId, title, content, previewImage });
    toast.success('Page saved successfully!', {
      duration: 4000,
    });

    setIsSavingPage(false);
  };

  return (
    <>
      <div className="h-12 flex items-center justify-between px-2">
        <input
          value={title}
          type="text"
          placeholder="Page title..."
          className="input input-ghost w-full max-w-full p-2 mr-4 h-8 text-xl font-bold"
          onChange={onTitleChange}
        />
        <Link
          href="/pages"
          className={classNames('btn btn-secondary btn-sm w-[10rem] mr-3', {
            'btn-disabled': isSavingPage,
          })}
          role="button"
        >
          Back to pages
        </Link>
        <button
          className="btn btn-primary btn-sm w-[10rem]"
          disabled={isSavingPage}
          onClick={onSave}
        >
          {isSavingPage ? (
            <>
              Saving
              <span className="loading loading-dots loading-xs"></span>
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
      <ClientSideEditor onChange={onEditorChange} initialContent={initialContent} />
      <Toaster />
      {/* This element is a hidden element used only for generating the preview of the page */}
      <div ref={markdownPreview} style={{ display: 'none' }}>
        <MarkdownRenderer>{content}</MarkdownRenderer>
      </div>
    </>
  );
};
