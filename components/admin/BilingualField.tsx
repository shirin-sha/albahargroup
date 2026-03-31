'use client';

import { memo } from 'react';
import RichTextEditor from './RichTextEditor';

interface BilingualFieldProps {
  label: string;
  enValue: string;
  arValue: string;
  onEnChange: (value: string) => void;
  onArChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'richtext';
  rows?: number;
  placeholder?: string;
  required?: boolean;
}

const BilingualField = memo(({ 
  label, 
  type = 'text', 
  rows = 3,
  placeholder = '',
  enValue,
  arValue,
  onEnChange,
  onArChange,
  required = false
}: BilingualFieldProps) => {
  if (type === 'richtext') {
    return (
      <div className="form-group-bilingual">
        <label>{label} {required && '*'}</label>
        <div className="bilingual-inputs">
          <div className="bilingual-input-group">
            <span className="bilingual-label">English</span>
            <RichTextEditor
              value={enValue || ''}
              onChange={onEnChange}
              placeholder={placeholder}
              dir="ltr"
            />
          </div>
          <div className="bilingual-input-group" dir="rtl">
            <span className="bilingual-label">العربية</span>
            <div dir="rtl">
              <RichTextEditor
                value={arValue || ''}
                onChange={onArChange}
                placeholder={placeholder}
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="form-group-bilingual">
        <label>{label} {required && '*'}</label>
        <div className="bilingual-inputs">
          <div className="bilingual-input-group">
            <span className="bilingual-label">English</span>
            <textarea
              value={enValue || ''}
              onChange={(e) => onEnChange(e.target.value)}
              rows={rows}
              placeholder={placeholder}
              required={required}
            />
          </div>
          <div className="bilingual-input-group">
            <span className="bilingual-label">العربية</span>
            <textarea
              value={arValue || ''}
              onChange={(e) => onArChange(e.target.value)}
              rows={rows}
              placeholder={placeholder}
              dir="rtl"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-group-bilingual">
      <label>{label} {required && '*'}</label>
      <div className="bilingual-inputs">
        <div className="bilingual-input-group">
          <span className="bilingual-label">English</span>
          <input
            type="text"
            value={enValue || ''}
            onChange={(e) => onEnChange(e.target.value)}
            placeholder={placeholder}
            required={required}
          />
        </div>
        <div className="bilingual-input-group">
          <span className="bilingual-label">العربية</span>
          <input
            type="text"
            value={arValue || ''}
            onChange={(e) => onArChange(e.target.value)}
            placeholder={placeholder}
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );
});

BilingualField.displayName = 'BilingualField';

export default BilingualField;
