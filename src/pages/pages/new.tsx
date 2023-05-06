import { usePages } from '@/hooks/usePages';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

const ClientSideEditor = dynamic(() => import('../../components/Editor'), { ssr: false });

const defaultTitle = `untitled_page_${new Date().toISOString().replace(/T/, '_').substring(0, 16)}`;

export default function Pages() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState(defaultTitle);
  const { savePage, isSavingPage } = usePages();

  const onTitleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setTitle(target.value);
  };

  const onEditorChange = (editorContent: string) => {
    setContent(editorContent);
  };

  const onSave = () => savePage({ title, content });

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
        <Link href="/pages">
          <button
            className={'btn btn-secondary btn-sm w-[10rem] px-12 mr-3'}
            disabled={isSavingPage}
          >
            Cancel
          </button>
        </Link>
        <button
          className={classNames('btn btn-primary btn-sm w-[10rem] px-12', {
            loading: isSavingPage,
          })}
          disabled={isSavingPage}
          onClick={onSave}
        >
          Save
        </button>
      </div>
      <ClientSideEditor onChange={onEditorChange} />
    </>
  );
}
