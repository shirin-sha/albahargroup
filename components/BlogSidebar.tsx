'use client';

import { useEffect, useState } from "react";
import Icons from "./Icons";
import SidebarSearch from "./SidebarSearch";
import RecentPost from "./RecentPost";
import SidebarTags from "./SidebarTags";
import DrawerOpener from "./DrawerOpener";

interface BlogSidebarType {
    slug?: string;
}

const BlogSidebar = ({ slug }: BlogSidebarType) => {
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                // Tags (from posts)
                const postRes = await fetch('/api/posts?enabled=true');
                const postJson = await postRes.json();
                if (postJson?.success && Array.isArray(postJson.data)) {
                    const allTags = postJson.data.flatMap((p: any) => p.tags || []);
                    setTags(Array.from(new Set(allTags)));
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        load();
    }, []);

    return(
        <div className="sidebar-filter drawer-blog-sidebar">
            <div className="drawer-headings lg:!hidden" data-aos="fade-up">
                <div className="heading text-24">Filter</div>
                <DrawerOpener
                    cls="svg-wrapper menu-close"
                    data-drawer=".drawer-blog-sidebar"
                >
                    <Icons.CloseCircle />
                </DrawerOpener>
            </div>
            <aside className="blog-sidebar">
                <SidebarSearch 
                    id="blog-search-input"
                    title="Search Here"
                    label="Search blog"
                    placeholder="Search blog"
                    name="search"
                />

                <RecentPost
                    title="Recent Post" 
                    slug={slug}
                />

                {tags.length > 0 &&
                    <SidebarTags
                        title="Tags" 
                        tags={tags}
                        rootUrl="/news/tags"
                    />
                }
            </aside>
        </div>
    )
}

export default BlogSidebar;