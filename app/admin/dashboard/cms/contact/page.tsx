'use client';

import { useState, useEffect } from 'react';

interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  en: any;
  ar: any;
}

const CONTACT_PAGE_SECTIONS = ['banner', 'contactForm', 'map'] as const;

const ContactPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
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
    <div className={`admin-cms-container ${activeTab === 'ar' ? 'rtl' : 'ltr'}`} dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-cms-header">
        <h1>Contact Us Page CMS</h1>
        <div className="admin-cms-tabs">
          <button
            className={activeTab === 'en' ? 'active' : ''}
            onClick={() => setActiveTab('en')}
          >
            English
          </button>
          <button
            className={activeTab === 'ar' ? 'active' : ''}
            onClick={() => setActiveTab('ar')}
          >
            العربية
          </button>
        </div>
      </div>

      <div className="admin-cms-sections">
        {CONTACT_PAGE_SECTIONS.map((sectionId) => {
          const section = sections.find((s) => s.sectionId === sectionId);
          return (
            <SectionEditor
              key={sectionId}
              sectionId={sectionId}
              section={section}
              lang={activeTab}
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
  lang: 'en' | 'ar';
  onSave: (sectionId: string, data: Partial<SectionData>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionEditor = ({
  sectionId,
  section,
  lang,
  onSave,
  isOpen,
  onToggle,
}: SectionEditorProps) => {
  const [formData, setFormData] = useState<any>(section?.[lang] || {});

  useEffect(() => {
    if (section) {
      const sectionData = section[lang] || {};
      if (sectionId === 'contactForm') {
        setFormData({
          ...sectionData,
          promotions: Array.isArray(sectionData.promotions) ? sectionData.promotions : []
        });
      } else {
        setFormData(sectionData);
      }
    } else {
      if (sectionId === 'contactForm') {
        setFormData({ promotions: [] });
      } else {
        setFormData({});
      }
    }
  }, [section, lang, sectionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: Partial<SectionData> = {
      enabled: section?.enabled ?? true,
      order: section?.order ?? 0,
      [lang]: formData,
    };
    onSave(sectionId, updateData);
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const renderFields = () => {
    switch (sectionId) {
      case 'banner':
        return (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
          </>
        );
      case 'contactForm':
        const promotions = formData.promotions || [];
        return (
          <>
            <div className="form-group">
              <label>Subheading</label>
              <input
                type="text"
                value={formData.subheading || ''}
                onChange={(e) => updateField('subheading', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Heading</label>
              <input
                type="text"
                value={formData.heading || ''}
                onChange={(e) => updateField('heading', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Text</label>
              <textarea
                value={formData.text || ''}
                onChange={(e) => updateField('text', e.target.value)}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Promotions (Contact Info Items)</label>
              <div className="hero-slides-container">
                {promotions.map((promo: any, index: number) => (
                  <div key={index} className="hero-slide-card">
                    <div className="hero-slide-header">
                      <h4>Item {index + 1}</h4>
                      {promotions.length > 1 && (
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            const newPromotions = promotions.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, promotions: newPromotions });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="hero-slide-fields">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={promo.title || ''}
                          onChange={(e) => {
                            const newPromotions = [...promotions];
                            newPromotions[index] = { ...promo, title: e.target.value };
                            setFormData({ ...formData, promotions: newPromotions });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Text</label>
                        <textarea
                          value={promo.text || ''}
                          onChange={(e) => {
                            const newPromotions = [...promotions];
                            newPromotions[index] = { ...promo, text: e.target.value };
                            setFormData({ ...formData, promotions: newPromotions });
                          }}
                          rows={3}
                          placeholder="You can use &lt;br /&gt; for line breaks"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newPromo = {
                      title: '',
                      text: ''
                    };
                    setFormData({
                      ...formData,
                      promotions: [...(formData.promotions || []), newPromo]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Form Block Heading</label>
              <input
                type="text"
                value={formData.block?.heading || ''}
                onChange={(e) => updateField('block.heading', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Form Block Text</label>
              <textarea
                value={formData.block?.text || ''}
                onChange={(e) => updateField('block.text', e.target.value)}
                rows={3}
              />
            </div>
          </>
        );
      case 'map':
        return (
          <>
            <div className="form-group">
              <label>Map Embed URL/Code</label>
              <textarea
                value={formData.mapEmbed || ''}
                onChange={(e) => updateField('mapEmbed', e.target.value)}
                rows={4}
                placeholder="Google Maps embed code or URL"
              />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className={`admin-cms-section-card ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-cms-section-header" onClick={onToggle}>
        <h3>{sectionId}</h3>
        <span className="admin-cms-toggle">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <form onSubmit={handleSubmit} className="admin-cms-form">
          {renderFields()}
          <div className="form-actions">
            <button type="submit" className="button button-primary">
              {lang === 'ar' ? 'حفظ' : `Save ${lang.toUpperCase()}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactPageCMS;
