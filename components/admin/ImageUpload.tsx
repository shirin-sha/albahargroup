'use client';

import { useEffect, useRef, useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  folder?: string;
  required?: boolean;
  label?: string;
}

const ImageUpload = ({ 
  value, 
  onChange, 
  placeholder = "/img/upload/image.jpg",
  folder = "uploads",
  required = false,
  label = "Image"
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If an existing value is loaded from DB, show it without a filename.
    if (!value) setFileName('');
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setFileName(file.name);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        onChange(result.path);
        setPreview(null); // Clear preview after successful upload
      } else {
        alert(result.error || 'Failed to upload image');
        setPreview(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="form-group">
      <label>{label} {required && '*'}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 14px',
              border: '1px solid #111',
              borderRadius: '6px',
              background: '#fff',
              color: '#111',
              fontWeight: 600,
              cursor: uploading ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              opacity: uploading ? 0.7 : 1,
            }}
            aria-disabled={uploading}
            title={uploading ? 'Uploading...' : 'Choose an image'}
          >
            {uploading ? 'Uploading...' : 'Choose file'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>

          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: '12px',
              color: fileName ? '#111827' : '#6b7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={fileName || (value ? value : placeholder)}
          >
            {fileName || (value ? 'Image selected' : 'No file chosen')}
          </span>
        </div>

        {(preview || value) && (
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <img
              src={preview || value}
              alt="Preview"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'contain',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                padding: '4px',
                background: '#fff',
              }}
            />
            <button
              type="button"
              aria-label={`Remove ${label}`}
              title="Remove"
              onClick={() => {
                onChange('');
                setPreview(null);
                setFileName('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '999px',
                border: '1px solid #d1d5db',
                background: '#fff',
                color: '#111827',
                cursor: 'pointer',
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
