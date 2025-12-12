"use client";

import "@/styles/career.css";
import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";
import JobCard from "../JobCard";
import { JobListing } from "@/data/sections/careerData";
import { useState } from "react";

interface CareerSectionProps {
    data: SectionProps;
    jobListings: JobListing[];
}

const CareerSection = ({ data, jobListings }: CareerSectionProps) => {
    const {
        wrapperCls,
        container,
        subheading,
        heading,
        text,
    } = data || {};

    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedType, setSelectedType] = useState<string>("all");

    // Get unique departments and types
    const departments = Array.from(new Set(jobListings.map(job => job.department)));
    const types = Array.from(new Set(jobListings.map(job => job.type)));

    // Filter jobs
    const filteredJobs = jobListings.filter(job => {
        const departmentMatch = selectedDepartment === "all" || job.department === selectedDepartment;
        const typeMatch = selectedType === "all" || job.type === selectedType;
        return departmentMatch && typeMatch;
    });

    return (
        <div className={`section-career ${wrapperCls}`}>
            <div className={container}>
                <div className="section-headings text-center">
                    {subheading &&
                        <Subheading
                            title={subheading}
                            cls="text-20"
                            aos="fade-up"
                        />
                    }

                    {heading &&
                        <Heading
                            title={heading}
                            cls="text-50"
                            aos="fade-up"
                        />
                    }

                    {text &&
                        <Text
                            text={text}
                            cls="text-18"
                            aos="fade-up"
                        />
                    }
                </div>

                {/* Filters */}
                <div className="career-filters" data-aos="fade-up">
                    <div className="filter-group">
                        <label className="filter-label text text-16 fw-600">Department:</label>
                        <select
                            className="filter-select"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label text text-16 fw-600">Job Type:</label>
                        <select
                            className="filter-select"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            {types.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Job Listings */}
                {filteredJobs.length > 0 ? (
                    <div className="job-listings">
                        <div className="grid grid-cols-12 gap-1">
                            {filteredJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="col-span-12 lg:col-span-6"
                                    data-aos="fade-up"
                                >
                                    <JobCard job={job} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="no-jobs text-center" data-aos="fade-up">
                        <p className="text text-18">No job openings match your filters. Please try different criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerSection;



