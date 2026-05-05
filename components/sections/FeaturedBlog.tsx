'use client';

import { useEffect, useState } from 'react';
import "@/styles/blog.css";
import "@/styles/featured-blog.css";
import { SectionProps } from "@/types/sectionProps";
import CardBlog from "../CardBlog";
import { Post } from '@/libs/models/post';

import Subheading from "../Subheading";
import Heading from "../Heading";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";


const FeaturedBlog = ({
    data,
    locale = 'en',
}: {
    data: SectionProps;
    locale?: 'en' | 'ar';
}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts?enabled=true');
                const result = await res.json();
                if (result?.success) {
                    setPosts(result.data || []);
                } else {
                    setPosts([]);
                }
            } catch {
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return null;
    if(posts.length == 0) return null;

    const {
        wrapperCls,
        container,
        subheading,
        heading,
        button,
    } = data || {};
    const detailHrefBase = locale === 'ar' ? '/ar/news' : '/news';
    const localizedButtonHref =
        button?.href === '/news' ? detailHrefBase : button?.href || detailHrefBase;

    return (
        <div className={`featured-blog ${wrapperCls}`}>
            <div className={container}>
                <div className="section-headings text-center">
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

                <div className="section-content">
                    <div className="grid grid-cols-12 md:gap-1 product-grid justify-center">
                        {posts.slice(0, 3).map((post) => {
                            const article = {
                                id: post.id || parseInt(post._id?.substring(0, 8) || '0', 16) || 0,
                                title:
                                    locale === 'ar'
                                        ? (post.titleAr && post.titleAr.trim()) || post.title
                                        : post.title,
                                slug: post.slug,
                                content:
                                    locale === 'ar'
                                        ? (post.contentAr && post.contentAr.trim()) || post.content
                                        : post.content,
                                excerpt:
                                    locale === 'ar'
                                        ? (post.excerptAr && post.excerptAr.trim()) || post.excerpt
                                        : post.excerpt,
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
                                key={`article-${post._id || post.id}`}
                            >
                                <CardBlog 
                                    article={article}
                                    width={1000}
                                    height={707}
                                    alt="Article image"
                                    showDate={true}
                                    showCategory={false}
                                    detailHrefBase={detailHrefBase}
                                />
                            </div>
                        )})}
                    </div>

                    {button &&
                        <div className="buttons buttons-discover" data-aos="fade-up">
                            {button.type == 'primary' &&
                                <PrimaryButton 
                                    label={button.label}
                                    href={localizedButtonHref}
                                    ariaLabel={button.label}
                                />
                            }

                            {button.type == 'secondary' &&
                                <SecondaryButton 
                                    label={button.label}
                                    href={localizedButtonHref}
                                    ariaLabel={button.label}
                                />
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default FeaturedBlog;