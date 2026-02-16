'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/libs/models/project';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    category: '',
    categoryAr: '',
    client: '',
    owner: '',
    starting_date: '',
    ending_date: '',
    website: '',
    content: '',
    contentAr: '',
    image: '',
    enabled: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const result = await res.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectId = editingProject?._id ? String(editingProject._id) : editingProject?.id ? String(editingProject.id) : null;
      const url = projectId 
        ? `/api/projects/${projectId}`
        : '/api/projects';
      const method = projectId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      if (result.success) {
        await fetchProjects();
        resetForm();
      } else {
        alert(result.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      titleAr: project.titleAr || '',
      description: project.description || '',
      descriptionAr: project.descriptionAr || '',
      category: project.category || '',
      categoryAr: project.categoryAr || '',
      client: project.client || '',
      owner: project.owner || '',
      starting_date: project.starting_date ? (typeof project.starting_date === 'string' ? project.starting_date : new Date(project.starting_date).toISOString().split('T')[0]) : '',
      ending_date: project.ending_date ? (typeof project.ending_date === 'string' ? project.ending_date : new Date(project.ending_date).toISOString().split('T')[0]) : '',
      website: project.website || '',
      content: project.content || '',
      contentAr: project.contentAr || '',
      image: project.image || '',
      enabled: project.enabled !== undefined ? project.enabled : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        await fetchProjects();
      } else {
        alert(result.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      category: '',
      categoryAr: '',
      client: '',
      owner: '',
      starting_date: '',
      ending_date: '',
      website: '',
      content: '',
      contentAr: '',
      image: '',
      enabled: true,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Projects Management</h1>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add New Project
        </button>
      </div>

      {showForm && (
        <div className="admin-cms-form-container" style={{ marginBottom: '30px' }}>
          <div className="admin-cms-section-card">
            <div className="admin-cms-section-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button
                type="button"
                className="admin-cms-toggle"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-cms-form">
              <div className="form-group">
                <label>Title (English) *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Title (Arabic)</label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description (English) *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (Arabic)</label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Category (English) *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category (Arabic)</label>
                <input
                  type="text"
                  value={formData.categoryAr}
                  onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Client</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Owner</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Starting Date</label>
                <input
                  type="date"
                  value={formData.starting_date}
                  onChange={(e) => setFormData({ ...formData, starting_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Ending Date</label>
                <input
                  type="date"
                  value={formData.ending_date}
                  onChange={(e) => setFormData({ ...formData, ending_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Content (English)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                />
              </div>

              <div className="form-group">
                <label>Content (Arabic)</label>
                <textarea
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  rows={10}
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/img/project/project-1.jpg"
                  required
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
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button type="button" onClick={resetForm} className="button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-posts-list">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No projects found. Click "Add New Project" to create one.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id || project.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <strong>{project.title}</strong>
                  </td>
                  <td style={{ padding: '12px' }}>{project.category}</td>
                  <td style={{ padding: '12px' }}>
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: project.enabled !== false ? '#d1fae5' : '#fee2e2',
                        color: project.enabled !== false ? '#065f46' : '#991b1b',
                      }}
                    >
                      {project.enabled !== false ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="button"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const projectId = project._id ? String(project._id) : project.id ? String(project.id) : null;
                          if (projectId) handleDelete(projectId);
                        }}
                        className="button"
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: 'white',
                        }}
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

export default ProjectsPage;
