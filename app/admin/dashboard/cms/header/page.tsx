'use client';

import { useState, useEffect } from 'react';
import { Menu } from '@/libs/models/menu';

const HeaderMenuCMS = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/menu');
      const result = await res.json();
      if (result.success) {
        setMenus(result.data);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replaceAll: true, menus }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Menu saved successfully!');
        await fetchMenus();
      } else {
        alert(result.error || 'Failed to save menu');
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Failed to save menu');
    }
  };

  const handleAddMenu = () => {
    const newMenu: Menu = {
      title: '',
      titleAr: '',
      path: '/',
      order: menus.length + 1,
      enabled: true,
    };
    setMenus([...menus, newMenu]);
    setEditingMenu(newMenu);
    setShowForm(true);
  };

  const handleEditMenu = (menu: Menu, index: number) => {
    setEditingMenu({ ...menu, _index: index } as any);
    setShowForm(true);
  };

  const handleDeleteMenu = (index: number) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      const newMenus = menus.filter((_, i) => i !== index);
      // Reorder
      newMenus.forEach((menu, i) => {
        menu.order = i + 1;
      });
      setMenus(newMenus);
    }
  };

  const handleSaveMenu = (updatedMenu: Menu) => {
    const index = (editingMenu as any)?._index;
    if (index !== undefined) {
      const newMenus = [...menus];
      delete (updatedMenu as any)._index;
      newMenus[index] = updatedMenu;
      setMenus(newMenus);
    }
    setShowForm(false);
    setEditingMenu(null);
  };

  const moveMenu = (index: number, direction: 'up' | 'down') => {
    const newMenus = [...menus];
    if (direction === 'up' && index > 0) {
      [newMenus[index - 1], newMenus[index]] = [newMenus[index], newMenus[index - 1]];
      newMenus[index - 1].order = index;
      newMenus[index].order = index + 1;
    } else if (direction === 'down' && index < newMenus.length - 1) {
      [newMenus[index], newMenus[index + 1]] = [newMenus[index + 1], newMenus[index]];
      newMenus[index].order = index + 1;
      newMenus[index + 1].order = index + 2;
    }
    setMenus(newMenus);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Header Menu CMS</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="button button-primary"
            onClick={handleAddMenu}
          >
            + Add Menu Item
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={handleSaveAll}
          >
            Save All
          </button>
        </div>
      </div>

      {showForm && editingMenu && (
        <MenuEditor
          menu={editingMenu}
          onSave={handleSaveMenu}
          onCancel={() => {
            setShowForm(false);
            setEditingMenu(null);
          }}
        />
      )}

      <div className="admin-cms-sections">
        {menus.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No menu items found. Click "Add Menu Item" to create one.
          </div>
        ) : (
          menus.map((menu, index) => (
            <div key={index} className="admin-cms-section-card" style={{ marginBottom: '15px' }}>
              <div className="admin-cms-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{menu.title}</h3>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{menu.path}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveMenu(index, 'up')}
                      className="button"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      ↑
                    </button>
                  )}
                  {index < menus.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveMenu(index, 'down')}
                      className="button"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      ↓
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditMenu(menu, index)}
                    className="button"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMenu(index)}
                    className="button"
                    style={{ fontSize: '12px', padding: '6px 12px', background: '#ef4444', color: 'white' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface MenuEditorProps {
  menu: Menu;
  onSave: (menu: Menu) => void;
  onCancel: () => void;
}

const MenuEditor = ({ menu, onSave, onCancel }: MenuEditorProps) => {
  const [formData, setFormData] = useState<Menu>({ ...menu });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.resolve(onSave(formData));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-cms-form-container" style={{ marginBottom: '30px' }}>
      <div className="admin-cms-section-card">
        <div className="admin-cms-section-header">
          <h3>Edit Menu Item</h3>
          <button type="button" className="admin-cms-toggle" onClick={onCancel}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="admin-cms-form">
          <div className="form-group-bilingual">
            <label>Title *</label>
            <div className="bilingual-inputs">
              <div className="bilingual-input-group">
                <span className="bilingual-label">English</span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="bilingual-input-group">
                <span className="bilingual-label">العربية</span>
                <input
                  type="text"
                  value={formData.titleAr || ''}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Path *</label>
            <input
              type="text"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              placeholder="/about-us"
              required
            />
          </div>

          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              min={1}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.enabled !== false}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              {' '}Enabled
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onCancel} className="button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeaderMenuCMS;
