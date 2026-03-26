'use client';

import { useState, useEffect, useCallback, memo } from 'react';

interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  en: any;
  ar: any;
}

const CONTACT_PAGE_SECTIONS = ['banner', 'contactForm', 'map'] as const;

// BilingualField component
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

const ContactPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/contact');
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
      const res = await fetch('/api/cms/contact', {
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
        <h1>Contact Us Page CMS</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Edit both English and Arabic content together</p>
      </div>

      <div className="admin-cms-sections">
        {CONTACT_PAGE_SECTIONS.map((sectionId) => {
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    if (section) {
      const sectionDataEn = section.en || {};
      const sectionDataAr = section.ar || {};
      if (sectionId === 'contactForm') {
        setFormDataEn({
          ...sectionDataEn,
          promotions: Array.isArray(sectionDataEn.promotions) ? sectionDataEn.promotions : []
        });
        setFormDataAr({
          ...sectionDataAr,
          promotions: Array.isArray(sectionDataAr.promotions) ? sectionDataAr.promotions : []
        });
      } else {
        setFormDataEn(sectionDataEn);
        setFormDataAr(sectionDataAr);
      }
    } else {
      if (sectionId === 'contactForm') {
        setFormDataEn({ promotions: [] });
        setFormDataAr({ promotions: [] });
      } else {
        setFormDataEn({});
        setFormDataAr({});
      }
    }
  }, [section?.sectionId, sectionId, isOpen]);

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
      case 'banner':
        return (
          <>
            {renderBilingualField("Title", "title")}
          </>
        );
      case 'contactForm':
        const promotionsEn = formDataEn.promotions || [];
        const promotionsAr = formDataAr.promotions || [];
        const maxPromos = Math.max(promotionsEn.length, promotionsAr.length);
        
        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
            {renderBilingualField("Text", "text", "textarea", 4)}
            <div className="form-group">
              <label>Promotions (Contact Info Items)</label>
              <div className="hero-slides-container">
                {Array.from({ length: maxPromos }).map((_, index) => {
                  const promoEn = promotionsEn[index] || { title: '', text: '' };
                  const promoAr = promotionsAr[index] || { title: '', text: '' };
                  
                  return (
                    <div key={index} className="hero-slide-card">
                      <div className="hero-slide-header">
                        <h4>Item {index + 1}</h4>
                        {maxPromos > 1 && (
                          <button
                            type="button"
                            className="hero-slide-remove"
                            onClick={() => {
                              setFormDataEn({ ...formDataEn, promotions: promotionsEn.filter((_: any, i: number) => i !== index) });
                              setFormDataAr({ ...formDataAr, promotions: promotionsAr.filter((_: any, i: number) => i !== index) });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="hero-slide-fields">
                        {renderBilingualField("Title", `promotions.${index}.title`)}
                        {renderBilingualField("Text", `promotions.${index}.text`, "textarea", 3, "You can use <br /> for line breaks")}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newPromo = { title: '', text: '' };
                    setFormDataEn({
                      ...formDataEn,
                      promotions: [...promotionsEn, newPromo]
                    });
                    setFormDataAr({
                      ...formDataAr,
                      promotions: [...promotionsAr, newPromo]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
            {renderBilingualField("Form Block Heading", "block.heading")}
            {renderBilingualField("Form Block Text", "block.text", "textarea", 3)}
          </>
        );
      case 'map':
        return (
          <>
            <div className="form-group">
              <label>Map Embed URL/Code (shared)</label>
              <textarea
                value={formDataEn.mapEmbed || formDataAr.mapEmbed || ''}
                onChange={(e) => {
                  updateField('en', 'mapEmbed', e.target.value);
                  updateField('ar', 'mapEmbed', e.target.value);
                }}
                rows={4}
                placeholder="Google Maps embed code or URL"
              />
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
    <div className="admin-cms-section-card">
      <div className="admin-cms-section-header" onClick={onToggle}>
        <h3>{sectionId}</h3>
        <span className="admin-cms-toggle">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <form onSubmit={handleSubmit} className="admin-cms-form">
          {renderFields()}
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactPageCMS;
