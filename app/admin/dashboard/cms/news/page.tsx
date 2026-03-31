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

const NEWS_PAGE_SECTIONS = ['metadata', 'banner'] as const;

const SECTION_META: Record<string, { label: string; desc: string; icon: string }> = {
  metadata: { label: 'Metadata', desc: 'News page SEO title and description', icon: '🔎' },
  banner: { label: 'Banner', desc: 'News page banner title', icon: '🖼️' },
};

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

const BilingualField = memo(
  ({
    label,
    path,
    type = 'text',
    rows = 1,
    placeholder = '',
    enValue,
    arValue,
    onUpdate,
  }: BilingualFieldProps) => {
    if (type === 'richtext') {
      return (
        <div className="form-group-bilingual">
          <label>{label}</label>
          <div className="bilingual-inputs">
            <div className="bilingual-input-group">
              <span className="bilingual-label">English</span>
              <RichTextEditor value={enValue || ''} onChange={(value) => onUpdate('en', path, value)} />
            </div>
            <div className="bilingual-input-group" dir="rtl">
              <span className="bilingual-label">العربية</span>
              <div dir="rtl">
                <RichTextEditor value={arValue || ''} onChange={(value) => onUpdate('ar', path, value)} />
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
  },
);

BilingualField.displayName = 'BilingualField';

const getTitle = (section: SectionData | undefined, lang: 'en' | 'ar'): string => {
  const data = section?.[lang];
  if (!data) return '—';
  if (section?.sectionId === 'metadata') return data.metaTitle || '—';
  return data.title || '—';
};

const getPreviewImage = (section: SectionData | undefined): string | null => {
  const en = section?.en;
  if (!en) return null;
  // Most likely null for news in current seed, but keep safe fallbacks.
  return en.backgroundImage?.src || en.image?.src || en.backgroundImage || null;
};

const NewsPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/news');
      const result = await res.json();
      if (result.success) setSections(result.data);
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
        setEditingSectionId(null);
      }
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>News Page CMS</h1>
        <p className="cms-page-subtitle">Manage both English and Arabic content</p>
      </div>

      {editingSectionId && (
        <div className="admin-edit-panel">
          <SectionEditor
            key={editingSectionId}
            sectionId={editingSectionId}
            section={sections.find((s) => s.sectionId === editingSectionId)}
            onSave={saveSection}
            onClose={() => setEditingSectionId(null)}
          />
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Title (EN)</th>
              <th>Title (AR)</th>
              <th>Metadata (EN)</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {NEWS_PAGE_SECTIONS.map((sectionId) => {
              const section = sections.find((s) => s.sectionId === sectionId);
              const meta = SECTION_META[sectionId] ?? { label: sectionId, desc: '', icon: '📋' };
              const previewImage = getPreviewImage(section);
              const titleEn = getTitle(section, 'en');
              const titleAr = getTitle(section, 'ar');
              const metaTitleEn = sectionId === 'metadata' ? section?.en?.metaTitle || '—' : '—';
              const isEditing = editingSectionId === sectionId;

              return (
                <tr key={sectionId} className={isEditing ? 'admin-table-row-active' : ''}>
                  <td>
                    <div className="admin-section-name">
                      <strong>{meta.label}</strong>
                      <span className="admin-section-id">{sectionId}</span>
                    </div>
                  </td>
                  <td>{titleEn}</td>
                  <td className="admin-td-ar">{titleAr}</td>
                  <td>{metaTitleEn}</td>
                  <td>
                    <div className="admin-section-thumb">
                      {previewImage ? (
                        <img src={previewImage} alt={meta.label} />
                      ) : (
                        <span className="admin-section-thumb-placeholder">No Image</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        onClick={() => setEditingSectionId(isEditing ? null : sectionId)}
                      >
                        {isEditing ? 'Close' : 'Edit'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface SectionEditorProps {
  sectionId: string;
  section?: SectionData;
  onSave: (sectionId: string, data: Partial<SectionData>) => void;
  onClose: () => void;
}

const SectionEditor = ({ sectionId, section, onSave, onClose }: SectionEditorProps) => {
  const [formDataEn, setFormDataEn] = useState<any>({});
  const [formDataAr, setFormDataAr] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (section) {
      setFormDataEn(section.en || {});
      setFormDataAr(section.ar || {});
    } else {
      setFormDataEn({});
      setFormDataAr({});
    }
  }, [section?.sectionId, sectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updateData: Partial<SectionData> = {
      enabled: section?.enabled ?? true,
      order: section?.order ?? 0,
      en: formDataEn,
      ar: formDataAr,
    };
    try {
      await Promise.resolve(onSave(sectionId, updateData));
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = useCallback((lang: 'en' | 'ar', path: string, value: any) => {
    const setData = lang === 'en' ? setFormDataEn : setFormDataAr;
    setData((prevData: any) => {
      const newData = JSON.parse(JSON.stringify(prevData || {}));
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
        if (value !== null && value !== undefined) value = value[key];
        else return undefined;
      }
    } catch {
      return undefined;
    }
    return value;
  }, []);

  const renderBilingualField = useCallback(
    (
      label: string,
      path: string,
      type: 'text' | 'textarea' | 'richtext' = 'text',
      rows: number = 1,
      placeholder: string = '',
    ) => {
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
    },
    [formDataEn, formDataAr, updateField, getNestedValue],
  );

  const renderFields = () => {
    if (sectionId === 'metadata') {
      return (
        <>
          {renderBilingualField('Metadata Title', 'metaTitle', 'text', 1, 'e.g. News & Updates')}
          {renderBilingualField('Metadata Description', 'metaDescription', 'textarea', 4, 'Short SEO description')}
        </>
      );
    }

    return (
      <>
        {renderBilingualField('Title', 'title')}
      </>
    );
  };

  return (
    <>
      <div className="admin-edit-panel-header">
        <div className="admin-edit-panel-title">
          <strong>{`Editing ${sectionId}`}</strong>
          <span>{SECTION_META[sectionId]?.desc ?? ''}</span>
        </div>
        <button type="button" className="admin-btn admin-btn-edit" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-cms-form">
        {renderFields()}
        <div className="form-actions">
          <button type="submit" className="button button-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="admin-btn admin-btn-edit" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default NewsPageCMS;
