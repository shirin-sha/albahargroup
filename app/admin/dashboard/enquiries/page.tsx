'use client';

import { useEffect, useState } from "react";
import type { Enquiry } from "@/libs/models/enquiry";

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch("/api/enquiries");
        const result = await res.json();
        if (result.success) {
          setEnquiries(result.data);
        }
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Contact Enquiries</h1>
        <p className="cms-page-subtitle">
          Latest messages from the contact form.
        </p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  No enquiries yet.
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => {
                const isSelected = selected && String(selected._id) === String(enquiry._id);
                return (
                  <tr
                    key={String(enquiry._id)}
                    className={isSelected ? "admin-table-row-active" : ""}
                  >
                    <td>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td>{enquiry.subject}</td>
                    <td>
                      {enquiry.created_at
                        ? new Date(enquiry.created_at).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          setSelected(isSelected ? null : enquiry)
                        }
                        title="View details"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        <span role="img" aria-label="View details">
                          👁
                        </span>
                      </button>
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
              <strong>{selected.subject}</strong>
              <span>
                {selected.name} · {selected.email} ·{" "}
                {selected.created_at
                  ? new Date(selected.created_at).toLocaleString()
                  : "—"}
              </span>
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
              <label>Message</label>
              <p
                className="text-16"
                style={{ whiteSpace: "pre-wrap", marginTop: "4px" }}
              >
                {selected.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesPage;

