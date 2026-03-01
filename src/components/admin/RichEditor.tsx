'use client';
import { useRef, useCallback, useEffect, useState } from 'react';
interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}
type BtnDef = {
  cmd: string;
  icon?: string;
  label?: string;
  val?: string;
  type?: 'button' | 'separator' | 'select';
  options?: { label: string; val: string }[];
  title: string;
};
const TOOLBAR: BtnDef[][] = [
  [
    { cmd: 'undo', icon: 'fa-solid fa-rotate-left', title: 'Undo (Ctrl+Z)' },
    { cmd: 'redo', icon: 'fa-solid fa-rotate-right', title: 'Redo (Ctrl+Y)' },
  ],
  [
    { cmd: 'bold', icon: 'fa-solid fa-bold', title: 'Bold (Ctrl+B)' },
    { cmd: 'italic', icon: 'fa-solid fa-italic', title: 'Italic (Ctrl+I)' },
    { cmd: 'underline', icon: 'fa-solid fa-underline', title: 'Underline (Ctrl+U)' },
    { cmd: 'strikeThrough', icon: 'fa-solid fa-strikethrough', title: 'Strikethrough' },
  ],
  [
    { cmd: 'formatBlock', val: 'h2', label: 'H2', title: 'Heading 2' },
    { cmd: 'formatBlock', val: 'h3', label: 'H3', title: 'Heading 3' },
    { cmd: 'formatBlock', val: 'p', icon: 'fa-solid fa-paragraph', title: 'Normal text' },
  ],
  [
    { cmd: 'justifyLeft', icon: 'fa-solid fa-align-left', title: 'Align left' },
    { cmd: 'justifyCenter', icon: 'fa-solid fa-align-center', title: 'Align center' },
    { cmd: 'justifyRight', icon: 'fa-solid fa-align-right', title: 'Align right' },
  ],
  [
    { cmd: 'insertUnorderedList', icon: 'fa-solid fa-list-ul', title: 'Bullet list' },
    { cmd: 'insertOrderedList', icon: 'fa-solid fa-list-ol', title: 'Numbered list' },
    { cmd: 'formatBlock', val: 'blockquote', icon: 'fa-solid fa-quote-right', title: 'Blockquote' },
  ],
  [
    { cmd: 'createLink', icon: 'fa-solid fa-link', title: 'Insert link' },
    { cmd: 'unlink', icon: 'fa-solid fa-link-slash', title: 'Remove link' },
    { cmd: 'insertImage', icon: 'fa-solid fa-image', title: 'Insert image' },
  ],
  [
    { cmd: 'superscript', icon: 'fa-solid fa-superscript', title: 'Superscript' },
    { cmd: 'subscript', icon: 'fa-solid fa-subscript', title: 'Subscript' },
    { cmd: 'indent', icon: 'fa-solid fa-indent', title: 'Indent' },
    { cmd: 'outdent', icon: 'fa-solid fa-outdent', title: 'Outdent' },
  ],
  [
    { cmd: 'removeFormat', icon: 'fa-solid fa-eraser', title: 'Clear all formatting' },
  ],
];
// Commands that have a toggle state
const STATEFUL_CMDS = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'superscript', 'subscript'];
export default function RichEditor({ value, onChange, placeholder = 'Start writing...', minHeight = '300px' }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  // Only set innerHTML on mount or when value changes externally
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      // Only update if the content actually differs (prevents cursor reset)
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
  }, [value]);
  const updateActiveStates = useCallback(() => {
    const states: Record<string, boolean> = {};
    for (const cmd of STATEFUL_CMDS) {
      try { states[cmd] = document.queryCommandState(cmd); } catch { states[cmd] = false; }
    }
    // Check current block format
    try {
      const block = document.queryCommandValue('formatBlock');
      states['h2'] = block === 'h2';
      states['h3'] = block === 'h3';
      states['blockquote'] = block === 'blockquote';
    } catch {}
    setActiveStates(states);
  }, []);
  const emitChange = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
    updateActiveStates();
  }, [onChange, updateActiveStates]);
  const exec = useCallback((command: string, val?: string) => {
    // Focus the editor first to ensure commands work
    editorRef.current?.focus();
    if (command === 'createLink') {
      const url = prompt('Enter URL:', 'https://');
      if (url && url !== 'https://') document.execCommand('createLink', false, url);
    } else if (command === 'insertImage') {
      const url = prompt('Enter image URL:');
      if (url) document.execCommand('insertHTML', false, `<img src="${url}" alt="Image" style="max-width:100%;margin:0.5em 0;border-radius:4px;" />`);
    } else if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, val || 'p');
    } else {
      document.execCommand(command, false, val);
    }
    emitChange();
  }, [emitChange]);
  const isActive = (cmd: string, val?: string) => {
    if (val === 'h2') return activeStates['h2'];
    if (val === 'h3') return activeStates['h3'];
    if (val === 'blockquote') return activeStates['blockquote'];
    return activeStates[cmd] || false;
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Tab for indent/outdent
    if (e.key === 'Tab') {
      e.preventDefault();
      exec(e.shiftKey ? 'outdent' : 'indent');
    }
  };
  // Toolbar button style
  const btnBase: React.CSSProperties = {
    background: 'none', border: '1px solid transparent', padding: '6px 8px',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.8125rem',
    transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', minWidth: '30px', height: '30px',
    fontWeight: 600, fontFamily: 'var(--font-body)',
  };
  const btnInactive: React.CSSProperties = { ...btnBase, color: 'var(--text-muted)' };
  const btnActiveStyle: React.CSSProperties = {
    ...btnBase,
    background: 'var(--color-primary)',
    color: '#fff',
    borderColor: 'var(--color-primary)',
    borderRadius: '4px',
  };
  const sepStyle: React.CSSProperties = {
    width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px', flexShrink: 0,
  };
  return (
    <div>
      <div className="editor-toolbar" style={{ gap: '2px', alignItems: 'center' }}>
        {TOOLBAR.map((group, gi) => (
          <div key={gi} style={{ display: 'contents' }}>
            {gi > 0 && <span style={sepStyle} />}
            {group.map((btn) => (
              <button
                key={btn.cmd + (btn.val || '')}
                type="button"
                onClick={() => exec(btn.cmd, btn.val)}
                style={isActive(btn.cmd, btn.val) ? btnActiveStyle : btnInactive}
                title={btn.title}
                onMouseEnter={e => {
                  if (!isActive(btn.cmd, btn.val)) {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(btn.cmd, btn.val)) {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                {btn.icon ? <i className={btn.icon} style={{ fontSize: '0.75rem' }}></i> : btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div
        ref={editorRef}
        className="rich-editor"
        contentEditable
        style={{ minHeight, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onInput={emitChange}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
