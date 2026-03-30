'use client';

import { useState, useMemo, useEffect } from 'react';
import '@/styles/project.css';
import CardProject from '../CardProject';
import Pagination from '../Pagination';
import NotFoundMsg from '../NotFoundMsg';
import { useLanguage } from '@/contexts/LanguageContext';
import { addLanguagePrefix } from '@/libs/language';
import { resolveServiceFields } from '@/libs/serviceLocale';
import type { Service } from '@/libs/models/service';
import { plainTextFromHtml } from '@/utils/plainText';
import type { ProjectType } from '@/types/project';

const ITEMS_PER_PAGE = 12;

export type ServiceListingSection = 'businesses' | 'capabilities';

type ServicesSectionListingProps = {
  section: ServiceListingSection;
  wrapperCls?: string;
  container?: string;
};

const emptyMessage = (section: ServiceListingSection, lang: 'en' | 'ar'): string => {
  if (section === 'capabilities') {
    return lang === 'ar' ? 'لا توجد قدرات حالياً.' : 'No capabilities found.';
  }
  return lang === 'ar' ? 'لا توجد أعمال متاحة.' : 'No businesses found.';
};

const ServicesSectionListing = ({
  section,
  wrapperCls = 'mt-100 mb-100',
  container = 'container-fluid',
}: ServicesSectionListingProps) => {
  const { language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/services?enabled=true&section=${section}`);
        const result = await res.json();
        if (result?.success) {
          setServices((result.data || []) as Service[]);
        } else {
          setServices([]);
        }
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [section]);

  const cards: ProjectType[] = useMemo(() => {
    return services.map((s) => {
      const r = resolveServiceFields(s, language);
      const name = r.detailTitle || r.title || '';
      const descRaw = r.description || '';
      const desc = plainTextFromHtml(descRaw);
      const slug = r.slug;
      const href = slug
        ? addLanguagePrefix(`/services/${slug}`, language)
        : addLanguagePrefix('/services', language);
      return {
        slug,
        title: name,
        description: desc,
        image: r.image,
        href,
      };
    });
  }, [services, language]);

  const totalPages = Math.ceil(cards.length / ITEMS_PER_PAGE) || 1;

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return cards.slice(start, start + ITEMS_PER_PAGE);
  }, [cards, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className={`page-projects ${wrapperCls}`}><div className={container} /></div>;
  }

  if (cards.length === 0) {
    return (
      <div className={`page-projects ${wrapperCls}`}>
        <div className={container}>
          <NotFoundMsg message={emptyMessage(section, language)} />
        </div>
      </div>
    );
  }

  return (
    <div className={`page-projects ${wrapperCls}`}>
      <div className={container}>
        <div className="grid grid-cols-12 sm:gap-1 product-grid">
          {paginated.map((project, index) => (
            <div
              className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"
              data-aos="fade-up"
              data-aos-delay={`${(index % ITEMS_PER_PAGE) + 1}00`}
              key={`${section}-${project.slug || index}`}
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
  );
};

export default ServicesSectionListing;
