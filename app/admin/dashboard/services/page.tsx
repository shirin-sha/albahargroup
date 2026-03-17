'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/libs/models/service';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';

const ServicesAdminPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    slug: '',
    detailTitle: '',
    image: '',
    content: '',
    enabled: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
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
      const serviceId = editingService?._id ? String(editingService._id) : editingService?.id ? String(editingService.id) : null;
      const url = serviceId ? `/api/services/${serviceId}` : '/api/services';
      const method = serviceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        await fetchServices();
        resetForm();
        setIsAdding(false);
      } else {
        alert(result.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      detailTitle: service.detailTitle || '',
      image: service.image || '',
      content: service.content || '',
      enabled: service.enabled !== undefined ? service.enabled : true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
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
        alert(result.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      detailTitle: '',
      image: '',
      content: '',
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
        <h1>Services Management</h1>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
        >
          + Add New Service
        </button>
      </div>

      {(editingService || isAdding) && (
        <div className="admin-edit-panel" style={{ marginBottom: '30px' }}>
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{editingService ? 'Editing Service' : 'Add New Service'}</strong>
              <span>{editingService ? `Editing: ${editingService.title}` : 'Create a new service'}</span>
            </div>
            <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>✕ Close</button>
          </div>
          <form onSubmit={handleSubmit} className="admin-cms-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Slug (URL)</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. consumer-goods"
              />
            </div>

            <div className="form-group">
              <label>Detail Title</label>
              <input
                type="text"
                value={formData.detailTitle || ''}
                onChange={(e) => setFormData({ ...formData, detailTitle: e.target.value })}
                placeholder="Displayed on details page"
              />
            </div>

            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              placeholder="/img/service/s1.jpg"
              folder="service"
              required
              label="Image"
            />

            <div className="form-group">
              <label>Detail Content</label>
              <RichTextEditor
                value={formData.content || ''}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Optional rich content for the service detail page"
              />
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
                {editingService ? 'Update Service' : 'Create Service'}
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
              <th>Title</th>
              <th>Slug</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  No services found. Click &ldquo;Add New Service&rdquo; to create one.
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
                    <td><strong>{service.title}</strong></td>
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

export default ServicesAdminPage;

