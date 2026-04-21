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

const PARTNERSHIPS_PAGE_SECTIONS = ['metadata', 'banner', 'partnershipsHeader', 'partnershipsList'] as const;
const SECTION_META: Record<string, { label: string; desc: string; icon: string }> = {
  metadata: { label: 'Metadata', desc: 'Partnerships page SEO title and description', icon: '🔎' },
  banner: { label: 'Banner', desc: 'Partnerships page banner title', icon: '🖼️' },
  partnershipsHeader: { label: 'Partner Header', desc: 'Subheading, heading and intro text form', icon: '📝' },
  partnershipsList: { label: 'Partner List', desc: 'Add, edit and delete partner brand logos', icon: '🤝' },
};

const PARTNER_CATEGORIES = [
  'Consumer Goods',
  'Consumer Electronics',
  'Home Automation',
  'Enterprise Technology',
  'Shipping, Travel & Tourism',
] as const;

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

const resolveSectionId = (uiSectionId: string): string => {
  if (uiSectionId === 'partnershipsHeader' || uiSectionId === 'partnershipsList') return 'partnerships';
  return uiSectionId;
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

  const addBrand = async (payload: { en: any; ar: any }) => {
    try {
      const res = await fetch('/api/cms/partnerships/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) return false;
      await fetchSections();
      return true;
    } catch (error) {
      console.error('Error adding brand:', error);
      return false;
    }
  };

  const updateBrand = async (payload: { index: number; en: any; ar: any }) => {
    try {
      const res = await fetch('/api/cms/partnerships/brands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) return false;
      await fetchSections();
      return true;
    } catch (error) {
      console.error('Error updating brand:', error);
      return false;
    }
  };

  const deleteBrand = async (index: number) => {
    try {
      const res = await fetch(`/api/cms/partnerships/brands?index=${index}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!result.success) return false;
      await fetchSections();
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      return false;
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
            sectionId={resolveSectionId(editingSectionId)}
            editorType={editingSectionId === 'partnershipsHeader' ? 'partnerHeader' : editingSectionId === 'partnershipsList' ? 'partnerList' : 'default'}
            section={sections.find((s) => s.sectionId === resolveSectionId(editingSectionId))}
            onSave={saveSection}
            onClose={() => setEditingSectionId(null)}
            onAddBrand={addBrand}
            onUpdateBrand={updateBrand}
            onDeleteBrand={deleteBrand}
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
              const resolvedId = resolveSectionId(sectionId);
              const section = sections.find((s) => s.sectionId === resolvedId);
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
  editorType?: 'default' | 'partnerHeader' | 'partnerList';
  section?: SectionData;
  onSave: (sectionId: string, data: Partial<SectionData>) => void;
  onClose: () => void;
  onAddBrand: (payload: { en: any; ar: any }) => Promise<boolean>;
  onUpdateBrand: (payload: { index: number; en: any; ar: any }) => Promise<boolean>;
  onDeleteBrand: (index: number) => Promise<boolean>;
}

const SectionEditor = ({
  sectionId,
  editorType = 'default',
  section,
  onSave,
  onClose,
  onAddBrand,
  onUpdateBrand,
  onDeleteBrand,
}: SectionEditorProps) => {
  const [formDataEn, setFormDataEn] = useState<any>({});
  const [formDataAr, setFormDataAr] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [partnerQuery, setPartnerQuery] = useState('');
  const [partnerPage, setPartnerPage] = useState(1);
  const [activePartnerIndex, setActivePartnerIndex] = useState<number | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartnerEn, setNewPartnerEn] = useState<any>({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
  const [newPartnerAr, setNewPartnerAr] = useState<any>({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
  const [editPartnerEn, setEditPartnerEn] = useState<any>({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
  const [editPartnerAr, setEditPartnerAr] = useState<any>({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

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

  useEffect(() => {
    setPartnerQuery('');
    setPartnerPage(1);
    setActivePartnerIndex(null);
    setIsAddingPartner(false);
    setNewPartnerEn({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
    setNewPartnerAr({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
    setEditPartnerEn({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
    setEditPartnerAr({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
    setDeleteTargetIndex(null);
  }, [sectionId]);

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
            <ImageUpload
              value={formDataEn.imageSrc || formDataAr.imageSrc || ''}
              onChange={(url) => {
                setFormDataEn((prev: any) => ({ ...prev, imageSrc: url }));
                setFormDataAr((prev: any) => ({ ...prev, imageSrc: url }));
              }}
              folder="banner"
              label="Banner image (shared)"
            />
          </>
        );
      case 'partnerships':
        if (editorType === 'partnerHeader') {
          return (
            <>
              {renderBilingualField("Subheading", "subheading")}
              {renderBilingualField("Heading", "heading")}
              {renderBilingualField("Text", "text", "textarea", 4)}
            </>
          );
        }
        const imageListEn = formDataEn.imageList || [];
        const imageListAr = formDataAr.imageList || [];
        const maxItems = Math.max(imageListEn.length, imageListAr.length);
        const allRows = Array.from({ length: maxItems }).map((_, index) => {
          const partnerEn = imageListEn[index] || { src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' };
          const partnerAr = imageListAr[index] || { src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' };
          return {
            index,
            partnerEn,
            partnerAr,
            altEn: partnerEn.alt || '',
            altAr: partnerAr.alt || '',
          };
        });
        const filteredRows = allRows.filter((row) => {
          const query = partnerQuery.trim().toLowerCase();
          if (!query) return true;
          return row.altEn.toLowerCase().includes(query) || row.altAr.toLowerCase().includes(query);
        });
        const pageSize = 10;
        const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
        const safePage = Math.min(partnerPage, totalPages);
        const pageStart = (safePage - 1) * pageSize;
        const pagedRows = filteredRows.slice(pageStart, pageStart + pageSize);
        const canCreatePartner = Boolean((newPartnerEn.src || newPartnerAr.src || '').trim()) && Boolean((newPartnerEn.category || newPartnerAr.category || '').trim());
        const canUpdatePartner = Boolean((editPartnerEn.src || editPartnerAr.src || '').trim()) && Boolean((editPartnerEn.category || editPartnerAr.category || '').trim());
        
        return (
          <>
            {editorType !== 'partnerList' && (
              <div className="cms-item-card">
                <div className="cms-item-header">
                  <h4>Partner Header</h4>
                </div>
                {renderBilingualField("Subheading", "subheading")}
                {renderBilingualField("Heading", "heading")}
                {renderBilingualField("Text", "text", "textarea", 4)}
              </div>
            )}
            <div className="cms-item-card">
              <div className="cms-item-header">
                <h4>Partner List</h4>
              </div>
              <div className="form-group">
              <div className="admin-partner-toolbar">
                <input
                  type="text"
                  value={partnerQuery}
                  onChange={(e) => {
                    setPartnerQuery(e.target.value);
                    setPartnerPage(1);
                  }}
                  placeholder="Search by alt text..."
                />
                <button
                  type="button"
                  className="hero-add-slide-button"
                  onClick={() => {
                    setIsAddingPartner((prev) => {
                      const next = !prev;
                      if (next) setActivePartnerIndex(null);
                      return next;
                    });
                  }}
                >
                  {isAddingPartner ? 'Close Add Form' : '+ Add Partner'}
                </button>
              </div>
              {isAddingPartner && (
                <div className="admin-partner-editor admin-partner-form-card">
                  <div className="admin-partner-form-header">
                    <h4>Add New Partner</h4>
                    <p>Create a partner with logo, category, and bilingual alt text.</p>
                  </div>
                  <div className="admin-partner-form-grid">
                    <div className="form-group">
                   
                      <ImageUpload
                        value={newPartnerEn.src || newPartnerAr.src || ''}
                        onChange={(url) => {
                          setNewPartnerEn((prev: any) => ({ ...prev, src: url }));
                          setNewPartnerAr((prev: any) => ({ ...prev, src: url }));
                        }}
                        placeholder="/img/brand/partner.png"
                        folder="brand"
                      label="Logo*"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={newPartnerEn.category || newPartnerAr.category || ''}
                        onChange={(e) => {
                          const category = e.target.value;
                          setNewPartnerEn((prev: any) => ({ ...prev, category }));
                          setNewPartnerAr((prev: any) => ({ ...prev, category }));
                        }}
                      >
                        <option value="">Select category</option>
                        {PARTNER_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group-bilingual admin-partner-alt-group pt-1">
                    <label>Alt Text</label>
                    <div className="bilingual-inputs">
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">English</span>
                        <input
                          type="text"
                          value={newPartnerEn.alt || ''}
                          onChange={(e) => setNewPartnerEn((prev: any) => ({ ...prev, alt: e.target.value }))}
                        />
                      </div>
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">العربية</span>
                        <input
                          type="text"
                          dir="rtl"
                          value={newPartnerAr.alt || ''}
                          onChange={(e) => setNewPartnerAr((prev: any) => ({ ...prev, alt: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="admin-partner-form-actions">
                    <button
                      type="button"
                      className="button button-primary admin-cms-btn-save"
                      disabled={!canCreatePartner}
                      onClick={() => {
                        void onAddBrand({ en: newPartnerEn, ar: newPartnerAr }).then((success) => {
                          if (!success) return;
                          setFormDataEn({
                            ...formDataEn,
                            imageList: [...imageListEn, newPartnerEn]
                          });
                          setFormDataAr({
                            ...formDataAr,
                            imageList: [...imageListAr, newPartnerAr]
                          });
                          setPartnerPage(Math.max(1, Math.ceil((maxItems + 1) / pageSize)));
                          setActivePartnerIndex(maxItems);
                          setIsAddingPartner(false);
                          setNewPartnerEn({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
                          setNewPartnerAr({ src: '', width: 200, height: 120, alt: '', category: '', loading: 'lazy' });
                        });
                      }}
                    >
                      Create Partner
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-edit"
                      onClick={() => setIsAddingPartner(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {activePartnerIndex !== null && (
                <div className="admin-partner-editor admin-partner-form-card">
                  <div className="admin-partner-form-header">
                    <h4>{`Edit Partner #${activePartnerIndex + 1}`}</h4>
                    <p>Update partner logo, category, and bilingual alt text.</p>
                  </div>
                  <div className="admin-partner-form-grid">
                    <div className="form-group">
                  
                      <ImageUpload
                        value={editPartnerEn.src || editPartnerAr.src || ''}
                        onChange={(url) => {
                          setEditPartnerEn((prev: any) => ({ ...prev, src: url }));
                          setEditPartnerAr((prev: any) => ({ ...prev, src: url }));
                        }}
                        placeholder="/img/brand/partner.png"
                        folder="brand"
                        label="Logo*"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={editPartnerEn.category || editPartnerAr.category || ''}
                        onChange={(e) => {
                          const category = e.target.value;
                          setEditPartnerEn((prev: any) => ({ ...prev, category }));
                          setEditPartnerAr((prev: any) => ({ ...prev, category }));
                        }}
                      >
                        <option value="">Select category</option>
                        {PARTNER_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group-bilingual admin-partner-alt-group pt-1">
                    <label>Alt Text</label>
                    <div className="bilingual-inputs">
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">English</span>
                        <input
                          type="text"
                          value={editPartnerEn.alt || ''}
                          onChange={(e) => setEditPartnerEn((prev: any) => ({ ...prev, alt: e.target.value }))}
                        />
                      </div>
                      <div className="bilingual-input-group">
                        <span className="bilingual-label">العربية</span>
                        <input
                          type="text"
                          dir="rtl"
                          value={editPartnerAr.alt || ''}
                          onChange={(e) => setEditPartnerAr((prev: any) => ({ ...prev, alt: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="admin-partner-form-actions">
                    <button
                      type="button"
                      className="button button-primary admin-cms-btn-save"
                      disabled={!canUpdatePartner}
                      onClick={() => {
                        if (activePartnerIndex === null) return;
                        void onUpdateBrand({ index: activePartnerIndex, en: editPartnerEn, ar: editPartnerAr }).then((success) => {
                          if (!success) return;
                          const newEn = [...imageListEn];
                          const newAr = [...imageListAr];
                          newEn[activePartnerIndex] = editPartnerEn;
                          newAr[activePartnerIndex] = editPartnerAr;
                          setFormDataEn({ ...formDataEn, imageList: newEn });
                          setFormDataAr({ ...formDataAr, imageList: newAr });
                          setActivePartnerIndex(null);
                        });
                      }}
                    >
                      Update Partner
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-edit"
                      onClick={() => setActivePartnerIndex(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div className="admin-table-wrapper admin-partner-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Logo</th>
                      <th>Alt (EN)</th>
                      <th>Alt (AR)</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="admin-table-empty">No partners match your search.</td>
                      </tr>
                    ) : (
                      pagedRows.map(({ index, partnerEn, partnerAr, altEn, altAr }) => {
                        const isEditing = activePartnerIndex === index;
                        return (
                          <tr key={index} className={isEditing ? 'admin-table-row-active' : ''}>
                            <td>{index + 1}</td>
                            <td>
                              {partnerEn.src || partnerAr.src ? (
                                <img
                                  src={partnerEn.src || partnerAr.src}
                                  alt={partnerEn.alt || partnerAr.alt || `Partner ${index + 1}`}
                                  className="admin-partner-logo-thumb"
                                />
                              ) : (
                                'No image'
                              )}
                            </td>
                            <td>{altEn || '—'}</td>
                            <td className="admin-td-ar">{altAr || '—'}</td>
                            <td>{partnerEn.category || partnerAr.category || '—'}</td>
                            <td>
                              <div className="admin-table-actions">
                                <button
                                  type="button"
                                  className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                                  onClick={() => {
                                    if (isEditing) {
                                      setActivePartnerIndex(null);
                                      return;
                                    }
                                    setEditPartnerEn({ ...partnerEn });
                                    setEditPartnerAr({ ...partnerAr });
                                    setActivePartnerIndex(index);
                                    setIsAddingPartner(false);
                                  }}
                                >
                                  {isEditing ? 'Close' : 'Edit'}
                                </button>
                                {maxItems > 1 && (
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn-delete"
                                    onClick={() => {
                                      setDeleteTargetIndex(index);
                                    }}
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="admin-partner-pagination">
                <button
                  type="button"
                  className="admin-btn admin-btn-edit"
                  disabled={safePage <= 1}
                  onClick={() => setPartnerPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </button>
                <span>{`Page ${safePage} of ${totalPages}`}</span>
                <button
                  type="button"
                  className="admin-btn admin-btn-edit"
                  disabled={safePage >= totalPages}
                  onClick={() => setPartnerPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </button>
              </div>
              {deleteTargetIndex !== null && (
                <div className="admin-modal-backdrop">
                  <div className="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="delete-partner-title">
                    <h4 id="delete-partner-title">Delete partner?</h4>
                    <p>{`Are you sure you want to delete partner #${deleteTargetIndex + 1}? This action cannot be undone.`}</p>
                    <div className="admin-modal-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-edit"
                        onClick={() => setDeleteTargetIndex(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-delete"
                        onClick={() => {
                          const target = deleteTargetIndex;
                          if (target === null) return;
                          void onDeleteBrand(target).then((success) => {
                            if (!success) return;
                            setFormDataEn({ ...formDataEn, imageList: imageListEn.filter((_: any, i: number) => i !== target) });
                            setFormDataAr({ ...formDataAr, imageList: imageListAr.filter((_: any, i: number) => i !== target) });
                            if (activePartnerIndex === target) setActivePartnerIndex(null);
                            setDeleteTargetIndex(null);
                          });
                        }}
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
        {editorType !== 'partnerList' && (
          <div className="form-actions">
            <button type="submit" className="button button-primary admin-cms-btn-save" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="admin-btn admin-btn-edit" onClick={onClose}>Cancel</button>
          </div>
        )}
      </form>
    </>
  );
};

export default PartnershipsPageCMS;
