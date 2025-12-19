'use client';

import "@/styles/pagination.css";
import Icons from "./Icons";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage <= 3) {
                // Show first 4 pages and ellipsis
                for (let i = 2; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show ellipsis and last 4 pages
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show first, ellipsis, current-1, current, current+1, ellipsis, last
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="pagination">
            <ul className="list-unstyled pagintaion-list" data-aos="fade-up">
                <li>
                    <button
                        className="pagination-link"
                        aria-disabled={currentPage === 1}
                        aria-label="Previous page link"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        <Icons.ChevronLeft />
                    </button>
                </li>

                {pageNumbers.map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <li key={`ellipsis-${index}`}>
                                <span className="pagination-ellipsis">...</span>
                            </li>
                        );
                    }

                    const pageNum = page as number;
                    return (
                        <li key={`page-${pageNum}`}>
                            <button
                                className={`pagination-link ${currentPage === pageNum ? 'active' : ''}`}
                                aria-label={`Page ${pageNum} link`}
                                aria-current={currentPage === pageNum ? 'page' : undefined}
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        </li>
                    );
                })}

                <li>
                    <button
                        className="pagination-link"
                        aria-disabled={currentPage === totalPages}
                        aria-label="Next page link"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        <Icons.ChevronRight />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination;