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
  const pathname = usePathname();
  const router = useRouter();

  // Fallback: when a page doesn't wrap with LanguageProvider (e.g. some routes),
  // still allow components to resolve `language` safely from the URL.
  const fallbackLanguage = getLanguageFromPath(pathname);

  if (context === undefined) {
    const setLanguage = (lang: Language) => {
      const newPath = switchLanguage(pathname, lang);
      router.push(newPath);
    };

    const toggleLanguage = () => {
      const newLang: Language = fallbackLanguage === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    };

    return { language: fallbackLanguage, setLanguage, toggleLanguage };
  }

  return context;
}
