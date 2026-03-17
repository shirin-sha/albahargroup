'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/libs/models/job';
import BilingualField from '@/components/admin/BilingualField';

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    titleAr: '',
    department: '',
    departmentAr: '',
    location: '',
    locationAr: '',
    type: '',
    description: '',
    descriptionAr: '',
    requirements: [],
    requirementsAr: [],
    postedDate: '',
    enabled: true,
  });
  const [requirementInput, setRequirementInput] = useState('');
  const [requirementInputAr, setRequirementInputAr] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const result = await res.json();
      if (result.success) {
        setJobs(result.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobId = editingJob?._id ? String(editingJob._id) : editingJob?.id ? String(editingJob.id) : null;
      const url = jobId ? `/api/jobs/${jobId}` : '/api/jobs';
      const method = jobId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        await fetchJobs();
        resetForm();
        setIsAdding(false);
      } else {
        alert(result.error || 'Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      titleAr: job.titleAr || '',
      department: job.department || '',
      departmentAr: job.departmentAr || '',
      location: job.location || '',
      locationAr: job.locationAr || '',
      type: job.type || '',
      description: job.description || '',
      descriptionAr: job.descriptionAr || '',
      requirements: job.requirements || [],
      requirementsAr: job.requirementsAr || [],
      postedDate: job.postedDate || '',
      enabled: job.enabled !== undefined ? job.enabled : true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        await fetchJobs();
      } else {
        alert(result.error || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      department: '',
      departmentAr: '',
      location: '',
      locationAr: '',
      type: '',
      description: '',
      descriptionAr: '',
      requirements: [],
      requirementsAr: [],
      postedDate: '',
      enabled: true,
    });
    setEditingJob(null);
    setIsAdding(false);
    setRequirementInput('');
    setRequirementInputAr('');
  };

  const addRequirement = () => {
    const en = requirementInput.trim();
    const ar = requirementInputAr.trim();
    if (!en && !ar) return;

    setFormData({
      ...formData,
      requirements: [...(formData.requirements || []), en],
      requirementsAr: [...(formData.requirementsAr || []), ar],
    });
    setRequirementInput('');
    setRequirementInputAr('');
  };

  const removeRequirement = (req: string) => {
    const index = (formData.requirements || []).indexOf(req);
    setFormData({
      ...formData,
      requirements: (formData.requirements || []).filter((_, i) => i !== index),
      requirementsAr: (formData.requirementsAr || []).filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Jobs Management</h1>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
        >
          + Add New Job
        </button>
      </div>

      {(editingJob || isAdding) && (
        <div className="admin-edit-panel" style={{ marginBottom: '30px' }}>
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{editingJob ? 'Editing Job' : 'Add New Job'}</strong>
              <span>{editingJob ? `Editing: ${editingJob.title}` : 'Create a new job listing'}</span>
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
              label="Department"
              enValue={formData.department || ''}
              arValue={formData.departmentAr || ''}
              onEnChange={(value) => setFormData({ ...formData, department: value })}
              onArChange={(value) => setFormData({ ...formData, departmentAr: value })}
              type="text"
              required
            />

            <BilingualField
              label="Location"
              enValue={formData.location || ''}
              arValue={formData.locationAr || ''}
              onEnChange={(value) => setFormData({ ...formData, location: value })}
              onArChange={(value) => setFormData({ ...formData, locationAr: value })}
              type="text"
              required
            />

            <div className="form-group">
              <label>Type *</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <BilingualField
              label="Description"
              enValue={formData.description || ''}
              arValue={formData.descriptionAr || ''}
              onEnChange={(value) => setFormData({ ...formData, description: value })}
              onArChange={(value) => setFormData({ ...formData, descriptionAr: value })}
              type="textarea"
              rows={4}
              required
            />

            <div className="form-group-bilingual">
              <label>Requirements</label>
              <div className="bilingual-inputs">
                <div className="bilingual-input-group">
                  <span className="bilingual-label">English</span>
                  <div className="admin-tag-input-row">
                    <input
                      type="text"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRequirement();
                        }
                      }}
                      placeholder="Add requirement and press Enter"
                    />
                  </div>
                </div>
                <div className="bilingual-input-group">
                  <span className="bilingual-label">العربية</span>
                  <div className="admin-tag-input-row">
                    <input
                      type="text"
                      value={requirementInputAr}
                      onChange={(e) => setRequirementInputAr(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRequirement();
                        }
                      }}
                      placeholder="أضف متطلبًا واضغط إدخال"
                      dir="rtl"
                    />
                    <button type="button" onClick={addRequirement} className="admin-btn admin-btn-edit">Add</button>
                  </div>
                </div>
              </div>
              <div className="admin-tag-list">
                {(formData.requirements || []).map((req, index) => (
                  <span key={index} className="admin-tag">
                    {req}
                    <button type="button" onClick={() => removeRequirement(req)} className="admin-tag-remove">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Posted Date</label>
              <input
                type="date"
                value={formData.postedDate || ''}
                onChange={(e) => setFormData({ ...formData, postedDate: e.target.value })}
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
                {editingJob ? 'Update Job' : 'Create Job'}
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
              <th>Department</th>
              <th>Location</th>
              <th>Type</th>
              <th>Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-table-empty">
                  No jobs found. Click &ldquo;Add New Job&rdquo; to create one.
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const jobId = job._id ? String(job._id) : job.id ? String(job.id) : null;
                const editingJobId = editingJob?._id ? String(editingJob._id) : editingJob?.id ? String(editingJob.id) : null;
                const isEditing = jobId === editingJobId;

                return (
                  <tr key={job._id || job.id} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td><strong>{job.title}</strong></td>
                    <td>{job.department}</td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td>{job.postedDate || 'N/A'}</td>
                    <td>
                      <span className={`admin-badge ${job.enabled !== false ? 'published' : 'draft'}`}>
                        {job.enabled !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          onClick={() => isEditing ? resetForm() : handleEdit(job)}
                          className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              if (jobId) handleDelete(jobId);
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

export default JobsPage;

