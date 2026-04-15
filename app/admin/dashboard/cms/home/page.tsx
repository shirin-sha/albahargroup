'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { HOME_PAGE_SECTIONS } from '@/libs/models/homePage';
import ImageUpload from '@/components/admin/ImageUpload';

interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  en: any;
  ar: any;
}

// BilingualField component - extracted outside to prevent recreation on every render
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
    case 'hero':         return en.slides?.[0]?.image || null;
    case 'imageText':    return en.imageList?.[0]?.src || null;
    case 'whyChooseUs':  return en.image?.src || null;
    case 'testimonials': return en.items?.[0]?.image || null;
    default:             return null;
  }
};

const getTitle = (section: SectionData | undefined, lang: 'en' | 'ar'): string => {
  const data = section?.[lang];
  if (!data) return '—';
  if (section?.sectionId === 'metadata') return data.metaTitle || '—';
  return data.heading || data.title || data.subheading || data.slides?.[0]?.heading || '—';
};

const HomePageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/home');
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
      const res = await fetch('/api/cms/home', {
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
        <h1>Home Page CMS</h1>
        <p className="cms-page-subtitle">Manage all homepage sections</p>
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
              <th>Metadata (EN)</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {HOME_PAGE_SECTIONS.map((sectionId) => {
              const section = sections.find(s => s.sectionId === sectionId);
              const meta = SECTION_META[sectionId] ?? { label: sectionId, desc: '', icon: '📋' };
              const previewImage = getPreviewImage(section, sectionId);
              const titleEn = getTitle(section, 'en');
              const titleAr = getTitle(section, 'ar');
              const metaTitleEn = sectionId === 'metadata'
                ? (section?.en?.metaTitle || '—')
                : '—';
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

const SECTION_META: Record<string, { label: string; desc: string; icon: string }> = {
  metadata:     { label: 'Metadata',         desc: 'Homepage SEO title and description',              icon: '🔎' },
  hero:         { label: 'Hero Slider',      desc: 'Main banner slides with heading, text & CTA',    icon: '🖼️' },
  imageText:    { label: 'Our Heritage',     desc: 'Side-by-side media and content block',           icon: '📄' },
  services:     { label: 'Capabilities',         desc: 'Services section heading and link',              icon: '⚙️' },
  whyChooseUs:  { label: 'Why Al Bahar Group',   desc: 'Key reasons with image and items',               icon: '✅' },
  pricing:      { label: 'How We Create Value',    desc: 'Pricing cards with features list',               icon: '💳' },
  testimonials: { label: 'Services',     desc: 'Business verticals heading (items from Services → Businesses)', icon: '💬' },
  faq:          { label: 'FAQ',              desc: 'Frequently asked questions accordion',           icon: '❓' },
  blog:         { label: 'Blog Section',     desc: 'Latest posts section heading and link',          icon: '📝' },
  projects:     { label: 'Image Archive', desc: 'Featured projects section heading',              icon: '🗂️' },
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
    
    const initializeData = (data: any, sectionId: string) => {
      if (sectionId === 'hero') {
        return {
          ...data,
          slides: Array.isArray(data?.slides) ? data.slides : 
                 (data?.subheading ? [data] : [])
        };
      } else if (sectionId === 'imageText') {
        const logoList = Array.isArray(data?.rotatingLogo?.logo?.imageList)
          ? data.rotatingLogo.logo.imageList
          : [];
        return {
          ...data,
          items: Array.isArray(data?.items) ? data.items : [],
          rotatingLogo: {
            logo: {
              wrapperCls: data?.rotatingLogo?.logo?.wrapperCls || 'running-content-bg my-1',
              container: data?.rotatingLogo?.logo?.container || 'container-fluid',
              imageList: logoList,
            },
          },
        };
      } else if (sectionId === 'whyChooseUs') {
        return {
          ...data,
          items: Array.isArray(data?.items) ? data.items : []
        };
      } else if (sectionId === 'pricing') {
        return {
          ...data,
          cards: Array.isArray(data?.cards) ? data.cards : []
        };
      } else if (sectionId === 'testimonials') {
        return {
          ...data,
          subheading: data?.subheading ?? '',
          items: Array.isArray(data?.items) ? data.items : [],
        };
      } else if (sectionId === 'faq') {
        return {
          ...data,
          items: Array.isArray(data?.items) ? data.items : []
        };
      }
      return data || {};
    };

    if (section) {
      setFormDataEn(initializeData(section.en, sectionId));
      setFormDataAr(initializeData(section.ar, sectionId));
    } else {
      // Initialize empty data
      if (sectionId === 'hero') {
        setFormDataEn({ slides: [] });
        setFormDataAr({ slides: [] });
      } else if (sectionId === 'imageText') {
        const emptyScroll = {
          rotatingLogo: {
            logo: {
              wrapperCls: 'running-content-bg my-1',
              container: 'container-fluid',
              imageList: [] as any[],
            },
          },
        };
        setFormDataEn({ items: [], ...emptyScroll });
        setFormDataAr({ items: [], ...emptyScroll });
      } else if (sectionId === 'whyChooseUs') {
        setFormDataEn({ items: [] });
        setFormDataAr({ items: [] });
      } else if (sectionId === 'pricing') {
        setFormDataEn({ cards: [] });
        setFormDataAr({ cards: [] });
      } else if (sectionId === 'testimonials') {
        setFormDataEn({ subheading: '', items: [] });
        setFormDataAr({ subheading: '', items: [] });
      } else if (sectionId === 'faq') {
        setFormDataEn({ items: [] });
        setFormDataAr({ items: [] });
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
      // Create a deep copy
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Navigate to the nested path
      const keys = path.split('.');
      let current: any = newData;
      
      // Navigate through all keys except the last one
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const numKey = Number(key);
        
        // Check if this is an array index
        if (!isNaN(numKey) && String(numKey) === key) {
          // It's an array index
          if (!Array.isArray(current)) {
            current = [];
          }
          while (current.length <= numKey) {
            current.push({});
          }
          if (!current[numKey]) {
            current[numKey] = {};
          }
          current = current[numKey];
        } else {
          // It's an object key
          if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
          }
          current = current[key];
        }
      }
      
      // Set the final value
      const lastKey = keys[keys.length - 1];
      const lastNumKey = Number(lastKey);
      
      if (!isNaN(lastNumKey) && String(lastNumKey) === lastKey) {
        // Last key is an array index
        if (!Array.isArray(current)) {
          current = [];
        }
        while (current.length <= lastNumKey) {
          current.push(undefined);
        }
        current[lastNumKey] = value;
      } else {
        // Last key is an object key
        current[lastKey] = value;
      }
      
      return newData;
    });
  }, []);

  // Helper to get nested value from object
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

  // Helper wrapper for BilingualField with current form data
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
        return null;
      case 'hero':
        const slidesEn = formDataEn.slides || [];
        const slidesAr = formDataAr.slides || [];
        const maxSlides = Math.max(slidesEn.length, slidesAr.length);
        return (
          <>
            <div className="hero-slides-container">
              {Array.from({ length: maxSlides }).map((_, index) => {
                const slideEn = slidesEn[index] || { subheading: '', heading: '', text: '', button: { label: '', href: '', type: 'primary' }, image: '' };
                const slideAr = slidesAr[index] || { subheading: '', heading: '', text: '', button: { label: '', href: '', type: 'primary' }, image: '' };
                return (
                  <div key={index} className="cms-item-card">
                    <div className="cms-item-header">
                      <h4>Slide {index + 1}</h4>
                      {maxSlides > 1 && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-delete"
                          onClick={() => {
                            const newSlidesEn = slidesEn.filter((_: any, i: number) => i !== index);
                            const newSlidesAr = slidesAr.filter((_: any, i: number) => i !== index);
                            setFormDataEn({ ...formDataEn, slides: newSlidesEn });
                            setFormDataAr({ ...formDataAr, slides: newSlidesAr });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="hero-slide-fields">
                      {renderBilingualField("Subheading", `slides.${index}.subheading`)}
                      {renderBilingualField("Heading", `slides.${index}.heading`)}
                      {renderBilingualField("Text", `slides.${index}.text`, "textarea", 4)}
                      {renderBilingualField("Button Label", `slides.${index}.button.label`)}
                      <div className="form-group">
                        <label>Button Link (shared)</label>
                        <input
                          type="text"
                          value={slideEn.button?.href || slideAr.button?.href || ''}
                          onChange={(e) => {
                            const newSlidesEn = [...slidesEn];
                            const newSlidesAr = [...slidesAr];
                            if (!newSlidesEn[index]) newSlidesEn[index] = { ...slideEn };
                            if (!newSlidesAr[index]) newSlidesAr[index] = { ...slideAr };
                            newSlidesEn[index].button = { ...newSlidesEn[index].button, href: e.target.value };
                            newSlidesAr[index].button = { ...newSlidesAr[index].button, href: e.target.value };
                            setFormDataEn({ ...formDataEn, slides: newSlidesEn });
                            setFormDataAr({ ...formDataAr, slides: newSlidesAr });
                          }}
                        />
                      </div>
                      <ImageUpload
                        value={slideEn.image || slideAr.image || ''}
                        onChange={(url) => {
                          const newSlidesEn = [...slidesEn];
                          const newSlidesAr = [...slidesAr];
                          if (!newSlidesEn[index]) newSlidesEn[index] = { ...slideEn };
                          if (!newSlidesAr[index]) newSlidesAr[index] = { ...slideAr };
                          newSlidesEn[index].image = url;
                          newSlidesAr[index].image = url;
                          setFormDataEn({ ...formDataEn, slides: newSlidesEn });
                          setFormDataAr({ ...formDataAr, slides: newSlidesAr });
                        }}
                        placeholder="/img/slider/hero1.png"
                        folder="slider"
                        label="Image (shared)"
                      />
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                className="cms-item-add-btn"
                onClick={() => {
                  const newSlide = {
                    subheading: '',
                    heading: '',
                    text: '',
                    button: { label: '', href: '', type: 'primary' },
                    image: ''
                  };
                  setFormDataEn({
                    ...formDataEn,
                    slides: [...(formDataEn.slides || []), newSlide]
                  });
                  setFormDataAr({
                    ...formDataAr,
                    slides: [...(formDataAr.slides || []), newSlide]
                  });
                }}
              >
                + Add More Slide
              </button>
            </div>
          </>
        );
      case 'imageText': {
        const itemsEn = formDataEn.items || [];
        const itemsAr = formDataAr.items || [];
        const maxItems = Math.max(itemsEn.length, itemsAr.length);
        const scrollList =
          formDataEn.rotatingLogo?.logo?.imageList ||
          formDataAr.rotatingLogo?.logo?.imageList ||
          [];
        const scrollWrapper =
          formDataEn.rotatingLogo?.logo?.wrapperCls ||
          formDataAr.rotatingLogo?.logo?.wrapperCls ||
          'running-content-bg my-1';
        const scrollContainer =
          formDataEn.rotatingLogo?.logo?.container ||
          formDataAr.rotatingLogo?.logo?.container ||
          'container-fluid';

        const setScrollingLogos = (imageList: any[]) => {
          const block = {
            wrapperCls: scrollWrapper,
            container: scrollContainer,
            imageList,
          };
          setFormDataEn({ ...formDataEn, rotatingLogo: { logo: block } });
          setFormDataAr({ ...formDataAr, rotatingLogo: { logo: { ...block } } });
        };

        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
            {renderBilingualField("Text", "text", "textarea", 6)}
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
            <ImageUpload
              value={formDataEn.imageList?.[0]?.src || formDataAr.imageList?.[0]?.src || ''}
              onChange={(url) => {
                const mainDefaults = { width: 992, height: 863, alt: 'Image', loading: 'lazy' };
                const enImageList = Array.isArray(formDataEn.imageList) ? [...formDataEn.imageList] : [];
                const arImageList = Array.isArray(formDataAr.imageList) ? [...formDataAr.imageList] : [];
                enImageList[0] = { ...mainDefaults, ...(enImageList[0] || {}), src: url };
                arImageList[0] = { ...mainDefaults, ...(arImageList[0] || {}), src: url };
                setFormDataEn({ ...formDataEn, imageList: enImageList });
                setFormDataAr({ ...formDataAr, imageList: arImageList });
              }}
              placeholder="/img/image-text/img4_new.png"
              folder="image-text"
              label="Main Image (shared)"
            />
            <ImageUpload
              value={formDataEn.imageList?.[1]?.src || formDataAr.imageList?.[1]?.src || ''}
              onChange={(url) => {
                const smallDefaults = { width: 195, height: 202, alt: 'Image', loading: 'lazy' };
                const enImageList = Array.isArray(formDataEn.imageList) ? [...formDataEn.imageList] : [];
                const arImageList = Array.isArray(formDataAr.imageList) ? [...formDataAr.imageList] : [];
                enImageList[1] = { ...smallDefaults, ...(enImageList[1] || {}), src: url };
                arImageList[1] = { ...smallDefaults, ...(arImageList[1] || {}), src: url };
                setFormDataEn({ ...formDataEn, imageList: enImageList });
                setFormDataAr({ ...formDataAr, imageList: arImageList });
              }}
              placeholder="/img/image-text/img-small.svg"
              folder="image-text"
              label="Small Image (shared)"
            />
            <div className="form-group">
              <label>Scrolling brand strip (under images)</label>
              <small style={{ display: 'block', marginBottom: '10px', color: '#6b7280' }}>
                Same logos for EN and AR. Uses <code>ScrollingTextGradient</code> on the live site.
              </small>
              <div className="hero-slides-container">
                {Array.from({ length: Math.max(scrollList.length, 1) }).map((_, index) => {
                  const row = scrollList[index] || {
                    src: '',
                    width: 160,
                    height: 55,
                    alt: '',
                    loading: 'lazy',
                    href: '',
                  };
                  return (
                    <div key={index} className="cms-item-card">
                      <div className="cms-item-header">
                        <h4>Brand {index + 1}</h4>
                        {scrollList.length > 0 && (
                          <button
                            type="button"
                            className="admin-btn admin-btn-delete"
                            onClick={() => {
                              const next = scrollList.filter((_: any, i: number) => i !== index);
                              setScrollingLogos(next);
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="hero-slide-fields">
                        <ImageUpload
                          value={row.src || ''}
                          onChange={(url) => {
                            const next = [...scrollList];
                            while (next.length <= index) {
                              next.push({
                                src: '',
                                width: 160,
                                height: 55,
                                alt: '',
                                loading: 'lazy',
                                href: '',
                              });
                            }
                            next[index] = { ...next[index], src: url };
                            setScrollingLogos(next);
                          }}
                          folder="brand"
                          label="Logo (shared)"
                        />
                        <div className="form-group">
                          <label>Link (optional)</label>
                          <input
                            type="text"
                            value={row.href || ''}
                            onChange={(e) => {
                              const next = [...scrollList];
                              while (next.length <= index) {
                                next.push({
                                  src: '',
                                  width: 160,
                                  height: 55,
                                  alt: '',
                                  loading: 'lazy',
                                  href: '',
                                });
                              }
                              next[index] = { ...next[index], href: e.target.value };
                              setScrollingLogos(next);
                            }}
                            placeholder="/ourpartnerships"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="cms-item-add-btn"
                  onClick={() => {
                    setScrollingLogos([
                      ...scrollList,
                      {
                        src: '',
                        width: 160,
                        height: 55,
                        alt: '',
                        loading: 'lazy',
                        href: '',
                      },
                    ]);
                  }}
                >
                  + Add brand logo
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Items</label>
              <div className="hero-slides-container">
                {Array.from({ length: maxItems }).map((_, index) => {
                  const itemEn = itemsEn[index] || { textheading1: '', textdescr1: '' };
                  const itemAr = itemsAr[index] || { textheading1: '', textdescr1: '' };
                  return (
                    <div key={index} className="cms-item-card">
                      <div className="cms-item-header">
                        <h4>Item {index + 1}</h4>
                        {maxItems > 1 && (
                          <button
                            type="button"
                            className="admin-btn admin-btn-delete"
                            onClick={() => {
                              const newItemsEn = itemsEn.filter((_: any, i: number) => i !== index);
                              const newItemsAr = itemsAr.filter((_: any, i: number) => i !== index);
                              setFormDataEn({ ...formDataEn, items: newItemsEn });
                              setFormDataAr({ ...formDataAr, items: newItemsAr });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="hero-slide-fields">
                        {renderBilingualField("Text Heading 1", `items.${index}.textheading1`)}
                        {renderBilingualField("Text Description 1", `items.${index}.textdescr1`, "textarea", 4)}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="cms-item-add-btn"
                  onClick={() => {
                    const newItem = { textheading1: '', textdescr1: '' };
                    setFormDataEn({
                      ...formDataEn,
                      items: [...(formDataEn.items || []), newItem]
                    });
                    setFormDataAr({
                      ...formDataAr,
                      items: [...(formDataAr.items || []), newItem]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
          </>
        );
      }
      case 'services':
        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
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
              <small>Service capability items are managed from Admin → Services → Capabilities.</small>
            </div>
            <div className="form-group">
              <a href="/admin/dashboard/services/capabilities" className="button button-primary">
                Open Service Capabilities
              </a>
            </div>
          </>
        );
      case 'whyChooseUs':
        const whyItemsEn = formDataEn.items || [];
        const whyItemsAr = formDataAr.items || [];
        const maxWhyItems = Math.max(whyItemsEn.length, whyItemsAr.length);
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
            <ImageUpload
              value={formDataEn.image?.src || formDataAr.image?.src || ''}
              onChange={(url) => {
                updateField('en', 'image.src', url);
                updateField('ar', 'image.src', url);
              }}
              placeholder="/img/why-choose-us/image.jpg"
              folder="why-choose-us"
              label="Image (shared)"
            />
            <div className="form-group">
              <label>Items (Mission, Vision, Values, etc.)</label>
              <div className="hero-slides-container">
                {Array.from({ length: maxWhyItems }).map((_, index) => {
                  const itemEn = whyItemsEn[index] || { title: '', text: '' };
                  const itemAr = whyItemsAr[index] || { title: '', text: '' };
                  return (
                    <div key={index} className="cms-item-card">
                      <div className="cms-item-header">
                        <h4>Item {index + 1}</h4>
                        {maxWhyItems > 1 && (
                          <button
                            type="button"
                            className="admin-btn admin-btn-delete"
                            onClick={() => {
                              const newItemsEn = whyItemsEn.filter((_: any, i: number) => i !== index);
                              const newItemsAr = whyItemsAr.filter((_: any, i: number) => i !== index);
                              setFormDataEn({ ...formDataEn, items: newItemsEn });
                              setFormDataAr({ ...formDataAr, items: newItemsAr });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="hero-slide-fields">
                        {renderBilingualField("Title", `items.${index}.title`)}
                        {renderBilingualField("Text", `items.${index}.text`, "textarea", 4)}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="cms-item-add-btn"
                  onClick={() => {
                    const newItem = { title: '', text: '' };
                    setFormDataEn({
                      ...formDataEn,
                      items: [...(formDataEn.items || []), newItem]
                    });
                    setFormDataAr({
                      ...formDataAr,
                      items: [...(formDataAr.items || []), newItem]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
          </>
        );
      case 'testimonials':
        return (
          <>
            {renderBilingualField('Subheading', 'subheading')}
            <div className="form-group">
              <small>
                Slide content (images, text, icons) comes from Admin → Services → Businesses.
              </small>
            </div>
            <div className="form-group">
              <a href="/admin/dashboard/services/businesses" className="button button-primary">
                Open Services — Business Verticals
              </a>
            </div>
          </>
        );
      case 'faq':
        const faqItemsEn = formDataEn.items || [];
        const faqItemsAr = formDataAr.items || [];
        const maxFaqItems = Math.max(faqItemsEn.length, faqItemsAr.length);
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
              <label>FAQ Items (Questions & Answers)</label>
              <div className="hero-slides-container">
                {Array.from({ length: maxFaqItems }).map((_, index) => {
                  const itemEn = faqItemsEn[index] || { title: '', text: '' };
                  const itemAr = faqItemsAr[index] || { title: '', text: '' };
                  return (
                    <div key={index} className="cms-item-card">
                      <div className="cms-item-header">
                        <h4>FAQ {index + 1}</h4>
                        {maxFaqItems > 1 && (
                          <button
                            type="button"
                            className="admin-btn admin-btn-delete"
                            onClick={() => {
                              const newItemsEn = faqItemsEn.filter((_: any, i: number) => i !== index);
                              const newItemsAr = faqItemsAr.filter((_: any, i: number) => i !== index);
                              setFormDataEn({ ...formDataEn, items: newItemsEn });
                              setFormDataAr({ ...formDataAr, items: newItemsAr });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="hero-slide-fields">
                        {renderBilingualField("Question", `items.${index}.title`)}
                        {renderBilingualField("Answer", `items.${index}.text`, "textarea", 4)}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="cms-item-add-btn"
                  onClick={() => {
                    const newItem = { title: '', text: '' };
                    setFormDataEn({
                      ...formDataEn,
                      items: [...faqItemsEn, newItem]
                    });
                    setFormDataAr({
                      ...formDataAr,
                      items: [...faqItemsAr, newItem]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
          </>
        );
      case 'pricing':
        const cardsEn = formDataEn.cards || [];
        const cardsAr = formDataAr.cards || [];
        const maxCards = Math.max(cardsEn.length, cardsAr.length);
        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
            <div className="form-group">
              <label>Cards</label>
              <div className="hero-slides-container">
                {Array.from({ length: maxCards }).map((_, index) => {
                  const cardEn = cardsEn[index] || { title: '', description: '', features: [], link: '', active: false };
                  const cardAr = cardsAr[index] || { title: '', description: '', features: [], link: '', active: false };
                  return (
                    <div key={index} className="cms-item-card">
                      <div className="cms-item-header">
                        <h4>Card {index + 1}</h4>
                        {maxCards > 1 && (
                          <button
                            type="button"
                            className="admin-btn admin-btn-delete"
                            onClick={() => {
                              const newCardsEn = cardsEn.filter((_: any, i: number) => i !== index);
                              const newCardsAr = cardsAr.filter((_: any, i: number) => i !== index);
                              setFormDataEn({ ...formDataEn, cards: newCardsEn });
                              setFormDataAr({ ...formDataAr, cards: newCardsAr });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="hero-slide-fields">
                        {renderBilingualField("Title", `cards.${index}.title`)}
                        {renderBilingualField("Description", `cards.${index}.description`)}
                        <div className="form-group-bilingual">
                          <label>Features (one per line)</label>
                          <div className="bilingual-inputs">
                            <div className="bilingual-input-group">
                              <span className="bilingual-label">English</span>
                              <textarea
                                value={Array.isArray(cardEn.features) ? cardEn.features.join('\n') : (cardEn.features || '')}
                                onChange={(e) => {
                                  const features = e.target.value.split('\n').filter(f => f.trim());
                                  const newCardsEn = [...cardsEn];
                                  if (!newCardsEn[index]) newCardsEn[index] = { ...cardEn };
                                  newCardsEn[index].features = features;
                                  setFormDataEn({ ...formDataEn, cards: newCardsEn });
                                }}
                                rows={6}
                                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                              />
                            </div>
                            <div className="bilingual-input-group">
                              <span className="bilingual-label">العربية</span>
                              <textarea
                                value={Array.isArray(cardAr.features) ? cardAr.features.join('\n') : (cardAr.features || '')}
                                onChange={(e) => {
                                  const features = e.target.value.split('\n').filter(f => f.trim());
                                  const newCardsAr = [...cardsAr];
                                  if (!newCardsAr[index]) newCardsAr[index] = { ...cardAr };
                                  newCardsAr[index].features = features;
                                  setFormDataAr({ ...formDataAr, cards: newCardsAr });
                                }}
                                rows={6}
                                placeholder="الميزة 1&#10;الميزة 2&#10;الميزة 3"
                                dir="rtl"
                              />
                            </div>
                          </div>
                          <small>Enter each feature on a new line</small>
                        </div>
                        <div className="form-group">
                          <label>Link (shared)</label>
                          <input
                            type="text"
                            value={cardEn.link || cardAr.link || ''}
                            onChange={(e) => {
                              const newCardsEn = [...cardsEn];
                              const newCardsAr = [...cardsAr];
                              if (!newCardsEn[index]) newCardsEn[index] = { ...cardEn };
                              if (!newCardsAr[index]) newCardsAr[index] = { ...cardAr };
                              newCardsEn[index].link = e.target.value;
                              newCardsAr[index].link = e.target.value;
                              setFormDataEn({ ...formDataEn, cards: newCardsEn });
                              setFormDataAr({ ...formDataAr, cards: newCardsAr });
                            }}
                            placeholder="/about-us"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={cardEn.active === true || cardAr.active === true}
                              onChange={(e) => {
                                const newCardsEn = [...cardsEn];
                                const newCardsAr = [...cardsAr];
                                if (!newCardsEn[index]) newCardsEn[index] = { ...cardEn };
                                if (!newCardsAr[index]) newCardsAr[index] = { ...cardAr };
                                newCardsEn[index].active = e.target.checked;
                                newCardsAr[index].active = e.target.checked;
                                setFormDataEn({ ...formDataEn, cards: newCardsEn });
                                setFormDataAr({ ...formDataAr, cards: newCardsAr });
                              }}
                            />
                            {' '}Active (Highlighted)
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="cms-item-add-btn"
                  onClick={() => {
                    const newCard = {
                      title: '',
                      description: '',
                      features: [],
                      link: '',
                      active: false
                    };
                    setFormDataEn({
                      ...formDataEn,
                      cards: [...cardsEn, newCard]
                    });
                    setFormDataAr({
                      ...formDataAr,
                      cards: [...cardsAr, newCard]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
          </>
        );
      case 'blog':
        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
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
              <small>Blog items are managed from Admin → Posts.</small>
            </div>
            <div className="form-group">
              <a href="/admin/dashboard/posts" className="button button-primary">
                Add Post
              </a>
            </div>
          </>
        );
      case 'projects':
        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
            <div className="form-group">
              <small>Items are managed from Admin → Image Archive.</small>
            </div>
            <div className="form-group">
              <a href="/admin/dashboard/projects" className="button button-primary">
                Open Image Archive
              </a>
            </div>
          </>
        );
      default:
        return (
          <>
            {renderBilingualField("Subheading", "subheading")}
            {renderBilingualField("Heading", "heading")}
          </>
        );
    }
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
        {sectionId === 'metadata' && (
          <div className="cms-item-card" style={{ marginBottom: '16px' }}>
            <div className="cms-item-header">
              <h4>SEO Metadata</h4>
            </div>
            <div className="hero-slide-fields">
              {renderBilingualField("Metadata Title", "metaTitle")}
              {renderBilingualField("Metadata Description", "metaDescription", "textarea", 3)}
            </div>
          </div>
        )}
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

export default HomePageCMS;
