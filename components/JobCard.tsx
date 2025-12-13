"use client";

import { JobListing } from "@/data/sections/careerData";
import Icons from "./Icons";
import { useState } from "react";

interface JobCardProps {
    job: JobListing;
}

const JobCard = ({ job }: JobCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="job-card radius18">
            <div className="job-card-header">
                <div className="job-title-section">
                    <h3 className="heading text-24 fw-700">{job.title}</h3>
                    <div className="job-meta">
                        <span className="job-meta-item">
                            <Icons.Location />
                            <span className="text text-16">{job.location}</span>
                        </span>
                        <span className="job-meta-item">
                            <Icons.Calendar />
                            <span className="text text-16">{job.department}</span>
                        </span>
                        <span className="job-meta-item">
                            <span className="job-type-badge">{job.type}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="job-card-body">
                <p className="text text-16 job-description">{job.description}</p>

                {isExpanded && (
                    <div className="job-details">
                        <div className="job-requirements">
                            <h4 className="heading text-18 fw-600">Requirements:</h4>
                            <ul className="requirements-list">
                                {job.requirements.map((req, index) => (
                                    <li key={index} className="text text-16">{req}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="job-posted-date">
                            <span className="text text-14">Posted: {job.postedDate}</span>
                        </div>
                    </div>
                )}

                <button
                    className="job-toggle-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Show less" : "Show more"}
                >
                    <span className="text text-16 fw-600">
                        {isExpanded ? "Show Less" : "View Details"}
                    </span>
                    <span className={`toggle-icon ${isExpanded ? "expanded" : ""}`}>
                        <Icons.ChevronDown />
                    </span>
                </button>
            </div>

            <div className="job-card-footer">
                <a
                    href={`/contact-us?subject=Application for ${job.title}`}
                    className="job-apply-btn"
                >
                    <span className="text text-16 fw-600">Apply Now</span>
                    <Icons.ArrowLongRight />
                </a>
            </div>
        </div>
    );
};

export default JobCard;





