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

const ABOUT_PAGE_SECTIONS = [
  'testimonials',
  'stickyBanner',
  'heritage',
  'collaboration',
  'timeline',
  'team',
  'faq',
] as const;

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

const AboutPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/about');
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
      const res = await fetch('/api/cms/about', {
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
        <h1>About Page CMS</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Edit both English and Arabic content together</p>
      </div>

      <div className="admin-cms-sections">
        {ABOUT_PAGE_SECTIONS.map((sectionId) => {
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
      if (sectionId === 'timeline') {
        setFormDataEn({ timelineItems: [] });
        setFormDataAr({ timelineItems: [] });
      } else {
        setFormDataEn({});
        setFormDataAr({});
      }
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
    if (sectionId === 'timeline') {
      const timelineEn = formDataEn.timelineItems || [];
      const timelineAr = formDataAr.timelineItems || [];
      const maxItems = Math.max(timelineEn.length, timelineAr.length);
      
      return (
        <>
          {renderBilingualField("Subheading", "subheading")}
          {renderBilingualField("Heading", "heading")}
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ margin: 0 }}>Timeline Items</label>
              <button 
                type="button" 
                onClick={() => {
                  const newItem = { year: '', title: '', logos: [], position: 'below' };
                  setFormDataEn({ ...formDataEn, timelineItems: [...timelineEn, newItem] });
                  setFormDataAr({ ...formDataAr, timelineItems: [...timelineAr, newItem] });
                }} 
                className="button" 
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                + Add Item
              </button>
            </div>
            
            {Array.from({ length: maxItems }).map((_, itemIndex) => {
              const itemEn = timelineEn[itemIndex] || { year: '', title: '', logos: [], position: 'below' };
              const itemAr = timelineAr[itemIndex] || { year: '', title: '', logos: [], position: 'below' };
              
              return (
                <div key={itemIndex} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', marginBottom: '15px', background: '#f9fafb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong>Item {itemIndex + 1}</strong>
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormDataEn({ ...formDataEn, timelineItems: timelineEn.filter((_: any, i: number) => i !== itemIndex) });
                        setFormDataAr({ ...formDataAr, timelineItems: timelineAr.filter((_: any, i: number) => i !== itemIndex) });
                      }} 
                      className="button" 
                      style={{ fontSize: '12px', padding: '4px 8px', background: '#ef4444', color: 'white' }}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label>Year (shared)</label>
                    <input
                      type="text"
                      value={itemEn.year || itemAr.year || ''}
                      onChange={(e) => {
                        const newEn = [...timelineEn];
                        const newAr = [...timelineAr];
                        if (!newEn[itemIndex]) newEn[itemIndex] = { ...itemEn };
                        if (!newAr[itemIndex]) newAr[itemIndex] = { ...itemAr };
                        newEn[itemIndex].year = e.target.value;
                        newAr[itemIndex].year = e.target.value;
                        setFormDataEn({ ...formDataEn, timelineItems: newEn });
                        setFormDataAr({ ...formDataAr, timelineItems: newAr });
                      }}
                      placeholder="e.g., 1937"
                    />
                  </div>
                  
                  {renderBilingualField("Title", `timelineItems.${itemIndex}.title`)}
                  
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label>Position (shared)</label>
                    <select
                      value={itemEn.position || itemAr.position || 'below'}
                      onChange={(e) => {
                        const newEn = [...timelineEn];
                        const newAr = [...timelineAr];
                        if (!newEn[itemIndex]) newEn[itemIndex] = { ...itemEn };
                        if (!newAr[itemIndex]) newAr[itemIndex] = { ...itemAr };
                        newEn[itemIndex].position = e.target.value;
                        newAr[itemIndex].position = e.target.value;
                        setFormDataEn({ ...formDataEn, timelineItems: newEn });
                        setFormDataAr({ ...formDataAr, timelineItems: newAr });
                      }}
                    >
                      <option value="below">Below</option>
                      <option value="above">Above</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ margin: 0 }}>Logos (shared)</label>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newLogo = { src: '', alt: '', width: 100, height: 60 };
                          const newEn = [...timelineEn];
                          const newAr = [...timelineAr];
                          if (!newEn[itemIndex]) newEn[itemIndex] = { ...itemEn, logos: [] };
                          if (!newAr[itemIndex]) newAr[itemIndex] = { ...itemAr, logos: [] };
                          newEn[itemIndex].logos = [...(newEn[itemIndex].logos || []), newLogo];
                          newAr[itemIndex].logos = [...(newAr[itemIndex].logos || []), newLogo];
                          setFormDataEn({ ...formDataEn, timelineItems: newEn });
                          setFormDataAr({ ...formDataAr, timelineItems: newAr });
                        }} 
                        className="button" 
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        + Add Logo
                      </button>
                    </div>
                    
                    {(itemEn.logos || itemAr.logos || []).map((logo: any, logoIndex: number) => (
                      <div key={logoIndex} style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '10px', marginBottom: '10px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '600' }}>Logo {logoIndex + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              const newEn = [...timelineEn];
                              const newAr = [...timelineAr];
                              if (newEn[itemIndex]?.logos) {
                                newEn[itemIndex].logos = newEn[itemIndex].logos.filter((_: any, i: number) => i !== logoIndex);
                              }
                              if (newAr[itemIndex]?.logos) {
                                newAr[itemIndex].logos = newAr[itemIndex].logos.filter((_: any, i: number) => i !== logoIndex);
                              }
                              setFormDataEn({ ...formDataEn, timelineItems: newEn });
                              setFormDataAr({ ...formDataAr, timelineItems: newAr });
                            }} 
                            style={{ fontSize: '12px', padding: '2px 6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            ×
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div>
                            <ImageUpload
                              value={logo?.src || ''}
                              onChange={(url) => {
                                const newEn = [...timelineEn];
                                const newAr = [...timelineAr];
                                if (!newEn[itemIndex]) newEn[itemIndex] = { ...itemEn, logos: [] };
                                if (!newAr[itemIndex]) newAr[itemIndex] = { ...itemAr, logos: [] };
                                if (!newEn[itemIndex].logos[logoIndex]) newEn[itemIndex].logos[logoIndex] = { ...logo };
                                if (!newAr[itemIndex].logos[logoIndex]) newAr[itemIndex].logos[logoIndex] = { ...logo };
                                newEn[itemIndex].logos[logoIndex].src = url;
                                newAr[itemIndex].logos[logoIndex].src = url;
                                setFormDataEn({ ...formDataEn, timelineItems: newEn });
                                setFormDataAr({ ...formDataAr, timelineItems: newAr });
                              }}
                              placeholder="/img/brand/logo.png"
                              folder="brand"
                              label="Image"
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '12px' }}>Alt Text</label>
                            <input
                              type="text"
                              value={logo?.alt || ''}
                              onChange={(e) => {
                                const newEn = [...timelineEn];
                                const newAr = [...timelineAr];
                                if (!newEn[itemIndex]) newEn[itemIndex] = { ...itemEn, logos: [] };
                                if (!newAr[itemIndex]) newAr[itemIndex] = { ...itemAr, logos: [] };
                                if (!newEn[itemIndex].logos[logoIndex]) newEn[itemIndex].logos[logoIndex] = { ...logo };
                                if (!newAr[itemIndex].logos[logoIndex]) newAr[itemIndex].logos[logoIndex] = { ...logo };
                                newEn[itemIndex].logos[logoIndex].alt = e.target.value;
                                newAr[itemIndex].logos[logoIndex].alt = e.target.value;
                                setFormDataEn({ ...formDataEn, timelineItems: newEn });
                                setFormDataAr({ ...formDataAr, timelineItems: newAr });
                              }}
                              placeholder="Logo name"
                              style={{ fontSize: '12px', padding: '6px' }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '12px' }}>Width</label>
                            <input
                              type="number"
                              value={logo?.width || 100}
                              onChange={(e) => {
                                const newEn = [...timelineEn];
                                const newAr = [...timelineAr];
                                if (!newEn[itemIndex]) newEn[itemIndex] = { ...itemEn, logos: [] };
                                if (!newAr[itemIndex]) newAr[itemIndex] = { ...itemAr, logos: [] };
                                if (!newEn[itemIndex].logos[logoIndex]) newEn[itemIndex].logos[logoIndex] = { ...logo };
                                if (!newAr[itemIndex].logos[logoIndex]) newAr[itemIndex].logos[logoIndex] = { ...logo };
                                newEn[itemIndex].logos[logoIndex].width = parseInt(e.target.value) || 100;
                                newAr[itemIndex].logos[logoIndex].width = parseInt(e.target.value) || 100;
                                setFormDataEn({ ...formDataEn, timelineItems: newEn });
                                setFormDataAr({ ...formDataAr, timelineItems: newAr });
                              }}
                              style={{ fontSize: '12px', padding: '6px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '12px' }}>Height</label>
                            <input
                              type="number"
                              value={logo?.height || 60}
                              onChange={(e) => {
                                const newEn = [...timelineEn];
                                const newAr = [...timelineAr];
                                if (!newEn[itemIndex]) newEn[itemIndex] = { ...itemEn, logos: [] };
                                if (!newAr[itemIndex]) newAr[itemIndex] = { ...itemAr, logos: [] };
                                if (!newEn[itemIndex].logos[logoIndex]) newEn[itemIndex].logos[logoIndex] = { ...logo };
                                if (!newAr[itemIndex].logos[logoIndex]) newAr[itemIndex].logos[logoIndex] = { ...logo };
                                newEn[itemIndex].logos[logoIndex].height = parseInt(e.target.value) || 60;
                                newAr[itemIndex].logos[logoIndex].height = parseInt(e.target.value) || 60;
                                setFormDataEn({ ...formDataEn, timelineItems: newEn });
                                setFormDataAr({ ...formDataAr, timelineItems: newAr });
                              }}
                              style={{ fontSize: '12px', padding: '6px' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    return (
      <>
        {renderBilingualField("Subheading", "subheading")}
        {renderBilingualField("Heading", "heading")}
        {renderBilingualField("Text", "text", "textarea", 6)}
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

export default AboutPageCMS;
