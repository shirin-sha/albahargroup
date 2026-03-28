'use client';

import { useEffect, useState, useRef } from 'react';
import { Service } from '@/libs/models/service';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';

type ServiceSection = 'businesses' | 'capabilities';

interface ServicesManagerProps {
  section: ServiceSection;
}

const ServicesManager = ({ section }: ServicesManagerProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    section,
    slug: '',
    detailTitle: '',
    detailTitleAr: '',
    icon: '',
    description: '',
    descriptionAr: '',
    image: '',
    content: '',
    contentAr: '',
    enabled: true,
  });

  const svgInputRef = useRef<HTMLInputElement>(null);

  const sectionTitle = section === 'businesses' ? 'Businesses' : 'Capabilities';
  const singular = section === 'businesses' ? 'Business' : 'Capability';

  const headingFieldHelp =
    section === 'capabilities'
      ? 'Main name for this capability: home page services accordion, capability detail page, and sidebar lists.'
      : 'Main name for this business: home testimonial slider, business service page, and sidebar lists.';

  const headingPlaceholderEn =
    section === 'capabilities' ? 'e.g. Human Capital' : 'e.g. Consumer Goods';

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
      alert('Please select an SVG file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, icon: reader.result as string }));
    };
    reader.readAsText(file);
    if (svgInputRef.current) svgInputRef.current.value = '';
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const fetchServices = async () => {
    try {
      const res = await fetch(`/api/services?section=${section}`);
      const result = await res.json();
      if (result.success) {
        setServices(result.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const serviceId = editingService?._id
        ? String(editingService._id)
        : editingService?.id
          ? String(editingService.id)
          : null;
      const url = serviceId ? `/api/services/${serviceId}` : '/api/services';
      const method = serviceId ? 'PUT' : 'POST';

      const dt = (formData.detailTitle || '').trim();
      const dta = (formData.detailTitleAr || '').trim();
      const slugPart = (formData.slug || '').trim();
      const payload = {
        ...formData,
        section,
        title: dt || slugPart.replace(/-/g, ' ') || 'Untitled',
        titleAr: dta,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        await fetchServices();
        resetForm();
        setIsAdding(false);
      } else {
        alert(result.error || `Failed to save ${singular.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert(`Failed to save ${singular.toLowerCase()}`);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      section,
      slug: service.slug || '',
      detailTitle: service.detailTitle || '',
      detailTitleAr: service.detailTitleAr || '',
      icon: service.icon || '',
      description: service.description || '',
      descriptionAr: service.descriptionAr || '',
      image: service.image || '',
      content: service.content || '',
      contentAr: service.contentAr || '',
      enabled: service.enabled !== undefined ? service.enabled : true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${singular.toLowerCase()}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        await fetchServices();
      } else {
        alert(result.error || `Failed to delete ${singular.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert(`Failed to delete ${singular.toLowerCase()}`);
    }
  };

  const resetForm = () => {
    setFormData({
      section,
      slug: '',
      detailTitle: '',
      detailTitleAr: '',
      icon: '',
      description: '',
      descriptionAr: '',
      image: '',
      content: '',
      contentAr: '',
      enabled: true,
    });
    setEditingService(null);
    setIsAdding(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>{sectionTitle} Management</h1>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
        >
          + Add New {singular}
        </button>
      </div>

      {(editingService || isAdding) && (
        <div className="admin-edit-panel" style={{ marginBottom: '30px' }}>
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{editingService ? `Editing ${singular}` : `Add New ${singular}`}</strong>
              <span>{editingService ? `Editing: ${editingService.detailTitle || editingService.title}` : `Create a new ${singular.toLowerCase()}`}</span>
            </div>
            <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>✕ Close</button>
          </div>
          <form onSubmit={handleSubmit} className="admin-cms-form">
            <div className="form-group">
              <label>Slug (URL)</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. consumer-goods"
              />
              <small>Shared URL for both languages</small>
            </div>

            <div className="form-group-bilingual">
              <label>Heading *</label>
              <small className="block" style={{ marginBottom: '8px', color: '#6b7280' }}>
                {headingFieldHelp}
              </small>
              <div className="bilingual-inputs">
                <div className="bilingual-input-group">
                  <span className="bilingual-label">English</span>
                  <input
                    type="text"
                    value={formData.detailTitle || ''}
                    onChange={(e) => setFormData({ ...formData, detailTitle: e.target.value })}
                    placeholder={headingPlaceholderEn}
                    required
                  />
                </div>
                <div className="bilingual-input-group">
                  <span className="bilingual-label">العربية</span>
                  <input
                    type="text"
                    value={formData.detailTitleAr || ''}
                    onChange={(e) => setFormData({ ...formData, detailTitleAr: e.target.value })}
                    dir="rtl"
                    placeholder="العنوان التفصيلي"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Icon (SVG)</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <button
                  type="button"
                  className="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => svgInputRef.current?.click()}
                >
                  Upload SVG File
                </button>
                {formData.icon && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-delete"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => setFormData((prev) => ({ ...prev, icon: '' }))}
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                ref={svgInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleSvgUpload}
                style={{ display: 'none' }}
              />
              <textarea
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder='Or paste SVG code directly, e.g. <svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
                rows={4}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
              {formData.icon && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Preview:</span>
                  <span
                    style={{ display: 'inline-flex', width: '40px', height: '40px', color: '#374151' }}
                    dangerouslySetInnerHTML={{ __html: formData.icon }}
                  />
                </div>
              )}
            </div>

            <div className="form-group-bilingual">
              <label>Description</label>
              <div className="bilingual-inputs">
                <div className="bilingual-input-group">
                  <span className="bilingual-label">English</span>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description shown in the services accordion and cards"
                    rows={4}
                  />
                </div>
                <div className="bilingual-input-group">
                  <span className="bilingual-label">العربية</span>
                  <textarea
                    value={formData.descriptionAr || ''}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder="وصف قصير"
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              placeholder="/img/service/s1.jpg"
              folder="service"
              required
              label="Image"
            />

            <div className="form-group-bilingual">
              <label>Detail Content</label>
              <div className="bilingual-inputs">
                <div className="bilingual-input-group">
                  <span className="bilingual-label">English</span>
                  <RichTextEditor
                    value={formData.content || ''}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    placeholder="Optional rich content for the service detail page"
                  />
                </div>
                <div className="bilingual-input-group">
                  <span className="bilingual-label">العربية</span>
                  <RichTextEditor
                    value={formData.contentAr || ''}
                    onChange={(value) => setFormData({ ...formData, contentAr: value })}
                    placeholder="محتوى الصفحة بالعربية"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                />
                {' '}Published
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                {editingService ? `Update ${singular}` : `Create ${singular}`}
              </button>
              <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Heading (EN)</th>
              <th>Heading (AR)</th>
              <th>Slug</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  No {sectionTitle.toLowerCase()} found. Click &ldquo;Add New {singular}&rdquo; to create one.
                </td>
              </tr>
            ) : (
              services.map((service) => {
                const serviceId = (service as any)._id ? String((service as any)._id) : service.id ? String(service.id) : null;
                const editingServiceId = (editingService as any)?._id
                  ? String((editingService as any)._id)
                  : editingService?.id
                    ? String(editingService.id)
                    : null;
                const isEditing = serviceId === editingServiceId;

                return (
                  <tr key={(service as any)._id || service.id} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td><strong>{service.detailTitle || service.title}</strong></td>
                    <td dir="rtl" style={{ maxWidth: '220px' }}>{service.detailTitleAr || service.titleAr || '—'}</td>
                    <td>{service.slug}</td>
                    <td>{service.image}</td>
                    <td>
                      <span className={`admin-badge ${service.enabled !== false ? 'published' : 'draft'}`}>
                        {service.enabled !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          onClick={() => isEditing ? resetForm() : handleEdit(service)}
                          className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              if (serviceId) handleDelete(serviceId);
                            }}
                            className="admin-btn admin-btn-delete"
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
    </div>
  );
};

export default ServicesManager;
