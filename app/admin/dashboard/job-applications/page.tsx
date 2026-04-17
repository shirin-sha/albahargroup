'use client';

import { useEffect, useState } from 'react';
import type { JobApplication } from '@/libs/models/jobApplication';

const JobsApplicationsPage = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<JobApplication | null>(null);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/job-applications');
      const result = await res.json();
      if (result.success) {
        setApplications(result.data);
      }
    } catch (error) {
      console.error('Error fetching job applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Job Applications</h1>
        <p className="cms-page-subtitle">View submitted job applications and open applicant CVs.</p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  No job applications yet.
                </td>
              </tr>
            ) : (
              applications.map((application) => {
                const isSelected = selected && String(selected._id) === String(application._id);
                return (
                  <tr
                    key={String(application._id)}
                    className={isSelected ? 'admin-table-row-active' : ''}
                  >
                    <td>
                      <strong>{application.applicantName}</strong>
                    </td>
                    <td>{application.jobTitle}</td>
                    <td>
                      <div>{application.email}</div>
                      <div>{application.phone}</div>
                    </td>
                    <td>
                      {application.created_at
                        ? new Date(application.created_at).toLocaleString()
                        : '—'}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          onClick={() => setSelected(isSelected ? null : application)}
                          className={`admin-btn ${isSelected ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        >
                          {isSelected ? 'Close' : 'View'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-edit-panel">
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{selected.applicantName}</strong>
              <span>{selected.jobTitle}</span>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-edit"
              onClick={() => setSelected(null)}
            >
              ✕ Close
            </button>
          </div>

          <div className="admin-cms-form">
            <div className="form-group">
              <label>Email</label>
              <p className="text-16" style={{ marginTop: '4px' }}>{selected.email}</p>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <p className="text-16" style={{ marginTop: '4px' }}>{selected.phone}</p>
            </div>

            {selected.linkedin ? (
              <div className="form-group">
                <label>LinkedIn</label>
                <a
                  href={selected.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-16"
                  style={{ marginTop: '4px', display: 'inline-block' }}
                >
                  {selected.linkedin}
                </a>
              </div>
            ) : null}

            <div className="form-group">
              <label>Message</label>
              <p className="text-16" style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                {selected.message}
              </p>
            </div>

            <div className="form-group">
              <label>CV / Resume</label>
              <a
                href={selected.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-edit"
                style={{ width: 'fit-content', marginTop: '8px', cursor: 'pointer' }}
              >
                [PDF] Open {selected.resumeOriginalName}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsApplicationsPage;
