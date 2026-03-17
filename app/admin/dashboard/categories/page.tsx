'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/libs/models/category';
import BilingualField from '@/components/admin/BilingualField';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    nameAr: '',
    enabled: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const result = await res.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryId = editingCategory?._id ? String(editingCategory._id) : editingCategory?.id ? String(editingCategory.id) : null;
      const url = categoryId 
        ? `/api/categories/${categoryId}`
        : '/api/categories';
      const method = categoryId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      if (result.success) {
        await fetchCategories();
        resetForm();
        setIsAdding(false);
      } else {
        alert(result.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      nameAr: category.nameAr || '',
      enabled: category.enabled !== undefined ? category.enabled : true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        await fetchCategories();
      } else {
        alert(result.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      enabled: true,
    });
    setEditingCategory(null);
    setIsAdding(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Categories Management</h1>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
        >
          + Add New Category
        </button>
      </div>

      {(editingCategory || isAdding) && (
        <div className="admin-edit-panel" style={{ marginBottom: '30px' }}>
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{editingCategory ? 'Editing Category' : 'Add New Category'}</strong>
              <span>{editingCategory ? `Editing: ${editingCategory.name}` : 'Create a new category'}</span>
            </div>
            <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>✕ Close</button>
          </div>
          <form onSubmit={handleSubmit} className="admin-cms-form">
            <BilingualField
              label="Name"
              enValue={formData.name || ''}
              arValue={formData.nameAr || ''}
              onEnChange={(value) => setFormData({ ...formData, name: value })}
              onArChange={(value) => setFormData({ ...formData, nameAr: value })}
              type="text"
              required
            />

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                />
                {' '}Enabled
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
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
              <th>Name (EN)</th>
              <th>Name (AR)</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  No categories found. Click &ldquo;Add New Category&rdquo; to create one.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id || category.id}>
                  <td><strong>{category.name}</strong></td>
                  <td>{category.nameAr || '-'}</td>
                  <td>{category.slug || '-'}</td>
                  <td>
                    <span className={`admin-badge ${category.enabled !== false ? 'published' : 'draft'}`}>
                      {category.enabled !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button type="button" onClick={() => handleEdit(category)} className="admin-btn admin-btn-edit">Edit</button>
                      <button
                        type="button"
                        onClick={() => {
                          const categoryId = category._id ? String(category._id) : category.id ? String(category.id) : null;
                          if (categoryId) handleDelete(categoryId);
                        }}
                        className="admin-btn admin-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
