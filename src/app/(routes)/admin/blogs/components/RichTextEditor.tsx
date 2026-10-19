"use client";
import React, { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: string;
}

// Silsilla admin palette (Tailwind stone) for the editor frame
const BORDER = '#d6d3d1'; // stone-300
const FOCUS = '#1c1917'; // stone-900
const FOCUS_RING = 'rgba(28, 25, 23, 0.1)';
const ERROR = '#fca5a5'; // red-300

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog content here...",
  error
}: RichTextEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const errorRef = useRef(error);

  // Keep the frame colour in sync with the validation state
  useEffect(() => {
    errorRef.current = error;
    const container = editorRef.current?.getContainer?.();
    if (container && !editorRef.current.hasFocus?.()) {
      container.style.borderColor = error ? ERROR : BORDER;
    }
  }, [error]);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="w-full">
      <Editor
        apiKey="8dy6r8nx2dm5i2x8zk168e6hal2a7rup10d1ygzmiphqci1v"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: 420,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: #1c1917;
            }
            p { margin: 0 0 16px 0; }
            h1, h2, h3, h4, h5, h6 { margin: 24px 0 16px 0; font-weight: 600; }
            ul, ol { margin: 0 0 16px 0; padding-left: 24px; }
            a { color: #1c1917; text-decoration: underline; }
            img { max-width: 100%; height: auto; }
            blockquote {
              margin: 16px 0;
              padding: 16px;
              border-left: 4px solid #e7e5e4;
              background: #fafaf9;
              font-style: italic;
            }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
          resize: true,
          statusbar: true,
          elementpath: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setup: (editor: any) => {
            editor.on('init', () => {
              const container = editor.getContainer();
              if (container) {
                container.style.border = `1px solid ${errorRef.current ? ERROR : BORDER}`;
                container.style.borderRadius = '8px';
                container.style.overflow = 'hidden';
                container.style.transition = 'border-color 150ms, box-shadow 150ms';
              }
            });

            editor.on('focus', () => {
              const container = editor.getContainer();
              if (container) {
                container.style.borderColor = FOCUS;
                container.style.boxShadow = `0 0 0 3px ${FOCUS_RING}`;
              }
            });

            editor.on('blur', () => {
              const container = editor.getContainer();
              if (container) {
                container.style.borderColor = errorRef.current ? ERROR : BORDER;
                container.style.boxShadow = 'none';
              }
            });
          }
        }}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
