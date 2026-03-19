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

const SECTION_META: Record<string, { label: string; desc: string; icon: string }> = {
  testimonials: { label: 'Testimonials',      desc: 'Client testimonial slider items',                  icon: '💬' },
  stickyBanner: { label: 'Sticky Banner',     desc: 'Full-width sticky scrolling banner',               icon: '📌' },
  heritage:     { label: 'Heritage',          desc: 'Company heritage and history section',             icon: '🏛️' },
  collaboration:{ label: 'Collaboration',     desc: 'Partnership and collaboration section',            icon: '🤝' },
  timeline:     { label: 'Timeline',          desc: 'Historical milestones with logos',                 icon: '📅' },
  team:         { label: 'Team',              desc: 'Leadership team section heading',                  icon: '👥' },
  faq:          { label: 'FAQ',               desc: 'Frequently asked questions accordion',             icon: '❓' },
};

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

const getPreviewImage = (section: SectionData | undefined, sectionId: string): string | null => {
  const en = section?.en;
  if (!en) return null;
  switch (sectionId) {
    case 'testimonials':  return en.items?.[0]?.image || null;
    case 'stickyBanner':  return en.blockList?.[0]?.image?.src || en.image || en.backgroundImage || null;
    case 'heritage':      return en.image?.src || en.image || null;
    case 'collaboration': return en.image?.src || en.image || null;
    case 'timeline':      return en.timelineItems?.[0]?.logos?.[0]?.src || null;
    default:              return null;
  }
};

const getTitle = (section: SectionData | undefined, lang: 'en' | 'ar'): string => {
  const data = section?.[lang];
  if (!data) return '—';
  return data.heading || data.title || data.subheading || '—';
};

const AboutPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/about');
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
      const res = await fetch('/api/cms/about', {
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
        <h1>About Page CMS</h1>
        <p className="cms-page-subtitle">Manage all About page sections</p>
      </div>

      {editingSectionId && (
        <div className="admin-edit-panel">
          <SectionEditor
            key={editingSectionId}
            sectionId={editingSectionId}
            section={sections.find(s => s.sectionId === editingSectionId)}
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
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ABOUT_PAGE_SECTIONS.map((sectionId) => {
              const section = sections.find(s => s.sectionId === sectionId);
              const meta = SECTION_META[sectionId] ?? { label: sectionId, desc: '', icon: '📋' };
              const previewImage = getPreviewImage(section, sectionId);
              const titleEn = getTitle(section, 'en');
              const titleAr = getTitle(section, 'ar');
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
                  <td>
                    <div className="admin-section-thumb">
                      {previewImage
                        ? <img src={previewImage} alt={meta.label} />
                        : <span className="admin-section-thumb-placeholder">No Image in this section</span>
                      }
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

const SectionEditor = ({
  sectionId,
  section,
  onSave,
  onClose,
}: SectionEditorProps) => {
  const [formDataEn, setFormDataEn] = useState<any>({});
  const [formDataAr, setFormDataAr] = useState<any>({});

  useEffect(() => {
    if (section) {
      if (sectionId === 'faq' || sectionId === 'testimonials') {
        setFormDataEn({
          ...section.en,
          items: Array.isArray(section.en?.items) ? section.en.items : []
        });
        setFormDataAr({
          ...section.ar,
          items: Array.isArray(section.ar?.items) ? section.ar.items : []
        });
      } else if (sectionId === 'timeline') {
        setFormDataEn({
          ...section.en,
          timelineItems: Array.isArray(section.en?.timelineItems) ? section.en.timelineItems : []
        });
        setFormDataAr({
          ...section.ar,
          timelineItems: Array.isArray(section.ar?.timelineItems) ? section.ar.timelineItems : []
        });
      } else {
        setFormDataEn(section.en || {});
        setFormDataAr(section.ar || {});
      }
    } else {
      if (sectionId === 'faq' || sectionId === 'testimonials') {
        setFormDataEn({ items: [] });
        setFormDataAr({ items: [] });
      } else if (sectionId === 'timeline') {
        setFormDataEn({ timelineItems: [] });
        setFormDataAr({ timelineItems: [] });
      } else {
        setFormDataEn({});
        setFormDataAr({});
      }
    }
  }, [section?.sectionId, sectionId]);

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
    if (sectionId === 'collaboration') {
      const textListEn = formDataEn.textList || [];
      const textListAr = formDataAr.textList || [];
      const maxTextItems = Math.max(textListEn.length, textListAr.length, 1);

      return (
        <>
          {renderBilingualField("Subheading", "subheading")}
          {renderBilingualField("Heading", "heading")}
          {renderBilingualField("Intro Text", "text", "textarea", 6)}
          {renderBilingualField("Feature Title", "block.heading")}
          {renderBilingualField("Feature Description", "block.text", "textarea", 5)}
          {renderBilingualField("Second Card Title", "block.subheading")}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ margin: 0 }}>Second Card Paragraphs</label>
              <button
                type="button"
                onClick={() => {
                  const newItem = { text: '' };
                  setFormDataEn({ ...formDataEn, textList: [...textListEn, newItem] });
                  setFormDataAr({ ...formDataAr, textList: [...textListAr, newItem] });
                }}
                className="cms-item-add-btn"
              >
                + Add Paragraph
              </button>
            </div>

            {Array.from({ length: maxTextItems }).map((_, index) => {
              const itemEn = textListEn[index] || { text: '' };
              const itemAr = textListAr[index] || { text: '' };

              return (
                <div key={index} className="cms-item-card">
                  <div className="cms-item-header">
                    <h4>Paragraph {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newItemsEn = textListEn.filter((_: any, i: number) => i !== index);
                        const newItemsAr = textListAr.filter((_: any, i: number) => i !== index);
                        setFormDataEn({ ...formDataEn, textList: newItemsEn });
                        setFormDataAr({ ...formDataAr, textList: newItemsAr });
                      }}
                      className="admin-btn admin-btn-delete"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="form-group-bilingual">
                    <label>Text</label>
                    <div className="bilingual-inputs">
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">English</span>
                        <textarea
                          value={itemEn.text || ''}
                          onChange={(e) => {
                            const newItemsEn = [...textListEn];
                            if (!newItemsEn[index]) newItemsEn[index] = { ...itemEn };
                            newItemsEn[index].text = e.target.value;
                            setFormDataEn({ ...formDataEn, textList: newItemsEn });
                          }}
                          rows={4}
                          placeholder="Paragraph in English"
                        />
                      </div>
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">العربية</span>
                        <textarea
                          value={itemAr.text || ''}
                          onChange={(e) => {
                            const newItemsAr = [...textListAr];
                            if (!newItemsAr[index]) newItemsAr[index] = { ...itemAr };
                            newItemsAr[index].text = e.target.value;
                            setFormDataAr({ ...formDataAr, textList: newItemsAr });
                          }}
                          rows={4}
                          placeholder="الفقرة بالعربية"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    if (sectionId === 'heritage') {
      return (
        <>
          {renderBilingualField("Subheading", "subheading")}
          {renderBilingualField("Heading", "heading")}
          {renderBilingualField("Intro Text", "text", "textarea", 6)}

          <ImageUpload
            value={formDataEn.image?.src || formDataAr.image?.src || ''}
            onChange={(url) => {
              setFormDataEn({
                ...formDataEn,
                image: { width: 600, height: 800, loading: 'lazy', alt: formDataEn.image?.alt || '', ...(formDataEn.image || {}), src: url }
              });
              setFormDataAr({
                ...formDataAr,
                image: { width: 600, height: 800, loading: 'lazy', alt: formDataAr.image?.alt || '', ...(formDataAr.image || {}), src: url }
              });
            }}
            placeholder="/img/image-text/img1.png"
            folder="image-text"
            label="Founder Image (shared)"
          />

          <div className="form-group">
            <label>Image Alt Text (shared)</label>
            <input
              type="text"
              value={formDataEn.image?.alt || formDataAr.image?.alt || ''}
              onChange={(e) => {
                const alt = e.target.value;
                setFormDataEn({ ...formDataEn, image: { width: 600, height: 800, loading: 'lazy', ...(formDataEn.image || {}), alt } });
                setFormDataAr({ ...formDataAr, image: { width: 600, height: 800, loading: 'lazy', ...(formDataAr.image || {}), alt } });
              }}
              placeholder="Mr. Mohamed Al-Bahar - Founder"
            />
          </div>

          {renderBilingualField("Founder Name / Block Heading", "block.heading")}
          {renderBilingualField("Founder Description / Block Text", "block.text", "textarea", 8)}
        </>
      );
    }

    if (sectionId === 'stickyBanner') {
      const blockListEn = formDataEn.blockList || [];
      const blockListAr = formDataAr.blockList || [];
      const maxBlocks = Math.max(blockListEn.length, blockListAr.length, 1);

      return (
        <>
          {renderBilingualField("Heading", "heading")}
          {renderBilingualField("Text", "text", "textarea", 4)}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ margin: 0 }}>Sticky Banner Cards</label>
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    subheading: '',
                    heading: '',
                    text: '',
                    image: { src: '', width: 1000, height: 707, loading: 'lazy', alt: '' }
                  };
                  setFormDataEn({ ...formDataEn, blockList: [...blockListEn, newItem] });
                  setFormDataAr({ ...formDataAr, blockList: [...blockListAr, newItem] });
                }}
                className="cms-item-add-btn"
              >
                + Add Card
              </button>
            </div>

            {Array.from({ length: maxBlocks }).map((_, index) => {
              const itemEn = blockListEn[index] || {
                subheading: '',
                heading: '',
                text: '',
                image: { src: '', width: 1000, height: 707, loading: 'lazy', alt: '' }
              };
              const itemAr = blockListAr[index] || {
                subheading: '',
                heading: '',
                text: '',
                image: { src: '', width: 1000, height: 707, loading: 'lazy', alt: '' }
              };

              return (
                <div key={index} className="cms-item-card">
                  <div className="cms-item-header">
                    <h4>Card {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newBlocksEn = blockListEn.filter((_: any, i: number) => i !== index);
                        const newBlocksAr = blockListAr.filter((_: any, i: number) => i !== index);
                        setFormDataEn({ ...formDataEn, blockList: newBlocksEn });
                        setFormDataAr({ ...formDataAr, blockList: newBlocksAr });
                      }}
                      className="admin-btn admin-btn-delete"
                    >
                      Remove
                    </button>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <ImageUpload
                      value={itemEn.image?.src || itemAr.image?.src || ''}
                      onChange={(url) => {
                        const newBlocksEn = [...blockListEn];
                        const newBlocksAr = [...blockListAr];
                        if (!newBlocksEn[index]) newBlocksEn[index] = { ...itemEn, image: { ...(itemEn.image || {}) } };
                        if (!newBlocksAr[index]) newBlocksAr[index] = { ...itemAr, image: { ...(itemAr.image || {}) } };
                        newBlocksEn[index].image = {
                          width: 1000,
                          height: 707,
                          loading: 'lazy',
                          alt: newBlocksEn[index].image?.alt || '',
                          ...newBlocksEn[index].image,
                          src: url,
                        };
                        newBlocksAr[index].image = {
                          width: 1000,
                          height: 707,
                          loading: 'lazy',
                          alt: newBlocksAr[index].image?.alt || '',
                          ...newBlocksAr[index].image,
                          src: url,
                        };
                        setFormDataEn({ ...formDataEn, blockList: newBlocksEn });
                        setFormDataAr({ ...formDataAr, blockList: newBlocksAr });
                      }}
                      placeholder="/img/project/1.jpg"
                      folder="project"
                      label="Card Image"
                    />
                  </div>

                  <div className="form-group">
                    <label>Image Alt Text (shared)</label>
                    <input
                      type="text"
                      value={itemEn.image?.alt || itemAr.image?.alt || ''}
                      onChange={(e) => {
                        const newBlocksEn = [...blockListEn];
                        const newBlocksAr = [...blockListAr];
                        if (!newBlocksEn[index]) newBlocksEn[index] = { ...itemEn, image: { ...(itemEn.image || {}) } };
                        if (!newBlocksAr[index]) newBlocksAr[index] = { ...itemAr, image: { ...(itemAr.image || {}) } };
                        newBlocksEn[index].image = {
                          width: 1000,
                          height: 707,
                          loading: 'lazy',
                          ...newBlocksEn[index].image,
                          alt: e.target.value,
                        };
                        newBlocksAr[index].image = {
                          width: 1000,
                          height: 707,
                          loading: 'lazy',
                          ...newBlocksAr[index].image,
                          alt: e.target.value,
                        };
                        setFormDataEn({ ...formDataEn, blockList: newBlocksEn });
                        setFormDataAr({ ...formDataAr, blockList: newBlocksAr });
                      }}
                      placeholder="Vision"
                    />
                  </div>

                  {renderBilingualField("Subheading", `blockList.${index}.subheading`)}
                  {renderBilingualField("Heading", `blockList.${index}.heading`, "textarea", 3)}
                  {renderBilingualField("Text", `blockList.${index}.text`, "textarea", 5)}
                </div>
              );
            })}
          </div>
        </>
      );
    }

    if (sectionId === 'testimonials') {
      const testimonialItemsEn = formDataEn.items || [];
      const testimonialItemsAr = formDataAr.items || [];
      const maxTestimonialItems = Math.max(testimonialItemsEn.length, testimonialItemsAr.length, 1);

      return (
        <>
          {renderBilingualField("Subheading", "subheading")}
          {renderBilingualField("Heading", "heading", "textarea", 4)}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ margin: 0 }}>Cards</label>
              <button
                type="button"
                onClick={() => {
                  const newItem = { text: '' };
                  setFormDataEn({ ...formDataEn, items: [...testimonialItemsEn, newItem] });
                  setFormDataAr({ ...formDataAr, items: [...testimonialItemsAr, newItem] });
                }}
                className="cms-item-add-btn"
              >
                + Add Card
              </button>
            </div>

            {Array.from({ length: maxTestimonialItems }).map((_, index) => {
              const itemEn = testimonialItemsEn[index] || { text: '' };
              const itemAr = testimonialItemsAr[index] || { text: '' };

              return (
                <div key={index} className="cms-item-card">
                  <div className="cms-item-header">
                    <h4>Card {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newItemsEn = testimonialItemsEn.filter((_: any, i: number) => i !== index);
                        const newItemsAr = testimonialItemsAr.filter((_: any, i: number) => i !== index);
                        setFormDataEn({ ...formDataEn, items: newItemsEn });
                        setFormDataAr({ ...formDataAr, items: newItemsAr });
                      }}
                      className="admin-btn admin-btn-delete"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="form-group-bilingual">
                    <label>Card Text</label>
                    <div className="bilingual-inputs">
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">English</span>
                        <textarea
                          value={itemEn.text || ''}
                          onChange={(e) => {
                            const newItemsEn = [...testimonialItemsEn];
                            if (!newItemsEn[index]) newItemsEn[index] = { ...itemEn };
                            newItemsEn[index].text = e.target.value;
                            setFormDataEn({ ...formDataEn, items: newItemsEn });
                          }}
                          rows={4}
                          placeholder="Card text in English"
                        />
                      </div>
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">العربية</span>
                        <textarea
                          value={itemAr.text || ''}
                          onChange={(e) => {
                            const newItemsAr = [...testimonialItemsAr];
                            if (!newItemsAr[index]) newItemsAr[index] = { ...itemAr };
                            newItemsAr[index].text = e.target.value;
                            setFormDataAr({ ...formDataAr, items: newItemsAr });
                          }}
                          rows={4}
                          placeholder="نص البطاقة بالعربية"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    if (sectionId === 'faq') {
      const faqItemsEn = formDataEn.items || [];
      const faqItemsAr = formDataAr.items || [];
      const maxFaqItems = Math.max(faqItemsEn.length, faqItemsAr.length, 1);
      
      return (
        <>
          {renderBilingualField("Subheading", "subheading")}
          {renderBilingualField("Heading", "heading")}
          {renderBilingualField("Text", "text", "textarea", 4)}
          {renderBilingualField("Button Label", "button.label")}
          <div className="form-group">
            <label>Button Link (shared)</label>
            <input
              type="text"
              value={formDataEn.button?.href || formDataAr.button?.href || ''}
              onChange={(e) => {
                updateField('en', 'button.href', e.target.value);
                updateField('ar', 'button.href', e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Button Type (shared)</label>
            <select
              value={formDataEn.button?.type || formDataAr.button?.type || 'primary'}
              onChange={(e) => {
                updateField('en', 'button.type', e.target.value);
                updateField('ar', 'button.type', e.target.value);
              }}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ margin: 0 }}>FAQ Items (Questions & Answers)</label>
              <button 
                type="button" 
                onClick={() => {
                  const newItem = { title: '', text: '' };
                  setFormDataEn({ ...formDataEn, items: [...faqItemsEn, newItem] });
                  setFormDataAr({ ...formDataAr, items: [...faqItemsAr, newItem] });
                }} 
                className="cms-item-add-btn"
              >
                + Add FAQ Item
              </button>
            </div>
            
            {Array.from({ length: maxFaqItems }).map((_, index) => {
              const itemEn = faqItemsEn[index] || { title: '', text: '' };
              const itemAr = faqItemsAr[index] || { title: '', text: '' };
              
              return (
                <div key={index} className="cms-item-card">
                  <div className="cms-item-header">
                    <h4>FAQ {index + 1}</h4>
                    <button 
                      type="button" 
                      onClick={() => {
                        const newItemsEn = faqItemsEn.filter((_: any, i: number) => i !== index);
                        const newItemsAr = faqItemsAr.filter((_: any, i: number) => i !== index);
                        setFormDataEn({ ...formDataEn, items: newItemsEn });
                        setFormDataAr({ ...formDataAr, items: newItemsAr });
                      }} 
                      className="admin-btn admin-btn-delete"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="form-group-bilingual" style={{ marginBottom: '10px' }}>
                    <label>Question</label>
                    <div className="bilingual-inputs">
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">English</span>
                        <input
                          type="text"
                          value={itemEn.title || ''}
                          onChange={(e) => {
                            const newItemsEn = [...faqItemsEn];
                            if (!newItemsEn[index]) newItemsEn[index] = { ...itemEn };
                            newItemsEn[index].title = e.target.value;
                            setFormDataEn({ ...formDataEn, items: newItemsEn });
                          }}
                          placeholder="Question in English"
                        />
                      </div>
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">العربية</span>
                        <input
                          type="text"
                          value={itemAr.title || ''}
                          onChange={(e) => {
                            const newItemsAr = [...faqItemsAr];
                            if (!newItemsAr[index]) newItemsAr[index] = { ...itemAr };
                            newItemsAr[index].title = e.target.value;
                            setFormDataAr({ ...formDataAr, items: newItemsAr });
                          }}
                          placeholder="السؤال بالعربية"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group-bilingual">
                    <label>Answer</label>
                    <div className="bilingual-inputs">
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">English</span>
                        <textarea
                          value={itemEn.text || ''}
                          onChange={(e) => {
                            const newItemsEn = [...faqItemsEn];
                            if (!newItemsEn[index]) newItemsEn[index] = { ...itemEn };
                            newItemsEn[index].text = e.target.value;
                            setFormDataEn({ ...formDataEn, items: newItemsEn });
                          }}
                          rows={4}
                          placeholder="Answer in English"
                        />
                      </div>
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">العربية</span>
                        <textarea
                          value={itemAr.text || ''}
                          onChange={(e) => {
                            const newItemsAr = [...faqItemsAr];
                            if (!newItemsAr[index]) newItemsAr[index] = { ...itemAr };
                            newItemsAr[index].text = e.target.value;
                            setFormDataAr({ ...formDataAr, items: newItemsAr });
                          }}
                          rows={4}
                          placeholder="الإجابة بالعربية"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    
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
                className="cms-item-add-btn"
              >
                + Add Item
              </button>
            </div>
            
            {Array.from({ length: maxItems }).map((_, itemIndex) => {
              const itemEn = timelineEn[itemIndex] || { year: '', title: '', logos: [], position: 'below' };
              const itemAr = timelineAr[itemIndex] || { year: '', title: '', logos: [], position: 'below' };
              
              return (
                <div key={itemIndex} className="cms-item-card">
                  <div className="cms-item-header">
                    <h4>Item {itemIndex + 1}</h4>
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormDataEn({ ...formDataEn, timelineItems: timelineEn.filter((_: any, i: number) => i !== itemIndex) });
                        setFormDataAr({ ...formDataAr, timelineItems: timelineAr.filter((_: any, i: number) => i !== itemIndex) });
                      }} 
                      className="admin-btn admin-btn-delete"
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
                        className="cms-item-add-btn"
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
                      >
                        + Add Logo
                      </button>
                    </div>
                    
                    {(itemEn.logos || itemAr.logos || []).map((logo: any, logoIndex: number) => (
                      <div key={logoIndex} className="cms-item-card" style={{ marginBottom: '10px' }}>
                        <div className="cms-item-header">
                          <h4>Logo {logoIndex + 1}</h4>
                          <button 
                            type="button" 
                            className="admin-btn admin-btn-delete"
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

  const meta = SECTION_META[sectionId] ?? { label: sectionId, desc: '', icon: '📋' };

  return (
    <>
      <div className="admin-edit-panel-header">
        <div className="admin-edit-panel-title">
          <strong>Editing: {meta.label}</strong>
          <span>{meta.desc}</span>
        </div>
        <button type="button" className="admin-btn admin-btn-edit" onClick={onClose}>✕ Close</button>
      </div>
      <form onSubmit={handleSubmit} className="admin-cms-form">
        {renderFields()}
        <div className="form-actions">
          <button type="submit" className="button button-primary">Save (Both Languages)</button>
          <button type="button" className="admin-btn admin-btn-edit" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </>
  );
};

export default AboutPageCMS;
