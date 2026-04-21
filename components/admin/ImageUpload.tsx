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
    <div className="form-group image-upload-field">
      <label>{label} {required && '*'}</label>
      <div className="image-upload-stack">
        <div className="image-upload-row">
          <label
            className="image-upload-button"
            aria-disabled={uploading}
            title={uploading ? 'Uploading...' : 'Choose an image'}
            style={{ opacity: uploading ? 0.7 : 1 }}
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
            className={`image-upload-filename ${fileName ? 'has-file' : ''}`}
            title={fileName || (value ? value : placeholder)}
          >
            {fileName || (value ? 'Image selected' : 'No file chosen')}
          </span>
        </div>

        {(preview || value) && (
          <div className="image-upload-preview-wrap">
            <img
              src={preview || value}
              alt="Preview"
              className="image-upload-preview"
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
              className="image-upload-remove"
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
