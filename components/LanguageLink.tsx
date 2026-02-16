'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { addLanguagePrefix } from '@/libs/language';
import { ReactNode } from 'react';

interface LanguageLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  [key: string]: any; // Allow other Link props
}

/**
 * A Link component that automatically adds language prefix to href
 */
export default function LanguageLink({ href, children, className, ariaLabel, ...props }: LanguageLinkProps) {
  const { language } = useLanguage();
  
  // Skip language prefix for external links, hash links, or admin links
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const isHash = href.startsWith('#');
  const isAdmin = href.startsWith('/admin');
  
  const finalHref = (isExternal || isHash || isAdmin) 
    ? href 
    : addLanguagePrefix(href, language);

  return (
    <Link 
      href={finalHref} 
      className={className}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Link>
  );
}
