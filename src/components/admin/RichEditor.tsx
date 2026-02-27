'use client';
import { useRef, useCallback } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichEditor({ value, onChange, placeholder = 'Start writing...', minHeight = '300px' }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) exec('insertHTML', `<img src="${url}" alt="Image" style="max-width:100%;margin:0.5em 0;border-radius:4px;" />`);
  }, [exec]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  }, [exec]);

  return (
    <div>
      <div className="editor-toolbar">
        <button type="button" onClick={() => exec('bold')} title="Bold"><i className="fa-solid fa-bold"></i></button>
        <button type="button" onClick={() => exec('italic')} title="Italic"><i className="fa-solid fa-italic"></i></button>
        <button type="button" onClick={() => exec('underline')} title="Underline"><i className="fa-solid fa-underline"></i></button>
        <button type="button" onClick={() => exec('strikeThrough')} title="Strikethrough"><i className="fa-solid fa-strikethrough"></i></button>
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
        <button type="button" onClick={() => exec('formatBlock', 'h2')} title="Heading 2"><i className="fa-solid fa-heading"></i>2</button>
        <button type="button" onClick={() => exec('formatBlock', 'h3')} title="Heading 3"><i className="fa-solid fa-heading"></i>3</button>
        <button type="button" onClick={() => exec('formatBlock', 'p')} title="Paragraph"><i className="fa-solid fa-paragraph"></i></button>
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
        <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet List"><i className="fa-solid fa-list-ul"></i></button>
        <button type="button" onClick={() => exec('insertOrderedList')} title="Numbered List"><i className="fa-solid fa-list-ol"></i></button>
        <button type="button" onClick={() => exec('formatBlock', 'blockquote')} title="Quote"><i className="fa-solid fa-quote-right"></i></button>
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
        <button type="button" onClick={insertLink} title="Insert Link"><i className="fa-solid fa-link"></i></button>
        <button type="button" onClick={insertImage} title="Insert Image"><i className="fa-solid fa-image"></i></button>
        <button type="button" onClick={() => exec('insertHorizontalRule')} title="Horizontal Rule"><i className="fa-solid fa-minus"></i></button>
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
        <button type="button" onClick={() => exec('removeFormat')} title="Clear Formatting"><i className="fa-solid fa-eraser"></i></button>
      </div>
      <div
        ref={editorRef}
        className="rich-editor"
        contentEditable
        style={{ minHeight, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
