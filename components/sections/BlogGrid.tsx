'use client';

import { useState, useMemo } from 'react';
import '@/styles/blog.css';
import { AuthorType } from '@/types/author';
import Posts from "@/data/posts.json";
import Authors from '@/data/author.json';
import CardBlog from "../CardBlog";
import NotFoundMsg from "../NotFoundMsg";
import Pagination from "../Pagination";

const ITEMS_PER_PAGE = 9;

const BlogGrid = ({ cls }: { cls: string }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const posts = Posts;

    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return posts.slice(startIndex, endIndex);
    }, [currentPage, posts]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if(posts.length == 0) {
        return <NotFoundMsg message="No posts found!" />
    }

    return (
        <div className={`page-blog ${cls}`}>
            <div className="container">
                <div className="grid grid-cols-12 md:gap-1 product-grid">
                    {paginatedPosts.map((article) => {
                        const author: AuthorType | undefined = Authors.find((author: AuthorType) => author.id === article.authorId);
                        return (                            
                            <div
                                className="col-span-12 md:col-span-6 lg:col-span-4"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                key={`article-${article.id}`}
                            >
                                <CardBlog 
                                    article={article}
                                    width={1000}
                                    height={707}
                                    alt="Article image"
                                    author={author}
                                    showDate={true}
                                />
                            </div>
                    )})}
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

export default BlogGrid;