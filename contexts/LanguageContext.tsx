'use client';

import { createContext, useContext, useEffect, ReactNode, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language, getLanguageFromPath, switchLanguage } from '@/libs/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  /** Must match URL on the first render (no default "en" + useEffect lag), or client components resolve wrong locale before paint. */
  const language = useMemo(() => getLanguageFromPath(pathname), [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    const newPath = switchLanguage(pathname, lang);
    router.push(newPath);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
