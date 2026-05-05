'use client';

import { useState, useMemo, useEffect } from 'react';
import '@/styles/blog.css';
import { AuthorType } from '@/types/author';
import Authors from '@/data/author.json';
import CardBlog from "../CardBlog";
import NotFoundMsg from "../NotFoundMsg";
import Pagination from "../Pagination";
import Subheading from "../Subheading";
import Heading from "../Heading";
import { Post } from '@/libs/models/post';

const ITEMS_PER_PAGE = 9;

interface BlogGridProps {
    cls?: string;
    subheading?: string;
    heading?: string;
    detailHrefBase?: string;
    locale?: 'en' | 'ar';
    showCategory?: boolean;
}

const BlogGrid = ({
    cls,
    subheading,
    heading,
    detailHrefBase = '/blogs',
    locale = 'en',
    showCategory = true,
}: BlogGridProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts?enabled=true');
                const result = await res.json();
                if (result.success) {
                    setPosts(result.data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

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

    if (loading) {
        return (
            <div className={`page-blog ${cls || ''}`}>
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        Loading posts...
                    </div>
                </div>
            </div>
        );
    }

    if(posts.length == 0) {
        return <NotFoundMsg message="No posts found!" />
    }

    return (
        <div className={`page-blog ${cls || ''}`}>
            <div className="container">
                {(subheading || heading) && (
                    <div className="section-headings text-center" data-aos="fade-up" style={{ marginBottom: '40px' }}>
                        {subheading && 
                            <Subheading 
                                title={subheading}
                                cls="text-18"
                                aos="fade-up"
                            />
                        }
                        {heading && 
                            <Heading 
                                title={heading}
                                cls="text-40"
                                aos="fade-up"
                            />
                        }
                    </div>
                )}
                <div className="grid grid-cols-12 md:gap-1 product-grid">
                    {paginatedPosts.map((post) => {
                        const author: AuthorType | undefined = Authors.find((author: AuthorType) => author.id === post.authorId);
                        // Transform Post to ArticleType format
                        const article = {
                            id: post.id || parseInt(post._id?.substring(0, 8) || '0', 16) || 0,
                            title:
                                locale === 'ar'
                                    ? (post.titleAr && post.titleAr.trim()) || post.title
                                    : post.title,
                            slug: post.slug,
                            content: post.content,
                            excerpt: post.excerpt,
                            image: post.image,
                            video: post.video,
                            tags: post.tags || [],
                            comments: post.comments || 0,
                            authorId: post.authorId,
                            created_at: typeof post.created_at === 'string' ? post.created_at : post.created_at?.toISOString(),
                        };
                        return (                            
                            <div
                                className="col-span-12 md:col-span-6 lg:col-span-4"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                key={`article-${post._id || post.id}`}
                            >
                                <CardBlog 
                                    article={article}
                                    width={1000}
                                    height={707}
                                    alt="Article image"
                                    author={author}
                                    showDate={true}
                                    showCategory={showCategory}
                                    detailHrefBase={detailHrefBase}
                                />
                            </div>
                    )})}
                </div>
                
                {totalPages > 1 && (
                    <div style={{ marginTop: '60px' }}>
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlogGrid;