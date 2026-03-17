'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  en: any;
  ar: any;
}

const NEWS_PAGE_SECTIONS = ['banner'] as const;

// BilingualField component
interface BilingualFieldProps {
  label: string;
  path: string;
  type?: 'text' | 'textarea' | 'richtext';
  rows?: number;
  placeholder?: string;
  enValue: any;
  arValue: any;
  onUpdate: (lang: 'en' | 'ar', path: string, value: any) => void;
}

const BilingualField = memo(({ 
  label, 
  path, 
  type = 'text', 
  rows = 1,
  placeholder = '',
  enValue,
  arValue,
  onUpdate
}: BilingualFieldProps) => {
  if (type === 'richtext') {
    return (
      <div className="form-group-bilingual">
        <label>{label}</label>
        <div className="bilingual-inputs">
          <div className="bilingual-input-group">
            <span className="bilingual-label">English</span>
            <RichTextEditor
              value={enValue || ''}
              onChange={(value) => onUpdate('en', path, value)}
            />
          </div>
          <div className="bilingual-input-group" dir="rtl">
            <span className="bilingual-label">العربية</span>
            <div dir="rtl">
              <RichTextEditor
                value={arValue || ''}
                onChange={(value) => onUpdate('ar', path, value)}
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
        <label>{label}</label>
        <div className="bilingual-inputs">
          <div className="bilingual-input-group">
            <span className="bilingual-label">English</span>
            <textarea
              value={enValue || ''}
              onChange={(e) => onUpdate('en', path, e.target.value)}
              rows={rows}
              placeholder={placeholder}
            />
          </div>
          <div className="bilingual-input-group">
            <span className="bilingual-label">العربية</span>
            <textarea
              value={arValue || ''}
              onChange={(e) => onUpdate('ar', path, e.target.value)}
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
      <label>{label}</label>
      <div className="bilingual-inputs">
        <div className="bilingual-input-group">
          <span className="bilingual-label">English</span>
          <input
            type="text"
            value={enValue || ''}
            onChange={(e) => onUpdate('en', path, e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div className="bilingual-input-group">
          <span className="bilingual-label">العربية</span>
          <input
            type="text"
            value={arValue || ''}
            onChange={(e) => onUpdate('ar', path, e.target.value)}
            placeholder={placeholder}
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );
});

BilingualField.displayName = 'BilingualField';

const NewsPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/news');
      const result = await res.json();
      if (result.success) {
        setSections(result.data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (sectionId: string, data: Partial<SectionData>) => {
    try {
      const res = await fetch('/api/cms/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, ...data }),
      });
      const result = await res.json();
      if (result.success) {
        await fetchSections();
        setSelectedSection(null);
      }
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>News Page CMS</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Edit both English and Arabic content together</p>
      </div>

      <div className="admin-cms-sections">
        {NEWS_PAGE_SECTIONS.map((sectionId) => {
          const section = sections.find((s) => s.sectionId === sectionId);
          return (
            <SectionEditor
              key={sectionId}
              sectionId={sectionId}
              section={section}
              onSave={saveSection}
              isOpen={selectedSection === sectionId}
              onToggle={() =>
                setSelectedSection(selectedSection === sectionId ? null : sectionId)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

interface SectionEditorProps {
  sectionId: string;
  section?: SectionData;
  onSave: (sectionId: string, data: Partial<SectionData>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionEditor = ({
  sectionId,
  section,
  onSave,
  isOpen,
  onToggle,
}: SectionEditorProps) => {
  const [formDataEn, setFormDataEn] = useState<any>({});
  const [formDataAr, setFormDataAr] = useState<any>({});

  useEffect(() => {
    if (!isOpen) return;
    
    if (section) {
      setFormDataEn(section.en || {});
      setFormDataAr(section.ar || {});
    } else {
      setFormDataEn({});
      setFormDataAr({});
    }
  }, [section?.sectionId, sectionId, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: Partial<SectionData> = {
      enabled: section?.enabled ?? true,
      order: section?.order ?? 0,
      en: formDataEn,
      ar: formDataAr,
    };
    onSave(sectionId, updateData);
  };

  const updateField = useCallback((lang: 'en' | 'ar', path: string, value: any) => {
    const setData = lang === 'en' ? setFormDataEn : setFormDataAr;
    
    setData((prevData: any) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const getNestedValue = useCallback((data: any, path: string) => {
    const keys = path.split('.');
    let value: any = data || {};
    
    try {
      for (const key of keys) {
        if (value !== null && value !== undefined) {
          value = value[key];
        } else {
          return undefined;
        }
      }
    } catch {
      return undefined;
    }
    
    return value;
  }, []);

  const renderBilingualField = useCallback((label: string, path: string, type: 'text' | 'textarea' | 'richtext' = 'text', rows: number = 1, placeholder: string = '') => {
    const enValue = getNestedValue(formDataEn, path);
    const arValue = getNestedValue(formDataAr, path);
    
    return (
      <BilingualField
        label={label}
        path={path}
        type={type}
        rows={rows}
        placeholder={placeholder}
        enValue={enValue}
        arValue={arValue}
        onUpdate={updateField}
      />
    );
  }, [formDataEn, formDataAr, updateField, getNestedValue]);

  const renderFields = () => {
    return (
      <>
        {renderBilingualField("Title", "title")}
      </>
    );
  };

  return (
    <div className="admin-cms-section-card">
      <div className="admin-cms-section-header" onClick={onToggle}>
        <h3>{sectionId}</h3>
        <span className="admin-cms-toggle">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <form onSubmit={handleSubmit} className="admin-cms-form">
          {renderFields()}
          <div className="form-actions">
            <button type="submit" className="button button-primary">
              Save (Both Languages)
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewsPageCMS;
