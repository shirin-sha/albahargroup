'use client';

import { useMemo, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto';
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = '',
  label,
  required = false,
  dir,
}: RichTextEditorProps) => {
  const lastValueRef = useRef<string>(value || '');
  const isUpdatingRef = useRef(false);
  const isMountedRef = useRef(false);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'color', 'background',
    'link'
  ], []);

  // Mark as mounted after first render
  useEffect(() => {
    isMountedRef.current = true;
    lastValueRef.current = value || '';
  }, []);

  // Update ref when value prop changes externally (not from our onChange)
  useEffect(() => {
    if (isMountedRef.current && !isUpdatingRef.current) {
      lastValueRef.current = value || '';
    }
    isUpdatingRef.current = false;
  }, [value]);

  const handleChange = useCallback((content: string) => {
    // Only process changes after component is mounted
    if (!isMountedRef.current) return;
    
    // Only call onChange if the value actually changed
    const normalizedContent = content || '';
    const normalizedLastValue = lastValueRef.current || '';
    
    if (normalizedContent !== normalizedLastValue) {
      isUpdatingRef.current = true;
      lastValueRef.current = normalizedContent;
      onChange(normalizedContent);
    }
  }, [onChange]);

  const editorContent = (
    <div className="rich-text-editor-wrapper" dir={dir}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );

  // If label is provided, wrap in form-group; otherwise return just the editor
  if (label) {
    return (
      <div className="form-group">
        <label>
          {label} {required && '*'}
        </label>
        {editorContent}
      </div>
    );
  }

  return editorContent;
};

export default RichTextEditor;
