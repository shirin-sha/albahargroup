'use client';

import { useState, useEffect } from 'react';

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

const AboutPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
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
        {ABOUT_PAGE_SECTIONS.map((sectionId) => {
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
      setFormData(section[lang] || {});
    }
  }, [section, lang]);

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

  const addTimelineItem = () => {
    const items = formData.timelineItems || [];
    setFormData({
      ...formData,
      timelineItems: [...items, { year: '', title: '', logos: [], position: 'below' }]
    });
  };

  const removeTimelineItem = (index: number) => {
    const items = formData.timelineItems || [];
    setFormData({
      ...formData,
      timelineItems: items.filter((_: any, i: number) => i !== index)
    });
  };

  const updateTimelineItem = (index: number, field: string, value: any) => {
    const items = [...(formData.timelineItems || [])];
    items[index] = { ...items[index], [field]: value };
    setFormData({ ...formData, timelineItems: items });
  };

  const addLogoToItem = (itemIndex: number) => {
    const items = [...(formData.timelineItems || [])];
    const logos = items[itemIndex].logos || [];
    items[itemIndex] = {
      ...items[itemIndex],
      logos: [...logos, { src: '', alt: '', width: 100, height: 60 }]
    };
    setFormData({ ...formData, timelineItems: items });
  };

  const removeLogoFromItem = (itemIndex: number, logoIndex: number) => {
    const items = [...(formData.timelineItems || [])];
    const logos = items[itemIndex].logos || [];
    items[itemIndex] = {
      ...items[itemIndex],
      logos: logos.filter((_: any, i: number) => i !== logoIndex)
    };
    setFormData({ ...formData, timelineItems: items });
  };

  const updateLogo = (itemIndex: number, logoIndex: number, field: string, value: any) => {
    const items = [...(formData.timelineItems || [])];
    const logos = [...(items[itemIndex].logos || [])];
    logos[logoIndex] = { ...logos[logoIndex], [field]: value };
    items[itemIndex] = { ...items[itemIndex], logos };
    setFormData({ ...formData, timelineItems: items });
  };

  const renderFields = () => {
    if (sectionId === 'timeline') {
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ margin: 0 }}>Timeline Items</label>
              <button type="button" onClick={addTimelineItem} className="button" style={{ fontSize: '12px', padding: '6px 12px' }}>
                + Add Item
              </button>
            </div>
            
            {(formData.timelineItems || []).map((item: any, itemIndex: number) => (
              <div key={itemIndex} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', marginBottom: '15px', background: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong>Item {itemIndex + 1}</strong>
                  <button type="button" onClick={() => removeTimelineItem(itemIndex)} className="button" style={{ fontSize: '12px', padding: '4px 8px', background: '#ef4444', color: 'white' }}>
                    Remove
                  </button>
                </div>
                
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>Year</label>
                  <input
                    type="text"
                    value={item.year || ''}
                    onChange={(e) => updateTimelineItem(itemIndex, 'year', e.target.value)}
                    placeholder="e.g., 1937"
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateTimelineItem(itemIndex, 'title', e.target.value)}
                    placeholder="e.g., Company founded"
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>Position</label>
                  <select
                    value={item.position || 'below'}
                    onChange={(e) => updateTimelineItem(itemIndex, 'position', e.target.value)}
                  >
                    <option value="below">Below</option>
                    <option value="above">Above</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ margin: 0 }}>Logos</label>
                    <button type="button" onClick={() => addLogoToItem(itemIndex)} className="button" style={{ fontSize: '12px', padding: '4px 8px' }}>
                      + Add Logo
                    </button>
                  </div>
                  
                  {(item.logos || []).map((logo: any, logoIndex: number) => (
                    <div key={logoIndex} style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '10px', marginBottom: '10px', background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Logo {logoIndex + 1}</span>
                        <button type="button" onClick={() => removeLogoFromItem(itemIndex, logoIndex)} style={{ fontSize: '12px', padding: '2px 6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          ×
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                        <div>
                          <label style={{ fontSize: '12px' }}>Image URL</label>
                          <input
                            type="text"
                            value={logo.src || ''}
                            onChange={(e) => updateLogo(itemIndex, logoIndex, 'src', e.target.value)}
                            placeholder="/img/brand/logo.png"
                            style={{ fontSize: '12px', padding: '6px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px' }}>Alt Text</label>
                          <input
                            type="text"
                            value={logo.alt || ''}
                            onChange={(e) => updateLogo(itemIndex, logoIndex, 'alt', e.target.value)}
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
                            value={logo.width || 100}
                            onChange={(e) => updateLogo(itemIndex, logoIndex, 'width', parseInt(e.target.value))}
                            style={{ fontSize: '12px', padding: '6px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px' }}>Height</label>
                          <input
                            type="number"
                            value={logo.height || 60}
                            onChange={(e) => updateLogo(itemIndex, logoIndex, 'height', parseInt(e.target.value))}
                            style={{ fontSize: '12px', padding: '6px' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

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
        {formData.text !== undefined && (
          <div className="form-group">
            <label>Text</label>
            <textarea
              value={formData.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              rows={6}
            />
          </div>
        )}
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
              Save {lang.toUpperCase()}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AboutPageCMS;
