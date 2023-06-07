import { Editor as TuiEditor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useRef } from 'react';
import { useEffectOnce } from 'react-use';

type EditorProps = {
  onChange?: (content: string) => void;
  initialContent?: string;
};

export default function Editor({ onChange, initialContent }: EditorProps) {
  const editorRef = useRef<TuiEditor>(null);

  const handleChange = () => {
    if (!editorRef || !onChange) {
      return;
    }

    const editorContent = editorRef.current?.getInstance().getMarkdown();
    onChange(editorContent || '');
  };

  useEffectOnce(() => {
    const editor = editorRef.current?.getInstance();
    if (!editor) {
      return;
    }

    editor.setMarkdown(initialContent ?? '');
  });

  return (
    <TuiEditor
      ref={editorRef}
      previewStyle="vertical"
      initialEditType="markdown"
      height="calc(100% - 3rem)"
      placeholder="Start writing..."
      useCommandShortcut={true}
      onChange={handleChange}
    />
  );
}
