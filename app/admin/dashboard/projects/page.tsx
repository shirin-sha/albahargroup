'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/libs/models/project';
import ImageUpload from '@/components/admin/ImageUpload';
import BilingualField from '@/components/admin/BilingualField';
import { stripHtmlToPlain } from '@/utils/plainText';

const EMPTY_PROJECT_FORM: Partial<Project> = {
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  image: '',
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({ ...EMPTY_PROJECT_FORM });

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
      const projectId = editingProject?._id ? String(editingProject._id) : null;
      const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
      const method = projectId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          titleAr: formData.titleAr,
          description: stripHtmlToPlain(formData.description),
          descriptionAr: stripHtmlToPlain(formData.descriptionAr),
          image: formData.image,
        }),
      });

      const result = await res.json();
      if (result.success) {
        await fetchProjects();
        resetForm();
        setIsAdding(false);
      } else {
        alert(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    }
  };

  const handleEdit = (project: Project) => {
    setIsAdding(false);
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      titleAr: project.titleAr || '',
      description: stripHtmlToPlain(project.description),
      descriptionAr: stripHtmlToPlain(project.descriptionAr),
      image: project.image || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
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
        alert(result.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({ ...EMPTY_PROJECT_FORM });
    setEditingProject(null);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({ ...EMPTY_PROJECT_FORM });
    setIsAdding(true);

    setTimeout(() => {
      const panel = document.querySelector('.admin-edit-panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Image Archive Management</h1>
        <button type="button" className="button button-primary" onClick={handleAddNew}>
          + Add New Image
        </button>
      </div>

      {(editingProject || isAdding) && (
        <div className="admin-edit-panel" style={{ marginBottom: '30px' }}>
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{editingProject ? 'Edit entry' : 'Add entry'}</strong>
              <span>
                {editingProject
                  ? `Editing: ${editingProject.title || editingProject.titleAr || 'entry'}`
                  : 'Image plus title and description (English and/or Arabic)'}
              </span>
            </div>
            <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>
              ✕ Close
            </button>
          </div>
          <form
            key={editingProject ? `edit-${editingProject._id}` : 'add-new'}
            onSubmit={handleSubmit}
            className="admin-cms-form"
          >
            <BilingualField
              label="Title"
              enValue={formData.title || ''}
              arValue={formData.titleAr || ''}
              onEnChange={(value) => setFormData({ ...formData, title: value })}
              onArChange={(value) => setFormData({ ...formData, titleAr: value })}
              type="text"
            />

            <BilingualField
              label="Description"
              enValue={formData.description || ''}
              arValue={formData.descriptionAr || ''}
              onEnChange={(value) => setFormData({ ...formData, description: value })}
              onArChange={(value) => setFormData({ ...formData, descriptionAr: value })}
              type="textarea"
              rows={5}
            />

            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              placeholder="/img/project/project-1.jpg"
              folder="project"
              required
              label="Image"
            />

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                {editingProject ? 'Save changes' : 'Create'}
              </button>
              <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>
                Cancel
              </button>
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
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-table-empty">
                  No entries yet. Use &ldquo;Add New Image&rdquo; to create one.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const projectId = project._id ? String(project._id) : null;
                const editingProjectId = editingProject?._id ? String(editingProject._id) : null;
                const isEditing = projectId === editingProjectId;
                const titleLine = [project.title, project.titleAr].filter(Boolean).join(' · ') || '—';
                const descPlain =
                  stripHtmlToPlain(project.description) || stripHtmlToPlain(project.descriptionAr) || '';
                const descPreview =
                  descPlain.length > 120 ? `${descPlain.slice(0, 120)}…` : descPlain;

                return (
                  <tr key={project._id || titleLine} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td>
                      <div className="admin-section-thumb">
                        {project.image ? (
                          <img src={project.image} alt={titleLine} />
                        ) : (
                          <span className="admin-section-thumb-placeholder">No Image</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{titleLine}</strong>
                    </td>
                    <td style={{ maxWidth: 360 }}>{descPreview || '—'}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          onClick={() => (isEditing ? resetForm() : handleEdit(project))}
                          className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        {!isEditing && projectId && (
                          <button
                            type="button"
                            onClick={() => handleDelete(projectId)}
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
