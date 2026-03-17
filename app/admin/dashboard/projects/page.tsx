'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/libs/models/project';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import BilingualField from '@/components/admin/BilingualField';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
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
        setIsAdding(false);
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
      content: project.content || '',
      contentAr: project.contentAr || '',
      image: project.image || '',
      enabled: project.enabled !== undefined ? project.enabled : true,
    });
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
      content: '',
      contentAr: '',
      image: '',
      enabled: true,
    });
    setEditingProject(null);
    setIsAdding(false);
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
            setIsAdding(true);
          }}
        >
          + Add New Project
        </button>
      </div>

      {(editingProject || isAdding) && (
        <div className="admin-edit-panel" style={{ marginBottom: '30px' }}>
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{editingProject ? 'Editing Project' : 'Add New Project'}</strong>
              <span>{editingProject ? `Editing: ${editingProject.title}` : 'Create a new project'}</span>
            </div>
            <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>✕ Close</button>
          </div>
            <form onSubmit={handleSubmit} className="admin-cms-form">
              <BilingualField
                label="Title"
                enValue={formData.title || ''}
                arValue={formData.titleAr || ''}
                onEnChange={(value) => setFormData({ ...formData, title: value })}
                onArChange={(value) => setFormData({ ...formData, titleAr: value })}
                type="text"
                required
              />

              <BilingualField
                label="Description"
                enValue={formData.description || ''}
                arValue={formData.descriptionAr || ''}
                onEnChange={(value) => setFormData({ ...formData, description: value })}
                onArChange={(value) => setFormData({ ...formData, descriptionAr: value })}
                type="richtext"
                required
              />

              <BilingualField
                label="Category"
                enValue={formData.category || ''}
                arValue={formData.categoryAr || ''}
                onEnChange={(value) => setFormData({ ...formData, category: value })}
                onArChange={(value) => setFormData({ ...formData, categoryAr: value })}
                type="text"
                required
              />

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
                  value={typeof formData.starting_date === 'string' ? formData.starting_date : (formData.starting_date ? new Date(formData.starting_date).toISOString().split('T')[0] : '')}
                  onChange={(e) => setFormData({ ...formData, starting_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Ending Date</label>
                <input
                  type="date"
                  value={typeof formData.ending_date === 'string' ? formData.ending_date : (formData.ending_date ? new Date(formData.ending_date).toISOString().split('T')[0] : '')}
                  onChange={(e) => setFormData({ ...formData, ending_date: e.target.value })}
                />
              </div>

              <BilingualField
                label="Content"
                enValue={formData.content || ''}
                arValue={formData.contentAr || ''}
                onEnChange={(value) => setFormData({ ...formData, content: value })}
                onArChange={(value) => setFormData({ ...formData, contentAr: value })}
                type="richtext"
              />

              <ImageUpload
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                placeholder="/img/project/project-1.jpg"
                folder="project"
                required
                label="Image"
              />

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
                <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>Cancel</button>
              </div>
            </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  No projects found. Click &ldquo;Add New Project&rdquo; to create one.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const projectId = project._id ? String(project._id) : project.id ? String(project.id) : null;
                const editingProjectId = editingProject?._id ? String(editingProject._id) : editingProject?.id ? String(editingProject.id) : null;
                const isEditing = projectId === editingProjectId;
                
                return (
                  <tr key={project._id || project.id} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td>
                      <div className="admin-section-thumb">
                        {project.image ? (
                          <img src={project.image} alt={project.title || "Project image"} />
                        ) : (
                          <span className="admin-section-thumb-placeholder">
                            No Image
                          </span>
                        )}
                      </div>
                    </td>
                    <td><strong>{project.title}</strong></td>
                    <td>{project.category}</td>
                    <td>{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`admin-badge ${project.enabled !== false ? 'published' : 'draft'}`}>
                        {project.enabled !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button 
                          type="button" 
                          onClick={() => isEditing ? resetForm() : handleEdit(project)} 
                          className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              if (projectId) handleDelete(projectId);
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

export default ProjectsPage;
