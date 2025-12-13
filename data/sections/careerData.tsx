import { SectionProps } from "@/types/sectionProps";
import Icons from "@/components/Icons";

export const CareerData: SectionProps = {
    wrapperCls: "section-padding",
    container: "container",
    subheading: "Join Our Team",
    heading: "Build Your Career with Al-Bahar Group",
    text: "Join a dynamic team where your talents are valued, your growth is supported, and your contributions make a real impact. We're looking for passionate professionals who share our commitment to excellence.",
};


export interface JobListing {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string; // Full-time, Part-time, Contract
    description: string;
    requirements: string[];
    postedDate: string;
}

export const JobListingsData: JobListing[] = [
    {
        id: "1",
        title: "Senior Marketing Manager",
        department: "Marketing",
        location: "Kuwait",
        type: "Full-time",
        description: "We are seeking an experienced Marketing Manager to lead our marketing initiatives and drive brand growth across multiple business verticals.",
        requirements: [
            "Bachelor's degree in Marketing or related field",
            "5+ years of marketing management experience",
            "Strong analytical and strategic thinking skills",
            "Excellent communication and leadership abilities"
        ],
        postedDate: "15/01/24"
    },
    {
        id: "2",
        title: "Business Development Executive",
        department: "Business Development",
        location: "Kuwait",
        type: "Full-time",
        description: "Join our dynamic business development team to identify new opportunities and build strategic partnerships.",
        requirements: [
            "Bachelor's degree in Business or related field",
            "3+ years of business development experience",
            "Strong negotiation and relationship-building skills",
            "Proven track record in sales"
        ],
        postedDate: "12/01/24"
    },
    {
        id: "3",
        title: "IT Support Specialist",
        department: "Information Technology",
        location: "Kuwait",
        type: "Full-time",
        description: "We're looking for an IT Support Specialist to provide technical assistance and maintain our IT infrastructure.",
        requirements: [
            "Bachelor's degree in IT or Computer Science",
            "2+ years of IT support experience",
            "Knowledge of network administration",
            "Strong problem-solving skills"
        ],
        postedDate: "10/01/24"
    },
    {
        id: "4",
        title: "Financial Analyst",
        department: "Finance",
        location: "Kuwait",
        type: "Full-time",
        description: "Seeking a Financial Analyst to support financial planning, analysis, and reporting activities.",
        requirements: [
            "Bachelor's degree in Finance or Accounting",
            "3+ years of financial analysis experience",
            "Proficiency in financial modeling",
            "Strong analytical skills"
        ],
        postedDate: "08/01/24"
    },
    {
        id: "5",
        title: "HR Coordinator",
        department: "Human Resources",
        location: "Kuwait",
        type: "Full-time",
        description: "Join our HR team to support recruitment, employee relations, and organizational development initiatives.",
        requirements: [
            "Bachelor's degree in HR or related field",
            "2+ years of HR experience",
            "Excellent interpersonal skills",
            "Knowledge of HR best practices"
        ],
        postedDate: "05/01/24"
    },
    {
        id: "6",
        title: "Sales Representative",
        department: "Sales",
        location: "Kuwait",
        type: "Full-time",
        description: "We're hiring Sales Representatives to drive revenue growth and build strong customer relationships.",
        requirements: [
            "High school diploma or equivalent",
            "1+ years of sales experience",
            "Excellent communication skills",
            "Customer-focused mindset"
        ],
        postedDate: "03/01/24"
    },
];




