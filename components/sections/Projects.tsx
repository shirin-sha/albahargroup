'use client';

import { useState, useMemo } from 'react';
import '@/styles/project.css';
import ProjectList from "@/data/projects.json";
import CardProject from "../CardProject";
import { SectionProjectsType } from '@/types/sectionPorject';

import Pagination from "../Pagination";
import NotFoundMsg from "../NotFoundMsg";

const ITEMS_PER_PAGE = 12;

const Projects = ({
    wrapperCls,
    container
}: SectionProjectsType) => {
    const [currentPage, setCurrentPage] = useState(1);
    const projectList = ProjectList;

    const totalPages = Math.ceil(projectList.length / ITEMS_PER_PAGE);

    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return projectList.slice(startIndex, endIndex);
    }, [currentPage, projectList]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if(projectList.length == 0) {
        return <NotFoundMsg message="No projects found!" />
    }

    return (
        <div className={`page-projects ${wrapperCls}`}>
            <div className={container}>
                <div className="grid grid-cols-12 sm:gap-1 product-grid">
                    {paginatedProjects.map((project, index) => (                        
                        <div 
                            className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3" data-aos="fade-up" 
                            data-aos-delay={`${(index % ITEMS_PER_PAGE) + 1}00`} 
                            key={`project-list-${project.id || index}`}
                        >
                            <CardProject data={project} />
                        </div>
                    ))}
                </div>
                
                {totalPages > 1 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    )
}

export default Projects;