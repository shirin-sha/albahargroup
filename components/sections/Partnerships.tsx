'use client';

import "@/styles/partnerships.css";
import { SectionProps } from "@/types/sectionProps";
import Subheading from "../Subheading";
import Heading from "../Heading";
import Text from "../Text";
import Image from "next/image";
import { useMemo, useState } from "react";

const DEFAULT_PARTNERSHIP_CATEGORIES = [
    "Consumer Goods",
    "Consumer Electronics",
    "Home Automation",
    "Enterprise Technology",
    "Shipping, Travel & Tourism",
];

/** Display labels for Arabic locale; filter state stays on English CMS category keys. */
const PARTNERSHIP_CATEGORY_LABEL_AR: Record<string, string> = {
    All: "الكل",
    "Consumer Goods": "السلع الاستهلاكية",
    "Consumer Electronics": "الإلكترونيات الاستهلاكية",
    "Home Automation": "الأتمتة المنزلية",
    "Enterprise Technology": "تقنيات المؤسسات",
    "Shipping, Travel & Tourism": "الشحن والسفر والسياحة",
};

const Partnerships = ({
    data,
    lang = "en",
}: {
    data: SectionProps;
    lang?: "en" | "ar";
}) => {
    const {
        wrapperCls,
        container,
        subheading,
        heading,
        text,
        imageList
    } = data || {};

    const categories = useMemo(() => {
        const unique = new Set<string>(DEFAULT_PARTNERSHIP_CATEGORIES);
        (imageList || []).forEach((partner) => {
            if (partner.category && partner.category.trim()) unique.add(partner.category.trim());
        });
        return ["All", ...Array.from(unique)];
    }, [imageList]);

    const [activeCategory, setActiveCategory] = useState<string>("All");
    const filteredPartners = useMemo(() => {
        if (activeCategory === "All") return imageList || [];
        return (imageList || []).filter((partner) => (partner.category || "") === activeCategory);
    }, [activeCategory, imageList]);

    const categoryTabLabel = (category: string) =>
        lang === "ar" ? PARTNERSHIP_CATEGORY_LABEL_AR[category] ?? category : category;

    return (
        <div className={wrapperCls}>
            <div className={container ? container : 'container'}>
                <div className="partnerships-content">
                    {/* Header Section */}
                    <div className="partnerships-header section-headings text-center" data-aos="fade-up">
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
                                aosDelay="50"
                            />
                        }

                        {text && 
                            <div className="partnerships-intro mt-30">
                                <Text 
                                    text={text}
                                    cls="text-16"
                                    aos="fade-up"
                                />
                            </div>
                        }
                    </div>

                    {categories.length > 1 && (
                        <div className="partnerships-categories" data-aos="fade-up">
                            {categories.map((category) => {
                                const isActive = category === activeCategory;
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        className={`partnership-category-btn ${isActive ? "active" : ""}`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {categoryTabLabel(category)}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Partners Grid */}
                    {filteredPartners && filteredPartners.length > 0 && (
                        <div className="partners-grid mt-60">
                            {filteredPartners.map((partner, index) => (
                                <div 
                                    key={`partner-${index}`}
                                    className="partner-card"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 50}
                                >
                                    <div className="partner-logo-wrapper">
                                        <Image
                                            src={partner.src}
                                            width={200}
                                            height={120}
                                            alt={partner.alt || `Partner ${index + 1}`}
                                            loading={partner.loading || "lazy"}
                                            className="partner-logo"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Partnerships;


