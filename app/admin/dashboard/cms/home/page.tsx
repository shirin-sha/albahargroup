'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HOME_PAGE_SECTIONS } from '@/libs/models/homePage';

interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  en: any;
  ar: any;
}

const HomePageCMS = () => {
  const router = useRouter();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/home');
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
      const res = await fetch('/api/cms/home', {
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
        <h1>Home Page CMS</h1>
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
        {HOME_PAGE_SECTIONS.map((sectionId) => {
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
      // For hero section, ensure slides is an array
      if (sectionId === 'hero') {
        setFormData({
          slides: Array.isArray(sectionData.slides) ? sectionData.slides : 
                 (sectionData.subheading ? [sectionData] : [])
        });
      } else if (sectionId === 'imageText') {
        // For imageText section, ensure items is an array
        setFormData({
          ...sectionData,
          items: Array.isArray(sectionData.items) ? sectionData.items : []
        });
      } else if (sectionId === 'whyChooseUs') {
        // For whyChooseUs section, ensure items is an array
        setFormData({
          ...sectionData,
          items: Array.isArray(sectionData.items) ? sectionData.items : []
        });
      } else if (sectionId === 'pricing') {
        // For pricing section, ensure cards is an array
        setFormData({
          ...sectionData,
          cards: Array.isArray(sectionData.cards) ? sectionData.cards : []
        });
      } else if (sectionId === 'testimonials') {
        // For testimonials section, ensure items is an array
        setFormData({
          ...sectionData,
          items: Array.isArray(sectionData.items) ? sectionData.items : []
        });
      } else if (sectionId === 'faq') {
        // For FAQ section, ensure items is an array
        setFormData({
          ...sectionData,
          items: Array.isArray(sectionData.items) ? sectionData.items : []
        });
      } else {
        setFormData(sectionData);
      }
    } else {
      // Initialize empty data
      if (sectionId === 'hero') {
        setFormData({ slides: [] });
      } else if (sectionId === 'imageText') {
        setFormData({ items: [] });
      } else if (sectionId === 'whyChooseUs') {
        setFormData({ items: [] });
      } else if (sectionId === 'pricing') {
        setFormData({ cards: [] });
      } else if (sectionId === 'testimonials') {
        setFormData({ items: [] });
      } else if (sectionId === 'faq') {
        setFormData({ items: [] });
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
      case 'hero':
        const slides = formData.slides || [];
        return (
          <>
            <div className="hero-slides-container">
              {slides.map((slide: any, index: number) => (
                <div key={index} className="hero-slide-card">
                  <div className="hero-slide-header">
                    <h4>Slide {index + 1}</h4>
                    {slides.length > 1 && (
                      <button
                        type="button"
                        className="hero-slide-remove"
                        onClick={() => {
                          const newSlides = slides.filter((_: any, i: number) => i !== index);
                          setFormData({ ...formData, slides: newSlides });
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="hero-slide-fields">
                    <div className="form-group">
                      <label>Subheading</label>
                      <input
                        type="text"
                        value={slide.subheading || ''}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = { ...slide, subheading: e.target.value };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Heading</label>
                      <input
                        type="text"
                        value={slide.heading || ''}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = { ...slide, heading: e.target.value };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Text</label>
                      <textarea
                        value={slide.text || ''}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = { ...slide, text: e.target.value };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                        rows={4}
                      />
                    </div>
                    <div className="form-group">
                      <label>Button Label</label>
                      <input
                        type="text"
                        value={slide.button?.label || ''}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = {
                            ...slide,
                            button: { ...slide.button, label: e.target.value }
                          };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Button Link</label>
                      <input
                        type="text"
                        value={slide.button?.href || ''}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = {
                            ...slide,
                            button: { ...slide.button, href: e.target.value }
                          };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={slide.image || ''}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = { ...slide, image: e.target.value };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                        placeholder="/img/slider/hero1.png"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="hero-add-slide-button"
                onClick={() => {
                  const newSlide = {
                    subheading: '',
                    heading: '',
                    text: '',
                    button: { label: '', href: '' },
                    image: ''
                  };
                  setFormData({
                    ...formData,
                    slides: [...(formData.slides || []), newSlide]
                  });
                }}
              >
                + Add More Slide
              </button>
            </div>
          </>
        );
      case 'imageText':
        const items = formData.items || [];
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
                rows={6}
              />
            </div>
            <div className="form-group">
              <label>Button Label</label>
              <input
                type="text"
                value={formData.button?.label || ''}
                onChange={(e) => updateField('button.label', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                value={formData.button?.href || ''}
                onChange={(e) => updateField('button.href', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Items</label>
              <div className="hero-slides-container">
                {items.map((item: any, index: number) => (
                  <div key={index} className="hero-slide-card">
                    <div className="hero-slide-header">
                      <h4>Item {index + 1}</h4>
                      {items.length > 1 && (
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            const newItems = items.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, items: newItems });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="hero-slide-fields">
                      <div className="form-group">
                        <label>Text Heading 1</label>
                        <input
                          type="text"
                          value={item.textheading1 || ''}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = { ...item, textheading1: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Text Description 1</label>
                        <textarea
                          value={item.textdescr1 || ''}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = { ...item, textdescr1: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newItem = {
                      textheading1: '',
                      textdescr1: ''
                    };
                    setFormData({
                      ...formData,
                      items: [...(formData.items || []), newItem]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
          </>
        );
      case 'services':
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
              <label>Button Label</label>
              <input
                type="text"
                value={formData.button?.label || ''}
                onChange={(e) => updateField('button.label', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                value={formData.button?.href || ''}
                onChange={(e) => updateField('button.href', e.target.value)}
              />
            </div>
          </>
        );
      case 'whyChooseUs':
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
              <label>Button Label</label>
              <input
                type="text"
                value={formData.button?.label || ''}
                onChange={(e) => updateField('button.label', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                value={formData.button?.href || ''}
                onChange={(e) => updateField('button.href', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={formData.image?.src || ''}
                onChange={(e) => updateField('image.src', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Items (Mission, Vision, Values, etc.)</label>
              <div className="hero-slides-container">
                {(formData.items || []).map((item: any, index: number) => (
                  <div key={index} className="hero-slide-card">
                    <div className="hero-slide-header">
                      <h4>Item {index + 1}</h4>
                      {(formData.items || []).length > 1 && (
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            const newItems = (formData.items || []).filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, items: newItems });
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
                          value={item.title || ''}
                          onChange={(e) => {
                            const newItems = [...(formData.items || [])];
                            newItems[index] = { ...item, title: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Text</label>
                        <textarea
                          value={item.text || ''}
                          onChange={(e) => {
                            const newItems = [...(formData.items || [])];
                            newItems[index] = { ...item, text: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newItem = {
                      title: '',
                      text: ''
                    };
                    setFormData({
                      ...formData,
                      items: [...(formData.items || []), newItem]
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
        const testimonialItems = formData.items || [];
        return (
          <>
            <div className="form-group">
              <label>Testimonial Items</label>
              <div className="hero-slides-container">
                {testimonialItems.map((item: any, index: number) => (
                  <div key={index} className="hero-slide-card">
                    <div className="hero-slide-header">
                      <h4>Item {index + 1}</h4>
                      {testimonialItems.length > 1 && (
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            const newItems = testimonialItems.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, items: newItems });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="hero-slide-fields">
                      <div className="form-group">
                        <label>Image URL</label>
                        <input
                          type="text"
                          value={item.image || ''}
                          onChange={(e) => {
                            const newItems = [...testimonialItems];
                            newItems[index] = { ...item, image: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          placeholder="/img/project/techno.jpg"
                        />
                      </div>
                      <div className="form-group">
                        <label>Subheading (Eye Heading)</label>
                        <input
                          type="text"
                          value={item.subheading || ''}
                          onChange={(e) => {
                            const newItems = [...testimonialItems];
                            newItems[index] = { ...item, subheading: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Heading (Main Heading)</label>
                        <input
                          type="text"
                          value={item.heading || ''}
                          onChange={(e) => {
                            const newItems = [...testimonialItems];
                            newItems[index] = { ...item, heading: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={item.description || item.review || ''}
                          onChange={(e) => {
                            const newItems = [...testimonialItems];
                            newItems[index] = { ...item, description: e.target.value, review: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          rows={4}
                        />
                      </div>
                      <div className="form-group">
                        <label>Button Label</label>
                        <input
                          type="text"
                          value={item.button?.label || ''}
                          onChange={(e) => {
                            const newItems = [...testimonialItems];
                            newItems[index] = { 
                              ...item, 
                              button: { ...item.button, label: e.target.value } 
                            };
                            setFormData({ ...formData, items: newItems });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Button Link</label>
                        <input
                          type="text"
                          value={item.button?.href || ''}
                          onChange={(e) => {
                            const newItems = [...testimonialItems];
                            newItems[index] = { 
                              ...item, 
                              button: { ...item.button, href: e.target.value } 
                            };
                            setFormData({ ...formData, items: newItems });
                          }}
                          placeholder="/testimonials"
                        />
                      </div>
                      <div className="form-group">
                        <label>Icon Name (optional)</label>
                        <input
                          type="text"
                          value={item.icon || ''}
                          onChange={(e) => {
                            const newItems = [...testimonialItems];
                            newItems[index] = { ...item, icon: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          placeholder="Consultingnew"
                        />
                        <small>Icon name from Icons component (optional)</small>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newItem = {
                      image: '',
                      subheading: '',
                      heading: '',
                      description: '',
                      button: { label: '', href: '' },
                      icon: ''
                    };
                    setFormData({
                      ...formData,
                      items: [...testimonialItems, newItem]
                    });
                  }}
                >
                  + Add More
                </button>
              </div>
            </div>
          </>
        );
      case 'faq':
        const faqItems = formData.items || [];
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
              <label>Button Label</label>
              <input
                type="text"
                value={formData.button?.label || ''}
                onChange={(e) => updateField('button.label', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                value={formData.button?.href || ''}
                onChange={(e) => updateField('button.href', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>FAQ Items (Questions & Answers)</label>
              <div className="hero-slides-container">
                {faqItems.map((item: any, index: number) => (
                  <div key={index} className="hero-slide-card">
                    <div className="hero-slide-header">
                      <h4>FAQ {index + 1}</h4>
                      {faqItems.length > 1 && (
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            const newItems = faqItems.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, items: newItems });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="hero-slide-fields">
                      <div className="form-group">
                        <label>Question</label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => {
                            const newItems = [...faqItems];
                            newItems[index] = { ...item, title: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Answer</label>
                        <textarea
                          value={item.text || ''}
                          onChange={(e) => {
                            const newItems = [...faqItems];
                            newItems[index] = { ...item, text: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newItem = {
                      title: '',
                      text: ''
                    };
                    setFormData({
                      ...formData,
                      items: [...faqItems, newItem]
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
        const cards = formData.cards || [];
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
              <label>Cards</label>
              <div className="hero-slides-container">
                {cards.map((card: any, index: number) => (
                  <div key={index} className="hero-slide-card">
                    <div className="hero-slide-header">
                      <h4>Card {index + 1}</h4>
                      {cards.length > 1 && (
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            const newCards = cards.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, cards: newCards });
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
                          value={card.title || ''}
                          onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index] = { ...card, title: e.target.value };
                            setFormData({ ...formData, cards: newCards });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          type="text"
                          value={card.description || ''}
                          onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index] = { ...card, description: e.target.value };
                            setFormData({ ...formData, cards: newCards });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Features (one per line)</label>
                        <textarea
                          value={Array.isArray(card.features) ? card.features.join('\n') : (card.features || '')}
                          onChange={(e) => {
                            const features = e.target.value.split('\n').filter(f => f.trim());
                            const newCards = [...cards];
                            newCards[index] = { ...card, features };
                            setFormData({ ...formData, cards: newCards });
                          }}
                          rows={6}
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        />
                        <small>Enter each feature on a new line</small>
                      </div>
                      <div className="form-group">
                        <label>Link</label>
                        <input
                          type="text"
                          value={card.link || ''}
                          onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index] = { ...card, link: e.target.value };
                            setFormData({ ...formData, cards: newCards });
                          }}
                          placeholder="/about-us"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={card.active === true}
                            onChange={(e) => {
                              const newCards = [...cards];
                              newCards[index] = { ...card, active: e.target.checked };
                              setFormData({ ...formData, cards: newCards });
                            }}
                          />
                          {' '}Active (Highlighted)
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    const newCard = {
                      title: '',
                      description: '',
                      features: [],
                      link: '',
                      active: false
                    };
                    setFormData({
                      ...formData,
                      cards: [...cards, newCard]
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
              <label>Button Label</label>
              <input
                type="text"
                value={formData.button?.label || ''}
                onChange={(e) => updateField('button.label', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                value={formData.button?.href || ''}
                onChange={(e) => updateField('button.href', e.target.value)}
              />
            </div>
          </>
        );
      case 'projects':
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
              <label style={{ fontSize: '12px', color: '#6b7280' }}>
                Note: Project items are managed separately in Admin → Projects
              </label>
            </div>
          </>
        );
      default:
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

export default HomePageCMS;
