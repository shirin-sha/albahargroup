'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  en: any;
  ar: any;
}

const PARTNERSHIPS_PAGE_SECTIONS = ['metadata', 'banner', 'partnerships'] as const;
const SECTION_META: Record<string, { label: string; desc: string; icon: string }> = {
  metadata: { label: 'Metadata', desc: 'Partnerships page SEO title and description', icon: '🔎' },
  banner: { label: 'Banner', desc: 'Partnerships page banner title', icon: '🖼️' },
  partnerships: { label: 'Partnerships', desc: 'Partnership section content and logos', icon: '🤝' },
};

interface BilingualFieldProps {
  label: string;
  path: string;
  type?: 'text' | 'textarea';
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

const getTitle = (section: SectionData | undefined, lang: 'en' | 'ar'): string => {
  const data = section?.[lang];
  if (!data) return '—';
  if (section?.sectionId === 'metadata') return data.metaTitle || '—';
  return data.heading || data.title || data.subheading || '—';
};

const PartnershipsPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/partnerships');
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
      const res = await fetch('/api/cms/partnerships', {
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

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Partnerships Page CMS</h1>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {PARTNERSHIPS_PAGE_SECTIONS.map((sectionId) => {
              const section = sections.find((s) => s.sectionId === sectionId);
              const meta = SECTION_META[sectionId] ?? { label: sectionId, desc: '', icon: '📋' };
              const titleEn = getTitle(section, 'en');
              const titleAr = getTitle(section, 'ar');
              const metaTitleEn = sectionId === 'metadata' ? (section?.en?.metaTitle || '—') : '—';
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

const SectionEditor = ({
  sectionId,
  section,
  onSave,
  onClose,
}: SectionEditorProps) => {
  const [formDataEn, setFormDataEn] = useState<any>({});
  const [formDataAr, setFormDataAr] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (section) {
      const sectionDataEn = section.en || {};
      const sectionDataAr = section.ar || {};
      if (sectionId === 'partnerships') {
        setFormDataEn({
          ...sectionDataEn,
          imageList: Array.isArray(sectionDataEn.imageList) ? sectionDataEn.imageList : []
        });
        setFormDataAr({
          ...sectionDataAr,
          imageList: Array.isArray(sectionDataAr.imageList) ? sectionDataAr.imageList : []
        });
      } else {
        setFormDataEn(sectionDataEn);
        setFormDataAr(sectionDataAr);
      }
    } else {
      if (sectionId === 'partnerships') {
        setFormDataEn({ imageList: [] });
        setFormDataAr({ imageList: [] });
      } else {
        setFormDataEn({});
        setFormDataAr({});
      }
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

  const renderBilingualField = useCallback((label: string, path: string, type: 'text' | 'textarea' = 'text', rows: number = 1, placeholder: string = '') => {
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
    switch (sectionId) {
      case 'metadata':
        return (
          <>
            {renderBilingualField('Metadata Title', 'metaTitle')}
            {renderBilingualField('Metadata Description', 'metaDescription', 'textarea', 4)}
          </>
        );
      case 'banner':
        return (
          <>
            {renderBilingualField("Title", "title")}
          </>
        );
      case 'partnerships':
        const imageListEn = formDataEn.imageList || [];
        const imageListAr = formDataAr.imageList || [];
        const maxItems = Math.max(imageListEn.length, imageListAr.length);
        
        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
            {renderBilingualField("Text", "text", "textarea", 4)}
            <div className="form-group">
              <label>Partner Logos (shared)</label>
              <div className="hero-slides-container">
                {Array.from({ length: maxItems }).map((_, index) => {
                  const partnerEn = imageListEn[index] || { src: '', width: 200, height: 120, alt: '', loading: 'lazy' };
                  const partnerAr = imageListAr[index] || { src: '', width: 200, height: 120, alt: '', loading: 'lazy' };
                  
                  return (
                    <div key={index} className="hero-slide-card">
                      <div className="hero-slide-header">
                        <h4>Partner {index + 1}</h4>
                        {maxItems > 1 && (
                          <button
                            type="button"
                            className="hero-slide-remove"
                            onClick={() => {
                              setFormDataEn({ ...formDataEn, imageList: imageListEn.filter((_: any, i: number) => i !== index) });
                              setFormDataAr({ ...formDataAr, imageList: imageListAr.filter((_: any, i: number) => i !== index) });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="hero-slide-fields">
                        <ImageUpload
                          value={partnerEn.src || partnerAr.src || ''}
                          onChange={(url) => {
                            const newEn = [...imageListEn];
                            const newAr = [...imageListAr];
                            if (!newEn[index]) newEn[index] = { ...partnerEn };
                            if (!newAr[index]) newAr[index] = { ...partnerAr };
                            newEn[index].src = url;
                            newAr[index].src = url;
                            setFormDataEn({ ...formDataEn, imageList: newEn });
                            setFormDataAr({ ...formDataAr, imageList: newAr });
                          }}
                          placeholder="/img/brand/partner.png"
                          folder="brand"
                          label="Image (shared)"
                        />
                        <div className="form-group">
                          <label>Width (shared)</label>
                          <input
                            type="number"
                            value={partnerEn.width || partnerAr.width || 200}
                            onChange={(e) => {
                              const newEn = [...imageListEn];
                              const newAr = [...imageListAr];
                              if (!newEn[index]) newEn[index] = { ...partnerEn };
                              if (!newAr[index]) newAr[index] = { ...partnerAr };
                              newEn[index].width = parseInt(e.target.value) || 200;
                              newAr[index].width = parseInt(e.target.value) || 200;
                              setFormDataEn({ ...formDataEn, imageList: newEn });
                              setFormDataAr({ ...formDataAr, imageList: newAr });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Height (shared)</label>
                          <input
                            type="number"
                            value={partnerEn.height || partnerAr.height || 120}
                            onChange={(e) => {
                              const newEn = [...imageListEn];
                              const newAr = [...imageListAr];
                              if (!newEn[index]) newEn[index] = { ...partnerEn };
                              if (!newAr[index]) newAr[index] = { ...partnerAr };
                              newEn[index].height = parseInt(e.target.value) || 120;
                              newAr[index].height = parseInt(e.target.value) || 120;
                              setFormDataEn({ ...formDataEn, imageList: newEn });
                              setFormDataAr({ ...formDataAr, imageList: newAr });
                            }}
                          />
                        </div>
                        {renderBilingualField("Alt Text", `imageList.${index}.alt`)}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newPartner = {
                      src: '',
                      width: 200,
                      height: 120,
                      alt: '',
                      loading: 'lazy'
                    };
                    setFormDataEn({
                      ...formDataEn,
                      imageList: [...imageListEn, newPartner]
                    });
                    setFormDataAr({
                      ...formDataAr,
                      imageList: [...imageListAr, newPartner]
                    });
                  }}
                >
                  + Add More Partner
                </button>
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            {renderBilingualField("Title", "title")}
          </>
        );
    }
  };

  return (
    <>
      <div className="admin-edit-panel-header">
        <div className="admin-edit-panel-title">
          <strong>{`Editing ${sectionId}`}</strong>
          <span>{SECTION_META[sectionId]?.desc ?? ''}</span>
        </div>
        <button type="button" className="admin-btn admin-btn-edit" onClick={onClose}>✕ Close</button>
      </div>
      <form onSubmit={handleSubmit} className="admin-cms-form">
        {renderFields()}
        <div className="form-actions">
          <button type="submit" className="button button-primary admin-cms-btn-save" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="admin-btn admin-btn-edit" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </>
  );
};

export default PartnershipsPageCMS;
