'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Get language from current pathname
    const lang = getLanguageFromPath(pathname);
    setLanguageState(lang);
    // Update HTML attributes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [pathname]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Switch the current path to the new language
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
