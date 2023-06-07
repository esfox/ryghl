import { apiService } from '@/services/api.service';

import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ClientSideEditor = dynamic(() => import('./Editor'), { ssr: false });

const defaultTitle = `untitled_page_${new Date().toISOString().replace(/T/, '_').substring(0, 16)}`;

type PageEditorProps = {
  initialTitle?: string;
  initialContent?: string;
};

export const PageEditor: React.FC<PageEditorProps> = ({ initialTitle, initialContent }) => {
  const [content, setContent] = useState(initialContent ?? '');
  const [title, setTitle] = useState(initialTitle ?? defaultTitle);

  const { mutateAsync: savePage, isLoading: isSavingPage } = useMutation({
    mutationFn: (params: { title: string; content: string }) =>
      apiService.savePage(params.title.trim(), params.content),
  });

  const onTitleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setTitle(target.value);
  };

  const onEditorChange = (editorContent: string) => {
    setContent(editorContent);
  };

  const onSave = async () => {
    await savePage({ title, content });
    toast.success('Page saved successfully!', {
      duration: 4000,
    });
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
          className={classNames('btn btn-primary btn-sm w-[10rem]', {
            loading: isSavingPage,
          })}
          disabled={isSavingPage}
          onClick={onSave}
        >
          Save
        </button>
      </div>
      <ClientSideEditor onChange={onEditorChange} initialContent={initialContent} />
      <Toaster />
    </>
  );
};
