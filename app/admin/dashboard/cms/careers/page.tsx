'use client';

import { useState, useEffect } from 'react';

interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  en: any;
  ar: any;
}

const CAREERS_PAGE_SECTIONS = ['banner', 'careerSection'] as const;

const CareersPageCMS = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/careers');
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
      const res = await fetch('/api/cms/careers', {
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
        <h1>Careers Page CMS</h1>
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
        {CAREERS_PAGE_SECTIONS.map((sectionId) => {
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
      case 'careerSection':
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

export default CareersPageCMS;
