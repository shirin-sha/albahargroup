'use client';

import { useState, useEffect } from 'react';
import { Team } from '@/libs/models/team';
import ImageUpload from '@/components/admin/ImageUpload';

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    nameAr: '',
    designation: '',
    designationAr: '',
    image: '',
    year_of_expertise: '',
    expertise: '',
    expertiseAr: '',
    phone: '',
    email: '',
    biography: '',
    biographyAr: '',
    about: '',
    aboutAr: '',
    about_skills: '',
    about_skillsAr: '',
    social: {
      facebook: '',
      facebook_url: '',
      twitter: '',
      twitter_url: '',
      instagram: '',
      instagram_url: '',
      linkedin: '',
      linkedin_url: '',
    },
    skills: {
      project_management: 0,
      client_relationship: 0,
      soft_skill: 0,
    },
    enabled: true,
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const result = await res.json();
      if (result.success) {
        setTeams(result.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const teamId = editingTeam?._id ? String(editingTeam._id) : editingTeam?.id ? String(editingTeam.id) : null;
      const url = teamId 
        ? `/api/teams/${teamId}`
        : '/api/teams';
      const method = teamId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      if (result.success) {
        await fetchTeams();
        resetForm();
      } else {
        alert(result.error || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team member');
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || '',
      nameAr: team.nameAr || '',
      designation: team.designation || '',
      designationAr: team.designationAr || '',
      image: team.image || '',
      year_of_expertise: team.year_of_expertise || '',
      expertise: team.expertise || '',
      expertiseAr: team.expertiseAr || '',
      phone: team.phone || '',
      email: team.email || '',
      biography: team.biography || '',
      biographyAr: team.biographyAr || '',
      about: team.about || '',
      aboutAr: team.aboutAr || '',
      about_skills: team.about_skills || '',
      about_skillsAr: team.about_skillsAr || '',
      social: team.social || {
        facebook: '',
        facebook_url: '',
        twitter: '',
        twitter_url: '',
        instagram: '',
        instagram_url: '',
        linkedin: '',
        linkedin_url: '',
      },
      skills: team.skills || {
        project_management: 0,
        client_relationship: 0,
        soft_skill: 0,
      },
      enabled: team.enabled !== undefined ? team.enabled : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        await fetchTeams();
      } else {
        alert(result.error || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team member');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      designation: '',
      designationAr: '',
      image: '',
      year_of_expertise: '',
      expertise: '',
      expertiseAr: '',
      phone: '',
      email: '',
      biography: '',
      biographyAr: '',
      about: '',
      aboutAr: '',
      about_skills: '',
      about_skillsAr: '',
      social: {
        facebook: '',
        facebook_url: '',
        twitter: '',
        twitter_url: '',
        instagram: '',
        instagram_url: '',
        linkedin: '',
        linkedin_url: '',
      },
      skills: {
        project_management: 0,
        client_relationship: 0,
        soft_skill: 0,
      },
      enabled: true,
    });
    setEditingTeam(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Team Management</h1>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add New Team Member
        </button>
      </div>

      {showForm && (
        <div className="admin-cms-form-container" style={{ marginBottom: '30px' }}>
          <div className="admin-cms-section-card">
            <div className="admin-cms-section-header">
              <h3>{editingTeam ? 'Edit Team Member' : 'Add New Team Member'}</h3>
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
                <label>Name (English) *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Name (Arabic)</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Designation (English) *</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation (Arabic)</label>
                <input
                  type="text"
                  value={formData.designationAr}
                  onChange={(e) => setFormData({ ...formData, designationAr: e.target.value })}
                />
              </div>

              <ImageUpload
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                placeholder="/img/team/team1.jpg"
                folder="team"
                required
                label="Image"
              />

              <div className="form-group">
                <label>Year of Expertise</label>
                <input
                  type="text"
                  value={formData.year_of_expertise}
                  onChange={(e) => setFormData({ ...formData, year_of_expertise: e.target.value })}
                  placeholder="e.g., 15"
                />
              </div>

              <div className="form-group">
                <label>Expertise (English)</label>
                <textarea
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Expertise (Arabic)</label>
                <textarea
                  value={formData.expertiseAr}
                  onChange={(e) => setFormData({ ...formData, expertiseAr: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 202 555 0147"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-group">
                <label>Biography (English)</label>
                <textarea
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label>Biography (Arabic)</label>
                <textarea
                  value={formData.biographyAr}
                  onChange={(e) => setFormData({ ...formData, biographyAr: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label>About (English)</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>About (Arabic)</label>
                <textarea
                  value={formData.aboutAr}
                  onChange={(e) => setFormData({ ...formData, aboutAr: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>About Skills (English)</label>
                <textarea
                  value={formData.about_skills}
                  onChange={(e) => setFormData({ ...formData, about_skills: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>About Skills (Arabic)</label>
                <textarea
                  value={formData.about_skillsAr}
                  onChange={(e) => setFormData({ ...formData, about_skillsAr: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label style={{ marginBottom: '10px', display: 'block' }}>Social Media Links</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px' }}>Facebook</label>
                    <input
                      type="text"
                      value={formData.social?.facebook || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, facebook: e.target.value } })}
                      placeholder="Name"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Facebook URL</label>
                    <input
                      type="url"
                      value={formData.social?.facebook_url || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, facebook_url: e.target.value } })}
                      placeholder="https://facebook.com"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Twitter</label>
                    <input
                      type="text"
                      value={formData.social?.twitter || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })}
                      placeholder="@username"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Twitter URL</label>
                    <input
                      type="url"
                      value={formData.social?.twitter_url || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter_url: e.target.value } })}
                      placeholder="https://x.com"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Instagram</label>
                    <input
                      type="text"
                      value={formData.social?.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, instagram: e.target.value } })}
                      placeholder="@username"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Instagram URL</label>
                    <input
                      type="url"
                      value={formData.social?.instagram_url || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, instagram_url: e.target.value } })}
                      placeholder="https://instagram.com"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>LinkedIn</label>
                    <input
                      type="text"
                      value={formData.social?.linkedin || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })}
                      placeholder="Name"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.social?.linkedin_url || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin_url: e.target.value } })}
                      placeholder="https://linkedin.com"
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label style={{ marginBottom: '10px', display: 'block' }}>Skills (Percentage 0-100)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px' }}>Project Management</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.skills?.project_management || 0}
                      onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, project_management: parseInt(e.target.value) || 0 } })}
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Client Relationship</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.skills?.client_relationship || 0}
                      onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, client_relationship: parseInt(e.target.value) || 0 } })}
                      style={{ fontSize: '12px', padding: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px' }}>Soft Skill</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.skills?.soft_skill || 0}
                      onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, soft_skill: parseInt(e.target.value) || 0 } })}
                      style={{ fontSize: '12px', padding: '6px' }}
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
                  {editingTeam ? 'Update Team Member' : 'Create Team Member'}
                </button>
                <button type="button" onClick={resetForm} className="button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-table-empty">
                  No team members found. Click &ldquo;Add New Team Member&rdquo; to create one.
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team._id || team.id}>
                  <td>
                    <div className="admin-section-thumb">
                      {team.image ? (
                        <img src={team.image} alt={team.name || "Team member"} />
                      ) : (
                        <span className="admin-section-thumb-placeholder">
                          No Image
                        </span>
                      )}
                    </div>
                  </td>
                  <td><strong>{team.name}</strong></td>
                  <td>{team.designation}</td>
                  <td>
                    <span className={`admin-badge ${team.enabled !== false ? 'published' : 'draft'}`}>
                      {team.enabled !== false ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button type="button" onClick={() => handleEdit(team)} className="admin-btn admin-btn-edit">Edit</button>
                      <button
                        type="button"
                        onClick={() => {
                          const teamId = team._id ? String(team._id) : team.id ? String(team.id) : null;
                          if (teamId) handleDelete(teamId);
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

export default TeamsPage;
